import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHero } from "@/components/PageHero";

const SITE_URL = "https://terapiaconvioleta.com";
const PAGE_URL = `${SITE_URL}/terapia-neurodivergencias-cholula`;

const faqs = [
  {
    q: "¿Necesito un diagnóstico de TDAH o autismo para iniciar terapia?",
    a: "No. La psicoterapia puede empezar desde tus experiencias, necesidades y dudas. Si buscas una evaluación formal, es un proceso diferente y podemos distinguir ambas rutas.",
  },
  {
    q: "¿Qué significa un enfoque neuroafirmativo?",
    a: "Implica reconocer distintas formas de procesar, sentir, comunicar y organizarse sin asumir que la diferencia debe corregirse. El objetivo es comprender necesidades y construir apoyos útiles para tu vida.",
  },
  {
    q: "¿La terapia neuroafirmativa puede ser online?",
    a: "Sí. Hay sesiones presenciales en San Andrés Cholula y sesiones online por videollamada.",
  },
  {
    q: "¿La psicoterapia sustituye una evaluación neuropsicológica?",
    a: "No. La terapia y la evaluación tienen objetivos distintos. Si necesitas explorar formalmente un perfil cognitivo o una hipótesis diagnóstica, puedes solicitar información sobre evaluación neuropsicológica.",
  },
];

export const Route = createFileRoute("/terapia-neurodivergencias-cholula")({
  head: () => ({
    meta: [
      {
        title: "Terapia neuroafirmativa en Cholula | TDAH y autismo",
      },
      {
        name: "description",
        content:
          "Terapia neuroafirmativa en San Andrés Cholula y online para personas con TDAH, autismo o dudas sobre neurodivergencia, sobrecarga, identidad y enmascaramiento.",
      },
      {
        property: "og:title",
        content: "Terapia neuroafirmativa en Cholula | Psic. Violeta Guillén",
      },
      {
        property: "og:description",
        content:
          "Psicoterapia para explorar neurodivergencia, sobrecarga, enmascaramiento, límites e identidad desde una mirada no capacitista.",
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
              name: "Psicoterapia neuroafirmativa",
              url: PAGE_URL,
              serviceType: "Psicoterapia individual con enfoque neuroafirmativo",
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
  component: TerapiaNeurodivergencias,
});

function TerapiaNeurodivergencias() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Enfoque neuroafirmativo · Cholula y online"
        title={
          <>
            Terapia para neurodivergencias en Cholula sin pedirte que{" "}
            <em className="italic">encajes</em>.
          </>
        }
        intro="Si sospechas TDAH o autismo, has pasado años adaptándote a costa de agotarte o ya tienes un diagnóstico y quieres comprenderte desde una mirada menos patologizante, este puede ser un espacio para explorar tus necesidades con respeto."
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
                Experiencias frecuentes
              </span>
              <h2 className="mt-3 font-serif text-3xl text-brand-deep">
                Cuando adaptarte todo el tiempo empieza a pesar
              </h2>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2">
              {[
                "Terminas reuniones o espacios sociales completamente agotada/o.",
                "Imitas formas de hablar, mirar o reaccionar para no destacar.",
                "La sobrecarga sensorial o emocional aparece antes de que puedas explicarla.",
                "Tareas aparentemente sencillas se vuelven difíciles de iniciar u organizar.",
                "Has recibido mensajes de que eres demasiado intensa/o, sensible o distraída/o.",
                "Quieres entender qué apoyos, límites y ritmos funcionan realmente para ti.",
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
              El enfoque
            </span>
            <h2 className="mt-3 font-serif text-3xl text-brand-deep">
              Comprender antes que corregir
            </h2>
            <p className="mx-auto mt-5 max-w-3xl leading-relaxed text-brand-deep/70">
              El objetivo no es enseñarte a parecer menos neurodivergente. El
              trabajo terapéutico busca comprender tu experiencia, identificar
              lo que te sobrecarga y construir formas más sostenibles de habitar
              tus vínculos, responsabilidades e identidad.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              [
                "Necesidades y regulación",
                "Reconocer señales de sobrecarga, necesidades sensoriales, descansos y apoyos antes de llegar al límite.",
              ],
              [
                "Enmascaramiento e identidad",
                "Explorar qué partes de ti has aprendido a esconder y qué significa relacionarte con más autenticidad y seguridad.",
              ],
              [
                "Autocompasión y límites",
                "Cuestionar exigencias construidas desde parámetros ajenos y desarrollar límites que respeten tu funcionamiento.",
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
            <span className="text-[10px] font-semibold uppercase tracking-widest text-brand-sage">
              Psicoterapia
            </span>
            <h2 className="mt-3 font-serif text-2xl text-brand-deep">
              Acompañamiento neuroafirmativo
            </h2>
            <p className="mt-4 leading-relaxed text-brand-deep/70">
              Si buscas un espacio continuo para trabajar sobrecarga, identidad,
              vínculos, autoestima, límites o adaptación, la psicoterapia es la
              ruta adecuada.
            </p>
          </div>
          <div className="rounded-3xl bg-white p-8 ring-1 ring-brand-deep/5">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-brand-sage">
              Evaluación
            </span>
            <h2 className="mt-3 font-serif text-2xl text-brand-deep">
              Cuando buscas mayor claridad diagnóstica
            </h2>
            <p className="mt-4 leading-relaxed text-brand-deep/70">
              Si tu objetivo es explorar formalmente un perfil cognitivo o una
              hipótesis sobre TDAH, autismo u otra condición, la evaluación es un
              proceso distinto.
            </p>
            <Link
              to="/evaluaciones-neuropsicologicas"
              className="mt-5 inline-block text-sm font-semibold text-brand-sage hover:text-brand-deep"
            >
              Conocer evaluación neuropsicológica →
            </Link>
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
              Antes de iniciar
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
            No necesitas demostrar que tus necesidades son “suficientes”
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-brand-cream/75">
            Podemos empezar conversando sobre lo que te está agotando, lo que
            necesitas comprender y el tipo de acompañamiento que tendría sentido
            para ti.
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
