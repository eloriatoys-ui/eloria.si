import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Kontakt · Sodelovanje",
  description:
    "Stopite v stik z Eloria — za sodelovanje, medije, veleprodajo ali vprašanja o naročilu. Pišite nam prek obrazca ali na eloriatoys@gmail.com.",
  alternates: { canonical: "/kontakt" },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-cream">
      <Navbar />
      <section className="mx-auto max-w-3xl px-5 py-12 md:px-8 md:py-16">
        <div className="text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-orange-dark">
            Kontakt
          </p>
          <h1 className="mt-3 text-3xl font-extrabold text-ink md:text-4xl">
            Stopite v stik z nami
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-ink/75">
            Za sodelovanje, medije, veleprodajo ali karkoli drugega — z veseljem
            slišimo od vas. Odgovorimo hitro, običajno v enem delovnem dnevu.
          </p>
          <p className="mt-3 text-[14px] font-semibold text-ink">
            Ali nam pišite neposredno:{" "}
            <a href="mailto:eloriatoys@gmail.com" className="text-orange-dark hover:underline">
              eloriatoys@gmail.com
            </a>
          </p>
        </div>

        <div className="mt-9">
          <ContactForm />
        </div>

        {/* Opening hours + socials */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-orange-dark/15 bg-pearl p-6">
            <h2 className="text-[13px] font-extrabold uppercase tracking-[0.16em] text-orange-dark">
              Odpiralni čas
            </h2>
            <ul className="mt-3 flex flex-col gap-1.5 text-[14px] text-ink/85">
              <li className="flex justify-between gap-4">
                <span>Ponedeljek – Sobota</span>
                <span className="font-semibold text-ink">8.00 – 22.00</span>
              </li>
              <li className="flex justify-between gap-4">
                <span>Nedelja</span>
                <span className="font-semibold text-ink">9.00 – 17.00</span>
              </li>
            </ul>
          </div>
          <div className="rounded-2xl border border-orange-dark/15 bg-pearl p-6">
            <h2 className="text-[13px] font-extrabold uppercase tracking-[0.16em] text-orange-dark">
              Sledite nam
            </h2>
            <p className="mt-3 text-[14px] text-ink/85">
              <a
                href="https://www.instagram.com/eloria.toys/"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-orange-dark hover:underline"
              >
                Instagram @eloria.toys
              </a>
            </p>
            <p className="mt-2 text-[14px] text-ink/85">
              E-pošta:{" "}
              <a href="mailto:eloriatoys@gmail.com" className="font-semibold text-orange-dark hover:underline">
                eloriatoys@gmail.com
              </a>
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
