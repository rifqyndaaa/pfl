import { useState, useMemo } from "react";
import Card from "../components/Card";
import { useOrders } from "../hooks/useOrders";
import { useCustomers } from "../hooks/useCustomers";
import { useProducts } from "../hooks/useProducts";
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
  FaEdit,
  FaTrash,
  FaExclamationTriangle
} from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";

export default function OrdersManagement() {
  const {
    orders,
    loading: loadingOrders,
    error: errorOrders,
    addOrder,
    updateOrder,
    deleteOrder
  } = useOrders();

  const { customers, loading: loadingCust } = useCustomers();
  const { products, loading: loadingProd } = useProducts();

  const [showModal, setShowModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const [formData, setFormData] = useState({
    customerId: "",
    productId: "",
    quantity: "1",
    status: "Pending",
    totalPrice: "",
    orderDate: new Date().toISOString().split("T")[0]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const custName = o.customers?.full_name?.toLowerCase() || "";
      const prodName = o.products?.product_name?.toLowerCase() || "";
      const orderNum = o.order_number?.toLowerCase() || "";
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        custName.includes(search) ||
        prodName.includes(search) ||
        orderNum.includes(search);

      const matchesStatus = selectedStatus === "All" || o.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, selectedStatus]);

  const stats = useMemo(() => {
    return {
      total: orders.length,
      completed: orders.filter((o) => o.status === "Completed").length,
      pending: orders.filter((o) => o.status === "Pending").length,
      cancelled: orders.filter((o) => o.status === "Cancelled").length,
      totalRevenue: orders.reduce((sum, o) => sum + parseFloat(o.total_price || 0), 0),
    };
  }, [orders]);

  const handleOpenAddModal = () => {
    setEditingOrder(null);
    setFormData({
      customerId: "",
      productId: "",
      quantity: "1",
      status: "Pending",
      totalPrice: "",
      orderDate: new Date().toISOString().split("T")[0]
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (order) => {
    setEditingOrder(order);
    setFormData({
      customerId: String(order.customer_id),
      productId: String(order.product_id),
      quantity: String(order.quantity),
      status: order.status || "Pending",
      totalPrice: String(order.total_price),
      orderDate: order.order_date
    });
    setShowModal(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus order ini?")) {
      try {
        await deleteOrder(id);
      } catch (err) {
        alert("Gagal menghapus order: " + err.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customerId || !formData.productId || !formData.totalPrice || !formData.orderDate) {
      alert("Harap isi semua field!");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        customer_id: parseInt(formData.customerId),
        product_id: parseInt(formData.productId),
        quantity: parseInt(formData.quantity || 1),
        total_price: parseFloat(formData.totalPrice),
        status: formData.status,
        order_date: formData.orderDate
      };

      if (editingOrder) {
        await updateOrder(editingOrder.id, payload);
      } else {
        await addOrder(payload);
      }
      setShowModal(false);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed": return <FaCheckCircle className="text-emerald-500 text-xs" />;
      case "Pending": return <FaClock className="text-amber-500 text-xs" />;
      case "Cancelled": return <FaTimesCircle className="text-rose-500 text-xs" />;
      default: return null;
    }
  };

  if (loadingOrders || loadingCust || loadingProd) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-3">
        <ImSpinner2 className="animate-spin text-primary text-2xl" />
        <span className="text-xs text-slate-500 font-semibold">Mengambil data orders...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {errorOrders && (
        <div className="bg-rose-50 border border-rose-100 text-rose-700 text-xs p-4 rounded-2xl font-medium flex items-center gap-2">
          <FaExclamationTriangle className="shrink-0" />
          <span>Error loading data: {errorOrders}</span>
        </div>
      )}

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
              value={searchTerm}
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
          onClick={handleOpenAddModal}
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
          { label: "Revenue Valuation", val: `Rp ${stats.totalRevenue.toLocaleString()}`, color: "text-emerald-600", icon: <FaMoneyBillWave /> },
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
                <th className="py-3 px-4 text-center">Qty</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Total Price</th>
                <th className="py-3 px-4">Order Date</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-400">
                    <span className="bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200">
                      {order.order_number}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(order.customers?.email || "default")}`}
                        alt={order.customers?.full_name}
                        className="w-8 h-8 rounded-full object-cover shadow-sm border border-slate-100"
                      />
                      <div>
                        <div className="font-bold text-slate-800">{order.customers?.full_name || "Unknown"}</div>
                        <div className="text-[9px] text-slate-400">ID: {order.customer_id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700">
                    <div>{order.products?.product_name || "Deleted Product"}</div>
                    <div className="text-[9px] text-slate-400 font-medium">{order.products?.category}</div>
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-slate-600">{order.quantity}x</td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider
                      ${order.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : ''}
                      ${order.status === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-100' : ''}
                      ${order.status === 'Cancelled' ? 'bg-rose-50 text-rose-700 border border-rose-100' : ''}
                    `}>
                      {getStatusIcon(order.status)}
                      <span>{order.status}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-primary">
                    Rp {parseFloat(order.total_price).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    <div className="flex items-center gap-1.5 font-medium">
                      <FaCalendarAlt className="text-[10px]" />
                      <span>{order.order_date}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleOpenEditModal(order)}
                        className="p-1.5 bg-slate-50 border border-slate-200 hover:border-primary hover:bg-primary-light hover:text-primary rounded-lg text-slate-500 cursor-pointer transition-all"
                        title="Edit"
                      >
                        <FaEdit size={12} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(order.id)}
                        className="p-1.5 bg-slate-50 border border-slate-200 hover:border-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded-lg text-slate-500 cursor-pointer transition-all"
                        title="Delete"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-slate-400 font-medium">
                    No matching orders found.
                  </td>
                </tr>
              )}
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
          </div>
          <div className="space-y-3.5 text-xs text-slate-600">
            <div className="flex justify-between items-center">
              <span>Completed Orders</span>
              <span className="font-bold text-emerald-600">{stats.completed}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Pending Orders</span>
              <span className="font-bold text-amber-600">{stats.pending}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Cancelled Orders</span>
              <span className="font-bold text-rose-600">{stats.cancelled}</span>
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
                Rp {Math.round(orders.length > 0 ? stats.totalRevenue / orders.length : 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ADD/EDIT ORDER MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden border border-slate-250/80 animate-slide">
            <div className="border-b border-slate-100 p-5 flex items-center gap-3 bg-slate-50">
              <div className="w-9 h-9 rounded-xl bg-primary-light flex items-center justify-center text-primary text-sm">
                <FaPlus />
              </div>
              <div>
                <h2 className="text-xs font-bold text-slate-900">
                  {editingOrder ? "Edit Order" : "New Order"}
                </h2>
                <p className="text-[10px] text-slate-400">
                  {editingOrder ? "Perbarui rincian transaksi order" : "Tambahkan order baru ke BUIQ"}
                </p>
              </div>
            </div>

            <div className="p-5 space-y-3.5">
              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Customer</label>
                <select
                  className="buiq-input bg-white"
                  value={formData.customerId}
                  onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                  required
                >
                  <option value="">Select Customer</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.full_name} ({c.customer_code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Product</label>
                <select
                  className="buiq-input bg-white"
                  value={formData.productId}
                  onChange={(e) => {
                    const prodId = parseInt(e.target.value);
                    const prod = products.find((p) => p.id === prodId);
                    const qty = parseInt(formData.quantity || 1);
                    setFormData({
                      ...formData,
                      productId: e.target.value,
                      totalPrice: prod ? String(parseFloat(prod.price) * qty) : ""
                    });
                  }}
                  required
                >
                  <option value="">Select Product</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.product_name} - Rp {parseFloat(p.price).toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Quantity</label>
                <input
                  type="number"
                  min="1"
                  className="buiq-input"
                  value={formData.quantity}
                  onChange={(e) => {
                    const qty = parseInt(e.target.value) || 1;
                    const prod = products.find((p) => p.id === parseInt(formData.productId));
                    setFormData({
                      ...formData,
                      quantity: String(qty),
                      totalPrice: prod ? String(parseFloat(prod.price) * qty) : formData.totalPrice
                    });
                  }}
                  required
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
                  required
                />
              </div>

              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Order Date</label>
                <input
                  type="date"
                  className="buiq-input"
                  value={formData.orderDate}
                  onChange={(e) => setFormData({ ...formData, orderDate: e.target.value })}
                  required
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-primary hover:bg-primary-hover text-white py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-primary/10 disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {isSubmitting && <ImSpinner2 className="animate-spin text-sm" />}
                  <span>{editingOrder ? "Save Changes" : "Confirm Order"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 bg-slate-100 text-slate-600 hover:bg-slate-200 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}