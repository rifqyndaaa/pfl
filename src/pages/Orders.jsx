import { useState } from "react";
import PageHeader from "../components/PageHeader";

// Generate 30 data orders
const generateOrders = () => {
  const statuses = ["Pending", "Completed", "Cancelled"];

  const customers = [
    { id: 1, name: "Rifqi" },
    { id: 2, name: "Aldi" },
    { id: 3, name: "Rina" },
    { id: 4, name: "Dimas" },
    { id: 5, name: "Salsa" },
    { id: 6, name: "Naufal" },
    { id: 7, name: "Putri" },
    { id: 8, name: "Raka" },
    { id: 9, name: "Nabila" },
    { id: 10, name: "Fikri" },
  ];

  const orders = [];

  for (let i = 1; i <= 30; i++) {
    const cust = customers[i % customers.length];

    orders.push({
      orderId: i, // ✅ sekarang 1,2,3...
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
  const [formData, setFormData] = useState({
    customerId: "",
    customerName: "",
    status: "Pending",
    totalPrice: "",
    orderDate: "",
  });

  const handleAddOrder = () => {
    if (!formData.customerId || !formData.customerName || !formData.totalPrice || !formData.orderDate) {
      alert("Harap isi semua field!");
      return;
    }

    const newOrder = {
      orderId: orders.length + 1, // ✅ auto lanjut angka
      ...formData,
      totalPrice: parseInt(formData.totalPrice),
    };

    setOrders([newOrder, ...orders]);
    setShowModal(false);
    setFormData({
      customerId: "",
      customerName: "",
      status: "Pending",
      totalPrice: "",
      orderDate: "",
    });
  };

  return (
    <div>
      <PageHeader title="Order List" breadcrumb="Dashboard / Orders">
        <button
          onClick={() => setShowModal(true)}
          className="bg-hijau text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-green-600 transition"
        >
          + Add Order
        </button>
      </PageHeader>

      {/* TABLE */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr className="text-gray-400 text-xs uppercase">
              <th className="p-3 text-left">Order ID</th>
              <th className="p-3 text-left">Customer ID</th>
              <th className="p-3 text-left">Customer Name</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Total Price</th>
              <th className="p-3 text-left">Order Date</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.orderId} className="border-t hover:bg-gray-50 transition">
                <td className="p-3 font-medium">{order.orderId}</td>
                <td className="p-3">{order.customerId}</td>
                <td className="p-3">{order.customerName}</td>

                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold
                    ${order.status === "Completed" && "bg-green-100 text-green-700"}
                    ${order.status === "Pending" && "bg-yellow-100 text-yellow-700"}
                    ${order.status === "Cancelled" && "bg-red-100 text-red-700"}
                  `}>
                    {order.status}
                  </span>
                </td>

                <td className="p-3">Rp {order.totalPrice.toLocaleString()}</td>
                <td className="p-3">{order.orderDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-96 max-w-[90%] shadow-2xl">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Tambah Order Baru</h2>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Customer ID"
                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-hijau"
                value={formData.customerId}
                onChange={(e) => setFormData({...formData, customerId: e.target.value})}
              />

              <input
                type="text"
                placeholder="Customer Name"
                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-hijau"
                value={formData.customerName}
                onChange={(e) => setFormData({...formData, customerName: e.target.value})}
              />

              <select
                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-hijau"
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
              >
                <option>Pending</option>
                <option>Completed</option>
                <option>Cancelled</option>
              </select>

              <input
                type="number"
                placeholder="Total Price"
                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-hijau"
                value={formData.totalPrice}
                onChange={(e) => setFormData({...formData, totalPrice: e.target.value})}
              />

              <input
                type="date"
                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-hijau"
                value={formData.orderDate}
                onChange={(e) => setFormData({...formData, orderDate: e.target.value})}
              />

              <div className="flex gap-2 pt-2">
                <button onClick={handleAddOrder} className="bg-hijau text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">
                  Simpan
                </button>
                <button onClick={() => setShowModal(false)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition">
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 