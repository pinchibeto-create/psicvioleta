import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHero } from "@/components/PageHero";

const SITE_URL = "https://terapiaconvioleta.com";
const PAGE_URL = `${SITE_URL}/terapia-ansiedad-cholula`;

const faqs = [
  {
    q: "¿Necesito tener un diagnóstico de ansiedad para empezar terapia?",
    a: "No. Podemos empezar por lo que estás viviendo: pensamientos que no paran, tensión, miedo, irritabilidad, dificultad para descansar o cualquier experiencia que hoy te esté rebasando.",
  },
  {
    q: "¿La terapia para ansiedad puede ser en línea?",
    a: "Sí. Puedes elegir sesiones presenciales en San Andrés Cholula o sesiones online por videollamada.",
  },
  {
    q: "¿Qué pasa si no sé explicar lo que siento?",
    a: "No necesitas llegar con todo claro. La conversación y, cuando tiene sentido para ti, recursos creativos pueden ayudarnos a explorar la experiencia sin forzarla.",
  },
  {
    q: "¿Cuánto tiempo toma sentirme mejor?",
    a: "Cada proceso es distinto. No se prometen resultados rápidos ni un número fijo de sesiones; los objetivos y el ritmo se construyen contigo.",
  },
];

export const Route = createFileRoute("/terapia-ansiedad-cholula")({
  head: () => ({
    meta: [
      { title: "Terapia para ansiedad en Cholula | Psic. Violeta Guillén" },
      {
        name: "description",
        content:
          "Terapia para ansiedad en San Andrés Cholula y online. Acompañamiento para sobrepensamiento, estrés, alerta constante y dificultad para poner límites.",
      },
      {
        property: "og:title",
        content: "Terapia para ansiedad en Cholula | Psic. Violeta Guillén",
      },
      {
        property: "og:description",
        content:
          "Psicoterapia presencial en Cholula y online para explorar ansiedad, sobrepensamiento, estrés y formas de relacionarte contigo.",
      },
      { property: "og:url", content: PAGE_URL },
    ],
    links: [{ rel: "canonical", href: PAGE_URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Service",
              "@id": `${PAGE_URL}#service`,
              name: "Psicoterapia para ansiedad",
              url: PAGE_URL,
              serviceType: "Psicoterapia individual",
              provider: { "@id": `${SITE_URL}/#practice` },
              areaServed: [
                { "@type": "City", name: "San Andrés Cholula" },
                { "@type": "AdministrativeArea", name: "Puebla" },
                { "@type": "Country", name: "México" },
              ],
              availableChannel: [
                { "@type": "ServiceChannel", name: "Presencial" },
                { "@type": "ServiceChannel", name: "Online" },
              ],
            },
            {
              "@type": "FAQPage",
              mainEntity: faqs.map((faq) => ({
                "@type": "Question",
                name: faq.q,
                acceptedAnswer: { "@type": "Answer", text: faq.a },
              })),
            },
          ],
        }),
      },
    ],
  }),
  component: TerapiaAnsiedad,
});

