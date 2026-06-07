import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TrackForm from "@/components/TrackForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Sledenje naročilu — Eloria",
  description: "Spremljajte stanje svojega naročila.",
};

export default function TrackPage({
  searchParams,
}: {
  searchParams: { o?: string };
}) {
  return (
    <main className="min-h-screen bg-cream">
      <Navbar />
      <section className="mx-auto max-w-xl px-5 py-12 md:px-8 md:py-16">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-ink md:text-4xl">Sledenje naročilu</h1>
          <p className="mt-2 text-[15px] text-ink/70">
            Vnesite številko naročila in e-naslov, ki ste ga uporabili pri nakupu.
          </p>
        </div>
        <div className="mt-10">
          <TrackForm initialOrderNumber={searchParams.o ?? ""} />
        </div>
      </section>
      <Footer />
    </main>
  );
}
