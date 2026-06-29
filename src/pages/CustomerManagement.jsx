import { useState, useMemo } from "react";
import Card from "../components/Card";
import { useCustomers } from "../hooks/useCustomers";
import {
  FaUsers,
  FaUserPlus,
  FaSearch,
  FaMoneyBillWave,
  FaCheckCircle,
  FaArrowUp,
  FaCrown,
  FaTimesCircle,
  FaEdit,
  FaTrash,
  FaExclamationTriangle
} from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";

export default function BUIQCustomerManagement() {
  const {
    customers,
    loading,
    error,
    addCustomer,
    updateCustomer,
    deleteCustomer
  } = useCustomers();

  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    status: "Active",
    totalOrders: "0",
    totalSpent: "0"
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const nameMatch = c.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
      const codeMatch = c.customer_code?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
      const emailMatch = c.email?.toLowerCase().includes(searchTerm.toLowerCase()) || false;

      const matchesSearch = nameMatch || codeMatch || emailMatch;
      const matchesStatus = selectedStatus === "All" || c.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [customers, searchTerm, selectedStatus]);

  const stats = useMemo(() => {
    const totalRevenue = customers.reduce((sum, c) => sum + parseFloat(c.total_spent || 0), 0);
    return {
      total: customers.length,
      active: customers.filter((c) => c.status === "Active").length,
      vip: customers.filter((c) => c.status === "VIP").length,
      inactive: customers.filter((c) => c.status === "Inactive").length,
      totalRevenue,
    };
  }, [customers]);

  const handleOpenAddModal = () => {
    setEditingCustomer(null);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      address: "",
      status: "Active",
      totalOrders: "0",
      totalSpent: "0"
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (cust) => {
    setEditingCustomer(cust);
    setFormData({
      fullName: cust.full_name,
      email: cust.email,
      phone: cust.phone || "",
      address: cust.address || "",
      status: cust.status || "Active",
      totalOrders: String(cust.total_orders || 0),
      totalSpent: String(cust.total_spent || 0)
    });
    setShowModal(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus pelanggan ini?")) {
      try {
        await deleteCustomer(id);
      } catch (err) {
        alert("Gagal menghapus pelanggan: " + err.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email) {
      alert("Nama Lengkap dan Email harus diisi!");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        status: formData.status,
        total_orders: parseInt(formData.totalOrders || 0),
        total_spent: parseFloat(formData.totalSpent || 0)
      };

      if (editingCustomer) {
        await updateCustomer(editingCustomer.id, payload);
      } else {
        await addCustomer(payload);
      }
      setShowModal(false);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-3">
        <ImSpinner2 className="animate-spin text-primary text-2xl" />
        <span className="text-xs text-slate-500 font-semibold">Mengambil data pelanggan...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-700 text-xs p-4 rounded-2xl font-medium flex items-center gap-2">
          <FaExclamationTriangle className="shrink-0" />
          <span>Error loading data: {error}</span>
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
              placeholder="Search by code, email or name..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary text-xs outline-none transition-all placeholder:text-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex border border-slate-200 rounded-xl p-0.5 bg-slate-50">
            {["All", "Active", "VIP", "Inactive"].map((status) => (
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
          <FaUserPlus size={11} />
          <span>Add Customer</span>
        </button>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Customers", val: stats.total, color: "text-primary", icon: <FaUsers /> },
          { label: "Active Customers", val: stats.active, color: "text-emerald-500", icon: <FaCheckCircle /> },
          { label: "VIP Members", val: stats.vip, color: "text-purple-500", icon: <FaCrown /> },
          { label: "Total Spent Valuation", val: `Rp ${(stats.totalRevenue / 1000000).toFixed(2)}M`, color: "text-emerald-600", icon: <FaMoneyBillWave /> },
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
              <span className="text-emerald-600 font-bold">+12%</span>
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
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Email / Phone</th>
                <th className="py-3 px-4">Address</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Orders</th>
                <th className="py-3 px-4">Total Spent</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(customer.email)}`}
                        alt={customer.full_name}
                        className="w-10 h-10 rounded-lg object-cover shadow-sm border border-slate-100"
                      />
                      <div>
                        <div className="font-bold text-slate-800">{customer.full_name}</div>
                        <div className="text-[9px] text-slate-400">ID: {customer.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-400">
                    <span className="bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200">
                      {customer.customer_code}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium">
                    <div>{customer.email}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{customer.phone || "-"}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 max-w-[150px] truncate">
                    {customer.address || "-"}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider
                      ${customer.status === "VIP" ? "bg-purple-50 text-purple-700 border border-purple-100" : ""}
                      ${customer.status === "Active" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : ""}
                      ${customer.status === "Inactive" ? "bg-rose-50 text-rose-700 border border-rose-100" : ""}
                    `}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-700">{customer.total_orders} Orders</td>
                  <td className="py-3.5 px-4 font-bold text-primary">
                    Rp {parseFloat(customer.total_spent).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleOpenEditModal(customer)}
                        className="p-1.5 bg-slate-50 border border-slate-200 hover:border-primary hover:bg-primary-light hover:text-primary rounded-lg text-slate-500 cursor-pointer transition-all"
                        title="Edit"
                      >
                        <FaEdit size={12} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(customer.id)}
                        className="p-1.5 bg-slate-50 border border-slate-200 hover:border-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded-lg text-slate-500 cursor-pointer transition-all"
                        title="Delete"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-slate-400 font-medium">
                    No matching customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* TABLE FOOTER */}
        <div className="border-t border-slate-100 py-3.5 px-4 bg-slate-50/50 flex justify-between items-center text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-2">
            <FaUsers className="text-primary" />
            <span>Showing {filteredCustomers.length} of {customers.length} customers</span>
          </div>
        </div>
      </div>

      {/* OVERVIEW CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FaUsers className="text-primary text-sm" />
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Customer Overview</h3>
            </div>
          </div>
          <div className="space-y-3.5 text-xs text-slate-600">
            <div className="flex justify-between items-center">
              <span>Active Customers</span>
              <span className="font-bold text-emerald-600">{stats.active}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>VIP Members</span>
              <span className="font-bold text-purple-600">{stats.vip}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Inactive Customers</span>
              <span className="font-bold text-rose-600">{stats.inactive}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
            <FaMoneyBillWave className="text-emerald-500 text-sm" />
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Financial Summary</h3>
          </div>
          <div className="space-y-3.5 text-xs text-slate-600">
            <div className="flex justify-between items-center">
              <span>Total spent valuation</span>
              <span className="font-bold text-emerald-600">Rp {stats.totalRevenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Average spent per customer</span>
              <span className="font-bold text-primary">
                Rp {Math.round(stats.total / stats.total > 0 ? stats.totalRevenue / stats.total : 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ADD/EDIT CUSTOMER MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden border border-slate-250/80 animate-slide">
            <div className="border-b border-slate-100 p-5 flex items-center gap-3 bg-slate-50">
              <div className="w-9 h-9 rounded-xl bg-primary-light flex items-center justify-center text-primary text-sm">
                <FaUserPlus />
              </div>
              <div>
                <h2 className="text-xs font-bold text-slate-900">
                  {editingCustomer ? "Edit Customer" : "Add New Customer"}
                </h2>
                <p className="text-[10px] text-slate-400">
                  {editingCustomer ? "Perbarui rincian profil pelanggan" : "Tambahkan pelanggan baru ke BUIQ"}
                </p>
              </div>
            </div>

            <div className="p-5 space-y-3.5">
              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Customer Name</label>
                <input
                  type="text"
                  placeholder="e.g. Alya Putri"
                  className="buiq-input"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. customer@gmail.com"
                  className="buiq-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="e.g. 0812-3456-789"
                  className="buiq-input"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Address</label>
                <textarea
                  placeholder="e.g. Jl. Sudirman No. 21"
                  className="buiq-input min-h-[60px]"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Status</label>
                <select
                  className="buiq-input bg-white"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option>Active</option>
                  <option>VIP</option>
                  <option>Inactive</option>
                </select>
              </div>

              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Orders</label>
                <input
                  type="number"
                  placeholder="e.g. 15"
                  className="buiq-input"
                  value={formData.totalOrders}
                  onChange={(e) => setFormData({ ...formData, totalOrders: e.target.value })}
                />
              </div>

              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Spent Valuation (Rp)</label>
                <input
                  type="number"
                  placeholder="e.g. 2500000"
                  className="buiq-input"
                  value={formData.totalSpent}
                  onChange={(e) => setFormData({ ...formData, totalSpent: e.target.value })}
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-primary hover:bg-primary-hover text-white py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-primary/10 disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {isSubmitting && <ImSpinner2 className="animate-spin text-sm" />}
                  <span>{editingCustomer ? "Save Changes" : "Add Customer"}</span>
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