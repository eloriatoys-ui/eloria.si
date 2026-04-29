import Reveal from "./Reveal";

const iconClass = "h-9 w-9 md:h-10 md:w-10";

const items = [
  {
    title: "Crafted with Care",
    subtitle: "Quality you can feel",
    icon: (
      <svg
        className={iconClass}
        viewBox="0 0 48 48"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M40 22a16 16 0 1 1-32 0 16 16 0 0 1 32 0Z" />
        <path d="M24 14v8l5 4" />
        <path d="M24 6v3" />
        <path d="M24 39v3" />
        <path d="M40 22h3" />
        <path d="M5 22h3" />
      </svg>
    ),
  },
  {
    title: "Child Safe",
    subtitle: "Non-toxic finishes",
    icon: (
      <svg
        className={iconClass}
        viewBox="0 0 48 48"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M24 6 8 12v12c0 9 6 15 16 18 10-3 16-9 16-18V12L24 6Z" />
        <path d="m17 24 5 5 9-10" />
      </svg>
    ),
  },
  {
    title: "Free Delivery",
    subtitle: "On orders over 150 €",
    icon: (
      <svg
        className={iconClass}
        viewBox="0 0 56 48"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <rect x="4" y="12" width="28" height="22" rx="1.5" />
        <path d="M32 18h11l7 8v8H32V18Z" />
        <circle cx="14" cy="38" r="4" />
        <circle cx="40" cy="38" r="4" />
        <path d="M18 38h18" />
      </svg>
    ),
  },
  {
    title: "500+ Happy Families",
    subtitle: "Loved across the world",
    icon: (
      <svg
        className={iconClass}
        viewBox="0 0 52 48"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <circle cx="18" cy="15" r="6" />
        <circle cx="36" cy="17" r="5" />
        <path d="M6 40c0-7 5-12 12-12s12 5 12 12" />
        <path d="M28 40c0-6 4-10 8-10s10 4 10 10" />
      </svg>
    ),
  },
];

export default function TrustBadges() {
  return (
    <section
      className="relative z-10 -mt-4 border-y border-orange-dark/10 bg-pearl/95 backdrop-blur-md sm:-mt-6 md:-mt-8 lg:-mt-10"
      style={{
        boxShadow:
          "0 -8px 22px -10px rgba(194, 65, 12, 0.18), 0 8px 22px -10px rgba(194, 65, 12, 0.18)",
      }}
    >
      <div className="mx-auto max-w-7xl px-5 py-5 md:px-8 md:py-7">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
          {items.map((it, i) => (
            <Reveal key={it.title} delay={i * 90}>
              <div className="group flex items-center gap-3">
                <span
                  className="shrink-0 text-orange-dark transition-colors group-hover:text-orange"
                >
                  {it.icon}
                </span>
                <div className="leading-tight">
                  <p className="text-[13px] font-bold text-ink md:text-[14px]">
                    {it.title}
                  </p>
                  <p className="mt-0.5 text-[11px] font-medium text-slate md:text-[12px]">
                    {it.subtitle}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
