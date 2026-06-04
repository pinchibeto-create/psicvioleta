import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHero } from "@/components/PageHero";

export const Route = createFileRoute("/privacidad")({
  head: () => ({
    meta: [
      { title: "Aviso de privacidad — Psic. Violeta Guillén" },
      { name: "description", content: "Aviso de privacidad y tratamiento de datos personales." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Privacidad,
});

function Privacidad() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Legal"
        title="Aviso de privacidad"
        intro="Lic. Violeta Guillén, responsable del tratamiento de tus datos personales, se compromete a protegerlos conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares."
      />
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-3xl space-y-6 text-brand-deep/80">
          <h2 className="font-serif text-2xl text-brand-deep">
            Datos que recabamos
          </h2>
          <p>
            Recabamos tu nombre, datos de contacto e información que voluntariamente
            compartas para coordinar una primera consulta. Pueden considerarse datos
            sensibles los relacionados con tu salud mental.
          </p>
          <h2 className="font-serif text-2xl text-brand-deep">Finalidades</h2>
          <p>
            Atender tu solicitud, agendar sesiones, dar seguimiento clínico y
            cumplir obligaciones profesionales y legales.
          </p>
          <h2 className="font-serif text-2xl text-brand-deep">Tus derechos</h2>
          <p>
            Puedes ejercer en cualquier momento tus derechos ARCO (acceso,
            rectificación, cancelación, oposición) escribiendo al medio de
            contacto que aparece en este sitio.
          </p>
          <p className="text-sm italic text-brand-deep/60">
            Última actualización: {new Date().toLocaleDateString("es-MX")}
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
