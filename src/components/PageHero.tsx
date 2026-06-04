import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: string;
  children?: ReactNode;
}) {
  return (
    <section className="px-6 pb-16 pt-36 md:pt-44">
      <div className="mx-auto max-w-4xl text-center">
        <span className="inline-block rounded-full bg-brand-soft px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-brand-deep">
          {eyebrow}
        </span>
        <h1 className="mt-8 font-serif text-4xl leading-[1.1] text-brand-deep md:text-6xl">
          {title}
        </h1>
        {intro && (
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-brand-deep/75">
            {intro}
          </p>
        )}
        {children && <div className="mt-10">{children}</div>}
      </div>
    </section>
  );
}
