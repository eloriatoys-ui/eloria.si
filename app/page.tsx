export const dynamic = "force-dynamic";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SplashScreen from "@/components/SplashScreen";
import TrustBadges from "@/components/TrustBadges";
import NewArrivals from "@/components/NewArrivals";
import Trending from "@/components/Trending";
import Videos from "@/components/Videos";
import Categories from "@/components/Categories";
import ShopByAge from "@/components/ShopByAge";
// Clothing sections removed — Eloria is wooden-toys-only:
// import ClothesBanner from "@/components/ClothesBanner";
// import KidsClothes from "@/components/KidsClothes";
import WhyUs from "@/components/WhyUs";
// Testimonials hidden until real client reviews are supplied:
// import Testimonials from "@/components/Testimonials";
import Faq from "@/components/Faq";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import { getCatalogProducts, getSectionProducts } from "@/lib/catalog";

export default async function Home() {
  const [products, newArrivalsManual, trendingManual] = await Promise.all([
    getCatalogProducts(),
    getSectionProducts("newArrivals"),
    getSectionProducts("trending"),
  ]);

  return (
    <main className="min-h-screen bg-cream">
      {/* Preload critical hero assets so the browser starts fetching
          them before React hydrates the section. */}
      <link rel="preload" as="image" href="/hero-bg.webp" fetchPriority="high" />
      <link rel="preload" as="image" href="/brand/eloria.webp" fetchPriority="high" />
      <link rel="preload" as="video" href="/videos/girl-jump.webm" type="video/webm" />

      <SplashScreen />
      <Navbar />
      <Hero />
      <TrustBadges />
      <NewArrivals products={products} manual={newArrivalsManual} />
      <Trending products={products} manual={trendingManual} />
      <Videos />
      <Categories />
      <ShopByAge />
      {/* Clothing sections removed — Eloria is now a wooden-toys-only brand */}
      {/* <ClothesBanner /> */}
      {/* <KidsClothes /> */}
      <WhyUs />
      {/* Testimonials hidden until the client supplies their real review(s) —
          the previous placeholder reviews were removed as requested */}
      {/* <Testimonials /> */}
      <Faq />
      <Newsletter />
      <Footer />
    </main>
  );
}
