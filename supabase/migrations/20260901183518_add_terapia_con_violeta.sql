-- Módulo aislado de agenda para Terapia con Violeta.
-- No modifica las tablas ni las políticas de los otros clientes.

insert into public.clientes (nombre, slug, activo)
values ('Terapia con Violeta', 'terapia-con-violeta', true)
on conflict (slug) do update
set nombre = excluded.nombre,
    activo = excluded.activo;

create table public.terapia_configuracion (
  cliente_id uuid primary key references public.clientes(id) on delete cascade,
  nombre text not null default 'Terapia con Violeta',
  direccion text not null default 'San Juan Aquiahuac, San Andrés Cholula, Puebla',
  zona_horaria text not null default 'America/Mexico_City',
  duracion_minutos integer not null default 60 check (duracion_minutos = 60),
  updated_at timestamptz not null default now()
);

insert into public.terapia_configuracion (cliente_id)
select id
from public.clientes
where slug = 'terapia-con-violeta'
on conflict (cliente_id) do nothing;

create table public.terapia_disponibilidad (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references public.clientes(id) on delete cascade,
  inicio timestamptz not null,
  fin timestamptz not null,
  modalidad text not null default 'ambas'
    check (modalidad in ('presencial', 'virtual', 'ambas')),
  estado text not null default 'disponible'
    check (estado in ('disponible', 'bloqueado')),
  notas text,
  created_at timestamptz not null default now(),
  check (fin = inicio + interval '1 hour'),
  unique (cliente_id, inicio)
);

create table public.terapia_citas (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references public.clientes(id) on delete cascade,
  disponibilidad_id uuid references public.terapia_disponibilidad(id) on delete set null,
  paciente_nombre text not null check (char_length(paciente_nombre) between 2 and 120),
  paciente_telefono text not null check (char_length(paciente_telefono) between 8 and 30),
  paciente_email text check (paciente_email is null or char_length(paciente_email) <= 160),
  motivo_consulta text check (motivo_consulta is null or char_length(motivo_consulta) <= 1000),
  inicio timestamptz not null,
  fin timestamptz not null,
  modalidad text not null check (modalidad in ('presencial', 'virtual')),
  servicio text not null check (char_length(servicio) between 2 and 120),
  estado text not null default 'pendiente'
    check (estado in ('pendiente', 'confirmada', 'cancelada', 'completada', 'no_asistio')),
  pago_estado text not null default 'pendiente'
    check (pago_estado in ('pendiente', 'pagado', 'cortesia')),
  enlace_videollamada text,
  notas_internas text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (fin = inicio + interval '1 hour')
);

create unique index terapia_citas_horario_activo_key
  on public.terapia_citas (disponibilidad_id)
  where disponibilidad_id is not null
    and estado in ('pendiente', 'confirmada');

create index terapia_disponibilidad_inicio_idx
  on public.terapia_disponibilidad (cliente_id, inicio);

create index terapia_citas_inicio_idx
  on public.terapia_citas (cliente_id, inicio);

create trigger terapia_citas_set_updated_at
before update on public.terapia_citas
for each row execute function public.set_updated_at();

alter table public.terapia_configuracion enable row level security;
alter table public.terapia_disponibilidad enable row level security;
alter table public.terapia_citas enable row level security;

create policy "miembro_administra_configuracion_terapia"
  on public.terapia_configuracion for all
  to authenticated
  using ((select public.es_miembro_cliente(cliente_id)))
  with check ((select public.es_miembro_cliente(cliente_id)));

create policy "miembro_ve_disponibilidad_terapia"
  on public.terapia_disponibilidad for select
  to authenticated
  using ((select public.es_miembro_cliente(cliente_id)));

create policy "miembro_crea_disponibilidad_terapia"
  on public.terapia_disponibilidad for insert
  to authenticated
  with check ((select public.es_miembro_cliente(cliente_id)));

create policy "miembro_modifica_disponibilidad_terapia"
  on public.terapia_disponibilidad for update
  to authenticated
  using ((select public.es_miembro_cliente(cliente_id)))
  with check ((select public.es_miembro_cliente(cliente_id)));

create policy "miembro_elimina_disponibilidad_terapia"
  on public.terapia_disponibilidad for delete
  to authenticated
  using ((select public.es_miembro_cliente(cliente_id)));

create policy "miembro_ve_citas_terapia"
  on public.terapia_citas for select
  to authenticated
  using ((select public.es_miembro_cliente(cliente_id)));

create policy "miembro_crea_citas_terapia"
  on public.terapia_citas for insert
  to authenticated
  with check ((select public.es_miembro_cliente(cliente_id)));

