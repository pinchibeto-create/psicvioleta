import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHero } from "@/components/PageHero";

const SITE_URL = "https://terapiaconvioleta.com";

export const Route = createFileRoute("/evaluaciones-neuropsicologicas")({
  head: () => ({
    meta: [
      {
        title: "Evaluación neuropsicológica en Cholula | TDAH y autismo",
      },
      {
        name: "description",
        content:
          "Evaluación neuropsicológica en San Andrés Cholula para explorar perfiles cognitivos y apoyar hipótesis sobre TDAH, autismo y otras condiciones, con enfoque neuroafirmativo.",
      },
      {
        property: "og:title",
        content: "Evaluación neuropsicológica en Cholula | Psic. Violeta Guillén",
      },
      {
        property: "og:description",
        content:
          "Proceso de evaluación para comprender funcionamiento cognitivo, atencional y emocional desde un enfoque ético y neuroafirmativo.",
      },
      {
        property: "og:url",
        content: `${SITE_URL}/evaluaciones-neuropsicologicas`,
      },
    ],
    links: [
      {
        rel: "canonical",
        href: `${SITE_URL}/evaluaciones-neuropsicologicas`,
      },
    ],
  }),
  component: Evaluaciones,
});

function Evaluaciones() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Evaluación neuropsicológica · San Andrés Cholula"
        title={
          <>
            Evaluación neuropsicológica en Cholula para comprender cómo{" "}
            <em className="italic">funciona</em> tu mente.
          </>
        }
        intro="Un proceso estructurado para explorar tu funcionamiento cognitivo, emocional y atencional. Puede aportar información útil ante dudas sobre TDAH, autismo u otros perfiles, desde un enfoque ético y neuroafirmativo."
      >
        <Link
          to="/contacto"
          className="inline-block rounded-full bg-brand-salvia px-8 py-4 font-medium text-brand-deep transition-all hover:-translate-y-1 hover:shadow-xl"
        >
          Solicitar información
        </Link>
      </PageHero>

      <section className="bg-white px-6 py-16">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
          {[
            {
              t: "Perfil cognitivo",
              d: "Mapear funciones atencionales, ejecutivas, memoria y procesamiento.",
            },
            {
              t: "Diagnóstico diferencial",
              d: "Apoyo en hipótesis sobre TDAH, espectro autista u otras condiciones, según el alcance acordado.",
            },
            {
              t: "Informe clínico",
              d: "Entrega de un informe detallado con devolución conversada.",
            },
          ].map((c) => (
            <div
              key={c.t}
              className="rounded-3xl border border-brand-deep/5 bg-background p-8"
            >
              <h3 className="font-serif text-xl text-brand-deep">{c.t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-brand-deep/70">
                {c.d}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl rounded-3xl bg-brand-soft/40 p-10">
          <h2 className="font-serif text-2xl text-brand-deep">
            ¿Qué incluye el proceso?
          </h2>
          <ul className="mt-6 space-y-3 text-brand-deep/80">
            {[
              "Entrevista clínica inicial",
              "Aplicación de pruebas estandarizadas",
              "Análisis integrativo de resultados",
              "Sesión de devolución y orientación",
              "Informe clínico por escrito",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-accent" />
                {t}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm italic text-brand-deep/60">
            El alcance, edades atendidas, objetivos de la evaluación y pruebas
            aplicadas se confirman en una llamada inicial sin compromiso.
          </p>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-2xl text-brand-deep">
            ¿Buscas acompañamiento terapéutico más que una evaluación?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-brand-deep/70">
            Si tu objetivo es comprender tus necesidades, límites, sobrecarga o
            enmascaramiento dentro de un proceso psicoterapéutico, conoce el
            enfoque neuroafirmativo.
          </p>
          <Link
            to="/terapia-neurodivergencias-cholula"
            className="mt-6 inline-block font-semibold text-brand-sage hover:text-brand-deep"
          >
            Ver terapia para neurodivergencias →
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
