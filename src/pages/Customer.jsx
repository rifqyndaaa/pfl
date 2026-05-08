import { useState } from "react";
import PageHeader from "../components/PageHeader";
import { FaUserPlus, FaCrown, FaMedal, FaAward, FaSearch } from "react-icons/fa";

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
  const [searchQuery, setSearchQuery] = useState("");
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
    const newCustomer = { customerId: customers.length + 1, ...formData };
    setCustomers([newCustomer, ...customers]);
    setShowModal(false);
    setFormData({ customerName: "", email: "", phone: "", loyalty: "Bronze" });
  };

  const filteredCustomers = customers.filter(c => 
    c.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Customers" breadcrumb="Dashboard / Customers">
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-500 text-white px-6 py-2.5 rounded-2xl text-sm font-bold shadow-lg shadow-green-200 hover:bg-green-600 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
        >
          <FaUserPlus /> Add Customer
        </button>
      </PageHeader>

      {/* --- QUICK STATS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Gold Members", count: customers.filter(c => c.loyalty === "Gold").length, icon: FaCrown, color: "text-yellow-500", bg: "bg-yellow-50" },
          { label: "Silver Members", count: customers.filter(c => c.loyalty === "Silver").length, icon: FaAward, color: "text-slate-400", bg: "bg-slate-50" },
          { label: "Bronze Members", count: customers.filter(c => c.loyalty === "Bronze").length, icon: FaMedal, color: "text-orange-500", bg: "bg-orange-50" },
        ].map((stat, i) => (
          <div key={i} className={`${stat.bg} p-5 rounded-[2rem] border border-white flex items-center gap-4 shadow-sm`}>
            <div className={`w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-xl shadow-sm ${stat.color}`}>
              <stat.icon />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
              <p className="text-2xl font-black text-slate-800">{stat.count}</p>
            </div>
          </div>
        ))}
      </div>

      {/* --- TABLE CONTAINER --- */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <h3 className="font-black text-slate-800">Customer Directory</h3>
          <div className="relative w-full md:w-64">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
            <input 
              type="text" 
              placeholder="Search customers..." 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                <th className="px-6 py-4 text-left">ID</th>
                <th className="px-6 py-4 text-left">Information</th>
                <th className="px-6 py-4 text-left">Phone Number</th>
                <th className="px-6 py-4 text-left">Loyalty Status</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredCustomers.map((c) => (
                <tr key={c.customerId} className="group hover:bg-green-50/30 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-400">#{c.customerId}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400 group-hover:bg-green-500 group-hover:text-white transition-all">
                        {c.customerName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-slate-700 leading-none mb-1">{c.customerName}</p>
                        <p className="text-[11px] text-slate-400">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-medium">{c.phone}</td>
                  <td className="px-6 py-4">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tighter inline-block
                      ${c.loyalty === "Gold" ? "bg-yellow-100 text-yellow-600 border border-yellow-200" : ""}
                      ${c.loyalty === "Silver" ? "bg-slate-100 text-slate-500 border border-slate-200" : ""}
                      ${c.loyalty === "Bronze" ? "bg-orange-100 text-orange-600 border border-orange-200" : ""}
                    `}>
                      {c.loyalty}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="text-slate-300 hover:text-red-500 font-bold transition-colors">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- PREMIUM MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white p-8 rounded-[3rem] w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
                <FaUserPlus />
              </div>
              <h2 className="text-2xl font-black text-slate-800">New Customer</h2>
              <p className="text-slate-400 text-sm">Register a new member to the system</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rifqi Aldi"
                  className="w-full bg-slate-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-green-500/20 outline-none transition-all font-bold text-slate-700"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Email</label>
                  <input
                    type="email"
                    className="w-full bg-slate-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-green-500/20 outline-none transition-all font-bold text-slate-700"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Loyalty</label>
                  <select
                    className="w-full bg-slate-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-green-500/20 outline-none transition-all font-bold text-slate-700 appearance-none"
                    value={formData.loyalty}
                    onChange={(e) => setFormData({ ...formData, loyalty: e.target.value })}
                  >
                    <option>Bronze</option>
                    <option>Silver</option>
                    <option>Gold</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Phone</label>
                <input
                  type="text"
                  className="w-full bg-slate-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-green-500/20 outline-none transition-all font-bold text-slate-700"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="flex gap-3 pt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-slate-100 text-slate-500 py-4 rounded-[1.5rem] font-black hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCustomer}
                  className="flex-1 bg-green-500 text-white py-4 rounded-[1.5rem] font-black shadow-lg shadow-green-200 hover:bg-green-600 transition-all"
                >
                  Add Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}