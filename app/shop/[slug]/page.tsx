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

export async function generateMetadata(
  { params }: { params: { slug: string } },
): Promise<Metadata> {
  const product = await findProductBySlug(params.slug);
  if (!product) return { title: "Not found · Eloria" };
  return {
    title: `${product.name} · Eloria`,
    description:
      (product.shortDescription || "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .slice(0, 160) || `${product.name} from our ${product.category} collection.`,
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

  return (
    <main className="min-h-screen bg-cream">
      <Navbar />

      {/* Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className="border-b border-orange-dark/10 bg-pearl"
      >
        <div className="mx-auto max-w-7xl px-5 py-3 md:px-8">
          <ol className="flex flex-wrap items-center gap-1.5 text-[12px] font-semibold text-slate">
            <li>
              <a href="/" className="hover:text-orange-dark">Home</a>
            </li>
            <li aria-hidden className="text-slate/50">/</li>
            <li>
              <a href="/shop" className="hover:text-orange-dark">Shop</a>
            </li>
            <li aria-hidden className="text-slate/50">/</li>
            <li>
              <a
                href="/shop"
                className="hover:text-orange-dark"
              >
                {product.category}
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
