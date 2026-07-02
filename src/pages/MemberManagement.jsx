import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useCustomers } from "../hooks/useCustomers";
import {
  FaUsers,
  FaUserPlus,
  FaSearch,
  FaRegCalendarAlt,
  FaPhone,
  FaChevronRight,
  FaFilter,
  FaExclamationTriangle
} from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";

// Helper to determine customer loyalty membership type dynamically from spent
const getMembershipType = (spent) => {
  const s = parseFloat(spent || 0);
  if (s >= 15000000) return "Platinum";
  if (s >= 5000000) return "Gold";
  if (s >= 1500000) return "Silver";
  return "Bronze";
};

// Helper to map selected tier to its minimum spent threshold
const getSpentForTier = (tier) => {
  switch (tier) {
    case "Platinum": return 15000000;
    case "Gold": return 5000000;
    case "Silver": return 1500000;
    default: return 0;
  }
};

export default function MemberManagement() {
  const {
    customers,
    loading,
    error,
    addCustomer
  } = useCustomers();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    membershipType: "Bronze",
    status: "Active",
    totalOrders: "0",
    totalSpending: "0"
  });

  // Filtered members list
  const filteredMembers = useMemo(() => {
    return customers.filter((m) => {
      const tier = m.membership_tier || "Bronze";
      const matchesSearch =
        m.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.customer_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
      
      const matchesType = selectedType === "All" || tier.toLowerCase() === selectedType.toLowerCase();
      const matchesStatus = selectedStatus === "All" || m.status === selectedStatus;
      
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [customers, searchTerm, selectedType, selectedStatus]);

  // Add Member handler
  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone) {
      alert("Harap isi semua field utama!");
      return;
    }

    setIsSubmitting(true);
    try {
      const minSpent = getSpentForTier(formData.membershipType);
      const enteredSpent = parseFloat(formData.totalSpending || 0);

      const payload = {
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        status: formData.status,
        total_orders: parseInt(formData.totalOrders || 0),
        total_spent: Math.max(minSpent, enteredSpent),
        membership_tier: formData.membershipType,
        points: formData.membershipType === "Platinum" ? 1000 : formData.membershipType === "Gold" ? 500 : formData.membershipType === "Silver" ? 100 : 0,
        address: ""
      };

      await addCustomer(payload);

      // Reset Form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        membershipType: "Bronze",
        status: "Active",
        totalOrders: "0",
        totalSpending: "0"
      });
      setShowModal(false);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Active":
        return "bg-emerald-50 text-emerald-700 border border-emerald-100";
      case "Inactive":
        return "bg-slate-50 text-slate-600 border border-slate-200";
      case "Suspended":
        return "bg-rose-50 text-rose-700 border border-rose-100";
      default:
        return "bg-slate-50 text-slate-600";
    }
  };

  const getTypeBadge = (type) => {
    const t = type ? type.toUpperCase() : "";
    switch (t) {
      case "PLATINUM":
      case "VIP":
        return "bg-purple-50 text-purple-700 border border-purple-100 font-extrabold";
      case "GOLD":
        return "bg-amber-50 text-amber-700 border border-amber-100 font-bold";
      case "SILVER":
        return "bg-slate-50 text-slate-700 border border-slate-200 font-semibold";
      case "BRONZE":
      case "BASIC":
      default:
        return "bg-slate-50 text-slate-550 border border-slate-150 font-medium";
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <span className="text-xs text-slate-500 font-semibold">Mengambil data member...</span>
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

      {/* ── CONTROL BAR ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm">
        {/* Search and filter fields */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
            <input
              type="text"
              placeholder="Search ID, name, email..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary text-xs outline-none transition-all placeholder:text-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Membership Type Filter */}
          <div className="flex items-center gap-1.5 border border-slate-200 rounded-xl p-0.5 bg-slate-50 text-[10px] font-semibold">
            <span className="text-slate-400 px-2 flex items-center gap-1">
              <FaFilter size={8} /> Type:
            </span>
            {["All", "Bronze", "Silver", "Gold", "Platinum"].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  selectedType === type ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 border border-slate-200 rounded-xl p-0.5 bg-slate-50 text-[10px] font-semibold">
            <span className="text-slate-400 px-2 flex items-center gap-1">
              <FaFilter size={8} /> Status:
            </span>
            {["All", "Active", "Inactive", "Suspended"].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  selectedStatus === status ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Add Member button */}
        <button
          onClick={() => setShowModal(true)}
          className="w-full md:w-auto bg-primary hover:bg-primary-hover text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
        >
          <FaUserPlus size={12} />
          <span>Add Member</span>
        </button>
      </div>

      {/* ── MEMBERS TABLE ── */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200/80">
                <th className="py-3 px-4">Member Info</th>
                <th className="py-3 px-4">Member ID</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4">Membership Type</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Join Date</th>
                <th className="py-3 px-4 text-center">Orders</th>
                <th className="py-3 px-4 text-right">Spending</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMembers.map((member) => {
                const tier = member.membership_tier || "Bronze";
                return (
                  <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(member.email)}`}
                          alt={member.full_name}
                          className="w-10 h-10 rounded-xl object-cover shadow-sm border border-slate-150"
                        />
                        <div className="font-bold text-slate-800">{member.full_name}</div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-400">
                      <span className="bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200">
                        {member.customer_code}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-600">
                      <p>{member.email}</p>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <FaPhone className="text-[8px]" /> {member.phone || "-"}
                      </p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${getTypeBadge(tier)}`}>
                        {tier}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${getStatusBadge(member.status)}`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center text-slate-500 font-medium">
                      <div className="inline-flex items-center gap-1.5">
                        <FaRegCalendarAlt className="text-[10px]" />
                        <span>{member.created_at ? new Date(member.created_at).toISOString().split("T")[0] : "-"}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-700">
                      {member.total_orders} Orders
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-primary">
                      Rp {parseFloat(member.total_spent).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <Link
                        to={`/member-management/${member.id}`}
                        className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200 hover:border-primary hover:bg-primary-light hover:text-primary transition-all px-2.5 py-1.5 rounded-xl font-bold text-[10px] text-slate-500 cursor-pointer shadow-sm"
                      >
                        <span>Profile</span>
                        <FaChevronRight size={8} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {filteredMembers.length === 0 && (
                <tr>
                  <td colSpan="9" className="py-8 text-center text-slate-400 font-medium">
                    No matching members found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info bar */}
        <div className="border-t border-slate-100 py-3.5 px-4 bg-slate-50/50 flex justify-between items-center text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-2">
            <FaUsers className="text-primary" />
            <span>Showing {filteredMembers.length} of {customers.length} members</span>
          </div>
        </div>
      </div>

      {/* ── ADD MEMBER MODAL ── */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <form onSubmit={handleAddMember} className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-200/80 animate-slide">
            <div className="border-b border-slate-100 p-5 flex items-center gap-3 bg-slate-50">
              <div className="w-9 h-9 rounded-xl bg-primary-light flex items-center justify-center text-primary text-sm shadow-sm">
                <FaUserPlus />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">Add New CRM Member</h2>
                <p className="text-[10px] text-slate-400">Daftarkan member loyalitas butik baru</p>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Budi Santoso"
                  className="buiq-input"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    placeholder="email@domain.com"
                    className="buiq-input"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Phone Number</label>
                  <input
                    type="text"
                    placeholder="e.g. 0812-3456-789"
                    className="buiq-input"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Membership Tier</label>
                  <select
                    className="buiq-input bg-white"
                    value={formData.membershipType}
                    onChange={(e) => setFormData({ ...formData, membershipType: e.target.value })}
                  >
                    <option value="Bronze">Bronze</option>
                    <option value="Silver">Silver</option>
                    <option value="Gold">Gold</option>
                    <option value="Platinum">Platinum</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Status</label>
                  <select
                    className="buiq-input bg-white"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Orders Count</label>
                  <input
                    type="number"
                    placeholder="e.g. 5"
                    className="buiq-input"
                    value={formData.totalOrders}
                    onChange={(e) => setFormData({ ...formData, totalOrders: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Total Spend (Rp)</label>
                  <input
                    type="number"
                    placeholder="e.g. 750000"
                    className="buiq-input"
                    value={formData.totalSpending}
                    onChange={(e) => setFormData({ ...formData, totalSpending: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-primary hover:bg-primary-hover text-white py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-primary/10 disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {isSubmitting && <ImSpinner2 className="animate-spin text-sm" />}
                  <span>Create Member</span>
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
