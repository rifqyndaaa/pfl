import { useState, useMemo } from "react";
import Card from "../components/Card";
import {
  FaUsers,
  FaUserPlus,
  FaSearch,
  FaMoneyBillWave,
  FaCheckCircle,
  FaArrowUp,
  FaEye,
  FaCrown,
  FaTimesCircle,
} from "react-icons/fa";

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

const initialCustomers = generateCustomers();

export default function BUIQCustomerManagement() {
  const [customers, setCustomers] = useState(() => {
    const stored = localStorage.getItem("buiq_customers");
    if (stored) return JSON.parse(stored);
    localStorage.setItem("buiq_customers", JSON.stringify(initialCustomers));
    return initialCustomers;
  });
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    status: "Active",
    totalOrders: "",
    totalSpent: "",
    imageUrl: "",
  });

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.customerCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === "All" || c.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = useMemo(() => {
    const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
    return {
      total: customers.length,
      active: customers.filter((c) => c.status === "Active").length,
      vip: customers.filter((c) => c.status === "VIP").length,
      inactive: customers.filter((c) => c.status === "Inactive").length,
      totalRevenue,
    };
  }, [customers]);

  const handleAddCustomer = () => {
    if (!formData.customerName || !formData.email) {
      alert("Harap isi semua field!");
      return;
    }

    const newCustomer = {
      customerId: customers.length > 0 ? Math.max(...customers.map((c) => c.customerId)) + 1 : 1,
      customerCode: `CUST-${String(customers.length + 1).padStart(4, "0")}`,
      image: formData.imageUrl || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      customerName: formData.customerName,
      email: formData.email,
      status: formData.status,
      totalOrders: parseInt(formData.totalOrders || 0),
      totalSpent: parseInt(formData.totalSpent || 0),
    };

    const updated = [newCustomer, ...customers];
    setCustomers(updated);
    localStorage.setItem("buiq_customers", JSON.stringify(updated));
    setFormData({
      customerName: "",
      email: "",
      status: "Active",
      totalOrders: "",
      totalSpent: "",
      imageUrl: "",
    });
    setShowModal(false);
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
              placeholder="Search by code, email or name..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary text-xs outline-none transition-all placeholder:text-slate-400"
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
          onClick={() => setShowModal(true)}
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
          { label: "Total Spent Valuation", val: `Rp ${(stats.totalRevenue / 1000000).toFixed(1)}M`, color: "text-emerald-600", icon: <FaMoneyBillWave /> },
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
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Orders</th>
                <th className="py-3 px-4">Total Spent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.map((customer) => (
                <tr key={customer.customerId} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={customer.image}
                        alt={customer.customerName}
                        className="w-10 h-10 rounded-lg object-cover shadow-sm border border-slate-100"
                      />
                      <div>
                        <div className="font-bold text-slate-800">{customer.customerName}</div>
                        <div className="text-[9px] text-slate-400">ID: {customer.customerId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-400">
                    <span className="bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200">
                      {customer.customerCode}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium">{customer.email}</td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider
                      ${customer.status === "VIP" ? "bg-purple-50 text-purple-700 border border-purple-100" : ""}
                      ${customer.status === "Active" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : ""}
                      ${customer.status === "Inactive" ? "bg-rose-50 text-rose-700 border border-rose-100" : ""}
                    `}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-700">{customer.totalOrders} Orders</td>
                  <td className="py-3.5 px-4 font-bold text-primary">
                    Rp {customer.totalSpent.toLocaleString()}
                  </td>
                </tr>
              ))}
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
            <FaEye className="text-slate-400 cursor-pointer hover:text-slate-600 transition-colors" />
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
              <span className="font-bold text-danger">{stats.inactive}</span>
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
                Rp {Math.round(stats.totalRevenue / stats.total).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ADD CUSTOMER MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden border border-slate-250/80 animate-slide">
            <div className="border-b border-slate-100 p-5 flex items-center gap-3 bg-slate-50">
              <div className="w-9 h-9 rounded-xl bg-primary-light flex items-center justify-center text-primary text-sm">
                <FaUserPlus />
              </div>
              <div>
                <h2 className="text-xs font-bold text-slate-900">Add New Customer</h2>
                <p className="text-[10px] text-slate-400">Tambahkan pelanggan baru ke BUIQ</p>
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
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. customer@gmail.com"
                  className="buiq-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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

              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Image Avatar URL (optional)</label>
                <input
                  type="text"
                  placeholder="Paste avatar image URL"
                  className="buiq-input"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  onClick={handleAddCustomer}
                  className="flex-1 bg-primary hover:bg-primary-hover text-white py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-primary/10"
                >
                  Add Customer
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