import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";

export const metadata = {
  title: "Our story · Eloria",
  description:
    "We never stopped believing in fairy tales. Eloria was born in 2020 from two new parents who couldn't find toys and clothes worth keeping.",
};

const values = [
  {
    title: "Hand-picked, never bulk-bought",
    body: "Every product on our site is chosen one by one. If we wouldn't give it to our own children, it doesn't make the cut.",
  },
  {
    title: "Tested before it ships",
    body: "Toys, dresses, shoes — we open the box, check the stitching, press every button. You get what we already approved at home.",
  },
  {
    title: "Less screen, more imagination",
    body: "We pick toys that pull kids back into the real world: drawing tablets, building sets, role-play — not noisy, flashing distractions.",
  },
  {
    title: "One outfit, no scrolling",
    body: "Our clothing sets are pre-coordinated head-to-toe. One click, one parcel, the look is done — across every season.",
  },
];

const stats = [
  { value: "2020", label: "the year we began" },
  { value: "6,000+", label: "happy homes" },
  { value: "100%", label: "personally tested" },
  { value: "5★", label: "average rating" },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-cream">
      <Navbar />

      <section className="relative overflow-hidden bg-cream pb-16 pt-12 md:pb-24 md:pt-20">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage: "url('/hero-bg.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 20% 0%, #FED7AA 0%, transparent 55%), radial-gradient(circle at 90% 100%, #FBCFE8 0%, transparent 50%)",
            opacity: 0.55,
          }}
        />

        <div className="relative mx-auto max-w-6xl px-5 md:px-8">
          <Reveal>
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-orange-dark">
              <span className="h-1 w-6 rounded-full bg-orange" />
              Our story
            </p>
          </Reveal>

          <div className="mt-5 grid gap-10 md:mt-8 md:grid-cols-[1.2fr_1fr] md:items-center md:gap-14">
            <Reveal>
              <h1
                className="text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl md:text-6xl"
                style={{ letterSpacing: "-0.03em" }}
              >
                We never stopped believing in fairy tales.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-ink/75 sm:text-lg">
                So in 2020, we started writing our own. Two new parents,
                a tiny apartment, and the simple question every family
                eventually asks — <em>where do you find the good stuff?</em>
              </p>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-ink/75 sm:text-lg">
                The toys that don&apos;t flash and beep. The dresses that
                survive a real childhood. The little things you actually
                want to keep. We couldn&apos;t find them, so we built a place
                for them.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="/shop"
                  className="inline-flex items-center gap-2 rounded-full bg-wood-dark px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-pearl shadow-lg shadow-wood-dark/30 transition-transform hover:-translate-y-0.5"
                >
                  Visit the shop →
                </a>
                <a
                  href="mailto:hello@amareen.si"
                  className="inline-flex items-center gap-2 rounded-full border border-orange-dark/25 px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-ink transition-colors hover:border-orange hover:bg-orange hover:text-pearl"
                >
                  Say hello
                </a>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div
                className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[36px] shadow-2xl"
                style={{
                  background:
                    "radial-gradient(circle at 30% 30%, #FBCFE8 0%, #F9A8D4 100%)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/about/story-hero.jpg"
                  alt="Our story"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-cream py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="grid gap-12 md:grid-cols-[1fr_1.1fr] md:items-center md:gap-16">
            <Reveal>
              <div
                className="relative aspect-[4/5] overflow-hidden rounded-[36px] shadow-2xl"
                style={{
                  background:
                    "radial-gradient(circle at 30% 30%, #BBF7D0 0%, #6EE7B7 100%)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/about/story-creativity.jpg"
                  alt="How it began — developing creativity through play"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            </Reveal>

            <Reveal delay={120}>
              <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-orange-dark">
                <span className="h-1 w-6 rounded-full bg-orange" />
                How it began
              </p>
              <h2
                className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl md:text-5xl"
                style={{ letterSpacing: "-0.025em" }}
              >
                Built by parents, for parents.
              </h2>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-ink/75 sm:text-lg">
                <p>
                  When we became parents in 2020, the children&apos;s aisle
                  felt overwhelming and underwhelming at the same time —
                  too many flashing toys, too few thoughtful ones.
                </p>
                <p>
                  We started buying for ourselves the way we wished a shop
                  would buy for us: one piece at a time, tested at home,
                  quietly beautiful, made to last past one birthday.
                </p>
                <p>
                  Friends asked where we found things. Then friends of
                  friends. Six years later, our little selection lives in
                  more than <strong>6,000 homes</strong> — and we still
                  open every box ourselves before it ships.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="relative bg-wood-dark py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <Reveal>
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-wood-light">
              <span className="h-1 w-6 rounded-full bg-orange" />
              What we believe
            </p>
            <h2
              className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight text-pearl sm:text-4xl md:text-5xl"
              style={{ letterSpacing: "-0.025em" }}
            >
              Four small promises behind every order.
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 90}>
                <div className="h-full rounded-3xl bg-pearl/5 p-7 ring-1 ring-pearl/10 backdrop-blur-sm transition-transform hover:-translate-y-1">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-orange text-pearl">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="mt-5 text-lg font-extrabold leading-snug text-pearl">
                    {v.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-pearl/70">
                    {v.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <Reveal>
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-orange-dark">
              <span className="h-1 w-6 rounded-full bg-orange" />
              Right toy, right age
            </p>
            <h2
              className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight text-ink sm:text-4xl md:text-5xl"
              style={{ letterSpacing: "-0.025em" }}
            >
              We grow up with your little one.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink/75 sm:text-lg">
              From the first soft rattle to the first real backpack, every
              age has its own little world at Eloria.
            </p>
          </Reveal>

          <div className="mt-12 grid grid-cols-2 gap-y-8 sm:grid-cols-3 md:mt-14 md:grid-cols-5 md:gap-x-4">
            {[
              { label: "0–18 mo", img: "/age/1.png", bg: "radial-gradient(circle at 30% 30%, #FEF3C7 0%, #FDE68A 100%)" },
              { label: "18–36 mo", img: "/age/2.png", bg: "radial-gradient(circle at 30% 30%, #FBCFE8 0%, #F9A8D4 100%)" },
              { label: "3–5 yrs", img: "/age/3.png", bg: "radial-gradient(circle at 30% 30%, #BBF7D0 0%, #6EE7B7 100%)" },
              { label: "6–8 yrs", img: "/age/4.png", bg: "radial-gradient(circle at 30% 30%, #DDD6FE 0%, #C4B5FD 100%)" },
              { label: "9–14 yrs", img: "/age/5.png", bg: "radial-gradient(circle at 30% 30%, #BAE6FD 0%, #93C5FD 100%)" },
            ].map((a, i) => (
              <Reveal key={a.label} delay={i * 80}>
                <div className="flex flex-col items-center gap-3">
                  <div
                    className="relative grid place-items-center overflow-hidden rounded-full"
                    style={{
                      width: "min(160px, 100%)",
                      aspectRatio: "1 / 1",
                      background: a.bg,
                      boxShadow: "0 1px 2px rgba(194, 65, 12, 0.08), 0 14px 32px -10px rgba(194, 65, 12, 0.22)",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={a.img}
                      alt={a.label}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                  <span className="text-[12px] font-extrabold uppercase tracking-[0.16em] text-ink">
                    {a.label}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream pb-16 md:pb-24">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <Reveal>
            <div
              className="grid grid-cols-2 gap-px overflow-hidden rounded-[28px] bg-orange-dark/15 md:grid-cols-4"
              style={{ boxShadow: "0 24px 50px -20px rgba(194, 65, 12, 0.25)" }}
            >
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col items-center justify-center gap-2 bg-pearl px-4 py-8 md:py-12"
                >
                  <span
                    className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl md:text-5xl"
                    style={{ letterSpacing: "-0.03em" }}
                  >
                    {s.value}
                  </span>
                  <span className="text-center text-[11px] font-bold uppercase tracking-[0.18em] text-orange-dark">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-cream pb-20 md:pb-28">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <Reveal>
            <div
              className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-orange to-orange-dark p-8 text-pearl md:p-14"
              style={{ boxShadow: "0 30px 60px -20px rgba(194, 65, 12, 0.45)" }}
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
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-pearl/80">
                    Come say hi
                  </p>
                  <h2
                    className="mt-3 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl"
                    style={{ letterSpacing: "-0.025em" }}
                  >
                    Find something worth keeping.
                  </h2>
                  <p className="mt-4 max-w-xl text-base leading-relaxed text-pearl/85 sm:text-lg">
                    Free delivery on orders over €70. We ship within one
                    business day, from our family to yours.
                  </p>
                  <div className="mt-7 flex flex-wrap items-center gap-3">
                    <a
                      href="/shop"
                      className="inline-flex items-center gap-2 rounded-full bg-pearl px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-ink shadow-lg transition-transform hover:-translate-y-0.5"
                    >
                      Browse everything →
                    </a>
                    <a
                      href="/shop?onSale=1"
                      className="inline-flex items-center gap-2 rounded-full border border-pearl/40 px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-pearl transition-colors hover:bg-pearl hover:text-ink"
                    >
                      See sale items
                    </a>
                  </div>
                </div>

                <div className="relative hidden md:block">
                  <div
                    className="relative aspect-square overflow-hidden rounded-[28px]"
                    style={{
                      background:
                        "radial-gradient(circle at 30% 30%, #FFFFFF 0%, #FED7AA 100%)",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/age/3.png"
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                    />
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
