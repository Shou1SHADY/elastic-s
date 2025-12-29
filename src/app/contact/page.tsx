"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/lib/i18n";
import { Mail, Phone, MapPin, Send, Clock, Hexagon } from "lucide-react";

export default function ContactPage() {
  const { t, isRtl } = useLanguage();

  const contactInfo = [
    {
      icon: Phone,
      label: "Phone",
      value: "+1 (555) 123-4567",
      href: "tel:+15551234567"
    },
    {
      icon: Mail,
      label: "Email",
      value: "eng@rubbermanuf.com",
      href: "mailto:eng@rubbermanuf.com"
    },
    {
      icon: Clock,
      label: "Hours",
      value: "Mon - Fri: 8am - 6pm",
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        <section className="pt-32 pb-20 md:pt-40 md:pb-24 bg-stone-50">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 italic"
              >
                {t("contactTitle")}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-lg text-slate-600"
              >
                {t("contactSubtitle")}
              </motion.p>
            </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
                {/* Contact Info */}
                <div className="space-y-6 md:space-y-8">
                  <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-stone-200">
                    <h3 className={cn("text-xl font-bold text-slate-900 mb-6 uppercase tracking-wider italic", isRtl && "text-right")}>
                      {t("location")}
                    </h3>
                    <div className={cn("flex gap-4 mb-8", isRtl && "flex-row-reverse text-right")}>
                      <div className="bg-orange-100 p-3 rounded-xl text-orange-600 shrink-0 h-fit">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 mb-1">Industrial Zone - HQ</p>
                        <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                          124 Manufacturing Way, Tech Park<br />
                          Suite 500, Industrial District
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      {contactInfo.map((info, i) => (
                        <div key={i} className={cn("flex gap-4 items-center", isRtl && "flex-row-reverse text-right")}>
                          <div className="bg-slate-100 p-3 rounded-xl text-slate-600 shrink-0">
                            <info.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">{info.label}</p>
                            {info.href ? (
                              <a href={info.href} className="text-sm md:text-base text-slate-900 font-medium hover:text-orange-600 transition-colors">
                                {info.value}
                              </a>
                            ) : (
                              <p className="text-sm md:text-base text-slate-900 font-medium">{info.value}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
  
                  <div className="bg-slate-900 p-6 md:p-8 rounded-2xl text-white overflow-hidden relative group">
                    <div className={cn("relative z-10", isRtl && "text-right")}>
                      <h3 className="text-xl font-bold mb-4 italic">Global Distribution</h3>
                      <p className="text-slate-400 text-xs md:text-sm leading-relaxed mb-6">
                        We ship worldwide via DHL and FedEx with real-time tracking and customs clearance support.
                      </p>
                      <div className={cn("flex -space-x-2", isRtl && "flex-row-reverse space-x-reverse justify-end")}>
                        {[1,2,3,4].map(i => (
                          <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-bold">
                            {String.fromCharCode(64 + i)}
                          </div>
                        ))}
                        <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-orange-600 flex items-center justify-center text-[10px] font-bold">
                          +40
                        </div>
                      </div>
                    </div>
                    <Hexagon className={cn(
                      "absolute -bottom-8 w-32 h-32 text-slate-800 rotate-12 transition-transform group-hover:scale-110",
                      isRtl ? "-left-8" : "-right-8"
                    )} />
                  </div>
                </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white p-8 md:p-12 rounded-2xl shadow-lg border border-stone-100"
                >
                  <form className="grid grid-cols-1 md:grid-cols-2 gap-8" onSubmit={(e) => e.preventDefault()}>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-900 uppercase tracking-wider">{t("fullName")}</label>
                      <input 
                        type="text" 
                        placeholder="John Doe"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-900 uppercase tracking-wider">{t("emailAddress")}</label>
                      <input 
                        type="email" 
                        placeholder="john@company.com"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 transition-all"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-bold text-slate-900 uppercase tracking-wider">{t("message")}</label>
                      <textarea 
                        rows={6}
                        placeholder="Describe your project requirements..."
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 transition-all resize-none"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <button className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-all hover:shadow-xl flex items-center justify-center gap-3 group">
                        {t("sendMessage")}
                        <Send className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${isRtl && "group-hover:-translate-x-1"}`} />
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

          {/* Map Placeholder */}
          <section className="h-[300px] sm:h-[400px] grayscale hover:grayscale-0 transition-all duration-700 bg-stone-200 overflow-hidden relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-4">
                <MapPin className="w-10 h-10 sm:w-12 sm:h-12 text-orange-600 mx-auto mb-4" />
                <p className="font-bold text-slate-900 text-sm sm:text-base">{t("visitUs")}</p>
              </div>
            </div>
            <img 
              src="https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&q=80" 
              alt="Map Background"
              className="w-full h-full object-cover opacity-50"
            />
          </section>
      </main>

      <Footer />
    </div>
  );
}
