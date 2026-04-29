// Pure types + constants — safe to import from client components.

export type SectionKey = "newArrivals" | "trending";

export const SECTION_LABELS: Record<SectionKey, string> = {
  newArrivals: "New Arrivals",
  trending: "Trending",
};

export const SECTION_KEYS: SectionKey[] = ["newArrivals", "trending"];

export type SectionMap = Record<SectionKey, number[]>;

export const EMPTY_SECTIONS: SectionMap = {
  newArrivals: [],
  trending: [],
};
