import { useState } from "react";
import PageHeader from "../components/PageHeader";

// Generate data
const generateCustomers = () => {
  const loyalties = ["Bronze", "Silver", "Gold"];
  const names = ["Rifqi", "Aldi", "Rina", "Dimas", "Salsa", "Naufal", "Putri", "Raka", "Nabila", "Fikri"];
  const customers = [];
  for (let i = 1; i <= 30; i++) {
    customers.push({
      customerId: i,
      customerName: `${names[i % names.length]} ${i}`,
      email: `customer${i}@example.com`,
      phone: `0812${String(i).padStart(4,'0')}${String(i).padStart(4,'0')}`,
      loyalty: loyalties[i % 3],
    });
  }
  return customers;
};

const initialCustomers = generateCustomers();

export default function CustomerManagement() {
  const [customers, setCustomers] = useState(initialCustomers);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phone: "",
    loyalty: "Bronze"
  });

  const handleAddCustomer = () => {
    if (!formData.customerName || !formData.email || !formData.phone) {
      alert("Harap isi semua field!");
      return;
    }

    const newCustomer = {
      customerId: customers.length + 1,
      ...formData
    };

    setCustomers([...customers, newCustomer]);
    setShowModal(false);
    setFormData({ customerName: "", email: "", phone: "", loyalty: "Bronze" });
  };

  return (
    <div>
      <PageHeader title="Customer Management" breadcrumb="Dashboard / Customers">
        <button
          onClick={() => setShowModal(true)}
          className="bg-hijau text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-green-600 transition"
        >
          + Add Customer
        </button>
      </PageHeader>

      {/* TABLE */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr className="text-gray-400 text-xs uppercase">
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Loyalty</th>
            </tr>
          </thead>

          <tbody>
            {customers.map((c) => (
              <tr
                key={c.customerId}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="p-3">{c.customerId}</td>

                <td className="p-3 font-medium text-gray-700">
                  {c.customerName}
                </td>

                <td className="p-3 text-gray-500">{c.email}</td>

                <td className="p-3 text-gray-500">{c.phone}</td>

                <td className="p-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold
                    ${c.loyalty === "Gold" && "bg-yellow-100 text-yellow-600"}
                    ${c.loyalty === "Silver" && "bg-gray-200 text-gray-600"}
                    ${c.loyalty === "Bronze" && "bg-orange-100 text-orange-600"}
                  `}>
                    {c.loyalty}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-96 shadow-xl animate-scaleIn">
            
            <h2 className="text-lg font-bold mb-4 text-gray-800">
              Add New Customer
            </h2>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full border border-gray-200 p-2.5 rounded-xl focus:outline-none focus:border-hijau"
                value={formData.customerName}
                onChange={(e) =>
                  setFormData({ ...formData, customerName: e.target.value })
                }
              />

              <input
                type="email"
                placeholder="Email Address"
                className="w-full border border-gray-200 p-2.5 rounded-xl focus:outline-none focus:border-hijau"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Phone Number"
                className="w-full border border-gray-200 p-2.5 rounded-xl focus:outline-none focus:border-hijau"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />

              <select
                className="w-full border border-gray-200 p-2.5 rounded-xl focus:outline-none focus:border-hijau"
                value={formData.loyalty}
                onChange={(e) =>
                  setFormData({ ...formData, loyalty: e.target.value })
                }
              >
                <option>Bronze</option>
                <option>Silver</option>
                <option>Gold</option>
              </select>

              <div className="flex gap-2 pt-3">
                <button
                  onClick={handleAddCustomer}
                  className="flex-1 bg-hijau text-white py-2 rounded-xl hover:bg-green-600 transition"
                >
                  Save
                </button>

                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-200 text-gray-600 py-2 rounded-xl hover:bg-gray-300 transition"
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