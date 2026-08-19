// Cache each product page and regenerate it at most every 5 minutes (ISR)
// instead of re-querying the database on every request. Ad traffic lands here,
// so a fast, CDN-cached response matters far more than second-by-second
// freshness; price/stock edits still propagate within the window.
export const revalidate = 300;

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import RelatedProducts from "@/components/product/RelatedProducts";
import {
  findProductBySlug,
  getRelatedProducts,
} from "@/lib/catalog";
import { categoryLabel } from "@/lib/category-i18n";
import JsonLd from "@/components/JsonLd";
import { SITE, absoluteUrl, productSchema, breadcrumbSchema } from "@/lib/seo";

export async function generateMetadata(
  { params }: { params: { slug: string } },
): Promise<Metadata> {
  const product = await findProductBySlug(params.slug);
  if (!product) return { title: "Ni najdeno" };
  const description =
    (product.shortDescription_sl || product.shortDescription || "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .slice(0, 160) || `${product.name} iz naše kolekcije ${product.category}.`;
  const url = `/trgovina/${product.slug}`;
  const image =
    absoluteUrl(product.image ?? product.images?.[0]) ??
    absoluteUrl(SITE.ogImage);
  return {
    title: product.name,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      title: `${product.name} · Eloria`,
      description,
      url,
      siteName: SITE.name,
      locale: "sl_SI",
      images: image ? [{ url: image, alt: product.name }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} · Eloria`,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await findProductBySlug(params.slug);
  if (!product) return notFound();

  const related = await getRelatedProducts(product, 8);
  const onSale = product.comparePrice > product.price;
  const localImages = product.images && product.images.length > 0
    ? product.images
    : product.image
    ? [product.image]
    : [];

  const pageUrl = `${SITE.url}/trgovina/${product.slug}`;

  return (
    <main className="min-h-screen bg-cream">
      {/* Structured data: product (price, availability) + breadcrumb trail */}
      <JsonLd data={productSchema(product, pageUrl)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Domov", url: `${SITE.url}/` },
          { name: "Trgovina", url: `${SITE.url}/trgovina` },
          { name: product.name, url: pageUrl },
        ])}
      />
      <Navbar />

      {/* Breadcrumbs */}
      <nav
        aria-label="Drobtinice"
        className="border-b border-orange-dark/10 bg-pearl"
      >
        <div className="mx-auto max-w-7xl px-5 py-3 md:px-8">
          <ol className="flex flex-wrap items-center gap-1.5 text-[12px] font-semibold text-slate">
            <li>
              <a href="/" className="hover:text-orange-dark">Domov</a>
            </li>
            <li aria-hidden className="text-slate/50">/</li>
            <li>
              <a href="/trgovina" className="hover:text-orange-dark">Trgovina</a>
            </li>
            <li aria-hidden className="text-slate/50">/</li>
            <li>
              <a
                href="/trgovina"
                className="hover:text-orange-dark"
              >
                {categoryLabel(product.category)}
              </a>
            </li>
            <li aria-hidden className="text-slate/50">/</li>
            <li className="truncate text-ink">
              {product.name}
            </li>
          </ol>
        </div>
      </nav>

      {/* Main product layout */}
      <section className="bg-cream py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="grid gap-8 md:grid-cols-2 md:gap-12 lg:gap-16">
            <ProductGallery
              productId={product.id}
              productName={product.name}
              emoji={product.emoji}
              initialImages={localImages}
              badge={product.badge || undefined}
              saleLabel={
                onSale && !product.badge
                  ? `-${Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%`
                  : undefined
              }
            />
            <ProductInfo product={product} />
          </div>
        </div>
      </section>

      <RelatedProducts products={related} />

      <Footer />
    </main>
  );
}
