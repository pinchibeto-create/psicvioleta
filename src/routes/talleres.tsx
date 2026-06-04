import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHero } from "@/components/PageHero";

export const Route = createFileRoute("/talleres")({
  head: () => ({
    meta: [
      { title: "Talleres de salud mental — Psic. Violeta Guillén" },
      {
        name: "description",
        content:
          "Talleres psicoeducativos para escuelas, empresas, ONGs y espacios creativos. Salud mental, autoestima, ansiedad y derechos.",
      },
      { property: "og:title", content: "Talleres de salud mental" },
      {
        property: "og:description",
        content:
          "Talleres para instituciones, empresas y organizaciones en Puebla y en línea.",
      },
      { property: "og:url", content: "/talleres" },
    ],
    links: [{ rel: "canonical", href: "/talleres" }],
  }),
  component: Talleres,
});

const talleres = [
  {
    tag: "Educación",
    t: "Educación sexual y derechos reproductivos",
    d: "Información clara y libre de prejuicios para adolescentes y adultos.",
  },
  {
    tag: "Infancia",
    t: "Sanando heridas de la infancia",
    d: "Un viaje al niño/a interior para reconocer y reparar.",
  },
  {
    tag: "Emociones",
    t: "Reconociendo mi ansiedad",
    d: "Herramientas prácticas para entender y regular la ansiedad.",
  },
  {
    tag: "Autoestima",
    t: "Autoestima e imagen corporal",
    d: "Reconstruir la relación con el cuerpo desde la compasión.",
  },
];

function Talleres() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Talleres & espacios"
        title={<>Espacios grupales para <em className="italic">aprender juntas</em>.</>}
        intro="Diseño talleres y espacios psicoeducativos para escuelas, empresas, organizaciones no gubernamentales y colectivos creativos."
      >
        <Link
          to="/contacto"
          className="inline-block rounded-full bg-brand-deep px-8 py-4 font-medium text-brand-cream transition-all hover:-translate-y-1 hover:shadow-xl"
        >
          Solicitar propuesta
        </Link>
      </PageHero>

      <section className="bg-white px-6 py-16">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
          {talleres.map((w) => (
            <article
              key={w.t}
              className="flex flex-col justify-between rounded-3xl border border-brand-deep/5 bg-background p-10"
            >
              <div>
                <span className="rounded-full bg-brand-soft px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-deep">
                  {w.tag}
                </span>
                <h3 className="mt-4 font-serif text-2xl text-brand-deep">
                  {w.t}
                </h3>
                <p className="mt-3 text-brand-deep/70">{w.d}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl rounded-3xl bg-brand-soft/40 p-10">
          <h2 className="font-serif text-3xl text-brand-deep">
            Formato a la medida
          </h2>
          <p className="mt-4 text-brand-deep/80">
            Adaptamos duración, profundidad y dinámicas al contexto de tu
            organización. Disponibles en formato presencial en Puebla y online
            para cualquier ciudad.
          </p>
          <ul className="mt-6 grid gap-3 text-sm text-brand-deep/80 md:grid-cols-2">
            {[
              "Sesiones únicas o ciclos",
              "Materiales de apoyo incluidos",
              "Enfoque vivencial y reflexivo",
              "Personalización temática",
            ].map((i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-accent" />
                {i}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </SiteLayout>
  );
}
