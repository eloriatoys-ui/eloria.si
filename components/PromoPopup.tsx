"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Promotional popup that appears 3 seconds after the site loads, advertising
// the automatic 40% multi-item discount. Shown once per browser session so it
// doesn't nag on every navigation.
const SEEN_KEY = "eloria.promo.popup.v1";

// Promo creatives in /public/promo — one is picked at random per visit. Add or
// remove files here to change the rotation.
const PROMO_IMAGES = [
  "/promo/promo-1.jpg",
  "/promo/promo-2.jpg",
  "/promo/promo-3.jpg",
  "/promo/promo-4.jpg",
  "/promo/promo-5.jpg",
];

export default function PromoPopup() {
  const [open, setOpen] = useState(false);
  // Chosen inside the effect (client-only) so the random pick can't cause a
  // server/client hydration mismatch.
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SEEN_KEY)) return;
    } catch {}
    const timer = setTimeout(() => {
      setImage(PROMO_IMAGES[Math.floor(Math.random() * PROMO_IMAGES.length)]);
      setOpen(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  function close() {
    setOpen(false);
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {}
  }

  if (!open || !image) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="40% popust ob nakupu več kot enega izdelka"
      onClick={close}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 300,
        display: "grid",
        placeItems: "center",
        padding: "20px",
        background: "rgba(30, 20, 12, 0.55)",
        backdropFilter: "blur(3px)",
        animation: "eloriaFade 0.25s ease-out",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: "min(92vw, 420px)",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 24px 70px -20px rgba(0,0,0,0.55)",
          animation: "eloriaPop 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <button
          onClick={close}
          aria-label="Zapri"
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            zIndex: 2,
            width: "36px",
            height: "36px",
            borderRadius: "9999px",
            border: "none",
            cursor: "pointer",
            background: "rgba(255,255,255,0.9)",
            color: "#3a2a1a",
            fontSize: "20px",
            lineHeight: 1,
            fontWeight: 700,
            display: "grid",
            placeItems: "center",
          }}
        >
          ×
        </button>

        <Link href="/trgovina" onClick={close} aria-label="Pojdi v trgovino">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt="40% popust ob nakupu več kot enega izdelka"
            style={{ display: "block", width: "100%", height: "auto" }}
          />
        </Link>

        <Link
          href="/trgovina"
          onClick={close}
          style={{
            display: "block",
            textAlign: "center",
            padding: "14px",
            background: "#E07A2F",
            color: "#FFFFFF",
            fontWeight: 800,
            fontSize: "14px",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            textDecoration: "none",
          }}
        >
          Nakupuj zdaj →
        </Link>
      </div>

      <style>{`
        @keyframes eloriaFade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes eloriaPop {
          from { opacity: 0; transform: scale(0.9) translateY(10px) }
          to { opacity: 1; transform: scale(1) translateY(0) }
        }
      `}</style>
    </div>
  );
}
