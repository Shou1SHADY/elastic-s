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
    process: "Process",
    portfolio: "Portfolio",
    aboutTitle: "About Us",
    aboutSubtitle: "We combine traditional craftsmanship with advanced robotic molding to deliver rubber solutions that define industries.",
    ourStory: "Our Story",
    ourStoryDesc: "Founded in a small workshop, we've grown into a global leader in PVC and Silicone manufacturing, serving automotive, tactical, and consumer brands worldwide.",
    mission: "Our Mission",
    missionDesc: "To push the boundaries of polymer engineering, ensuring every custom mold we produce meets the highest standards of durability and aesthetic precision.",
    contactTitle: "Contact Us",
    contactSubtitle: "Have a project in mind? Our engineering team is ready to help from concept to production.",
    sendMessage: "Send Message",
    fullName: "Full Name",
    emailAddress: "Email Address",
    message: "Message",
    location: "Location",
    visitUs: "Visit our factory and showroom in the Industrial Zone.",
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
    tacticalTitle: "Tactical Gear",
    tacticalDesc: "Custom rubber patches, grips, and tactical accessories designed for durability in extreme conditions.",
    brandMerch: "Brand Merchandise",
    brandTitle: "Brand Merchandise",
    brandDesc: "From themed keychains to custom coasters. High-detail molds that bring your brand mascot to life.",
    industrialParts: "Industrial Components",
    industrialTitle: "Industrial Components",
    industrialDesc: "High-grade silicone and rubber components. Mobile holders, cable organizers, and protective seals.",
    phone: "Phone",
    email: "Email",
    hours: "Business Hours",
    globalDistribution: "Global Distribution",
    globalDistributionDesc: "Reliable international logistics with real-time tracking.",
    responseRate: "Rapid Response",
    responseRateDesc: "Inquiries answered within 24 business hours.",
    technicalConsultation: "Technical Consultation",
    technicalConsultationDesc: "Direct access to our material engineers for custom formulations.",
    sendMessageSuccess: "Message Sent Successfully!",
    sendMessageError: "Failed to send message. Please try again.",
    requiredField: "Required field",
    army: "Army & Tactical",
    police: "Police & Security",
    "bar-mat": "Bar Mats",
    coasters: "Coasters",
    "flash-memory": "Flash Memory",
    "fridge-magnet": "Fridge Magnets",
    label: "Labels & Tags",
    lighter: "Lighter Covers",
    "mobile-holder": "Mobile Holders",
    "pen-accessories": "Pen Accessories",
  },
  ar: {
    home: "الرئيسية",

    products: "المنتجات",
    collections: "المجموعات",
    industries: "الصناعات",
    about: "حول",
    process: "عمليتنا",
    portfolio: "أعمالنا",
    aboutTitle: "عن الشركة",
    aboutSubtitle: "نحن نجمع بين الحرفية التقليدية والقولبة الآلية المتقدمة لتقديم حلول مطاطية تحدد معالم الصناعات.",
    ourStory: "قصتنا",
    ourStoryDesc: "تأسست شركتنا في ورشة صغيرة، ونمت لتصبح رائدة عالمية في تصنيع PVC والسيليكون، وتخدم العلامات التجارية للسيارات والعلامات التجارية التكتيكية والاستهلاكية في جميع أنحاء العالم.",
    mission: "مهمتنا",
    missionDesc: "دفع حدود هندسة البوليمرات، وضمان أن كل قالب مخصص ننتجه يلبي أعلى معايير المتانة والدقة الجمالية.",
    contactTitle: "اتصل بنا",
    contactSubtitle: "هل لديك مشروع في بالك؟ فريقنا الهندسي جاهز للمساعدة من المفهوم إلى الإنتاج.",
    sendMessage: "إرسال رسالة",
    fullName: "الاسم الكامل",
    emailAddress: "البريد الإلكتروني",
    message: "الرسالة",
    location: "الموقع",
    visitUs: "تفضل بزيارة مصنعنا ومعرضنا في المنطقة الصناعية.",
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
    tacticalTitle: "معدات تكتيكية",
    tacticalDesc: "رقع مطاطية مخصصة ومقابض وملحقات تكتيكية مصممة للمتانة في الظروف القاسية.",
    brandMerch: "بضائع العلامة التجارية",
    brandTitle: "بضائع ترويجية",
    brandDesc: "من سلاسل المفاتيح ذات الطابع الخاص إلى القواعد المخصصة. قوالب عالية التفاصيل تجلب تميمة علامتك التجارية إلى الحياة.",
    industrialParts: "المكونات الصناعية",
    industrialTitle: "مكونات صناعية",
    industrialDesc: "مكونات سيليكون ومطاط عالية الجودة. حاملات هواتف، منظمات كابلات، وأختام واقية.",
    phone: "الهاتف",
    email: "البريد الإلكتروني",
    hours: "ساعات العمل",
    globalDistribution: "توزيع عالمي",
    globalDistributionDesc: "خدمات لوجستية دولية موثوقة مع تتبع في الوقت الفعلي.",
    responseRate: "استجابة سريعة",
    responseRateDesc: "يتم الرد على الاستفسارات في غضون 24 ساعة عمل.",
    technicalConsultation: "استشارة فنية",
    technicalConsultationDesc: "وصول مباشر لمهندسي المواد لدينا للصيغ المخصصة.",
    sendMessageSuccess: "تم إرسال الرسالة بنجاح!",
    sendMessageError: "فشل إرسال الرسالة. يرجى المحاولة مرة أخرى.",
    requiredField: "حقل مطلوب",
    army: "الجيش والتكتيكية",
    police: "الشرطة والأمن",
    "bar-mat": "مفارش البار",
    coasters: "قواعد الأكواب",
    "flash-memory": "ذاكرة الفلاش",
    "fridge-magnet": "مغناطيس الثلاجة",
    label: "الملصقات والبطاقات",
    lighter: "أغطية القداحات",
    "mobile-holder": "حوامل الهاتف",
    "pen-accessories": "ملحقات الأقلام",
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
