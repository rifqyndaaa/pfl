import { useState, useEffect } from "react";

export default function Dashboard() {
    const [selected, setSelected] = useState(null);
    const [search, setSearch] = useState("");
    const [isVisible, setIsVisible] = useState(false);

    // Efek agar konten muncul perlahan saat load
    useEffect(() => {
        setIsVisible(true);
    }, []);

    const activities = [
        "🛒 New Order #123", "👤 New User Registered", 
        "💰 Payment Completed", "📦 Order Shipped", "❌ Order Cancelled"
    ];

    const filteredActivities = activities.filter(item =>
        item.toLowerCase().includes(search.toLowerCase())
    );

    const cards = [
        { title: "Total Orders", value: 75, color: "bg-emerald-500", icon: "🛒", growth: "+12%" },
        { title: "Total Delivered", value: 175, color: "bg-blue-500", icon: "🚚", growth: "+8%" },
        { title: "Total Canceled", value: 40, color: "bg-rose-500", icon: "⛔", growth: "-3%" },
        { title: "Total Revenue", value: "Rp.128k", color: "bg-amber-500", icon: "💰", growth: "+20%" },
        { title: "Total Users", value: 120, color: "bg-violet-500", icon: "👥", growth: "+5%" },
    ];

    const products = [
        { name: "Nasi Goreng", price: "Rp 45.000", sold: 98 },
        { name: "Ayam Bakar", price: "Rp 55.000", sold: 74 },
        { name: "Es Teh", price: "Rp 12.000", sold: 203 },
    ];

    return (
        <div className={`p-6 bg-slate-50 min-h-screen transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            
            {/* ✨ ADVANCED CSS ANIMATIONS */}
            <style>
                {`
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }
                @keyframes shimmer {
                    0% { background-position: -1000px 0; }
                    100% { background-position: 1000px 0; }
                }
                .animate-float { animation: float 3s ease-in-out infinite; }
                .shimmer-bg {
                    background: linear-gradient(90deg, #f0f0f0 25%, #f8f8f8 50%, #f0f0f0 75%);
                    background-size: 1000px 100%;
                    animation: shimmer 2s infinite linear;
                }
                .glass-card {
                    background: rgba(255, 255, 255, 0.8);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                }
                `}
            </style>

            {/* 🔥 WELCOME HEADER - Floating Effect */}
            <div className="glass-card p-6 rounded-2xl shadow-xl mb-8 flex items-center justify-between animate-float overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -mr-16 -mt-16 opacity-50"></div>
                
                <div className="flex items-center gap-5 relative z-10">
                    <div className="relative">
                        <img 
                            src="https://cdn-icons-png.flaticon.com/512/4140/4140048.png" 
                            className="w-16 h-16 rounded-2xl shadow-lg border-2 border-white transform hover:rotate-6 transition duration-300" 
                        />
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-4 border-white animate-pulse"></span>
                    </div>
                    <div>
                        <h2 className="font-bold text-2xl text-slate-800">
                            Welcome back, Rifqi <span className="inline-block animate-bounce">👋</span>
                        </h2>
                        <p className="text-slate-500 font-medium">Sistem berjalan normal. Ada 5 pesanan baru hari ini.</p>
                    </div>
                </div>

                <div className="hidden lg:block glass-card px-4 py-2 rounded-lg text-sm font-bold text-blue-600 shadow-inner">
                    ⚡ Server Status: Optimal
                </div>
            </div>

            {/* 🔥 STATS CARDS - Staggered Hover Effect */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                {cards.map((card, i) => (
                    <div
                        key={i}
                        onClick={() => setSelected(card.title)}
                        className="glass-card p-5 rounded-2xl shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group border-b-4 border-transparent hover:border-blue-400"
                    >
                        <div className={`${card.color} text-white w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                            {card.icon}
                        </div>
                        <h2 className="text-2xl font-black text-slate-700">{card.value}</h2>
                        <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider">{card.title}</p>
                        <div className={`mt-2 text-xs font-bold inline-block px-2 py-1 rounded-md ${card.growth.includes("+") ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                            {card.growth} Today
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 🔥 PROGRESS & PRODUCTS */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Order Progress */}
                    <div className="glass-card p-6 rounded-2xl shadow-sm">
                        <div className="flex justify-between items-end mb-4">
                            <div>
                                <h3 className="font-bold text-slate-700">Target Harian</h3>
                                <p className="text-sm text-slate-400">Penyelesaian pesanan dapur</p>
                            </div>
                            <p className="text-2xl font-black text-blue-600 leading-none">{75}%</p>
                        </div>
                        <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden p-1 shadow-inner">
                            <div 
                                className="bg-gradient-to-r from-blue-400 to-indigo-500 h-full rounded-full transition-all duration-1000 ease-out relative"
                                style={{ width: `${75}%` }}
                            >
                                <div className="absolute top-0 left-0 w-full h-full bg-white/20 animate-pulse"></div>
                            </div>
                        </div>
                    </div>

                    {/* Top Products Table */}
                    <div className="glass-card p-6 rounded-2xl shadow-sm">
                        <h3 className="font-bold text-slate-700 mb-6 flex items-center gap-2">
                            <span className="p-2 bg-amber-100 rounded-lg text-amber-600">🏆</span> Top Products
                        </h3>
                        <div className="space-y-4">
                            {products.map((p, i) => (
                                <div key={i} className="flex justify-between items-center p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">{i+1}</div>
                                        <span className="font-bold text-slate-700">{p.name}</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-slate-800">{p.price}</p>
                                        <p className="text-xs text-slate-400 font-medium uppercase">{p.sold} items sold</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 🔥 RECENT ACTIVITY - With Glow effect */}
                <div className="glass-card p-6 rounded-2xl shadow-sm flex flex-col border-t-4 border-indigo-500">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-700">Live Activity</h3>
                        <div className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </div>
                    </div>

                    <div className="relative mb-6">
                        <input
                            type="text"
                            placeholder="Cari aktivitas..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-400 px-4 py-3 rounded-xl text-sm transition-all outline-none shadow-inner"
                        />
                    </div>

                    <ul className="space-y-4 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                        {filteredActivities.map((item, i) => (
                            <li 
                                key={i} 
                                onClick={() => setSelected(item)} 
                                className="p-3 rounded-xl hover:bg-white hover:shadow-md cursor-pointer transform hover:-translate-x-1 transition-all duration-200 text-sm font-medium text-slate-600 border-l-4 border-transparent hover:border-blue-400 flex items-center gap-3"
                            >
                                <span className="opacity-70">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* 🔥 MODERN MODAL */}
            {selected && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-8 rounded-3xl w-full max-w-sm text-center shadow-2xl transform animate-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-6 shadow-inner animate-bounce">
                            ℹ️
                        </div>
                        <h2 className="text-2xl font-black text-slate-800 mb-2">{selected}</h2>
                        <p className="text-slate-500 mb-8 font-medium">Detail informasi sedang diproses oleh sistem.</p>
                        <button
                            onClick={() => setSelected(null)}
                            className="w-full bg-slate-800 hover:bg-black text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95"
                        >
                            Selesai
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}