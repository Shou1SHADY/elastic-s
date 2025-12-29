"use client";

import { Layers, Palette, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function Features() {
  const { t, isRtl } = useLanguage();

  const features = [
    {
      icon: Layers,
      title: "customMolds",
      desc: "customMoldsDesc",
      color: "orange",
    },
    {
      icon: Palette,
      title: "pantoneMatching",
      desc: "pantoneMatchingDesc",
      color: "teal",
    },
    {
      icon: ShieldCheck,
      title: "highDurability",
      desc: "highDurabilityDesc",
      color: "blue",
    },
  ];

  return (
    <section className="bg-stone-50 py-20 md:py-32 border-t border-stone-100" id="about">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {features.map((feature, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={cn("group p-8 bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 border border-stone-100", isRtl && "text-right")}
            >
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500",
                feature.color === "orange" && "bg-orange-100 text-orange-600",
                feature.color === "teal" && "bg-teal-100 text-teal-600",
                feature.color === "blue" && "bg-blue-100 text-blue-600",
                isRtl ? "mr-0 ml-auto" : "mr-auto ml-0"
              )}>
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 tracking-tight">
                {t(feature.title as any)}
              </h3>
              <p className="text-slate-500 leading-relaxed text-base md:text-lg">
                {t(feature.desc as any)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
