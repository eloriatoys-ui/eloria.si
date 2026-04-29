import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import { EMPTY_SECTIONS, type SectionMap } from "./sections";

const PATH = path.join(process.cwd(), "lib", "section-products.json");

export async function readSections(): Promise<SectionMap> {
  try {
    const raw = await fs.readFile(PATH, "utf8");
    const parsed = JSON.parse(raw) as Partial<SectionMap>;
    return {
      newArrivals: Array.isArray(parsed.newArrivals) ? parsed.newArrivals : [],
      trending: Array.isArray(parsed.trending) ? parsed.trending : [],
    };
  } catch {
    return { ...EMPTY_SECTIONS };
  }
}

export async function writeSections(data: SectionMap) {
  await fs.writeFile(PATH, JSON.stringify(data, null, 2) + "\n", "utf8");
}
