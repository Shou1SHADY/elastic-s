"use client";

import { Linkedin, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import Logo from "@/components/shared/logo";

export function Footer() {
  const { t, isRtl } = useLanguage();

    return (
      <footer className="bg-stone-900 text-stone-400 py-16 md:py-20 border-t border-stone-800" id="contact">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-16">
            <div className={cn("col-span-2 lg:col-span-1", isRtl && "text-right")}>
              <div className={cn("flex items-center gap-2 mb-6 text-white", isRtl && "justify-end lg:justify-start")}>
                <Link href="/">
                  <Logo />
                </Link>
              </div>
              <p className="text-stone-500 mb-6 text-sm md:text-base leading-relaxed">
                {t("footerDesc")}
              </p>
              <div className={cn("flex gap-4", isRtl && "justify-end lg:justify-start")}>
                <Link href="#" className="hover:text-white transition-colors">
                  <Linkedin className="w-5 h-5" />
                </Link>
                <Link href="#" className="hover:text-white transition-colors">
                  <Twitter className="w-5 h-5" />
                </Link>
                <Link href="#" className="hover:text-white transition-colors">
                  <Instagram className="w-5 h-5" />
                </Link>
              </div>
            </div>

            <div className={cn(isRtl && "text-right")}>
              <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">{t("collections")}</h4>
              <ul className="space-y-3 text-sm md:text-base">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    {t("armyTactical")}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    {t("keychains")}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    {t("barHome")}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    {t("techAccessories")}
                  </Link>
                </li>
              </ul>
            </div>

            <div className={cn(isRtl && "text-right")}>
              <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">{t("company")}</h4>
                <ul className="space-y-3 text-sm md:text-base">
                  <li>
                    <Link href="/about" className="hover:text-white transition-colors">
                      {t("about")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="hover:text-white transition-colors">
                      {t("contact")}
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white transition-colors">
                      {t("manufacturingProcess")}
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white transition-colors">
                      {t("careers")}
                    </Link>
                  </li>
                </ul>
            </div>

            <div className={cn("col-span-2 lg:col-span-1", isRtl && "text-right")}>
              <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">{t("contact")}</h4>
              <ul className="space-y-4 text-sm md:text-base">
                <li className={cn("flex items-center gap-3", isRtl && "flex-row-reverse")}>
                  <Mail className="w-4 h-4 text-orange-500" /> 
                  <a href="mailto:Admin@elastic-eg.com" className="hover:text-white transition-colors">Admin@elastic-eg.com</a>
                </li>
                <li className={cn("flex items-center gap-3", isRtl && "flex-row-reverse")}>
                  <Phone className="w-4 h-4 text-orange-500" />
                  <a href="tel:01013140080" className="hover:text-white transition-colors">01013140080</a>
                </li>
                <li className={cn("flex items-center gap-3", isRtl && "flex-row-reverse")}>
                  <MapPin className="w-4 h-4 text-orange-500" /> 
                  <a href="https://maps.app.goo.gl/D83f5i4as62NNb4V7?g_st=aw" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    Cairo, Egypt
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className={cn(
            "border-t border-stone-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs md:text-sm",
            isRtl && "md:flex-row-reverse"
          )}>
            <p className="text-stone-600">© 2025 Elastic. {t("allRightsReserved")}</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="#" className="hover:text-white transition-colors">
                {t("privacyPolicy")}
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                {t("termsOfService")}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    );
}
