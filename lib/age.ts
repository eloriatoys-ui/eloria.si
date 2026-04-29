// Age extraction + bucketing.
// Pure types/constants/regex — safe in client and server bundles.

export type AgeBucketId = "0-18m" | "18-36m" | "3-5y" | "6-8y" | "9-14y";

export type AgeBucket = {
  id: AgeBucketId;
  label: string;
  shortLabel: string;
  minMonths: number;
  maxMonths: number;
};

export const AGE_BUCKETS: AgeBucket[] = [
  { id: "0-18m", label: "0–18 months", shortLabel: "0–18 mo", minMonths: 0, maxMonths: 18 },
  { id: "18-36m", label: "18–36 months", shortLabel: "18–36 mo", minMonths: 18, maxMonths: 36 },
  { id: "3-5y", label: "3–5 years", shortLabel: "3–5 yrs", minMonths: 36, maxMonths: 60 },
  { id: "6-8y", label: "6–8 years", shortLabel: "6–8 yrs", minMonths: 72, maxMonths: 96 },
  { id: "9-14y", label: "9–14 years", shortLabel: "9–14 yrs", minMonths: 108, maxMonths: 168 },
];

export type AgeRange = {
  minMonths: number;
  maxMonths?: number; // undefined = open-ended
};

/**
 * Try to extract an age range from a product description.
 * Examples it understands:
 *   "Suitable for children +2 years."           → { minMonths: 24 }
 *   "+18 months."                                → { minMonths: 18 }
 *   "from 3 to 8 years"                          → { minMonths: 36, maxMonths: 96 }
 *   "0-18 months"                                → { minMonths: 0, maxMonths: 18 }
 *   "for newborns" / "for babies"                → { minMonths: 0, maxMonths: 18 }
 *   "for toddlers"                               → { minMonths: 12, maxMonths: 36 }
 * Returns undefined when no signal is found.
 */
export function extractAge(text: string | undefined | null): AgeRange | undefined {
  if (!text) return undefined;
  // Strip HTML tags for cleaner matching.
  const plain = text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
  const lower = plain.toLowerCase();

  // 1) "from X to Y years/months"
  const range = lower.match(
    /from\s+(\d+)\s*(?:to|-|–)\s*(\d+)\s*(year|yr|y|month|mo|m)s?/i,
  );
  if (range) {
    const a = Number(range[1]);
    const b = Number(range[2]);
    const isYears = /^y/.test(range[3]);
    return {
      minMonths: isYears ? a * 12 : a,
      maxMonths: isYears ? b * 12 : b,
    };
  }

  // 2) "X-Y months/years" or "X to Y months/years"
  const dash = lower.match(
    /(\d+)\s*(?:-|–|to)\s*(\d+)\s*(year|yr|y|month|mo|m)s?\b/i,
  );
  if (dash) {
    const a = Number(dash[1]);
    const b = Number(dash[2]);
    const isYears = /^y/.test(dash[3]);
    return {
      minMonths: isYears ? a * 12 : a,
      maxMonths: isYears ? b * 12 : b,
    };
  }

  // 3) "+X years" / "+X months" — open-ended minimum
  const plus = lower.match(/\+\s*(\d+)\s*(year|yr|y|month|mo|m)s?\b/i);
  if (plus) {
    const a = Number(plus[1]);
    const isYears = /^y/.test(plus[2]);
    return { minMonths: isYears ? a * 12 : a };
  }

  // 4) Word fallbacks
  if (/\bnewborn|infant\b/.test(lower)) return { minMonths: 0, maxMonths: 12 };
  if (/\bbab(y|ies)\b/.test(lower)) return { minMonths: 0, maxMonths: 18 };
  if (/\btoddler/.test(lower)) return { minMonths: 12, maxMonths: 36 };
  if (/\bpreschool/.test(lower)) return { minMonths: 36, maxMonths: 60 };

  return undefined;
}

/**
 * Does the product's age range overlap any of the selected buckets?
 * Open-ended max (undefined) means "fits anything >= minMonths".
 */
export function ageMatches(
  range: AgeRange | undefined,
  selectedBucketIds: Iterable<string>,
): boolean {
  const ids = new Set(selectedBucketIds);
  if (ids.size === 0) return true;
  if (!range) return false; // when filter is active and product has no age info, exclude it
  for (const b of AGE_BUCKETS) {
    if (!ids.has(b.id)) continue;
    const productMax =
      typeof range.maxMonths === "number" ? range.maxMonths : Infinity;
    // Overlap test: ranges [pmin, pmax] and [bmin, bmax] overlap iff
    // pmin <= bmax && pmax >= bmin
    if (range.minMonths <= b.maxMonths && productMax >= b.minMonths) {
      return true;
    }
  }
  return false;
}
