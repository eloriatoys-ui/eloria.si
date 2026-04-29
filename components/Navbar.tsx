"use client";

import { useEffect, useRef, useState } from "react";
import { STORE_NAME } from "@/lib/data";

type SearchHit = {
  id: number;
  name: string;
  price: number;
  comparePrice: number;
  category: string;
  image?: string;
  slug?: string;
  permalink?: string;
};

type MegaIconName =
  | "toys"
  | "accessories"
  | "potty"
  | "dress"
  | "moon"
  | "baby"
  | "run"
  | "hanger"
  | "shirt"
  | "jacket"
  | "scarf"
  | "shoe"
  | "sock"
  | "crown"
  | "ribbon"
  | "sparkles"
  | "sprout"
  | "tag"
  | "sun"
  | "snowflake"
  | "leaf";

type MegaColumn = {
  heading: string;
  items: { label: string; href: string; icon: MegaIconName }[];
};

type NavLink = {
  label: string;
  href: string;
  mega?: MegaColumn[];
};

const shopMega: MegaColumn[] = [
  {
    heading: "Clothing",
    items: [
      { label: "Clothing sets", href: "/shop?category=Clothing+sets+AMAREEN", icon: "hanger" },
      { label: "Dresses", href: "/shop?category=Dresses", icon: "dress" },
      { label: "Bodysuits", href: "/shop?category=Bodysuit", icon: "baby" },
      { label: "Jackets", href: "/shop?category=Jackets", icon: "jacket" },
    ],
  },
  {
    heading: "Accessories",
    items: [
      { label: "All accessories", href: "/shop?category=Accessories", icon: "accessories" },
      { label: "Headpieces", href: "/shop?category=Headpieces", icon: "crown" },
      { label: "Head bows & clips", href: "/shop?category=Head+bows%2Fclips", icon: "ribbon" },
      { label: "Hats & scarfs", href: "/shop?category=Hats+and+scarfs", icon: "scarf" },
      { label: "Footwear", href: "/shop?category=Footwear", icon: "shoe" },
      { label: "Flowers", href: "/shop?category=Flowers", icon: "sparkles" },
    ],
  },
  {
    heading: "Highlights",
    items: [
      { label: "All products", href: "/shop", icon: "toys" },
      { label: "New arrivals", href: "/shop?category=New", icon: "sprout" },
      { label: "On sale", href: "/shop?onSale=1", icon: "tag" },
    ],
  },
  {
    heading: "Help & info",
    items: [
      { label: "Track order", href: "#", icon: "leaf" },
      { label: "Shipping & returns", href: "/#faq", icon: "shirt" },
      { label: "FAQ", href: "/#faq", icon: "sun" },
      { label: "Contact us", href: "mailto:hello@amareen.si", icon: "moon" },
    ],
  },
];

