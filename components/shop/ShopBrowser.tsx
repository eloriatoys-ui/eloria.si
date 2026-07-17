"use client";

import { useEffect, useMemo, useState } from "react";
import { useLang } from "@/components/LangProvider";
import { productName } from "@/lib/product-i18n";
import { useSearchParams } from "next/navigation";
import type { Product } from "@/lib/data";
import { AGE_BUCKETS, ageMatches, type AgeBucketId } from "@/lib/age";
import { categoryLabel } from "@/lib/category-i18n";

type Props = {
  products: Product[];
  categories: string[];
};

type Sort = "featured" | "price-asc" | "price-desc" | "name";

export default function ShopBrowser({ products, categories }: Props) {
  const { t } = useLang();
  const sp = useSearchParams();

  const priceMin = Math.floor(
    products.reduce((m, p) => Math.min(m, p.price || Infinity), Infinity),
  ) || 0;
  const priceMax = Math.ceil(
    products.reduce((m, p) => Math.max(m, p.price || 0), 0),
  ) || 100;

  // Initial filter state from URL params: ?category=Dresses (or comma-separated),
  // ?tag=Summer, ?onSale=1, ?q=foo, ?sort=price-asc
  const initialCats = useMemo(() => {
    const set = new Set<string>();
    const raw =
      sp?.get("category") ?? sp?.get("categories") ?? sp?.get("cat") ?? "";
    raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((c) => {
        const match = categories.find(
          (cat) => cat.toLowerCase() === c.toLowerCase(),
        );
        if (match) set.add(match);
      });
    const tag = sp?.get("tag");
    if (tag) {
      const match = categories.find(
        (cat) => cat.toLowerCase() === tag.toLowerCase(),
      );
      if (match) set.add(match);
    }
    return set;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [selectedCats, setSelectedCats] = useState<Set<string>>(initialCats);
  const initialAges = useMemo(() => {
    const set = new Set<AgeBucketId>();
    const raw = sp?.get("age") ?? sp?.get("ages") ?? "";
    raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((id) => {
        const match = AGE_BUCKETS.find((b) => b.id === id);
        if (match) set.add(match.id);
      });
    return set;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [priceRange, setPriceRange] = useState<[number, number]>([priceMin, priceMax]);
  const [onSale, setOnSale] = useState(sp?.get("onSale") === "1");
  const [search, setSearch] = useState(sp?.get("q") ?? "");
  const [selectedAges, setSelectedAges] = useState<Set<AgeBucketId>>(initialAges);
  const [sort, setSort] = useState<Sort>(
    (["featured", "price-asc", "price-desc", "name"].includes(sp?.get("sort") || "")
      ? (sp!.get("sort") as Sort)
      : "featured"),
  );
  const [filtersOpen, setFiltersOpen] = useState(false); // mobile drawer

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = products.filter((p) => {
      if (selectedCats.size > 0 && !selectedCats.has(p.category)) return false;
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
      if (onSale && !(p.comparePrice > p.price)) return false;
      if (q && !p.name.toLowerCase().includes(q)) return false;
      if (selectedAges.size > 0) {
        const range =
          typeof p.ageMinMonths === "number"
            ? { minMonths: p.ageMinMonths, maxMonths: p.ageMaxMonths }
            : undefined;
        if (!ageMatches(range, selectedAges)) return false;
      }
      return true;
    });
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [products, selectedCats, priceRange, onSale, search, sort, selectedAges]);

  const catCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of products) counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
    return counts;
  }, [products]);

  const ageCounts = useMemo(() => {
    const counts = new Map<AgeBucketId, number>();
    for (const b of AGE_BUCKETS) counts.set(b.id, 0);
    for (const p of products) {
      if (typeof p.ageMinMonths !== "number") continue;
      const range = { minMonths: p.ageMinMonths, maxMonths: p.ageMaxMonths };
      for (const b of AGE_BUCKETS) {
        if (ageMatches(range, [b.id])) {
          counts.set(b.id, (counts.get(b.id) ?? 0) + 1);
        }
      }
    }
    return counts;
  }, [products]);

  const productsWithoutAge = useMemo(
    () => products.filter((p) => typeof p.ageMinMonths !== "number").length,
    [products],
  );

  const activeFilterCount =
    selectedCats.size +
    (onSale ? 1 : 0) +
    (priceRange[0] !== priceMin || priceRange[1] !== priceMax ? 1 : 0) +
    (search ? 1 : 0) +
    selectedAges.size;

  function toggleCat(c: string) {
    setSelectedCats((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });
  }

  function toggleAge(id: AgeBucketId) {
    setSelectedAges((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function resetAll() {
    setSelectedCats(new Set());
    setSelectedAges(new Set());
    setPriceRange([priceMin, priceMax]);
    setOnSale(false);
    setSearch("");
  }

  return (
    <div className="bg-cream pb-16">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-8 lg:grid-cols-[260px_1fr] lg:gap-10">
          {/* SIDEBAR — desktop */}
          <aside className="sticky top-24 hidden h-fit lg:block">
            <FilterSidebar
              categories={categories}
              catCounts={catCounts}
              selectedCats={selectedCats}
              toggleCat={toggleCat}
              priceMin={priceMin}
              priceMax={priceMax}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              onSale={onSale}
              setOnSale={setOnSale}
              search={search}
              setSearch={setSearch}
              selectedAges={selectedAges}
              toggleAge={toggleAge}
              ageCounts={ageCounts}
              productsWithoutAge={productsWithoutAge}
              activeCount={activeFilterCount}
              onReset={resetAll}
            />
          </aside>

          {/* MAIN COLUMN */}
          <div className="min-w-0">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-orange-dark/15 pb-4">
              <p className="text-[13px] font-semibold text-slate">
                Prikazano{" "}
                <span className="text-ink">{visible.length}</span> od{" "}
                <span className="text-ink">{products.length}</span> izdelkov
              </p>
              <div className="flex items-center gap-2">
                {/* Mobile filters toggle */}
                <button
                  type="button"
                  onClick={() => setFiltersOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full border border-orange-dark/25 bg-pearl px-4 py-2 text-[12px] font-bold text-ink transition-colors hover:border-orange hover:bg-orange hover:text-pearl lg:hidden"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="4" y1="6" x2="20" y2="6" />
                    <line x1="6" y1="12" x2="18" y2="12" />
                    <line x1="9" y1="18" x2="15" y2="18" />
                  </svg>
                  {t("br.filters")}
                  {activeFilterCount > 0 && (
                    <span className="ml-0.5 rounded-full bg-orange px-2 py-0.5 text-[10px] font-extrabold text-pearl">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                <label className="flex items-center gap-2 text-[12px] font-semibold text-slate">
                  <span className="hidden md:inline">{t("br.sort.label")}:</span>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as Sort)}
                    className="rounded-md border border-orange-dark/20 bg-pearl px-3 py-2 text-[13px] font-bold text-ink outline-none focus:border-orange"
                  >
                    <option value="featured">{t("br.sort.featured")}</option>
                    <option value="price-asc">{t("br.sort.priceasc")}</option>
                    <option value="price-desc">{t("br.sort.pricedesc")}</option>
                    <option value="name">{t("br.sort.newest")}</option>
                  </select>
                </label>
              </div>
            </div>

            {/* Active chips */}
            {activeFilterCount > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {[...selectedCats].map((c) => (
                  <Chip key={c} label={categoryLabel(c)} onRemove={() => toggleCat(c)} />
                ))}
                {[...selectedAges].map((id) => {
                  const b = AGE_BUCKETS.find((x) => x.id === id);
                  return (
                    <Chip
                      key={id}
                      label={b?.label ?? id}
                      onRemove={() => toggleAge(id)}
                    />
                  );
                })}
                {onSale && (
                  <Chip label={t("br.specials.sale")} onRemove={() => setOnSale(false)} />
                )}
                {(priceRange[0] !== priceMin || priceRange[1] !== priceMax) && (
                  <Chip
                    label={`${priceRange[0]}€ – ${priceRange[1]}€`}
                    onRemove={() => setPriceRange([priceMin, priceMax])}
                  />
                )}
                {search && (
                  <Chip label={`“${search}”`} onRemove={() => setSearch("")} />
                )}
                <button
                  onClick={resetAll}
                  className="ml-1 text-[12px] font-bold text-orange-dark underline underline-offset-2 hover:text-orange"
                >
                  {t("br.clear")}
                </button>
              </div>
            )}

            {/* Grid */}
            <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 md:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
              {visible.map((p) => (
                <ShopCard key={p.id} product={p} />
              ))}
            </div>

            {visible.length === 0 && (
              <div className="mt-16 flex flex-col items-center gap-3 text-center">
                <span className="text-5xl">🪴</span>
                <p className="text-[15px] font-bold text-ink">{t("br.empty.title")}</p>
                <button
                  onClick={resetAll}
                  className="mt-2 rounded-full bg-orange-dark px-5 py-2.5 text-[12px] font-extrabold uppercase tracking-wider text-pearl hover:bg-orange"
                  style={{ color: "#FFFFFF" }}
                >
                  <span style={{ color: "#FFFFFF" }}>{t("br.clear")}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE filter drawer */}
      <MobileFilterDrawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
      >
        <FilterSidebar
          categories={categories}
          catCounts={catCounts}
          selectedCats={selectedCats}
          toggleCat={toggleCat}
          priceMin={priceMin}
          priceMax={priceMax}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          onSale={onSale}
          setOnSale={setOnSale}
          search={search}
          setSearch={setSearch}
          selectedAges={selectedAges}
          toggleAge={toggleAge}
          ageCounts={ageCounts}
          productsWithoutAge={productsWithoutAge}
          activeCount={activeFilterCount}
          onReset={resetAll}
        />
      </MobileFilterDrawer>
    </div>
  );
}

// ─── Sidebar ────────────────────────────────────────────────────────────

function FilterSidebar(props: {
  categories: string[];
  catCounts: Map<string, number>;
  selectedCats: Set<string>;
  toggleCat: (c: string) => void;
  priceMin: number;
  priceMax: number;
  priceRange: [number, number];
  setPriceRange: (r: [number, number]) => void;
  onSale: boolean;
  setOnSale: (v: boolean) => void;
  search: string;
  setSearch: (s: string) => void;
  selectedAges: Set<AgeBucketId>;
  toggleAge: (id: AgeBucketId) => void;
  ageCounts: Map<AgeBucketId, number>;
  productsWithoutAge: number;
  activeCount: number;
  onReset: () => void;
}) {
  const {
    categories,
    catCounts,
    selectedCats,
    toggleCat,
    priceMin,
    priceMax,
    priceRange,
    setPriceRange,
    onSale,
    setOnSale,
    search,
    setSearch,
    selectedAges,
    toggleAge,
    ageCounts,
    productsWithoutAge,
    activeCount,
    onReset,
  } = props;
  const { t } = useLang();

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-[13px] font-extrabold uppercase tracking-[0.18em] text-orange-dark">
          {t("br.filters")}
        </h3>
        {activeCount > 0 && (
          <button
            onClick={onReset}
            className="text-[12px] font-bold text-orange-dark underline underline-offset-2 hover:text-orange"
          >
            {t("br.clear")}
          </button>
        )}
      </div>

      {/* Search */}
      <FilterSection title={t("br.search")} open>
        <div className="relative">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#78716C"
            strokeWidth="2.2"
            strokeLinecap="round"
            className="absolute left-3 top-1/2 -translate-y-1/2"
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("br.search.placeholder")}
            className="w-full rounded-md border border-orange-dark/20 bg-pearl py-2 pl-9 pr-3 text-[13px] text-ink outline-none focus:border-orange"
          />
        </div>
      </FilterSection>

      {/* Categories */}
      <FilterSection title={t("br.cat")} open badge={selectedCats.size}>
        <div className="flex flex-col gap-2">
          {categories.map((c) => {
            const count = catCounts.get(c) ?? 0;
            const checked = selectedCats.has(c);
            return (
              <label
                key={c}
                className="flex cursor-pointer items-center justify-between gap-2 text-[13px] font-semibold text-ink hover:text-orange-dark"
              >
                <span className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleCat(c)}
                    className="h-4 w-4 rounded border-orange-dark/30 text-orange-dark accent-orange"
                  />
                  {categoryLabel(c)}
                </span>
                <span className="text-[11px] font-bold text-slate">{count}</span>
              </label>
            );
          })}
        </div>
      </FilterSection>

      {/* Age */}
      <FilterSection title={t("br.age")} open badge={selectedAges.size}>
        <div className="flex flex-col gap-2">
          {AGE_BUCKETS.map((b) => {
            const count = ageCounts.get(b.id) ?? 0;
            const checked = selectedAges.has(b.id);
            return (
              <label
                key={b.id}
                className="flex cursor-pointer items-center justify-between gap-2 text-[13px] font-semibold text-ink hover:text-orange-dark"
              >
                <span className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleAge(b.id)}
                    className="h-4 w-4 rounded border-orange-dark/30 accent-orange"
                  />
                  {b.label}
                </span>
                <span className="text-[11px] font-bold text-slate">{count}</span>
              </label>
            );
          })}
          {productsWithoutAge > 0 && (
            <p className="mt-1 text-[11px] text-slate/85">
              {productsWithoutAge} {t("br.no_age")}
            </p>
          )}
        </div>
      </FilterSection>

      {/* Price */}
      <FilterSection title={t("br.price")} open>
        <PriceSlider
          min={priceMin}
          max={priceMax}
          value={priceRange}
          onChange={setPriceRange}
        />
      </FilterSection>

      {/* Specials */}
      <FilterSection title={t("br.specials")} open>
        <label className="flex cursor-pointer items-center gap-2 text-[13px] font-semibold text-ink hover:text-orange-dark">
          <input
            type="checkbox"
            checked={onSale}
            onChange={(e) => setOnSale(e.target.checked)}
            className="h-4 w-4 rounded border-orange-dark/30 accent-orange"
          />
          {t("br.specials.sale")}
        </label>
      </FilterSection>
    </div>
  );
}

