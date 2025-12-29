import { Layers, Palette, ShieldCheck } from "lucide-react";

export function Features() {
  return (
    <section className="bg-white py-24 border-t border-stone-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="group">
            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3 tracking-tight">
              Custom Molds
            </h3>
            <p className="text-slate-500 leading-relaxed text-lg">
              We create proprietary aluminum and copper molds tailored to your exact 3D specifications and tolerances.
            </p>
          </div>
          <div className="group">
            <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Palette className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3 tracking-tight">
              Pantone Matching
            </h3>
            <p className="text-slate-500 leading-relaxed text-lg">
              Exact color reproduction. Our PVC and silicone mixing process ensures brand consistency across every batch.
            </p>
          </div>
          <div className="group">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3 tracking-tight">
              High Durability
            </h3>
            <p className="text-slate-500 leading-relaxed text-lg">
              Waterproof, heat-resistant, and flexible. Products built to withstand industrial use and outdoor elements.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
