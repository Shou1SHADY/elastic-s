"use client";

import { Layers, Palette, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function Features() {
  const { t, isRtl } = useLanguage();

    return (
      <section className="bg-white py-16 md:py-24 border-t border-stone-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className={cn("group", isRtl && "text-right")}>
              <div className={cn(
                "w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform",
                isRtl ? "mr-0 ml-auto" : "mr-auto ml-0"
              )}>
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2 md:mb-3 tracking-tight">
                {t("customMolds")}
              </h3>
              <p className="text-slate-500 leading-relaxed text-base md:text-lg">
                {t("customMoldsDesc")}
              </p>
            </div>
            <div className={cn("group", isRtl && "text-right")}>
              <div className={cn(
                "w-12 h-12 bg-teal-100 text-teal-600 rounded-xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform",
                isRtl ? "mr-0 ml-auto" : "mr-auto ml-0"
              )}>
                <Palette className="w-6 h-6" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2 md:mb-3 tracking-tight">
                {t("pantoneMatching")}
              </h3>
              <p className="text-slate-500 leading-relaxed text-base md:text-lg">
                {t("pantoneMatchingDesc")}
              </p>
            </div>
            <div className={cn("group", isRtl && "text-right")}>
              <div className={cn(
                "w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform",
                isRtl ? "mr-0 ml-auto" : "mr-auto ml-0"
              )}>
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2 md:mb-3 tracking-tight">
                {t("highDurability")}
              </h3>
              <p className="text-slate-500 leading-relaxed text-base md:text-lg">
                {t("highDurabilityDesc")}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  );
}
