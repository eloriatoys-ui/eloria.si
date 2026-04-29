import { NextResponse } from "next/server";
import { products } from "@/lib/data";

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

function score(name: string, q: string): number {
  const n = name.toLowerCase();
  if (n === q) return 100;
  if (n.startsWith(q)) return 80;
  if (n.includes(` ${q}`)) return 60;
  if (n.includes(q)) return 40;
  return 0;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const raw = (searchParams.get("q") || "").trim().toLowerCase();
  const limit = Math.min(Number(searchParams.get("limit") || 8), 20);

  if (raw.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const tokens = raw.split(/\s+/).filter(Boolean);

  const hits: (SearchHit & { _score: number })[] = [];
  for (const p of products) {
    if (p.stockStatus && p.stockStatus !== "instock") continue;
    const lowName = p.name.toLowerCase();
    const lowCats = (p.categories || []).join(" ").toLowerCase();
    const haystack = `${lowName} ${lowCats}`;
    let total = 0;
    for (const t of tokens) {
      if (!haystack.includes(t)) {
        total = 0;
        break;
      }
      total += score(p.name, t) + (lowCats.includes(t) ? 10 : 0);
    }
    if (total > 0) {
      hits.push({
        id: p.id,
        name: p.name,
        price: p.price,
        comparePrice: p.comparePrice,
        category: p.category,
        image: p.image,
        slug: p.slug,
        permalink: p.permalink,
        _score: total,
      });
    }
  }

  hits.sort((a, b) => b._score - a._score);

  const results: SearchHit[] = hits.slice(0, limit).map(({ _score, ...rest }) => rest);
  return NextResponse.json({ results, total: hits.length });
}
