import Reveal from "./Reveal";

type VideoCard = {
  title: string;
  blurb: string;
  videoSrc?: string; // optional — falls back to placeholder when missing
  poster?: string;
  duration?: string;
  ctaHref: string;
};

const videoCards: VideoCard[] = [
  {
    title: "Garden Queen Summer set",
    blurb: "Soft, breezy, made for sunny days outside.",
    videoSrc: "/videos/v-clothes.mp4",
    duration: "0:11",
    ctaHref: "/shop",
  },
  {
    title: "Disco LED light",
    blurb: "Music, lights, dance — turn any room into a party.",
    videoSrc: "/videos/v-music.mp4",
    duration: "0:15",
    ctaHref: "/shop",
  },
  {
    title: "Kids walkie-talkie",
    blurb: "Adventures on the air — copy that, captain!",
    videoSrc: "/videos/v-toy.mp4",
    duration: "0:15",
    ctaHref: "/shop",
  },
];

function VideoTile({ card }: { card: VideoCard }) {
  return (
    <article
      className="group relative overflow-hidden rounded-2xl bg-pearl transition-all duration-300 hover:-translate-y-1"
      style={{
        border: "1px solid #F4DCB7",
        boxShadow:
          "0 1px 2px rgba(194, 65, 12, 0.06), 0 8px 24px -10px rgba(194, 65, 12, 0.18)",
      }}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-sand">
        {card.videoSrc ? (
          <video
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster={card.poster}
          >
            <source src={card.videoSrc} />
          </video>
        ) : (
          <div
            className="absolute inset-0 grid place-items-center"
            style={{
              background:
                "linear-gradient(135deg, #FFF7ED 0%, #FED7AA 100%)",
            }}
          >
            <span className="text-[3rem]">🎬</span>
          </div>
        )}

        {/* Dark overlay so the play button + duration always read */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.55) 100%)",
          }}
        />

        {/* Duration chip — bottom-right */}
        {card.duration && (
          <span
            className="absolute right-3 bottom-3 rounded bg-pearl/95 px-2 py-0.5 text-[11px] font-bold text-ink"
            style={{ color: "#1C1917" }}
          >
            {card.duration}
          </span>
        )}
      </div>

      <div className="px-5 pb-5 pt-4">
        <h3 className="text-[16px] font-extrabold leading-tight text-ink" style={{ letterSpacing: "-0.015em" }}>
          {card.title}
        </h3>
        <p className="mt-1.5 text-[13px] text-slate">{card.blurb}</p>
        <a
          href={card.ctaHref}
          className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-[12px] font-bold uppercase tracking-[0.14em] text-pearl transition-colors hover:bg-orange-dark"
          style={{ letterSpacing: "0.08em", color: "#FFFFFF" }}
        >
          <span style={{ color: "#FFFFFF" }}>Order now</span>
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="13 6 19 12 13 18" />
          </svg>
        </a>
      </div>
    </article>
  );
}

export default function Videos() {
  return (
    <section className="bg-cream py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-orange-dark">
                <span className="h-1 w-6 rounded-full bg-orange" />
                See it in action
              </p>
              <h2
                className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl md:text-5xl"
                style={{ letterSpacing: "-0.025em" }}
              >
                Products in motion
              </h2>
            </div>
            <a
              href="/shop"
              className="hidden items-center gap-1.5 self-start rounded-full border border-orange-dark/25 px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-orange hover:bg-orange hover:text-pearl md:inline-flex"
            >
              Visit the shop →
            </a>
          </div>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:gap-6 md:mt-12 md:grid-cols-3">
          {videoCards.map((card, i) => (
            <Reveal key={card.title} delay={i * 100}>
              <VideoTile card={card} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
