import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHero } from "@/components/PageHero";

export const Route = createFileRoute("/psicoterapia")({
  head: () => ({
    meta: [
      { title: "Psicoterapia individual — Cholula y en línea" },
      {
        name: "description",
        content:
          "Psicoterapia individual en Cholula y en línea para ansiedad, autoestima, duelos, neurodivergencias e identidad.",
      },
      { property: "og:title", content: "Psicoterapia individual" },
      {
        property: "og:description",
        content:
          "Acompañamiento psicoterapéutico individual desde un enfoque integrativo.",
      },
      { property: "og:url", content: "/psicoterapia" },
    ],
    links: [{ rel: "canonical", href: "/psicoterapia" }],
  }),
  component: Psicoterapia,
});

function Psicoterapia() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Psicoterapia individual"
        title={<>Un espacio para <em className="italic">escucharte</em>.</>}
        intro="Acompañamiento psicológico continuo en línea y presencial en Cholula. Trabajamos a tu ritmo, en un proceso colaborativo y respetuoso."
      >
        <Link
          to="/contacto"
          className="inline-block rounded-full bg-brand-deep px-8 py-4 font-medium text-brand-cream transition-all hover:-translate-y-1 hover:shadow-xl"
        >
          Agendar primera consulta
        </Link>
      </PageHero>

      <section className="bg-white px-6 py-16">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2">
          <div className="space-y-6">
            <h2 className="font-serif text-3xl text-brand-deep">
              ¿Para quién es?
            </h2>
            <p className="leading-relaxed text-brand-deep/80">
              Para adolescentes y personas adultas que atraviesan procesos de
              ansiedad, autoestima, duelos, transiciones vitales, exploración
              de identidad o relación con el cuerpo. También acompaño a
              personas neurodivergentes.
            </p>
            <ul className="space-y-2 text-brand-deep/80">
              {[
                "Ansiedad y estrés crónico",
                "Autoestima e imagen corporal",
                "Neurodivergencias",
                "Duelos y mudanzas vitales",
                "Identidad y transiciones de género",
                "Heridas de la infancia",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-accent" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-6 rounded-3xl bg-brand-soft/40 p-8">
            <h2 className="font-serif text-3xl text-brand-deep">
              Qué esperar en la primera sesión
            </h2>
            <ol className="space-y-4 text-brand-deep/80">
              {[
                ["Conversación inicial", "Cuéntame qué te trae y qué buscas. Sin presión."],
                ["Mapa del proceso", "Pensamos juntas frecuencia, modalidad y objetivos posibles."],
                ["Acuerdos", "Definimos encuadre, costos y políticas de cancelación."],
              ].map(([t, d], i) => (
                <li key={t} className="flex gap-4">
                  <span className="font-serif text-2xl italic text-brand-sage">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-serif text-lg text-brand-deep">{t}</h3>
                    <p className="text-sm text-brand-deep/70">{d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl rounded-3xl border border-brand-deep/10 bg-background p-8 text-center">
          <p className="text-sm italic text-brand-deep/70">
            La terapia es un proceso. No prometo resultados rápidos ni
            soluciones únicas. Lo que ofrezco es escucha sostenida, herramientas
            adaptadas a tu experiencia y un espacio donde puedas habitarte con
            más libertad.
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
