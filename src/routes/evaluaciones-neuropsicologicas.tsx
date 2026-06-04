import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHero } from "@/components/PageHero";

export const Route = createFileRoute("/evaluaciones-neuropsicologicas")({
  head: () => ({
    meta: [
      { title: "Evaluaciones neuropsicológicas — Psic. Violeta Guillén" },
      {
        name: "description",
        content:
          "Procesos de evaluación neuropsicológica para comprender tu funcionamiento cognitivo y emocional.",
      },
      {
        property: "og:title",
        content: "Evaluaciones neuropsicológicas",
      },
      {
        property: "og:description",
        content:
          "Evaluación neuropsicológica con enfoque humano y neuroafirmativo.",
      },
      { property: "og:url", content: "/evaluaciones-neuropsicologicas" },
    ],
    links: [
      { rel: "canonical", href: "/evaluaciones-neuropsicologicas" },
    ],
  }),
  component: Evaluaciones,
});

function Evaluaciones() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Evaluaciones neuropsicológicas"
        title={
          <>
            Comprender cómo{" "}
            <em className="italic">funciona</em> tu mente.
          </>
        }
        intro="Procesos estructurados de evaluación para tener claridad sobre tu funcionamiento cognitivo, emocional y atencional, desde un enfoque ético y neuroafirmativo."
      >
        <Link
          to="/contacto"
          className="inline-block rounded-full bg-brand-deep px-8 py-4 font-medium text-brand-cream transition-all hover:-translate-y-1 hover:shadow-xl"
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
              d: "Apoyo en hipótesis sobre TDAH, espectro autista u otras condiciones.",
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
            El alcance, edades atendidas y pruebas aplicadas se confirman en una
            llamada inicial sin compromiso.
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
