import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";

export const metadata = {
  title: "Wooden toys · Eloria",
  description:
    "Hand-crafted wooden toys made from sustainably sourced natural wood. No plastic, no compromises — just timeless play.",
};

type WoodenToy = {
  id: string;
  name: string;
  price: number;
  comparePrice?: number;
  badge?: string;
  emoji: string;
  bg: string;
  category: string;
  ageLabel: string;
};

const woodenToys: WoodenToy[] = [
  {
    id: "wt-rainbow",
    name: "Rainbow Stacking Tower",
    price: 89,
    comparePrice: 129,
    badge: "BEST-SELLER",
    emoji: "🌈",
    bg: "linear-gradient(135deg, #FBCFE8 0%, #FED7AA 100%)",
    category: "Stacking",
    ageLabel: "1–3 yrs",
  },
  {
    id: "wt-train",
    name: "Heritage Train Set",
    price: 119,
    badge: "NEW",
    emoji: "🚂",
    bg: "linear-gradient(135deg, #BAE6FD 0%, #DDD6FE 100%)",
    category: "Vehicles",
    ageLabel: "3–6 yrs",
  },
  {
    id: "wt-blocks",
    name: "Natural Wood Building Blocks",
    price: 69,
    comparePrice: 99,
    emoji: "🧱",
    bg: "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)",
    category: "Construction",
    ageLabel: "2+ yrs",
  },
  {
    id: "wt-xylo",
    name: "Tonewood Xylophone",
    price: 49,
    emoji: "🎶",
    bg: "linear-gradient(135deg, #BBF7D0 0%, #BAE6FD 100%)",
    category: "Music",
    ageLabel: "18 mo+",
  },
  {
    id: "wt-puzzle",
    name: "Forest Animals Puzzle",
    price: 39,
    emoji: "🧩",
    bg: "linear-gradient(135deg, #FED7AA 0%, #FBCFE8 100%)",
    category: "Puzzles",
    ageLabel: "2–5 yrs",
  },
  {
    id: "wt-kitchen",
    name: "Little Wooden Kitchen",
    price: 199,
    comparePrice: 259,
    badge: "BEST-SELLER",
    emoji: "🍳",
    bg: "linear-gradient(135deg, #DDD6FE 0%, #FBCFE8 100%)",
    category: "Pretend play",
    ageLabel: "3+ yrs",
  },
  {
    id: "wt-shape",
    name: "Shape Sorter Cube",
    price: 35,
    emoji: "🟦",
    bg: "linear-gradient(135deg, #FDE68A 0%, #BBF7D0 100%)",
    category: "Sensory",
    ageLabel: "12–24 mo",
  },
  {
    id: "wt-pull",
    name: "Pull-Along Duckling",
    price: 29,
    emoji: "🦆",
    bg: "linear-gradient(135deg, #FEF3C7 0%, #FED7AA 100%)",
    category: "First steps",
    ageLabel: "12+ mo",
  },
  {
    id: "wt-tea",
    name: "Heirloom Tea Set",
    price: 59,
    badge: "NEW",
    emoji: "🍵",
    bg: "linear-gradient(135deg, #FBCFE8 0%, #DDD6FE 100%)",
    category: "Pretend play",
    ageLabel: "3+ yrs",
  },
  {
    id: "wt-tools",
    name: "Carpenter's Tool Bench",
    price: 99,
    emoji: "🔨",
    bg: "linear-gradient(135deg, #BAE6FD 0%, #BBF7D0 100%)",
    category: "Pretend play",
    ageLabel: "3+ yrs",
  },
  {
    id: "wt-balance",
    name: "Balance Bike — Walnut",
    price: 169,
    comparePrice: 229,
    emoji: "🚲",
    bg: "linear-gradient(135deg, #FED7AA 0%, #FDE68A 100%)",
    category: "Outdoor",
    ageLabel: "2–4 yrs",
  },
  {
    id: "wt-abacus",
    name: "Counting Abacus",
    price: 45,
    emoji: "🧮",
    bg: "linear-gradient(135deg, #DDD6FE 0%, #BAE6FD 100%)",
    category: "Learning",
    ageLabel: "3–7 yrs",
  },
];

const categories = [...new Set(woodenToys.map((t) => t.category))];

const benefits = [
  {
    title: "100% real wood",
    body: "Beech, maple and walnut from sustainably managed European forests. No MDF, no plastic.",
  },
  {
    title: "Non-toxic finishes",
    body: "Water-based, child-safe paints and natural beeswax oils. Safe from the very first chew.",
  },
  {
    title: "Made to outlast",
    body: "Built to be passed from sibling to sibling — and one day, to the next generation.",
  },
];

function formatPrice(n: number) {
  return `${n} €`;
}

