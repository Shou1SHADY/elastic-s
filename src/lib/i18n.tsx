"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

type Language = "en" | "ar";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRtl: boolean;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    home: "Home",
    products: "Products",
    collections: "Collections",
    industries: "Industries",
    about: "About",
    requestQuotation: "Request Quotation",
    viewCollection: "View Collection",
    productCatalog: "Product Catalog",
    catalogDescription: "Explore our diverse manufacturing capabilities. Filter by industry or product type to find specific molding samples.",
    downloadCatalog: "Download Full Catalog",
    allProducts: "All Products",
    keychains: "Keychains",
    armyTactical: "Army & Tactical",
    techAccessories: "Tech Accessories",
    barHome: "Bar & Home",
    labelsPatches: "Labels & Patches",
      viewAllCategories: "View All Categories",
        showMore: "Show More",
        next: "Next",
        previous: "Previous",
        customMolds: "Custom Molds",
    customMoldsDesc: "We create proprietary aluminum and copper molds tailored to your exact 3D specifications and tolerances.",
    pantoneMatching: "Pantone Matching",
    pantoneMatchingDesc: "Exact color reproduction. Our PVC and silicone mixing process ensures brand consistency across every batch.",
    highDurability: "High Durability",
    highDurabilityDesc: "Waterproof, heat-resistant, and flexible. Products built to withstand industrial use and outdoor elements.",
    footerDesc: "Premium B2B manufacturing partner for global brands. Custom rubber solutions delivered with precision.",
    contact: "Contact",
    company: "Company",
    manufacturingProcess: "Manufacturing Process",
    sustainability: "Sustainability",
    careers: "Careers",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    allRightsReserved: "All rights reserved.",
    tacticalCollection: "Tactical Collection",
    tacticalTitle: "Precision Molding for Mission Critical Gear.",
    tacticalDesc: "Custom rubber patches, grips, and tactical accessories designed for durability in extreme conditions.",
    brandMerch: "Brand Merchandise",
    brandTitle: "Vibrant 3D PVC Promotional Products.",
    brandDesc: "From themed keychains to custom coasters. High-detail molds that bring your brand mascot to life.",
    industrialParts: "Industrial Components",
    industrialTitle: "Automotive & Electronic Insulation.",
    industrialDesc: "High-grade silicone and rubber components. Mobile holders, cable organizers, and protective seals.",
  },
  ar: {
    home: "الرئيسية",
    products: "المنتجات",
    collections: "المجموعات",
    industries: "الصناعات",
    about: "حول",
    requestQuotation: "طلب عرض سعر",
    viewCollection: "عرض المجموعة",
    productCatalog: "كتالوج المنتجات",
    catalogDescription: "استكشف قدراتنا التصنيعية المتنوعة. قم بالتصفية حسب الصناعة أو نوع المنتج للعثور على عينات قوالب محددة.",
    downloadCatalog: "تحميل الكتالوج الكامل",
    allProducts: "كل المنتجات",
    keychains: "سلاسل المفاتيح",
    armyTactical: "الجيش والتكتيكية",
    techAccessories: "ملحقات التقنية",
    barHome: "البار والمنزل",
    labelsPatches: "الملصقات والرقع",
      viewAllCategories: "عرض جميع الفئات",
        showMore: "عرض المزيد",
        next: "التالي",
        previous: "السابق",
        customMolds: "قوالب مخصصة",
    customMoldsDesc: "نحن نصنع قوالب ألمنيوم ونحاس خاصة مصممة خصيصاً لمواصفاتك ثلاثية الأبعاد الدقيقة والتحمل.",
    pantoneMatching: "مطابقة بانتون",
    pantoneMatchingDesc: "إعادة إنتاج ألوان دقيقة. تضمن عملية خلط PVC والسيليكون لدينا اتساق العلامة التجارية في كل دفعة.",
    highDurability: "متانة عالية",
    highDurabilityDesc: "مقاوم للماء والحرارة ومرن. منتجات مصممة لتحمل الاستخدام الصناعي والعناصر الخارجية.",
    footerDesc: "شريك تصنيع B2B متميز للعلامات التجارية العالمية. حلول مطاطية مخصصة يتم تسليمها بدقة.",
    contact: "اتصل بنا",
    company: "الشركة",
    manufacturingProcess: "عملية التصنيع",
    sustainability: "الاستدامة",
    careers: "وظائف",
    privacyPolicy: "سياسة الخصوصية",
    termsOfService: "شروط الخدمة",
    allRightsReserved: "جميع الحقوق محفوظة.",
    tacticalCollection: "المجموعة التكتيكية",
    tacticalTitle: "قولبة دقيقة للمعدات الحيوية للمهمة.",
    tacticalDesc: "رقع مطاطية مخصصة ومقابض وملحقات تكتيكية مصممة للمتانة في الظروف القاسية.",
    brandMerch: "بضائع العلامة التجارية",
    brandTitle: "منتجات ترويجية PVC ثلاثية الأبعاد نابضة بالحياة.",
    brandDesc: "من سلاسل المفاتيح ذات الطابع الخاص إلى القواعد المخصصة. قوالب عالية التفاصيل تجلب تميمة علامتك التجارية إلى الحياة.",
    industrialParts: "المكونات الصناعية",
    industrialTitle: "عزل السيارات والإلكترونيات.",
    industrialDesc: "مكونات سيليكون ومطاط عالية الجودة. حاملات هواتف، منظمات كابلات، وأختام واقية.",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  const t = useCallback((key: string) => {
    return translations[language][key] || key;
  }, [language]);

  const isRtl = language === "ar";

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.dir = isRtl ? "rtl" : "ltr";
      document.documentElement.lang = language;
    }
  }, [language, isRtl]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRtl }}>
      <div dir={isRtl ? "rtl" : "ltr"} className="w-full">
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
