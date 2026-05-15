import { useState, useMemo } from "react";
import {
  FaShoppingCart,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaSearch,
  FaPlus,
  FaUser,
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
    {
      id: 1,
      name: "Alya Putri",
      avatar: "https://i.pravatar.cc/150?img=1",
      product: "Silk Midi Dress",
    },
    {
      id: 2,
      name: "Rizky Pratama",
      avatar: "https://i.pravatar.cc/150?img=2",
      product: "Oversized Blazer",
    },
    {
      id: 3,
      name: "Nadia Azzahra",
      avatar: "https://i.pravatar.cc/150?img=3",
      product: "Pleated Skirt",
    },
    {
      id: 4,
      name: "Kevin Wijaya",
      avatar: "https://i.pravatar.cc/150?img=4",
      product: "Wide Leg Pants",
    },
    {
      id: 5,
      name: "Salsa Nabila",
      avatar: "https://i.pravatar.cc/150?img=5",
      product: "Knit Sweater",
    },
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
      orderDate: `2026-${String(
        Math.floor(1 + Math.random() * 12)
      ).padStart(2, "0")}-${String(
        Math.floor(1 + Math.random() * 28)
      ).padStart(2, "0")}`,
    });
  }

  return orders;
};

const initialOrders = generateOrders();

export default function OrdersManagement() {
  const [orders, setOrders] = useState(initialOrders);

  const [showModal, setShowModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedStatus, setSelectedStatus] =
    useState("All");

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
      o.customerName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      o.orderId.toString().includes(searchTerm) ||
      o.product
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === "All" ||
      o.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const stats = useMemo(() => {
    return {
      total: orders.length,

      completed: orders.filter(
        (o) => o.status === "Completed"
      ).length,

      pending: orders.filter(
        (o) => o.status === "Pending"
      ).length,

      cancelled: orders.filter(
        (o) => o.status === "Cancelled"
      ).length,

      totalRevenue: orders.reduce(
        (sum, o) => sum + o.totalPrice,
        0
      ),
    };
  }, [orders]);

  const handleAddOrder = () => {
    if (
      !formData.customerName ||
      !formData.product ||
      !formData.totalPrice ||
      !formData.orderDate
    ) {
      alert("Harap isi semua field!");
      return;
    }

    const newOrder = {
      orderId:
        orders.length > 0
          ? Math.max(...orders.map((o) => o.orderId)) + 1
          : 1,

      ...formData,

      customerAvatar: `https://i.pravatar.cc/150?img=${
        Math.floor(Math.random() * 70)
      }`,

      totalPrice: parseInt(formData.totalPrice),
    };

    setOrders([newOrder, ...orders]);

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
      case "Completed":
        return (
          <FaCheckCircle className="text-green-500" />
        );

      case "Pending":
        return (
          <FaClock className="text-amber-500" />
        );

      case "Cancelled":
        return (
          <FaTimesCircle className="text-rose-500" />
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen p-6 space-y-6">
      
      {/* HEADER - Warna Biru */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-500 to-cyan-600 rounded-3xl shadow-2xl p-8">

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
              <FaShoppingCart className="text-white text-3xl" />
            </div>

            <div>
              <h1 className="text-3xl font-black text-white">
                BUIQ Orders Management
              </h1>

              <p className="text-blue-100 text-sm mt-1">
                Dashboard / Orders
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70 text-sm" />

              <input
                type="text"
                placeholder="Search order..."
                className="pl-10 pr-4 py-2 rounded-xl bg-white/20 border border-white/30 text-white placeholder:text-white/70 outline-none"
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
              />
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="bg-white text-blue-600 px-5 py-2 rounded-xl font-bold flex items-center gap-2"
            >
              <FaPlus />
              Add Order
            </button>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        {[
          {
            label: "Total Orders",
            val: stats.total,
            icon: (
              <FaShoppingCart className="text-blue-500 text-xl" />
            ),
          },

          {
            label: "Completed",
            val: stats.completed,
            icon: (
              <FaCheckCircle className="text-green-500 text-xl" />
            ),
          },

          {
            label: "Pending",
            val: stats.pending,
            icon: (
              <FaClock className="text-amber-500 text-xl" />
            ),
          },

          {
            label: "Revenue",
            val: `Rp ${stats.totalRevenue.toLocaleString()}`,
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
                +15%
              </span>

              <span className="text-gray-400">
                vs last month
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* FILTER - Warna Biru */}
      <div className="flex gap-2 flex-wrap">
        {[
          "All",
          "Completed",
          "Pending",
          "Cancelled",
        ].map((status) => (
          <button
            key={status}
            onClick={() =>
              setSelectedStatus(status)
            }
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

                <th className="p-4 text-left">
                  Order ID
                </th>

                <th className="p-4 text-left">
                  Customer
                </th>

                <th className="p-4 text-left">
                  Product
                </th>

                <th className="p-4 text-left">
                  Status
                </th>

                <th className="p-4 text-left">
                  Total Price
                </th>

                <th className="p-4 text-left">
                  Order Date
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">

              {filteredOrders.map((order) => (
                <tr
                  key={order.orderId}
                  className="hover:bg-blue-50 transition-all"
                >

                  <td className="p-4">
                    <span className="bg-gray-100 px-3 py-1 rounded-xl font-bold">
                      #{order.orderId}
                    </span>
                   </td>

                  <td className="p-4">
                    <div className="flex items-center gap-3">

                      <img
                        src={order.customerAvatar}
                        alt={order.customerName}
                        className="w-10 h-10 rounded-full object-cover"
                      />

                      <div>
                        <div className="font-bold text-gray-800">
                          {order.customerName}
                        </div>

                        <div className="text-xs text-gray-400">
                          Customer ID: {order.customerId}
                        </div>
                      </div>
                    </div>
                   </td>

                  <td className="p-4 font-medium text-gray-700">
                    {order.product}
                   </td>

                  <td className="p-4">
                    <div className="flex items-center gap-2">

                      {getStatusIcon(order.status)}

                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase
                        
                        ${
                          order.status === "Completed"
                            ? "bg-green-100 text-green-700"
                            : ""
                        }

                        ${
                          order.status === "Pending"
                            ? "bg-amber-100 text-amber-700"
                            : ""
                        }

                        ${
                          order.status === "Cancelled"
                            ? "bg-rose-100 text-rose-700"
                            : ""
                        }
                        
                        `}
                      >
                        {order.status}
                      </span>
                    </div>
                   </td>

                  <td className="p-4 font-bold text-blue-600">
                    Rp{" "}
                    {order.totalPrice.toLocaleString()}
                   </td>

                  <td className="p-4">
                    <div className="flex items-center gap-2 text-gray-500">
                      <FaCalendarAlt className="text-xs" />

                      {order.orderDate}
                    </div>
                   </td>
                 </tr>
              ))}
            </tbody>
           </table>
        </div>

        {/* FOOTER */}
        <div className="border-t border-gray-100 p-4 bg-gray-50 flex justify-between items-center">

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FaTruck className="text-blue-500" />

            <span>
              Showing {filteredOrders.length} of{" "}
              {orders.length} orders
            </span>
          </div>
        </div>
      </div>

      {/* SUMMARY - Warna Biru */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">

          <div className="flex items-center justify-between mb-4">

            <div className="flex items-center gap-2">
              <FaBox className="text-blue-500 text-xl" />

              <h3 className="font-bold text-gray-800">
                Orders Overview
              </h3>
            </div>

            <FaEye className="text-blue-400" />
          </div>

          <div className="space-y-4">

            <div className="flex justify-between">
              <span>Completed Orders</span>

              <span className="font-bold text-green-600">
                {stats.completed}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Pending Orders</span>

              <span className="font-bold text-amber-600">
                {stats.pending}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Cancelled Orders</span>

              <span className="font-bold text-rose-600">
                {stats.cancelled}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">

          <div className="flex items-center gap-2 mb-4">
            <FaMoneyBillWave className="text-emerald-500 text-xl" />

            <h3 className="font-bold text-gray-800">
              Revenue Summary
            </h3>
          </div>

          <div className="space-y-4">

            <div className="flex justify-between">
              <span>Total Revenue</span>

              <span className="font-bold text-emerald-600">
                Rp{" "}
                {stats.totalRevenue.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Average Order</span>

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

      {/* MODAL - Warna Biru */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">

            <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-6 text-white">

              <div className="flex items-center gap-3">

                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <FaPlus className="text-xl" />
                </div>

                <div>
                  <h2 className="text-2xl font-black">
                    New Order
                  </h2>

                  <p className="text-blue-100 text-sm">
                    Tambahkan order baru
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">

              <input
                type="text"
                placeholder="Customer Name"
                className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                value={formData.customerName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    customerName:
                      e.target.value,
                  })
                }
              />

              <input
                type="text"
                placeholder="Product Name"
                className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                value={formData.product}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    product: e.target.value,
                  })
                }
              />

              <select
                className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value,
                  })
                }
              >
                <option>Pending</option>
                <option>Completed</option>
                <option>Cancelled</option>
              </select>

              <input
                type="number"
                placeholder="Total Price"
                className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                value={formData.totalPrice}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    totalPrice:
                      e.target.value,
                  })
                }
              />

              <input
                type="date"
                className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                value={formData.orderDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    orderDate:
                      e.target.value,
                  })
                }
              />

              <div className="flex gap-3 pt-4">

                <button
                  onClick={handleAddOrder}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-3 rounded-xl font-bold hover:from-blue-600 hover:to-cyan-700 transition-all"
                >
                  Confirm Order
                </button>

                <button
                  onClick={() =>
                    setShowModal(false)
                  }
                  className="px-6 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all"
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