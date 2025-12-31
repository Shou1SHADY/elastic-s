import dynamic from "next/dynamic";
import { Navbar } from "@/components/Navbar";
import { HeroCarousel } from "@/components/HeroCarousel";
import { getServerSideProducts } from "@/lib/products";

const ProductCatalog = dynamic(() => import("@/components/ProductCatalog").then(mod => mod.ProductCatalog), {
  loading: () => <div className="min-h-screen animate-pulse bg-stone-50" />
});
const Features = dynamic(() => import("@/components/Features").then(mod => mod.Features));
const Footer = dynamic(() => import("@/components/Footer").then(mod => mod.Footer));

export default async function Home() {
  const initialData = await getServerSideProducts();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <HeroCarousel />
      <ProductCatalog initialData={initialData} />
      <Features />
      <Footer />
    </div>
  );
}
