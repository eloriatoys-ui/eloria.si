import type { Product } from "./data";
import type { Locale } from "./i18n";

/**
 * Pick the localized product name. Falls back to the English name when no
 * Slovenian translation is baked into the product (e.g. when the SL feed
 * couldn't match the product by id or slug).
 */
export function productName(product: Product, locale: Locale): string {
  if (locale === "sl" && product.name_sl) return product.name_sl;
  return product.name;
}

export function productShortDescription(
  product: Product,
  locale: Locale,
): string | undefined {
  if (locale === "sl" && product.shortDescription_sl)
    return product.shortDescription_sl;
  return product.shortDescription;
}
