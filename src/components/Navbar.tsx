"use client";

import { useState, useEffect, useRef } from "react";
import type { FC } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Logo from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Menu, X, Globe, Loader } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useScroll } from "@/hooks/use-scroll";
import { gsap } from "gsap";
import { useLanguage } from "@/lib/i18n";

const navLinks = [
  { href: "/about", labelKey: "about" },
  { href: "/contact", labelKey: "contact" },
];

export const Navbar: FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage, t, isRtl } = useLanguage();

  const { isScrolled, scrollDirection } = useScroll(100);
  const [isLockedOpen, setIsLockedOpen] = useState(false);

  const headerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const rotatingIconRef = useRef<HTMLDivElement>(null);

  const isShrunken = isScrolled && scrollDirection === "down" && !isLockedOpen;

  useEffect(() => {
    if (scrollDirection === "up") {
      setIsLockedOpen(false);
    }
  }, [scrollDirection]);

  // We use CSS transitions and data attributes for the shrink effect
  // to avoid JS-driven layout shifts and GSAP reflow costs.

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (rotatingIconRef.current) {
            const rotation = window.scrollY / 5;
            gsap.set(rotatingIconRef.current, { rotation });
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const handleLanguageChange = (newLang: "en" | "ar") => {
    setLanguage(newLang);
  };

  return (
    <>
      <header
        className="fixed top-4 sm:top-8 left-1/2 -translate-x-1/2 z-50 cursor-pointer w-[calc(100%-2rem)] sm:w-auto"
        onMouseEnter={() => {
          if (isShrunken) setIsLockedOpen(true);
        }}
        onClick={() => {
          if (isShrunken) window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        <div
          ref={headerRef}
          data-shrunken={isShrunken}
          className={cn(
            "flex items-center justify-center border border-stone-200/50 bg-white/30 px-4 shadow-lg backdrop-blur-lg md:px-6 overflow-hidden transition-all duration-500 ease-in-out",
            "h-20 sm:h-20 data-[shrunken=true]:h-14 data-[shrunken=true]:w-14 data-[shrunken=true]:rounded-2xl data-[shrunken=true]:p-0",
            "data-[shrunken=false]:h-20 data-[shrunken=false]:w-full data-[shrunken=false]:sm:w-auto data-[shrunken=false]:rounded-full"
          )}
        >
          <div
            ref={iconRef}
            className={cn(
              "absolute text-slate-900 transition-opacity duration-300",
              isShrunken ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
          >
            <div ref={rotatingIconRef}>
              <Loader />
            </div>
          </div>
          <Link
            href="/"
            className={cn(
              "flex-shrink-0 transition-all duration-300",
              isRtl ? "ml-4 sm:ml-6" : "mr-4 sm:mr-6",
              isShrunken ? "opacity-0 pointer-events-none scale-50" : "opacity-100 scale-110 sm:scale-125"
            )}
          >
            <div ref={logoRef}>
              <Logo />
            </div>
          </Link>
          <nav
            ref={navRef}
            className={cn(
              "hidden md:flex items-center transition-all duration-300",
              isRtl ? "space-x-reverse space-x-6" : "space-x-6",
              isShrunken ? "opacity-0 pointer-events-none translate-y-2" : "opacity-100 translate-y-0"
            )}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-sm font-medium text-slate-900 hover:text-orange-600 transition-colors group"
              >
                {t(link.labelKey)}
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-orange-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out"></span>
              </Link>
            ))}
          </nav>

          <div
            ref={langRef}
            className={cn(
              "hidden md:flex items-center transition-all duration-300 delay-75",
              isRtl ? "mr-4" : "ml-4",
              isShrunken ? "opacity-0 pointer-events-none" : "opacity-100"
            )}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Globe className="h-[1.2rem] w-[1.2rem]" />
                  <span className="sr-only">Toggle language</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleLanguageChange("en")}>
                  English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLanguageChange("ar")}>
                  العربية
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div
            className={cn(
              "md:hidden transition-opacity duration-300",
              isRtl ? "mr-auto" : "ml-auto",
              mobileMenuOpen ? "opacity-0 pointer-events-none" : "opacity-100"
            )}
          >
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
              <Menu />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-[60] bg-white/95 backdrop-blur-xl md:hidden transition-all duration-500 ease-in-out",
          mobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
        )}
        dir={isRtl ? "rtl" : "ltr"}
      >
        <div className={cn("absolute top-6", isRtl ? "left-6" : "right-6")}>
          <Button variant="ghost" size="icon" onClick={toggleMobileMenu} className="scale-125">
            <X />
            <span className="sr-only">Close menu</span>
          </Button>
        </div>
        <div className="container mx-auto px-6 flex flex-col items-center justify-center h-full">
          <nav className="flex flex-col items-center space-y-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-2xl sm:text-3xl font-bold text-slate-900 hover:text-orange-600 transition-colors italic uppercase tracking-tighter"
              >
                {t(link.labelKey)}
              </Link>
            ))}
          </nav>
          <div className="mt-8 flex gap-4">
            <Button
              variant={language === "en" ? "secondary" : "ghost"}
              onClick={() => {
                handleLanguageChange("en");
                setMobileMenuOpen(false);
              }}
            >
              English
            </Button>
            <Button
              variant={language === "ar" ? "secondary" : "ghost"}
              onClick={() => {
                handleLanguageChange("ar");
                setMobileMenuOpen(false);
              }}
            >
              العربية
            </Button>
          </div>
          <div className="absolute bottom-10">
            <Button asChild size="lg" variant="outline">
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                {t("requestQuotation")}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
