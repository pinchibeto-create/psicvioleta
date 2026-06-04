import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

const navLinks = [
  { to: "/", label: "Inicio" },
  { to: "/sobre-mi", label: "Sobre mí" },
  { to: "/psicoterapia", label: "Psicoterapia" },
  { to: "/evaluaciones-neuropsicologicas", label: "Evaluaciones" },
  { to: "/talleres", label: "Talleres" },
  { to: "/recursos", label: "Recursos" },
] as const;

const WHATSAPP_URL =
  "https://wa.me/525500000000?text=Hola%20Violeta%2C%20me%20gustar%C3%ADa%20informaci%C3%B3n%20sobre%20una%20primera%20consulta.";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-brand-soft">
      <Header />
      <main>{children}</main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}

function Header() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-brand-deep/5 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link
          to="/"
          className="font-serif text-base font-bold tracking-tight md:text-xl"
        >
          Psic. Violeta Guillén
        </Link>
        <div className="hidden items-center gap-7 text-xs font-medium uppercase tracking-widest lg:flex">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="transition-colors hover:text-brand-accent"
              activeProps={{ className: "text-brand-accent" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/contacto"
            className="rounded-full bg-brand-deep px-5 py-2 text-brand-cream transition-all hover:bg-brand-sage"
          >
            Agendar
          </Link>
        </div>
        <Link
          to="/contacto"
          className="rounded-full bg-brand-deep px-4 py-2 text-xs font-medium uppercase tracking-widest text-brand-cream lg:hidden"
        >
          Agendar
        </Link>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="border-t border-brand-deep/5 px-6 py-12">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3">
        <div>
          <p className="font-serif text-lg font-bold">Psic. Violeta Guillén</p>
          <p className="mt-2 text-sm italic text-brand-deep/60">
            Cédula profesional 15253825
          </p>
          <p className="mt-1 text-sm text-brand-deep/60">
            San Juan Aquiahuac, San Andrés Cholula, Puebla.
          </p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-deep/50">
            Navegación
          </p>
          <ul className="mt-4 grid grid-cols-2 gap-2 text-sm">
            {navLinks.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="text-brand-deep/80 hover:text-brand-accent"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/contacto"
                className="text-brand-deep/80 hover:text-brand-accent"
              >
                Contacto
              </Link>
            </li>
            <li>
              <Link
                to="/privacidad"
                className="text-brand-deep/80 hover:text-brand-accent"
              >
                Privacidad
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-deep/50">
            Encuéntrame
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a
                href="https://www.instagram.com/psic.violetaguillen/"
                target="_blank"
                rel="noreferrer"
                className="text-brand-deep/80 hover:text-brand-accent"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href="https://www.doctoralia.com.mx/violeta-guillen/psicologo/san-andres-cholula"
                target="_blank"
                rel="noreferrer"
                className="text-brand-deep/80 hover:text-brand-accent"
              >
                Doctoralia
              </a>
            </li>
            <li>
              <a
                href="https://www.psico.mx/psicologos/bertha-violeta-guillen-lopez"
                target="_blank"
                rel="noreferrer"
                className="text-brand-deep/80 hover:text-brand-accent"
              >
                Psico.mx
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-7xl border-t border-brand-deep/5 pt-6 text-center text-[10px] uppercase tracking-widest text-brand-deep/40">
        © {new Date().getFullYear()} Psic. Violeta Guillén · Hecho con sensibilidad
      </div>
    </footer>
  );
}

function FloatingWhatsApp() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noreferrer"
      aria-label="Enviar WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex size-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-xl transition-transform hover:scale-110"
    >
      <svg viewBox="0 0 24 24" className="size-7" fill="currentColor" aria-hidden>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.414 0 0 5.414 0 12.05c0 2.123.553 4.197 1.603 6.02L0 24l6.137-1.61a11.791 11.791 0 0 0 5.908 1.567h.005c6.635 0 12.05-5.415 12.05-12.05 0-3.219-1.253-6.244-3.53-8.52" />
      </svg>
    </a>
  );
}

export { WHATSAPP_URL };
