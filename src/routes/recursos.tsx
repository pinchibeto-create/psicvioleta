import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHero } from "@/components/PageHero";

export const Route = createFileRoute("/recursos")({
  head: () => ({
    meta: [
      { title: "Recursos & blog — Psic. Violeta Guillén" },
      {
        name: "description",
        content:
          "Lecturas y reflexiones sobre psicoterapia, arteterapia, neurodivergencias y autoconocimiento.",
      },
      { property: "og:title", content: "Recursos & blog" },
      {
        property: "og:description",
        content:
          "Reflexiones y lecturas sobre salud mental y procesos terapéuticos.",
      },
      { property: "og:url", content: "/recursos" },
    ],
    links: [{ rel: "canonical", href: "/recursos" }],
  }),
  component: Recursos,
});

const posts = [
  {
    tag: "Reflexión",
    t: "¿Cómo saber si necesito terapia?",
    d: "Señales sutiles que conviene escuchar antes de que la urgencia tome el lugar.",
  },
  {
    tag: "Arteterapia",
    t: "¿Qué es la psicoterapia de arte?",
    d: "El proceso creativo como camino hacia lo que la palabra no nombra.",
  },
  {
    tag: "Neurodivergencias",
    t: "Neurodivergencia en adultos",
    d: "Descubrirse neurodivergente más tarde de lo esperado.",
  },
  {
    tag: "Ansiedad",
    t: "Ansiedad y autoconocimiento",
    d: "Mirar la ansiedad sin pelearse con ella.",
  },
  {
    tag: "Cuerpo",
    t: "Autoestima e imagen corporal",
    d: "Habitar el cuerpo lejos de la mirada externa.",
  },
  {
    tag: "Proceso",
    t: "Cómo prepararte para tu primera sesión",
    d: "Qué llevar, qué esperar y qué no necesitas tener resuelto.",
  },
];

function Recursos() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Recursos & blog"
        title={<>Lecturas para <em className="italic">acompañar</em> el camino.</>}
        intro="Pequeños textos y reflexiones sobre psicoterapia, arteterapia, neurodivergencias y procesos de autoconocimiento."
      />

      <section className="bg-white px-6 py-16">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <article
              key={p.t}
              className="group flex flex-col rounded-3xl border border-brand-deep/5 bg-background p-8 transition-all hover:-translate-y-1 hover:border-brand-accent"
            >
              <span className="rounded-full bg-brand-soft px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-deep self-start">
                {p.tag}
              </span>
              <h3 className="mt-5 font-serif text-xl text-brand-deep">{p.t}</h3>
              <p className="mt-3 text-sm text-brand-deep/70">{p.d}</p>
              <span className="mt-6 text-[10px] uppercase tracking-widest text-brand-sage">
                Próximamente
              </span>
            </article>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
