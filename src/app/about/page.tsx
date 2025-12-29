"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/lib/i18n";
import { Target, History } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AboutPage() {
  const { t, isRtl } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-slate-900 text-white pt-28 md:pt-40">
          <div className="absolute inset-0 z-0 opacity-40">
            <img 
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80" 
              alt="Manufacturing"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 to-slate-900" />
          </div>
          
          <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight italic">
                {t("aboutTitle")}
              </h1>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                {t("aboutSubtitle")}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Content Sections */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className={cn("flex items-center gap-3 mb-6 text-orange-600", isRtl && "flex-row-reverse")}>
                  <History className="w-8 h-8" />
                  <h2 className="text-3xl font-bold tracking-tight text-slate-900 uppercase italic">
                    {t("ourStory")}
                  </h2>
                </div>
                <p className={cn("text-lg text-slate-600 leading-relaxed mb-6", isRtl && "text-right")}>
                  {t("ourStoryDesc")}
                </p>
                    <div className={cn("grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6 pt-8 border-t border-stone-100", isRtl && "text-right")}>
                      <div>
                        <div className="text-xl md:text-3xl font-bold text-slate-900">30+</div>
                        <div className="text-[10px] md:text-xs text-slate-500 uppercase tracking-wider">Years Exp.</div>
                      </div>
                      <div>
                        <div className="text-xl md:text-3xl font-bold text-slate-900">500+</div>
                        <div className="text-[10px] md:text-xs text-slate-500 uppercase tracking-wider">Molds/Year</div>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <div className="text-xl md:text-3xl font-bold text-slate-900">45</div>
                        <div className="text-[10px] md:text-xs text-slate-500 uppercase tracking-wider">Countries</div>
                      </div>
                    </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl"
              >
                <img 
                  src="https://images.unsplash.com/photo-1565608438257-fac33279661e?auto=format&fit=crop&q=80" 
                  alt="Factory Floor"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-stone-50">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center flex-row-reverse">
              <div className="md:order-2">
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="flex items-center gap-3 mb-6 text-orange-600">
                    <Target className="w-8 h-8" />
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 uppercase italic">
                      {t("mission")}
                    </h2>
                  </div>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    {t("missionDesc")}
                  </p>
                  
                  <ul className="mt-8 space-y-4">
                    {[
                      "Zero-waste manufacturing initiatives",
                      "Proprietary copper-alloy mold casting",
                      "Automated quality control systems",
                      "Bespoke polymer formula development"
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                        <div className="w-2 h-2 rounded-full bg-orange-600" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="md:order-1 relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl"
              >
                <img 
                  src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80" 
                  alt="Precision Mold"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
