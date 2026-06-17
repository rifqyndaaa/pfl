import { useState, useMemo } from "react";
import Card from "../components/Card";
import {
  FaShoppingCart,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaSearch,
  FaPlus,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaBox,
  FaArrowUp,
  FaTruck,
  FaEye,
} from "react-icons/fa";

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

const initialOrders = generateOrders();

export default function OrdersManagement() {
  const [orders, setOrders] = useState(() => {
    const stored = localStorage.getItem("buiq_orders");
    if (stored) return JSON.parse(stored);
    localStorage.setItem("buiq_orders", JSON.stringify(initialOrders));
    return initialOrders;
  });
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const [formData, setFormData] = useState({
    customerId: "",
    customerName: "",
    product: "",
    status: "Pending",
    totalPrice: "",
    orderDate: "",
  });

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.orderId.toString().includes(searchTerm) ||
      o.product.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === "All" || o.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = useMemo(() => {
    return {
      total: orders.length,
      completed: orders.filter((o) => o.status === "Completed").length,
      pending: orders.filter((o) => o.status === "Pending").length,
      cancelled: orders.filter((o) => o.status === "Cancelled").length,
      totalRevenue: orders.reduce((sum, o) => sum + o.totalPrice, 0),
    };
  }, [orders]);

  const handleAddOrder = () => {
    if (!formData.customerName || !formData.product || !formData.totalPrice || !formData.orderDate) {
      alert("Harap isi semua field!");
      return;
    }

    const newOrder = {
      orderId: orders.length > 0 ? Math.max(...orders.map((o) => o.orderId)) + 1 : 1,
      ...formData,
      customerAvatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
      totalPrice: parseInt(formData.totalPrice),
    };

    const updated = [newOrder, ...orders];
    setOrders(updated);
    localStorage.setItem("buiq_orders", JSON.stringify(updated));
    setFormData({
      customerId: "",
      customerName: "",
      product: "",
      status: "Pending",
      totalPrice: "",
      orderDate: "",
    });
    setShowModal(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed": return <FaCheckCircle className="text-emerald-500 text-xs" />;
      case "Pending": return <FaClock className="text-warning text-xs" />;
      case "Cancelled": return <FaTimesCircle className="text-danger text-xs" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* CONTROLS HEADER BAR */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm">
        
        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
            <input
              type="text"
              placeholder="Search order ID or name..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary text-xs outline-none transition-all placeholder:text-slate-400"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex border border-slate-200 rounded-xl p-0.5 bg-slate-50">
            {["All", "Completed", "Pending", "Cancelled"].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-1.5 rounded-lg font-semibold text-[11px] transition-all cursor-pointer ${
                  selectedStatus === status
                    ? "bg-white text-primary shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Add Button */}
        <button
          onClick={() => setShowModal(true)}
          className="w-full md:w-auto bg-primary hover:bg-primary-hover text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
        >
          <FaPlus size={11} />
          <span>Add Order</span>
        </button>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Orders", val: stats.total, color: "text-primary", icon: <FaShoppingCart /> },
          { label: "Completed", val: stats.completed, color: "text-emerald-500", icon: <FaCheckCircle /> },
          { label: "Pending", val: stats.pending, color: "text-warning", icon: <FaClock /> },
          { label: "Revenue", val: `Rp ${stats.totalRevenue.toLocaleString()}`, color: "text-emerald-600", icon: <FaMoneyBillWave /> },
        ].map((s, i) => (
          <Card key={i}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {s.label}
                </p>
                <p className="text-xl font-black text-slate-800 mt-1">
                  {s.val}
                </p>
              </div>
              <div className={`w-10 h-10 rounded-xl bg-slate-50 ${s.color} flex items-center justify-center text-sm`}>
                {s.icon}
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400">
              <FaArrowUp className="text-emerald-500" />
              <span className="text-emerald-600 font-bold">+15%</span>
              <span>vs last month</span>
            </div>
          </Card>
        ))}
      </div>

      {/* TABLE */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200/80">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Total Price</th>
                <th className="py-3 px-4">Order Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map((order) => (
                <tr key={order.orderId} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-400">
                    <span className="bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200">
                      #{order.orderId}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={order.customerAvatar}
                        alt={order.customerName}
                        className="w-8 h-8 rounded-full object-cover shadow-sm"
                      />
                      <div>
                        <div className="font-bold text-slate-800">{order.customerName}</div>
                        <div className="text-[9px] text-slate-400">ID: {order.customerId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-600">{order.product}</td>
                  <td className="py-3.5 px-4">
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider
                      ${order.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : ''}
                      ${order.status === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-100' : ''}
                      ${order.status === 'Cancelled' ? 'bg-rose-50 text-rose-700 border border-rose-100' : ''}
                    ">
                      {getStatusIcon(order.status)}
                      <span>{order.status}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-primary">
                    Rp {order.totalPrice.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <FaCalendarAlt className="text-[10px]" />
                      <span>{order.orderDate}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* TABLE FOOTER */}
        <div className="border-t border-slate-100 py-3.5 px-4 bg-slate-50/50 flex justify-between items-center text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-2">
            <FaTruck className="text-primary" />
            <span>Showing {filteredOrders.length} of {orders.length} orders</span>
          </div>
        </div>
      </div>

      {/* OVERVIEW CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FaBox className="text-primary text-sm" />
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Orders Overview</h3>
            </div>
            <FaEye className="text-slate-400 cursor-pointer hover:text-slate-600 transition-colors" />
          </div>
          <div className="space-y-3.5 text-xs text-slate-600">
            <div className="flex justify-between items-center">
              <span>Completed Orders</span>
              <span className="font-bold text-emerald-600">{stats.completed}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Pending Orders</span>
              <span className="font-bold text-warning">{stats.pending}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Cancelled Orders</span>
              <span className="font-bold text-danger">{stats.cancelled}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
            <FaMoneyBillWave className="text-emerald-500 text-sm" />
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Revenue Summary</h3>
          </div>
          <div className="space-y-3.5 text-xs text-slate-600">
            <div className="flex justify-between items-center">
              <span>Total Revenue</span>
              <span className="font-bold text-emerald-600">Rp {stats.totalRevenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Average Order Value</span>
              <span className="font-bold text-primary">
                Rp {Math.round(stats.totalRevenue / stats.total).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ADD ORDER MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden border border-slate-250/80 animate-slide">
            <div className="border-b border-slate-100 p-5 flex items-center gap-3 bg-slate-50">
              <div className="w-9 h-9 rounded-xl bg-primary-light flex items-center justify-center text-primary text-sm">
                <FaPlus />
              </div>
              <div>
                <h2 className="text-xs font-bold text-slate-900">New Order</h2>
                <p className="text-[10px] text-slate-400">Tambahkan order baru</p>
              </div>
            </div>

            <div className="p-5 space-y-3.5">
              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Customer Name</label>
                <input
                  type="text"
                  placeholder="e.g. Alya Putri"
                  className="buiq-input"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                />
              </div>

              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Product</label>
                <input
                  type="text"
                  placeholder="e.g. Silk Midi Dress"
                  className="buiq-input"
                  value={formData.product}
                  onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                />
              </div>

              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Status</label>
                <select
                  className="buiq-input bg-white"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option>Pending</option>
                  <option>Completed</option>
                  <option>Cancelled</option>
                </select>
              </div>

              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Price (Rp)</label>
                <input
                  type="number"
                  placeholder="e.g. 500000"
                  className="buiq-input"
                  value={formData.totalPrice}
                  onChange={(e) => setFormData({ ...formData, totalPrice: e.target.value })}
                />
              </div>

              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Order Date</label>
                <input
                  type="date"
                  className="buiq-input"
                  value={formData.orderDate}
                  onChange={(e) => setFormData({ ...formData, orderDate: e.target.value })}
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  onClick={handleAddOrder}
                  className="flex-1 bg-primary hover:bg-primary-hover text-white py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-primary/10"
                >
                  Confirm Order
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-5 bg-slate-100 text-slate-600 hover:bg-slate-200 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
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