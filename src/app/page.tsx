import dynamic from "next/dynamic";
import { Navbar } from "@/components/Navbar";
import { HeroCarousel } from "@/components/HeroCarousel";

const ProductCatalog = dynamic(() => import("@/components/ProductCatalog").then(mod => mod.ProductCatalog), {
  loading: () => <div className="min-h-screen animate-pulse bg-stone-50" />
});
const Features = dynamic(() => import("@/components/Features").then(mod => mod.Features));
const Footer = dynamic(() => import("@/components/Footer").then(mod => mod.Footer));

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
