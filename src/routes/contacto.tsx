import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, Check, Clock3, Loader2, Monitor, MapPin } from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { es } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { PageHero } from "@/components/PageHero";
import { SiteLayout, WHATSAPP_URL } from "@/components/SiteLayout";
import { supabase } from "@/lib/supabase";
import {
  TERAPIA_TIME_ZONE,
  formatDay,
  formatTime,
  localDateKey,
  type HorarioDisponible,
  type Modalidad,
} from "@/lib/terapia";

export const Route = createFileRoute("/contacto")({
  head: () => ({
    meta: [
      { title: "Agenda una cita — Psic. Violeta Guillén" },
      {
        name: "description",
        content:
          "Elige una sesión de una hora, presencial en Cholula o virtual, y envía tu solicitud de cita.",
      },
      { property: "og:title", content: "Agenda una cita" },
      {
        property: "og:description",
        content: "Consulta horarios y solicita una sesión con la Psic. Violeta Guillén.",
      },
      { property: "og:url", content: "/contacto" },
    ],
    links: [{ rel: "canonical", href: "/contacto" }],
  }),
  component: Contacto,
});

const faqs = [
  [
    "¿La terapia puede ser en línea?",
    "Sí, atiendo en línea por videollamada con la misma calidez que en persona.",
  ],
  ["¿Dónde está el consultorio?", "En San Juan Aquiahuac, San Andrés Cholula, Puebla."],
  [
    "¿Qué pasa en la primera sesión?",
    "Conversamos sobre lo que te trae, mapeamos el proceso y acordamos encuadre.",
  ],
  ["¿Trabajas con adolescentes y adultos?", "Sí, acompaño a adolescentes y personas adultas."],
  ["¿Cuánto dura cada sesión?", "Cada horario se aparta por una hora completa."],
  [
    "¿La cita queda confirmada al enviarla?",
    "El horario queda apartado y Violeta te confirma personalmente por WhatsApp.",
  ],
];

