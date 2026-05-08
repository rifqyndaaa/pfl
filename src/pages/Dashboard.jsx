import { useState } from "react";

export default function Dashboard() {
    const [selected, setSelected] = useState(null);
    const [search, setSearch] = useState("");

    // 🔥 Activities
    const activities = [
        "🛒 New Order #123",
        "👤 New User Registered",
        "💰 Payment Completed",
        "📦 Order Shipped",
        "❌ Order Cancelled"
    ];

    const filteredActivities = activities.filter(item =>
        item.toLowerCase().includes(search.toLowerCase())
    );

    // 🔥 Stats dari code 2 (dipindah)
    const cards = [
        { title: "Total Orders", value: 75, color: "green", icon: "🛒", growth: "+12%" },
        { title: "Total Delivered", value: 175, color: "blue", icon: "🚚", growth: "+8%" },
        { title: "Total Canceled", value: 40, color: "red", icon: "⛔", growth: "-3%" },
        { title: "Total Revenue", value: "Rp.128", color: "yellow", icon: "💰", growth: "+20%" },
        { title: "Total Users", value: 120, color: "purple", icon: "👥", growth: "+5%" },
    ];

    // 🔥 Products (simple dari code 2)
    const products = [
        { name: "Nasi Goreng", price: "Rp 45.000", sold: 98 },
        { name: "Ayam Bakar", price: "Rp 55.000", sold: 74 },
        { name: "Es Teh", price: "Rp 12.000", sold: 203 },
    ];

    const progress = 75;

    return (
        <div className="p-6">

            {/* 🔥 WELCOME */}
            <div className="bg-white p-4 rounded-xl shadow mb-6 flex items-center gap-4">
                <img 
                    src="https://cdn-icons-png.flaticon.com/512/4140/4140048.png" 
                    className="w-12 h-12 rounded-full" 
                />
                <div>
                    <h2 className="font-semibold text-lg">
                        Welcome back, Rifqi 👋
                    </h2>
                    <p className="text-sm text-gray-400">
                        Have a nice day managing your dashboard
                    </p>
                </div>
            </div>

            {/* 🔥 TITLE */}
            <h1 className="text-2xl font-semibold mb-1">Dashboard</h1>
            <p className="text-gray-400 mb-6">
                Dashboard / Order List
            </p>

            {/* 🔥 CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {cards.map((card, i) => (
                    <div
                        key={i}
                        onClick={() => setSelected(card.title)}
                        className="bg-white p-4 rounded-xl shadow flex items-center gap-4 cursor-pointer hover:scale-105 transition"
                    >
                        <div className={`bg-${card.color}-500 text-white p-3 rounded-full`}>
                            {card.icon}
                        </div>

                        <div>
                            <h2 className="text-xl font-bold">{card.value}</h2>
                            <p className="text-gray-400 text-sm">{card.title}</p>

                            <span className={`text-xs ${
                                card.growth.includes("+") ? "text-green-500" : "text-red-500"
                            }`}>
                                {card.growth}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* 🔥 PROGRESS */}
            <div className="bg-white p-4 rounded-xl shadow mt-6">
                <div className="flex justify-between mb-2">
                    <p className="text-sm text-gray-400">Order Progress</p>
                    <p className="text-sm font-semibold">{progress}%</p>
                </div>

                <div className="w-full bg-gray-200 h-3 rounded-full">
                    <div 
                        className="bg-green-500 h-3 rounded-full"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>

            {/* 🔥 RECENT ACTIVITY */}
            <div className="bg-white p-4 rounded-xl shadow mt-6">
                <div className="flex justify-between mb-3">
                    <h3 className="font-semibold">Recent Activity</h3>

                    <input
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border px-2 py-1 rounded text-sm"
                    />
                </div>

                <ul className="text-sm text-gray-500 space-y-1">
                    {filteredActivities.map((item, i) => (
                        <li key={i} onClick={() => setSelected(item)} className="cursor-pointer">
                            {item}
                        </li>
                    ))}
                </ul>
            </div>

            {/* 🔥 SIMPLE PRODUCT LIST */}
            <div className="bg-white p-4 rounded-xl shadow mt-6">
                <h3 className="font-semibold mb-3">Top Products</h3>

                {products.map((p, i) => (
                    <div key={i} className="flex justify-between py-2 border-b">
                        <span>{p.name}</span>
                        <span>{p.price}</span>
                        <span className="text-gray-400">{p.sold} sold</span>
                    </div>
                ))}
            </div>

            {/* 🔥 MODAL */}
            {selected && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-xl w-80 text-center">
                        <h2 className="text-xl font-bold">{selected}</h2>

                        <button
                            onClick={() => setSelected(null)}
                            className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}