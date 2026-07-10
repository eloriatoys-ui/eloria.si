// Slovenian labels for the (English) category names stored in the DB.
// The English name stays the canonical key used for filtering and ?category=
// URL params; this map is display-only. Falls back to the English name for any
// category not listed here.
export const CATEGORY_SL: Record<string, string> = {
  Accessories: "Dodatki",
  Bodysuit: "Bodiji",
  Clothes: "Oblačila",
  "Clothing sets AMAREEN": "Kompleti oblačil AMAREEN",
  "Decorative diaper panties": "Okrasne hlačke",
  Dresses: "Obleke",
  "Fashion accessories": "Modni dodatki",
  Flowers: "Rožice",
  Footwear: "Obutev",
  "Hats and scarfs": "Kape in šali",
  "Head bows/clips": "Pentlje in sponke",
  Headpieces: "Naglavni okraski",
  Jackets: "Jakne",
  "Kids toilet": "Otroški WC",
  New: "Novo",
  "On Sale": "V akciji",
  "Pom-poms": "Pom-pomi",
  Pyjamas: "Pižame",
  Sets: "Kompleti",
  Shirts: "Majice",
  Shoes: "Čevlji",
  Slippers: "Copati",
  Socks: "Nogavice",
  Summer: "Poletje",
  Swimsuit: "Kopalke",
  Tights: "Hlačne nogavice",
  Toys: "Igrače",
  Tracksuites: "Trenirke",
  Winter: "Zima",
  "Year-round": "Celoletno",
  "Wooden Toys": "Lesene igrače",
};

/** Slovenian display label for an English category name (falls back to the input). */
export function categoryLabel(nameEn: string | null | undefined): string {
  if (!nameEn) return "";
  return CATEGORY_SL[nameEn] ?? nameEn;
}
