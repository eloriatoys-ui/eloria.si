import fs from "node:fs/promises";
import path from "node:path";
import { products as staticProducts, type Product } from "@/lib/data";
import { readSections } from "@/lib/sections-server";
import AdminImagePicker from "./AdminImagePicker";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin · Main Images" };

const OVERRIDES_PATH = path.join(process.cwd(), "lib", "main-images.json");

async function loadOverrides(): Promise<Record<string, string>> {
  try {
    const raw = await fs.readFile(OVERRIDES_PATH, "utf8");
    return JSON.parse(raw) as Record<string, string>;
  } catch {
    return {};
  }
}

export default async function AdminPage() {
  const overrides = await loadOverrides();
  const sections = await readSections();
  const products = staticProducts as (Product & { images?: string[] })[];

  const sorted = [...products].sort((a, b) => a.name.localeCompare(b.name));
  const overrideCount = Object.keys(overrides).length;
  const withGallery = products.filter((p) => (p.images?.length ?? 0) > 1).length;

  return (
    <main className="min-h-screen bg-cream">
      <div className="border-b border-orange-dark/15 bg-pearl">
        <div className="mx-auto max-w-7xl px-5 py-6 md:px-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-orange-dark">
            Admin · main image picker
          </p>
          <h1 className="font-display mt-2 text-3xl tracking-tight text-ink md:text-4xl">
            Choose the main image for each product
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate">
            Click any thumbnail below to set it as that product&rsquo;s main image
            (used on the home page and shop page). The default is the first image
            from WooCommerce.
          </p>
          <div className="mt-3 flex flex-wrap gap-4 text-[12px] font-semibold text-slate">
            <span>
              <span className="text-ink">{products.length}</span> products
            </span>
            <span>
              <span className="text-ink">{withGallery}</span> with multiple images
            </span>
            <span>
              <span className="text-ink">{overrideCount}</span> custom selections
            </span>
          </div>
          {withGallery === 0 && (
            <p className="mt-4 rounded-md border border-orange-dark/20 bg-orange/10 px-4 py-3 text-[13px] text-ink">
              <strong>Heads up:</strong> none of your products have a gallery yet —
              only the first image was downloaded. Run{" "}
              <code className="rounded bg-pearl px-1.5 py-0.5 font-mono text-[12px]">
                npm run migrate
              </code>{" "}
              to pull every image from WooCommerce, then come back here to pick.
            </p>
          )}
        </div>
      </div>

      <AdminImagePicker
        products={sorted}
        initialOverrides={overrides}
        initialSections={sections}
      />
    </main>
  );
}
