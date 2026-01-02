"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const SLIDE_DURATION = 8000;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const BUCKET_URL = `${SUPABASE_URL}/storage/v1/object/public/corporate`;

const fallbackImages = [
  "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?q=80&w=2670&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1616606103915-dea7be788566?q=80&w=2671&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1590523278191-995cbcda646b?q=80&w=2532&auto=format&fit=crop",
];

interface CarouselSlide {
  id: string;
  image: string;
  tag_en: string;
  tag_ar: string;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  order: number;
}

export function HeroCarousel({ initialSlides = [] }: { initialSlides?: CarouselSlide[] }) {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const [dynamicSlides, setDynamicSlides] = useState<CarouselSlide[]>(initialSlides);
  const { t, isRtl, language } = useLanguage();

  const fallbackSlides = useMemo(() => [
    {
      id: "fallback-1",
      tag: t("tacticalCollection"),
      title: t("tacticalTitle"),
      description: t("tacticalDesc"),
      image: `${BUCKET_URL}/army/ABU44231-2_tn.webp`,
    },
    {
      id: "fallback-2",
      tag: t("brandMerch"),
      title: t("brandTitle"),
      description: t("brandDesc"),
      image: `${BUCKET_URL}/coasters/ABU42852-23_tn.webp`,
    },
    {
      id: "fallback-3",
      tag: t("industrialParts"),
      title: t("industrialTitle"),
      description: t("industrialDesc"),
      image: `${BUCKET_URL}/police/ABU44238-9_tn.webp`,
    },
  ], [t]);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await fetch("/api/carousel");
        const data = await res.json();
        if (data.slides && data.slides.length > 0) {
          setDynamicSlides(data.slides.sort((a: any, b: any) => a.order - b.order));
        }
      } catch (error) {
        console.error("Failed to fetch carousel slides", error);
      }
    };
    fetchSlides();
  }, []);

  const slides = useMemo(() => {
    if (dynamicSlides.length > 0) {
      return dynamicSlides.map(s => ({
        tag: language === "ar" ? s.tag_ar : s.tag_en,
        title: language === "ar" ? s.title_ar : s.title_en,
        description: language === "ar" ? s.description_ar : s.description_en,
        image: s.image
      }));
    }
    return fallbackSlides;
  }, [dynamicSlides, fallbackSlides, language]);

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
      return fallbackImages[index % fallbackImages.length];
    }
    return slides[index].image;
  };

  return (
    <header className="relative w-full h-screen overflow-hidden bg-stone-100 flex items-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 w-full h-full"
        >
          <div className="absolute inset-0 z-0 overflow-hidden">
            <motion.div
              animate={{ scale: [1, 1.1] }}
              transition={{ duration: SLIDE_DURATION / 1000, ease: "linear" }}
              className="w-full h-full relative"
            >
              <Image
                src={getImageSrc(current)}
                alt={slides[current].title}
                fill
                className="object-cover"
                priority
                quality={90}
                onError={() => handleImageError(current)}
              />
              {/* Preload next image */}
              <div className="hidden">
                <Image
                  src={getImageSrc((current + 1) % slides.length)}
                  alt="preload"
                  width={1}
                  height={1}
                  priority
                />
              </div>
            </motion.div>
            <div className="absolute inset-0 bg-slate-900/40 bg-gradient-to-t from-slate-900/95 via-slate-900/20 to-transparent"></div>
          </div>

          <div className={cn(
            "absolute inset-0 flex flex-col px-6 sm:px-10 md:px-16 lg:px-24 text-white max-w-7xl mx-auto z-10",
            isRtl ? "text-right" : "text-left"
          )}>
            <div className="h-24 md:h-32" />
            <div className="flex-1 flex flex-col justify-center">
              <div className="max-w-4xl">
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="inline-block py-1 px-3 border border-white/30 rounded-full text-[10px] md:text-xs font-medium uppercase tracking-wider mb-4 md:mb-6 backdrop-blur-sm"
                >
                  {slides[current].tag}
                </motion.span>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-4 md:mb-6 leading-[1.1] italic uppercase"
                >
                  {slides[current].title}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-sm sm:text-lg md:text-2xl text-stone-200 mb-8 md:mb-12 max-w-2xl font-light leading-relaxed"
                >
                  {slides[current].description}
                </motion.p>
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  onClick={() => {
                    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="bg-white text-slate-900 px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-5 rounded-full text-xs sm:text-sm md:text-base font-bold hover:bg-orange-500 hover:text-white transition-all flex items-center gap-2 shadow-2xl group"
                >
                  {t("viewCollection")}
                  <ArrowRight className={cn("w-5 h-5 transition-transform group-hover:translate-x-1", isRtl && "rotate-180 group-hover:-translate-x-1")} />
                </motion.button>
              </div>
            </div>
            <div className="h-24 md:h-32" />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Carousel Indicators with Progress */}
      <div className={cn(
        "absolute bottom-10 sm:bottom-12 flex gap-3 z-20",
        isRtl ? "left-10 sm:left-12" : "right-10 sm:right-12"
      )}>
        {slides.map((_, index) => (
          <Indicator
            key={index}
            index={index}
            current={current}
            progress={progress}
            isRtl={isRtl}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </header>
  );
}

function Indicator({ index, current, progress, isRtl, onClick }: {
  index: number;
  current: number;
  progress: number;
  isRtl: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
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
  );
}
