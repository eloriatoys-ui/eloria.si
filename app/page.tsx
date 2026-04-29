import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustBadges from "@/components/TrustBadges";
import NewArrivals from "@/components/NewArrivals";
import Trending from "@/components/Trending";
import Videos from "@/components/Videos";
import Categories from "@/components/Categories";
import ShopByAge from "@/components/ShopByAge";
import ClothesBanner from "@/components/ClothesBanner";
import KidsClothes from "@/components/KidsClothes";
import WhyUs from "@/components/WhyUs";
import Testimonials from "@/components/Testimonials";
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
      <Navbar />
      <Hero />
      <TrustBadges />
      <NewArrivals products={products} manual={newArrivalsManual} />
      <Trending products={products} manual={trendingManual} />
      <Videos />
      <Categories />
      <ShopByAge />
      <ClothesBanner />
      <KidsClothes />
      <WhyUs />
      <Testimonials />
      <Faq />
      <Newsletter />
      <Footer />
    </main>
  );
}
