// English / Slovenian dictionary.
// Add new keys here, then reference them via <T id="..." /> or t("...").

export type Locale = "en" | "sl";

export const LOCALES: Locale[] = ["en", "sl"];
// Site is Slovenian-only — DEFAULT_LOCALE is the only locale that ships.
// We keep the EN dictionary so legacy t("...") calls fall back cleanly if
// a SL translation is ever missing, but no UI lets the user switch to it.
export const DEFAULT_LOCALE: Locale = "sl";

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

    // TrustBadges
    "trust.crafted.title": "Crafted with care",
    "trust.crafted.sub": "Quality you can feel",
    "trust.safe.title": "Child safe",
    "trust.safe.sub": "Non-toxic finishes",
    "trust.delivery.title": "Free delivery",
    "trust.delivery.sub": "On orders over 150 €",
    "trust.families.title": "500+ happy families",
    "trust.families.sub": "Loved across the world",

    // New arrivals
    "new.eyebrow": "Just landed",
    "new.title": "New arrivals",
    "new.subtitle": "Fresh out of the workshop — be the first to play.",
    "new.viewall": "View all new →",

    // Trending
    "trend.eyebrow": "Trending now",
    "trend.title": "What everyone's loving",
    "trend.subtitle": "The picks parents and kids can't get enough of.",
    "trend.viewall": "View all sale →",

    // Videos
    "videos.eyebrow": "See it in action",
    "videos.title": "Products in motion",
    "videos.cta_visit": "Visit the shop →",
    "videos.cta_order": "Order now",
    "videos.card1.title": "Garden Queen Summer set",
    "videos.card1.blurb": "Soft, breezy, made for sunny days outside.",
    "videos.card2.title": "Disco LED light",
    "videos.card2.blurb": "Music, lights, dance — turn any room into a party.",
    "videos.card3.title": "Kids walkie-talkie",
    "videos.card3.blurb": "Adventures on the air — copy that, captain!",

    // Categories
    "cats.eyebrow": "Shop by world",
    "cats.title": "Find their next favourite",
    "cats.shopnow": "Shop now",
    "cats.summer": "Summer Picks",
    "cats.educational": "Educational Toys",
    "cats.outdoor": "Outdoor Play",
    "cats.boys": "Toys for Boys",
    "cats.girls": "Toys for Girls",

    // Shop by age
    "age.eyebrow": "Right toy, right age",
    "age.title": "Shop by age",
    "age.viewall": "View all →",
    "age.0_18m": "0–18 months",
    "age.18_36m": "18–36 months",
    "age.3_5y": "3–5 years",
    "age.6_8y": "6–8 years",
    "age.9_14y": "9–14 years",

    // Clothes banner
    "cb.eyebrow": "Little wardrobe",
    "cb.title": "Dress them for every adventure.",
    "cb.subtitle":
      "Soft, organic, and built to outlast the playground. Comfy basics and seasonal favourites for little explorers.",
    "cb.cta_dresses": "Shop dresses",
    "cb.cta_sets": "Browse sets",
    "cb.perk_organic": "100% organic cotton",
    "cb.perk_returns": "Free returns",
    "cb.perk_sizes": "Sizes 0–14 yrs",

    // Kids clothes (Little Wardrobe section)
    "kids.eyebrow": "Wear it",
    "kids.title": "Little wardrobe",
    "kids.subtitle": "Comfy, colorful clothes for little adventurers",
    "kids.viewall": "See all clothes",

    // Why us
    "why.eyebrow": "Why families love us",
    "why.title": "Quality you can feel",
    "why.subtitle": "Made to last, designed for play, kind to the planet.",
    "why.crafted.title": "Crafted with care",
    "why.crafted.body":
      "Every piece is hand-picked, tested, and packed with the same attention you'd give your own family.",
    "why.safe.title": "Child-safe materials",
    "why.safe.body":
      "Non-toxic, hypoallergenic fabrics and finishes. Tested for the smallest, most curious hands.",
    "why.last.title": "Built to last",
    "why.last.body":
      "Reinforced seams, durable trims, and timeless designs that survive playgrounds and hand-me-downs.",
    "why.delivery.title": "Free delivery",
    "why.delivery.body":
      "On orders over 150 €. Quick, tracked shipping with packaging that's kind to the planet.",

    // Testimonials
    "rev.eyebrow": "What families say",
    "rev.title": "Real reviews, real families",
    "rev.aggregate": "240+ reviews",
    "rev.viewall": "Read all reviews on Google",
    "rev.r1.quote":
      "My daughter loves the Garden Queen set! The fabric is so soft and the stitching feels really sturdy. We've washed it a dozen times and it still looks brand new.",
    "rev.r1.meta": "Ljubljana · 5 reviews",
    "rev.r1.date": "2 weeks ago",
    "rev.r2.quote":
      "Finally a kids brand that cares about what materials they use. My son plays with the multifunctional car every day — quality, packaging, everything is on point.",
    "rev.r2.meta": "Local Guide · Maribor · 23 reviews",
    "rev.r2.date": "1 month ago",
    "rev.r3.quote":
      "The Pop-It game console was a birthday hit! All the kids at the party wanted one. Beautifully boxed and arrived in 2 days. Will definitely order again.",
    "rev.r3.meta": "Kranj · 12 reviews",
    "rev.r3.date": "3 weeks ago",

    // FAQ
    "faq.eyebrow": "Got questions?",
    "faq.title": "Frequently asked",
    "faq.subtitle":
      "Everything you need to know before ordering — shipping, sizes, materials, returns.",
    "faq.help": "Still need help?",
    "faq.email": "Email us",
    "faq.dm": "DM us on Instagram",
    "faq.q1": "How long does delivery take?",
    "faq.a1":
      "Most orders ship within 24 hours. Delivery within Slovenia takes 1–2 business days; the rest of the EU 3–5 business days; worldwide 5–10 business days. You'll get tracking the moment it leaves our warehouse.",
    "faq.q2": "Is delivery really free?",
    "faq.a2":
      "Yes — free standard delivery on every order over 150 €. Below that, it's a small flat rate that's shown at checkout before you pay.",
    "faq.q3": "How do returns work?",
    "faq.a3":
      "You have 30 days to return anything that isn't a perfect fit. Items must be unworn with tags attached. Start a return from your account or email eloriatoys@gmail.com — within Slovenia we provide a prepaid label.",
    "faq.q4": "Are the materials safe for babies and toddlers?",
    "faq.a4":
      "Always. Fabrics are OEKO-TEX certified, dyes are non-toxic and water-based, and every toy is tested for choking-size hazards. Suitable age is printed on each product page.",
    "faq.q5": "How do I know what size to order?",
    "faq.a5":
      "Each product has a detailed size chart with chest, waist, and length in centimetres. If you're between sizes for a fast-growing kid, we recommend going up — that's how parents end up getting two seasons out of a single piece.",
    "faq.q6": "Can I change or cancel my order?",
    "faq.a6":
      "If your order hasn't shipped yet, yes — just reply to your confirmation email or contact us within 2 hours. Once it's on its way, you'll need to use the standard return flow.",
    "faq.q7": "Which payment methods do you accept?",
    "faq.a7":
      "Visa, Mastercard, American Express, Apple Pay, Google Pay, and PayPal. Checkout is fully encrypted; we never store your card details on our servers.",
    "faq.q8": "Do you offer gift wrapping?",
    "faq.a8":
      "Every order is packed in our reusable cream gift box with a hand-tied ribbon. Add a personal note at checkout — totally free.",

    // Newsletter
    "nl.eyebrow": "Insider list",
    "nl.title": "Become an Eloria insider",
    "nl.subtitle":
      "Get 15% off your first order + early access to new arrivals",
    "nl.placeholder": "your@email.com",
    "nl.cta": "Subscribe",
    "nl.cta_done": "Subscribed ✓",
    "nl.privacy": "We respect your privacy. Unsubscribe anytime.",

    // Product card
    "card.sale": "Sale",
    "card.view": "View product",
    "card.see": "See product",
    "card.wish_add": "Add to wishlist",
    "card.wish_remove": "Remove from wishlist",

    // About page
    "about.eyebrow": "Our story",
    "about.title": "We never stopped believing in fairy tales.",
    "about.lead":
      "So in 2020, we started writing our own. Two new parents, a tiny apartment, and the simple question every family eventually asks — where do you find the good stuff?",
    "about.lead2":
      "The toys that don't flash and beep. The dresses that survive a real childhood. The little things you actually want to keep. We couldn't find them, so we built a place for them.",
    "about.cta_shop": "Visit the shop →",
    "about.cta_hello": "Say hello",
    "about.began.eyebrow": "How it began",
    "about.began.title": "Built by parents, for parents.",
    "about.began.p1":
      "When we became parents in 2020, the children's aisle felt overwhelming and underwhelming at the same time — too many flashing toys, too few thoughtful ones.",
    "about.began.p2":
      "We started buying for ourselves the way we wished a shop would buy for us: one piece at a time, tested at home, quietly beautiful, made to last past one birthday.",
    "about.began.p3_pre":
      "Friends asked where we found things. Then friends of friends. Six years later, our little selection lives in more than ",
    "about.began.p3_strong": "6,000 homes",
    "about.began.p3_post":
      " — and we still open every box ourselves before it ships.",
    "about.values.eyebrow": "What we believe",
    "about.values.title": "Four small promises behind every order.",
    "about.values.v1.title": "Hand-picked, never bulk-bought",
    "about.values.v1.body":
      "Every product on our site is chosen one by one. If we wouldn't give it to our own children, it doesn't make the cut.",
    "about.values.v2.title": "Tested before it ships",
    "about.values.v2.body":
      "Toys, dresses, shoes — we open the box, check the stitching, press every button. You get what we already approved at home.",
    "about.values.v3.title": "Less screen, more imagination",
    "about.values.v3.body":
      "We pick toys that pull kids back into the real world: drawing tablets, building sets, role-play — not noisy, flashing distractions.",
    "about.values.v4.title": "One outfit, no scrolling",
    "about.values.v4.body":
      "Our clothing sets are pre-coordinated head-to-toe. One click, one parcel, the look is done — across every season.",
    "about.ages.eyebrow": "Right toy, right age",
    "about.ages.title": "We grow up with your little one.",
    "about.ages.subtitle":
      "From the first soft rattle to the first real backpack, every age has its own little world at Eloria.",
    "about.stats.year": "the year we began",
    "about.stats.homes": "happy homes",
    "about.stats.tested": "personally tested",
    "about.stats.rating": "average rating",
    "about.cta.eyebrow": "Come say hi",
    "about.cta.title": "Find something worth keeping.",
    "about.cta.body":
      "Free delivery on orders over 70 €. We ship within one business day, from our family to yours.",
    "about.cta.shop": "Browse everything →",
    "about.cta.sale": "See sale items",

    // Wooden toys page
    "wt.eyebrow": "The wooden collection",
    "wt.title": "Real wood. Real play. Built to be kept.",
    "wt.subtitle":
      "No plastic, no flashing lights — just warm, hand-finished toys that grow with your little one and pass between siblings. Quietly beautiful, endlessly played with.",
    "wt.cta_browse": "Browse the collection →",
    "wt.cta_custom": "Custom orders",
    "wt.benefits.b1.title": "100% real wood",
    "wt.benefits.b1.body":
      "Beech, maple and walnut from sustainably managed European forests. No MDF, no plastic.",
    "wt.benefits.b2.title": "Non-toxic finishes",
    "wt.benefits.b2.body":
      "Water-based, child-safe paints and natural beeswax oils. Safe from the very first chew.",
    "wt.benefits.b3.title": "Made to outlast",
    "wt.benefits.b3.body":
      "Built to be passed from sibling to sibling — and one day, to the next generation.",
    "wt.coll.eyebrow": "Coming soon · preview",
    "wt.coll.title": "The collection",
    "wt.coll.subtitle":
      "These are the pieces we're hand-finishing right now. Real photos and stock are landing soon — leave us your email and we'll let you know the moment a piece goes live.",
    "wt.coming": "Coming soon",
    "wt.notify": "Notify me",
    "wt.notify_first": "Be the first",
    "wt.notify_title": "Get notified when a piece goes live.",
    "wt.notify_body":
      "Small batches, hand-finished one at a time. Drop your email and we'll let you know the moment your favourite is ready to ship.",
    "wt.cat.stacking": "Stacking",
    "wt.cat.vehicles": "Vehicles",
    "wt.cat.construction": "Construction",
    "wt.cat.music": "Music",
    "wt.cat.puzzles": "Puzzles",
    "wt.cat.pretend": "Pretend play",
    "wt.cat.sensory": "Sensory",
    "wt.cat.first": "First steps",
    "wt.cat.outdoor": "Outdoor",
    "wt.cat.learning": "Learning",
    "wt.p.rainbow": "Rainbow Stacking Tower",
    "wt.p.train": "Heritage Train Set",
    "wt.p.blocks": "Natural Wood Building Blocks",
    "wt.p.xylo": "Tonewood Xylophone",
    "wt.p.puzzle": "Forest Animals Puzzle",
    "wt.p.kitchen": "Little Wooden Kitchen",
    "wt.p.shape": "Shape Sorter Cube",
    "wt.p.pull": "Pull-Along Duckling",
    "wt.p.tea": "Heirloom Tea Set",
    "wt.p.tools": "Carpenter's Tool Bench",
    "wt.p.balance": "Balance Bike — Walnut",
    "wt.p.abacus": "Counting Abacus",
    "wt.age.1_3y": "1–3 yrs",
    "wt.age.3_6y": "3–6 yrs",
    "wt.age.2y": "2+ yrs",
    "wt.age.18mo": "18 mo+",
    "wt.age.2_5y": "2–5 yrs",
    "wt.age.3y": "3+ yrs",
    "wt.age.12_24mo": "12–24 mo",
    "wt.age.12mo": "12+ mo",
    "wt.age.2_4y": "2–4 yrs",
    "wt.age.3_7y": "3–7 yrs",
    "wt.badge.bestseller": "BEST-SELLER",
    "wt.badge.new": "NEW",

    // Shop hero
    "shop.eyebrow": "The full collection",
    "shop.title": "Shop everything",
    "shop.subtitle_pre":
      "Every product, in stock, ready to ship. Filter by category and price, sort the way you like — and use code ",
    "shop.subtitle_post": " for 15% off your first order.",
    "shop.first": "First-order perk",
    "shop.first.title": "15% off your first order",
    "shop.first.body": "Free delivery on orders over 150 €.",
    "shop.copied": "Copied",
    "shop.copy": "Copy code",
    "shop.fineprint": "Valid on first order. Cannot be combined with other offers.",
    "shop.stat_products": "products",
    "shop.stat_sale": "on sale",
    "shop.stat_categories": "categories",

    // Shop browser
    "br.search": "Search",
    "br.search.placeholder": "Search products…",
    "br.cat": "Category",
    "br.age": "Age",
    "br.price": "Price",
    "br.specials": "Specials",
    "br.specials.sale": "On sale only",
    "br.sort.label": "Sort by",
    "br.sort.featured": "Featured",
    "br.sort.priceasc": "Price: low → high",
    "br.sort.pricedesc": "Price: high → low",
    "br.sort.newest": "Newest",
    "br.results": "products",
    "br.clear": "Clear all",
    "br.empty.title": "No products match your filters",
    "br.empty.body": "Try removing a filter or clearing all.",
    "br.filters": "Filters",
    "br.apply": "Apply filters",
    "br.no_age": "products without age info are hidden when an age is selected.",
    "br.add_to_cart": "Add to cart",
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

    // TrustBadges
    "trust.crafted.title": "Ročno izdelano",
    "trust.crafted.sub": "Kakovost, ki jo začutiš",
    "trust.safe.title": "Varno za otroke",
    "trust.safe.sub": "Brez strupenih premazov",
    "trust.delivery.title": "Brezplačna dostava",
    "trust.delivery.sub": "Pri naročilih nad 150 €",
    "trust.families.title": "500+ srečnih družin",
    "trust.families.sub": "Priljubljeno po svetu",

    // New arrivals
    "new.eyebrow": "Sveže prispelo",
    "new.title": "Novosti",
    "new.subtitle": "Naravnost iz delavnice — bodi prvi pri igri.",
    "new.viewall": "Vse novosti →",

    // Trending
    "trend.eyebrow": "Najbolj priljubljeno",
    "trend.title": "Kar imajo vsi radi",
    "trend.subtitle": "Izbori, ki jih starši in otroci preprosto obožujejo.",
    "trend.viewall": "Vse akcije →",

    // Videos
    "videos.eyebrow": "V akciji",
    "videos.title": "Izdelki v gibanju",
    "videos.cta_visit": "Obišči trgovino →",
    "videos.cta_order": "Naroči zdaj",
    "videos.card1.title": "Komplet Garden Queen Summer",
    "videos.card1.blurb": "Mehko, zračno in narejeno za sončne dni zunaj.",
    "videos.card2.title": "Disco LED luč",
    "videos.card2.blurb": "Glasba, luči, ples — vsako sobo spremeni v zabavo.",
    "videos.card3.title": "Otroški walkie-talkie",
    "videos.card3.blurb": "Pustolovščine v eter — sprejeto, kapitan!",

    // Categories
    "cats.eyebrow": "Nakupuj po svetovih",
    "cats.title": "Najdi njihovo naslednjo ljubezen",
    "cats.shopnow": "Nakupuj zdaj",
    "cats.summer": "Poletni izbori",
    "cats.educational": "Učne igrače",
    "cats.outdoor": "Igra na prostem",
    "cats.boys": "Igrače za fantke",
    "cats.girls": "Igrače za punčke",

    // Shop by age
    "age.eyebrow": "Prava igrača za pravo starost",
    "age.title": "Nakupuj po starosti",
    "age.viewall": "Poglej vse →",
    "age.0_18m": "0–18 mesecev",
    "age.18_36m": "18–36 mesecev",
    "age.3_5y": "3–5 let",
    "age.6_8y": "6–8 let",
    "age.9_14y": "9–14 let",

    // Clothes banner
    "cb.eyebrow": "Mala garderoba",
    "cb.title": "Obleci jih za vsako pustolovščino.",
    "cb.subtitle":
      "Mehka, ekološka in narejena, da preživi igrišče. Udobni osnovniki in sezonski favoriti za male raziskovalce.",
    "cb.cta_dresses": "Nakupuj oblekce",
    "cb.cta_sets": "Poglej komplete",
    "cb.perk_organic": "100 % ekološki bombaž",
    "cb.perk_returns": "Brezplačna vračila",
    "cb.perk_sizes": "Velikosti 0–14 let",

    // Kids clothes (Little Wardrobe section)
    "kids.eyebrow": "Obleci",
    "kids.title": "Mala garderoba",
    "kids.subtitle": "Udobna, barvita oblačila za male pustolovce",
    "kids.viewall": "Vsa oblačila",

    // Why us
    "why.eyebrow": "Zakaj nas družine ljubijo",
    "why.title": "Kakovost, ki jo začutiš",
    "why.subtitle":
      "Narejeno za uporabo, oblikovano za igro, prijazno do planeta.",
    "why.crafted.title": "Ročno izdelano",
    "why.crafted.body":
      "Vsak izdelek je izbran ročno, preizkušen in zapakiran s pozornostjo, kakršno bi posvetili lastni družini.",
    "why.safe.title": "Materiali, varni za otroke",
    "why.safe.body":
      "Nestrupene, hipoalergene tkanine in premazi. Preizkušeno za najmanjše, najbolj radovedne ročice.",
    "why.last.title": "Narejeno za dolgoletno uporabo",
    "why.last.body":
      "Ojačani šivi, vzdržljivi obrobki in brezčasen dizajn, ki preživi igrišče in podaljša življenje skozi generacije.",
    "why.delivery.title": "Brezplačna dostava",
    "why.delivery.body":
      "Pri naročilih nad 150 €. Hitra in sledena dostava z embalažo, prijazno planetu.",

    // Testimonials
    "rev.eyebrow": "Kaj pravijo družine",
    "rev.title": "Resnične ocene, resnične družine",
    "rev.aggregate": "240+ ocen",
    "rev.viewall": "Preberi vse ocene na Googlu",
    "rev.r1.quote":
      "Moja hči obožuje komplet Garden Queen! Tkanina je zelo mehka, šivi pa zelo trpežni. Oprali smo ga že desetkrat in še vedno izgleda kot nov.",
    "rev.r1.meta": "Ljubljana · 5 ocen",
    "rev.r1.date": "pred 2 tednoma",
    "rev.r2.quote":
      "Končno otroška znamka, ki jo zanima, kakšne materiale uporablja. Moj sin se vsak dan igra z multifunkcijskim avtom — kakovost in embalaža sta odlični.",
    "rev.r2.meta": "Lokalni vodnik · Maribor · 23 ocen",
    "rev.r2.date": "pred mesecem",
    "rev.r3.quote":
      "Pop-It igralna konzola je bila uspešnica na rojstnem dnevu! Vsi otroci na zabavi so jo želeli imeti. Lepo zapakirano in dostavljeno v 2 dneh. Zagotovo bom naročila znova.",
    "rev.r3.meta": "Kranj · 12 ocen",
    "rev.r3.date": "pred 3 tedni",

    // FAQ
    "faq.eyebrow": "Imaš vprašanja?",
    "faq.title": "Pogosta vprašanja",
    "faq.subtitle":
      "Vse, kar moraš vedeti pred naročilom — dostava, velikosti, materiali, vračila.",
    "faq.help": "Še vedno potrebuješ pomoč?",
    "faq.email": "Pošlji nam e-pošto",
    "faq.dm": "Piši nam na Instagram",
    "faq.q1": "Kako dolgo traja dostava?",
    "faq.a1":
      "Večina naročil odide v 24 urah. Dostava v Sloveniji traja 1–2 delovna dneva, po EU 3–5 delovnih dni, po svetu 5–10 delovnih dni. Sledilno številko prejmeš takoj, ko paket zapusti naše skladišče.",
    "faq.q2": "Je dostava res brezplačna?",
    "faq.a2":
      "Da — brezplačna standardna dostava pri vsakem naročilu nad 150 €. Pod tem zneskom je majhna pavšalna pristojbina, prikazana ob zaključku nakupa pred plačilom.",
    "faq.q3": "Kako delujejo vračila?",
    "faq.a3":
      "Imaš 30 dni za vračilo česar koli, kar ti ne ustreza popolnoma. Izdelki morajo biti nenošeni in z etiketami. Vračilo začni iz svojega računa ali nam piši na eloriatoys@gmail.com — v Sloveniji ti zagotovimo predplačano nalepko.",
    "faq.q4": "So materiali varni za dojenčke in malčke?",
    "faq.a4":
      "Vedno. Tkanine so OEKO-TEX certificirane, barvila so nestrupena in na vodni osnovi, vsaka igrača pa je preizkušena za nevarnosti zadušitve. Primerna starost je natisnjena na vsaki strani izdelka.",
    "faq.q5": "Kako vem, katero velikost naj naročim?",
    "faq.a5":
      "Vsak izdelek ima podrobno tabelo velikosti s prsmi, pasom in dolžino v centimetrih. Če je otrok med velikostmi, priporočamo izbiro višje — tako starši pogosto dobijo dve sezoni iz enega kosa.",
    "faq.q6": "Lahko spremenim ali prekličem naročilo?",
    "faq.a6":
      "Če naročilo še ni odposlano, da — odgovori na potrditveno e-pošto ali nas kontaktiraj v 2 urah. Ko je na poti, moraš uporabiti standardni postopek vračila.",
    "faq.q7": "Katere načine plačila sprejemate?",
    "faq.a7":
      "Visa, Mastercard, American Express, Apple Pay, Google Pay in PayPal. Plačilo je popolnoma šifrirano; podatkov o tvoji kartici ne hranimo na naših strežnikih.",
    "faq.q8": "Ponujate darilno embalažo?",
    "faq.a8":
      "Vsako naročilo zapakiramo v našo večnamensko kremno darilno škatlo z ročno povezanim trakom. Dodaj osebno sporočilo ob zaključku nakupa — popolnoma brezplačno.",

    // Newsletter
    "nl.eyebrow": "Insider klub",
    "nl.title": "Postani Eloria insider",
    "nl.subtitle":
      "Pridobi 15 % popusta pri prvem naročilu in zgodnji dostop do novosti",
    "nl.placeholder": "tvoj@email.com",
    "nl.cta": "Naroči se",
    "nl.cta_done": "Naročen ✓",
    "nl.privacy": "Spoštujemo tvojo zasebnost. Odjavi se kadar koli.",

    // Product card
    "card.sale": "Akcija",
    "card.view": "Poglej izdelek",
    "card.see": "Poglej izdelek",
    "card.wish_add": "Dodaj med priljubljene",
    "card.wish_remove": "Odstrani iz priljubljenih",

    // About page
    "about.eyebrow": "Naša zgodba",
    "about.title": "Nikoli nismo nehali verjeti v pravljice.",
    "about.lead":
      "Tako smo leta 2020 začeli pisati svojo. Dva nova starša, majhno stanovanje in preprosto vprašanje, ki si ga prej ali slej zastavi vsaka družina — kje najdeš dobre stvari?",
    "about.lead2":
      "Igrače, ki ne utripajo in piskajo. Oblekce, ki preživijo pravo otroštvo. Male stvari, ki si jih dejansko želiš obdržati. Nismo jih našli, zato smo jim ustvarili dom.",
    "about.cta_shop": "Obišči trgovino →",
    "about.cta_hello": "Pozdravi nas",
    "about.began.eyebrow": "Kako se je začelo",
    "about.began.title": "Narejeno s strani staršev, za starše.",
    "about.began.p1":
      "Ko smo leta 2020 postali starši, je bila otroška ponudba hkrati preobsežna in pomanjkljiva — preveč utripajočih igrač, premalo premišljenih.",
    "about.began.p2":
      "Začeli smo kupovati zase tako, kot smo si želeli, da bi nekdo kupoval za nas: kos po kos, preizkušeno doma, tiho lepo, narejeno, da preživi en rojstni dan.",
    "about.began.p3_pre":
      "Prijatelji so spraševali, kje najdemo te stvari. Potem prijatelji prijateljev. Šest let kasneje naša mala izbira živi v več kot ",
    "about.began.p3_strong": "6.000 domovih",
    "about.began.p3_post":
      " — in še vedno odpremo vsako škatlo sami, preden jo odpošljemo.",
    "about.values.eyebrow": "V kar verjamemo",
    "about.values.title": "Štiri majhne obljube za vsakim naročilom.",
    "about.values.v1.title": "Ročno izbrano, nikoli kupljeno na debelo",
    "about.values.v1.body":
      "Vsak izdelek na naši strani je izbran posamično. Če ga ne bi dali svojim otrokom, ne pride v ponudbo.",
    "about.values.v2.title": "Preizkušeno pred odpremo",
    "about.values.v2.body":
      "Igrače, oblekce, čevlji — odpremo škatlo, preverimo šive, pritisnemo vsak gumb. Dobiš tisto, kar smo že odobrili doma.",
    "about.values.v3.title": "Manj zaslona, več domišljije",
    "about.values.v3.body":
      "Izbiramo igrače, ki vrnejo otroke v resnični svet: risarske tablice, gradbene komplete, igro vlog — ne hrupne in utripajoče motnje.",
    "about.values.v4.title": "En kos, brez iskanja",
    "about.values.v4.body":
      "Naši kompleti oblačil so usklajeni od glave do peta. En klik, en paket, videz je popoln — v vsaki sezoni.",
    "about.ages.eyebrow": "Prava igrača za pravo starost",
    "about.ages.title": "Z vašim malim odraščamo skupaj.",
    "about.ages.subtitle":
      "Od prve mehke ropotuljice do prvega pravega nahrbtnika — vsaka starost ima svoj mali svet pri Elorii.",
    "about.stats.year": "leto, ko smo začeli",
    "about.stats.homes": "srečnih domov",
    "about.stats.tested": "osebno preizkušeno",
    "about.stats.rating": "povprečna ocena",
    "about.cta.eyebrow": "Pridi nas pozdravit",
    "about.cta.title": "Najdi nekaj, kar je vredno obdržati.",
    "about.cta.body":
      "Brezplačna dostava pri naročilih nad 70 €. Pošljemo v enem delovnem dnevu, iz naše družine v vašo.",
    "about.cta.shop": "Poglej vse →",
    "about.cta.sale": "Poglej akcije",

    // Wooden toys page
    "wt.eyebrow": "Lesena zbirka",
    "wt.title": "Pravi les. Prava igra. Narejeno, da ostane.",
    "wt.subtitle":
      "Brez plastike, brez utripajočih luči — samo topli, ročno dodelani izdelki, ki rastejo z vašim malim in se prenašajo med sorojenci. Tiho lepi, neskončno radi igrani.",
    "wt.cta_browse": "Poglej zbirko →",
    "wt.cta_custom": "Naročilo po meri",
    "wt.benefits.b1.title": "100 % pravi les",
    "wt.benefits.b1.body":
      "Bukev, javor in oreh iz trajnostno upravljanih evropskih gozdov. Brez ivernih plošč in plastike.",
    "wt.benefits.b2.title": "Nestrupeni premazi",
    "wt.benefits.b2.body":
      "Barve na vodni osnovi in naravna olja čebeljega voska, varna od prvega ugriza.",
    "wt.benefits.b3.title": "Narejeno za dolgo",
    "wt.benefits.b3.body":
      "Narejeno, da se prenaša od sorojenca do sorojenca — in nekoč na naslednjo generacijo.",
    "wt.coll.eyebrow": "Kmalu na voljo · predogled",
    "wt.coll.title": "Zbirka",
    "wt.coll.subtitle":
      "To so kosi, ki jih ravnokar ročno dodelamo. Prave fotografije in zaloge bodo na voljo kmalu — pusti nam svoj e-naslov in obvestili te bomo, ko bo posamezen kos na voljo.",
    "wt.coming": "Kmalu",
    "wt.notify": "Obvesti me",
    "wt.notify_first": "Bodi prvi",
    "wt.notify_title": "Bodi obveščen, ko bo kos na voljo.",
    "wt.notify_body":
      "Majhne serije, ročno dodelane ena za drugo. Pusti svoj e-naslov in obvestili te bomo, ko bo tvoj favorit pripravljen za odpremo.",
    "wt.cat.stacking": "Zlaganje",
    "wt.cat.vehicles": "Vozila",
    "wt.cat.construction": "Gradnja",
    "wt.cat.music": "Glasba",
    "wt.cat.puzzles": "Sestavljanke",
    "wt.cat.pretend": "Igra vlog",
    "wt.cat.sensory": "Senzorika",
    "wt.cat.first": "Prvi koraki",
    "wt.cat.outdoor": "Zunaj",
    "wt.cat.learning": "Učenje",
    "wt.p.rainbow": "Mavrični stolp",
    "wt.p.train": "Klasičen vlakec",
    "wt.p.blocks": "Lesene gradbene kocke",
    "wt.p.xylo": "Leseni ksilofon",
    "wt.p.puzzle": "Sestavljanka gozdne živali",
    "wt.p.kitchen": "Mala lesena kuhinja",
    "wt.p.shape": "Kocka za razvrščanje oblik",
    "wt.p.pull": "Račka za vleko",
    "wt.p.tea": "Komplet za čaj",
    "wt.p.tools": "Mizarska delavnica",
    "wt.p.balance": "Poganjalec — oreh",
    "wt.p.abacus": "Računalo",
    "wt.age.1_3y": "1–3 leta",
    "wt.age.3_6y": "3–6 let",
    "wt.age.2y": "2+ let",
    "wt.age.18mo": "18 mes+",
    "wt.age.2_5y": "2–5 let",
    "wt.age.3y": "3+ let",
    "wt.age.12_24mo": "12–24 mes",
    "wt.age.12mo": "12+ mes",
    "wt.age.2_4y": "2–4 leta",
    "wt.age.3_7y": "3–7 let",
    "wt.badge.bestseller": "USPEŠNICA",
    "wt.badge.new": "NOVO",

    // Shop hero
    "shop.eyebrow": "Cela zbirka",
    "shop.title": "Vse v trgovini",
    "shop.subtitle_pre":
      "Vsak izdelek, na zalogi, pripravljen za odpremo. Filtriraj po kategoriji in ceni, razvrsti, kakor želiš — in uporabi kodo ",
    "shop.subtitle_post": " za 15 % popusta pri prvem naročilu.",
    "shop.first": "Bonus za prvo naročilo",
    "shop.first.title": "15 % popusta pri prvem naročilu",
    "shop.first.body": "Brezplačna dostava pri naročilih nad 150 €.",
    "shop.copied": "Kopirano",
    "shop.copy": "Kopiraj kodo",
    "shop.fineprint": "Velja pri prvem naročilu. Ni mogoče kombinirati z drugimi ponudbami.",
    "shop.stat_products": "izdelkov",
    "shop.stat_sale": "v akciji",
    "shop.stat_categories": "kategorij",

    // Shop browser
    "br.search": "Iskanje",
    "br.search.placeholder": "Išči izdelke…",
    "br.cat": "Kategorija",
    "br.age": "Starost",
    "br.price": "Cena",
    "br.specials": "Posebne ponudbe",
    "br.specials.sale": "Samo v akciji",
    "br.sort.label": "Razvrsti po",
    "br.sort.featured": "Priporočeno",
    "br.sort.priceasc": "Cena: nizka → visoka",
    "br.sort.pricedesc": "Cena: visoka → nizka",
    "br.sort.newest": "Najnovejše",
    "br.results": "izdelkov",
    "br.clear": "Počisti vse",
    "br.empty.title": "Noben izdelek ne ustreza filtrom",
    "br.empty.body": "Poskusi odstraniti filter ali počistiti vse.",
    "br.filters": "Filtri",
    "br.apply": "Uporabi filtre",
    "br.no_age":
      "izdelkov brez podatka o starosti je skritih, ko je izbrana starost.",
    "br.add_to_cart": "Dodaj v košarico",
  },
};

export function translate(locale: Locale, key: string): string {
  return dict[locale]?.[key] ?? dict.en[key] ?? key;
}
