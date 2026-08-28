"use client";

import { useState } from "react";

// Admin editor for a product's selectable options (sizes OR colours). Writes a
// comma-separated value into a hidden input named `name` (default "sizes"), so
// the existing server action / parseSizes stays unchanged. Numbers render as
// sizes; names render as colours with a swatch — matching the storefront.

const PRESET_COLORS: { name: string; hex: string }[] = [
  { name: "Roza", hex: "#F7A8C4" },
  { name: "Moder", hex: "#5FA8F5" },
  { name: "Bela", hex: "#FFFFFF" },
  { name: "Rdeča", hex: "#EF4444" },
  { name: "Zelena", hex: "#4CAF7D" },
  { name: "Rumena", hex: "#F6C445" },
  { name: "Siva", hex: "#9AA0A6" },
  { name: "Črna", hex: "#2B2B2B" },
  { name: "Vijolična", hex: "#B58BE0" },
];

function hexFor(name: string): string {
  const found = PRESET_COLORS.find((c) => c.name.toLowerCase() === name.toLowerCase());
  if (found) return found.hex;
  const n = name.toLowerCase();
  if (/roza|pink/.test(n)) return "#F7A8C4";
  if (/moder|modra|blue/.test(n)) return "#5FA8F5";
  if (/rde|red/.test(n)) return "#EF4444";
  if (/zelen|green/.test(n)) return "#4CAF7D";
  if (/rumen|yellow/.test(n)) return "#F6C445";
  return "#D9CBB8";
}

function isColorValue(v: string): boolean {
  return !!v && !/^\d/.test(v) && !/^eu/i.test(v);
}

export default function ProductOptionsField({
  initial,
  name = "sizes",
}: {
  initial: string[];
  name?: string;
}) {
  const [opts, setOpts] = useState<string[]>(initial ?? []);
  const [text, setText] = useState("");

  const add = (raw: string) => {
    const v = raw.trim();
    if (v && !opts.some((o) => o.toLowerCase() === v.toLowerCase())) {
      setOpts([...opts, v]);
    }
  };
  const remove = (v: string) => setOpts(opts.filter((o) => o !== v));

  const chip =
    "inline-flex items-center gap-1.5 rounded-full border border-orange-dark/25 bg-pearl px-2.5 py-1 text-[13px] font-semibold text-ink";
  const inputCls =
    "flex-1 rounded-lg border border-orange-dark/20 bg-cream px-3 py-2 text-sm text-ink focus:border-orange focus:outline-none";

  return (
    <div>
      {/* Value the server reads — unchanged data format. */}
      <input type="hidden" name={name} value={opts.join(", ")} readOnly />

      {/* Current options */}
      {opts.length > 0 ? (
        <div className="mb-3 flex flex-wrap gap-2">
          {opts.map((o) => (
            <span key={o} className={chip}>
              {isColorValue(o) && (
                <span
                  aria-hidden
                  className="h-3.5 w-3.5 rounded-full border border-black/15"
                  style={{ backgroundColor: hexFor(o) }}
                />
              )}
              {o}
              <button
                type="button"
                onClick={() => remove(o)}
                aria-label={`Odstrani ${o}`}
                className="ml-0.5 grid h-4 w-4 place-items-center rounded-full text-ink/50 hover:bg-orange/15 hover:text-orange-dark"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      ) : (
        <p className="mb-3 text-[12px] text-ink/50">
          Brez izbire — izdelek nima velikosti ali barv (na strani ni izbirnika).
        </p>
      )}

      {/* Quick-add colours */}
      <p className="text-[11px] font-bold uppercase tracking-wider text-ink/60">
        Hitro dodaj barvo
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {PRESET_COLORS.map((c) => {
          const on = opts.some((o) => o.toLowerCase() === c.name.toLowerCase());
          return (
            <button
              key={c.name}
              type="button"
              onClick={() => (on ? remove(opts.find((o) => o.toLowerCase() === c.name.toLowerCase())!) : add(c.name))}
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[12px] font-semibold transition-colors ${
                on
                  ? "border-orange bg-orange/10 text-orange-dark"
                  : "border-orange-dark/20 bg-pearl text-ink hover:border-orange-dark/40"
              }`}
            >
              <span
                aria-hidden
                className="h-3.5 w-3.5 rounded-full border border-black/15"
                style={{ backgroundColor: c.hex }}
              />
              {c.name}
              {on && <span className="text-orange-dark">✓</span>}
            </button>
          );
        })}
      </div>

      {/* Free-text add (sizes like 100, 110, or a custom value) */}
      <div className="mt-3 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add(text);
              setText("");
            }
          }}
          placeholder="npr. 100, 110 (velikost) ali druga barva"
          className={inputCls}
        />
        <button
          type="button"
          onClick={() => {
            add(text);
            setText("");
          }}
          className="rounded-lg bg-ink px-4 py-2 text-sm font-bold text-pearl hover:bg-orange-dark"
          style={{ color: "#FFFFFF" }}
        >
          Dodaj
        </button>
      </div>
    </div>
  );
}
