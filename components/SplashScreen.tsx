"use client";

import { useEffect, useState } from "react";

export default function SplashScreen() {
  const [hidden, setHidden] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    // Reveal the (already server-rendered) page on a short fixed timer — just
    // long enough for a brand flash. Never wait for the full `load` event: the
    // homepage pulls megabytes of video/images, and gating on that left mobile
    // visitors staring at a spinner for seconds and bouncing.
    const t = window.setTimeout(() => setHidden(true), 650);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!hidden) return;
    const t = window.setTimeout(() => setRemoved(true), 600);
    return () => window.clearTimeout(t);
  }, [hidden]);

  if (removed) return null;

  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-[200] grid place-items-center bg-cream transition-opacity duration-500 ${
        hidden ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center gap-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/eloria.webp"
          alt=""
          fetchPriority="high"
          className="h-20 w-auto animate-pulse sm:h-24"
        />
        <div className="flex gap-1.5">
          <span
            className="h-2 w-2 animate-bounce rounded-full bg-orange"
            style={{ animationDelay: "0s" }}
          />
          <span
            className="h-2 w-2 animate-bounce rounded-full bg-orange"
            style={{ animationDelay: "0.15s" }}
          />
          <span
            className="h-2 w-2 animate-bounce rounded-full bg-orange"
            style={{ animationDelay: "0.3s" }}
          />
        </div>
      </div>
    </div>
  );
}
