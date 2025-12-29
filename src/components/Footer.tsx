import { Hexagon, Linkedin, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-400 py-20 border-t border-stone-800" id="contact">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <div className="flex items-center gap-2 mb-6 text-white">
              <Hexagon className="w-6 h-6 text-orange-500" />
              <span className="text-xl font-semibold tracking-tight">RubberMfg</span>
            </div>
            <p className="text-stone-500 mb-6">
              Premium B2B manufacturing partner for global brands. Custom rubber solutions delivered with precision.
            </p>
            <div className="flex gap-4">
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

          <div>
            <h4 className="text-white font-medium mb-6">Collections</h4>
            <ul className="space-y-4">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Tactical & Army
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Promotional Keychains
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Bar & Hospitality
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Tech Accessories
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-6">Company</h4>
            <ul className="space-y-4">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Manufacturing Process
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Sustainability
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4" /> sales@rubbermfg.com
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4" /> +1 (555) 123-4567
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="w-4 h-4" /> 12 Industrial Way, Tech Park
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-stone-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>© 2024 RubberMfg Inc. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-white">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
