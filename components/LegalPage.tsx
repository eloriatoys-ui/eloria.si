import type { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Shared shell for legal / info pages (privacy, terms, cookies, imprint, size guide).
export default function LegalPage({
  eyebrow,
  title,
  intro,
  updated,
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  updated?: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-cream">
      <Navbar />
      <section className="mx-auto max-w-3xl px-5 py-12 md:px-8 md:py-16">
        {eyebrow && (
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-orange-dark">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-3 text-3xl font-extrabold text-ink md:text-4xl">{title}</h1>
        {intro && <p className="mt-4 text-ink/75">{intro}</p>}
        {updated && (
          <p className="mt-2 text-[13px] text-slate">Zadnja posodobitev: {updated}</p>
        )}
        <div className="legal-body mt-8 flex flex-col gap-6 text-[15px] leading-relaxed text-ink/85">
          {children}
        </div>
      </section>
      <Footer />
    </main>
  );
}

// Small helpers for consistent section styling.
export function LegalSection({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 text-lg font-extrabold text-ink">{heading}</h2>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  );
}
