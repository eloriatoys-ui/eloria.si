"use client";

import { useEffect, useMemo, useState } from "react";

type Props = {
  productId: number;
  productName: string;
  emoji: string;
  initialImages: string[];
  badge?: string;
  saleLabel?: string;
};

export default function ProductGallery({
  productId,
  productName,
  emoji,
  initialImages,
  badge,
  saleLabel,
}: Props) {
  const [remoteImages, setRemoteImages] = useState<string[]>([]);
  const [uploads, setUploads] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetch(`/api/product/${productId}`)
      .then((r) => r.json())
      .then((data) => {
        if (!alive) return;
        setRemoteImages(data.images ?? []);
        setUploads(data.uploads ?? []);
      })
      .catch(() => {})
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [productId]);

  const gallery = useMemo(() => {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const src of [...uploads, ...initialImages, ...remoteImages]) {
      if (!src || seen.has(src)) continue;
      seen.add(src);
      out.push(src);
    }
    return out;
  }, [uploads, initialImages, remoteImages]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight")
        setActive((i) => Math.min(i + 1, Math.max(0, gallery.length - 1)));
      if (e.key === "ArrowLeft") setActive((i) => Math.max(i - 1, 0));
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [gallery.length]);

  const currentMain = gallery[active];

  return (
    <div className="flex flex-col gap-3">
      {/* Main image — square, never cropped */}
      <div
        className="relative aspect-square w-full overflow-hidden rounded-2xl bg-pearl"
        style={{
          border: "1px solid rgba(194, 65, 12, 0.10)",
          boxShadow: "0 1px 2px rgba(194, 65, 12, 0.04)",
        }}
      >
        {currentMain ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={currentMain}
            src={currentMain}
            alt={productName}
            className="absolute inset-0 h-full w-full object-contain p-6 md:p-10"
            style={{ animation: "fadeIn 250ms ease-out" }}
          />
        ) : (
          <div className="grid h-full place-items-center text-7xl">{emoji}</div>
        )}

        {badge && (
          <span
            className="absolute left-4 top-4 rounded px-3 py-1 text-[11px] font-bold uppercase tracking-wider"
            style={{ backgroundColor: "#F97316", color: "#FFFFFF" }}
          >
            {badge}
          </span>
        )}
        {saleLabel && !badge && (
          <span
            className="absolute left-4 top-4 rounded px-3 py-1 text-[11px] font-bold uppercase tracking-wider"
            style={{ backgroundColor: "#E55B47", color: "#FFFFFF" }}
          >
            {saleLabel}
          </span>
        )}

        {gallery.length > 1 && (
          <span className="absolute right-4 top-4 rounded-full bg-ink/70 px-2.5 py-1 text-[11px] font-bold text-pearl backdrop-blur-sm">
            {active + 1} / {gallery.length}
          </span>
        )}

        {gallery.length > 1 && (
          <>
            <button
              onClick={() => setActive((i) => Math.max(i - 1, 0))}
              disabled={active === 0}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-pearl text-ink shadow-md transition-all hover:bg-orange hover:text-pearl disabled:cursor-not-allowed disabled:opacity-0"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              onClick={() => setActive((i) => Math.min(i + 1, gallery.length - 1))}
              disabled={active === gallery.length - 1}
              aria-label="Next image"
              className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-pearl text-ink shadow-md transition-all hover:bg-orange hover:text-pearl disabled:cursor-not-allowed disabled:opacity-0"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 6 15 12 9 18" />
              </svg>
            </button>
          </>
        )}

        {loading && gallery.length === 1 && (
          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-pearl/95 px-3 py-1 text-[11px] font-bold text-ink shadow-md">
            Loading gallery…
          </span>
        )}
      </div>

      {/* Horizontal thumbnail strip */}
      {gallery.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {gallery.map((src, i) => (
            <button
              key={src + i}
              onClick={() => setActive(i)}
              className={[
                "relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-pearl ring-2 transition-all",
                i === active ? "ring-orange" : "ring-transparent hover:ring-orange-dark/40",
              ].join(" ")}
              style={{ border: "1px solid rgba(194, 65, 12, 0.08)" }}
              aria-label={`View image ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-contain p-1.5" />
            </button>
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0.4; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
