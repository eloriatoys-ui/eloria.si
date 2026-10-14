"use client";

import { useState } from "react";
import { SOCIALS, type SocialName } from "@/lib/data";
import { SocialIcon } from "./Footer";

// Live profile feeds via each platform's own public embed — no API keys.
// Only the selected tab's iframe is mounted, so the other platforms'
// scripts don't load until a visitor clicks them.
function embedFor(name: SocialName, href: string): { src: string; height: number } {
  switch (name) {
    case "instagram": {
      const user = href.replace(/\/+$/, "").split("/").pop();
      return { src: `https://www.instagram.com/${user}/embed/`, height: 720 };
    }
    case "tiktok": {
      const user = href.replace(/\/+$/, "").split("/").pop();
      return { src: `https://www.tiktok.com/embed/${user}`, height: 640 };
    }
    case "facebook":
      return {
        src: `https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(
          href,
        )}&tabs=timeline&width=500&height=640&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true`,
        height: 640,
      };
  }
}

export default function SocialFeeds() {
  const [active, setActive] = useState<SocialName>(SOCIALS[0]?.name ?? "instagram");
  const current = SOCIALS.find((s) => s.name === active);
  if (!current) return null;
  const embed = embedFor(current.name, current.href);

  return (
    <div className="mt-10">
      <div role="tablist" className="flex flex-wrap justify-center gap-2.5">
        {SOCIALS.map((s) => {
          const on = s.name === active;
          return (
            <button
              key={s.name}
              role="tab"
              aria-selected={on}
              onClick={() => setActive(s.name)}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-bold uppercase tracking-[0.14em] transition-colors ${
                on
                  ? "bg-orange text-pearl shadow-lg shadow-orange/30"
                  : "bg-white text-ink ring-1 ring-orange-dark/15 hover:ring-orange"
              }`}
              style={on ? { color: "#FFFFFF" } : undefined}
            >
              <SocialIcon name={s.name} />
              {s.label}
            </button>
          );
        })}
      </div>

      <div className="mx-auto mt-8 w-full max-w-[540px] overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-orange-dark/10">
        <iframe
          key={current.name}
          src={embed.src}
          title={`${current.label} — ${current.handle}`}
          className="block w-full"
          style={{ border: 0, height: embed.height }}
          loading="lazy"
          allow="encrypted-media; clipboard-write; picture-in-picture"
          allowFullScreen
        />
      </div>

      <div className="mt-6 text-center">
        <a
          href={current.href}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-orange-dark/25 px-5 py-2.5 text-[13px] font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:border-orange hover:bg-orange hover:text-pearl"
        >
          Sledi {current.handle} na {current.label} →
        </a>
      </div>
    </div>
  );
}
