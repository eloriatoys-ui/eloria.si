import Reveal from "./Reveal";

type AgeBucket = {
  label: string;
  image: string;
  bg: string; // CSS color/gradient for the circle
  href: string;
};

const ages: AgeBucket[] = [
  {
    label: "0–18 Months",
    image: "/age/1.png",
    bg: "radial-gradient(circle at 30% 30%, #FEF3C7 0%, #FDE68A 100%)",
    href: "/shop?age=0-18m",
  },
  {
    label: "18–36 Months",
    image: "/age/2.png",
    bg: "radial-gradient(circle at 30% 30%, #FBCFE8 0%, #F9A8D4 100%)",
    href: "/shop?age=18-36m",
  },
  {
    label: "3–5 Years",
    image: "/age/3.png",
    bg: "radial-gradient(circle at 30% 30%, #BBF7D0 0%, #6EE7B7 100%)",
    href: "/shop?age=3-5y",
  },
  {
    label: "6–8 Years",
    image: "/age/4.png",
    bg: "radial-gradient(circle at 30% 30%, #DDD6FE 0%, #C4B5FD 100%)",
    href: "/shop?age=6-8y",
  },
  {
    label: "9–14 Years",
    image: "/age/5.png",
    bg: "radial-gradient(circle at 30% 30%, #BAE6FD 0%, #93C5FD 100%)",
    href: "/shop?age=9-14y",
  },
];

function AgeCircle({ a }: { a: AgeBucket }) {
  return (
    <a
      href={a.href}
      className="group flex flex-col items-center gap-3 transition-transform duration-300 hover:-translate-y-1"
    >
      <div
        className="relative grid place-items-center overflow-hidden rounded-full transition-transform duration-300 group-hover:scale-105"
        style={{
          width: "min(180px, 100%)",
          aspectRatio: "1 / 1",
          background: a.bg,
          boxShadow:
            "0 1px 2px rgba(194, 65, 12, 0.08), 0 14px 32px -10px rgba(194, 65, 12, 0.22)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={a.image}
          alt={a.label}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.12))" }}
        />
      </div>
      <span
        className="text-[12px] font-extrabold uppercase tracking-[0.16em] text-ink sm:text-[13px]"
        style={{ letterSpacing: "0.16em" }}
      >
        {a.label}
      </span>
    </a>
  );
}

export default function ShopByAge() {
  return (
    <section className="bg-cream py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-orange-dark">
                <span className="h-1 w-6 rounded-full bg-orange" />
                Right toy, right age
              </p>
              <h2
                className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl md:text-5xl"
                style={{ letterSpacing: "-0.025em" }}
              >
                Shop by age
              </h2>
            </div>
            <a
              href="/shop"
              className="hidden items-center gap-1.5 self-start rounded-full border border-orange-dark/25 px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-orange hover:bg-orange hover:text-pearl md:inline-flex"
            >
              View all →
            </a>
          </div>
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-y-8 sm:grid-cols-3 md:mt-14 md:grid-cols-5 md:gap-x-4">
          {ages.map((a, i) => (
            <Reveal key={a.label} delay={i * 80}>
              <AgeCircle a={a} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
