"use client";

import { Hexagon, Linkedin, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function Footer() {
  const { t, isRtl } = useLanguage();

  return (
    <footer className="bg-stone-900 text-stone-400 py-20 border-t border-stone-800" id="contact">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className={cn(isRtl && "text-right")}>
            <div className={cn("flex items-center gap-2 mb-6 text-white", isRtl && "justify-end md:justify-start")}>
              <Hexagon className="w-6 h-6 text-orange-500" />
              <span className="text-xl font-semibold tracking-tight">RubberMfg</span>
            </div>
            <p className="text-stone-500 mb-6">
              {t("footerDesc")}
            </p>
            <div className={cn("flex gap-4", isRtl && "justify-end md:justify-start")}>
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
            <h4 className="text-white font-medium mb-6">{t("collections")}</h4>
            <ul className="space-y-4">
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
            <h4 className="text-white font-medium mb-6">{t("company")}</h4>
            <ul className="space-y-4">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  {t("about")}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  {t("manufacturingProcess")}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  {t("sustainability")}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  {t("careers")}
                </Link>
              </li>
            </ul>
          </div>

          <div className={cn(isRtl && "text-right")}>
            <h4 className="text-white font-medium mb-6">{t("contact")}</h4>
            <ul className="space-y-4">
              <li className={cn("flex items-center gap-3", isRtl && "flex-row-reverse")}>
                <Mail className="w-4 h-4" /> sales@rubbermfg.com
              </li>
              <li className={cn("flex items-center gap-3", isRtl && "flex-row-reverse")}>
                <Phone className="w-4 h-4" /> +1 (555) 123-4567
              </li>
              <li className={cn("flex items-center gap-3", isRtl && "flex-row-reverse")}>
                <MapPin className="w-4 h-4" /> 12 Industrial Way, Tech Park
              </li>
            </ul>
          </div>
        </div>
        <div className={cn(
          "border-t border-stone-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm",
          isRtl && "md:flex-row-reverse"
        )}>
          <p>© 2024 RubberMfg Inc. {t("allRightsReserved")}</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-white">
              {t("privacyPolicy")}
            </Link>
            <Link href="#" className="hover:text-white">
              {t("termsOfService")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
