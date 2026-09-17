import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHero } from "@/components/PageHero";

const SITE_URL = "https://terapiaconvioleta.com";

export const Route = createFileRoute("/psicoterapia")({
  head: () => ({
    meta: [
      { title: "Psicoterapia en Cholula y online | Psic. Violeta Guillén" },
      {
        name: "description",
        content:
          "Psicoterapia en San Andrés Cholula y online para ansiedad, autoestima, duelo, identidad y neurodivergencias, desde un enfoque integrativo y neuroafirmativo.",
      },
      {
        property: "og:title",
        content: "Psicoterapia en Cholula y online | Psic. Violeta Guillén",
      },
      {
        property: "og:description",
        content:
          "Acompañamiento psicológico para ansiedad, autoestima, duelo, identidad y neurodivergencias, presencial en Cholula y online.",
      },
      { property: "og:url", content: `${SITE_URL}/psicoterapia` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/psicoterapia` }],
  }),
  component: Psicoterapia,
});

function Psicoterapia() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Psicoterapia individual · Cholula y online"
        title={
          <>
            Psicoterapia en Cholula para <em className="italic">escucharte</em>.
          </>
        }
        intro="Acompañamiento psicológico para ansiedad, autoestima, duelos, identidad y neurodivergencias. Trabajamos a tu ritmo, de forma presencial en San Andrés Cholula o por videollamada."
      >
        <Link
          to="/contacto"
          className="inline-block rounded-full bg-brand-salvia px-8 py-4 font-medium text-brand-deep transition-all hover:-translate-y-1 hover:shadow-xl"
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
                "Ansiedad, estrés y sobrepensamiento",
                "Autoestima e imagen corporal",
                "Neurodivergencias",
                "Duelos y transiciones vitales",
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

      <section className="bg-brand-soft/30 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-brand-sage">
              Explora según lo que estás viviendo
            </span>
            <h2 className="mt-3 font-serif text-3xl text-brand-deep">
              Dos motivos frecuentes para empezar terapia
            </h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <Link
              to="/terapia-ansiedad-cholula"
              className="rounded-3xl bg-white p-7 ring-1 ring-brand-deep/5 transition-all hover:-translate-y-1 hover:ring-brand-accent"
            >
              <h3 className="font-serif text-xl text-brand-deep">
                Ansiedad y sobrepensamiento
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-brand-deep/70">
                Conoce cómo puede acompañarse la ansiedad cuando la mente no
                descansa o el cuerpo permanece en alerta.
              </p>
            </Link>
            <Link
              to="/terapia-neurodivergencias-cholula"
              className="rounded-3xl bg-white p-7 ring-1 ring-brand-deep/5 transition-all hover:-translate-y-1 hover:ring-brand-accent"
            >
              <h3 className="font-serif text-xl text-brand-deep">
                Neurodivergencias y enmascaramiento
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-brand-deep/70">
                Conoce el enfoque neuroafirmativo para explorar necesidades,
                límites, identidad y formas propias de funcionar.
              </p>
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
