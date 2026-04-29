import ProductCard from "./ProductCard";
import Reveal from "./Reveal";
import { getCatalogProducts } from "@/lib/catalog";

const CLOTHING_CATEGORY = /dress|pyjam|bodysuit|tracksuit|clothing set|jacket|shirt|tights|^sets$/i;

export default async function KidsClothes() {
  const all = await getCatalogProducts();
  const clothes = all
    .filter((p) => CLOTHING_CATEGORY.test(p.category || ""))
    .slice(0, 8);

  return (
    <section id="clothes" className="relative bg-sand py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <div className="text-center">
            <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-orange-dark">
              <span className="h-1 w-6 rounded-full bg-orange" />
              Wear it
              <span className="h-1 w-6 rounded-full bg-orange" />
            </p>
            <h2 className="font-display mt-3 text-3xl tracking-tight text-ink sm:text-4xl md:text-5xl">
              Little Wardrobe
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-base text-slate md:text-lg">
              Comfy, colorful clothes for little adventurers
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 md:mt-14 md:grid-cols-4 md:gap-x-6">
          {clothes.map((p, i) => (
            <Reveal key={p.id} delay={i * 90}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>

        {clothes.length > 0 && (
          <div className="mt-10 flex justify-center">
            <a
              href="/shop?category=Clothing+sets+AMAREEN,Dresses,Bodysuit,Jackets,Clothes"
              className="inline-flex items-center gap-2 rounded-full border border-orange-dark/25 px-6 py-3 text-sm font-bold text-ink transition-colors hover:border-orange hover:bg-orange hover:text-pearl"
            >
              See all clothes
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
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
