"use client";

import { useState, useEffect } from "react";
import { Hexagon, ArrowRight, Menu } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
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
            Home
          </Link>
          <a href="#products" className="hover:text-slate-900 transition-colors">
            Products
          </a>
          <Link href="#" className="hover:text-slate-900 transition-colors">
            Collections
          </Link>
          <Link href="#" className="hover:text-slate-900 transition-colors">
            Industries
          </Link>
          <Link href="#" className="hover:text-slate-900 transition-colors">
            About
          </Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <a
            href="#contact"
            className="hidden md:flex bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-slate-800 transition-all hover:shadow-lg items-center gap-2"
          >
            Request Quotation
            <ArrowRight className="w-4 h-4" />
          </a>
          <button className="md:hidden text-slate-900">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </nav>
  );
}