function Contacto() {
  const [modalidad, setModalidad] = useState<Modalidad>("presencial");
  const [slots, setSlots] = useState<HorarioDisponible[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedSlotId, setSelectedSlotId] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [slotsError, setSlotsError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [sentSlot, setSentSlot] = useState<HorarioDisponible | null>(null);

  const calendarStart = useMemo(() => mexicoCalendarDate(new Date()), []);
  const calendarEnd = useMemo(
    () =>
      new Date(
        calendarStart.getFullYear(),
        calendarStart.getMonth(),
        calendarStart.getDate() + 59,
        12,
      ),
    [calendarStart],
  );

  useEffect(() => {
    let active = true;
    setLoadingSlots(true);
    setSelectedDate(undefined);
    setSelectedSlotId("");
    setError("");
    setSlotsError("");

    supabase
      .rpc("horarios_disponibles_terapia", { p_modalidad: modalidad })
      .then(({ data, error: queryError }) => {
        if (!active) return;
        if (queryError) {
          setSlotsError(
            "No pude consultar los horarios. Puedes intentar de nuevo o escribir por WhatsApp.",
          );
          setSlots([]);
        } else {
          setSlots((data ?? []) as HorarioDisponible[]);
        }
        setLoadingSlots(false);
      });

    return () => {
      active = false;
    };
  }, [modalidad]);

  const slotsByDay = useMemo(() => {
    return slots.reduce<Record<string, HorarioDisponible[]>>((groups, slot) => {
      const key = localDateKey(slot.inicio);
      groups[key] = [...(groups[key] ?? []), slot];
      return groups;
    }, {});
  }, [slots]);

  const calendarDays = useMemo(
    () => daysBetween(calendarStart, calendarEnd),
    [calendarEnd, calendarStart],
  );

  const availabilityDates = useMemo(() => {
    const many: Date[] = [];
    const few: Date[] = [];
    const none: Date[] = [];

    calendarDays.forEach((date) => {
      const count = slotsByDay[calendarDateKey(date)]?.length ?? 0;
      if (count > 4) many.push(date);
      else if (count > 0) few.push(date);
      else none.push(date);
    });

    return { many, few, none };
  }, [calendarDays, slotsByDay]);

  const selectedDaySlots = selectedDate ? (slotsByDay[calendarDateKey(selectedDate)] ?? []) : [];

  function selectDate(date: Date | undefined) {
    setSelectedDate(date);
    setSelectedSlotId("");
    setError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const slot = slots.find((item) => item.disponibilidad_id === selectedSlotId);
    if (!slot) {
      setError("Selecciona un horario disponible.");
      return;
    }

    const form = event.currentTarget;
    const values = new FormData(form);
    setSubmitting(true);

    const { error: requestError } = await supabase.rpc("solicitar_cita_terapia", {
      p_disponibilidad_id: slot.disponibilidad_id,
      p_nombre: String(values.get("nombre") ?? ""),
      p_telefono: String(values.get("telefono") ?? ""),
      p_email: null,
      p_modalidad: modalidad,
      p_servicio: "Psicoterapia individual",
      p_motivo: String(values.get("motivo") ?? "") || null,
    });

    setSubmitting(false);

    if (requestError) {
      const unavailable = requestError.message.toLowerCase().includes("horario");
      setError(
        unavailable
          ? "Ese horario acaba de ser apartado. Elige otro de la lista."
          : "No pude enviar la solicitud. Revisa tus datos o inténtalo nuevamente.",
      );
      const { data } = await supabase.rpc("horarios_disponibles_terapia", {
        p_modalidad: modalidad,
      });
      setSlots((data ?? []) as HorarioDisponible[]);
      setSelectedSlotId("");
      return;
    }

    setSentSlot(slot);
    form.reset();
  }

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Agenda"
        title={
          <>
            Elige un momento para <em className="italic">ti</em>.
          </>
        }
        intro="Selecciona una sesión de una hora. Tu horario quedará apartado y Violeta te confirmará personalmente por WhatsApp."
      />

      <section className="px-6 pb-24">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-5">
          <aside className="space-y-6 md:col-span-2">
            <div className="rounded-3xl border border-brand-deep/10 bg-white p-6">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-deep/60">
                Cómo funciona
              </p>
              <ol className="mt-5 space-y-5 text-sm text-brand-deep/75">
                <Step number="1" text="Elige modalidad, fecha y hora." />
                <Step number="2" text="El horario se aparta durante una hora." />
                <Step number="3" text="Violeta confirma contigo por WhatsApp." />
              </ol>
            </div>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="flex w-full items-center justify-center gap-3 rounded-full bg-whatsapp px-6 py-4 font-bold text-white transition-transform hover:scale-[1.02]"
            >
              Prefiero escribir por WhatsApp
            </a>
            <div className="rounded-3xl border border-destructive/30 bg-destructive/5 p-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-destructive/80">
                Aviso de crisis
              </p>
              <p className="mt-2 text-xs leading-relaxed text-brand-deep/80">
                Este canal no atiende crisis o emergencias inmediatas. En México, contacta a la{" "}
                <strong>Línea de la Vida</strong> al <strong>800 911 2000</strong> o acude a tu
                unidad de salud más cercana.
              </p>
            </div>
          </aside>

          <div className="rounded-3xl border border-brand-deep/10 bg-white p-6 md:col-span-3 md:p-8">
            {sentSlot ? (
              <Success slot={sentSlot} modalidad={modalidad} />
            ) : (
              <form className="space-y-8" onSubmit={handleSubmit}>
                <div>
                  <SectionLabel number="1">¿Cómo prefieres tu sesión?</SectionLabel>
                  <div className="mt-4 grid grid-cols-2 gap-2 sm:gap-3">
                    <ModeButton
                      active={modalidad === "presencial"}
                      onClick={() => setModalidad("presencial")}
                      icon={<MapPin className="size-5" />}
                      title="Presencial"
                      detail="Consultorio en Cholula"
                    />
                    <ModeButton
                      active={modalidad === "virtual"}
                      onClick={() => setModalidad("virtual")}
                      icon={<Monitor className="size-5" />}
                      title="Virtual"
                      detail="Por videollamada"
                    />
                  </div>
                </div>

                <div>
                  <SectionLabel number="2">Elige fecha y hora</SectionLabel>
                  <div className="mt-4 min-h-28">
                    {loadingSlots ? (
                      <div className="flex items-center gap-2 py-8 text-sm text-brand-deep/60">
                        <Loader2 className="size-4 animate-spin" /> Consultando horarios…
                      </div>
                    ) : slotsError ? (
                      <div className="rounded-2xl bg-destructive/10 p-5 text-sm leading-relaxed text-destructive">
                        {slotsError}
                      </div>
                    ) : (
                      <div>
                        <div className="mb-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-brand-deep/70">
                          <Legend color="bg-emerald-500" label="5 o más espacios" />
                          <Legend color="bg-amber-400" label="1 a 4 espacios" />
                          <Legend color="bg-rose-400" label="Sin espacios" />
                        </div>

                        <div className="grid gap-4 lg:grid-cols-[minmax(19rem,1.15fr)_minmax(12rem,.85fr)]">
                          <div className="overflow-hidden rounded-2xl border border-brand-deep/10 bg-background p-1">
                            <Calendar
                              mode="single"
                              locale={es}
                              selected={selectedDate}
                              onSelect={selectDate}
                              defaultMonth={calendarStart}
                              startMonth={calendarStart}
                              endMonth={calendarEnd}
                              disabled={[{ before: calendarStart }, { after: calendarEnd }]}
                              showOutsideDays={false}
                              modifiers={availabilityDates}
                              modifiersClassNames={{
                                many: "bg-emerald-100 text-emerald-900 hover:bg-emerald-200",
                                few: "bg-amber-100 text-amber-900 hover:bg-amber-200",
                                none: "bg-rose-100 text-rose-800 hover:bg-rose-200",
                              }}
                              className="w-full [--cell-size:2.35rem] sm:[--cell-size:2.5rem]"
                              classNames={{ root: "w-full" }}
                            />
                          </div>

                          <div className="rounded-2xl border border-brand-deep/10 bg-brand-soft/20 p-5">
                            {selectedDate ? (
                              <>
                                <p className="flex items-start gap-2 font-semibold text-brand-deep">
                                  <CalendarDays className="mt-0.5 size-4 shrink-0" />
                                  {formatCalendarDay(selectedDate)}
                                </p>
                                {selectedDaySlots.length ? (
                                  <>
                                    <p className="mt-2 text-xs text-brand-deep/60">
                                      {selectedDaySlots.length === 1
                                        ? "1 horario disponible"
                                        : `${selectedDaySlots.length} horarios disponibles`}
                                    </p>
                                    <div className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-1">
                                      {selectedDaySlots.map((slot) => (
                                        <button
                                          key={slot.disponibilidad_id}
                                          type="button"
                                          onClick={() => setSelectedSlotId(slot.disponibilidad_id)}
                                          className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors ${selectedSlotId === slot.disponibilidad_id ? "border-brand-deep bg-brand-deep text-white" : "border-brand-deep/15 bg-white text-brand-deep hover:border-brand-deep/40"}`}
                                        >
                                          {formatTime(slot.inicio)}
                                        </button>
                                      ))}
                                    </div>
                                  </>
                                ) : (
                                  <p className="mt-4 text-sm leading-relaxed text-brand-deep/65">
                                    No hay horarios disponibles este día. Elige una fecha amarilla o
                                    verde.
                                  </p>
                                )}
                              </>
                            ) : (
                              <div className="flex min-h-28 flex-col justify-center text-center lg:min-h-full">
                                <CalendarDays className="mx-auto size-6 text-brand-deep/35" />
                                <p className="mt-3 text-sm font-semibold text-brand-deep">
                                  Elige una fecha
                                </p>
                                <p className="mt-1 text-xs leading-relaxed text-brand-deep/60">
                                  Después podrás seleccionar la hora disponible.
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <SectionLabel number="3">Tus datos de contacto</SectionLabel>
                  <div className="mt-4 grid gap-5 md:grid-cols-2">
                    <Field label="Nombre completo">
                      <input
                        required
                        name="nombre"
                        minLength={2}
                        maxLength={120}
                        className="form-input"
                        placeholder="Tu nombre"
                      />
                    </Field>
                    <Field label="WhatsApp">
                      <input
                        required
                        name="telefono"
                        minLength={8}
                        maxLength={30}
                        inputMode="tel"
                        className="form-input"
                        placeholder="222 000 0000"
                      />
                    </Field>
                    <Field label="Mensaje breve (opcional)" full>
                      <textarea
                        name="motivo"
                        rows={3}
                        maxLength={1000}
                        className="form-input resize-none"
                        placeholder="No necesitas compartir detalles sensibles."
                      />
                    </Field>
                  </div>
                </div>

                {error && (
                  <p
                    role="alert"
                    className="rounded-2xl bg-destructive/10 p-4 text-sm text-destructive"
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={!selectedSlotId || submitting}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-salvia py-4 text-sm font-bold uppercase tracking-widest text-brand-deep transition-all hover:bg-brand-accent disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" /> Apartando horario…
                    </>
                  ) : (
                    "Enviar solicitud de cita"
                  )}
                </button>
                <p className="text-[11px] italic text-brand-deep/50">
                  Al enviar aceptas el aviso de privacidad. El estado de pago y las notas
                  administrativas solo serán visibles para Violeta.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      <section className="bg-brand-soft/30 px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-serif text-3xl text-brand-deep">Preguntas frecuentes</h2>
          <div className="mt-10 space-y-3">
            {faqs.map(([q, a]) => (
              <details
                key={q}
                className="group rounded-2xl border border-brand-deep/10 bg-background p-6 open:bg-white"
              >
                <summary className="cursor-pointer list-none font-serif text-lg text-brand-deep">
                  {q}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-brand-deep/75">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .form-input { width: 100%; background: var(--color-background); border: 1px solid var(--color-border); border-radius: .75rem; padding: .75rem 1rem; font-size: .95rem; color: var(--color-foreground); transition: border-color .2s, box-shadow .2s; }
        .form-input:focus { outline: none; border-color: var(--brand-deep); box-shadow: 0 0 0 3px color-mix(in oklab, var(--brand-deep) 15%, transparent); }
      `}</style>
    </SiteLayout>
  );
}

function Success({ slot, modalidad }: { slot: HorarioDisponible; modalidad: Modalidad }) {
  return (
    <div className="flex min-h-[34rem] flex-col items-center justify-center text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-brand-salvia">
        <Check className="size-8 text-brand-deep" />
      </div>
      <h2 className="mt-6 font-serif text-3xl text-brand-deep">Tu horario quedó apartado</h2>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-brand-deep/70">
        Violeta recibió tu solicitud y te escribirá por WhatsApp para confirmarla.
      </p>
      <div className="mt-7 rounded-2xl bg-brand-soft/35 px-6 py-5 text-left">
        <p className="flex items-center gap-2 font-semibold text-brand-deep">
          <CalendarDays className="size-4" /> {formatDay(slot.inicio)}
        </p>
        <p className="mt-2 flex items-center gap-2 text-sm text-brand-deep/75">
          <Clock3 className="size-4" /> {formatTime(slot.inicio)} · 1 hora
        </p>
        <p className="mt-2 text-sm capitalize text-brand-deep/75">Modalidad {modalidad}</p>
      </div>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="mt-8 text-sm font-semibold text-brand-deep underline underline-offset-4"
      >
        Solicitar otro horario
      </button>
    </div>
  );
}

function Step({ number, text }: { number: string; text: string }) {
  return (
    <li className="flex gap-3">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-soft font-semibold text-brand-deep">
        {number}
      </span>
      <span className="pt-1">{text}</span>
    </li>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-2">
      <span className={`size-2.5 rounded-full ${color}`} aria-hidden="true" />
      {label}
    </span>
  );
}

function mexicoCalendarDate(value: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TERAPIA_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(value);
  const map = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return new Date(Number(map.year), Number(map.month) - 1, Number(map.day), 12);
}

function calendarDateKey(value: Date) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function daysBetween(start: Date, end: Date) {
  const dates: Date[] = [];
  const current = new Date(start);
  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

function formatCalendarDay(value: Date) {
  const formatted = new Intl.DateTimeFormat("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(value);
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

function SectionLabel({ number, children }: { number: string; children: ReactNode }) {
  return (
    <h2 className="flex items-center gap-3 font-serif text-xl text-brand-deep">
      <span className="flex size-7 items-center justify-center rounded-full bg-brand-soft font-sans text-xs font-bold">
        {number}
      </span>
      {children}
    </h2>
  );
}

function ModeButton({
  active,
  onClick,
  icon,
  title,
  detail,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  title: string;
  detail: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-w-0 flex-col items-start gap-2 rounded-2xl border p-3 text-left transition-colors sm:flex-row sm:items-center sm:gap-3 sm:p-4 ${active ? "border-brand-deep bg-brand-soft/45" : "border-brand-deep/10 hover:border-brand-deep/30"}`}
    >
      <span className="shrink-0 text-brand-deep">{icon}</span>
      <span className="min-w-0">
        <strong className="block text-sm text-brand-deep">{title}</strong>
        <span className="block text-xs leading-snug text-brand-deep/60">{detail}</span>
      </span>
    </button>
  );
}

function Field({ label, children, full }: { label: string; children: ReactNode; full?: boolean }) {
  return (
    <label className={`flex flex-col gap-2 ${full ? "md:col-span-2" : ""}`}>
      <span className="text-[10px] font-semibold uppercase tracking-widest text-brand-deep/60">
        {label}
      </span>
      {children}
    </label>
  );
}
