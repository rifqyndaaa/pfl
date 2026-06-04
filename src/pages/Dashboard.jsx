import { useState, useEffect, useRef } from "react";

// ─── Inline SVG Icons ──────────────────────────────────────────────────────────
const Ico = ({ d, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);
const ISend   = () => <Ico d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />;
const IWallet = () => <Ico d={["M21 7H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z","M16 3l-4 4-4-4"]} />;
const IRefund = () => <Ico d="M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />;
const ICard   = () => <Ico d={["M21 4H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z","M1 10h22"]} />;
const ICoffee = () => <Ico d={["M18 8h1a4 4 0 0 1 0 8h-1","M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z","M6 1v3M10 1v3M14 1v3"]} />;
const IMobile = () => <Ico d={["M17 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z","M12 18h.01"]} />;
const IShirt  = () => <Ico d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z" />;
const ILamp   = () => <Ico d={["M9 18h6","M12 2l-4 8h8l-4-8z","M12 10v8"]} />;
const IBall   = () => <Ico d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z M2.1 12h19.8 M12 2c-4 6-4 14 0 20 M12 2c4 6 4 14 0 20" />;
const IFile   = () => <Ico d={["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z","M14 2v6h6"]} />;
const ITrend  = () => <Ico d="M23 6l-9.5 9.5-5-5L1 18 M17 6h6v6" />;

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
      datasets: [{ data, borderColor: color, borderWidth: 1.5, pointRadius: 0,
        fill: "origin", backgroundColor: color + "30", tension: 0.4 }],
    },
    options: { responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
      scales: { x: { display: false }, y: { display: false } } },
  }), []);
  return <div style={{ position: "relative", height }}><canvas ref={ref} /></div>;
}

function DonutChart({ value, size = 80, cutout = "70%", color = "#3b82f6" }) {
  const ref = useRef(null);
  useChart(ref, () => ({
    type: "doughnut",
    data: { datasets: [{ data: [value, 100 - value],
      backgroundColor: [color, "#e0e7ff"], borderWidth: 0 }] },
    options: { responsive: true, maintainAspectRatio: false, cutout,
      plugins: { legend: { display: false }, tooltip: { enabled: false } } },
  }), []);
  return <div style={{ position: "relative", width: size, height: size }}><canvas ref={ref} /></div>;
}

function RevenueBarChart() {
  const ref = useRef(null);
  useChart(ref, () => ({
    type: "bar",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      datasets: [
        { label: "2024", data: [65,72,58,80,75,90,85], backgroundColor: "#3b82f6", borderRadius: 4, barPercentage: 0.45 },
        { label: "2023", data: [45,55,42,60,58,70,65], backgroundColor: "#bfdbfe", borderRadius: 4, barPercentage: 0.45 },
      ],
    },
    options: { responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: "#94a3b8", font: { size: 10 } }, grid: { display: false }, border: { display: false } },
        y: { ticks: { color: "#94a3b8", font: { size: 10 }, callback: v => v + "k" }, grid: { color: "#f1f5f9" }, border: { display: false } },
      },
    },
  }), []);
  return <div style={{ position: "relative", height: 160 }}><canvas ref={ref} /></div>;
}

function IncomeAreaChart() {
  const ref = useRef(null);
  useChart(ref, () => ({
    type: "line",
    data: {
      labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul"],
      datasets: [{
        data: [30,55,38,65,42,70,60],
        borderColor: "#3b82f6", borderWidth: 2, pointRadius: 0,
        fill: "origin", backgroundColor: "#3b82f622", tension: 0.4,
      }],
    },
    options: { responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: "#94a3b8", font: { size: 10 } }, grid: { display: false }, border: { display: false } },
        y: { display: false },
      },
    },
  }), []);
  return <div style={{ position: "relative", height: 120 }}><canvas ref={ref} /></div>;
}

function RevMiniBar() {
  const ref = useRef(null);
  useChart(ref, () => ({
    type: "bar",
    data: {
      labels: ["M","T","W","T","F","S"],
      datasets: [{ data: [40,70,55,85,65,90],
        backgroundColor: ["#bfdbfe","#bfdbfe","#bfdbfe","#bfdbfe","#3b82f6","#3b82f6"],
        borderRadius: 3, barPercentage: 0.6 }],
    },
    options: { responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
      scales: {
        x: { ticks: { color: "#94a3b8", font: { size: 9 } }, grid: { display: false }, border: { display: false } },
        y: { display: false },
      },
    },
  }), []);
  return <div style={{ position: "relative", height: 60 }}><canvas ref={ref} /></div>;
}

