import { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FaUsers,
  FaUserPlus,
  FaSearch,
  FaRegCalendarAlt,
  FaPhone,
  FaChevronRight,
  FaFilter
} from "react-icons/fa";

// ─── Initial Fallback Data Generator ──────────────────────────────────────────
const generateMembers = () => {
  const names = [
    "Alya Putri", "Rizky Pratama", "Nadia Azzahra", "Fajar Ramadhan",
    "Citra Lestari", "Kevin Wijaya", "Dinda Maharani", "Raka Saputra",
    "Salsa Nabila", "Andi Firmansyah",
    "Budi Santoso", "Siti Aminah", "Eko Prasetyo", "Dewi Lestari", "Rian Hidayat"
  ];
  const membershipTypes = ["Basic", "Silver", "Gold", "VIP"];
  const statuses = ["Active", "Inactive", "Suspended"];
  const images = [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
  ];
  const phonePrefixes = ["0812", "0813", "0821", "0857", "0878"];

  const members = [];
  for (let i = 1; i <= 15; i++) {
    const name = names[i - 1];
    const type = membershipTypes[i % 4];
    const status = statuses[i % 3];
    // Spread joinDate registrations across 2026-01 to 2026-06
    const monthStr = String(Math.floor(1 + ((i - 1) % 6))).padStart(2, "0");
    const dayStr = String(1 + (i * 3) % 27).padStart(2, "0");
    
    members.push({
      memberId: `MEM-${String(i).padStart(4, "0")}`,
      fullName: name,
      email: `${name.toLowerCase().replace(/\s+/g, "")}@gmail.com`,
      phone: `${phonePrefixes[i % phonePrefixes.length]}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(100 + Math.random() * 900)}`,
      membershipType: type,
      status: status,
      joinDate: `2026-${monthStr}-${dayStr}`,
      totalOrders: Math.floor(2 + (i * 3) % 15),
      totalSpending: Math.floor(250000 + (i * 650000) % 6000000),
      image: images[i % images.length]
    });
  }
  return members;
};

// Charts removed for this page (displayed on Dashboard only)

// ─── Main Component ────────────────────────────────────────────────────────────
export default function MemberManagement() {
  const [members, setMembers] = useState(() => {
    const stored = localStorage.getItem("buiq_members");
    if (stored) return JSON.parse(stored);
    const initial = generateMembers();
    localStorage.setItem("buiq_members", JSON.stringify(initial));
    return initial;
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    membershipType: "Basic",
    status: "Active",
    totalOrders: "",
    totalSpending: "",
    imageUrl: ""
  });



  // Filtered members list
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchesSearch =
        m.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.memberId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = selectedType === "All" || m.membershipType === selectedType;
      const matchesStatus = selectedStatus === "All" || m.status === selectedStatus;
      
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [members, searchTerm, selectedType, selectedStatus]);



  // Add Member handler
  const handleAddMember = () => {
    if (!formData.fullName || !formData.email || !formData.phone) {
      alert("Harap isi semua field utama!");
      return;
    }

    const nextIdNum = members.length > 0 
      ? Math.max(...members.map(m => parseInt(m.memberId.split("-")[1], 10))) + 1 
      : 1;

    const newMember = {
      memberId: `MEM-${String(nextIdNum).padStart(4, "0")}`,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      membershipType: formData.membershipType,
      status: formData.status,
      joinDate: new Date().toISOString().split("T")[0],
      totalOrders: parseInt(formData.totalOrders || 0, 10),
      totalSpending: parseInt(formData.totalSpending || 0, 10),
      image: formData.imageUrl || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`
    };

    const updated = [newMember, ...members];
    setMembers(updated);
    localStorage.setItem("buiq_members", JSON.stringify(updated));
    
    // Sync storage event across active components
    window.dispatchEvent(new Event("storage"));

    // Reset Form
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      membershipType: "Basic",
      status: "Active",
      totalOrders: "",
      totalSpending: "",
      imageUrl: ""
    });
    setShowModal(false);
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
    switch (type) {
      case "VIP":
        return "bg-purple-50 text-purple-700 border border-purple-100 font-extrabold";
      case "Gold":
        return "bg-amber-50 text-amber-700 border border-amber-100 font-bold";
      case "Silver":
        return "bg-slate-50 text-slate-700 border border-slate-200 font-semibold";
      default:
        return "bg-slate-50 text-slate-500 font-medium";
    }
  };

  return (
    <div className="space-y-6">
      
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
            {["All", "Basic", "Silver", "Gold", "VIP"].map((type) => (
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
              {filteredMembers.map((member) => (
                <tr key={member.memberId} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={member.image}
                        alt={member.fullName}
                        className="w-10 h-10 rounded-xl object-cover shadow-sm border border-slate-150"
                      />
                      <div className="font-bold text-slate-800">{member.fullName}</div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-400">
                    <span className="bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200">
                      {member.memberId}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-600">
                    <p>{member.email}</p>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <FaPhone className="text-[8px]" /> {member.phone}
                    </p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${getTypeBadge(member.membershipType)}`}>
                      {member.membershipType}
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
                      <span>{member.joinDate}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-slate-700">
                    {member.totalOrders} Orders
                  </td>
                  <td className="py-3.5 px-4 text-right font-black text-primary">
                    Rp {member.totalSpending.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <Link
                      to={`/member-management/${member.memberId}`}
                      className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200 hover:border-primary hover:bg-primary-light hover:text-primary transition-all px-2.5 py-1.5 rounded-xl font-bold text-[10px] text-slate-500 cursor-pointer shadow-sm"
                    >
                      <span>Profile</span>
                      <FaChevronRight size={8} />
                    </Link>
                  </td>
                </tr>
              ))}
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
            <span>Showing {filteredMembers.length} of {members.length} members</span>
          </div>
        </div>
      </div>

      {/* ── ADD MEMBER MODAL ── */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-200/80 animate-slide">
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
                    <option value="Basic">Basic</option>
                    <option value="Silver">Silver</option>
                    <option value="Gold">Gold</option>
                    <option value="VIP">VIP</option>
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

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Image Avatar URL</label>
                <input
                  type="text"
                  placeholder="Paste avatar URL (optional)"
                  className="buiq-input"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                />
              </div>

              <div className="flex gap-2.5 pt-4 border-t border-slate-100">
                <button
                  onClick={handleAddMember}
                  className="flex-1 bg-primary hover:bg-primary-hover text-white py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-primary/10"
                >
                  Create Member
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
