import { Navbar } from "@/components/Navbar";
import { HeroCarousel } from "@/components/HeroCarousel";
import { ProductCatalog } from "@/components/ProductCatalog";
import { Features } from "@/components/Features";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <HeroCarousel />
      <ProductCatalog />
      <Features />
      <Footer />
    </div>
  );
}
