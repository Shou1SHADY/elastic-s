"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, ArrowRight, Loader2 } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";

interface Product {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  image: string;
}

interface Category {
  id: string;
  label: string;
}

const fallbackImage = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop";

export function ProductCatalog() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const { t, isRtl } = useLanguage();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data.products || []);
        setCategories([{ id: "all", label: t("allProducts") }, ...(data.categories || [])]);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [t]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") return products;
    return products.filter((p) => p.category === activeCategory);
  }, [activeCategory, products]);

  const handleImageError = (productId: string) => {
    setImageErrors((prev) => new Set(prev).add(productId));
  };

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
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          </div>
        ) : (
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
                      src={imageErrors.has(product.id) ? fallbackImage : product.image}
                      alt={product.name}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={() => handleImageError(product.id)}
                    />
                    <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/5 transition-colors" />
                    <div className={cn(
                      "absolute top-3",
                      isRtl ? "right-3" : "left-3"
                    )}>
                      <span className="bg-white/90 backdrop-blur text-slate-900 text-xs font-semibold px-2.5 py-1 rounded-md border border-stone-100 shadow-sm">
                        {product.categoryLabel}
                      </span>
                    </div>
                  </div>
                  <div className={cn("mt-4 px-1", isRtl && "text-right")}>
                    <h3 className="text-lg font-semibold text-slate-900 tracking-tight group-hover:text-orange-600 transition-colors">
                      {product.name}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

      {/* "More" Indicator */}
      <div className="mt-16 text-center">
        <button className="inline-flex items-center gap-2 text-slate-900 font-semibold border-b border-slate-900 pb-1 hover:text-orange-600 hover:border-orange-600 transition-all">
          {t("viewAllCategories")} <ArrowRight className={cn("w-4 h-4", isRtl && "rotate-180")} />
        </button>
      </div>
    </main>
  );
}
