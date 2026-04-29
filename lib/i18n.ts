// English / Slovenian dictionary.
// Add new keys here, then reference them via <T id="..." /> or t("...").

export type Locale = "en" | "sl";

export const LOCALES: Locale[] = ["en", "sl"];
export const DEFAULT_LOCALE: Locale = "en";

type Dict = Record<string, string>;

export const dict: Record<Locale, Dict> = {
  en: {
    // Navbar
    "nav.home": "Home",
    "nav.shop": "Shop",
    "nav.wooden": "Wooden toys",
    "nav.clothes": "Clothes",
    "nav.about": "About",
    "nav.contact": "Contact",
    "nav.search": "Search",
    "nav.search.placeholder": "Search for toys, clothes, accessories…",
    "nav.cart": "Cart",
    "nav.wishlist": "Wishlist",

    // Mega menu — Shop
    "mega.shop.clothing.heading": "Clothing",
    "mega.shop.clothing.sets": "Clothing sets",
    "mega.shop.clothing.dresses": "Dresses",
    "mega.shop.clothing.bodysuits": "Bodysuits",
    "mega.shop.clothing.jackets": "Jackets",
    "mega.shop.acc.heading": "Accessories",
    "mega.shop.acc.all": "All accessories",
    "mega.shop.acc.headpieces": "Headpieces",
    "mega.shop.acc.bows": "Head bows & clips",
    "mega.shop.acc.hats": "Hats & scarfs",
    "mega.shop.acc.footwear": "Footwear",
    "mega.shop.acc.flowers": "Flowers",
    "mega.shop.highlights.heading": "Highlights",
    "mega.shop.highlights.all": "All products",
    "mega.shop.highlights.new": "New arrivals",
    "mega.shop.highlights.sale": "On sale",
    "mega.shop.help.heading": "Help & info",
    "mega.shop.help.track": "Track order",
    "mega.shop.help.shipping": "Shipping & returns",
    "mega.shop.help.faq": "FAQ",
    "mega.shop.help.contact": "Contact us",
    "nav.tagline": "Magical play, every day",
    "nav.track_order": "Track Order",

    // Promos
    "promo.free_delivery": "✦ Free delivery on orders over 150 €",
    "promo.sustainable": "✦ Sustainably crafted in small batches",
    "promo.discount": "✦ New customers: 15% off with code MAGIC15",

    // Hero
    "hero.badge": "Where Imagination Comes Alive",
    "hero.tagline": "Where Imagination Grows Naturally",
    "hero.subtitle":
      "Magical toys, organic kids' clothes, and timeless play — made for curious little hands.",
    "hero.cta.shop": "Shop the collection",
    "hero.cta.sale": "See sale items",

    // Footer
    "footer.tagline":
      "Magical toys & organic kids' clothes — built to be loved, hand-me-downed, and remembered.",
    "footer.col.shop": "Shop",
    "footer.col.shop.all": "All products",
    "footer.col.shop.sets": "Clothing sets",
    "footer.col.shop.dresses": "Dresses",
    "footer.col.shop.acc": "Accessories",
    "footer.col.shop.new": "New arrivals",
    "footer.col.shop.sale": "On sale",
    "footer.col.care": "Customer care",
    "footer.col.care.track": "Track your order",
    "footer.col.care.shipping": "Shipping & delivery",
    "footer.col.care.returns": "Returns & refunds",
    "footer.col.care.size": "Size guide",
    "footer.col.care.faq": "FAQ",
    "footer.col.care.contact": "Contact us",
    "footer.col.about": "About Eloria",
    "footer.col.about.story": "Our story",
    "footer.col.about.sustain": "Sustainability",
    "footer.col.about.reviews": "Reviews",
    "footer.col.about.press": "Press",
    "footer.col.about.aff": "Affiliates",
    "footer.col.about.wholesale": "Wholesale",
    "footer.col.stay": "Stay in touch",
    "footer.col.stay.body": "Get 15% off + early access to new arrivals.",
    "footer.col.stay.cta": "Subscribe",
    "footer.trust.secure": "Secure checkout",
    "footer.trust.delivery": "Free delivery over 150 €",
    "footer.trust.returns": "30-day returns",
    "footer.copy_rights": "All rights reserved.",
    "footer.legal.privacy": "Privacy policy",
    "footer.legal.terms": "Terms of service",
    "footer.legal.cookies": "Cookie settings",
    "footer.legal.imprint": "Imprint",
    "footer.locale_summary": "EUR · English",

    // Lang switch
    "lang.label": "Language",
  },

  sl: {
    // Navbar
    "nav.home": "Domov",
    "nav.shop": "Trgovina",
    "nav.wooden": "Lesene igrače",
    "nav.clothes": "Oblačila",
    "nav.about": "O nas",
    "nav.contact": "Kontakt",
    "nav.search": "Iskanje",
    "nav.search.placeholder": "Išči igrače, oblačila, dodatke…",
    "nav.cart": "Košarica",
    "nav.wishlist": "Priljubljeni",

    // Mega menu — Shop
    "mega.shop.clothing.heading": "Oblačila",
    "mega.shop.clothing.sets": "Kompleti AMAREEN",
    "mega.shop.clothing.dresses": "Oblekce",
    "mega.shop.clothing.bodysuits": "Bodiji",
    "mega.shop.clothing.jackets": "Jakne",
    "mega.shop.acc.heading": "Dodatki",
    "mega.shop.acc.all": "Vsi dodatki",
    "mega.shop.acc.headpieces": "Pokrivala",
    "mega.shop.acc.bows": "Pentlje in sponke",
    "mega.shop.acc.hats": "Kape in šali",
    "mega.shop.acc.footwear": "Obutev",
    "mega.shop.acc.flowers": "Cvetlice",
    "mega.shop.highlights.heading": "Najboljše",
    "mega.shop.highlights.all": "Vsi izdelki",
    "mega.shop.highlights.new": "Novosti",
    "mega.shop.highlights.sale": "Akcije",
    "mega.shop.help.heading": "Pomoč in informacije",
    "mega.shop.help.track": "Sledi naročilu",
    "mega.shop.help.shipping": "Dostava in vračila",
    "mega.shop.help.faq": "Pogosta vprašanja",
    "mega.shop.help.contact": "Kontaktiraj nas",
    "nav.tagline": "Čarobna igra, vsak dan",
    "nav.track_order": "Sledi naročilu",

    // Promos
    "promo.free_delivery": "✦ Brezplačna dostava nad 150 €",
    "promo.sustainable": "✦ Trajnostno izdelano v majhnih serijah",
    "promo.discount": "✦ Novi kupci: 15 % popusta s kodo MAGIC15",

    // Hero
    "hero.badge": "Kjer domišljija oživi",
    "hero.tagline": "Kjer domišljija raste naravno",
    "hero.subtitle":
      "Čarobne igrače, ekološka otroška oblačila in brezčasna igra — za radovedne male roke.",
    "hero.cta.shop": "Oglej si zbirko",
    "hero.cta.sale": "Akcije",

    // Footer
    "footer.tagline":
      "Čarobne igrače in ekološka otroška oblačila — narejena z ljubeznijo, da jih nosi več generacij.",
    "footer.col.shop": "Trgovina",
    "footer.col.shop.all": "Vsi izdelki",
    "footer.col.shop.sets": "Kompleti oblačil",
    "footer.col.shop.dresses": "Oblekce",
    "footer.col.shop.acc": "Dodatki",
    "footer.col.shop.new": "Novosti",
    "footer.col.shop.sale": "Akcije",
    "footer.col.care": "Pomoč kupcem",
    "footer.col.care.track": "Sledi naročilu",
    "footer.col.care.shipping": "Dostava",
    "footer.col.care.returns": "Vračila in povračila",
    "footer.col.care.size": "Tabela velikosti",
    "footer.col.care.faq": "Pogosta vprašanja",
    "footer.col.care.contact": "Kontaktiraj nas",
    "footer.col.about": "O Eloria",
    "footer.col.about.story": "Naša zgodba",
    "footer.col.about.sustain": "Trajnost",
    "footer.col.about.reviews": "Mnenja",
    "footer.col.about.press": "Mediji",
    "footer.col.about.aff": "Sodelovanje",
    "footer.col.about.wholesale": "Prodaja na debelo",
    "footer.col.stay": "Ostani v stiku",
    "footer.col.stay.body": "Pridobi 15 % popusta in zgodnji dostop do novosti.",
    "footer.col.stay.cta": "Naroči se",
    "footer.trust.secure": "Varno plačilo",
    "footer.trust.delivery": "Brezplačna dostava nad 150 €",
    "footer.trust.returns": "30-dnevna vračila",
    "footer.copy_rights": "Vse pravice pridržane.",
    "footer.legal.privacy": "Politika zasebnosti",
    "footer.legal.terms": "Pogoji poslovanja",
    "footer.legal.cookies": "Nastavitve piškotkov",
    "footer.legal.imprint": "Impresum",
    "footer.locale_summary": "EUR · Slovenščina",

    // Lang switch
    "lang.label": "Jezik",
  },
};

export function translate(locale: Locale, key: string): string {
  return dict[locale]?.[key] ?? dict.en[key] ?? key;
}
