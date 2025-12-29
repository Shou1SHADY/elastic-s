import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { VisualEditsMessenger } from "orchids-visual-edits";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "RubberMfg - Custom B2B Manufacturing",
  description: "Premium B2B manufacturing partner for global brands. Custom rubber solutions delivered with precision.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} font-sans antialiased bg-stone-50 text-slate-800 selection:bg-orange-200 selection:text-orange-900`}
      >
        {children}
        <VisualEditsMessenger />
      </body>
    </html>
  );
}