// ─── Layout primitives ─────────────────────────────────────────────────────────
const Card = ({ children, style = {} }) => (
  <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e8eaf0", padding: 16, ...style }}>
    {children}
  </div>
);

const SectionTitle = ({ children, right }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
    <p style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>{children}</p>
    {right}
  </div>
);

const tabStyle = (active) => ({
  fontSize: 12, padding: "5px 14px", borderRadius: 20, cursor: "pointer", fontWeight: 600,
  border: active ? "none" : "1px solid #e2e8f0",
  background: active ? "#eff6ff" : "transparent",
  color: active ? "#1d4ed8" : "#64748b",
});

// ─── Main Component ────────────────────────────────────────────────────────────
export default function AnalyticsDashboard() {
  const [isVisible, setIsVisible] = useState(false);
  const [incomeTab, setIncomeTab] = useState("Income");
  const [browserTab, setBrowserTab] = useState("Income");

  useEffect(() => {
    setIsVisible(true);
    if (!window.Chart) {
      const s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js";
      s.async = true;
      document.head.appendChild(s);
    }
  }, []);

  const transactions = [
    { label: "Send money",   sub: "Wallet",      icon: <ISend />,   bg: "#eff6ff", tc: "#1d4ed8", val: "+82.8",   pos: true  },
    { label: "Mac D",        sub: "Wallet",       icon: <IWallet />, bg: "#eff6ff", tc: "#1d4ed8", val: "+270.69", pos: true  },
    { label: "Refund",       sub: "Balance",      icon: <IRefund />, bg: "#f0fdf4", tc: "#15803d", val: "+637.81", pos: true  },
    { label: "Ordered Food", sub: "Credit Card",  icon: <ICard />,   bg: "#fff1f2", tc: "#be123c", val: "-938.71", pos: false },
    { label: "Starbucks",    sub: "Wallet",       icon: <ICoffee />, bg: "#eff6ff", tc: "#1d4ed8", val: "+203.33", pos: true  },
    { label: "Ordered Food", sub: "Mastercard",   icon: <ICard />,   bg: "#fff1f2", tc: "#be123c", val: "-92.45",  pos: false },
  ];

  const orderCategories = [
    { label: "Electronic", sub: "Mobile, Earbuds, TV",   icon: <IMobile />, bg: "#eff6ff", tc: "#1d4ed8", val: "82.5k" },
    { label: "Fashion",    sub: "T-shirt, Jeans, Shoes", icon: <IShirt />,  bg: "#f0fdf4", tc: "#15803d", val: "23.8k" },
    { label: "Décor",      sub: "Fine Art, Dining",      icon: <ILamp />,   bg: "#fffbeb", tc: "#92400e", val: "849k"  },
    { label: "Sports",     sub: "Football, Cricket Kit", icon: <IBall />,   bg: "#fff1f2", tc: "#be123c", val: "99"    },
  ];

  const activities = [
    { dot: "#16a34a", title: "12 invoices have been paid", time: "12 min ago",
      sub: "Invoices have been paid to the company", file: true },
    { dot: "#2563eb", title: "Client meeting with John", time: "45 min ago",
      sub: "Project meeting with John @10:15am",
      who: "Laura McCalley (Client) CEO at TrendDirectory" },
    { dot: "#d97706", title: "Create a new project for client", time: "45 min ago",
      sub: "6 team members in a project" },
  ];

  const browsers = [
    { browser: "Chrome",     visits: "8.92k", pct: 64.75, color: "#3b82f6" },
    { browser: "Safari",     visits: "2k",    pct: 18.43, color: "#60a5fa" },
    { browser: "Firefox",    visits: "328",   pct: 6.37,  color: "#a855f7" },
    { browser: "Edge",       visits: "143",   pct: 6.05,  color: "#22d3ee" },
    { browser: "Opera",      visits: "82",    pct: 2.12,  color: "#ef4444" },
    { browser: "UC Browser", visits: "328",   pct: 20.15, color: "#f59e0b" },
  ];

  return (
    <div style={{
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      background: "#f1f5f9", minHeight: "100vh",
      display: "flex", flexDirection: "column",
      opacity: isVisible ? 1 : 0, transition: "opacity .5s",
    }}>
      <main style={{ flex: 1, overflow: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>

        {/* ── ROW 1: Greeting + 3 mini stat cards ── */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 12 }}>

          <Card style={{ background: "linear-gradient(135deg,#e0f2fe,#f0f9ff)", border: "1px solid #bae6fd",
            display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 800, color: "#0369a1", marginBottom: 4 }}>
                Congratulations Akhlesh! 🎉
              </p>
              <p style={{ fontSize: 12, color: "#0284c7", marginBottom: 14, lineHeight: 1.6 }}>
                You have done 72% more sales today.<br />Check your new badge in your profile.
              </p>
              <button style={{
                fontSize: 12, padding: "6px 16px", borderRadius: 20, fontWeight: 700,
                border: "1.5px solid #0369a1", background: "transparent", color: "#0369a1", cursor: "pointer",
              }}>View Badges</button>
            </div>
            <div style={{ fontSize: 56, opacity: 0.75 }}>👨‍💻</div>
          </Card>

          <Card>
            <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>Order</p>
            <p style={{ fontSize: 22, fontWeight: 800, color: "#1e293b", margin: "4px 0" }}>276K</p>
            <Sparkline data={[10,18,14,22,19,28,24,32,30,38]} color="#22c55e" height={50} />
          </Card>

          <Card>
            <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>Payments</p>
            <p style={{ fontSize: 22, fontWeight: 800, color: "#1e293b", margin: "4px 0" }}>$2,456</p>
            <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700,
              padding: "2px 8px", borderRadius: 20, background: "#fef2f2", color: "#dc2626" }}>
              ↓ 14.02%
            </span>
            <Sparkline data={[40,32,38,28,35,26,30,22,28,20]} color="#ef4444" height={40} />
          </Card>

          <Card>
            <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>Revenue</p>
            <p style={{ fontSize: 22, fontWeight: 800, color: "#1e293b", margin: "4px 0" }}>425k</p>
            <RevMiniBar />
          </Card>
        </div>

        {/* ── ROW 2: Revenue chart + Donut + Profile Report ── */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1.2fr", gap: 12 }}>

          <Card>
            <SectionTitle right={
              <div style={{ display: "flex", gap: 12, fontSize: 12 }}>
                {[["#3b82f6","2024"],["#bfdbfe","2023"]].map(([c,l]) => (
                  <span key={l} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 2, background: c, display: "inline-block" }} />
                    <span style={{ color: "#64748b" }}>{l}</span>
                  </span>
                ))}
              </div>
            }>Total Revenue</SectionTitle>
            <RevenueBarChart />
          </Card>

          <Card style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ display: "flex", justifyContent: "space-between", width: "100%", marginBottom: 10 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>2024</p>
              <select style={{ fontSize: 11, border: "1px solid #e2e8f0", borderRadius: 6,
                padding: "2px 6px", background: "#fff", color: "#64748b" }}>
                <option>2024</option>
              </select>
            </div>
            <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
              <DonutChart value={78} size={120} cutout="72%" color="#3b82f6" />
              <div style={{ position: "absolute", textAlign: "center" }}>
                <p style={{ fontSize: 18, fontWeight: 800, color: "#1e293b" }}>78%</p>
                <p style={{ fontSize: 10, color: "#94a3b8" }}>Growth</p>
              </div>
            </div>
            <p style={{ fontSize: 11, color: "#64748b", marginTop: 8 }}>62% Company Growth</p>
            <div style={{ display: "flex", justifyContent: "space-between", width: "100%",
              marginTop: 10, borderTop: "1px solid #f1f5f9", paddingTop: 10 }}>
              {[["Goal","$32.5k"],["2024","$41.2k"]].map(([lbl, val]) => (
                <div key={lbl} style={{ textAlign: "center" }}>
                  <p style={{ fontSize: 10, color: "#94a3b8" }}>{lbl}</p>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>{val}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div>
                <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>Profile Report</p>
                <p style={{ fontSize: 22, fontWeight: 800, color: "#1e293b" }}>$84,686k</p>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 20, background: "#eff6ff", color: "#1d4ed8", fontWeight: 700 }}>New 2024</span>
                <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 20, background: "#f8fafc", color: "#64748b", fontWeight: 700, border: "1px solid #e2e8f0" }}>2023</span>
              </div>
            </div>
            <Sparkline data={[20,35,28,50,42,60,52,70,65,82]} color="#f59e0b" height={80} />
          </Card>
        </div>

        {/* ── ROW 3: Order Stats + Income + Transaction ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>

          {/* Order Statistics */}
          <Card>
            <SectionTitle right={<span style={{ fontSize: 11, color: "#94a3b8" }}>42,821 Total Sales</span>}>
              Order Statistics
            </SectionTitle>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
              <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                <DonutChart value={38} size={72} cutout="68%" color="#3b82f6" />
                <div style={{ position: "absolute", textAlign: "center" }}>
                  <p style={{ fontSize: 11, fontWeight: 800, color: "#1e293b" }}>38%</p>
                  <p style={{ fontSize: 9, color: "#94a3b8" }}>Weekly</p>
                </div>
              </div>
              <div>
                <p style={{ fontSize: 22, fontWeight: 800, color: "#1e293b" }}>8,258</p>
                <p style={{ fontSize: 12, color: "#94a3b8" }}>Total Orders</p>
              </div>
            </div>
            <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
              {orderCategories.map((o, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 34, height: 34, borderRadius: "50%", background: o.bg, color: o.tc,
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {o.icon}
                    </div>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 700, color: "#1e293b" }}>{o.label}</p>
                      <p style={{ fontSize: 10, color: "#94a3b8" }}>{o.sub}</p>
                    </div>
                  </div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>{o.val}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Income */}
          <Card>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              {["Income","Expenses","Profit"].map(t => (
                <button key={t} style={tabStyle(incomeTab === t)} onClick={() => setIncomeTab(t)}>{t}</button>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div>
                <p style={{ fontSize: 11, color: "#94a3b8" }}>Total Balance</p>
                <p style={{ fontSize: 16, fontWeight: 800, color: "#1e293b" }}>$459.10</p>
              </div>
              <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20,
                background: "#f0fdf4", color: "#15803d", fontWeight: 700 }}>+$2.4k</span>
            </div>
            <IncomeAreaChart />
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12,
              padding: 10, background: "#f8fafc", borderRadius: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#f0fdf4",
                color: "#15803d", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ITrend />
              </div>
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#1e293b" }}>Income this week</p>
                <p style={{ fontSize: 11, color: "#94a3b8" }}>0.29k more than last week</p>
              </div>
            </div>
          </Card>

          {/* Transaction */}
          <Card>
            <SectionTitle right={<p style={{ fontSize: 11, color: "#94a3b8" }}>Group</p>}>
              Transaction
            </SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {transactions.map((t, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 34, height: 34, borderRadius: "50%", background: t.bg, color: t.tc,
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {t.icon}
                    </div>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 700, color: "#1e293b" }}>{t.label}</p>
                      <p style={{ fontSize: 10, color: "#94a3b8" }}>{t.sub}</p>
                    </div>
                  </div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: t.pos ? "#15803d" : "#dc2626" }}>
                    {t.val} USD
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* ── ROW 4: Activity Timeline + Browser Table ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 12 }}>

          {/* Activity Timeline */}
          <Card>
            <SectionTitle>Activity Timeline</SectionTitle>
            {activities.map((a, i) => (
              <div key={i} style={{ display: "flex", gap: 12 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: a.dot, flexShrink: 0, marginTop: 3 }} />
                  {i < activities.length - 1 && (
                    <div style={{ width: 1.5, flex: 1, background: "#e2e8f0", margin: "4px 0" }} />
                  )}
                </div>
                <div style={{ flex: 1, paddingBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: "#1e293b" }}>{a.title}</p>
                    <p style={{ fontSize: 10, color: "#94a3b8", whiteSpace: "nowrap", marginLeft: 8 }}>{a.time}</p>
                  </div>
                  <p style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{a.sub}</p>
                  {a.who && <p style={{ fontSize: 10, color: "#94a3b8", marginTop: 4 }}>{a.who}</p>}
                  {a.file && (
                    <div style={{ marginTop: 6, display: "inline-flex", alignItems: "center", gap: 4,
                      fontSize: 11, padding: "3px 10px", borderRadius: 6,
                      border: "1px solid #e2e8f0", color: "#64748b" }}>
                      <IFile /><span>Invoice.pdf</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </Card>

          {/* Browser Stats */}
          <Card>
            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
              {["Income","Operating System","Country"].map(t => (
                <button key={t} style={tabStyle(browserTab === t)} onClick={() => setBrowserTab(t)}>{t}</button>
              ))}
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr>
                  {["No","Browser","Visits","Data in Percentage"].map(h => (
                    <th key={h} style={{ textAlign: "left", color: "#94a3b8", fontWeight: 600,
                      padding: "4px 6px 10px", borderBottom: "1px solid #f1f5f9" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {browsers.map((b, i) => (
                  <tr key={i}>
                    <td style={{ padding: "8px 6px", color: "#94a3b8" }}>{i + 1}</td>
                    <td style={{ padding: "8px 6px", fontWeight: 600, color: "#1e293b" }}>{b.browser}</td>
                    <td style={{ padding: "8px 6px", color: "#64748b" }}>{b.visits}</td>
                    <td style={{ padding: "8px 6px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ flex: 1, height: 6, borderRadius: 3, background: "#f1f5f9", overflow: "hidden" }}>
                          <div style={{ width: `${b.pct}%`, height: "100%", background: b.color, borderRadius: 3 }} />
                        </div>
                        <span style={{ fontSize: 11, color: "#64748b", minWidth: 40 }}>{b.pct}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

      </main>
    </div>
  );
}