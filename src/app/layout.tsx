import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { VisualEditsMessenger } from "orchids-visual-edits";
import { LanguageProvider } from "@/lib/i18n";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Elastic - Custom B2B Manufacturing",
  description: "Premium B2B manufacturing partner for global brands. Custom rubber solutions delivered with precision.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth overflow-x-hidden">
      <body
        className={`${inter.variable} font-sans antialiased bg-stone-50 text-slate-800 selection:bg-orange-200 selection:text-orange-900 overflow-x-hidden w-full`}
      >
        <LanguageProvider>
          {children}
        </LanguageProvider>
        <VisualEditsMessenger />
      </body>
    </html>
  );
}