function FilterSection({
  title,
  open: defaultOpen = true,
  badge,
  children,
}: {
  title: string;
  open?: boolean;
  badge?: number;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-orange-dark/10 pb-5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between"
      >
        <span className="flex items-center gap-2 text-[13px] font-extrabold uppercase tracking-wider text-ink">
          {title}
          {badge !== undefined && badge > 0 && (
            <span className="rounded-full bg-orange px-2 py-0.5 text-[10px] font-extrabold text-pearl">
              {badge}
            </span>
          )}
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-slate transition-transform ${open ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}

// ─── Price slider (dual handle) ─────────────────────────────────────────

function PriceSlider({
  min,
  max,
  value,
  onChange,
}: {
  min: number;
  max: number;
  value: [number, number];
  onChange: (v: [number, number]) => void;
}) {
  const [lo, hi] = value;
  const range = max - min || 1;
  const loPct = ((lo - min) / range) * 100;
  const hiPct = ((hi - min) / range) * 100;

  return (
    <div>
      <div className="relative h-7">
        {/* Track */}
        <div className="absolute left-0 right-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-orange-dark/15" />
        {/* Selected range */}
        <div
          className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-orange"
          style={{ left: `${loPct}%`, right: `${100 - hiPct}%` }}
        />
        {/* Inputs */}
        <input
          type="range"
          min={min}
          max={max}
          value={lo}
          onChange={(e) => {
            const v = Math.min(Number(e.target.value), hi - 1);
            onChange([v, hi]);
          }}
          className="pointer-events-none absolute inset-0 h-7 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-10 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-orange-dark [&::-webkit-slider-thumb]:bg-pearl [&::-webkit-slider-thumb]:shadow-md"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={hi}
          onChange={(e) => {
            const v = Math.max(Number(e.target.value), lo + 1);
            onChange([lo, v]);
          }}
          className="pointer-events-none absolute inset-0 h-7 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-10 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-orange-dark [&::-webkit-slider-thumb]:bg-pearl [&::-webkit-slider-thumb]:shadow-md"
        />
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <NumberInput value={lo} onChange={(v) => onChange([Math.min(v, hi - 1), hi])} />
        <span className="text-[12px] text-slate">do</span>
        <NumberInput value={hi} onChange={(v) => onChange([lo, Math.max(v, lo + 1)])} />
      </div>
    </div>
  );
}

function NumberInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center rounded-md border border-orange-dark/20 bg-pearl px-2 py-1.5 text-[13px] font-bold text-ink">
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-14 bg-transparent outline-none"
      />
      <span className="text-slate">€</span>
    </div>
  );
}

