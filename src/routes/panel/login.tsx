import { createFileRoute } from "@tanstack/react-router";
import { LockKeyhole, Loader2 } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/panel/login")({
  head: () => ({
    meta: [
      { title: "Acceso privado — Terapia con Violeta" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: PanelLogin,
});

function PanelLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) window.location.replace("/panel/");
    });
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const values = new FormData(event.currentTarget);
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: String(values.get("email") ?? "").trim(),
      password: String(values.get("password") ?? ""),
    });

    if (loginError) {
      setError("El correo o la contraseña no son correctos.");
      setLoading(false);
      return;
    }

    window.location.assign("/panel/");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-cream px-6 py-12">
      <div className="w-full max-w-md rounded-[2rem] border border-brand-deep/10 bg-white p-8 shadow-xl shadow-brand-deep/5 md:p-10">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-brand-soft">
          <LockKeyhole className="size-5 text-brand-deep" />
        </div>
        <p className="mt-7 text-[10px] font-bold uppercase tracking-[.2em] text-brand-deep/45">
          Panel privado
        </p>
        <h1 className="mt-2 font-serif text-3xl text-brand-deep">Terapia con Violeta</h1>
        <p className="mt-3 text-sm leading-relaxed text-brand-deep/65">
          Inicia sesión para administrar citas, horarios y confirmaciones.
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-xs font-semibold text-brand-deep/70">Correo</span>
            <input
              required
              name="email"
              type="email"
              autoComplete="email"
              className="panel-input mt-2"
              placeholder="violeta@correo.com"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-brand-deep/70">Contraseña</span>
            <input
              required
              name="password"
              type="password"
              autoComplete="current-password"
              className="panel-input mt-2"
            />
          </label>
          {error && (
            <p role="alert" className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </p>
          )}
          <button
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-deep py-3.5 text-sm font-bold text-white transition-opacity disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Entrando…
              </>
            ) : (
              "Entrar al panel"
            )}
          </button>
        </form>

        <a
          href="/"
          className="mt-7 block text-center text-xs text-brand-deep/55 underline underline-offset-4"
        >
          Volver a la página pública
        </a>
      </div>
    </main>
  );
}
