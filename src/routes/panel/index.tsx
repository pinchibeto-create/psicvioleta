import { createFileRoute } from "@tanstack/react-router";
import {
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ExternalLink,
  LayoutDashboard,
  Link2,
  ListFilter,
  Loader2,
  LockKeyhole,
  LogOut,
  MessageCircle,
  Pencil,
  Plus,
  Save,
  Search,
  Settings2,
  Video,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import {
  TERAPIA_SLUG,
  formatDateTime,
  formatDay,
  formatShortDay,
  formatTime,
  fromDateTimeLocal,
  localDateKey,
  toDateTimeLocal,
  toMexicoIso,
  whatsappConfirmationUrl,
  type Cita,
  type Disponibilidad,
  type EstadoCita,
  type EstadoPago,
  type Modalidad,
  type ModalidadSlot,
} from "@/lib/terapia";

export const Route = createFileRoute("/panel/")({
  head: () => ({
    meta: [
      { title: "Agenda — Terapia con Violeta" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Panel,
});

type Tab = "agenda" | "citas" | "disponibilidad" | "configuracion";
type Configuracion = {
  cliente_id: string;
  nombre: string;
  direccion: string;
  zona_horaria: string;
  duracion_minutos: number;
};

const tabs: { id: Tab; label: string; icon: ReactNode }[] = [
  { id: "agenda", label: "Agenda", icon: <LayoutDashboard className="size-4" /> },
  { id: "citas", label: "Citas", icon: <ListFilter className="size-4" /> },
  { id: "disponibilidad", label: "Disponibilidad", icon: <CalendarClock className="size-4" /> },
  { id: "configuracion", label: "Configuración", icon: <Settings2 className="size-4" /> },
];

function Panel() {
  const [tab, setTab] = useState<Tab>("agenda");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [clientId, setClientId] = useState("");
  const [citas, setCitas] = useState<Cita[]>([]);
  const [disponibilidad, setDisponibilidad] = useState<Disponibilidad[]>([]);
  const [config, setConfig] = useState<Configuracion | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    void loadPanel();
    // La carga inicial debe ejecutarse una sola vez; los refrescos posteriores son explícitos.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadPanel() {
    setLoading(true);
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      window.location.replace("/panel/login");
      return;
    }

    const { data: client, error: clientError } = await supabase
      .from("clientes")
      .select("id, nombre")
      .eq("slug", TERAPIA_SLUG)
      .maybeSingle();

    if (clientError || !client) {
      setAccessDenied(true);
      setLoading(false);
      return;
    }

    setClientId(client.id);
    await refreshData(client.id);
    setLoading(false);
  }

  async function refreshData(id = clientId) {
    if (!id) return;
    const [citasResult, disponibilidadResult, configResult] = await Promise.all([
      supabase
        .from("terapia_citas")
        .select("*")
        .eq("cliente_id", id)
        .order("inicio", { ascending: true }),
      supabase
        .from("terapia_disponibilidad")
        .select("*")
        .eq("cliente_id", id)
        .order("inicio", { ascending: true })
        .limit(300),
      supabase.from("terapia_configuracion").select("*").eq("cliente_id", id).maybeSingle(),
    ]);

    if (citasResult.error || disponibilidadResult.error || configResult.error) {
      setError("No pude cargar toda la agenda. Actualiza la página para intentarlo nuevamente.");
      return;
    }

    setCitas((citasResult.data ?? []) as Cita[]);
    setDisponibilidad((disponibilidadResult.data ?? []) as Disponibilidad[]);
    setConfig(configResult.data as Configuracion);
  }

  async function updateCita(id: string, changes: Partial<Cita>) {
    setSaving(true);
    setError("");
    const { data, error: updateError } = await supabase
      .from("terapia_citas")
      .update(changes)
      .eq("id", id)
      .select("*")
      .single();
    setSaving(false);

    if (updateError) {
      setError("No pude guardar los cambios de la cita.");
      return false;
    }

    setCitas((current) => current.map((cita) => (cita.id === id ? (data as Cita) : cita)));
    setNotice("Cambios guardados.");
    window.setTimeout(() => setNotice(""), 2500);
    return true;
  }

  async function signOut() {
    await supabase.auth.signOut();
    window.location.replace("/panel/login");
  }

  const pendingCount = citas.filter((cita) => cita.estado === "pendiente").length;

  if (loading) {
    return (
      <PanelCentered>
        <Loader2 className="size-7 animate-spin text-brand-deep" />
        <p>Cargando agenda…</p>
      </PanelCentered>
    );
  }

  if (accessDenied) {
    return (
      <PanelCentered>
        <LockKeyhole className="size-8 text-brand-deep" />
        <h1 className="font-serif text-2xl text-brand-deep">Esta cuenta aún no tiene acceso</h1>
        <p className="max-w-md text-center text-sm text-brand-deep/65">
          La cuenta inició sesión correctamente, pero falta asignarla a Terapia con Violeta.
        </p>
        <button
          onClick={signOut}
          className="rounded-full bg-brand-deep px-5 py-2.5 text-sm text-white"
        >
          Cerrar sesión
        </button>
      </PanelCentered>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream text-brand-deep">
      <header className="border-b border-brand-deep/10 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.2em] text-brand-deep/45">
              Panel privado
            </p>
            <h1 className="mt-1 font-serif text-xl">Terapia con Violeta</h1>
          </div>
          <div className="flex items-center gap-3">
            {pendingCount > 0 && (
              <span className="hidden rounded-full bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-800 sm:inline">
                {pendingCount} por confirmar
              </span>
            )}
            <button
              onClick={signOut}
              className="flex items-center gap-2 rounded-full border border-brand-deep/15 px-3 py-2 text-xs font-semibold hover:bg-brand-soft/40"
            >
              <LogOut className="size-4" /> <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </header>

      <nav className="sticky top-0 z-30 border-b border-brand-deep/10 bg-brand-cream/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto">
          {tabs.map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${tab === item.id ? "bg-brand-deep text-white" : "bg-white text-brand-deep hover:bg-brand-soft"}`}
            >
              {item.icon}
              {item.label}
              {item.id === "agenda" && pendingCount > 0 && (
                <span className="rounded-full bg-white/20 px-1.5">{pendingCount}</span>
              )}
            </button>
          ))}
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-10">
        {error && (
          <Notice tone="error" onClose={() => setError("")}>
            {error}
          </Notice>
        )}
        {notice && <Notice onClose={() => setNotice("")}>{notice}</Notice>}

        {tab === "agenda" && <Agenda citas={citas} saving={saving} onUpdate={updateCita} />}
        {tab === "citas" && <Citas citas={citas} saving={saving} onUpdate={updateCita} />}
        {tab === "disponibilidad" && (
          <DisponibilidadPanel
            clientId={clientId}
            slots={disponibilidad}
            citas={citas}
            onRefresh={() => refreshData()}
            onError={setError}
            onNotice={setNotice}
          />
        )}
        {tab === "configuracion" && config && (
          <ConfiguracionPanel
            config={config}
            onSaved={(updated) => {
              setConfig(updated);
              setNotice("Configuración guardada.");
            }}
            onError={setError}
          />
        )}
      </main>
    </div>
  );
}

function Agenda({ citas, saving, onUpdate }: AppointmentListProps) {
  const today = localDateKey(new Date());
  const todaysCitas = citas.filter(
    (cita) => localDateKey(cita.inicio) === today && cita.estado !== "cancelada",
  );
  const pending = citas.filter((cita) => cita.estado === "pendiente");
  const upcoming = citas
    .filter((cita) => new Date(cita.inicio) > new Date() && cita.estado === "confirmada")
    .slice(0, 5);

  return (
    <div className="space-y-10">
      <PageHeading
        eyebrow="Agenda del día"
        title={formatDay(new Date())}
        detail="Lo importante aparece primero: solicitudes pendientes y sesiones de hoy."
      />
      {pending.length > 0 && (
        <section>
          <SectionTitle title="Pendientes de confirmar" count={pending.length} />
          <div className="mt-4 grid gap-4 xl:grid-cols-2">
            {pending.map((cita) => (
              <AppointmentCard key={cita.id} cita={cita} saving={saving} onUpdate={onUpdate} />
            ))}
          </div>
        </section>
      )}
      <section>
        <SectionTitle title="Hoy" count={todaysCitas.length} />
        {todaysCitas.length ? (
          <div className="mt-4 grid gap-4 xl:grid-cols-2">
            {todaysCitas.map((cita) => (
              <AppointmentCard key={cita.id} cita={cita} saving={saving} onUpdate={onUpdate} />
            ))}
          </div>
        ) : (
          <Empty text="No hay citas para hoy." />
        )}
      </section>
      <section>
        <SectionTitle title="Próximas confirmadas" count={upcoming.length} />
        {upcoming.length ? (
          <div className="mt-4 grid gap-4 xl:grid-cols-2">
            {upcoming.map((cita) => (
              <AppointmentCard key={cita.id} cita={cita} saving={saving} onUpdate={onUpdate} />
            ))}
          </div>
        ) : (
          <Empty text="Aún no hay citas confirmadas próximas." />
        )}
      </section>
    </div>
  );
}

type AppointmentListProps = {
  citas: Cita[];
  saving: boolean;
  onUpdate: (id: string, changes: Partial<Cita>) => Promise<boolean>;
};

function Citas({ citas, saving, onUpdate }: AppointmentListProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"todas" | EstadoCita>("todas");
  const filtered = citas
    .filter((cita) => filter === "todas" || cita.estado === filter)
    .filter((cita) =>
      `${cita.paciente_nombre} ${cita.paciente_telefono} ${cita.paciente_email ?? ""}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    )
    .sort((a, b) => new Date(b.inicio).getTime() - new Date(a.inicio).getTime());

  return (
    <div>
      <PageHeading
        eyebrow="Historial y seguimiento"
        title="Todas las citas"
        detail="Busca por nombre, teléfono o correo y modifica la información administrativa."
      />
      <div className="mt-7 grid gap-3 rounded-2xl border border-brand-deep/10 bg-white p-4 sm:grid-cols-[1fr_auto]">
        <label className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-brand-deep/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="panel-input pl-9"
            placeholder="Buscar paciente…"
          />
        </label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as typeof filter)}
          className="panel-input sm:w-48"
        >
          <option value="todas">Todos los estados</option>
          <option value="pendiente">Pendientes</option>
          <option value="confirmada">Confirmadas</option>
          <option value="completada">Realizadas</option>
          <option value="cancelada">Canceladas</option>
          <option value="no_asistio">No asistió</option>
        </select>
      </div>
      {filtered.length ? (
        <div className="mt-5 grid gap-4 xl:grid-cols-2">
          {filtered.map((cita) => (
            <AppointmentCard key={cita.id} cita={cita} saving={saving} onUpdate={onUpdate} />
          ))}
        </div>
      ) : (
        <Empty text="No encontré citas con esos filtros." />
      )}
    </div>
  );
}

function AppointmentCard({
  cita,
  saving,
  onUpdate,
}: {
  cita: Cita;
  saving: boolean;
  onUpdate: AppointmentListProps["onUpdate"];
}) {
  const [editing, setEditing] = useState(false);
  const [localError, setLocalError] = useState("");
  const [draft, setDraft] = useState({
    paciente_nombre: cita.paciente_nombre,
    paciente_telefono: cita.paciente_telefono,
    paciente_email: cita.paciente_email ?? "",
    inicio: toDateTimeLocal(cita.inicio),
    modalidad: cita.modalidad,
    servicio: cita.servicio,
    estado: cita.estado,
    pago_estado: cita.pago_estado,
    enlace_videollamada: cita.enlace_videollamada ?? "",
    notas_internas: cita.notas_internas ?? "",
  });

  useEffect(() => {
    setDraft({
      paciente_nombre: cita.paciente_nombre,
      paciente_telefono: cita.paciente_telefono,
      paciente_email: cita.paciente_email ?? "",
      inicio: toDateTimeLocal(cita.inicio),
      modalidad: cita.modalidad,
      servicio: cita.servicio,
      estado: cita.estado,
      pago_estado: cita.pago_estado,
      enlace_videollamada: cita.enlace_videollamada ?? "",
      notas_internas: cita.notas_internas ?? "",
    });
  }, [cita]);

  async function saveChanges() {
    setLocalError("");
    const newStart = fromDateTimeLocal(draft.inicio);
    const newEnd = new Date(new Date(newStart).getTime() + 60 * 60 * 1000).toISOString();
    const timeChanged = newStart !== cita.inicio;

    if (timeChanged && ["pendiente", "confirmada"].includes(draft.estado)) {
      const { data: conflicts } = await supabase
        .from("terapia_citas")
        .select("id")
        .eq("cliente_id", cita.cliente_id)
        .in("estado", ["pendiente", "confirmada"])
        .neq("id", cita.id)
        .lt("inicio", newEnd)
        .gt("fin", newStart)
        .limit(1);
      if (conflicts?.length) {
        setLocalError("Ya existe otra cita activa en ese horario.");
        return;
      }
    }

    const ok = await onUpdate(cita.id, {
      paciente_nombre: draft.paciente_nombre.trim(),
      paciente_telefono: draft.paciente_telefono.trim(),
      paciente_email: draft.paciente_email.trim() || null,
      inicio: newStart,
      fin: newEnd,
      disponibilidad_id: timeChanged ? null : cita.disponibilidad_id,
      modalidad: draft.modalidad,
      servicio: draft.servicio,
      estado: draft.estado,
      pago_estado: draft.pago_estado,
      enlace_videollamada: draft.enlace_videollamada.trim() || null,
      notas_internas: draft.notas_internas.trim() || null,
    });
    if (ok) setEditing(false);
  }

  async function confirmByWhatsApp() {
    const popup = window.open("about:blank", "_blank");
    const confirmed = { ...cita, estado: "confirmada" as const };
    const ok = await onUpdate(cita.id, { estado: "confirmada" });
    if (!ok) {
      popup?.close();
      return;
    }
    const url = whatsappConfirmationUrl(confirmed);
    if (popup) popup.location.replace(url);
    else window.location.assign(url);
  }

  return (
    <article className="rounded-3xl border border-brand-deep/10 bg-white p-5 shadow-sm shadow-brand-deep/5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-brand-deep/50">
            {formatShortDay(cita.inicio)} · {formatTime(cita.inicio)}
          </p>
          <h3 className="mt-1 font-serif text-xl text-brand-deep">{cita.paciente_nombre}</h3>
          <p className="mt-1 text-sm text-brand-deep/65">{cita.servicio}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusBadge status={cita.estado} />
          <PaymentBadge status={cita.pago_estado} />
        </div>
      </div>

      {!editing ? (
        <>
          <div className="mt-5 grid gap-2 text-sm text-brand-deep/70 sm:grid-cols-2">
            <p className="capitalize">
              {cita.modalidad === "virtual" ? "Videollamada" : "Presencial"}
            </p>
            <p>{cita.paciente_telefono}</p>
            {cita.paciente_email && <p className="sm:col-span-2">{cita.paciente_email}</p>}
            {cita.modalidad === "virtual" && cita.enlace_videollamada && (
              <a
                href={cita.enlace_videollamada}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 font-semibold text-brand-sage sm:col-span-2"
              >
                <Video className="size-4" /> Abrir videollamada <ExternalLink className="size-3" />
              </a>
            )}
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              onClick={confirmByWhatsApp}
              className="flex items-center gap-2 rounded-full bg-whatsapp px-4 py-2.5 text-xs font-bold text-white"
            >
              <MessageCircle className="size-4" /> Confirmar por WhatsApp
            </button>
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 rounded-full border border-brand-deep/15 px-4 py-2.5 text-xs font-bold text-brand-deep"
            >
              <Pencil className="size-4" /> Modificar
            </button>
          </div>
        </>
      ) : (
        <div className="mt-5 space-y-4 border-t border-brand-deep/10 pt-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <EditField label="Nombre">
              <input
                className="panel-input"
                value={draft.paciente_nombre}
                onChange={(e) => setDraft({ ...draft, paciente_nombre: e.target.value })}
              />
            </EditField>
            <EditField label="WhatsApp">
              <input
                className="panel-input"
                value={draft.paciente_telefono}
                onChange={(e) => setDraft({ ...draft, paciente_telefono: e.target.value })}
              />
            </EditField>
            <EditField label="Correo">
              <input
                type="email"
                className="panel-input"
                value={draft.paciente_email}
                onChange={(e) => setDraft({ ...draft, paciente_email: e.target.value })}
              />
            </EditField>
            <EditField label="Fecha y hora">
              <input
                type="datetime-local"
                className="panel-input"
                value={draft.inicio}
                onChange={(e) => setDraft({ ...draft, inicio: e.target.value })}
              />
            </EditField>
            <EditField label="Modalidad">
              <select
                className="panel-input"
                value={draft.modalidad}
                onChange={(e) => setDraft({ ...draft, modalidad: e.target.value as Modalidad })}
              >
                <option value="presencial">Presencial</option>
                <option value="virtual">Virtual</option>
              </select>
            </EditField>
            <EditField label="Servicio">
              <input
                className="panel-input"
                value={draft.servicio}
                onChange={(e) => setDraft({ ...draft, servicio: e.target.value })}
              />
            </EditField>
            <EditField label="Estado">
              <select
                className="panel-input"
                value={draft.estado}
                onChange={(e) => setDraft({ ...draft, estado: e.target.value as EstadoCita })}
              >
                <option value="pendiente">Pendiente</option>
                <option value="confirmada">Confirmada</option>
                <option value="completada">Realizada</option>
                <option value="cancelada">Cancelada</option>
                <option value="no_asistio">No asistió</option>
              </select>
            </EditField>
            <EditField label="Pago (solo Violeta)">
              <select
                className="panel-input"
                value={draft.pago_estado}
                onChange={(e) => setDraft({ ...draft, pago_estado: e.target.value as EstadoPago })}
              >
                <option value="pendiente">Pendiente</option>
                <option value="pagado">Pagado</option>
                <option value="cortesia">Cortesía</option>
              </select>
            </EditField>
            <EditField label="Enlace de videollamada" full>
              <div className="relative">
                <Link2 className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-brand-deep/35" />
                <input
                  type="url"
                  className="panel-input pl-9"
                  value={draft.enlace_videollamada}
                  onChange={(e) => setDraft({ ...draft, enlace_videollamada: e.target.value })}
                  placeholder="https://meet.google.com/…"
                />
              </div>
            </EditField>
            <EditField label="Notas internas (solo Violeta)" full>
              <textarea
                className="panel-input min-h-20 resize-y"
                value={draft.notas_internas}
                onChange={(e) => setDraft({ ...draft, notas_internas: e.target.value })}
              />
            </EditField>
          </div>
          {localError && <p className="text-sm text-destructive">{localError}</p>}
          <div className="flex flex-wrap gap-2">
            <button
              disabled={saving}
              onClick={saveChanges}
              className="flex items-center gap-2 rounded-full bg-brand-deep px-4 py-2.5 text-xs font-bold text-white disabled:opacity-50"
            >
              {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}{" "}
              Guardar
            </button>
            <button
              onClick={() => setEditing(false)}
              className="flex items-center gap-2 rounded-full border border-brand-deep/15 px-4 py-2.5 text-xs font-bold"
            >
              <X className="size-4" /> Cerrar
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

function DisponibilidadPanel({
  clientId,
  slots,
  citas,
  onRefresh,
  onError,
  onNotice,
}: {
  clientId: string;
  slots: Disponibilidad[];
  citas: Cita[];
  onRefresh: () => Promise<void>;
  onError: (text: string) => void;
  onNotice: (text: string) => void;
}) {
  const [creating, setCreating] = useState(false);
  const activeAppointmentSlots = new Set(
    citas
      .filter((cita) => ["pendiente", "confirmada"].includes(cita.estado))
      .map((cita) => cita.disponibilidad_id),
  );
  const upcomingSlots = slots.filter((slot) => new Date(slot.inicio) > new Date()).slice(0, 120);

  async function createSlots(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const date = String(values.get("date") ?? "");
    const start = String(values.get("start") ?? "");
    const end = String(values.get("end") ?? "");
    const modalidad = String(values.get("modalidad") ?? "ambas") as ModalidadSlot;
    const first = new Date(toMexicoIso(date, start));
    const limit = new Date(toMexicoIso(date, end));

    if (
      !date ||
      !start ||
      !end ||
      limit <= first ||
      (limit.getTime() - first.getTime()) % 3600000 !== 0
    ) {
      onError("El rango debe dividirse en sesiones completas de una hora.");
      return;
    }

    const records = [];
    for (let cursor = first.getTime(); cursor < limit.getTime(); cursor += 3600000) {
      records.push({
        cliente_id: clientId,
        inicio: new Date(cursor).toISOString(),
        fin: new Date(cursor + 3600000).toISOString(),
        modalidad,
        estado: "disponible",
      });
    }

    setCreating(true);
    const { error } = await supabase.from("terapia_disponibilidad").insert(records);
    setCreating(false);
    if (error) {
      onError(
        error.code === "23505"
          ? "Uno o más horarios ya existían para esa fecha."
          : "No pude crear los horarios.",
      );
      return;
    }
    onNotice(
      `${records.length} horario${records.length === 1 ? "" : "s"} creado${records.length === 1 ? "" : "s"}.`,
    );
    await onRefresh();
  }

  async function toggleSlot(slot: Disponibilidad) {
    const next = slot.estado === "disponible" ? "bloqueado" : "disponible";
    const { error } = await supabase
      .from("terapia_disponibilidad")
      .update({ estado: next })
      .eq("id", slot.id);
    if (error) {
      onError("No pude cambiar ese horario.");
      return;
    }
    onNotice(next === "bloqueado" ? "Horario bloqueado." : "Horario habilitado.");
    await onRefresh();
  }

  return (
    <div>
      <PageHeading
        eyebrow="Horarios públicos"
        title="Disponibilidad"
        detail="Publica bloques completos de una hora o bloquea fechas concretas."
      />
      <form
        onSubmit={createSlots}
        className="mt-7 grid gap-4 rounded-3xl border border-brand-deep/10 bg-white p-5 md:grid-cols-5 md:p-6"
      >
        <EditField label="Fecha">
          <input
            required
            name="date"
            type="date"
            min={localDateKey(new Date())}
            className="panel-input"
          />
        </EditField>
        <EditField label="Desde">
          <input
            required
            name="start"
            type="time"
            step="3600"
            defaultValue="10:00"
            className="panel-input"
          />
        </EditField>
        <EditField label="Hasta">
          <input
            required
            name="end"
            type="time"
            step="3600"
            defaultValue="19:00"
            className="panel-input"
          />
        </EditField>
        <EditField label="Modalidad">
          <select name="modalidad" className="panel-input">
            <option value="ambas">Ambas</option>
            <option value="presencial">Presencial</option>
            <option value="virtual">Virtual</option>
          </select>
        </EditField>
        <button
          disabled={creating}
          className="mt-auto flex h-[46px] items-center justify-center gap-2 rounded-xl bg-brand-deep px-4 text-xs font-bold text-white disabled:opacity-50"
        >
          {creating ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}{" "}
          Crear horarios
        </button>
        <p className="text-xs text-brand-deep/55 md:col-span-5">
          Ejemplo: de 10:00 a 13:00 crea tres espacios: 10:00, 11:00 y 12:00.
        </p>
      </form>

      <section className="mt-9">
        <SectionTitle title="Próximos horarios" count={upcomingSlots.length} />
        {upcomingSlots.length ? (
          <div className="mt-4 overflow-hidden rounded-2xl border border-brand-deep/10 bg-white">
            {upcomingSlots.map((slot) => {
              const booked = activeAppointmentSlots.has(slot.id);
              return (
                <div
                  key={slot.id}
                  className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-deep/8 px-4 py-4 last:border-b-0"
                >
                  <div>
                    <p className="text-sm font-semibold">
                      {formatShortDay(slot.inicio)} · {formatTime(slot.inicio)}
                    </p>
                    <p className="mt-1 text-xs capitalize text-brand-deep/55">
                      {slot.modalidad} · {booked ? "Apartado" : slot.estado}
                    </p>
                  </div>
                  <button
                    disabled={booked}
                    onClick={() => toggleSlot(slot)}
                    className="rounded-full border border-brand-deep/15 px-3 py-2 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {slot.estado === "disponible" ? "Bloquear" : "Habilitar"}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <Empty text="No hay horarios futuros. Crea el primer bloque arriba." />
        )}
      </section>
    </div>
  );
}

function ConfiguracionPanel({
  config,
  onSaved,
  onError,
}: {
  config: Configuracion;
  onSaved: (config: Configuracion) => void;
  onError: (text: string) => void;
}) {
  const [draft, setDraft] = useState(config);
  const [saving, setSaving] = useState(false);

  async function save(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    const { data, error } = await supabase
      .from("terapia_configuracion")
      .update({
        nombre: draft.nombre,
        direccion: draft.direccion,
        updated_at: new Date().toISOString(),
      })
      .eq("cliente_id", draft.cliente_id)
      .select("*")
      .single();
    setSaving(false);
    if (error) {
      onError("No pude guardar la configuración.");
      return;
    }
    onSaved(data as Configuracion);
  }

  return (
    <div>
      <PageHeading
        eyebrow="Datos generales"
        title="Configuración"
        detail="La duración está fijada en una hora. Más adelante podremos automatizar Google Meet o Zoom."
      />
      <form
        onSubmit={save}
        className="mt-7 max-w-2xl space-y-5 rounded-3xl border border-brand-deep/10 bg-white p-6"
      >
        <EditField label="Nombre del servicio">
          <input
            className="panel-input"
            value={draft.nombre}
            onChange={(e) => setDraft({ ...draft, nombre: e.target.value })}
          />
        </EditField>
        <EditField label="Dirección presencial">
          <textarea
            className="panel-input min-h-20"
            value={draft.direccion}
            onChange={(e) => setDraft({ ...draft, direccion: e.target.value })}
          />
        </EditField>
        <EditField label="Zona horaria">
          <input className="panel-input bg-brand-soft/25" value={draft.zona_horaria} disabled />
        </EditField>
        <EditField label="Duración de cada cita">
          <input
            className="panel-input bg-brand-soft/25"
            value={`${draft.duracion_minutos} minutos`}
            disabled
          />
        </EditField>
        <button
          disabled={saving}
          className="flex items-center gap-2 rounded-full bg-brand-deep px-5 py-3 text-xs font-bold text-white disabled:opacity-50"
        >
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}{" "}
          Guardar configuración
        </button>
      </form>
    </div>
  );
}

function StatusBadge({ status }: { status: EstadoCita }) {
  const labels: Record<EstadoCita, string> = {
    pendiente: "Pendiente",
    confirmada: "Confirmada",
    cancelada: "Cancelada",
    completada: "Realizada",
    no_asistio: "No asistió",
  };
  const colors: Record<EstadoCita, string> = {
    pendiente: "bg-amber-100 text-amber-800",
    confirmada: "bg-emerald-100 text-emerald-800",
    cancelada: "bg-red-100 text-red-700",
    completada: "bg-blue-100 text-blue-700",
    no_asistio: "bg-slate-200 text-slate-700",
  };
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${colors[status]}`}
    >
      {labels[status]}
    </span>
  );
}

function PaymentBadge({ status }: { status: EstadoPago }) {
  const labels: Record<EstadoPago, string> = {
    pendiente: "Pago pendiente",
    pagado: "Pagado",
    cortesia: "Cortesía",
  };
  return (
    <span className="rounded-full bg-brand-soft/55 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-brand-deep">
      {labels[status]}
    </span>
  );
}

function PageHeading({
  eyebrow,
  title,
  detail,
}: {
  eyebrow: string;
  title: string;
  detail: string;
}) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[.2em] text-brand-deep/45">
        {eyebrow}
      </p>
      <h2 className="mt-2 font-serif text-3xl text-brand-deep md:text-4xl">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-brand-deep/65">{detail}</p>
    </div>
  );
}

function SectionTitle({ title, count }: { title: string; count: number }) {
  return (
    <div className="flex items-center gap-3">
      <h2 className="font-serif text-xl text-brand-deep">{title}</h2>
      <span className="rounded-full bg-brand-soft px-2.5 py-1 text-xs font-bold">{count}</span>
    </div>
  );
}

function EditField({
  label,
  children,
  full,
}: {
  label: string;
  children: ReactNode;
  full?: boolean;
}) {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-brand-deep/50">
        {label}
      </span>
      {children}
    </label>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="mt-4 rounded-2xl border border-dashed border-brand-deep/15 bg-white/55 p-8 text-center text-sm text-brand-deep/55">
      <CalendarDays className="mx-auto mb-3 size-5" />
      {text}
    </div>
  );
}

function Notice({
  children,
  onClose,
  tone = "success",
}: {
  children: ReactNode;
  onClose: () => void;
  tone?: "success" | "error";
}) {
  return (
    <div
      className={`mb-6 flex items-center justify-between gap-4 rounded-2xl p-4 text-sm ${tone === "error" ? "bg-destructive/10 text-destructive" : "bg-emerald-100 text-emerald-800"}`}
    >
      <span className="flex items-center gap-2">
        {tone === "success" && <CheckCircle2 className="size-4" />}
        {children}
      </span>
      <button onClick={onClose} aria-label="Cerrar">
        <X className="size-4" />
      </button>
    </div>
  );
}

function PanelCentered({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-brand-cream px-6 text-sm text-brand-deep/65">
      {children}
    </main>
  );
}
