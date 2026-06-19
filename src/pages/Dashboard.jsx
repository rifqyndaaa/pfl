import { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";

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

// ─── Initial Fallback Data Generators ──────────────────────────────────────────
const generateOrders = () => {
  const statuses = ["Pending", "Completed", "Cancelled"];
  const customers = [
    { id: 1, name: "Alya Putri", avatar: "https://i.pravatar.cc/150?img=1", product: "Silk Midi Dress" },
    { id: 2, name: "Rizky Pratama", avatar: "https://i.pravatar.cc/150?img=2", product: "Oversized Blazer" },
    { id: 3, name: "Nadia Azzahra", avatar: "https://i.pravatar.cc/150?img=3", product: "Pleated Skirt" },
    { id: 4, name: "Kevin Wijaya", avatar: "https://i.pravatar.cc/150?img=4", product: "Wide Leg Pants" },
    { id: 5, name: "Salsa Nabila", avatar: "https://i.pravatar.cc/150?img=5", product: "Knit Sweater" },
  ];
  const orders = [];
  for (let i = 1; i <= 30; i++) {
    const cust = customers[i % customers.length];
    orders.push({
      orderId: i,
      customerId: cust.id,
      customerName: cust.name,
      customerAvatar: cust.avatar,
      product: cust.product,
      status: statuses[i % 3],
      totalPrice: Math.floor(150000 + Math.random() * 1500000),
      orderDate: `2026-${String(Math.floor(1 + Math.random() * 12)).padStart(2, "0")}-${String(Math.floor(1 + Math.random() * 28)).padStart(2, "0")}`,
    });
  }
  return orders;
};

const generateProducts = () => {
  const categories = ["Dress", "Shoes", "Bag", "Accessories", "Outer"];
  const statuses = ["Available", "Low Stock", "Out of Stock"];
  const names = [
    "Silk Dress", "Nike Sneakers", "Leather Bag", "Oversized Hoodie",
    "Classic Watch", "Cargo Pants", "Denim Jacket", "Canvas Shoes"
  ];
  const images = [
    "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=200",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200",
    "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=200",
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200",
  ];
  const products = [];
  for (let i = 1; i <= 30; i++) {
    const status = statuses[i % 3];
    products.push({
      productId: i,
      productName: names[i % names.length],
      category: categories[i % categories.length],
      status: status,
      stock: status === "Out of Stock" ? 0 : status === "Low Stock" ? Math.floor(2 + Math.random() * 8) : Math.floor(15 + Math.random() * 70),
      price: Math.floor(100000 + Math.random() * 1500000),
      image: images[i % images.length],
      sku: `PRD-${String(i).padStart(4, "0")}`,
    });
  }
  return products;
};

const generateCustomers = () => {
  const names = [
    "Alya Putri", "Rizky Pratama", "Nadia Azzahra", "Fajar Ramadhan",
    "Citra Lestari", "Kevin Wijaya", "Dinda Maharani", "Raka Saputra",
    "Salsa Nabila", "Andi Firmansyah",
  ];
  const statuses = ["Active", "VIP", "Inactive"];
  const images = [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
  ];
  const customers = [];
  for (let i = 1; i <= 30; i++) {
    customers.push({
      customerId: i,
      customerName: names[i % names.length],
      email: `customer${i}@gmail.com`,
      status: statuses[i % 3],
      totalOrders: Math.floor(1 + Math.random() * 50),
      totalSpent: Math.floor(500000 + Math.random() * 10000000),
      image: images[i % images.length],
      customerCode: `CUST-${String(i).padStart(4, "0")}`,
    });
  }
  return customers;
};

const generateMembers = () => {
  const names = [
    "Alya Putri", "Rizky Pratama", "Nadia Azzahra", "Fajar Ramadhan",
    "Citra Lestari", "Kevin Wijaya", "Dinda Maharani", "Raka Saputra",
    "Salsa Nabila", "Andi Firmansyah",
    "Budi Santoso", "Siti Aminah", "Eko Prasetyo", "Dewi Lestari", "Rian Hidayat"
  ];
  const membershipTypes = ["Basic", "Silver", "Gold", "VIP"];
  const statuses = ["Active", "Inactive", "Suspended"];
  const images = [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
  ];
  const phonePrefixes = ["0812", "0813", "0821", "0857", "0878"];

  const members = [];
  for (let i = 1; i <= 15; i++) {
    const name = names[i - 1];
    const type = membershipTypes[i % 4];
    const status = statuses[i % 3];
    const monthStr = String(Math.floor(1 + ((i - 1) % 6))).padStart(2, "0");
    const dayStr = String(1 + (i * 3) % 27).padStart(2, "0");

    members.push({
      memberId: `MEM-${String(i).padStart(4, "0")}`,
      fullName: name,
      email: `${name.toLowerCase().replace(/\s+/g, "")}@gmail.com`,
      phone: `${phonePrefixes[i % phonePrefixes.length]}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(100 + Math.random() * 905)}`,
      membershipType: type,
      status: status,
      joinDate: `2026-${monthStr}-${dayStr}`,
      totalOrders: Math.floor(2 + (i * 3) % 15),
      totalSpending: Math.floor(250000 + (i * 650000) % 6000000),
      image: images[i % images.length]
    });
  }
  return members;
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

  // Initialize data sources from localStorage or dynamic generators fallback
  const [orders, setOrders] = useState(() => {
    const stored = localStorage.getItem("buiq_orders");
    if (stored) return JSON.parse(stored);
    const initial = generateOrders();
    localStorage.setItem("buiq_orders", JSON.stringify(initial));
    return initial;
  });

  const [products, setProducts] = useState(() => {
    const stored = localStorage.getItem("buiq_products");
    if (stored) return JSON.parse(stored);
    const initial = generateProducts();
    localStorage.setItem("buiq_products", JSON.stringify(initial));
    return initial;
  });

  const [customers, setCustomers] = useState(() => {
    const stored = localStorage.getItem("buiq_customers");
    if (stored) return JSON.parse(stored);
    const initial = generateCustomers();
    localStorage.setItem("buiq_customers", JSON.stringify(initial));
    return initial;
  });

  const [members, setMembers] = useState(() => {
    const stored = localStorage.getItem("buiq_members");
    if (stored) return JSON.parse(stored);
    const initial = generateMembers();
    localStorage.setItem("buiq_members", JSON.stringify(initial));
    return initial;
  });

  useEffect(() => {
    setIsVisible(true);
    if (!window.Chart) {
      const s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js";
      s.async = true;
      document.head.appendChild(s);
    }

    // Storage event listener to keep dashboard synced if orders/products change
    const syncData = () => {
      const storedOrders = localStorage.getItem("buiq_orders");
      if (storedOrders) setOrders(JSON.parse(storedOrders));
      const storedProducts = localStorage.getItem("buiq_products");
      if (storedProducts) setProducts(JSON.parse(storedProducts));
      const storedCustomers = localStorage.getItem("buiq_customers");
      if (storedCustomers) setCustomers(JSON.parse(storedCustomers));
      const storedMembers = localStorage.getItem("buiq_members");
      if (storedMembers) setMembers(JSON.parse(storedMembers));
    };

    window.addEventListener("storage", syncData);
    // Sync on focus (since SPA navigation changes component mounting)
    syncData();

    return () => window.removeEventListener("storage", syncData);
  }, []);

  // 1. Connect Dashboard statistics to existing Orders data
  const ordersStats = useMemo(() => {
    const total = orders.length;
    const completed = orders.filter((o) => o.status === "Completed").length;
    const pending = orders.filter((o) => o.status === "Pending").length;
    const revenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
    return { total, completed, pending, revenue };
  }, [orders]);

  // 2. Connect Dashboard statistics to existing Products data
  const productsStats = useMemo(() => {
    const total = products.length;
    const available = products.filter((p) => p.status === "Available" || p.stock > 10).length;
    const lowStock = products.filter((p) => p.status === "Low Stock" || (p.stock > 0 && p.stock <= 10)).length;
    const inventoryValuation = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
    return { total, available, lowStock, inventoryValuation };
  }, [products]);

  // 3. Connect Dashboard statistics to existing Customers data
  const customersStats = useMemo(() => {
    const total = customers.length;
    const active = customers.filter((c) => c.status === "Active").length;
    const vip = customers.filter((c) => c.status === "VIP").length;
    const inactive = customers.filter((c) => c.status === "Inactive").length;
    return { total, active, vip, inactive };
  }, [customers]);

  const membersStats = useMemo(() => {
    const total = members.length;
    const vip = members.filter((m) => m.membershipType === "VIP").length;
    const newThisMonth = members.filter((m) => m.joinDate && m.joinDate.startsWith("2026-06")).length;

    const juneCount = members.filter((m) => m.joinDate && m.joinDate.startsWith("2026-06")).length;
    const mayCount = members.filter((m) => m.joinDate && m.joinDate.startsWith("2026-05")).length;
    const growthVal = mayCount === 0 ? juneCount * 100 : Math.round(((juneCount - mayCount) / mayCount) * 100);
    const growthStr = growthVal >= 0 ? `+${growthVal}%` : `${growthVal}%`;

    const trend = Array(12).fill(0);
    members.forEach((m) => {
      if (m.joinDate) {
        const month = parseInt(m.joinDate.split("-")[1], 10) - 1;
        if (month >= 0 && month < 12) {
          trend[month] += 1;
        }
      }
    });

    return { total, vip, newThisMonth, growthStr, trend };
  }, [members]);

  // 4. Revenue chart must be generated from actual order data grouped by month
  const monthlyRevenue = useMemo(() => {
    const revenueByMonth = Array(12).fill(0);
    orders.forEach((o) => {
      if (o.orderDate) {
        const month = parseInt(o.orderDate.split("-")[1], 10) - 1;
        if (month >= 0 && month < 12) {
          revenueByMonth[month] += o.totalPrice;
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
    return [...orders]
      .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate) || b.orderId - a.orderId)
      .slice(0, 5);
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
      counts[o.product] = (counts[o.product] || 0) + 1;
    });
    return Object.keys(counts)
      .map((name) => ({ name, count: counts[name] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [orders]);

  return (
    <div className={`transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'} space-y-6`}>

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
          <Sparkline data={orders.slice(-10).map(o => o.totalPrice)} color="#10B981" height={45} />
        </Card>

        <Card>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Pending Orders</p>
          <div className="flex items-baseline gap-2 my-1">
            <span className="text-2xl font-black text-slate-800">{ordersStats.pending}</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600">
              In progress
            </span>
          </div>
          <Sparkline data={orders.filter(o => o.status === "Pending").slice(-10).map(o => o.totalPrice)} color="#EF4444" height={45} />
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
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">MoM Registration</span>
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
          <SectionTitle right={<span className="text-[10px] text-slate-400 font-semibold">Latest 5</span>}>
            Recent Orders
          </SectionTitle>
          <div className="flex flex-col gap-3">
            {recentOrders.map((o) => (
              <div key={o.orderId} className="flex items-center justify-between text-xs py-1 border-b border-slate-50 last:border-0">
                <div className="flex items-center gap-2.5">
                  <img src={o.customerAvatar} alt={o.customerName} className="w-8 h-8 rounded-full object-cover shadow-sm" />
                  <div>
                    <p className="font-bold text-slate-800">{o.customerName}</p>
                    <p className="text-[10px] text-slate-400">{o.product}</p>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <p className="font-bold text-primary">Rp {o.totalPrice.toLocaleString()}</p>
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
          <SectionTitle right={<span className="text-[10px] text-rose-500 font-semibold">Alerts</span>}>
            Low Stock Alerts
          </SectionTitle>
          <div className="flex flex-col gap-3">
            {lowStockAlerts.map((p) => (
              <div key={p.productId} className="flex items-center justify-between text-xs py-1 border-b border-slate-50 last:border-0">
                <div className="flex items-center gap-2.5">
                  <img src={p.image} alt={p.productName} className="w-8 h-8 rounded-xl object-cover shadow-sm border border-slate-100" />
                  <div>
                    <p className="font-bold text-slate-800">{p.productName}</p>
                    <p className="text-[10px] text-slate-400">{p.sku} • {p.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.stock === 0 ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"
                    }`}>
                    {p.stock} pcs left
                  </span>
                </div>
              </div>
            ))}
            {lowStockAlerts.length === 0 && (
              <p className="text-xs text-emerald-600 text-center py-4">All products fully stocked! 🎉</p>
            )}
          </div>
        </Card>

        {/* Top Selling Products Widget */}
        <Card>
          <SectionTitle right={<span className="text-[10px] text-emerald-500 font-semibold">By Quantity</span>}>
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
                  <span className="text-xs font-bold text-slate-700">{p.count} sales</span>
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