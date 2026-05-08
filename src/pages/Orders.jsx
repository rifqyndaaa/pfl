import { useState, useMemo } from "react";
// Pastikan PageHeader tersedia, jika tidak, ganti dengan div biasa
import PageHeader from "../components/PageHeader"; 

const generateOrders = () => {
  const statuses = ["Pending", "Completed", "Cancelled"];
  const customers = [
    { id: 1, name: "Rifqi" }, { id: 2, name: "Aldi" }, { id: 3, name: "Rina" },
    { id: 4, name: "Dimas" }, { id: 5, name: "Salsa" }, { id: 6, name: "Naufal" },
    { id: 7, name: "Putri" }, { id: 8, name: "Raka" }, { id: 9, name: "Nabila" },
    { id: 10, name: "Fikri" },
  ];

  const orders = [];
  for (let i = 1; i <= 30; i++) {
    const cust = customers[i % customers.length];
    orders.push({
      orderId: i,
      customerId: cust.id,
      customerName: cust.name,
      status: statuses[i % 3],
      totalPrice: Math.floor(50000 + Math.random() * 450000),
      orderDate: `2025-${String(Math.floor(1 + Math.random() * 12)).padStart(2, '0')}-${String(Math.floor(1 + Math.random() * 28)).padStart(2, '0')}`,
    });
  }
  return orders;
};

const initialOrders = generateOrders();

export default function Orders() {
  const [orders, setOrders] = useState(initialOrders);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    customerId: "",
    customerName: "",
    status: "Pending",
    totalPrice: "",
    orderDate: "",
  });

  // 🔥 Fitur Pencarian Dinamis
  const filteredOrders = orders.filter(o => 
    o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.orderId.toString().includes(searchTerm)
  );

  // 🔥 Statistik Dinamis
  const stats = useMemo(() => {
    return {
      total: orders.length,
      completed: orders.filter(o => o.status === "Completed").length,
      pending: orders.filter(o => o.status === "Pending").length,
    };
  }, [orders]);

  const handleAddOrder = () => {
    if (!formData.customerId || !formData.customerName || !formData.totalPrice || !formData.orderDate) {
      alert("Harap isi semua field!");
      return;
    }

    const newOrder = {
      orderId: orders.length > 0 ? Math.max(...orders.map(o => o.orderId)) + 1 : 1,
      ...formData,
      totalPrice: parseInt(formData.totalPrice),
    };

    setOrders([newOrder, ...orders]);
    setShowModal(false);
    setFormData({ customerId: "", customerName: "", status: "Pending", totalPrice: "", orderDate: "" });
  };

  return (
    <div className="p-1 space-y-6 animate-in fade-in duration-700">
      
      <PageHeader title="Order Management" breadcrumb="Dashboard / Orders">
        <div className="flex gap-3">
            <input 
                type="text"
                placeholder="Cari ID atau Nama..."
                className="px-4 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-green-400 outline-none transition-all w-48 md:w-64"
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
                onClick={() => setShowModal(true)}
                className="bg-green-500 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-green-600 hover:shadow-lg hover:-translate-y-1 transition-all active:scale-95"
            >
                + Add Order
            </button>
        </div>
      </PageHeader>

      {/* 🔥 STATS SUMMARY (Bergerak) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
            { label: "Total Orders", val: stats.total, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Completed", val: stats.completed, color: "text-green-600", bg: "bg-green-50" },
            { label: "Pending Payment", val: stats.pending, color: "text-amber-600", bg: "bg-amber-50" },
        ].map((s, i) => (
            <div key={i} className={`${s.bg} p-4 rounded-2xl border border-white shadow-sm hover:shadow-md transition-all`}>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">{s.label}</p>
                <p className={`text-2xl font-black ${s.color}`}>{s.val}</p>
            </div>
        ))}
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden transition-all">
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
            <thead>
                <tr className="bg-gray-50/50 text-gray-400 text-xs uppercase tracking-widest">
                <th className="p-4 text-left">Order ID</th>
                <th className="p-4 text-left">Customer</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Total Price</th>
                <th className="p-4 text-left">Order Date</th>
                </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
                {filteredOrders.length > 0 ? (
                    filteredOrders.map((order, i) => (
                    <tr 
                        key={order.orderId} 
                        className="group hover:bg-blue-50/30 transition-all duration-200 animate-in slide-in-from-bottom-2"
                        style={{ animationDelay: `${i * 30}ms` }}
                    >
                        <td className="p-4">
                            <span className="bg-gray-100 px-2 py-1 rounded-lg font-mono text-gray-600 group-hover:bg-blue-100 transition-colors">
                                #{order.orderId}
                            </span>
                        </td>
                        <td className="p-4">
                            <div className="font-bold text-gray-700">{order.customerName}</div>
                            <div className="text-xs text-gray-400">ID: {order.customerId}</div>
                        </td>

                        <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter
                            ${order.status === "Completed" && "bg-green-100 text-green-700"}
                            ${order.status === "Pending" && "bg-amber-100 text-amber-700"}
                            ${order.status === "Cancelled" && "bg-rose-100 text-rose-700"}
                        `}>
                            {order.status}
                        </span>
                        </td>

                        <td className="p-4 font-bold text-gray-800">
                            Rp {order.totalPrice.toLocaleString()}
                        </td>
                        <td className="p-4 text-gray-500 font-medium italic">
                            {order.orderDate}
                        </td>
                    </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="5" className="p-10 text-center text-gray-400 italic">
                            Data tidak ditemukan... 🔍
                        </td>
                    </tr>
                )}
            </tbody>
            </table>
        </div>
      </div>

      {/* MODAL (Glassmorphism Effect) */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl border border-white animate-in zoom-in duration-300">
            <h2 className="text-2xl font-black mb-6 text-gray-800 flex items-center gap-2">
                <span className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center text-sm">📦</span>
                New Order
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 ml-1">CUST ID</label>
                    <input
                        type="text"
                        placeholder="Ex: 101"
                        className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-green-400 outline-none transition-all"
                        value={formData.customerId}
                        onChange={(e) => setFormData({...formData, customerId: e.target.value})}
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 ml-1">STATUS</label>
                    <select
                        className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-green-400 outline-none transition-all"
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                    >
                        <option>Pending</option>
                        <option>Completed</option>
                        <option>Cancelled</option>
                    </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 ml-1">CUSTOMER NAME</label>
                <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-green-400 outline-none transition-all"
                    value={formData.customerName}
                    onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 ml-1">TOTAL PRICE (RP)</label>
                <input
                    type="number"
                    placeholder="50000"
                    className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-green-400 outline-none transition-all"
                    value={formData.totalPrice}
                    onChange={(e) => setFormData({...formData, totalPrice: e.target.value})}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 ml-1">ORDER DATE</label>
                <input
                    type="date"
                    className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-green-400 outline-none transition-all text-gray-500"
                    value={formData.orderDate}
                    onChange={(e) => setFormData({...formData, orderDate: e.target.value})}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button onClick={handleAddOrder} className="flex-1 bg-green-500 text-white py-3 rounded-xl font-bold hover:bg-green-600 hover:shadow-lg active:scale-95 transition-all">
                  Confirm Order
                </button>
                <button onClick={() => setShowModal(false)} className="px-6 bg-gray-100 text-gray-500 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}