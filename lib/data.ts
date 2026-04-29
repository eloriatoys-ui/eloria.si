// Edit STORE_NAME / TAGLINE here to rename the brand site-wide.
export const STORE_NAME = "Eloria";
export const TAGLINE = "Where Imagination Grows Naturally";
export const WHATSAPP_NUMBER = "971500000000"; // UAE placeholder

// Catalog is baked from WooCommerce via `npm run migrate`.
// Re-run that script to refresh products.json + categories.json.
import productsJson from "./products.json";
import categoriesJson from "./categories.json";

export type Product = {
  id: number;
  name: string;
  price: number;
  comparePrice: number;
  category: string;
  badge: string;
  emoji: string;
  image?: string; // path under /public — used when present, else falls back to emoji
  // Optional extras populated by the migration script:
  slug?: string;
  categories?: string[];
  stockStatus?: string;
  permalink?: string;
  shortDescription?: string;
  images?: string[]; // full gallery; first entry mirrors `image` unless overridden
  // Age range parsed from shortDescription at load time (months).
  // maxMonths is undefined for open-ended "+X years" descriptions.
  ageMinMonths?: number;
  ageMaxMonths?: number;
  // Slovenian translations baked from amareen.si via the migration script.
  name_sl?: string;
  shortDescription_sl?: string;
  permalink_sl?: string;
};


export const products: Product[] = productsJson as Product[];

export const categories: string[] = categoriesJson as string[];

export const clothes: Product[] = [
  {
    id: 101,
    name: "Organic Cotton Onesie",
    price: 59,
    comparePrice: 89,
    category: "Clothes",
    emoji: "👶",
    badge: "ORGANIC",
  },
  {
    id: 102,
    name: "Woodland Animal T-Shirt",
    price: 49,
    comparePrice: 69,
    category: "Clothes",
    emoji: "🐻",
    badge: "",
  },
  {
    id: 103,
    name: "Denim Dungarees Kids",
    price: 89,
    comparePrice: 139,
    category: "Clothes",
    emoji: "👖",
    badge: "NEW",
  },
  {
    id: 104,
    name: "Cozy Knit Sweater",
    price: 79,
    comparePrice: 119,
    category: "Clothes",
    emoji: "🧶",
    badge: "",
  },
];

// Top Offers — featured 3-card hero deals.
// Replace these with the real items the user provides.
export type TopOffer = {
  id: string;
  brand: string; // small text/wordmark above the title
  title: string;
  subtitle?: string; // small detail line below the title
  emoji: string; // fallback product visual when no image
  image?: string; // path under /public — used when present
  price?: number; // current price in EUR
  comparePrice?: number; // original price (strikethrough)
  discountLabel?: string; // e.g. "-30%" — if set, big splat replaces the price blob
  spinLabel?: boolean; // shows a 360° spin chip
  theme: "sky" | "coral" | "leaf"; // color palette for the card
  ctaLabel: string;
  ctaHref: string;
};

export const topOffers: TopOffer[] = [
  {
    id: "to-1",
    brand: "ELORIA",
    title: "Multifunctional Car",
    subtitle: "Cute pastel cars for the youngest",
    emoji: "🚗",
    image: "/products/multifunctional-car.png",
    price: 39,
    comparePrice: 59,
    theme: "sky",
    ctaLabel: "Shop Now",
    ctaHref: "/shop",
  },
  {
    id: "to-2",
    brand: "ELORIA",
    title: "Kids Karaoke Microphone",
    subtitle: "Sing along, anywhere",
    emoji: "🎤",
    image: "/products/kids-karaoke.png",
    price: 29,
    comparePrice: 45,
    theme: "coral",
    ctaLabel: "Shop Now",
    ctaHref: "/shop",
  },
  {
    id: "to-3",
    brand: "ELORIA",
    title: "Magnetic Board",
    subtitle: "Endless creative patterns",
    emoji: "🧲",
    image: "/products/magnetic-board.png",
    price: 25,
    comparePrice: 39,
    theme: "leaf",
    ctaLabel: "Shop Now",
    ctaHref: "/shop",
  },
  {
    id: "to-4",
    brand: "ELORIA",
    title: "Moccasins Unicorn",
    subtitle: "Soft baby moccasins",
    emoji: "👟",
    image: "/products/moccasins-unicorn.png",
    price: 19,
    comparePrice: 29,
    theme: "sky",
    ctaLabel: "Shop Now",
    ctaHref: "/shop",
  },
  {
    id: "to-5",
    brand: "ELORIA",
    title: "Backpack",
    subtitle: "Lightweight everyday backpack",
    emoji: "🎒",
    image: "/products/backpack-unicorn.png",
    price: 22,
    comparePrice: 35,
    theme: "coral",
    ctaLabel: "Shop Now",
    ctaHref: "/shop",
  },
  {
    id: "to-6",
    brand: "ELORIA",
    title: "Magic 3D Board",
    subtitle: "With magical light effects",
    emoji: "✨",
    price: 35,
    comparePrice: 55,
    theme: "leaf",
    ctaLabel: "Shop Now",
    ctaHref: "/shop",
  },
  {
    id: "to-7",
    brand: "ELORIA",
    title: "Rainbow Stacking Tower",
    subtitle: "Classic motor-skills toy",
    emoji: "🌈",
    price: 89,
    comparePrice: 129,
    theme: "sky",
    ctaLabel: "Shop Now",
    ctaHref: "/shop",
  },
  {
    id: "to-8",
    brand: "ELORIA",
    title: "Wooden Kitchen Playset",
    subtitle: "Hours of pretend play",
    emoji: "🍳",
    price: 99,
    comparePrice: 149,
    theme: "leaf",
    ctaLabel: "Shop Now",
    ctaHref: "/shop",
  },
];

export const trustBadges = [
  { icon: "🌿", title: "100% Natural Wood" },
  { icon: "🛡️", title: "Child Safe & Non-Toxic" },
  { icon: "🚚", title: "Free UAE Delivery" },
  { icon: "⭐", title: "500+ Happy Families" },
];

export const features = [
  {
    icon: "🪵",
    title: "Real Wood, Real Quality",
    body: "Every toy is crafted from sustainably sourced natural wood. No plastic, no compromises.",
  },
  {
    icon: "🎨",
    title: "Non-Toxic & Safe",
    body: "Painted with water-based, child-safe colors. Safe for babies and toddlers.",
  },
  {
    icon: "🧠",
    title: "Educational Play",
    body: "Designed to develop motor skills, creativity, and imagination through play.",
  },
  {
    icon: "💚",
    title: "Eco-Friendly",
    body: "We care about the planet. Biodegradable packaging and sustainable materials.",
  },
];

export const testimonials = [
  {
    quote:
      "My daughter loves the rainbow stacker! The quality is amazing and the colors are so vibrant. Best purchase ever.",
    name: "Sarah M.",
    city: "Dubai",
  },
  {
    quote:
      "Finally found a toy shop that cares about what materials they use. My son plays with these every single day.",
    name: "Ahmed K.",
    city: "Abu Dhabi",
  },
  {
    quote:
      "The wooden kitchen set was a birthday hit! All the kids at the party wanted one. Beautiful craftsmanship.",
    name: "Fatima R.",
    city: "Sharjah",
  },
];
