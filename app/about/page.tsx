import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import T from "@/components/T";

export const metadata = {
  title: "Our story · Eloria",
  description:
    "We never stopped believing in fairy tales. Eloria was born in 2020 from two new parents who couldn't find toys and clothes worth keeping.",
};

const values = [
  { titleKey: "about.values.v1.title", bodyKey: "about.values.v1.body" },
  { titleKey: "about.values.v2.title", bodyKey: "about.values.v2.body" },
  { titleKey: "about.values.v3.title", bodyKey: "about.values.v3.body" },
  { titleKey: "about.values.v4.title", bodyKey: "about.values.v4.body" },
];

const stats = [
  { value: "2020", labelKey: "about.stats.year" },
  { value: "6,000+", labelKey: "about.stats.homes" },
  { value: "100%", labelKey: "about.stats.tested" },
  { value: "5★", labelKey: "about.stats.rating" },
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
              <T id="about.eyebrow" />
            </p>
          </Reveal>

          <div className="mt-5 grid gap-10 md:mt-8 md:grid-cols-[1.2fr_1fr] md:items-center md:gap-14">
            <Reveal>
              <h1
                className="text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl md:text-6xl"
                style={{ letterSpacing: "-0.03em" }}
              >
                <T id="about.title" />
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-ink/75 sm:text-lg">
                <T id="about.lead" />
              </p>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-ink/75 sm:text-lg">
                <T id="about.lead2" />
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="/shop"
                  className="inline-flex items-center gap-2 rounded-full bg-wood-dark px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-pearl shadow-lg shadow-wood-dark/30 transition-transform hover:-translate-y-0.5"
                >
                  <T id="about.cta_shop" />
                </a>
                <a
                  href="mailto:hello@amareen.si"
                  className="inline-flex items-center gap-2 rounded-full border border-orange-dark/25 px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-ink transition-colors hover:border-orange hover:bg-orange hover:text-pearl"
                >
                  <T id="about.cta_hello" />
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
                <T id="about.began.eyebrow" />
              </p>
              <h2
                className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl md:text-5xl"
                style={{ letterSpacing: "-0.025em" }}
              >
                <T id="about.began.title" />
              </h2>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-ink/75 sm:text-lg">
                <p>
                  <T id="about.began.p1" />
                </p>
                <p>
                  <T id="about.began.p2" />
                </p>
                <p>
                  <T id="about.began.p3_pre" />
                  <strong><T id="about.began.p3_strong" /></strong>
                  <T id="about.began.p3_post" />
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
              <T id="about.values.eyebrow" />
            </p>
            <h2
              className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight text-pearl sm:text-4xl md:text-5xl"
              style={{ letterSpacing: "-0.025em" }}
            >
              <T id="about.values.title" />
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
            {values.map((v, i) => (
              <Reveal key={v.titleKey} delay={i * 90}>
                <div className="h-full rounded-3xl bg-pearl/5 p-7 ring-1 ring-pearl/10 backdrop-blur-sm transition-transform hover:-translate-y-1">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-orange text-pearl">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="mt-5 text-lg font-extrabold leading-snug text-pearl">
                    <T id={v.titleKey} />
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-pearl/70">
                    <T id={v.bodyKey} />
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
              <T id="about.ages.eyebrow" />
            </p>
            <h2
              className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight text-ink sm:text-4xl md:text-5xl"
              style={{ letterSpacing: "-0.025em" }}
            >
              <T id="about.ages.title" />
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink/75 sm:text-lg">
              <T id="about.ages.subtitle" />
            </p>
          </Reveal>

          <div className="mt-12 grid grid-cols-2 gap-y-8 sm:grid-cols-3 md:mt-14 md:grid-cols-5 md:gap-x-4">
            {[
              { labelKey: "age.0_18m", img: "/age/1.png", bg: "radial-gradient(circle at 30% 30%, #FEF3C7 0%, #FDE68A 100%)" },
              { labelKey: "age.18_36m", img: "/age/2.png", bg: "radial-gradient(circle at 30% 30%, #FBCFE8 0%, #F9A8D4 100%)" },
              { labelKey: "age.3_5y", img: "/age/3.png", bg: "radial-gradient(circle at 30% 30%, #BBF7D0 0%, #6EE7B7 100%)" },
              { labelKey: "age.6_8y", img: "/age/4.png", bg: "radial-gradient(circle at 30% 30%, #DDD6FE 0%, #C4B5FD 100%)" },
              { labelKey: "age.9_14y", img: "/age/5.png", bg: "radial-gradient(circle at 30% 30%, #BAE6FD 0%, #93C5FD 100%)" },
            ].map((a, i) => (
              <Reveal key={a.labelKey} delay={i * 80}>
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
                      alt=""
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                  <span className="text-[12px] font-extrabold uppercase tracking-[0.16em] text-ink">
                    <T id={a.labelKey} />
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
                  key={s.labelKey}
                  className="flex flex-col items-center justify-center gap-2 bg-pearl px-4 py-8 md:py-12"
                >
                  <span
                    className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl md:text-5xl"
                    style={{ letterSpacing: "-0.03em" }}
                  >
                    {s.value}
                  </span>
                  <span className="text-center text-[11px] font-bold uppercase tracking-[0.18em] text-orange-dark">
                    <T id={s.labelKey} />
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
                    <T id="about.cta.eyebrow" />
                  </p>
                  <h2
                    className="mt-3 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl"
                    style={{ letterSpacing: "-0.025em" }}
                  >
                    <T id="about.cta.title" />
                  </h2>
                  <p className="mt-4 max-w-xl text-base leading-relaxed text-pearl/85 sm:text-lg">
                    <T id="about.cta.body" />
                  </p>
                  <div className="mt-7 flex flex-wrap items-center gap-3">
                    <a
                      href="/shop"
                      className="inline-flex items-center gap-2 rounded-full bg-pearl px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-ink shadow-lg transition-transform hover:-translate-y-0.5"
                    >
                      <T id="about.cta.shop" />
                    </a>
                    <a
                      href="/shop?onSale=1"
                      className="inline-flex items-center gap-2 rounded-full border border-pearl/40 px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-pearl transition-colors hover:bg-pearl hover:text-ink"
                    >
                      <T id="about.cta.sale" />
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
