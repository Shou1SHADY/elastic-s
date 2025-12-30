"use client";

import { useState, useMemo, useEffect, Suspense, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, ArrowRight, Loader2, X, ChevronRight } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";
import { useSearchParams, useRouter } from "next/navigation";

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

function ProductCatalogContent() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { t, isRtl } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Scroll indicators state
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftBlur, setShowLeftBlur] = useState(false);
  const [showRightBlur, setShowRightBlur] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftBlur(scrollLeft > 10);
      setShowRightBlur(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll);
      // Initial check
      checkScroll();
      // Recalculate on window resize
      window.addEventListener('resize', checkScroll);
      return () => {
        el.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [categories]);

  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setActiveCategory(categoryParam);
      // Wait a bit for the page to be ready if it's initial load
      setTimeout(() => {
        document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  }, [searchParams]);

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    const params = new URLSearchParams(searchParams.toString());
    if (categoryId === "all") {
      params.delete("category");
    } else {
      params.set("category", categoryId);
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

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
    <main className="w-full max-w-7xl mx-auto px-2 md:px-6 py-12 md:py-20 overflow-x-hidden" id="products">
      {/* Section Header */}
      <div className="mb-10 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 px-2 md:px-0">
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
      <div className="sticky top-[72px] sm:top-20 md:top-24 z-30 py-4 md:py-6 bg-stone-50/90 backdrop-blur-xl border-y border-stone-200/60 mb-8 w-full overflow-hidden shadow-sm relative group/filter">
        {/* Left Scroll Indicator */}
        <div className={cn(
          "absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-stone-50/90 to-transparent z-10 pointer-events-none transition-opacity duration-300",
          showLeftBlur ? "opacity-100" : "opacity-0"
        )} />

        <div
          ref={scrollRef}
          className="flex gap-2 md:gap-4 overflow-x-auto scrollbar-hide pb-1 px-4 md:px-8 relative"
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={cn(
                "whitespace-nowrap px-5 py-2.5 rounded-full text-xs md:text-sm font-bold transition-all flex-shrink-0",
                activeCategory === cat.id
                  ? "bg-slate-900 text-white shadow-xl shadow-slate-900/20 scale-105"
                  : "bg-white text-slate-600 hover:bg-white hover:text-slate-900 border border-stone-200 shadow-sm"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Right Scroll Indicator */}
        <div className={cn(
          "absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-stone-50/90 to-transparent z-10 pointer-events-none transition-opacity duration-300",
          showRightBlur ? "opacity-100" : "opacity-0"
        )} />
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-8 w-full">
          {[...Array(itemsPerPage)].map((_, i) => (
            <div key={i} className="animate-pulse min-w-0">
              <div className="bg-stone-100 rounded-md md:rounded-2xl aspect-square mb-1" />
              <div className="h-2 bg-stone-100 rounded w-3/4 mb-1" />
              <div className="h-2 bg-stone-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-8 w-full"
        >
          <AnimatePresence>
            {filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="group w-full min-w-0"
              >
                <div
                  className="relative bg-white rounded-md md:rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 aspect-square border border-stone-100 w-full "
                  onClick={() => setSelectedProduct(product)}
                >
                  <Image
                    src={imageErrors.has(product.id) ? fallbackImage : product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={() => handleImageError(product.id)}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className={cn(
                    "absolute top-2 md:top-4",
                    isRtl ? "right-2 md:right-4" : "left-2 md:left-4"
                  )}>
                    <span className="bg-white/95 backdrop-blur-sm text-slate-900 text-[8px] md:text-xs font-bold px-1.5 py-1 rounded shadow-sm border border-stone-100 flex items-center gap-1">
                      <span className="opacity-60">{product.categoryLabel}</span>
                      <span className="text-orange-600 font-extrabold">#{product.name.split('#')[1] || ''}</span>
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Product Image Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProduct(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-slate-900/90 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl aspect-square md:aspect-[4/3] bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl overflow-y-auto"
            >
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-sm text-slate-900 rounded-full hover:bg-orange-500 hover:text-white transition-all shadow-lg"
              >
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>

              <div className="flex flex-col h-full">
                <div className="relative flex-1 w-full min-h-[300px] bg-stone-50">
                  <Image
                    src={imageErrors.has(selectedProduct.id) ? fallbackImage : selectedProduct.image}
                    alt={selectedProduct.name}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>

                <div className={cn(
                  "p-6 md:p-10 bg-white border-t border-stone-100",
                  isRtl && "text-right"
                )}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs md:text-sm font-bold">
                      {selectedProduct.categoryLabel}
                    </span>
                    <span className="text-slate-400 font-medium text-sm md:text-base">
                      #{selectedProduct.name.split('#')[1] || ''}
                    </span>
                  </div>
                  <h3 className="text-xl md:text-3xl font-black text-slate-900 mb-2">
                    {selectedProduct.name.split('#')[0].trim()}
                  </h3>
                  <p className="text-slate-500 text-sm md:text-base leading-relaxed max-w-2xl">
                    {t("catalogDescription")}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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

export function ProductCatalog() {
  return (
    <Suspense fallback={<div className="min-h-screen animate-pulse bg-stone-50" />}>
      <ProductCatalogContent />
    </Suspense>
  );
}