// ─── Mobile drawer ──────────────────────────────────────────────────────

function MobileFilterDrawer({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const { t } = useLang();
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-y-0 left-0 flex w-[85%] max-w-sm flex-col bg-cream shadow-lift">
        <div className="flex items-center justify-between border-b border-orange-dark/15 bg-pearl px-5 py-4">
          <h3 className="text-[14px] font-extrabold uppercase tracking-[0.18em] text-ink">
            {t("br.filters")}
          </h3>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full hover:bg-orange/10"
            aria-label={t("br.filters")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
        <div className="border-t border-orange-dark/15 bg-pearl p-4">
          <button
            onClick={onClose}
            className="w-full rounded-full bg-orange-dark px-5 py-3 text-[13px] font-extrabold uppercase tracking-wider text-pearl"
            style={{ color: "#FFFFFF" }}
          >
            <span style={{ color: "#FFFFFF" }}>{t("br.apply")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Filter chip ────────────────────────────────────────────────────────

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-orange/10 px-3 py-1.5 text-[12px] font-bold text-orange-dark">
      {label}
      <button
        onClick={onRemove}
        className="grid h-4 w-4 place-items-center rounded-full hover:bg-orange/20"
        aria-label={`Odstrani ${label}`}
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
          <line x1="6" y1="6" x2="18" y2="18" />
          <line x1="18" y1="6" x2="6" y2="18" />
        </svg>
      </button>
    </span>
  );
}

// ─── Product card — image-cycle on hover + Add to cart ─────────────────

function ShopCard({ product }: { product: Product }) {
  const onSale = product.comparePrice > product.price;
  const href = product.slug ? `/trgovina/${product.slug}` : `/trgovina/${product.id}`;
  // pulled below `useLang()` so we can read the active locale.

  const localImages = (
    (product as Product & { images?: string[] }).images?.length
      ? (product as Product & { images?: string[] }).images!
      : product.image
      ? [product.image]
      : []
  ) as string[];

  const [remoteImages, setRemoteImages] = useState<string[]>([]);
  const [active, setActive] = useState(0);
  const [fetched, setFetched] = useState(false);
  const { t, locale } = useLang();
  const name = productName(product, locale);

  const gallery = useMemo(() => {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const src of [...localImages, ...remoteImages]) {
      if (!src || seen.has(src)) continue;
      seen.add(src);
      out.push(src);
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localImages.join("|"), remoteImages.join("|")]);

  // Lazy-fetch the full gallery on first hover/touch.
  function ensureFetched() {
    if (fetched) return;
    setFetched(true);
    fetch(`/api/product/${product.id}`)
      .then((r) => r.json())
      .then((data) => {
        setRemoteImages(data.images ?? []);
      })
      .catch(() => {});
  }

  // No auto-cycling — images only change when the user clicks the arrows
  // or dots. (Hover only triggers gallery prefetch + arrow visibility.)

  return (
    <article
      className="group flex h-full flex-col overflow-hidden rounded-2xl bg-pearl transition-all duration-300 hover:-translate-y-1"
      style={{
        border: "1px solid #F4DCB7",
        boxShadow:
          "0 1px 2px rgba(194, 65, 12, 0.06), 0 8px 24px -10px rgba(194, 65, 12, 0.18)",
      }}
      onMouseEnter={ensureFetched}
      onTouchStart={ensureFetched}
    >
      {/* IMAGE AREA — link to product page */}
      <a
        href={href}
        aria-label={name}
        className="relative block aspect-square w-full overflow-hidden bg-pearl"
      >
        {product.badge && (
          <span
            className="absolute left-3 top-3 z-10 rounded px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
            style={{ backgroundColor: "#F97316", color: "#FFFFFF" }}
          >
            {product.badge}
          </span>
        )}
        {onSale && !product.badge && (
          <span
            className="absolute left-3 top-3 z-10 rounded px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
            style={{ backgroundColor: "#E55B47", color: "#FFFFFF" }}
          >
            Akcija
          </span>
        )}

        {/* Crossfade stack of images */}
        {gallery.length > 0 ? (
          gallery.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={src}
              src={src}
              alt={i === 0 ? name : ""}
              loading={i === 0 ? "eager" : "lazy"}
              className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-in-out group-hover:scale-[1.03]"
              style={{ opacity: i === active ? 1 : 0 }}
            />
          ))
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-sand">
            <span className="text-[4rem]">{product.emoji}</span>
          </div>
        )}

        {/* Prev / Next arrows on hover (desktop) */}
        {gallery.length > 1 && (
          <>
            <button
              type="button"
              aria-label="‹"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setActive((i) => (i - 1 + gallery.length) % gallery.length);
              }}
              className="absolute left-2 top-1/2 z-20 hidden h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-pearl/95 text-ink shadow-md opacity-0 transition-opacity hover:bg-orange hover:text-pearl group-hover:opacity-100 md:grid"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Naslednja slika"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setActive((i) => (i + 1) % gallery.length);
              }}
              className="absolute right-2 top-1/2 z-20 hidden h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-pearl/95 text-ink shadow-md opacity-0 transition-opacity hover:bg-orange hover:text-pearl group-hover:opacity-100 md:grid"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 6 15 12 9 18" />
              </svg>
            </button>

            {/* Dots — clickable */}
            <div className="absolute inset-x-0 bottom-3 z-20 flex justify-center gap-1.5">
              {gallery.slice(0, 8).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Pokaži sliko ${i + 1}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActive(i);
                  }}
                  className={[
                    "h-1.5 rounded-full transition-all",
                    i === active ? "w-5 bg-orange" : "w-1.5 bg-pearl/80 hover:bg-pearl",
                  ].join(" ")}
                />
              ))}
            </div>
          </>
        )}
      </a>

      {/* BODY */}
      <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
        <div className="flex items-baseline gap-2">
          {onSale && (
            <span
              className="text-[15px] font-extrabold text-ink line-through opacity-55"
              style={{ textDecorationThickness: "1.5px" }}
            >
              {product.comparePrice.toFixed(2)}€
            </span>
          )}
          <span className="text-[17px] font-extrabold text-ink">
            {product.price.toFixed(2)}€
          </span>
        </div>

        <a
          href={href}
          className="mt-2 line-clamp-2 min-h-[2.6em] text-[13px] font-medium leading-snug text-ink transition-colors hover:text-orange-dark"
        >
          {name}
        </a>
        <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate">
          {categoryLabel(product.category)}
        </p>

        {/* Footer actions — Add to cart + Wishlist (single line, brand orange) */}
        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              // Wire to cart store here.
            }}
            className="flex-1 inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-3 py-2 text-[11px] font-extrabold uppercase tracking-wider text-pearl transition-colors"
            style={{
              backgroundColor: "#F4B73E",
              color: "#FFFFFF",
              letterSpacing: "0.08em",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F97316")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#F4B73E")}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1.4" />
              <circle cx="18" cy="21" r="1.4" />
              <path d="M3 3h2l2.6 12.6a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6" />
            </svg>
            <span style={{ color: "#FFFFFF" }}>{t("br.add_to_cart")}</span>
          </button>
          <WishlistButton />
        </div>
      </div>
    </article>
  );
}

function WishlistButton() {
  const [liked, setLiked] = useState(false);
  const { t } = useLang();
  return (
    <button
      type="button"
      aria-label={liked ? t("card.wish_remove") : t("card.wish_add")}
      onClick={() => setLiked((v) => !v)}
      className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-orange-dark/25 transition-transform hover:scale-110"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill={liked ? "#E55B47" : "none"} stroke="#E55B47" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}

