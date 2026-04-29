"use client";

import Reveal from "./Reveal";
import CycleImage from "./CycleImage";
import { useLang } from "./LangProvider";

type Category = {
  titleKey: string;
  emoji?: string;
  image?: string;
  images?: string[]; // when set, the card cycles through these
  imageFit?: "cover" | "contain";
  href: string;
  bg: string;       // CSS background gradient/color
  size: "wide" | "tall"; // controls grid span
};

const summerImages = [
  "/catalog/garden-queen-poletje-2553.jpg",
  "/catalog/sunshine-queen-poletje-2552.jpg",
  "/catalog/pure-queen-poletje-2550.jpg",
  "/catalog/levander-prom-queen-poletje-3017.jpg",
  "/catalog/wind-queen-poletje-2558.jpg",
  "/catalog/country-queen-poletje-2555.jpg",
  "/catalog/bird-queen-summer-59728.jpg",
  "/catalog/roses-prom-queen-summer-3947.jpg",
  "/catalog/clothing-set-melody-queen-summer-59584.jpg",
];

const outdoorImages = [
  "/catalog/multifunctional-car-for-the-youngest-pink-purple-green-blue-60268.png",
  "/catalog/backpack-unicorn-59693.jpg",
  "/catalog/kids-walkie-talkie-59485.jpg",
  "/catalog/childrens-sunglasses-59720.jpg",
];

const woodenToysImages = [
  "/catalog/magnetic-board-for-creation-black-60309.jpg",
  "/catalog/magic-3d-board-with-light-effects-white-60022.jpg",
  "/catalog/led-light-drawing-board-white-60013.jpg",
  "/catalog/lcd-writing-tablet-59870.jpg",
  "/catalog/audio-math-teacher-pink-white-60002.jpg",
  "/catalog/pop-it-game-console-pink-white-60326.jpg",
];

const cats: Category[] = [
  {
    titleKey: "cats.summer",
    images: summerImages,
    href: "/shop?category=Clothing+sets+AMAREEN",
    bg: "linear-gradient(135deg, #38BDF8 0%, #FCD34D 60%, #F97316 100%)",
    size: "wide",
  },
  {
    titleKey: "cats.educational",
    images: woodenToysImages,
    href: "/shop?category=Accessories",
    bg: "linear-gradient(135deg, #FED7AA 0%, #FDE68A 60%, #F4DCB7 100%)",
    size: "wide",
  },
  {
    titleKey: "cats.outdoor",
    images: outdoorImages,
    href: "/shop?category=Accessories",
    bg: "linear-gradient(135deg, #38BDF8 0%, #34D399 100%)",
    size: "wide",
  },
  {
    titleKey: "cats.boys",
    image: "/categories/for-boys.png",
    href: "/shop?category=Accessories",
    bg: "linear-gradient(135deg, #38BDF8 0%, #6366F1 100%)",
    size: "tall",
  },
  {
    titleKey: "cats.girls",
    image: "/categories/for-girls.png",
    href: "/shop?category=Dresses",
    bg: "linear-gradient(135deg, #F472B6 0%, #C084FC 100%)",
    size: "tall",
  },
];

function CategoryCard({ cat, span }: { cat: Category; span: string }) {
  const { t } = useLang();
  const title = t(cat.titleKey);
  return (
    <a
      href={cat.href}
      className={`group relative block overflow-hidden rounded-3xl ${span}`}
      style={{
        background: cat.bg,
        boxShadow:
          "0 1px 2px rgba(194, 65, 12, 0.06), 0 12px 30px -10px rgba(194, 65, 12, 0.20)",
      }}
    >
      <div className="relative aspect-[16/9] sm:aspect-[5/3]">
        {cat.images && cat.images.length > 0 ? (
          <CycleImage
            images={cat.images}
            alt={title}
            fit={cat.imageFit ?? "cover"}
          />
        ) : cat.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cat.image}
            alt={title}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : cat.emoji ? (
          <span
            aria-hidden
            className="absolute right-4 top-4 text-[5rem] opacity-90 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 sm:text-[6rem] md:text-[7rem]"
            style={{
              filter:
                "drop-shadow(0 12px 18px rgba(0, 0, 0, 0.20))",
            }}
          >
            {cat.emoji}
          </span>
        ) : null}

        {/* Gradient overlay for text legibility at bottom */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.45) 100%)",
          }}
        />

        {/* Title */}
        <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
          <h3
            className="text-[22px] font-extrabold leading-tight text-pearl sm:text-[26px] md:text-[30px]"
            style={{
              letterSpacing: "-0.02em",
              textShadow: "0 2px 12px rgba(0,0,0,0.35)",
            }}
          >
            {title}
          </h3>
          <span className="mt-2 inline-flex items-center gap-1 text-[12px] font-bold uppercase tracking-[0.14em] text-pearl/95">
            {t("cats.shopnow")}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="13 6 19 12 13 18" />
            </svg>
          </span>
        </div>
      </div>
    </a>
  );
}

export default function Categories() {
  const { t } = useLang();
  return (
    <section className="bg-pearl py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-orange-dark">
                <span className="h-1 w-6 rounded-full bg-orange" />
                {t("cats.eyebrow")}
              </p>
              <h2
                className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl md:text-5xl"
                style={{ letterSpacing: "-0.025em" }}
              >
                {t("cats.title")}
              </h2>
            </div>
          </div>
        </Reveal>

        {/* Top row — 3 wide cards */}
        <div className="mt-10 grid grid-cols-1 gap-5 sm:gap-6 md:mt-12 md:grid-cols-3">
          {cats
            .filter((c) => c.size === "wide")
            .map((c, i) => (
              <Reveal key={c.titleKey} delay={i * 100}>
                <CategoryCard cat={c} span="" />
              </Reveal>
            ))}
        </div>

        {/* Bottom row — 2 large cards */}
        <div className="mt-5 grid grid-cols-1 gap-5 sm:gap-6 md:mt-6 md:grid-cols-2">
          {cats
            .filter((c) => c.size === "tall")
            .map((c, i) => (
              <Reveal key={c.titleKey} delay={i * 100}>
                <CategoryCard cat={c} span="" />
              </Reveal>
            ))}
        </div>
      </div>
    </section>
  );
}
