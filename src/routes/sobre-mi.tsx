import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import portrait from "@/assets/violeta-portrait.jpg";

export const Route = createFileRoute("/sobre-mi")({
  head: () => ({
    meta: [
      { title: "Sobre mí — Psic. Violeta Guillén" },
      {
        name: "description",
        content:
          "Conoce mi formación, enfoque integrativo y mi postura ética como psicoterapeuta en Cholula.",
      },
      { property: "og:title", content: "Sobre mí — Psic. Violeta Guillén" },
      {
        property: "og:description",
        content:
          "Psicóloga con formación integrativa y arteterapéutica. Cédula 15253825.",
      },
      { property: "og:url", content: "/sobre-mi" },
    ],
    links: [{ rel: "canonical", href: "/sobre-mi" }],
  }),
  component: SobreMi,
});

function SobreMi() {
  return (
    <SiteLayout>
      <section className="px-6 pb-24 pt-36 md:pt-44">
        <div className="mx-auto grid max-w-6xl items-center gap-16 md:grid-cols-5">
          <div className="md:col-span-2">
            <img
              src={portrait}
              alt="Violeta Guillén"
              width={800}
              height={1000}
              className="aspect-[4/5] w-full rounded-3xl object-cover shadow-xl ring-1 ring-brand-deep/5"
            />
          </div>
          <div className="space-y-6 md:col-span-3">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-brand-sage">
              Sobre mí
            </span>
            <h1 className="font-serif text-5xl leading-tight text-brand-deep">
              Soy Violeta Guillén.
            </h1>
            <p className="text-lg leading-relaxed text-brand-deep/80">
              Psicóloga y psicoterapeuta con enfoque integrativo y
              arteterapéutico. Acompaño procesos desde la escucha, el respeto y
              la construcción de un espacio seguro para explorar lo que sientes,
              piensas y necesitas.
            </p>
            <p className="leading-relaxed text-brand-deep/70">
              Creo que el arte abre puertas a donde la palabra no siempre llega.
              Mi práctica combina la psicoterapia clínica con recursos
              creativos, y se sostiene en una postura ética: no patologizar la
              existencia, validar la diversidad y acompañar sin imponer.
            </p>
            <dl className="grid grid-cols-2 gap-6 border-t border-brand-deep/10 pt-6">
              <div>
                <dt className="text-[10px] uppercase tracking-widest text-brand-deep/60">
                  Cédula profesional
                </dt>
                <dd className="mt-1 font-serif italic">15253825</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-widest text-brand-deep/60">
                  Modalidad
                </dt>
                <dd className="mt-1 font-serif italic">
                  Presencial y en línea
                </dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-widest text-brand-deep/60">
                  Ubicación
                </dt>
                <dd className="mt-1 font-serif italic">San Andrés Cholula</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-widest text-brand-deep/60">
                  Certificación
                </dt>
                <dd className="mt-1 font-serif italic">Psicoterapia de arte</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="bg-brand-soft/30 px-6 py-24">
        <div className="mx-auto max-w-4xl space-y-10">
          <h2 className="font-serif text-3xl text-brand-deep">
            Mi postura como acompañante
          </h2>
          <ul className="grid gap-6 md:grid-cols-2">
            {[
              ["Sin juicio", "Respeto tus valores, identidad y ritmos. No vengo a corregirte."],
              ["Neuroafirmativa", "Trabajo con personas neurodivergentes desde la validación."],
              ["Inclusiva", "Espacio seguro para diversidades sexogenéricas y corporales."],
              ["Ética y política", "Salud mental con mirada crítica y no capacitista."],
            ].map(([t, d]) => (
              <li
                key={t}
                className="rounded-2xl bg-background p-6 ring-1 ring-brand-deep/5"
              >
                <h3 className="font-serif text-xl italic text-brand-sage">{t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-brand-deep/80">
                  {d}
                </p>
              </li>
            ))}
          </ul>
          <div className="text-center">
            <Link
              to="/contacto"
              className="inline-block rounded-full bg-brand-deep px-8 py-4 font-medium text-brand-cream transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              Agendar una primera consulta
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