export default function WoodenToysPage() {
  return (
    <main className="min-h-screen bg-cream">
      <Navbar />

      <section className="relative overflow-hidden bg-wood-dark py-16 text-pearl md:py-24">
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage: "url('/hero-bg.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            mixBlendMode: "overlay",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 80% 20%, rgba(254, 215, 170, 0.35) 0%, transparent 50%), radial-gradient(circle at 10% 90%, rgba(251, 207, 232, 0.25) 0%, transparent 45%)",
          }}
        />

        <div className="relative mx-auto max-w-6xl px-5 md:px-8">
          <Reveal>
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-wood-light">
              <span className="h-1 w-6 rounded-full bg-orange" />
              The wooden collection
            </p>
            <h1
              className="mt-5 max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl"
              style={{ letterSpacing: "-0.03em" }}
            >
              Real wood. Real play. Built to be kept.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-pearl/80 sm:text-lg">
              No plastic, no flashing lights — just warm, hand-finished
              toys that grow with your little one and pass between
              siblings. Quietly beautiful, endlessly played with.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#collection"
                className="inline-flex items-center gap-2 rounded-full bg-orange px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-pearl shadow-lg shadow-orange/30 transition-transform hover:-translate-y-0.5"
              >
                Browse the collection →
              </a>
              <a
                href="mailto:hello@amareen.si"
                className="inline-flex items-center gap-2 rounded-full border border-pearl/30 px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-pearl transition-colors hover:bg-pearl hover:text-ink"
              >
                Custom orders
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-cream py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="grid gap-5 sm:grid-cols-3 md:gap-6">
            {benefits.map((b, i) => (
              <Reveal key={b.title} delay={i * 80}>
                <div className="h-full rounded-3xl bg-pearl p-6 ring-1 ring-orange-dark/10 transition-shadow hover:shadow-lg">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-wood-light text-wood-dark">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="mt-4 text-base font-extrabold text-ink">
                    {b.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/70">
                    {b.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="collection" className="bg-cream pb-20 pt-4 md:pb-28">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-orange-dark">
                  <span className="h-1 w-6 rounded-full bg-orange" />
                  Coming soon · preview
                </p>
                <h2
                  className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl md:text-5xl"
                  style={{ letterSpacing: "-0.025em" }}
                >
                  The collection
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink/70 sm:text-base">
                  These are the pieces we&apos;re hand-finishing right now.
                  Real photos and stock are landing soon — leave us your
                  email and we&apos;ll let you know the moment a piece
                  goes live.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {categories.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center rounded-full border border-orange-dark/15 bg-pearl px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/70"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          <div className="mt-10 grid grid-cols-2 gap-4 md:mt-14 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {woodenToys.map((t, i) => {
              const onSale =
                typeof t.comparePrice === "number" && t.comparePrice > t.price;
              const discount = onSale
                ? Math.round(
                    ((t.comparePrice! - t.price) / t.comparePrice!) * 100,
                  )
                : 0;
              return (
                <Reveal key={t.id} delay={(i % 4) * 60}>
                  <article className="group flex h-full flex-col overflow-hidden rounded-3xl bg-pearl ring-1 ring-orange-dark/10 transition-all hover:-translate-y-1 hover:shadow-xl">
                    <div
                      className="relative aspect-square overflow-hidden"
                      style={{ background: t.bg }}
                    >
                      <div className="absolute inset-0 grid place-items-center text-7xl transition-transform duration-500 group-hover:scale-110 md:text-8xl">
                        <span aria-hidden>{t.emoji}</span>
                      </div>

                      <span className="absolute left-3 top-3 rounded-full bg-pearl/90 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-ink shadow">
                        Coming soon
                      </span>

                      {t.badge && (
                        <span className="absolute right-3 top-3 rounded-full bg-orange px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-pearl shadow">
                          {t.badge}
                        </span>
                      )}

                      {onSale && (
                        <span className="absolute bottom-3 right-3 rounded-full bg-wood-dark px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-pearl shadow">
                          −{discount}%
                        </span>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col gap-3 p-4">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-orange-dark">
                          {t.category}
                        </span>
                        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink/50">
                          {t.ageLabel}
                        </span>
                      </div>

                      <h3 className="text-sm font-extrabold leading-snug text-ink">
                        {t.name}
                      </h3>

                      <div className="mt-auto flex items-end justify-between gap-2">
                        <div className="flex items-baseline gap-2">
                          <span className="text-base font-extrabold text-ink">
                            {formatPrice(t.price)}
                          </span>
                          {onSale && (
                            <span className="text-xs text-ink/40 line-through">
                              {formatPrice(t.comparePrice!)}
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          disabled
                          className="inline-flex cursor-not-allowed items-center gap-1 rounded-full bg-ink/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-ink/40"
                        >
                          Notify me
                        </button>
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-cream pb-20 md:pb-28">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <Reveal>
            <div
              className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-wood-dark to-orange-deep p-8 text-pearl md:p-14"
              style={{ boxShadow: "0 30px 60px -20px rgba(28, 25, 23, 0.45)" }}
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-25"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 80% 20%, #FED7AA 0%, transparent 45%), radial-gradient(circle at 10% 100%, #FBCFE8 0%, transparent 40%)",
                }}
              />
              <div className="relative grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-center">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-pearl/70">
                    Be the first
                  </p>
                  <h2
                    className="mt-3 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl"
                    style={{ letterSpacing: "-0.025em" }}
                  >
                    Get notified when a piece goes live.
                  </h2>
                  <p className="mt-4 max-w-xl text-base leading-relaxed text-pearl/85 sm:text-lg">
                    Small batches, hand-finished one at a time. Drop your
                    email and we&apos;ll let you know the moment your
                    favourite is ready to ship.
                  </p>
                  <form
                    className="mt-7 flex w-full max-w-md flex-col gap-3 sm:flex-row"
                    action="mailto:hello@amareen.si"
                    method="post"
                  >
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      className="flex-1 rounded-full border border-pearl/30 bg-pearl/10 px-5 py-3 text-sm text-pearl placeholder-pearl/50 outline-none transition-colors focus:bg-pearl focus:text-ink focus:placeholder-ink/40"
                    />
                    <button
                      type="submit"
                      className="rounded-full bg-orange px-6 py-3 text-sm font-bold uppercase tracking-[0.14em] text-pearl shadow-lg transition-transform hover:-translate-y-0.5"
                    >
                      Notify me
                    </button>
                  </form>
                </div>

                <div className="hidden md:block">
                  <div className="relative aspect-square overflow-hidden rounded-[28px] bg-wood-light/30 ring-1 ring-pearl/10">
                    <div className="absolute inset-0 grid place-items-center text-9xl">
                      <span aria-hidden>🪵</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  );
}
