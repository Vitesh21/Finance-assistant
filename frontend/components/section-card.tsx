import { ReactNode } from "react";

export function SectionCard({
  title,
  eyebrow,
  children
}: {
  title: string;
  eyebrow?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-white/10 bg-panel p-6 shadow-lg shadow-black/10">
      {eyebrow ? <p className="text-xs uppercase tracking-[0.24em] text-accent">{eyebrow}</p> : null}
      <h2 className="mt-2 text-xl font-semibold text-white">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}