create policy "miembro_modifica_citas_terapia"
  on public.terapia_citas for update
  to authenticated
  using ((select public.es_miembro_cliente(cliente_id)))
  with check ((select public.es_miembro_cliente(cliente_id)));

create policy "miembro_elimina_citas_terapia"
  on public.terapia_citas for delete
  to authenticated
  using ((select public.es_miembro_cliente(cliente_id)));

create or replace function public.horarios_disponibles_terapia(
  p_modalidad text default null,
  p_desde timestamptz default now(),
  p_hasta timestamptz default (now() + interval '60 days')
)
returns table (
  disponibilidad_id uuid,
  inicio timestamptz,
  fin timestamptz,
  modalidad text
)
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select d.id, d.inicio, d.fin, d.modalidad
  from public.terapia_disponibilidad d
  join public.clientes cl on cl.id = d.cliente_id
  where cl.slug = 'terapia-con-violeta'
    and cl.activo = true
    and d.estado = 'disponible'
    and d.inicio >= greatest(p_desde, now())
    and d.inicio < p_hasta
    and (
      p_modalidad is null
      or d.modalidad = 'ambas'
      or d.modalidad = p_modalidad
    )
    and not exists (
      select 1
      from public.terapia_citas c
      where c.disponibilidad_id = d.id
        and c.estado in ('pendiente', 'confirmada')
    )
  order by d.inicio;
$$;

revoke all on function public.horarios_disponibles_terapia(text, timestamptz, timestamptz) from public;
grant execute on function public.horarios_disponibles_terapia(text, timestamptz, timestamptz) to anon, authenticated;

create or replace function public.solicitar_cita_terapia(
  p_disponibilidad_id uuid,
  p_nombre text,
  p_telefono text,
  p_email text,
  p_modalidad text,
  p_servicio text,
  p_motivo text default null
)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_cliente_id uuid;
  v_inicio timestamptz;
  v_fin timestamptz;
  v_modalidad_slot text;
  v_cita_id uuid;
begin
  if p_modalidad not in ('presencial', 'virtual') then
    raise exception 'Modalidad no válida';
  end if;

  if length(trim(coalesce(p_nombre, ''))) not between 2 and 120 then
    raise exception 'Nombre no válido';
  end if;

  if length(trim(coalesce(p_telefono, ''))) not between 8 and 30 then
    raise exception 'Teléfono no válido';
  end if;

  if length(trim(coalesce(p_servicio, ''))) not between 2 and 120 then
    raise exception 'Servicio no válido';
  end if;

  if p_email is not null and length(trim(p_email)) > 160 then
    raise exception 'Correo no válido';
  end if;

  if p_motivo is not null and length(p_motivo) > 1000 then
    raise exception 'El mensaje es demasiado largo';
  end if;

  select d.cliente_id, d.inicio, d.fin, d.modalidad
    into v_cliente_id, v_inicio, v_fin, v_modalidad_slot
  from public.terapia_disponibilidad d
  join public.clientes cl on cl.id = d.cliente_id
  where d.id = p_disponibilidad_id
    and cl.slug = 'terapia-con-violeta'
    and cl.activo = true
    and d.estado = 'disponible'
    and d.inicio > now()
  for update of d;

  if not found then
    raise exception 'El horario ya no está disponible';
  end if;

  if v_modalidad_slot <> 'ambas' and v_modalidad_slot <> p_modalidad then
    raise exception 'La modalidad no está disponible en ese horario';
  end if;

  insert into public.terapia_citas (
    cliente_id,
    disponibilidad_id,
    paciente_nombre,
    paciente_telefono,
    paciente_email,
    motivo_consulta,
    inicio,
    fin,
    modalidad,
    servicio,
    estado,
    pago_estado
  )
  values (
    v_cliente_id,
    p_disponibilidad_id,
    trim(p_nombre),
    trim(p_telefono),
    nullif(trim(coalesce(p_email, '')), ''),
    nullif(trim(coalesce(p_motivo, '')), ''),
    v_inicio,
    v_fin,
    p_modalidad,
    trim(p_servicio),
    'pendiente',
    'pendiente'
  )
  returning id into v_cita_id;

  return v_cita_id;
exception
  when unique_violation then
    raise exception 'El horario acaba de ser apartado por otra persona';
end;
$$;

revoke all on function public.solicitar_cita_terapia(uuid, text, text, text, text, text, text) from public;
grant execute on function public.solicitar_cita_terapia(uuid, text, text, text, text, text, text) to anon, authenticated;

grant select, insert, update, delete on public.terapia_configuracion to authenticated;
grant select, insert, update, delete on public.terapia_disponibilidad to authenticated;
grant select, insert, update, delete on public.terapia_citas to authenticated;
