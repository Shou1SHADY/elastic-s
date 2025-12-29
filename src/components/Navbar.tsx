"use client";

import { useState, useEffect } from "react";
import { Hexagon, ArrowRight, Menu, Globe, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage, t, isRtl } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ar" : "en");
  };

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-stone-200 transition-all duration-300",
          isScrolled ? "shadow-md h-16" : "h-20"
        )}
      >
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group cursor-pointer">
            <div className="bg-orange-600 text-white p-1.5 rounded-lg group-hover:bg-slate-900 transition-colors duration-300">
              <Hexagon strokeWidth={2} className="w-6 h-6" />
            </div>
            <span className="text-xl tracking-tight font-semibold text-slate-900">
              RubberMfg<span className="text-slate-400 font-normal">.inc</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
            <Link href="/" className="text-slate-900 hover:text-orange-600 transition-colors">
              {t("home")}
            </Link>
            <a href="#products" className="hover:text-slate-900 transition-colors">
              {t("products")}
            </a>
            <Link href="#" className="hover:text-slate-900 transition-colors">
              {t("collections")}
            </Link>
            <Link href="#" className="hover:text-slate-900 transition-colors">
              {t("industries")}
            </Link>
            <Link href="#" className="hover:text-slate-900 transition-colors">
              {t("about")}
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-3 py-1.5 rounded-full hover:bg-stone-100"
            >
              <Globe className="w-4 h-4" />
              <span>{language === "en" ? "العربية" : "English"}</span>
            </button>
            <a
              href="#contact"
              className="hidden md:flex bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-slate-800 transition-all hover:shadow-lg items-center gap-2"
            >
              {t("requestQuotation")}
              <ArrowRight className={cn("w-4 h-4", isRtl && "rotate-180")} />
            </a>
            <button 
              className="md:hidden text-slate-900 p-2 hover:bg-stone-100 rounded-full transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-white transition-transform duration-300 md:hidden",
          isMobileMenuOpen ? "translate-y-0" : "-translate-y-full"
        )}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8 p-6 pt-24 overflow-y-auto">
          <Link 
            href="/" 
            className="text-2xl font-semibold text-slate-900"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {t("home")}
          </Link>
          <a 
            href="#products" 
            className="text-2xl font-semibold text-slate-900"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {t("products")}
          </a>
          <Link 
            href="#" 
            className="text-2xl font-semibold text-slate-900"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {t("collections")}
          </Link>
          <Link 
            href="#" 
            className="text-2xl font-semibold text-slate-900"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {t("industries")}
          </Link>
          <Link 
            href="#" 
            className="text-2xl font-semibold text-slate-900"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {t("about")}
          </Link>
          <a
            href="#contact"
            className="mt-4 bg-slate-900 text-white px-8 py-4 rounded-full text-lg font-medium w-full text-center"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {t("requestQuotation")}
          </a>
        </div>
      </div>
    </>
  );
}
