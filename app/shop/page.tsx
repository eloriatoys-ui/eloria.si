import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ShopBrowser from "@/components/shop/ShopBrowser";
import ShopHero from "@/components/shop/ShopHero";
import { getCatalogProducts } from "@/lib/catalog";

export const metadata = {
  title: "Shop · Eloria",
  description: "The full Eloria collection — every toy, dress, and accessory in one place.",
};

export default async function ShopPage() {
  const products = await getCatalogProducts();

  const catSet = new Set<string>();
  for (const p of products) if (p.category) catSet.add(p.category);
  const categories = [...catSet].sort();

  const onSaleCount = products.filter((p) => p.comparePrice > p.price).length;

  return (
    <main className="min-h-screen bg-cream">
      <Navbar />

      <ShopHero
        productCount={products.length}
        onSaleCount={onSaleCount}
        categoryCount={categories.length}
      />

      <Suspense fallback={null}>
        <ShopBrowser products={products} categories={categories} />
      </Suspense>

      <Footer />
    </main>
  );
}
