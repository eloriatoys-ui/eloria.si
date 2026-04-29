"use client";

import { useMemo, useRef, useState } from "react";
import type { Product } from "@/lib/data";
import {
  SECTION_KEYS,
  SECTION_LABELS,
  type SectionKey,
  type SectionMap,
} from "@/lib/sections";

type ProductWithImages = Product & { images?: string[] };

type LiveGallery = {
  images: string[];
  videos: string[];
  uploads: string[];
  loading: boolean;
  error?: string;
};

type Props = {
  products: ProductWithImages[];
  initialOverrides: Record<string, string>;
  initialSections: SectionMap;
};

// `null` in draftMain means "pending clear (reset to default)".
type DraftMain = Record<number, string | null>;
type DraftSections = Record<number, Partial<Record<SectionKey, boolean>>>;

export default function AdminImagePicker({
  products,
  initialOverrides,
  initialSections,
}: Props) {
  const [overrides, setOverrides] =
    useState<Record<string, string>>(initialOverrides);
  const [sections, setSections] = useState<SectionMap>(initialSections);

  const [draftMain, setDraftMain] = useState<DraftMain>({});
  const [draftSections, setDraftSections] = useState<DraftSections>({});

  const [savingProductId, setSavingProductId] = useState<number | null>(null);
  const [uploadingId, setUploadingId] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<
    "all" | "multi" | "custom" | "dirty" | SectionKey
  >("all");
  const [live, setLive] = useState<Record<number, LiveGallery>>({});

  const dirtyIds = useMemo(() => {
    const set = new Set<number>();
    for (const k of Object.keys(draftMain)) set.add(Number(k));
    for (const k of Object.keys(draftSections)) {
      const sub = draftSections[Number(k)];
      if (sub && Object.keys(sub).length > 0) set.add(Number(k));
    }
    return set;
  }, [draftMain, draftSections]);

  const isDirty = (id: number) => dirtyIds.has(id);

  const savedInSection = (id: number, key: SectionKey): boolean =>
    sections[key]?.includes(id) ?? false;

  const effectiveInSection = (id: number, key: SectionKey): boolean => {
    const d = draftSections[id]?.[key];
    if (d !== undefined) return d;
    return savedInSection(id, key);
  };

  const savedMain = (id: number): string | undefined =>
    overrides[String(id)];

  const effectiveMain = (
    id: number,
    defaultFromGallery: string | undefined,
  ): string | undefined => {
    const d = draftMain[id];
    if (d === null) return defaultFromGallery; // pending reset
    if (d !== undefined) return d;
    return savedMain(id) ?? defaultFromGallery;
  };

  // ── Draft mutators ─────────────────────────────────────────────────────

  function stageMain(id: number, url: string) {
    setDraftMain((prev) => {
      const saved = savedMain(id);
      // If user picks the already-saved main, clear the draft.
      if (url === saved) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: url };
    });
  }

  function stageReset(id: number) {
    setDraftMain((prev) => ({ ...prev, [id]: null }));
  }

  function toggleSectionDraft(id: number, key: SectionKey) {
    const saved = savedInSection(id, key);
    const desired = !effectiveInSection(id, key);
    setDraftSections((prev) => {
      const cur = { ...(prev[id] ?? {}) };
      if (desired === saved) {
        delete cur[key];
      } else {
        cur[key] = desired;
      }
      const next = { ...prev };
      if (Object.keys(cur).length === 0) {
        delete next[id];
      } else {
        next[id] = cur;
      }
      return next;
    });
  }

  function discardDraft(id: number) {
    setDraftMain((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setDraftSections((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  // ── Save ───────────────────────────────────────────────────────────────

  async function saveProduct(id: number) {
    setSavingProductId(id);
    try {
      const tasks: Promise<Response>[] = [];

      const mainDraft = draftMain[id];
      if (mainDraft !== undefined) {
        const body =
          mainDraft === null
            ? { productId: id, clear: true }
            : { productId: id, imageUrl: mainDraft };
        tasks.push(
          fetch("/api/admin/main-image", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(body),
          }),
        );
      }

      const sectionDrafts = draftSections[id] ?? {};
      for (const [key, enabled] of Object.entries(sectionDrafts) as [
        SectionKey,
        boolean,
      ][]) {
        tasks.push(
          fetch("/api/admin/sections", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ productId: id, section: key, enabled }),
          }),
        );
      }

      const responses = await Promise.all(tasks);
      for (const r of responses) {
        if (!r.ok) {
          const text = await r.text().catch(() => "");
          throw new Error(text || `HTTP ${r.status}`);
        }
      }

      // Apply drafts to saved state locally.
      setOverrides((prev) => {
        const next = { ...prev };
        if (mainDraft === null) delete next[String(id)];
        else if (mainDraft !== undefined) next[String(id)] = mainDraft;
        return next;
      });
      setSections((prev) => {
        const next: SectionMap = {
          newArrivals: [...prev.newArrivals],
          trending: [...prev.trending],
        };
        for (const [key, enabled] of Object.entries(sectionDrafts) as [
          SectionKey,
          boolean,
        ][]) {
          const list = next[key];
          const idx = list.indexOf(id);
          if (enabled && idx === -1) list.push(id);
          if (!enabled && idx !== -1) list.splice(idx, 1);
        }
        return next;
      });

      discardDraft(id);
    } catch (err) {
      alert("Save failed: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setSavingProductId(null);
    }
  }

  async function saveAll() {
    const ids = Array.from(dirtyIds);
    for (const id of ids) {
      // Sequential to avoid race conditions on the JSON files.
      // eslint-disable-next-line no-await-in-loop
      await saveProduct(id);
    }
  }

  // ── Live gallery + upload ──────────────────────────────────────────────

  async function loadLive(productId: number) {
    setLive((prev) => ({
      ...prev,
      [productId]: { images: [], videos: [], uploads: [], loading: true },
    }));
    try {
      const res = await fetch(`/api/admin/wc-gallery/${productId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? `HTTP ${res.status}`);
      setLive((prev) => ({
        ...prev,
        [productId]: {
          images: data.images ?? [],
          videos: data.videos ?? [],
          uploads: data.uploads ?? [],
          loading: false,
        },
      }));
    } catch (err) {
      setLive((prev) => ({
        ...prev,
        [productId]: {
          images: [],
          videos: [],
          uploads: [],
          loading: false,
          error: err instanceof Error ? err.message : String(err),
        },
      }));
    }
  }

  async function uploadFile(productId: number, file: File) {
    setUploadingId(productId);
    try {
      const fd = new FormData();
      fd.append("productId", String(productId));
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? `HTTP ${res.status}`);
      const url: string = data.url;
      setLive((prev) => {
        const cur = prev[productId];
        return {
          ...prev,
          [productId]: {
            images: cur?.images ?? [],
            videos: cur?.videos ?? [],
            uploads: [...(cur?.uploads ?? []), url],
            loading: false,
          },
        };
      });
      // Stage as draft main — the user can confirm with Save.
      stageMain(productId, url);
    } catch (err) {
      alert("Upload failed: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setUploadingId(null);
    }
  }

  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkProgress, setBulkProgress] = useState({ done: 0, total: 0 });

  // ── List filtering — uses SAVED state so toggling drafts doesn't
  // ── reshuffle the list mid-edit.
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (q && !p.name.toLowerCase().includes(q)) return false;
      if (filter === "multi" && (p.images?.length ?? 0) < 2) return false;
      if (filter === "custom" && !overrides[String(p.id)]) return false;
      if (filter === "dirty" && !dirtyIds.has(p.id)) return false;
      if (
        (filter === "newArrivals" || filter === "trending") &&
        !sections[filter]?.includes(p.id)
      )
        return false;
      return true;
    });
  }, [products, query, filter, overrides, sections, dirtyIds]);

  async function loadAllVisible() {
    const targets = visible.filter((p) => !live[p.id]);
    if (targets.length === 0) return;
    setBulkLoading(true);
    setBulkProgress({ done: 0, total: targets.length });
    const concurrency = 4;
    let i = 0;
    async function worker() {
      while (i < targets.length) {
        const idx = i++;
        await loadLive(targets[idx].id);
        setBulkProgress((prev) => ({ ...prev, done: prev.done + 1 }));
      }
    }
    await Promise.all(Array.from({ length: concurrency }, worker));
    setBulkLoading(false);
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 md:px-8">
      <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-orange-dark/15 bg-pearl p-4 md:flex-row md:items-center md:justify-between">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products by name…"
          className="w-full rounded-md border border-orange-dark/20 bg-cream px-3 py-2 text-sm text-ink outline-none focus:border-orange md:w-80"
        />
        <div className="flex flex-wrap items-center gap-2 text-[12px]">
          {(["all", "multi", "custom", "dirty", ...SECTION_KEYS] as const).map(
            (f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={[
                  "rounded-full border px-3 py-1.5 font-bold transition-colors",
                  filter === f
                    ? "border-orange bg-orange text-pearl"
                    : "border-orange-dark/25 text-slate hover:border-orange hover:text-ink",
                ].join(" ")}
              >
                {f === "all"
                  ? "All products"
                  : f === "multi"
                  ? "Has gallery"
                  : f === "custom"
                  ? "Customized"
                  : f === "dirty"
                  ? `Unsaved (${dirtyIds.size})`
                  : `In ${SECTION_LABELS[f]}`}
              </button>
            ),
          )}
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[12px] font-semibold text-slate">
          Showing {visible.length} of {products.length}
          {dirtyIds.size > 0 && (
            <>
              {" · "}
              <span className="text-[#b45309]">
                {dirtyIds.size} unsaved
              </span>
            </>
          )}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {dirtyIds.size > 0 && (
            <button
              onClick={saveAll}
              disabled={savingProductId !== null}
              className="rounded-full bg-[#047857] px-4 py-2 text-[12px] font-bold text-pearl transition-colors hover:bg-[#065f46] disabled:opacity-60"
            >
              {savingProductId !== null
                ? "Saving…"
                : `Save all (${dirtyIds.size})`}
            </button>
          )}
          <button
            onClick={loadAllVisible}
            disabled={bulkLoading}
            className="rounded-full border border-orange-dark/25 px-4 py-2 text-[12px] font-bold text-ink transition-colors hover:border-orange hover:bg-orange hover:text-pearl disabled:opacity-60"
          >
            {bulkLoading
              ? `Loading… ${bulkProgress.done}/${bulkProgress.total}`
              : "Load galleries for all visible"}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {visible.map((p) => {
          const localGallery = p.images?.length
            ? p.images
            : p.image
            ? [p.image]
            : [];
          const liveData = live[p.id];
          const liveImages = liveData?.images ?? [];
          const liveVideos = liveData?.videos ?? [];
          const liveUploads = liveData?.uploads ?? [];
          const fallbackMain = localGallery[0];
          const currentMain = effectiveMain(p.id, fallbackMain);
          const dirty = isDirty(p.id);
          const saving = savingProductId === p.id;
          const uploading = uploadingId === p.id;
          const mainDraft = draftMain[p.id];

          // Combined unique gallery (uploads first, then local, then live).
          const seen = new Set<string>();
          const combined: string[] = [];
          for (const src of [...liveUploads, ...localGallery, ...liveImages]) {
            if (!src || seen.has(src)) continue;
            seen.add(src);
            combined.push(src);
          }

          return (
            <article
              key={p.id}
              className={[
                "rounded-2xl border bg-pearl p-4",
                dirty
                  ? "border-[#f59e0b] ring-2 ring-[#fde68a]"
                  : "border-orange-dark/15",
              ].join(" ")}
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start">
                <div className="flex w-full items-start gap-3 md:w-72 md:shrink-0">
                  <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-lg bg-cream ring-1 ring-orange-dark/10">
                    {currentMain ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={currentMain}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl">{p.emoji}</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="line-clamp-2 text-[14px] font-bold text-ink">
                      {p.name}
                    </h2>
                    <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-slate">
                      #{p.id} · {p.category}
                    </p>

                    {/* Section chips */}
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      {SECTION_KEYS.map((key) => {
                        const on = effectiveInSection(p.id, key);
                        const saved = savedInSection(p.id, key);
                        const pending = on !== saved;
                        return (
                          <button
                            key={key}
                            onClick={() => toggleSectionDraft(p.id, key)}
                            disabled={saving}
                            title={
                              on
                                ? `Remove from ${SECTION_LABELS[key]}`
                                : `Add to ${SECTION_LABELS[key]}`
                            }
                            className={[
                              "rounded-full border px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider transition-colors",
                              on
                                ? "border-[#047857] bg-[#047857] text-pearl hover:bg-[#065f46]"
                                : "border-orange-dark/25 text-slate hover:border-[#047857] hover:text-[#065f46]",
                              pending ? "ring-2 ring-[#fbbf24]" : "",
                            ].join(" ")}
                          >
                            {on ? "✓ " : "+ "}
                            {SECTION_LABELS[key]}
                            {pending ? " *" : ""}
                          </button>
                        );
                      })}
                    </div>

                    {/* Save / discard / utility actions */}
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {dirty && (
                        <>
                          <button
                            onClick={() => saveProduct(p.id)}
                            disabled={saving}
                            className="rounded-full bg-[#047857] px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-pearl transition-colors hover:bg-[#065f46] disabled:opacity-60"
                          >
                            {saving ? "Saving…" : "Save"}
                          </button>
                          <button
                            onClick={() => discardDraft(p.id)}
                            disabled={saving}
                            className="text-[11px] font-bold text-slate underline underline-offset-2 hover:text-ink disabled:opacity-50"
                          >
                            Discard changes
                          </button>
                          <span className="text-orange-dark/40">·</span>
                        </>
                      )}
                      <button
                        onClick={() => loadLive(p.id)}
                        disabled={liveData?.loading || saving}
                        className="rounded-full bg-orange px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-pearl transition-colors hover:bg-orange-dark disabled:opacity-60"
                      >
                        {liveData?.loading
                          ? "Loading…"
                          : liveData
                          ? "Reload from WC"
                          : "Load all images & videos"}
                      </button>
                      <UploadButton
                        productId={p.id}
                        uploading={uploading}
                        onFile={(file) => uploadFile(p.id, file)}
                      />
                      {savedMain(p.id) && mainDraft !== null && (
                        <button
                          onClick={() => stageReset(p.id)}
                          disabled={saving}
                          className="text-[11px] font-bold text-orange-dark underline underline-offset-2 disabled:opacity-50"
                        >
                          Reset to default
                        </button>
                      )}
                    </div>

                    {liveData?.error && (
                      <p className="mt-2 text-[11px] text-red-600">
                        {liveData.error}
                      </p>
                    )}
                    {liveData && !liveData.loading && !liveData.error && (
                      <p className="mt-2 text-[11px] text-slate">
                        {liveImages.length} image
                        {liveImages.length === 1 ? "" : "s"}
                        {liveVideos.length > 0 &&
                          ` · ${liveVideos.length} video${
                            liveVideos.length === 1 ? "" : "s"
                          }`}{" "}
                        in WooCommerce
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex-1">
                  {combined.length === 0 ? (
                    <p className="text-[13px] text-slate">
                      No images yet — click <em>Load all images &amp; videos</em>.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {combined.map((src, i) => {
                        const isMain = src === currentMain;
                        const isSavedMain = src === savedMain(p.id);
                        const isPending = isMain && !isSavedMain;
                        const isRemote = /^https?:\/\//.test(src);
                        const isUpload = src.startsWith("/uploads/");
                        return (
                          <button
                            key={src + i}
                            onClick={() => stageMain(p.id, src)}
                            disabled={saving}
                            className={[
                              "relative h-24 w-24 shrink-0 overflow-hidden rounded-lg ring-2 transition-transform hover:scale-[1.03]",
                              isPending
                                ? "ring-[#f59e0b]"
                                : isMain
                                ? "ring-orange"
                                : "ring-transparent hover:ring-orange-dark/40",
                              saving ? "opacity-60" : "",
                            ].join(" ")}
                            title={
                              isPending
                                ? "Pending main image — click Save"
                                : isMain
                                ? "Current main image"
                                : "Set as main image"
                            }
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={src}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                            {isMain && (
                              <span
                                className={[
                                  "absolute left-1 top-1 rounded px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-pearl",
                                  isPending ? "bg-[#f59e0b]" : "bg-orange",
                                ].join(" ")}
                              >
                                {isPending ? "Pending" : "Main"}
                              </span>
                            )}
                            {isRemote && !isMain && (
                              <span className="absolute right-1 top-1 rounded bg-ink/70 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-pearl">
                                WC
                              </span>
                            )}
                            {isUpload && !isMain && (
                              <span className="absolute right-1 top-1 rounded bg-[#047857]/85 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-pearl">
                                UP
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {liveVideos.length > 0 && (
                    <div className="mt-4">
                      <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate">
                        Videos
                      </p>
                      <div className="flex flex-col gap-2">
                        {liveVideos.map((v) => (
                          <VideoPreview key={v} url={v} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {visible.length === 0 && (
        <p className="py-12 text-center text-slate">No products match your filter.</p>
      )}
    </div>
  );
}

function UploadButton({
  productId,
  uploading,
  onFile,
}: {
  productId: number;
  uploading: boolean;
  onFile: (file: File) => void;
}) {
  const ref = useRef<HTMLInputElement | null>(null);
  return (
    <>
      <button
        onClick={() => ref.current?.click()}
        disabled={uploading}
        className="rounded-full border border-orange-dark/30 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-ink transition-colors hover:border-orange hover:bg-orange hover:text-pearl disabled:opacity-60"
      >
        {uploading ? "Uploading…" : "Upload image"}
      </button>
      <input
        ref={ref}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
          e.target.value = "";
        }}
        data-product-id={productId}
      />
    </>
  );
}

function VideoPreview({ url }: { url: string }) {
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/,
  );
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  const isMp4 = /\.(mp4|webm|mov|m4v)(\?|$)/i.test(url);

  if (ytMatch) {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${ytMatch[1]}`}
        className="aspect-video w-full max-w-md rounded-lg ring-1 ring-orange-dark/15"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }
  if (vimeoMatch) {
    return (
      <iframe
        src={`https://player.vimeo.com/video/${vimeoMatch[1]}`}
        className="aspect-video w-full max-w-md rounded-lg ring-1 ring-orange-dark/15"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
    );
  }
  if (isMp4) {
    return (
      <video
        src={url}
        controls
        className="w-full max-w-md rounded-lg ring-1 ring-orange-dark/15"
      />
    );
  }
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="text-[12px] font-bold text-orange-dark underline underline-offset-2"
    >
      {url}
    </a>
  );
}
