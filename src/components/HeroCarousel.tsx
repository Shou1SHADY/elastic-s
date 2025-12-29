"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const SLIDE_DURATION = 5000;
const BUCKET_URL = "https://logewufqgmgxufkovpuw.supabase.co/storage/v1/object/public/corporate";

const fallbackImages = [
  "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?q=80&w=2670&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1616606103915-dea7be788566?q=80&w=2671&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1590523278191-995cbcda646b?q=80&w=2532&auto=format&fit=crop",
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const { t, isRtl } = useLanguage();

  const slides = useMemo(() => [
    {
      tag: t("tacticalCollection"),
      title: t("tacticalTitle"),
      description: t("tacticalDesc"),
      image: `${BUCKET_URL}/army/1.jpeg`,
    },
    {
      tag: t("brandMerch"),
      title: t("brandTitle"),
      description: t("brandDesc"),
      image: `${BUCKET_URL}/coasters/1.jpeg`,
    },
    {
      tag: t("industrialParts"),
      title: t("industrialTitle"),
      description: t("industrialDesc"),
      image: `${BUCKET_URL}/police/1.jpeg`,
    },
  ], [t]);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
    setProgress(0);
  }, [slides.length]);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return prev;
        return prev + (100 / (SLIDE_DURATION / 50));
      });
    }, 50);

    const slideTimer = setInterval(nextSlide, SLIDE_DURATION);

    return () => {
      clearInterval(progressInterval);
      clearInterval(slideTimer);
    };
  }, [nextSlide]);

  const goToSlide = (index: number) => {
    setCurrent(index);
    setProgress(0);
  };

  const handleImageError = (index: number) => {
    setImageErrors((prev) => new Set(prev).add(index));
  };

  const getImageSrc = (index: number) => {
    if (imageErrors.has(index)) {
      return fallbackImages[index];
    }
    return slides[index].image;
  };

  return (
    <header className="relative w-full h-[85vh] overflow-hidden bg-stone-100 flex items-center mt-20">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 w-full h-full"
        >
          <div className="absolute inset-0 z-0">
            <Image
                src={getImageSrc(current)}
                alt={slides[current].title}
                fill
                unoptimized
                className="object-cover"
                priority
                onError={() => handleImageError(current)}
              />
            <div className="absolute inset-0 bg-slate-900/40 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
          </div>

          <div className={cn(
            "absolute bottom-0 w-full p-8 md:p-16 text-white max-w-4xl z-10",
            isRtl ? "right-0 text-right" : "left-0 text-left"
          )}>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-block py-1 px-3 border border-white/30 rounded-full text-xs font-medium uppercase tracking-wider mb-4 backdrop-blur-sm"
            >
              {slides[current].tag}
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl md:text-7xl font-semibold tracking-tight mb-4 leading-tight"
            >
              {slides[current].title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-lg md:text-xl text-stone-200 mb-8 max-w-2xl font-light"
            >
              {slides[current].description}
            </motion.p>
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white text-slate-900 px-6 py-3 rounded-full font-medium hover:bg-orange-500 hover:text-white transition-colors flex items-center gap-2"
            >
              {t("viewCollection")} <ArrowRight className={cn("w-4 h-4", isRtl && "rotate-180")} />
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>

        {/* Carousel Indicators with Progress */}
        <div className={cn(
          "absolute bottom-8 flex gap-2 z-20",
          isRtl ? "left-8" : "right-8"
        )}>
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className="w-8 md:w-12 h-1 bg-white/40 rounded-full overflow-hidden transition-all duration-300 hover:bg-white/60"
            >
              <div
                className={cn(
                  "h-full bg-white rounded-full",
                  isRtl ? "origin-right" : "origin-left"
                )}
                style={{
                  width: current === index ? `${progress}%` : current > index ? "100%" : "0%",
                  transition: current === index ? "width 50ms linear" : "none",
                }}
              />
            </button>
          ))}
        </div>
      </header>
    );
  }
