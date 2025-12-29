"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, ArrowRight } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";

interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
  description: string;
}

const BUCKET_URL = "https://logewufqgmgxufkovpuw.supabase.co/storage/v1/object/public/corporate";

// Fallback images from Unsplash
const fallbacks: Record<string, string> = {
  army: "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?q=80&w=800&auto=format&fit=crop",
  police: "https://images.unsplash.com/photo-1590523278191-995cbcda646b?q=80&w=800&auto=format&fit=crop",
  "bar-mat": "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800&auto=format&fit=crop",
  coasters: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?q=80&w=800&auto=format&fit=crop",
  "flash-memory": "https://images.unsplash.com/photo-1586953208448-b95a79798f07?q=80&w=800&auto=format&fit=crop",
  label: "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop",
  "mobile-holder": "https://images.unsplash.com/photo-1586105251261-72a756497a11?q=80&w=800&auto=format&fit=crop",
  "pen-accessories": "https://images.unsplash.com/photo-1585336261022-69c6e296687c?q=80&w=800&auto=format&fit=crop",
};

export function ProductCatalog() {
  const [activeCategory, setActiveCategory] = useState("all");
  const { t, isRtl } = useLanguage();

  const categories = useMemo(() => [
    { id: "all", label: t("allProducts") },
    { id: "army", label: t("armyTactical") },
    { id: "police", label: "Police" },
    { id: "bar-mat", label: "Bar Mats" },
    { id: "coasters", label: "Coasters" },
    { id: "flash-memory", label: t("techAccessories") },
    { id: "fridge-magnet", label: "Fridge Magnets" },
    { id: "label", label: t("labelsPatches") },
    { id: "lighter", label: "Lighter Covers" },
    { id: "mobile-holder", label: "Mobile Holders" },
    { id: "pen-accessories", label: "Pen Accessories" },
  ], [t]);

  const sampleProducts: Product[] = useMemo(() => [
    {
      id: "1",
      name: t("tacticalTitle"),
      category: "army",
      image: `${BUCKET_URL}/army/patch-1.jpg`,
      description: t("tacticalDesc"),
    },
    {
      id: "2",
      name: "Uniform Insignias",
      category: "police",
      image: `${BUCKET_URL}/police/badge-1.jpg`,
      description: "Regulation standard PVC badges",
    },
    {
      id: "3",
      name: "Non-Slip Bar Mats",
      category: "bar-mat",
      image: `${BUCKET_URL}/bar-mat/mat-1.jpg`,
      description: "Heavy duty, spill resistant",
    },
    {
      id: "4",
      name: "Custom PVC Coasters",
      category: "coasters",
      image: `${BUCKET_URL}/coasters/coaster-1.jpg`,
      description: "High-detail mold reproduction",
    },
    {
      id: "5",
      name: "Custom USB Housing",
      category: "flash-memory",
      image: `${BUCKET_URL}/flash-memory/usb-1.jpg`,
      description: "Shock-resistant silicone casing",
    },
    {
      id: "6",
      name: "Garment Branding Labels",
      category: "label",
      image: `${BUCKET_URL}/label/label-1.jpg`,
      description: "Soft-touch, sew-on rubber tags",
    },
    {
      id: "7",
      name: "Anti-Vibration Grips",
      category: "mobile-holder",
      image: `${BUCKET_URL}/mobile-holder/holder-1.jpg`,
      description: "Industrial grade silicone inserts",
    },
    {
      id: "8",
      name: "Precision Pen Grips",
      category: "pen-accessories",
      image: `${BUCKET_URL}/pen-accessories/grip-1.jpg`,
      description: "Ergonomic molded accessories",
    },
  ], [t]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") return sampleProducts;
    return sampleProducts.filter((p) => p.category === activeCategory);
  }, [activeCategory, sampleProducts]);

  return (
    <main className="max-w-7xl mx-auto px-6 py-16 overflow-x-hidden" id="products">
      {/* Section Header */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className={cn(isRtl && "text-right")}>
          <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight mb-3">
            {t("productCatalog")}
          </h2>
          <p className="text-lg text-slate-500 max-w-xl">
            {t("catalogDescription")}
          </p>
        </div>
        <div className="hidden md:block">
          <button className="text-slate-500 hover:text-slate-900 font-medium flex items-center gap-2 text-sm">
            {t("downloadCatalog")} <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sticky Filter Bar */}
      <div className="sticky top-16 md:top-20 z-30 py-4 bg-stone-50/95 backdrop-blur border-b border-stone-200 mb-10 w-full">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 mask-fade-edges">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all",
                activeCategory === cat.id
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-white border border-stone-200 text-slate-600 hover:border-slate-400 hover:text-slate-900"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10"
      >
        <AnimatePresence mode="popLayout">
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="group cursor-pointer"
            >
              <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 aspect-[4/3] border border-stone-100">
                <Image
                  src={fallbacks[product.category] || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop"}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/5 transition-colors" />
                <div className={cn(
                  "absolute top-3",
                  isRtl ? "right-3" : "left-3"
                )}>
                  <span className="bg-white/90 backdrop-blur text-slate-900 text-xs font-semibold px-2.5 py-1 rounded-md border border-stone-100 shadow-sm capitalize">
                    {product.category.replace("-", " ")}
                  </span>
                </div>
              </div>
              <div className={cn("mt-4 px-1", isRtl && "text-right")}>
                <h3 className="text-lg font-semibold text-slate-900 tracking-tight group-hover:text-orange-600 transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-slate-500 mt-1">{product.description}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* "More" Indicator */}
      <div className="mt-16 text-center">
        <button className="inline-flex items-center gap-2 text-slate-900 font-semibold border-b border-slate-900 pb-1 hover:text-orange-600 hover:border-orange-600 transition-all">
          {t("viewAllCategories")} <ArrowRight className={cn("w-4 h-4", isRtl && "rotate-180")} />
        </button>
      </div>
    </main>
  );
}
