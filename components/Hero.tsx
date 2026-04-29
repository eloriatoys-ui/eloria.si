import { STORE_NAME, TAGLINE } from "@/lib/data";

function CharacterVideo({
  id,
  webm,
  mp4,
  className = "",
}: {
  id: string;
  webm: string;
  mp4: string;
  className?: string;
}) {
  return (
    <video
      id={id}
      className={`pointer-events-none select-none ${className}`}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
    >
      <source src={mp4} type='video/mp4; codecs="hvc1"' />
      <source src={webm} type="video/webm" />
    </video>
  );
}

function Sparkle({
  className = "",
  delay = 0,
}: {
  className?: string;
  delay?: number;
}) {
  return (
    <span
      aria-hidden
      className={`sparkle ${className}`}
      style={{ animationDelay: `${delay}s` }}
    />
  );
}

export default function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden text-ink min-h-[560px] sm:min-h-[620px] md:min-h-[680px] lg:min-h-[740px] xl:min-h-[800px]"
      style={{
        backgroundImage: "url('/hero-bg.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Soft warm wash + depth vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.05) 28%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.10) 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 55%, transparent 25%, rgba(0,0,0,0.32) 65%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      {/* Centered hero video — alpha channel preserved (HEVC + VP9) */}
      <video
        autoPlay
        muted
        loop
        playsInline
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[36%] h-[88%] w-auto max-w-none -translate-x-1/2 -translate-y-1/2"
        style={{ objectFit: "contain" }}
      >
        <source src="/videos/girl-jump.mov" type='video/mp4; codecs="hvc1"' />
        <source src="/videos/girl-jump.webm" type="video/webm" />
      </video>

      {/* Sparkles */}
      <Sparkle className="left-[18%] top-32" delay={0.3} />
      <Sparkle className="left-[36%] top-20" delay={1.2} />
      <Sparkle className="right-[22%] top-44" delay={0.8} />
      <Sparkle className="right-[12%] top-72 hidden md:block" delay={1.6} />

      {/* TEXT CONTENT — vertically + horizontally centered in the hero */}
      <div className="relative mx-auto flex min-h-[560px] max-w-7xl items-center justify-center px-5 py-12 sm:min-h-[620px] md:min-h-[680px] md:px-8 md:py-16 lg:min-h-[740px] xl:min-h-[800px]">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-pearl/95 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.22em] text-ink shadow-soft backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-orange" />
            Where Imagination Comes Alive
            <span className="h-1.5 w-1.5 rounded-full bg-orange" />
          </span>

          <h1 className="sr-only">{STORE_NAME}</h1>

          <div
            className="wood-dark mx-auto mt-6 max-w-xl rounded-2xl px-6 py-6 shadow-lift"
            style={{
              border: "1px solid rgba(0, 0, 0, 0.45)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/eloria.webp"
              alt={STORE_NAME}
              className="mx-auto h-16 w-auto sm:h-20 md:h-24"
            />
            <div
              aria-hidden
              className="mx-auto mt-4 h-[2px] w-20 rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(249,115,22,0.85) 50%, transparent 100%)",
              }}
            />
            <p
              className="mt-4 text-[19px] font-extrabold leading-snug sm:text-[22px]"
              style={{
                color: "#FFFFFF",
                letterSpacing: "-0.01em",
                textShadow:
                  "0 1px 0 rgba(60, 35, 20, 0.55), 0 2px 6px rgba(60, 35, 20, 0.35)",
              }}
            >
              {TAGLINE}
            </p>
            <p
              className="mt-2 text-[14px] font-semibold leading-relaxed sm:text-[15px]"
              style={{
                color: "#FFFFFF",
                textShadow:
                  "0 1px 0 rgba(60, 35, 20, 0.5), 0 1px 4px rgba(60, 35, 20, 0.3)",
              }}
            >
              Magical toys, organic kids&apos; clothes, and timeless play
              — made for curious little hands.
            </p>
          </div>

          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="/shop"
              className="wood-dark inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-extrabold transition-transform hover:-translate-y-0.5"
              style={{
                color: "#FFFFFF",
                textShadow: "0 1px 2px rgba(0, 0, 0, 0.55)",
                boxShadow:
                  "0 8px 22px -6px rgba(74, 47, 34, 0.55), inset 0 1px 0 rgba(255, 230, 195, 0.22), inset 0 -1px 0 rgba(0, 0, 0, 0.45)",
                border: "1px solid rgba(0, 0, 0, 0.45)",
              }}
            >
              <span style={{ color: "#FFFFFF" }}>Shop the collection</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 6 15 12 9 18" />
              </svg>
            </a>
            <a
              href="/shop?onSale=1"
              className="inline-flex items-center gap-2 rounded-full px-7 py-4 text-base font-extrabold transition-transform hover:-translate-y-0.5"
              style={{
                background: "#FFF7ED",
                color: "#4A2F22",
                border: "1.5px solid #4A2F22",
                boxShadow: "0 6px 16px -6px rgba(74, 47, 34, 0.35)",
              }}
            >
              <span
                className="grid h-6 w-6 place-items-center rounded-full text-[11px] font-extrabold"
                style={{ background: "#E55B47", color: "#FFFFFF" }}
              >
                %
              </span>
              See sale items
            </a>
          </div>
        </div>
      </div>

      {/* VIDEOS — flanking the text on desktop, sitting on the floor */}
      {/* Desktop / large */}
      <div className="pointer-events-none absolute inset-x-0 bottom-16 hidden items-end justify-between px-24 lg:flex xl:bottom-20 xl:px-48">
        <div className="relative">
          <div
            aria-hidden
            className="absolute bottom-2 left-1/2 h-5 w-44 -translate-x-1/2 rounded-full bg-ink/35 blur-md"
          />
          <CharacterVideo
            id="hero-video-left"
            webm="/videos/kidleft.webm"
            mp4="/videos/kidleft.mp4"
            className="h-[378px] w-auto xl:h-[432px]"
          />
        </div>
        <div className="relative -translate-y-6">
          <div
            aria-hidden
            className="absolute bottom-2 left-1/2 h-5 w-44 -translate-x-1/2 rounded-full bg-ink/35 blur-md"
          />
          <CharacterVideo
            id="hero-video-right"
            webm="/videos/kidright.webm"
            mp4="/videos/kidright.mp4"
            className="h-[420px] w-auto xl:h-[480px]"
          />
        </div>
      </div>

      {/* Mobile / tablet — videos side by side at the bottom */}
      <div className="pointer-events-none absolute inset-x-0 bottom-10 grid grid-cols-2 items-end gap-2 px-4 sm:bottom-14 sm:px-8 lg:hidden">
        <div className="flex justify-center">
          <CharacterVideo
            id="hero-video-left-mobile"
            webm="/videos/kidleft.webm"
            mp4="/videos/kidleft.mp4"
            className="h-[280px] w-auto sm:h-[360px] md:h-[420px]"
          />
        </div>
        <div className="flex justify-center">
          <CharacterVideo
            id="hero-video-right-mobile"
            webm="/videos/kidright.webm"
            mp4="/videos/kidright.mp4"
            className="h-[280px] w-auto sm:h-[360px] md:h-[420px]"
          />
        </div>
      </div>
    </section>
  );
}
