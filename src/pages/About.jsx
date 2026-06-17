import {
  FaReact,
  FaServer,
  FaBullseye,
  FaChartLine,
  FaTasks,
  FaCogs,
  FaUsers,
  FaDatabase,
  FaRoute,
  FaShieldAlt,
  FaInfoCircle,
  FaLayerGroup,
  FaInfo,
} from "react-icons/fa";
import { SiVite, SiTailwindcss, SiTypescript } from "react-icons/si";
import Card from "../components/Card";

export default function AboutBUIQ() {
  return (
    <div className="space-y-8 pb-12">
      {/* HERO SECTION */}
      <div className="relative overflow-hidden bg-slate-900 rounded-3xl p-8 md:p-12 text-white border border-slate-800 shadow-xl">
        {/* Decorative Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-25" />
        
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 text-[10px] font-bold uppercase tracking-wider">
            <FaInfoCircle size={10} /> About BUIQ
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Smart Fashion Management For Modern Boutique Business.
          </h1>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            BUIQ adalah platform manajemen butik terpadu yang dirancang khusus untuk mempermudah operasional harian, melacak inventaris, mengelola relasi pelanggan, serta menganalisis pertumbuhan bisnis Anda secara real-time.
          </p>
        </div>
      </div>

      {/* STATISTICS SECTION */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Orders", val: "1,284+", desc: "Pesanan terproses", color: "text-primary", bg: "bg-primary-light" },
          { label: "Total Products", val: "320+", desc: "Produk aktif", color: "text-emerald-500", bg: "bg-emerald-50" },
          { label: "Total Customers", val: "540+", desc: "Pelanggan terdaftar", color: "text-purple-500", bg: "bg-purple-50" },
          { label: "Active Users", val: "99.9%", desc: "Uptime layanan", color: "text-amber-500", bg: "bg-amber-50" },
        ].map((s, i) => (
          <Card key={i}>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{s.label}</p>
            <p className="text-2xl font-black text-slate-800 mt-1">{s.val}</p>
            <p className="text-[10px] text-slate-500 font-medium mt-1">{s.desc}</p>
          </Card>
        ))}
      </div>

      {/* COMPANY OVERVIEW CARD */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-primary-light text-primary flex items-center justify-center">
            <FaLayerGroup size={14} />
          </div>
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Company Overview</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-800">Apa itu BUIQ?</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              BUIQ lahir dari kebutuhan mendesak pemilik butik modern yang menginginkan antarmuka yang sangat indah, interaktif, dan mudah digunakan untuk memantau siklus bisnis mereka. Platform ini mengintegrasikan seluruh lini operasional dalam satu layar.
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-800">Nilai Bisnis & Sasaran Utama</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Tujuan kami adalah mengurangi kesalahan pencatatan transaksi manual hingga 95% dan meningkatkan efisiensi pengelolaan stok produk. Melalui analisis performa mingguan, pemilik bisnis dapat mengambil keputusan berbasis data yang akurat.
            </p>
          </div>
        </div>
      </Card>

      {/* MISSION & VISION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6 space-y-3">
          <div className="flex items-center gap-2 text-primary font-bold">
            <FaBullseye size={14} />
            <span className="text-xs uppercase tracking-wider">Misi Kami</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Menyediakan teknologi manajemen butik terbaik dengan pengalaman pengguna (UX) berkualitas dunia demi mempercepat digitalisasi sektor fesyen lokal.
          </p>
        </Card>
        <Card className="p-6 space-y-3">
          <div className="flex items-center gap-2 text-emerald-600 font-bold">
            <FaChartLine size={14} />
            <span className="text-xs uppercase tracking-wider">Visi Kami</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Menjadi standar global sistem manajemen operasional ritel butik modern yang dikenal karena estetika, kecepatan, dan efisiensi platform.
          </p>
        </Card>
      </div>

      {/* FEATURES SECTION */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fitur Unggulan Platform</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: "Dashboard Analytics", desc: "Pemantauan visual penjualan, pendapatan kotor, dan pertumbuhan mingguan lewat grafik interaktif.", icon: <FaChartLine /> },
            { title: "Order Management", desc: "Kelola status pesanan dari pembuatan awal, pemrosesan pembayaran, hingga status barang terkirim.", icon: <FaTasks /> },
            { title: "Product Management", desc: "Katalog produk pakaian terperinci, kategori, manajemen inventaris stok, dan status ketersediaan barang.", icon: <FaCogs /> },
            { title: "Customer Management", desc: "Kelola data kontak pelanggan lengkap dengan riwayat nilai belanja dan status eksklusivitas VIP.", icon: <FaUsers /> },
            { title: "Reporting System", desc: "Unduh dan cetak data laporan keuangan ringkas untuk keperluan evaluasi bulanan bisnis.", icon: <FaDatabase /> },
            { title: "CRM Features", desc: "Fitur manajemen relasi pelanggan yang meningkatkan loyalitas pembeli secara cerdas.", icon: <FaShieldAlt /> },
          ].map((f, i) => (
            <Card key={i} className="p-5 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-primary-light text-primary flex items-center justify-center text-sm">
                {f.icon}
              </div>
              <h3 className="text-xs font-bold text-slate-800">{f.title}</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">{f.desc}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* TECHNOLOGY STACK SECTION */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Teknologi yang Digunakan</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { name: "React", desc: "Library UI Utama", icon: <FaReact className="text-sky-400" /> },
            { name: "TypeScript", desc: "Keamanan Tipe Data", icon: <SiTypescript className="text-blue-600" /> },
            { name: "Vite", desc: "Pembangun Build Kilat", icon: <SiVite className="text-amber-500" /> },
            { name: "Tailwind CSS", desc: "Styling CSS Responsif", icon: <SiTailwindcss className="text-teal-400" /> },
            { name: "TanStack Table", desc: "Tabel Data Fleksibel", icon: <FaDatabase className="text-rose-500" /> },
            { name: "React Router", desc: "Navigasi SPA Cepat", icon: <FaRoute className="text-red-500" /> },
          ].map((tech, i) => (
            <Card key={i} className="p-4 text-center space-y-2">
              <div className="text-2xl flex justify-center">{tech.icon}</div>
              <h3 className="text-xs font-bold text-slate-800">{tech.name}</h3>
              <p className="text-[10px] text-slate-400 font-semibold uppercase">{tech.desc}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* SYSTEM ARCHITECTURE SECTION */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-primary-light text-primary flex items-center justify-center">
            <FaServer size={14} />
          </div>
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">System Architecture</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { step: "1. Frontend Layer", desc: "React SPA dengan optimasi bundle Vite, memastikan halaman termuat di bawah 1 detik." },
            { step: "2. Components Layer", desc: "Library komponen UI kustom reusable, dipadukan dengan standardisasi Shadcn UI." },
            { step: "3. Data Layer", desc: "State management lokal React yang efisien terintegrasi hooks dinamis." },
            { step: "4. API Layer", desc: "Konektivitas REST API yang andal menggunakan Axios Client yang optimal." },
          ].map((arch, i) => (
            <div key={i} className="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-1.5">
              <h3 className="text-xs font-bold text-slate-800">{arch.step}</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">{arch.desc}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* DEVELOPER INFORMATION SECTION */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
            <FaInfo size={12} />
          </div>
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Developer & System Info</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <p className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Project Name</p>
            <p className="text-slate-800 font-bold mt-0.5">BUIQ Platform</p>
          </div>
          <div>
            <p className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Version</p>
            <p className="text-slate-800 font-bold mt-0.5">v1.0.0-production</p>
          </div>
          <div>
            <p className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Build Information</p>
            <p className="text-slate-800 font-bold mt-0.5">React + Vite SPA</p>
          </div>
          <div>
            <p className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Last Update</p>
            <p className="text-slate-800 font-bold mt-0.5">June 2026</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