function MegaIcon({ name }: { name: MegaIconName }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "toys":
      return (
        <svg {...common}>
          <circle cx="12" cy="9" r="5" />
          <path d="M9 8 7 6M15 8l2-2M12 14v8M12 22l-3-3M12 22l3-3" />
        </svg>
      );
    case "accessories":
      return (
        <svg {...common}>
          <path d="M5 8c2-2 4-2 7 0s5 2 7 0M5 8v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8" />
        </svg>
      );
    case "potty":
      return (
        <svg {...common}>
          <path d="M5 9h14l-1.5 8a2 2 0 0 1-2 1.6h-7A2 2 0 0 1 6.5 17L5 9Z" />
          <path d="M8 6a4 4 0 0 1 8 0" />
        </svg>
      );
    case "dress":
      return (
        <svg {...common}>
          <path d="M9 3h6l-1 4 4 13H6l4-13L9 3Z" />
          <path d="M9 7h6" />
        </svg>
      );
    case "moon":
      return (
        <svg {...common}>
          <path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10Z" />
        </svg>
      );
    case "baby":
      return (
        <svg {...common}>
          <circle cx="12" cy="6" r="3" />
          <path d="M9 11h6l1 7H8l1-7Z" />
          <path d="M10 18v3M14 18v3" />
        </svg>
      );
    case "run":
      return (
        <svg {...common}>
          <circle cx="13" cy="4" r="2" />
          <path d="m4 22 4-7 3 2 3-5 4 3-4 7" />
          <path d="m11 9 4-3 3 3-3 2" />
        </svg>
      );
    case "hanger":
      return (
        <svg {...common}>
          <path d="M12 8a2 2 0 1 1 2-2" />
          <path d="m12 8 9 6c1 .7.5 2-.7 2H3.7c-1.2 0-1.7-1.3-.7-2l9-6Z" />
        </svg>
      );
    case "shirt":
      return (
        <svg {...common}>
          <path d="M9 4h6l4 3-2 4-2-1v10H7V10l-2 1-2-4 4-3Z" />
        </svg>
      );
    case "jacket":
      return (
        <svg {...common}>
          <path d="M8 4 4 7v13h6V4M16 4l4 3v13h-6V4" />
          <path d="M10 4h4v6h-4z" />
        </svg>
      );
    case "scarf":
      return (
        <svg {...common}>
          <path d="M5 4h14l-3 8 2 8h-4l-1-7-1 7H8l2-8L7 4Z" />
        </svg>
      );
    case "shoe":
      return (
        <svg {...common}>
          <path d="M3 16c0-3 3-4 5-4l3-4 3 1c1 0 6 1 7 5v3H3v-1Z" />
          <path d="M3 19h18" />
        </svg>
      );
    case "sock":
      return (
        <svg {...common}>
          <path d="M9 3h6v8c0 2 1 3 2 4l3 3a3 3 0 0 1-4 4l-5-5c-1-1-2-2-2-4V3Z" />
        </svg>
      );
    case "crown":
      return (
        <svg {...common}>
          <path d="m3 8 4 4 5-7 5 7 4-4-2 11H5L3 8Z" />
          <circle cx="3" cy="8" r="1" />
          <circle cx="21" cy="8" r="1" />
          <circle cx="12" cy="5" r="1" />
        </svg>
      );
    case "ribbon":
      return (
        <svg {...common}>
          <path d="M12 8c-3-4-8-2-8 2s5 2 8-2Z" />
          <path d="M12 8c3-4 8-2 8 2s-5 2-8-2Z" />
          <path d="M12 8v13l-3-3M12 21l3-3" />
        </svg>
      );
    case "sparkles":
      return (
        <svg {...common}>
          <path d="M12 3v6M9 6h6M5 13l2 2 2-2-2-2-2 2ZM15 17l3 3 3-3-3-3-3 3Z" />
        </svg>
      );
    case "sprout":
      return (
        <svg {...common}>
          <path d="M12 21v-7" />
          <path d="M12 14a4 4 0 0 1-4-4V8h2a4 4 0 0 1 2 7Z" />
          <path d="M12 14a4 4 0 0 0 4-4V7h-2a4 4 0 0 0-2 7Z" />
        </svg>
      );
    case "tag":
      return (
        <svg {...common}>
          <path d="M12 2 3 11l9 9 9-9V2h-9Z" />
          <circle cx="15" cy="8" r="1.5" />
        </svg>
      );
    case "sun":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2" />
        </svg>
      );
    case "snowflake":
      return (
        <svg {...common}>
          <path d="M12 2v20M2 12h20M5 5l14 14M19 5 5 19" />
          <path d="M12 5l-2 2M12 5l2 2M12 19l-2-2M12 19l2-2M5 12l2-2M5 12l2 2M19 12l-2-2M19 12l-2 2" />
        </svg>
      );
    case "leaf":
      return (
        <svg {...common}>
          <path d="M3 21c0-9 7-16 18-18-1 11-7 18-18 18Z" />
          <path d="M3 21c5-5 10-9 18-18" />
        </svg>
      );
  }
}

const links: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop", mega: shopMega },
  { label: "Wooden toys", href: "/wooden-toys" },
  { label: "Clothes", href: "/#clothes" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/#newsletter" },
];

