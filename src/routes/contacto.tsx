import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, Check, Clock3, Loader2, Monitor, MapPin } from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { PageHero } from "@/components/PageHero";
import { SiteLayout, WHATSAPP_URL } from "@/components/SiteLayout";
import { supabase } from "@/lib/supabase";
import {
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
  const [modalidad, setModalidad] = useState<Modalidad>("virtual");
  const [slots, setSlots] = useState<HorarioDisponible[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [sentSlot, setSentSlot] = useState<HorarioDisponible | null>(null);

  useEffect(() => {
    let active = true;
    setLoadingSlots(true);
    setSelectedSlotId("");
    setError("");

    supabase
      .rpc("horarios_disponibles_terapia", { p_modalidad: modalidad })
      .then(({ data, error: queryError }) => {
        if (!active) return;
        if (queryError) {
          setError(
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
      p_email: String(values.get("email") ?? "") || null,
      p_modalidad: modalidad,
      p_servicio: String(values.get("servicio") ?? ""),
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
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <ModeButton
                      active={modalidad === "virtual"}
                      onClick={() => setModalidad("virtual")}
                      icon={<Monitor className="size-5" />}
                      title="Virtual"
                      detail="Por videollamada"
                    />
                    <ModeButton
                      active={modalidad === "presencial"}
                      onClick={() => setModalidad("presencial")}
                      icon={<MapPin className="size-5" />}
                      title="Presencial"
                      detail="Consultorio en Cholula"
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
                    ) : slots.length === 0 ? (
                      <div className="rounded-2xl bg-brand-soft/35 p-5 text-sm leading-relaxed text-brand-deep/70">
                        Todavía no hay horarios publicados para esta modalidad. Puedes escribir por
                        WhatsApp para consultar una fecha.
                      </div>
                    ) : (
                      <div className="max-h-80 space-y-5 overflow-y-auto pr-1">
                        {Object.entries(slotsByDay).map(([day, daySlots]) => (
                          <div key={day}>
                            <p className="flex items-center gap-2 text-sm font-semibold text-brand-deep">
                              <CalendarDays className="size-4" /> {formatDay(daySlots[0].inicio)}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {daySlots.map((slot) => (
                                <button
                                  key={slot.disponibilidad_id}
                                  type="button"
                                  onClick={() => setSelectedSlotId(slot.disponibilidad_id)}
                                  className={`rounded-full border px-4 py-2 text-sm transition-colors ${selectedSlotId === slot.disponibilidad_id ? "border-brand-deep bg-brand-deep text-white" : "border-brand-deep/15 bg-background text-brand-deep hover:border-brand-deep/40"}`}
                                >
                                  {formatTime(slot.inicio)}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
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
                    <Field label="Correo (opcional)" full>
                      <input
                        name="email"
                        type="email"
                        maxLength={160}
                        className="form-input"
                        placeholder="hola@ejemplo.com"
                      />
                    </Field>
                    <Field label="Servicio de interés" full>
                      <select required name="servicio" className="form-input" defaultValue="">
                        <option value="" disabled>
                          Selecciona…
                        </option>
                        <option>Psicoterapia individual</option>
                        <option>Evaluación neuropsicológica</option>
                        <option>Taller / institucional</option>
                        <option>Otro / aún no estoy segura(o)</option>
                      </select>
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
      className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition-colors ${active ? "border-brand-deep bg-brand-soft/45" : "border-brand-deep/10 hover:border-brand-deep/30"}`}
    >
      <span className="text-brand-deep">{icon}</span>
      <span>
        <strong className="block text-sm text-brand-deep">{title}</strong>
        <span className="text-xs text-brand-deep/60">{detail}</span>
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
