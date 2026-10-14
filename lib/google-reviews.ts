// Live Google reviews for Eloria Toys.
//
// Without an API key (the default) the reviews are read from the public
// Google Maps search data — the same JSON maps.google.com loads — at most
// every 6 hours. This is unofficial: Google can change the format or block
// the request at any time, so every step is defensive and any failure falls
// back to MANUAL_REVIEWS. If GOOGLE_PLACES_API_KEY is set, the official
// Places API is used instead.

export type GoogleReview = {
  author: string;
  authorUrl?: string;
  photo?: string;
  rating: number;
  text: string;
  when: string;
};

export type GoogleReviews = {
  rating: number;
  count: number;
  mapsUrl: string;
  writeUrl: string;
  reviews: GoogleReview[];
};

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
// Eloria Toys, Cerklje na Gorenjskem.
const PLACE_ID = process.env.GOOGLE_PLACE_ID ?? "ChIJCxqEKKSQgYURmC0DTb335gk";
const MAPS_QUERY = "Eloria Toys Cerklje na Gorenjskem";
// Eloria's Google Business profile, as shared by the client.
const PROFILE_URL = "https://share.google/pIlbMkOitKkiyBDTt";
const WRITE_URL = "https://g.page/r/CZgtA0299-YJEAI/review";

const REFRESH = 6 * 3600;

/** Link for the "write a review" button. */
export function googleWriteReviewUrl(): string {
  return WRITE_URL;
}

// Last-resort fallback, copied by hand from the Google profile.
const MANUAL_REVIEWS: GoogleReviews = {
  rating: 0,
  count: 0, // aggregate badge hidden without live data
  mapsUrl: PROFILE_URL,
  writeUrl: WRITE_URL,
  reviews: [
    {
      author: "Anica Tomažič",
      authorUrl: "https://www.google.com/maps/contrib/105162445491204869898",
      photo:
        "https://lh3.googleusercontent.com/a/ACg8ocLLRvArRKKi-8wENvQCcPAwZespGNodLyTDVPwLQ8zw9amKqA=s120-c-rp-mo-br100",
      rating: 5,
      text: "Super. Prijazni, hitri, kvalitetni",
      when: "Ocena na Googlu",
    },
  ],
};

function onlyGood(reviews: GoogleReview[]) {
  return reviews.filter((r) => r.author && r.text && r.rating >= 4);
}

export async function getGoogleReviews(): Promise<GoogleReviews> {
  try {
    const live = API_KEY ? await fromPlacesApi() : await fromMaps();
    return live && live.reviews.length ? live : MANUAL_REVIEWS;
  } catch (err) {
    console.error("[google-reviews] fetch failed", err);
    return MANUAL_REVIEWS;
  }
}

// ─── Official Places API (only when a key is configured) ────────────────────

async function fromPlacesApi(): Promise<GoogleReviews | null> {
  const res = await fetch(
    `https://places.googleapis.com/v1/places/${encodeURIComponent(PLACE_ID)}?languageCode=sl`,
    {
      headers: {
        "X-Goog-Api-Key": API_KEY!,
        "X-Goog-FieldMask": "rating,userRatingCount,googleMapsUri,reviews",
      },
      next: { revalidate: REFRESH },
    },
  );
  if (!res.ok) {
    console.error(`[google-reviews] Places API ${res.status}`);
    return null;
  }
  const data = await res.json();
  return {
    rating: Number(data.rating) || 0,
    count: Number(data.userRatingCount) || 0,
    mapsUrl: data.googleMapsUri ?? PROFILE_URL,
    writeUrl: WRITE_URL,
    reviews: onlyGood(
      (data.reviews ?? []).map((r: any) => ({
        author: r.authorAttribution?.displayName ?? "",
        authorUrl: r.authorAttribution?.uri,
        photo: r.authorAttribution?.photoUri,
        rating: Number(r.rating) || 0,
        text: r.text?.text ?? r.originalText?.text ?? "",
        when: r.relativePublishTimeDescription ?? "",
      })),
    ),
  };
}

