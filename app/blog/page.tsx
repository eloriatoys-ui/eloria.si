import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { getAllPosts, formatSlDate } from "@/lib/blog";

export const metadata = {
  title: "Blog · Eloria",
  description:
    "Nasveti, navdih in zgodbe o naravni igri, lesenih igračah in organskih otroških oblačilih — z ljubeznijo zbrani pri Eloriji.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndex() {
  const posts = getAllPosts();
  return (
    <main className="min-h-screen bg-cream">
      <Navbar />

      <section className="mx-auto max-w-6xl px-5 pb-8 pt-12 md:px-8 md:pt-16">
        <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-orange-dark">
          <span className="h-1 w-6 rounded-full bg-orange" /> Eloria blog
        </p>
        <h1 className="mt-3 max-w-2xl text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl">
          Naravna igra, navdih in nasveti
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-ink/75 sm:text-lg">
          Zgodbe o lesenih igračah, organskih materialih in razvoju otrok — z ljubeznijo zbrane pri Eloriji.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-24 md:px-8">
        {posts.length === 0 ? (
          <div className="rounded-2xl border border-[#F4DCB7] bg-pearl p-10 text-center text-ink/70">
            Kmalu prihajajo prvi članki. 🌱
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl bg-pearl transition-all duration-300 hover:-translate-y-1"
                style={{ border: "1px solid #F4DCB7" }}
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-sand">
                  {p.cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.cover} alt={p.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]" />
                  ) : (
                    <div className="absolute inset-0 grid place-items-center text-3xl text-orange-dark/40">🌿</div>
                  )}
                  <span className="absolute left-3 top-3 rounded px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-pearl" style={{ background: "#7C2D12" }}>
                    {p.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <span className="text-[12px] font-semibold text-orange-dark">{formatSlDate(p.date)}</span>
                  <h2 className="mt-1.5 text-[17px] font-extrabold leading-snug tracking-tight text-ink transition-colors group-hover:text-orange-dark">{p.title}</h2>
                  <p className="mt-2 line-clamp-3 text-[13.5px] leading-relaxed text-ink/70">{p.excerpt}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.14em] text-ink">
                    Preberi več
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
