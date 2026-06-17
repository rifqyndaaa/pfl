import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans antialiased text-[#0F172A]">
      {/* LEFT SIDE - Brand showcase */}
      <div className="hidden lg:flex lg:flex-1 relative bg-slate-900 overflow-hidden flex-col justify-between p-12 text-white">
        {/* Subtle grid pattern accent */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35" />
        
        {/* Top brand header */}
        <div className="relative z-10 flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center font-bold text-white shadow-[0_0_20px_rgba(43,127,255,0.4)]">
            B
          </div>
          <span className="font-extrabold tracking-wider text-sm uppercase">BUIQ Platform</span>
        </div>

        {/* Middle graphics/features list */}
        <div className="relative z-10 my-auto max-w-md space-y-6">
          <h2 className="text-4xl font-extrabold leading-tight">
            Smart Fashion Management For Modern Boutique Business.
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Kelola inventaris produk, kelola pesanan pelanggan, pantau keuangan, dan kembangkan bisnis boutique Anda dalam satu dashboard terintegrasi.
          </p>

          <div className="space-y-3.5 pt-4">
            {[
              "Real-time CRM & Customer Tracking",
              "Advanced Order & Inventory Analytics",
              "Enterprise-grade Security & Fast Delivery"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-xs font-semibold text-slate-300">
                <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0">
                  ✓
                </div>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-slate-500 font-medium">
          © 2026 BUIQ. All rights reserved. Professional UI/UX Overhaul.
        </div>
      </div>

      {/* RIGHT SIDE - Authentication Forms */}
      <div className="w-full lg:w-[540px] flex flex-col justify-center px-6 sm:px-12 py-12 bg-white border-l border-slate-200/80">
        <div className="mx-auto w-full max-w-[360px] space-y-6">
          {/* Logo on small screens */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center font-bold text-white">
              B
            </div>
            <span className="font-extrabold tracking-wider text-sm uppercase text-slate-800">BUIQ</span>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
}