import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout, WHATSAPP_URL } from "@/components/SiteLayout";
import { PageHero } from "@/components/PageHero";

export const Route = createFileRoute("/contacto")({
  head: () => ({
    meta: [
      { title: "Contacto — Psic. Violeta Guillén" },
      {
        name: "description",
        content:
          "Agenda una primera consulta de psicoterapia en Cholula o en línea. WhatsApp y formulario disponibles.",
      },
      { property: "og:title", content: "Contacto" },
      {
        property: "og:description",
        content: "Agenda tu primera consulta por WhatsApp o formulario.",
      },
      { property: "og:url", content: "/contacto" },
    ],
    links: [{ rel: "canonical", href: "/contacto" }],
  }),
  component: Contacto,
});

const faqs = [
  ["¿La terapia puede ser en línea?", "Sí, atiendo en línea por videollamada con la misma calidez que en persona."],
  ["¿Dónde está el consultorio?", "En San Juan Aquiahuac, San Andrés Cholula, Puebla."],
  ["¿Qué pasa en la primera sesión?", "Conversamos sobre lo que te trae, mapeamos el proceso y acordamos encuadre."],
  ["¿Trabajas con adolescentes y adultos?", "Sí, acompaño a adolescentes y personas adultas."],
  ["¿Cuánto dura cada sesión?", "Las sesiones individuales son de 50 minutos."],
  ["¿Cómo agendo?", "Por WhatsApp o desde el formulario. Te respondo en horario de oficina."],
];

function Contacto() {
  const [sent, setSent] = useState(false);
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Contacto"
        title={<>Hablemos. Estoy <em className="italic">aquí</em>.</>}
        intro="Escríbeme por WhatsApp o desde el formulario. Resuelvo dudas sin compromiso antes de agendar."
      />

      <section className="px-6 pb-24">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-5">
          <aside className="space-y-6 md:col-span-2">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="flex w-full items-center justify-center gap-3 rounded-full bg-whatsapp px-6 py-4 font-bold text-white transition-transform hover:scale-[1.02]"
            >
              Enviar WhatsApp
            </a>
            <div className="rounded-3xl border border-brand-deep/10 bg-background p-6 text-sm">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-deep/60">
                Consultorio
              </p>
              <p className="mt-2 font-serif italic text-brand-deep">
                San Juan Aquiahuac,
                <br />
                San Andrés Cholula, Puebla.
              </p>
              <p className="mt-4 text-[10px] font-semibold uppercase tracking-widest text-brand-deep/60">
                Horario
              </p>
              <p className="mt-2 text-brand-deep/80">
                Lun a Vie · 10:00 – 19:00
              </p>
            </div>
            <div className="rounded-3xl border border-destructive/30 bg-destructive/5 p-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-destructive/80">
                Aviso de crisis
              </p>
              <p className="mt-2 text-xs leading-relaxed text-brand-deep/80">
                Este canal no atiende crisis o emergencias inmediatas. En
                México, contacta a la <strong>Línea de la Vida</strong> al{" "}
                <strong>800 911 2000</strong> o acude a tu unidad de salud más
                cercana.
              </p>
            </div>
          </aside>

          <div className="rounded-3xl border border-brand-deep/10 bg-white p-8 md:col-span-3">
            {sent ? (
              <div className="flex h-full flex-col items-center justify-center gap-4 py-16 text-center">
                <h2 className="font-serif text-3xl text-brand-deep">
                  Gracias por escribirme
                </h2>
                <p className="max-w-sm text-brand-deep/70">
                  Recibí tu mensaje. Te respondo en horario de oficina al medio
                  de contacto que indicaste.
                </p>
              </div>
            ) : (
              <form
                className="grid gap-5 md:grid-cols-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
              >
                <Field label="Nombre">
                  <input
                    required
                    type="text"
                    className="form-input"
                    placeholder="Tu nombre"
                  />
                </Field>
                <Field label="Correo o WhatsApp">
                  <input
                    required
                    type="text"
                    className="form-input"
                    placeholder="hola@ejemplo.com"
                  />
                </Field>
                <Field label="Modalidad preferida" full>
                  <div className="flex gap-6 pt-2 text-sm">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="modalidad"
                        defaultChecked
                        className="accent-brand-deep"
                      />
                      En línea
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="modalidad"
                        className="accent-brand-deep"
                      />
                      Presencial (Cholula)
                    </label>
                  </div>
                </Field>
                <Field label="Servicio de interés" full>
                  <select className="form-input" defaultValue="">
                    <option value="" disabled>
                      Selecciona…
                    </option>
                    <option>Psicoterapia individual</option>
                    <option>Evaluación neuropsicológica</option>
                    <option>Talleres / institucional</option>
                    <option>Aún no estoy segura/o</option>
                  </select>
                </Field>
                <Field label="¿Qué te trae por aquí?" full>
                  <textarea
                    rows={4}
                    className="form-input resize-none"
                    placeholder="Cuéntame brevemente. No necesitas dar detalles sensibles."
                  />
                </Field>
                <button
                  type="submit"
                  className="md:col-span-2 rounded-full bg-brand-deep py-4 text-sm font-bold uppercase tracking-widest text-brand-cream transition-all hover:bg-brand-sage"
                >
                  Enviar solicitud
                </button>
                <p className="md:col-span-2 text-[11px] italic text-brand-deep/50">
                  Al enviar este formulario aceptas nuestro aviso de privacidad.
                  Tus datos se tratan con confidencialidad.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      <section className="bg-brand-soft/30 px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-serif text-3xl text-brand-deep">
            Preguntas frecuentes
          </h2>
          <div className="mt-10 space-y-3">
            {faqs.map(([q, a]) => (
              <details
                key={q}
                className="group rounded-2xl border border-brand-deep/10 bg-background p-6 open:bg-white"
              >
                <summary className="cursor-pointer list-none font-serif text-lg text-brand-deep">
                  {q}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-brand-deep/75">
                  {a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .form-input {
          width: 100%;
          background: var(--color-background);
          border: 1px solid var(--color-border);
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
          font-size: 0.95rem;
          color: var(--color-foreground);
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .form-input:focus {
          outline: none;
          border-color: var(--brand-deep);
          box-shadow: 0 0 0 3px color-mix(in oklab, var(--brand-deep) 15%, transparent);
        }
      `}</style>
    </SiteLayout>
  );
}

function Field({
  label,
  children,
  full,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <label
      className={`flex flex-col gap-2 ${full ? "md:col-span-2" : ""}`}
    >
      <span className="text-[10px] font-semibold uppercase tracking-widest text-brand-deep/60">
        {label}
      </span>
      {children}
    </label>
  );
}
