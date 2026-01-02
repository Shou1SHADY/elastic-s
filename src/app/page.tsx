import dynamic from "next/dynamic";
import { Navbar } from "@/components/Navbar";
import { HeroCarousel } from "@/components/HeroCarousel";
import { getServerSideProducts, getServerSideCarousel } from "@/lib/products";

const ProductCatalog = dynamic(() => import("@/components/ProductCatalog").then(mod => mod.ProductCatalog), {
  loading: () => <div className="min-h-screen animate-pulse bg-stone-50" />
});
const Features = dynamic(() => import("@/components/Features").then(mod => mod.Features));
const Footer = dynamic(() => import("@/components/Footer").then(mod => mod.Footer));

export const revalidate = 0;

export default async function Home() {
  const [initialData, initialCarousel] = await Promise.all([
    getServerSideProducts(),
    getServerSideCarousel()
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <HeroCarousel initialSlides={initialCarousel} />
      <ProductCatalog initialData={initialData} />
      <Features />
      <Footer />
    </div>
  );
}
