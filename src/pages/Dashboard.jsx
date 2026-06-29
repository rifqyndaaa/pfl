import { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { ImSpinner2 } from "react-icons/im";
import { FaExclamationTriangle } from "react-icons/fa";

// ─── Inline SVG Icons ──────────────────────────────────────────────────────────
const Ico = ({ d, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);
const IWallet = () => <Ico d={["M21 7H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z", "M16 3l-4 4-4-4"]} />;
const ICard = () => <Ico d={["M21 4H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z", "M1 10h22"]} />;
const IShirt = () => <Ico d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z" />;
const ILamp = () => <Ico d={["M9 18h6", "M12 2l-4 8h8l-4-8z", "M12 10v8"]} />;
const IBall = () => <Ico d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z M2.1 12h19.8 M12 2c-4 6-4 14 0 20 M12 2c4 6 4 14 0 20" />;

// Helper to determine customer loyalty membership type dynamically from spent
const getMembershipType = (spent) => {
  const s = parseFloat(spent || 0);
  if (s >= 15000000) return "VIP";
  if (s >= 5000000) return "Gold";
  if (s >= 1500000) return "Silver";
  return "Basic";
};

// ─── Chart.js loader hook ──────────────────────────────────────────────────────
function useChart(ref, buildConfig, deps = []) {
  useEffect(() => {
    if (!ref.current) return;
    let chart;
    const tryBuild = () => {
      if (window.Chart) {
        chart = new window.Chart(ref.current, buildConfig());
      } else {
        setTimeout(tryBuild, 100);
      }
    };
    tryBuild();
    return () => chart?.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

// ─── Reusable chart components ─────────────────────────────────────────────────
function Sparkline({ data, color, height = 50 }) {
  const ref = useRef(null);
  useChart(ref, () => ({
    type: "line",
    data: {
      labels: data.map((_, i) => i),
      datasets: [{
        data, borderColor: color, borderWidth: 1.5, pointRadius: 0,
        fill: "origin", backgroundColor: color + "15", tension: 0.4
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
      scales: { x: { display: false }, y: { display: false } }
    },
  }), [data]);
  return <div style={{ position: "relative", height }}><canvas ref={ref} /></div>;
}

function CustomerStatusDonutChart({ active, vip, inactive }) {
  const ref = useRef(null);
  useChart(ref, () => ({
    type: "doughnut",
    data: {
      labels: ["Active", "VIP", "Inactive"],
      datasets: [{
        data: [active, vip, inactive],
        backgroundColor: ["#10B981", "#2B7FFF", "#94A3B8"],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "70%",
      plugins: {
        legend: { display: false },
        tooltip: { enabled: true }
      }
    },
  }), [active, vip, inactive]);
  return <div style={{ position: "relative", width: 110, height: 110 }}><canvas ref={ref} /></div>;
}

function RevenueBarChart({ monthlyData }) {
  const ref = useRef(null);
  useChart(ref, () => ({
    type: "bar",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [
        { label: "Revenue (Rp)", data: monthlyData, backgroundColor: "#2B7FFF", borderRadius: 4, barPercentage: 0.45 },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: "#94a3b8", font: { size: 10 } }, grid: { display: false }, border: { display: false } },
        y: { ticks: { color: "#94a3b8", font: { size: 10 }, callback: v => "Rp " + Math.round(v / 1000) + "k" }, grid: { color: "#f1f5f9" }, border: { display: false } },
      },
    },
  }), [monthlyData]);
  return <div style={{ position: "relative", height: 160 }}><canvas ref={ref} /></div>;
}

function MemberRegistrationTrendChart({ trendData }) {
  const ref = useRef(null);
  useChart(ref, () => ({
    type: "line",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [
        {
          label: "Registrations",
          data: trendData,
          borderColor: "#2B7FFF",
          backgroundColor: "rgba(43, 127, 255, 0.05)",
          borderWidth: 2,
          fill: true,
          tension: 0.35,
          pointBackgroundColor: "#2B7FFF",
          pointBorderColor: "#fff",
          pointBorderWidth: 1.5,
          pointRadius: 3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: "#94a3b8", font: { size: 9 } }, grid: { display: false }, border: { display: false } },
        y: { ticks: { color: "#94a3b8", font: { size: 9 }, stepSize: 1 }, grid: { color: "#f1f5f9" }, border: { display: false } }
      }
    }
  }), [trendData]);
  return <div style={{ position: "relative", height: 160 }}><canvas ref={ref} /></div>;
}

// ─── Layout primitives ─────────────────────────────────────────────────────────
const Card = ({ children, className = "" }) => (
  <div className={`bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md/5 transition-all ${className}`}>
    {children}
  </div>
);

const SectionTitle = ({ children, right }) => (
  <div className="flex justify-between items-center mb-4">
    <p className="text-xs font-bold text-slate-800 tracking-wider uppercase">{children}</p>
    {right}
  </div>
);

// ─── Main Component ────────────────────────────────────────────────────────────
export default function AnalyticsDashboard() {
  const [isVisible, setIsVisible] = useState(false);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all required data from Supabase
      const [ordersRes, productsRes, customersRes] = await Promise.all([
        supabase
          .from("orders")
          .select("*, customers(*), products(*)")
          .order("created_at", { ascending: false }),
        supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("customers")
          .select("*")
          .order("created_at", { ascending: false })
      ]);

      if (ordersRes.error) throw ordersRes.error;
      if (productsRes.error) throw productsRes.error;
      if (customersRes.error) throw customersRes.error;

      setOrders(ordersRes.data || []);
      setProducts(productsRes.data || []);
      setCustomers(customersRes.data || []);
      setError(null);
    } catch (err) {
      console.error("Dashboard data fetch error:", err);
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsVisible(true);
    if (!window.Chart) {
      const s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js";
      s.async = true;
      document.head.appendChild(s);
    }

    fetchDashboardData();
  }, []);

  // 1. Connect Dashboard statistics to existing Orders data
  const ordersStats = useMemo(() => {
    const total = orders.length;
    const completed = orders.filter((o) => o.status === "Completed").length;
    const pending = orders.filter((o) => o.status === "Pending").length;
    const revenue = orders.reduce((sum, o) => sum + parseFloat(o.total_price || 0), 0);
    return { total, completed, pending, revenue };
  }, [orders]);

  // 2. Connect Dashboard statistics to existing Products data
  const productsStats = useMemo(() => {
    const total = products.length;
    const available = products.filter((p) => p.status === "Available" || p.stock > 10).length;
    const lowStock = products.filter((p) => p.status === "Low Stock" || (p.stock > 0 && p.stock <= 10)).length;
    const inventoryValuation = products.reduce((sum, p) => sum + (parseFloat(p.price || 0) * parseInt(p.stock || 0)), 0);
    return { total, available, lowStock, inventoryValuation };
  }, [products]);

  // 3. Connect Dashboard statistics to existing Customers data
  const customersStats = useMemo(() => {
    const total = customers.length;
    const active = customers.filter((c) => c.status === "Active").length;
    const vip = customers.filter((c) => c.membership_tier === "Platinum" || c.membership_tier === "VIP" || c.status === "VIP").length;
    const inactive = customers.filter((c) => c.status === "Inactive").length;
    return { total, active, vip, inactive };
  }, [customers]);

  const membersStats = useMemo(() => {
    const total = customers.length;
    const vip = customers.filter((c) => c.membership_tier === "Platinum" || c.membership_tier === "VIP").length;

    // Filter by registration date (created_at field)
    const newThisMonth = customers.filter((c) => c.created_at && c.created_at.startsWith("2026-06")).length;
    const juneCount = customers.filter((c) => c.created_at && c.created_at.startsWith("2026-06")).length;
    const mayCount = customers.filter((c) => c.created_at && c.created_at.startsWith("2026-05")).length;
    const growthVal = mayCount === 0 ? juneCount * 100 : Math.round(((juneCount - mayCount) / mayCount) * 100);
    const growthStr = growthVal >= 0 ? `+${growthVal}%` : `${growthVal}%`;

    const trend = Array(12).fill(0);
    customers.forEach((c) => {
      if (c.created_at) {
        const month = new Date(c.created_at).getMonth();
        if (month >= 0 && month < 12) {
          trend[month] += 1;
        }
      }
    });

    return { total, vip, newThisMonth, growthStr, trend };
  }, [customers]);

  // 4. Revenue chart must be generated from actual order data grouped by month
  const monthlyRevenue = useMemo(() => {
    const revenueByMonth = Array(12).fill(0);
    orders.forEach((o) => {
      if (o.order_date) {
        const month = new Date(o.order_date).getMonth();
        if (month >= 0 && month < 12) {
          revenueByMonth[month] += parseFloat(o.total_price || 0);
        }
      }
    });
    return revenueByMonth;
  }, [orders]);

  // 5. Product category chart/widget using actual product categories
  const categoryStats = useMemo(() => {
    const counts = { Dress: 0, Shoes: 0, Bags: 0, Accessories: 0, Outer: 0 };
    products.forEach((p) => {
      const cat = p.category;
      if (cat === "Dress") counts.Dress += p.stock;
      else if (cat === "Shoes") counts.Shoes += p.stock;
      else if (cat === "Bag" || cat === "Bags") counts.Bags += p.stock;
      else if (cat === "Accessories") counts.Accessories += p.stock;
      else if (cat === "Outer") counts.Outer += p.stock;
    });

    return [
      { label: "Dress", val: `${counts.Dress} items`, icon: <IShirt />, bg: "bg-primary-light", tc: "text-primary" },
      { label: "Shoes", val: `${counts.Shoes} items`, icon: <IBall />, bg: "bg-emerald-50", tc: "text-emerald-600" },
      { label: "Bags", val: `${counts.Bags} items`, icon: <IWallet />, bg: "bg-purple-50", tc: "text-purple-600" },
      { label: "Accessories", val: `${counts.Accessories} items`, icon: <ILamp />, bg: "bg-amber-50", tc: "text-amber-600" },
      { label: "Outer", val: `${counts.Outer} items`, icon: <ICard />, bg: "bg-rose-50", tc: "text-rose-600" },
    ];
  }, [products]);

  // 7. Recent Orders widget using latest orders
  const recentOrders = useMemo(() => {
    return [...orders].slice(0, 5);
  }, [orders]);

  // 8. Low Stock Alert widget using products marked as Low Stock or Out of Stock
  const lowStockAlerts = useMemo(() => {
    return products
      .filter((p) => p.status === "Low Stock" || p.status === "Out of Stock" || p.stock <= 10)
      .sort((a, b) => a.stock - b.stock)
      .slice(0, 5);
  }, [products]);

  // 9. Top Selling Products widget based on order data
  const topSellingProducts = useMemo(() => {
    const counts = {};
    orders.forEach((o) => {
      const pName = o.products?.product_name || "Unknown Product";
      counts[pName] = (counts[pName] || 0) + parseInt(o.quantity || 1);
    });
    return Object.keys(counts)
      .map((name) => ({ name, count: counts[name] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [orders]);

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-3">
        <ImSpinner2 className="animate-spin text-primary text-2xl" />
        <span className="text-xs text-slate-500 font-semibold">Mengambil data analitik...</span>
      </div>
    );
  }

  return (
    <div className={`transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'} space-y-6`}>
      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-700 text-xs p-4 rounded-2xl font-medium flex items-center gap-2 animate-pulse">
          <FaExclamationTriangle className="shrink-0" />
          <span>Gagal memuat analitik: {error}</span>
        </div>
      )}

      {/* ── BOUTIQUE & LIFESTYLE HERO BANNER ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 rounded-3xl p-8 md:p-12 text-white border border-slate-850 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="relative z-10 max-w-xl space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 text-[10px] font-bold uppercase tracking-wider">
            ✨ Boutique & Lifestyle Management
          </span>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
            Elevate Retail Performance & Customer Experience
          </h1>
          <p className="text-slate-400 text-xs md:text-sm leading-relaxed max-w-lg">
            Pantau pesanan butik, analisis tren mode terbaru, kelola data pelanggan VIP, dan kembangkan bisnis ritel lifestyle Anda dalam satu dashboard cerdas.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap gap-3">
          <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 text-center min-w-[100px]">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Products</p>
            <p className="text-lg font-black text-white mt-1">{productsStats.total}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 text-center min-w-[100px]">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total VIPs</p>
            <p className="text-lg font-black text-emerald-400 mt-1">{customersStats.vip}</p>
          </div>
        </div>
      </div>

      {/* ── CATEGORY CARDS ── */}
      <div className="space-y-3">
        <p className="text-xs font-bold text-slate-800 tracking-wider uppercase">Boutique Categories</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categoryStats.map((cat, i) => (
            <div
              key={i}
              className="buiq-card buiq-card-hover group cursor-pointer flex flex-col justify-between aspect-[4/3] p-5 border border-slate-200/80 bg-white hover:border-primary/25 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className={`w-8 h-8 rounded-xl ${cat.bg} ${cat.tc} flex items-center justify-center font-bold text-xs`}>
                {cat.icon}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 tracking-tight">{cat.label}</p>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{cat.val}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── ROW 1: Greeting + 3 mini stat cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-primary-light border-primary/20 flex justify-between items-center p-6">
          <div>
            <p className="text-sm font-bold text-primary mb-1">
              BUIQ Overview 🛍️
            </p>
            <p className="text-xs text-primary/80 mb-4 leading-relaxed">
              Toko Anda memiliki total {ordersStats.total} orders terdaftar.<br />Valuasi inventori saat ini mencapai Rp {productsStats.inventoryValuation.toLocaleString()}.
            </p>
            <button className="text-xs px-4 py-1.5 rounded-full font-bold border border-primary text-primary bg-white hover:bg-primary hover:text-white transition-all cursor-pointer">
              BUIQ Active
            </button>
          </div>
        </Card>

        <Card>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Orders</p>
          <p className="text-2xl font-black text-slate-800 my-1">{ordersStats.total}</p>
          <Sparkline data={orders.slice(-10).map(o => parseFloat(o.total_price || 0))} color="#10B981" height={45} />
        </Card>

        <Card>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Pending Orders</p>
          <div className="flex items-baseline gap-2 my-1">
            <span className="text-2xl font-black text-slate-800">{ordersStats.pending}</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600">
              In progress
            </span>
          </div>
          <Sparkline data={orders.filter(o => o.status === "Pending").slice(-10).map(o => parseFloat(o.total_price || 0))} color="#EF4444" height={45} />
        </Card>

        <Card>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Valuation</p>
          <p className="text-lg font-black text-slate-800 my-1">Rp {productsStats.inventoryValuation.toLocaleString()}</p>
          <div className="text-[10px] text-slate-400 font-medium mt-2">
            Dari {productsStats.total} total produk
          </div>
        </Card>
      </div>

      {/* ── ROW 2: Revenue chart + Donut + Profile Report ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Revenue chart */}
        <Card className="md:col-span-2">
          <SectionTitle right={
            <div className="flex gap-3 text-[10px] font-semibold">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-primary inline-block" />
                <span className="text-slate-500">2026 Monthly Revenue</span>
              </span>
            </div>
          }>Monthly Revenue (Rp)</SectionTitle>
          <RevenueBarChart monthlyData={monthlyRevenue} />
        </Card>

        {/* Customer status donut chart */}
        <Card className="flex flex-col items-center justify-between">
          <div className="flex justify-between w-full items-center mb-2">
            <p className="text-xs font-bold text-slate-800">Customer Status</p>
            <span className="text-[10px] text-slate-400 font-medium">Actual Segment</span>
          </div>
          <div className="relative flex items-center justify-center my-3">
            <CustomerStatusDonutChart
              active={customersStats.active}
              vip={customersStats.vip}
              inactive={customersStats.inactive}
            />
            <div className="absolute text-center">
              <p className="text-xl font-black text-slate-800">{customersStats.total}</p>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Customers</p>
            </div>
          </div>
          <div className="flex justify-between w-full mt-4 pt-3 border-t border-slate-100 text-[10px]">
            <div className="text-center flex-1">
              <p className="text-slate-400 font-medium">Active</p>
              <p className="font-bold text-emerald-600 mt-0.5">{customersStats.active}</p>
            </div>
            <div className="text-center flex-1 border-x border-slate-100">
              <p className="text-slate-400 font-medium">VIP</p>
              <p className="font-bold text-primary mt-0.5">{customersStats.vip}</p>
            </div>
            <div className="text-center flex-1">
              <p className="text-slate-400 font-medium">Inactive</p>
              <p className="font-bold text-slate-500 mt-0.5">{customersStats.inactive}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* ── MEMBER & LOYALTY INTEGRATION ── */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-xs font-bold text-slate-800 tracking-wider uppercase">Member & Loyalty Overview</p>
          <span className="text-[10px] text-slate-400 font-bold uppercase">Dynamic CRM Sync</span>
        </div>

        {/* Member Widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Members</p>
            <div className="flex justify-between items-baseline mt-1">
              <p className="text-2xl font-black text-slate-800">{membersStats.total}</p>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-primary-light text-primary border border-primary/10">Active Loyalty</span>
            </div>
          </Card>
          <Card>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">VIP Members</p>
            <div className="flex justify-between items-baseline mt-1">
              <p className="text-2xl font-black text-purple-700">{membersStats.vip}</p>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 border border-purple-100 font-extrabold">Top Tier</span>
            </div>
          </Card>
          <Card>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">New Members This Month</p>
            <div className="flex justify-between items-baseline mt-1">
              <p className="text-2xl font-black text-emerald-600">{membersStats.newThisMonth}</p>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">June 2026</span>
            </div>
          </Card>
          <Card>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Membership Growth</p>
            <div className="flex justify-between items-baseline mt-1">
              <p className="text-2xl font-black text-slate-800">{membersStats.growthStr}</p>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 font-extrabold">MoM Registration</span>
            </div>
          </Card>
        </div>

        {/* Member Charts and Callouts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="md:col-span-2">
            <SectionTitle right={
              <div className="flex gap-3 text-[10px] font-semibold">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-primary inline-block" />
                  <span className="text-slate-500">2026 Registration Trend</span>
                </span>
              </div>
            }>Member Registration Trend</SectionTitle>
            <MemberRegistrationTrendChart trendData={membersStats.trend} />
          </Card>

          <Card className="bg-gradient-to-br from-primary to-primary-hover border-transparent text-white flex flex-col justify-between p-6">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white border border-white/20 text-[9px] font-bold uppercase tracking-wider">
                👑 Boutique Club
              </span>
              <h4 className="text-lg font-black leading-tight tracking-tight">Enterprise Member Retention</h4>
              <p className="text-white/85 text-[11px] leading-relaxed">
                Kelola status keanggotaan dan peningkatan tingkat (tiering) pelanggan loyal secara instan untuk melacak valuasi belanja butik dan retensi pelanggan.
              </p>
            </div>
            <Link
              to="/member-management"
              className="mt-6 w-full text-center py-2.5 bg-white text-primary font-bold text-xs rounded-xl shadow-lg shadow-primary-hover/10 hover:shadow-xl transition-all cursor-pointer block"
            >
              Kelola Member
            </Link>
          </Card>
        </div>
      </div>

      {/* ── ROW 3: Recent Orders + Low Stock Alerts + Top Selling Products ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Recent Orders Widget */}
        <Card>
          <SectionTitle right={<span className="text-[10px] text-slate-400 font-semibold font-bold">Latest 5</span>}>
            Recent Orders
          </SectionTitle>
          <div className="flex flex-col gap-3">
            {recentOrders.map((o) => (
              <div key={o.id} className="flex items-center justify-between text-xs py-1 border-b border-slate-50 last:border-0">
                <div className="flex items-center gap-2.5">
                  <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(o.customers?.email || "default")}`} alt={o.customers?.full_name} className="w-8 h-8 rounded-full object-cover shadow-sm border border-slate-100" />
                  <div>
                    <p className="font-bold text-slate-800">{o.customers?.full_name || "Unknown"}</p>
                    <p className="text-[10px] text-slate-400">{o.products?.product_name || "Deleted Product"}</p>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <p className="font-bold text-primary">Rp {parseFloat(o.total_price || 0).toLocaleString()}</p>
                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider ${o.status === "Completed" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : o.status === "Pending" ? "bg-amber-50 text-amber-700 border border-amber-100" : "bg-rose-50 text-rose-700 border border-rose-100"
                    }`}>{o.status}</span>
                </div>
              </div>
            ))}
            {recentOrders.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-4">No recent orders</p>
            )}
          </div>
        </Card>

        {/* Low Stock Alerts Widget */}
        <Card>
          <SectionTitle right={<span className="text-[10px] text-rose-500 font-semibold font-bold">Alerts</span>}>
            Low Stock Alerts
          </SectionTitle>
          <div className="flex flex-col gap-3">
            {lowStockAlerts.map((p) => (
              <div key={p.id} className="flex items-center justify-between text-xs py-1 border-b border-slate-50 last:border-0">
                <div className="flex items-center gap-2.5">
                  <img src={p.image_url} alt={p.product_name} className="w-8 h-8 rounded-xl object-cover shadow-sm border border-slate-100" />
                  <div>
                    <p className="font-bold text-slate-800">{p.product_name}</p>
                    <p className="text-[10px] text-slate-400">{p.product_code} • {p.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.stock === 0 ? "bg-rose-50 text-rose-600 border border-rose-100" : "bg-amber-50 text-amber-600 border border-amber-100"
                    }`}>
                    {p.stock} pcs left
                  </span>
                </div>
              </div>
            ))}
            {lowStockAlerts.length === 0 && (
              <p className="text-xs text-emerald-600 text-center py-4 font-bold">All products fully stocked! 🎉</p>
            )}
          </div>
        </Card>

        {/* Top Selling Products Widget */}
        <Card>
          <SectionTitle right={<span className="text-[10px] text-emerald-500 font-semibold font-bold">By Quantity</span>}>
            Top Selling Products
          </SectionTitle>
          <div className="flex flex-col gap-3">
            {topSellingProducts.map((p, i) => (
              <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-slate-50 last:border-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-primary-light text-primary flex items-center justify-center font-black text-xs">
                    #{i + 1}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{p.name}</p>
                    <p className="text-[10px] text-slate-400">Popular items</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-700">{p.count} units</span>
                </div>
              </div>
            ))}
            {topSellingProducts.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-4">No sales data yet</p>
            )}
          </div>
        </Card>
      </div>

    </div>
  );
}