export const dynamic = "force-dynamic";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SplashScreen from "@/components/SplashScreen";
import TrustBadges from "@/components/TrustBadges";
import NewArrivals from "@/components/NewArrivals";
import Trending from "@/components/Trending";
// "Izdelki v gibanju" video section removed at the client's request:
// import Videos from "@/components/Videos";
// "Najdi njihovo naslednjo ljubezen" category tiles removed at the client's request:
// import Categories from "@/components/Categories";
import ShopByAge from "@/components/ShopByAge";
// Clothing sections removed — Eloria is wooden-toys-only:
// import ClothesBanner from "@/components/ClothesBanner";
// import KidsClothes from "@/components/KidsClothes";
import WhyUs from "@/components/WhyUs";
import Testimonials from "@/components/Testimonials";
import Faq from "@/components/Faq";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import { getCatalogProducts, getSectionProducts } from "@/lib/catalog";
import { getGoogleReviews, googleWriteReviewUrl } from "@/lib/google-reviews";

export default async function Home() {
  const [products, newArrivalsManual, trendingManual, googleReviews] = await Promise.all([
    getCatalogProducts(),
    getSectionProducts("newArrivals"),
    getSectionProducts("trending"),
    getGoogleReviews(),
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
      <ShopByAge />
      {/* Clothing sections removed — Eloria is now a wooden-toys-only brand */}
      {/* <ClothesBanner /> */}
      {/* <KidsClothes /> */}
      <WhyUs />
      {/* Real Google reviews only — see lib/google-reviews.ts */}
      <Testimonials data={googleReviews} writeUrl={googleWriteReviewUrl()} />
      <Faq />
      <Newsletter />
      <Footer />
    </main>
  );
}
