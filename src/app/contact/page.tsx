"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/lib/i18n";
import { Mail, Phone, MapPin, Send, Clock, Hexagon, ShieldCheck, Zap, Users, CheckCircle2, Loader2 } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function ContactPage() {
  const { t, isRtl } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    industry: t("armyTactical"),
    message: ""
  });

    const contactInfo = [
    {
      icon: Phone,
      label: t("phone"),
      value: "01013140080",
      href: "tel:01013140080",
      color: "bg-blue-50 text-blue-600"
    },
    {
      icon: Mail,
      label: t("email"),
      value: "Admin@elastic-eg.com",
      href: "mailto:Admin@elastic-eg.com",
      color: "bg-orange-50 text-orange-600"
    },
    {
      icon: Clock,
      label: t("hours"),
      value: "Mon - Sat: 9am - 6pm",
      color: "bg-slate-50 text-slate-600"
    }
  ];

  const trustBadges = [
    { icon: Zap, title: t("responseRate"), desc: t("responseRateDesc") },
    { icon: Users, title: t("technicalConsultation"), desc: t("technicalConsultationDesc") },
    { icon: ShieldCheck, title: "ISO 9001 Certified", desc: "Highest quality manufacturing standards since 1994." }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from("contact_submissions")
        .insert([formData]);

      if (error) throw error;

      toast.success(t("sendMessageSuccess") || "Message sent successfully!");
      setSubmitted(true);
    } catch (error: any) {
      console.error("Submission error:", error);
      toast.error(error.message || "Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-col min-h-screen selection:bg-orange-100 selection:text-orange-900">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-36 pb-20 md:pt-48 md:pb-32 bg-slate-900 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-96 h-96 bg-orange-600 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2" />
          </div>
          
              <div className="text-center max-w-4xl mx-auto">
                <motion.h1 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 italic uppercase tracking-tighter leading-[0.9]"
                >
                {t("contactTitle")}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-lg md:text-xl text-slate-300 font-light max-w-2xl mx-auto leading-relaxed"
              >
                {t("contactSubtitle")}
              </motion.p>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-32 bg-stone-50">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
              
              {/* Sidebar Content */}
              <div className="lg:col-span-4 space-y-12">
                {/* Contact Cards */}
                <div className="space-y-6">
                  <h2 className={cn("text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-8", isRtl && "text-right")}>
                    Connect with us
                  </h2>
                    {contactInfo.map((info, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        viewport={{ once: true }}
                        className={cn("group flex gap-5 p-6 bg-white rounded-2xl border border-stone-200 shadow-sm hover:shadow-xl hover:border-orange-200 transition-all duration-500 min-w-0", isRtl && "flex-row-reverse text-right")}
                      >
                        <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 duration-500", info.color)}>
                          <info.icon className="w-6 h-6" />
                        </div>
                        <div className="flex flex-col justify-center min-w-0">
                          <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">{info.label}</p>
                          {info.href ? (
                            <a href={info.href} className="text-lg text-slate-900 font-bold hover:text-orange-600 transition-colors break-all">
                              {info.value}
                            </a>
                          ) : (
                            <p className="text-lg text-slate-900 font-bold break-all">{info.value}</p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                </div>

                {/* Trust Section */}
                <div className="space-y-8 bg-slate-900 p-8 rounded-3xl text-white relative overflow-hidden group">
                  <div className="relative z-10 space-y-8">
                    {trustBadges.map((badge, i) => (
                      <div key={i} className={cn("flex gap-4", isRtl && "flex-row-reverse text-right")}>
                        <div className="bg-orange-600/20 text-orange-500 p-2 rounded-lg h-fit">
                          <badge.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold mb-1">{badge.title}</h4>
                          <p className="text-xs text-slate-400 leading-relaxed">{badge.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Hexagon className={cn(
                    "absolute -bottom-10 -right-10 w-48 h-48 text-white/5 rotate-12 transition-transform group-hover:scale-125 duration-1000",
                    isRtl && "-left-10 -right-auto rotate-[-12deg]"
                  )} />
                </div>
              </div>

              {/* Main Form Section */}
              <div className="lg:col-span-8">
                <motion.div 
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white p-8 md:p-16 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-stone-100 relative"
                >
                  <AnimatePresence mode="wait">
                    {!submitted ? (
                      <motion.form 
                        key="form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-10" 
                        onSubmit={handleSubmit}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                          <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">{t("fullName")}</label>
                            <input 
                              required
                              name="full_name"
                              value={formData.full_name}
                              onChange={handleChange}
                              type="text" 
                              placeholder="John Doe"
                              className="w-full bg-stone-50 border-b-2 border-stone-200 px-1 py-4 text-slate-900 placeholder:text-stone-300 focus:outline-none focus:border-orange-600 transition-all font-medium text-lg"
                            />
                          </div>
                          <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">{t("emailAddress")}</label>
                            <input 
                              required
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              type="email" 
                              placeholder="john@company.com"
                              className="w-full bg-stone-50 border-b-2 border-stone-200 px-1 py-4 text-slate-900 placeholder:text-stone-300 focus:outline-none focus:border-orange-600 transition-all font-medium text-lg"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Industry / Project Type</label>
                          <select 
                            name="industry"
                            value={formData.industry}
                            onChange={handleChange}
                            className="w-full bg-stone-50 border-b-2 border-stone-200 px-1 py-4 text-slate-900 focus:outline-none focus:border-orange-600 transition-all font-medium text-lg appearance-none"
                          >
                            <option>{t("armyTactical")}</option>
                            <option>{t("industrialParts")}</option>
                            <option>{t("brandMerch")}</option>
                            <option>Other</option>
                          </select>
                        </div>

                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">{t("message")}</label>
                          <textarea 
                            required
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows={5}
                            placeholder="Tell us about your technical requirements..."
                            className="w-full bg-stone-50 border-b-2 border-stone-200 px-1 py-4 text-slate-900 placeholder:text-stone-300 focus:outline-none focus:border-orange-600 transition-all font-medium text-lg resize-none"
                          />
                        </div>

                        <button 
                          disabled={isSubmitting}
                          className="w-full group relative bg-slate-900 text-white font-black py-6 rounded-2xl overflow-hidden transition-all hover:shadow-2xl hover:shadow-orange-200 active:scale-[0.98]"
                        >
                          <div className="absolute inset-0 bg-orange-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                          <div className="relative flex items-center justify-center gap-4 text-lg uppercase tracking-widest italic">
                            {isSubmitting ? (
                              <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                              <>
                                {t("sendMessage")}
                                <Send className={cn("w-6 h-6 transition-transform group-hover:translate-x-2", isRtl && "rotate-180 group-hover:-translate-x-2")} />
                              </>
                            )}
                          </div>
                        </button>
                      </motion.form>
                    ) : (
                      <motion.div 
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20"
                      >
                        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
                          <CheckCircle2 className="w-12 h-12" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 mb-4 italic uppercase tracking-tighter">
                          {t("sendMessageSuccess")}
                        </h2>
                        <p className="text-slate-500 mb-10 max-w-sm mx-auto">
                          We've received your inquiry. One of our engineers will reach out within 24 hours.
                        </p>
                        <button 
                          onClick={() => setSubmitted(false)}
                          className="text-orange-600 font-bold hover:underline"
                        >
                          Send another message
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
