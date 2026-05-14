import { useState, useMemo } from "react";
import {
  FaUsers,
  FaUserPlus,
  FaSearch,
  FaMoneyBillWave,
  FaCheckCircle,
  FaTimesCircle,
  FaArrowUp,
  FaEye,
  FaCrown,
  FaEnvelope,
  FaShoppingBag,
} from "react-icons/fa";

const generateCustomers = () => {
  const names = [
    "Alya Putri",
    "Rizky Pratama",
    "Nadia Azzahra",
    "Fajar Ramadhan",
    "Citra Lestari",
    "Kevin Wijaya",
    "Dinda Maharani",
    "Raka Saputra",
    "Salsa Nabila",
    "Andi Firmansyah",
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
  const [customers, setCustomers] = useState(initialCustomers);
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

    const matchesStatus =
      selectedStatus === "All" || c.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const stats = useMemo(() => {
    const totalRevenue = customers.reduce(
      (sum, c) => sum + c.totalSpent,
      0
    );

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
      customerId:
        customers.length > 0
          ? Math.max(...customers.map((c) => c.customerId)) + 1
          : 1,

      customerCode: `CUST-${String(customers.length + 1).padStart(
        4,
        "0"
      )}`,

      image:
        formData.imageUrl ||
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",

      customerName: formData.customerName,
      email: formData.email,
      status: formData.status,
      totalOrders: parseInt(formData.totalOrders || 0),
      totalSpent: parseInt(formData.totalSpent || 0),
    };

    setCustomers([newCustomer, ...customers]);

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
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen p-6 space-y-6">
      
      {/* HEADER */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl shadow-2xl p-8">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
              <FaUsers className="text-white text-3xl" />
            </div>

            <div>
              <h1 className="text-3xl font-black text-white">
                BUIQ Customer Management
              </h1>

              <p className="text-blue-100 text-sm mt-1">
                Dashboard / Customers
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70 text-sm" />

              <input
                type="text"
                placeholder="Search customer..."
                className="pl-10 pr-4 py-2 rounded-xl bg-white/20 border border-white/30 text-white placeholder:text-white/70 outline-none"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="bg-white text-blue-600 px-5 py-2 rounded-xl text-sm font-bold hover:shadow-lg transition-all flex items-center gap-2"
            >
              <FaUserPlus />
              Add Customer
            </button>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Customers",
            val: stats.total,
            icon: <FaUsers className="text-blue-500 text-xl" />,
          },
          {
            label: "Active Customers",
            val: stats.active,
            icon: <FaCheckCircle className="text-green-500 text-xl" />,
          },
          {
            label: "VIP Customers",
            val: stats.vip,
            icon: <FaCrown className="text-purple-500 text-xl" />,
          },
          {
            label: "Revenue",
            val: `Rp ${(stats.totalRevenue / 1000000).toFixed(1)}M`,
            icon: (
              <FaMoneyBillWave className="text-emerald-500 text-xl" />
            ),
          },
        ].map((s, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-lg transition-all"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  {s.label}
                </p>

                <p className="text-2xl font-black text-gray-800 mt-1">
                  {s.val}
                </p>
              </div>

              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                {s.icon}
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <FaArrowUp className="text-green-500" />
              <span className="text-green-600 font-bold">
                +12%
              </span>
              <span className="text-gray-400">
                vs last month
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* FILTER */}
      <div className="flex gap-2 flex-wrap">
        {["All", "Active", "VIP", "Inactive"].map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
              selectedStatus === status
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-600"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-500 text-xs uppercase">
                <th className="p-4 text-left">Customer</th>
                <th className="p-4 text-left">Code</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Orders</th>
                <th className="p-4 text-left">Total Spent</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredCustomers.map((customer) => (
                <tr
                  key={customer.customerId}
                  className="hover:bg-blue-50 transition-all"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={customer.image}
                        alt={customer.customerName}
                        className="w-12 h-12 rounded-xl object-cover"
                      />

                      <div>
                        <div className="font-bold text-gray-800">
                          {customer.customerName}
                        </div>

                        <div className="text-xs text-gray-400">
                          ID: {customer.customerId}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <span className="bg-gray-100 px-2 py-1 rounded-lg text-xs font-mono">
                      {customer.customerCode}
                    </span>
                  </td>

                  <td className="p-4 text-gray-600">
                    {customer.email}
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                        customer.status === "VIP"
                          ? "bg-purple-100 text-purple-700"
                          : customer.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {customer.status}
                    </span>
                  </td>

                  <td className="p-4 font-bold text-gray-700">
                    {customer.totalOrders} Orders
                  </td>

                  <td className="p-4 font-bold text-blue-600">
                    Rp {customer.totalSpent.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-gray-100 p-4 bg-gray-50 flex justify-between items-center">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FaUsers className="text-blue-500" />
            <span>
              Showing {filteredCustomers.length} of {customers.length} customers
            </span>
          </div>
        </div>
      </div>

      {/* FINANCIAL */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FaUsers className="text-blue-500 text-xl" />
              <h3 className="font-bold text-gray-800">
                Customer Overview
              </h3>
            </div>

            <FaEye className="text-blue-400" />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Active Customers</span>
              <span className="font-bold text-green-600">
                {stats.active}
              </span>
            </div>

            <div className="flex justify-between">
              <span>VIP Customers</span>
              <span className="font-bold text-purple-600">
                {stats.vip}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Inactive Customers</span>
              <span className="font-bold text-rose-600">
                {stats.inactive}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
          <div className="flex items-center gap-2 mb-4">
            <FaMoneyBillWave className="text-emerald-500 text-xl" />
            <h3 className="font-bold text-gray-800">
              Financial Summary
            </h3>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Total Revenue</span>

              <span className="font-bold text-emerald-600">
                Rp {stats.totalRevenue.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Average Spending</span>

              <span className="font-bold text-blue-600">
                Rp{" "}
                {Math.round(
                  stats.totalRevenue / stats.total
                ).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
            
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <FaUserPlus className="text-xl" />
                </div>

                <div>
                  <h2 className="text-2xl font-black">
                    Add New Customer
                  </h2>

                  <p className="text-blue-100 text-sm">
                    Tambahkan customer baru
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              
              <input
                type="text"
                placeholder="Customer Name"
                className="w-full border border-gray-200 p-3 rounded-xl outline-none"
                value={formData.customerName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    customerName: e.target.value,
                  })
                }
              />

              <input
                type="email"
                placeholder="Email"
                className="w-full border border-gray-200 p-3 rounded-xl outline-none"
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value,
                  })
                }
              />

              <select
                className="w-full border border-gray-200 p-3 rounded-xl outline-none"
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value,
                  })
                }
              >
                <option>Active</option>
                <option>VIP</option>
                <option>Inactive</option>
              </select>

              <input
                type="number"
                placeholder="Total Orders"
                className="w-full border border-gray-200 p-3 rounded-xl outline-none"
                value={formData.totalOrders}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    totalOrders: e.target.value,
                  })
                }
              />

              <input
                type="number"
                placeholder="Total Spent"
                className="w-full border border-gray-200 p-3 rounded-xl outline-none"
                value={formData.totalSpent}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    totalSpent: e.target.value,
                  })
                }
              />

              <input
                type="text"
                placeholder="Image URL"
                className="w-full border border-gray-200 p-3 rounded-xl outline-none"
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    imageUrl: e.target.value,
                  })
                }
              />

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleAddCustomer}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-bold"
                >
                  Add Customer
                </button>

                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold"
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