function TerapiaAnsiedad() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Ansiedad · Presencial en Cholula y online"
        title={
          <>
            Terapia para ansiedad en Cholula cuando tu mente{" "}
            <em className="italic">no descansa</em>.
          </>
        }
        intro="Si sobrepiensas cada conversación, anticipas lo peor, sientes el cuerpo en alerta o te cuesta descansar sin culpa, no necesitas llegar con una explicación perfecta. Podemos empezar por lo que hoy estás viviendo."
      >
        <Link
          to="/contacto"
          className="inline-block rounded-full bg-brand-salvia px-8 py-4 font-medium text-brand-deep transition-all hover:-translate-y-1 hover:shadow-xl"
        >
          Ver horarios y agendar
        </Link>
      </PageHero>

      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 md:grid-cols-[.8fr_1.2fr]">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-brand-sage">
                ¿Te suena algo de esto?
              </span>
              <h2 className="mt-3 font-serif text-3xl text-brand-deep">
                La ansiedad no siempre se siente como miedo
              </h2>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2">
              {[
                "Repasas una y otra vez lo que dijiste o hiciste.",
                "Tu mente se adelanta a problemas que todavía no ocurren.",
                "Te cuesta bajar el ritmo incluso cuando estás cansada/o.",
                "Sientes tensión, irritabilidad o necesidad de tener todo bajo control.",
                "Poner límites activa culpa o miedo al conflicto.",
                "Te exiges funcionar bien aunque por dentro estés saturada/o.",
              ].map((item) => (
                <li
                  key={item}
                  className="rounded-2xl bg-background p-5 text-sm leading-relaxed text-brand-deep/75 ring-1 ring-brand-deep/5"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-brand-sage">
              El proceso
            </span>
            <h2 className="mt-3 font-serif text-3xl text-brand-deep">
              No se trata solo de “dejar de pensar”
            </h2>
            <p className="mx-auto mt-5 max-w-3xl leading-relaxed text-brand-deep/70">
              La psicoterapia permite entender qué activa la ansiedad, qué función
              está cumpliendo y cómo se relaciona con tus límites, vínculos,
              exigencias y forma de tratarte. El trabajo se adapta a tu experiencia,
              no al revés.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              [
                "Comprender patrones",
                "Identificar situaciones, pensamientos, emociones y respuestas corporales que mantienen el malestar.",
              ],
              [
                "Construir recursos",
                "Explorar herramientas de regulación, límites y autocuidado que tengan sentido para tu vida cotidiana.",
              ],
              [
                "Usar otros lenguajes",
                "Cuando hablar no alcanza, la arteterapia puede ofrecer una vía creativa para observar y expresar lo que sucede.",
              ],
            ].map(([title, text]) => (
              <div
                key={title}
                className="rounded-3xl border border-brand-deep/10 bg-white p-7"
              >
                <h3 className="font-serif text-xl text-brand-deep">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-brand-deep/70">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-soft/30 px-6 py-20">
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
          <div className="rounded-3xl bg-white p-8 ring-1 ring-brand-deep/5">
            <h2 className="font-serif text-2xl text-brand-deep">
              Terapia presencial en Cholula
            </h2>
            <p className="mt-4 leading-relaxed text-brand-deep/70">
              Atención presencial en San Andrés Cholula, Puebla. Puedes revisar
              horarios disponibles y solicitar una primera consulta desde la web.
            </p>
          </div>
          <div className="rounded-3xl bg-white p-8 ring-1 ring-brand-deep/5">
            <h2 className="font-serif text-2xl text-brand-deep">
              Terapia online
            </h2>
            <p className="mt-4 leading-relaxed text-brand-deep/70">
              Si vives fuera de Cholula o prefieres conectarte desde un espacio
              propio, también puedes elegir sesiones por videollamada.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-brand-sage">
              Preguntas frecuentes
            </span>
            <h2 className="mt-3 font-serif text-3xl text-brand-deep">
              Antes de tu primera sesión
            </h2>
          </div>
          <div className="mt-10 space-y-4">
            {faqs.map((faq) => (
              <article
                key={faq.q}
                className="rounded-2xl border border-brand-deep/10 bg-white p-6"
              >
                <h3 className="font-serif text-lg text-brand-deep">{faq.q}</h3>
                <p className="mt-3 text-sm leading-relaxed text-brand-deep/70">
                  {faq.a}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-deep px-6 py-20 text-brand-cream">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-3xl">
            Puedes empezar aunque todavía no tengas todo claro
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-brand-cream/75">
            La primera sesión sirve precisamente para conversar sobre lo que te
            trae, resolver dudas y pensar si este espacio se ajusta a lo que buscas.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/contacto"
              className="rounded-full bg-brand-accent px-8 py-4 font-bold text-brand-deep"
            >
              Agendar primera consulta
            </Link>
            <Link
              to="/psicoterapia"
              className="rounded-full border border-white/20 px-8 py-4 font-medium"
            >
              Conocer la psicoterapia
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