const promos = [
  "✦ Free delivery on orders over 150 €",
  "✦ Sustainably crafted in small batches",
  "✦ New customers: 15% off with code MAGIC15",
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [promoIdx, setPromoIdx] = useState(0);
  const [megaOpen, setMegaOpen] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const t = setInterval(
      () => setPromoIdx((i) => (i + 1) % promos.length),
      4500,
    );
    return () => clearInterval(t);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      {/* Promo strip */}
      <div
        style={{
          background:
            "linear-gradient(90deg, #7C2D12 0%, #C2410C 50%, #F97316 100%)",
        }}
      >
        <div className="mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 px-5 py-2.5 text-[12px] font-semibold text-white md:px-8 md:text-[13px]">
          <div className="hidden items-center gap-2 md:flex">
            <span aria-hidden className="text-white">✦</span>
            <span className="text-white/95">Magical play, every day</span>
          </div>
          <div className="md:hidden" />
          <div
            key={promoIdx}
            className="text-center text-white"
            style={{ animation: "fadeSlide 0.5s ease-out" }}
          >
            {promos[promoIdx]}
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <a
              href="mailto:hello@amareen.si?subject=Order%20status"
              className="text-white/95 hover:text-white"
            >
              Track Order
            </a>
          </div>
          <div className="md:hidden" />
        </div>
      </div>

      {/* Main nav — wooden plank, fixed at all scroll positions */}
      <div
        className="wood-dark shadow-lift"
        onMouseLeave={() => setMegaOpen(null)}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 md:px-8 md:py-4">
          {/* Logo */}
          <a
            href="/"
            className="group inline-flex items-center"
            aria-label={STORE_NAME}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/eloria.webp"
              alt={STORE_NAME}
              className="h-7 w-auto transition-transform group-hover:-rotate-3 md:h-8"
              style={{
                filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.4))",
              }}
            />
          </a>

          {/* Center nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <div
                key={l.href + l.label}
                className="relative"
                onMouseEnter={() => l.mega && setMegaOpen(l.label)}
              >
                <a
                  href={l.href}
                  className="group relative flex items-center gap-1 rounded-full px-4 py-2 text-[14px] font-bold text-pearl transition-colors"
                  style={{
                    color: "#FFFFFF",
                    textShadow: "0 1px 2px rgba(0, 0, 0, 0.4)",
                  }}
                >
                  <span className="relative z-10" style={{ color: "#FFFFFF" }}>
                    {l.label}
                  </span>
                  {l.mega && (
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`relative z-10 transition-transform ${
                        megaOpen === l.label ? "rotate-180" : ""
                      }`}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  )}
                  <span className="absolute inset-0 -z-0 scale-90 rounded-full bg-pearl/0 transition-all group-hover:scale-100 group-hover:bg-pearl/10" />
                  <span className="pointer-events-none absolute bottom-1 left-1/2 h-[2px] w-0 -translate-x-1/2 rounded-full bg-orange transition-all group-hover:w-5" />
                </a>
              </div>
            ))}
          </nav>

          {/* Right cluster */}
          <div className="flex items-center gap-2">
            {/* Search trigger / input — desktop */}
            <div className="hidden md:block">
              <SearchPanel
                open={searchOpen}
                setOpen={setSearchOpen}
                variant="desktop"
              />
            </div>

            {/* Search mobile */}
            <div className="md:hidden">
              <SearchPanel
                open={searchOpen}
                setOpen={setSearchOpen}
                variant="mobile"
              />
            </div>

            {/* Wishlist */}
            <button
              aria-label="Wishlist"
              className="hidden h-11 w-11 place-items-center rounded-full bg-pearl/10 text-pearl transition-colors hover:bg-pearl/20 md:grid"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>

            {/* Cart pill — count INSIDE the button */}
            <button
              aria-label="Cart, 3 items"
              className="relative inline-flex h-11 items-center gap-2 rounded-full px-3.5 text-pearl shadow-glow transition-transform hover:scale-105"
              style={{
                background:
                  "linear-gradient(135deg, #F97316 0%, #C2410C 100%)",
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="21" r="1.5" />
                <circle cx="18" cy="21" r="1.5" />
                <path d="M3 3h2l2.6 12.6a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6" />
              </svg>
              <span className="rounded-full bg-pearl/95 px-1.5 py-0.5 text-[11px] font-extrabold leading-none text-orange-dark">
                3
              </span>
            </button>

            {/* Burger */}
            <button
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="grid h-11 w-11 place-items-center rounded-full bg-pearl/10 text-pearl lg:hidden"
            >
              <span className="relative block h-4 w-5">
                <span
                  className={`absolute left-0 top-0 h-[2px] w-5 rounded-full bg-current transition-all ${
                    open ? "translate-y-[7px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`absolute left-0 top-[7px] h-[2px] w-5 rounded-full bg-current transition-all ${
                    open ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`absolute left-0 top-[14px] h-[2px] w-5 rounded-full bg-current transition-all ${
                    open ? "-translate-y-[7px] -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>
        </div>

        {/* Mega menu panel */}
        {megaOpen && (
          <MegaMenuPanel
            link={links.find((l) => l.label === megaOpen)!}
            onClose={() => setMegaOpen(null)}
          />
        )}
      </div>

      {/* Mobile drawer */}
      <div
        className={[
          "lg:hidden overflow-hidden wood-dark transition-[max-height,opacity] duration-300 ease-out",
          open ? "max-h-[640px] opacity-100" : "max-h-0 opacity-0",
        ].join(" ")}
      >
        <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-4">
          {links.map((l) => (
            <a
              key={l.href + l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between rounded-2xl px-4 py-3.5 font-bold transition-colors hover:bg-pearl/15"
              style={{
                color: "#FFFFFF",
                textShadow: "0 1px 2px rgba(0, 0, 0, 0.4)",
              }}
            >
              <span>{l.label}</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-60"
              >
                <polyline points="9 6 15 12 9 18" />
              </svg>
            </a>
          ))}

          <a
            href="mailto:hello@amareen.si?subject=Order%20status"
            className="mt-3 rounded-2xl btn-magic px-4 py-3 text-center text-sm font-bold"
            style={{ color: "#FFFFFF" }}
          >
            <span style={{ color: "#FFFFFF" }}>Track Order</span>
          </a>
        </nav>
      </div>

      <style jsx>{`
        @keyframes fadeSlide {
          0% {
            opacity: 0;
            transform: translateY(6px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </header>
  );
}

// ─── Mega menu panel ────────────────────────────────────────────────────

function MegaMenuPanel({
  link,
  onClose,
}: {
  link: NavLink;
  onClose: () => void;
}) {
  if (!link.mega) return null;
  return (
    <div className="absolute inset-x-0 top-full z-40 hidden border-t border-pearl/10 bg-pearl shadow-lift lg:block">
      <div className="mx-auto grid max-w-7xl grid-cols-4 gap-8 px-8 py-8">
        {link.mega.map((col) => (
          <div key={col.heading}>
            <h3 className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.18em] text-orange-dark">
              {col.heading}
            </h3>
            <ul className="flex flex-col gap-1.5">
              {col.items.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    onClick={onClose}
                    className="group flex items-center gap-3 rounded-md px-2 py-1.5 text-[14px] font-semibold text-ink transition-colors hover:bg-orange/10 hover:text-orange-dark"
                  >
                    <span
                      aria-hidden
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-cream text-orange-dark transition-colors group-hover:bg-orange group-hover:text-pearl"
                      style={{ boxShadow: "inset 0 0 0 1px rgba(124, 45, 18, 0.12)" }}
                    >
                      <MegaIcon name={item.icon} />
                    </span>
                    {item.label}
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="ml-auto opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <polyline points="9 6 15 12 9 18" />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-orange-dark/10 bg-cream py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-8 text-[12px] text-slate">
          <span className="font-semibold">
            Free delivery on orders over 150 € · Sustainably crafted
          </span>
          <a
            href="/shop"
            onClick={onClose}
            className="font-bold text-orange-dark hover:text-orange"
          >
            Browse all products →
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Search ────────────────────────────────────────────────────────────

function SearchPanel({
  open,
  setOpen,
  variant,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  variant: "desktop" | "mobile";
}) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<SearchHit[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  // Click-outside to close
  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open, setOpen]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Debounced search
  useEffect(() => {
    if (q.trim().length < 2) {
      setResults([]);
      setTotal(0);
      return;
    }
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(q)}&limit=8`,
        );
        const data = await res.json();
        setResults(data.results ?? []);
        setTotal(data.total ?? 0);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 200);
    return () => clearTimeout(t);
  }, [q]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  if (!open) {
    return (
      <button
        aria-label="Search"
        onClick={() => setOpen(true)}
        className={
          variant === "desktop"
            ? "flex h-11 items-center gap-2 rounded-full bg-pearl/15 px-4 transition-all hover:bg-pearl/25"
            : "grid h-11 w-11 place-items-center rounded-full bg-pearl/10 text-pearl hover:bg-pearl/20"
        }
        style={variant === "desktop" ? { color: "#FFFFFF" } : undefined}
      >
        <svg
          width={variant === "desktop" ? "16" : "18"}
          height={variant === "desktop" ? "16" : "18"}
          viewBox="0 0 24 24"
          fill="none"
          stroke={variant === "desktop" ? "#FFFFFF" : "currentColor"}
          strokeWidth="2.4"
          strokeLinecap="round"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        {variant === "desktop" && (
          <span
            className="text-[12px] font-semibold"
            style={{ color: "#FFFFFF" }}
          >
            Search…
          </span>
        )}
      </button>
    );
  }

  return (
    <div
      ref={wrapRef}
      className="relative"
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div
        className={
          variant === "desktop"
            ? "flex h-11 w-[260px] items-center gap-2 rounded-full bg-pearl px-3 ring-2 ring-orange-dark/30 transition-all md:w-[340px]"
            : "fixed inset-x-3 top-3 z-50 flex h-11 items-center gap-2 rounded-full bg-pearl px-3 shadow-lift ring-2 ring-orange-dark/30"
        }
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#C2410C"
          strokeWidth="2.4"
          strokeLinecap="round"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          ref={inputRef}
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search toys, dresses, sets…"
          className="flex-1 bg-transparent text-[14px] font-semibold text-ink outline-none placeholder:font-medium placeholder:text-slate"
        />
        <button
          aria-label="Close search"
          onClick={() => {
            setOpen(false);
            setQ("");
          }}
          className="grid h-7 w-7 place-items-center rounded-full text-slate hover:bg-orange/10 hover:text-orange-dark"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
          >
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="18" y1="6" x2="6" y2="18" />
          </svg>
        </button>
      </div>

      {/* Results dropdown */}
      <div
        className={
          variant === "desktop"
            ? "absolute right-0 top-[calc(100%+8px)] w-[420px] max-w-[90vw]"
            : "fixed inset-x-3 top-[60px] z-50"
        }
      >
        <div className="overflow-hidden rounded-2xl border border-orange-dark/15 bg-pearl shadow-lift">
          {q.trim().length < 2 ? (
            <div className="px-5 py-6 text-[13px] text-slate">
              <p className="font-semibold text-ink">What are you looking for?</p>
              <p className="mt-1">
                Try{" "}
                {["dress", "pyjamas", "walkie-talkie", "queen", "summer"].map(
                  (s, i) => (
                    <button
                      key={s}
                      onClick={() => setQ(s)}
                      className="mr-1 rounded-full bg-orange/10 px-2.5 py-1 text-[12px] font-bold text-orange-dark hover:bg-orange/20"
                    >
                      {s}
                    </button>
                  ),
                )}
              </p>
            </div>
          ) : loading ? (
            <div className="px-5 py-6 text-center text-[13px] text-slate">
              Searching…
            </div>
          ) : results.length === 0 ? (
            <div className="px-5 py-6 text-[13px] text-slate">
              No matches for{" "}
              <span className="font-bold text-ink">&ldquo;{q}&rdquo;</span>.
              Try different words.
            </div>
          ) : (
            <>
              <ul className="max-h-[60vh] overflow-y-auto py-1">
                {results.map((r) => (
                  <li key={r.id}>
                    <a
                      href={r.permalink ?? "/shop"}
                      onClick={() => {
                        setOpen(false);
                        setQ("");
                      }}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-orange/10"
                    >
                      <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-md bg-cream ring-1 ring-orange-dark/10">
                        {r.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={r.image}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span>🎁</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-1 text-[13px] font-bold text-ink">
                          {r.name}
                        </p>
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate">
                          {r.category}
                        </p>
                      </div>
                      <span className="shrink-0 text-[14px] font-extrabold text-ink">
                        {r.price}€
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
              {total > results.length && (
                <a
                  href="/shop"
                  onClick={() => {
                    setOpen(false);
                    setQ("");
                  }}
                  className="block border-t border-orange-dark/10 px-4 py-3 text-center text-[12px] font-extrabold uppercase tracking-wider text-orange-dark hover:bg-orange/10"
                >
                  See all {total} matches →
                </a>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
