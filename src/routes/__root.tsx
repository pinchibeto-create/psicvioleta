import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import portrait from "../assets/violeta-portrait.jpg";
import { reportLovableError } from "../lib/lovable-error-reporting";

const SITE_URL = "https://terapiaconvioleta.com";
const SOCIAL_IMAGE = `${SITE_URL}${portrait}`;
const SAME_AS = [
  "https://www.instagram.com/psic.violetaguillen/",
  "https://www.doctoralia.com.mx/violeta-guillen/psicologo/san-andres-cholula",
  "https://www.psico.mx/psicologos/bertha-violeta-guillen-lopez",
];

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-7xl text-brand-deep">404</h1>
        <h2 className="mt-4 font-serif text-xl text-brand-deep">Página no encontrada</h2>
        <p className="mt-2 text-sm text-brand-deep/60">
          La página que buscas no existe o fue movida.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-brand-salvia px-6 py-3 text-sm font-medium text-brand-deep transition-all hover:bg-brand-accent"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-xl text-brand-deep">
          La página no cargó
        </h1>
        <p className="mt-2 text-sm text-brand-deep/60">
          Algo salió mal. Puedes intentarlo de nuevo o volver al inicio.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-full bg-brand-salvia px-6 py-3 text-sm font-medium text-brand-deep transition-all hover:bg-brand-accent"
          >
            Intentar de nuevo
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-brand-deep/20 px-6 py-3 text-sm font-medium text-brand-deep transition-colors hover:bg-brand-soft"
          >
            Ir al inicio
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Psicóloga en Cholula | Psicoterapia y arteterapia — Violeta Guillén" },
      {
        name: "description",
        content:
          "Psicóloga en San Andrés Cholula y terapia online. Psicoterapia integrativa, arteterapia y enfoque neuroafirmativo para ansiedad, autoestima, neurodivergencias, duelo e identidad.",
      },
      { name: "author", content: "Psic. Violeta Guillén" },
      { name: "robots", content: "index,follow,max-image-preview:large" },
      { property: "og:site_name", content: "Psic. Violeta Guillén" },
      { property: "og:locale", content: "es_MX" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL },
      {
        property: "og:title",
        content: "Psicóloga en Cholula | Psicoterapia y arteterapia — Violeta Guillén",
      },
      {
        property: "og:description",
        content:
          "Psicoterapia presencial en San Andrés Cholula y online, con enfoque integrativo, creativo y neuroafirmativo.",
      },
      { property: "og:image", content: SOCIAL_IMAGE },
      { property: "og:image:alt", content: "Psic. Violeta Guillén en su espacio de consulta" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "Psicóloga en Cholula | Psicoterapia y arteterapia — Violeta Guillén",
      },
      {
        name: "twitter:description",
        content:
          "Psicoterapia presencial en San Andrés Cholula y online para ansiedad, neurodivergencias, autoestima e identidad.",
      },
      { name: "twitter:image", content: SOCIAL_IMAGE },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebSite",
              "@id": `${SITE_URL}/#website`,
              url: SITE_URL,
              name: "Psic. Violeta Guillén",
              description:
                "Psicoterapia, arteterapia y acompañamiento neuroafirmativo en San Andrés Cholula y en línea.",
              inLanguage: "es-MX",
              publisher: { "@id": `${SITE_URL}/#practice` },
            },
            {
              "@type": "ProfessionalService",
              "@id": `${SITE_URL}/#practice`,
              name: "Psic. Violeta Guillén",
              url: SITE_URL,
              image: SOCIAL_IMAGE,
              description:
                "Psicoterapia integrativa, arteterapia, evaluaciones neuropsicológicas y talleres en San Andrés Cholula y en línea.",
              address: {
                "@type": "PostalAddress",
                addressLocality: "San Andrés Cholula",
                addressRegion: "Puebla",
                addressCountry: "MX",
              },
              areaServed: [
                { "@type": "City", name: "San Andrés Cholula" },
                { "@type": "AdministrativeArea", name: "Puebla" },
                { "@type": "Country", name: "México" },
              ],
              sameAs: SAME_AS,
              employee: { "@id": `${SITE_URL}/#violeta` },
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Servicios psicológicos",
                itemListElement: [
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Psicoterapia individual",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Evaluaciones neuropsicológicas",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Talleres psicoeducativos",
                    },
                  },
                ],
              },
            },
            {
              "@type": "Person",
              "@id": `${SITE_URL}/#violeta`,
              name: "Violeta Guillén",
              url: `${SITE_URL}/sobre-mi`,
              image: SOCIAL_IMAGE,
              jobTitle: "Psicóloga",
              worksFor: { "@id": `${SITE_URL}/#practice` },
              identifier: {
                "@type": "PropertyValue",
                propertyID: "Cédula profesional",
                value: "15253825",
              },
              sameAs: SAME_AS,
              knowsAbout: [
                "Psicoterapia integrativa",
                "Arteterapia",
                "Ansiedad",
                "Autoestima",
                "Neurodivergencias",
                "Identidad",
              ],
            },
          ],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="es-MX">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
