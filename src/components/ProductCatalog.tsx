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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const { t, isRtl } = useLanguage();

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory]);

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
    <main className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20 overflow-x-hidden" id="products">
      {/* Section Header */}
      <div className="mb-10 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className={cn(isRtl && "text-right")}>
          <h2 className="text-2xl md:text-4xl font-bold text-slate-900 tracking-tight mb-2 md:mb-4">
            {t("productCatalog")}
          </h2>
          <p className="text-base md:text-lg text-slate-500 max-w-xl leading-relaxed">
            {t("catalogDescription")}
          </p>
        </div>
          <div className="flex items-center gap-4">
            <a 
              href="/catalog.pdf" 
              download="Elastic_Catalog.pdf"
              className="text-slate-500 hover:text-slate-900 font-medium flex items-center gap-2 text-sm transition-colors"
            >
              {t("downloadCatalog")} <Download className="w-4 h-4" />
            </a>
          </div>
      </div>

      {/* Sticky Filter Bar */}
      <div className="sticky top-[72px] sm:top-20 md:top-24 z-30 py-3 md:py-4 bg-white/95 backdrop-blur-md border-b border-stone-100 mb-8 w-full overflow-hidden">
        <div className="flex gap-2 md:gap-3 overflow-x-auto scrollbar-hide pb-1 -mx-4 px-4 md:mx-0 md:px-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "whitespace-nowrap px-4 py-2 rounded-full text-xs md:text-sm font-semibold transition-all",
                activeCategory === cat.id
                  ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20 scale-105"
                  : "bg-stone-50 text-slate-600 hover:bg-stone-100 border border-transparent"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 lg:gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-stone-100 rounded-xl md:rounded-2xl aspect-[4/5] md:aspect-[4/3] mb-4" />
                  <div className="h-4 bg-stone-100 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-stone-100 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 lg:gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="group"
                  >
                    <div className="relative bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 aspect-[4/5] md:aspect-[4/3] border border-stone-100">
                      <Image
                        src={imageErrors.has(product.id) ? fallbackImage : product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={() => handleImageError(product.id)}
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className={cn(
                      "absolute top-2 md:top-4",
                      isRtl ? "right-2 md:right-4" : "left-2 md:left-4"
                    )}>
                      <span className="bg-white/95 backdrop-blur-sm text-slate-900 text-[10px] md:text-xs font-bold px-2 py-1 rounded-md shadow-sm border border-stone-100">
                        {product.categoryLabel}
                      </span>
                    </div>
                  </div>
                  <div className={cn("mt-3 md:mt-5 px-1", isRtl && "text-right")}>
                    <h3 className="text-sm md:text-lg font-bold text-slate-900 leading-tight group-hover:text-orange-600 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Pagination */}
        <div className="mt-16 flex flex-col items-center gap-8">
          {filteredProducts.length > itemsPerPage && (
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className={cn(
                  "px-6 py-2 rounded-full font-medium transition-all flex items-center gap-2 border",
                  currentPage === 1 
                    ? "bg-stone-50 text-stone-400 border-stone-200 cursor-not-allowed"
                    : "bg-white text-slate-900 border-slate-200 hover:border-slate-900"
                )}
              >
                <ArrowRight className={cn("w-4 h-4 rotate-180", isRtl && "rotate-0")} />
                {t("previous")}
              </button>
              
              <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                <span className="text-slate-900">{currentPage}</span>
                <span>/</span>
                <span>{Math.ceil(filteredProducts.length / itemsPerPage)}</span>
              </div>

              <button 
                onClick={() => setCurrentPage(prev => Math.min(Math.ceil(filteredProducts.length / itemsPerPage), prev + 1))}
                disabled={currentPage * itemsPerPage >= filteredProducts.length}
                className={cn(
                  "px-6 py-2 rounded-full font-medium transition-all flex items-center gap-2 border",
                  currentPage * itemsPerPage >= filteredProducts.length
                    ? "bg-stone-50 text-stone-400 border-stone-200 cursor-not-allowed"
                    : "bg-slate-900 text-white border-slate-900 hover:bg-slate-800"
                )}
              >
                {t("next")}
                <ArrowRight className={cn("w-4 h-4", isRtl && "rotate-180")} />
              </button>
            </div>
            )}
          </div>
        </main>
  );
}
