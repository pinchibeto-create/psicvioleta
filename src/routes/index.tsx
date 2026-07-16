import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, WHATSAPP_URL } from "@/components/SiteLayout";
import portrait from "@/assets/violeta-portrait.jpg";
import artMaterials from "@/assets/art-materials.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Psic. Violeta Guillén — Psicoterapia y arteterapia en Cholula" },
      {
        name: "description",
        content:
          "Psicoterapia en línea y presencial en Cholula. Acompaño procesos de ansiedad, autoestima, neurodivergencias, duelos e identidad desde un enfoque integrativo.",
      },
      { property: "og:title", content: "Psic. Violeta Guillén" },
      {
        property: "og:description",
        content:
          "Psicoterapia integrativa y arteterapia en Cholula y en línea.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

const temas = [
  "Ansiedad y estrés",
  "Autoestima",
  "Neurodivergencias",
  "Duelos y transiciones",
  "Identidad y género",
  "Depresión",
  "Autoconocimiento",
];

function Index() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="px-6 pb-24 pt-36 md:pt-44">
        <div className="mx-auto grid max-w-7xl items-center gap-16 md:grid-cols-2">
          <div className="space-y-8">
            <span className="inline-block rounded-full bg-brand-soft px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-brand-deep">
              Psicoterapia & Arteterapia
            </span>
            <h1 className="font-serif text-5xl leading-[1.05] text-brand-deep md:text-7xl">
              Psicoterapia para{" "}
              <span className="italic">conocerte</span> y transformar la
              relación contigo.
            </h1>
            <p className="max-w-lg text-lg leading-relaxed text-brand-deep/80">
              Un espacio sensible, creativo e inclusivo en Cholula y en línea.
              Acompaño procesos de ansiedad, neurodivergencias, identidad y
              autoconocimiento desde una mirada no capacitista.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/contacto"
                className="rounded-full bg-brand-salvia px-8 py-4 text-base font-medium text-brand-deep transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                Agendar primera consulta
              </Link>
              <Link
                to="/sobre-mi"
                className="rounded-full border border-brand-deep/20 px-8 py-4 text-base font-medium text-brand-deep transition-all hover:bg-brand-soft"
              >
                Mi enfoque
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -left-10 -top-10 size-64 rounded-full bg-brand-soft/60 blur-3xl" />
            <div className="absolute -bottom-8 -right-8 size-48 rounded-full bg-brand-accent/30 blur-3xl" />
            <img
              src={portrait}
              alt="Retrato de Violeta Guillén en su estudio"
              width={800}
              height={1000}
              className="relative aspect-[4/5] w-full rounded-3xl object-cover shadow-xl ring-1 ring-brand-deep/5"
            />
          </div>
        </div>
      </section>

      {/* Credentials bar */}
      <div className="border-y border-brand-deep/5 bg-white/50">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-8 px-6 py-8">
          {[
            ["Cédula Profesional", "15253825"],
            ["Ubicación", "San Andrés Cholula / Online"],
            ["Enfoque", "Integrativo & Neuroafirmativo"],
          ].map(([k, v]) => (
            <div key={k} className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-brand-deep/60">
                {k}
              </span>
              <span className="font-serif font-bold italic text-brand-deep">
                {v}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Approach */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-4xl space-y-12 text-center">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-brand-sage">
            Mi enfoque
          </span>
          <h2 className="font-serif text-4xl text-brand-deep">
            Habitar las emociones desde la creatividad
          </h2>
          <div className="grid gap-12 text-left md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="font-serif text-xl italic text-brand-sage">
                Arteterapia
              </h3>
              <p className="leading-relaxed text-brand-deep/80">
                A veces las palabras no alcanzan. Utilizamos el proceso creativo
                como una herramienta de exploración emocional, permitiendo que
                las imágenes y texturas narren lo que el lenguaje aún no puede.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="font-serif text-xl italic text-brand-sage">
                Espacio seguro
              </h3>
              <p className="leading-relaxed text-brand-deep/80">
                Un acompañamiento que valida tu experiencia neurodivergente, tu
                identidad y tus procesos corporales sin juicio, desde una
                postura ética y política ante la salud mental.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Temas */}
      <section className="bg-brand-soft/30 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col items-end justify-between gap-4 md:flex-row">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-brand-sage">
                Especialidades
              </span>
              <h2 className="mt-3 font-serif text-4xl text-brand-deep">
                Temas que acompaño
              </h2>
            </div>
            <p className="max-w-sm text-sm text-brand-deep/70">
              Un espacio seguro para explorar lo que sientes y necesitas, desde
              una mirada sensible y no capacitista.
            </p>
          </div>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            {temas.map((t) => (
              <li
                key={t}
                className="rounded-2xl bg-background p-6 ring-1 ring-brand-deep/5 transition-all hover:-translate-y-1 hover:ring-brand-accent"
              >
                <span className="font-serif text-base leading-snug text-brand-deep break-words hyphens-auto sm:text-lg">
                  {t}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Servicios */}
      <section className="bg-white px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 space-y-3">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-brand-sage">
              Servicios clínicos & educativos
            </span>
            <h2 className="font-serif text-4xl text-brand-deep">
              Cómo podemos trabajar
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                n: "01",
                title: "Psicoterapia individual",
                href: "/psicoterapia" as const,
                desc: "Ansiedad, autoestima, duelos, transiciones de género e imagen corporal. En línea y presencial.",
                bullets: [
                  "Adolescentes y adultos",
                  "Enfoque neuroafirmativo",
                  "Sesiones de 50 minutos",
                ],
              },
              {
                n: "02",
                title: "Evaluaciones",
                href: "/evaluaciones-neuropsicologicas" as const,
                desc: "Procesos de evaluación neuropsicológica para comprender mejor tu funcionamiento cognitivo y emocional.",
                bullets: [
                  "Perfiles cognitivos",
                  "Diagnóstico diferencial",
                  "Informe clínico detallado",
                ],
              },
              {
                n: "03",
                title: "Talleres & grupos",
                href: "/talleres" as const,
                desc: "Espacios psicoeducativos para escuelas, empresas y organizaciones sobre salud mental y derechos.",
                bullets: [
                  "Educación sexual",
                  "Sanando heridas de infancia",
                  "Imagen corporal",
                ],
              },
            ].map((s) => (
              <Link
                key={s.n}
                to={s.href}
                className="group flex flex-col rounded-3xl border border-brand-deep/5 bg-background p-8 transition-all hover:-translate-y-1 hover:border-brand-accent"
              >
                <div className="mb-6 flex size-12 items-center justify-center rounded-full bg-brand-soft font-serif italic text-brand-deep transition-transform group-hover:scale-110">
                  {s.n}
                </div>
                <h3 className="mb-4 font-serif text-2xl text-brand-deep">
                  {s.title}
                </h3>
                <p className="mb-8 text-brand-deep/70">{s.desc}</p>
                <ul className="space-y-2 text-sm text-brand-deep/60">
                  {s.bullets.map((b) => (
                    <li key={b}>• {b}</li>
                  ))}
                </ul>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Arteterapia visual */}
      <section className="px-6 py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-16 md:grid-cols-2">
          <img
            src={artMaterials}
            alt="Materiales de arteterapia"
            width={1200}
            height={900}
            loading="lazy"
            className="aspect-[4/3] w-full rounded-3xl object-cover shadow-lg ring-1 ring-brand-deep/5"
          />
          <div className="space-y-6">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-brand-sage">
              El primer paso
            </span>
            <h2 className="font-serif text-4xl leading-tight text-brand-deep">
              "El primer paso para el autoconocimiento puede ser este."
            </h2>
            <p className="text-lg leading-relaxed text-brand-deep/80">
              No necesitas tener claridad sobre lo que sientes. Solo el deseo de
              mirarte con más amabilidad. Trabajaremos a tu ritmo, en un espacio
              donde lo que traes es bienvenido.
            </p>
            <Link
              to="/contacto"
              className="inline-block rounded-full bg-brand-salvia px-8 py-4 text-base font-medium text-brand-deep transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              Agendar primera consulta
            </Link>
          </div>
        </div>
      </section>

      {/* CTA dark */}
      <section className="bg-brand-deep px-6 py-32 text-brand-cream">
        <div className="mx-auto max-w-3xl space-y-12 text-center">
          <h2 className="font-serif text-4xl leading-tight md:text-5xl">
            ¿Quieres dar el primer paso hacia el autoconocimiento?
          </h2>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-sm">
            <p className="mb-8 font-light italic text-brand-soft md:text-xl">
              Escríbeme por WhatsApp o desde el formulario de contacto.
              Resuelvo dudas sin compromiso.
            </p>
            <div className="flex flex-col justify-center gap-4 md:flex-row">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-block rounded-full bg-brand-accent px-10 py-4 font-bold text-brand-deep transition-transform hover:scale-105"
              >
                Enviar WhatsApp
              </a>
              <Link
                to="/contacto"
                className="rounded-full border border-white/20 px-10 py-4 font-medium transition-colors hover:bg-white/10"
              >
                Formulario de contacto
              </Link>
            </div>
          </div>
          <p className="mx-auto max-w-md text-xs italic leading-relaxed text-brand-cream/60">
            Este espacio no atiende crisis o emergencias inmediatas. En México,
            si necesitas ayuda urgente, contacta a la Línea de la Vida al 800
            911 2000.
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