// ─── Public Google Maps data (no key) ───────────────────────────────────────

const MAPS_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36",
  "Accept-Language": "sl,en;q=0.8",
  // Skip the EU cookie-consent interstitial.
  Cookie: "CONSENT=YES+cb; SOCS=CAESEwgDEgk0ODE3Nzk3MjQaAmVuIAEaBgiA_LyaBg",
};

const str = (v: unknown): v is string => typeof v === "string" && v.length > 0;
const at = (n: any, ...path: number[]) =>
  path.reduce((x, i) => (Array.isArray(x) ? x[i] : undefined), n);

function titleCase(name: string) {
  return name.replace(/(^|[\s-])(\p{L})/gu, (_, sep, ch) => sep + ch.toUpperCase());
}

/** A review node: [meta, …] with author at [1][4][5][0] and text at [2][15][0][0]. */
function toReview(node: any): GoogleReview | null {
  const author = at(node, 1, 4, 5, 0);
  const text = at(node, 2, 15, 0, 0);
  const rating = at(node, 2, 0, 0);
  if (!str(author) || !str(text) || typeof rating !== "number") return null;
  const contrib = at(node, 1, 4, 5, 2, 0);
  const photo = at(node, 1, 4, 5, 1);
  const when = at(node, 1, 6);
  return {
    author: titleCase(author),
    authorUrl: str(contrib) ? contrib.replace(/\?.*$/, "") : undefined,
    photo: str(photo) ? photo : undefined,
    rating,
    text,
    when: str(when) ? when : "",
  };
}

// Search the whole tree for review-shaped nodes, so a moved container
// doesn't break us — only the shape of a single review matters.
function findReviews(n: any, out: GoogleReview[] = [], depth = 0): GoogleReview[] {
  if (!Array.isArray(n) || depth > 40) return out;
  const r = toReview(n);
  if (r) {
    out.push(r);
    return out;
  }
  for (const c of n) findReviews(c, out, depth + 1);
  return out;
}

async function fromMaps(): Promise<GoogleReviews | null> {
  // 1) The Maps search page embeds the URL of its data request (with the
  //    opaque `pb` parameter). Read it from there instead of hard-coding it.
  const page = await fetch(
    `https://www.google.com/maps/search/${encodeURIComponent(MAPS_QUERY).replace(/%20/g, "+")}?hl=sl&gl=si`,
    { headers: MAPS_HEADERS, next: { revalidate: REFRESH } },
  );
  if (!page.ok) {
    console.error(`[google-reviews] maps page ${page.status}`);
    return null;
  }
  const html = await page.text();
  const m = html.match(/href="(\/search\?tbm=map[^"]+)"/);
  if (!m) {
    console.error("[google-reviews] maps data URL not found");
    return null;
  }
  const dataUrl = "https://www.google.com" + m[1].replace(/&amp;/g, "&");

  // 2) Fetch the data — JSON behind an anti-XSSI prefix.
  const res = await fetch(dataUrl, { headers: MAPS_HEADERS, next: { revalidate: REFRESH } });
  if (!res.ok) {
    console.error(`[google-reviews] maps data ${res.status}`);
    return null;
  }
  const raw = await res.text();
  // Make sure this is Eloria's place before trusting anything in it.
  if (!raw.includes(PLACE_ID)) {
    console.error("[google-reviews] place not found in maps data");
    return null;
  }
  const data = JSON.parse(raw.slice(raw.indexOf("\n") + 1));
  const place = at(data, 0, 1, 0, 14);
  const rating = at(place, 4, 7);
  const count = at(place, 4, 8);

  return {
    rating: typeof rating === "number" ? rating : 0,
    count: typeof count === "number" ? count : 0,
    mapsUrl: PROFILE_URL,
    writeUrl: WRITE_URL,
    reviews: onlyGood(findReviews(place ?? data)),
  };
}
