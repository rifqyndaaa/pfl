import { useState, useEffect, useMemo } from "react";
import Card from "../components/Card";
import { userService } from "../services/userService";
import { useAuth } from "../context/AuthContext";
import {
  FaUsers,
  FaSearch,
  FaCheckCircle,
  FaCrown,
  FaTimesCircle,
  FaEdit,
  FaTrash,
  FaExclamationTriangle,
  FaUserCheck,
  FaUserSlash,
  FaCalendarAlt,
  FaSort,
  FaSortUp,
  FaSortDown
} from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";

export default function UserManagement() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Search States
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Sorting State
  const [sortField, setSortField] = useState("created_at");
  const [sortDirection, setSortDirection] = useState("desc");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modal States
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Form States for Edit Modal
  const [formData, setFormData] = useState({
    fullName: "",
    role: "member",
    isBanned: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAll();
      setUsers(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError(err.message || "Gagal mengambil data pengguna.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Check if a user is currently banned/inactive
  const isUserBanned = (bannedUntil) => {
    if (!bannedUntil) return false;
    return new Date(bannedUntil) > new Date();
  };

  // Stats Calculations
  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => !isUserBanned(u.banned_until)).length;
    const inactive = total - active;
    const admins = users.filter((u) => u.role === "admin").length;
    const members = users.filter((u) => u.role === "member").length;

    return { total, active, inactive, admins, members };
  }, [users]);

  // Filtering Logic
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const isBanned = isUserBanned(u.banned_until);
      const matchesSearch =
        u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = roleFilter === "All" || u.role === roleFilter.toLowerCase();
      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Active" && !isBanned) ||
        (statusFilter === "Inactive" && isBanned);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  // Sorting Logic
  const sortedUsers = useMemo(() => {
    const sorted = [...filteredUsers];
    sorted.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      // Handle custom check for status field
      if (sortField === "status") {
        valA = isUserBanned(a.banned_until) ? "Inactive" : "Active";
        valB = isUserBanned(b.banned_until) ? "Inactive" : "Active";
      }

      if (valA === null || valA === undefined) valA = "";
      if (valB === null || valB === undefined) valB = "";

      if (typeof valA === "string") {
        return sortDirection === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      } else {
        return sortDirection === "asc" ? valA - valB : valB - valA;
      }
    });
    return sorted;
  }, [filteredUsers, sortField, sortDirection]);

  // Pagination Logic
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedUsers, currentPage]);

  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  // Open Edit Modal
  const handleOpenEdit = (userToEdit) => {
    setSelectedUser(userToEdit);
    setFormData({
      fullName: userToEdit.full_name,
      role: userToEdit.role,
      isBanned: isUserBanned(userToEdit.banned_until)
    });
    setShowEditModal(true);
  };

  // Open View Details Modal
  const handleOpenView = (userToView) => {
    setSelectedUser(userToView);
    setShowViewModal(true);
  };

  // Save Edit Changes
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      alert("Nama lengkap tidak boleh kosong!");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Update Profile (role and full_name)
      await userService.updateProfile(selectedUser.id, {
        full_name: formData.fullName,
        role: formData.role
      });

      // 2. Update status (ban/unban) if changed
      const currentlyBanned = isUserBanned(selectedUser.banned_until);
      if (currentlyBanned !== formData.isBanned) {
        if (selectedUser.id === currentUser?.id) {
          alert("Anda tidak dapat mengubah status aktif/nonaktif akun Anda sendiri.");
        } else {
          await userService.toggleStatus(selectedUser.id, formData.isBanned);
        }
      }

      alert("Data pengguna berhasil diperbarui!");
      setShowEditModal(false);
      fetchUsers();
    } catch (err) {
      alert("Gagal memperbarui pengguna: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle quick status switch
  const handleQuickToggleStatus = async (userToToggle) => {
    if (userToToggle.id === currentUser?.id) {
      alert("Anda tidak dapat menonaktifkan akun Anda sendiri.");
      return;
    }

    const currentBan = isUserBanned(userToToggle.banned_until);
    const label = currentBan ? "mengaktifkan" : "menonaktifkan";
    if (window.confirm(`Apakah Anda yakin ingin ${label} akun ${userToToggle.email}?`)) {
      try {
        await userService.toggleStatus(userToToggle.id, !currentBan);
        alert(`Akun berhasil di${currentBan ? "aktifkan" : "nonaktifkan"}!`);
        fetchUsers();
      } catch (err) {
        alert("Gagal mengubah status akun: " + err.message);
      }
    }
  };

  // Perform soft delete
  const handleDeleteClick = async (userToDelete) => {
    if (userToDelete.id === currentUser?.id) {
      alert("Anda tidak dapat menghapus akun Anda sendiri.");
      return;
    }

    if (
      window.confirm(
        `🚨 PERINGATAN: Apakah Anda yakin ingin melakukan soft-delete pada akun ${userToDelete.email}?\n\nTindakan ini akan:\n1. Menonaktifkan login selamanya.\n2. Menghapus data Customer & Orders terkait.\n3. Mengubah nama profil menjadi '[Deleted]'.`
      )
    ) {
      try {
        await userService.deleteUser(userToDelete.id);
        alert("Akun berhasil di-soft delete dan dinonaktifkan!");
        fetchUsers();
      } catch (err) {
        alert("Gagal melakukan soft-delete: " + err.message);
      }
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return <FaSort className="text-slate-400" size={10} />;
    return sortDirection === "asc" ? (
      <FaSortUp className="text-primary" size={10} />
    ) : (
      <FaSortDown className="text-primary" size={10} />
    );
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-700 text-xs p-4 rounded-2xl font-medium flex items-center gap-2 animate-fade">
          <FaExclamationTriangle className="shrink-0" />
          <span>Gagal mengambil data: {error}</span>
        </div>
      )}

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Users", val: stats.total, color: "text-primary", icon: <FaUsers /> },
          { label: "Active Users", val: stats.active, color: "text-emerald-500", icon: <FaCheckCircle /> },
          { label: "Inactive / Banned", val: stats.inactive, color: "text-rose-500", icon: <FaTimesCircle /> },
          { label: "Admins", val: stats.admins, color: "text-purple-500", icon: <FaCrown /> }
        ].map((s, i) => (
          <Card key={i}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {s.label}
                </p>
                <p className="text-2xl font-black text-slate-800 mt-1">
                  {s.val}
                </p>
              </div>
              <div className={`w-10 h-10 rounded-xl bg-slate-50 ${s.color} flex items-center justify-center text-sm shadow-sm`}>
                {s.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* CONTROLS HEADER BAR */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm">
        {/* Search */}
        <div className="relative w-full lg:w-80">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama atau email..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary text-xs outline-none transition-all placeholder:text-slate-400 font-medium text-slate-800"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
          {/* Role Filter */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Role:</span>
            <div className="flex border border-slate-200 rounded-xl p-0.5 bg-slate-50">
              {["All", "Admin", "Member"].map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    setRoleFilter(role);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-lg font-bold text-[10px] transition-all cursor-pointer ${
                    roleFilter === role
                      ? "bg-white text-primary shadow-sm"
                      : "text-slate-505 hover:text-slate-800 text-slate-500"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Status:</span>
            <div className="flex border border-slate-200 rounded-xl p-0.5 bg-slate-50">
              {["All", "Active", "Inactive"].map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setStatusFilter(status);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-lg font-bold text-[10px] transition-all cursor-pointer ${
                    statusFilter === status
                      ? "bg-white text-primary shadow-sm"
                      : "text-slate-505 hover:text-slate-800 text-slate-500"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="min-h-[300px] flex flex-col items-center justify-center gap-3">
            <ImSpinner2 className="animate-spin text-primary text-2xl" />
            <span className="text-xs text-slate-500 font-semibold">Memuat data pengguna...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200/80">
                  <th className="py-3 px-4 cursor-pointer select-none" onClick={() => handleSort("full_name")}>
                    <div className="flex items-center gap-1">
                      <span>Full Name</span>
                      {getSortIcon("full_name")}
                    </div>
                  </th>
                  <th className="py-3 px-4 cursor-pointer select-none" onClick={() => handleSort("email")}>
                    <div className="flex items-center gap-1">
                      <span>Email</span>
                      {getSortIcon("email")}
                    </div>
                  </th>
                  <th className="py-3 px-4 cursor-pointer select-none" onClick={() => handleSort("role")}>
                    <div className="flex items-center gap-1">
                      <span>Role</span>
                      {getSortIcon("role")}
                    </div>
                  </th>
                  <th className="py-3 px-4 cursor-pointer select-none" onClick={() => handleSort("status")}>
                    <div className="flex items-center gap-1">
                      <span>Status</span>
                      {getSortIcon("status")}
                    </div>
                  </th>
                  <th className="py-3 px-4 cursor-pointer select-none" onClick={() => handleSort("created_at")}>
                    <div className="flex items-center gap-1">
                      <span>Registration Date</span>
                      {getSortIcon("created_at")}
                    </div>
                  </th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedUsers.map((u) => {
                  const isBanned = isUserBanned(u.banned_until);
                  const isSelf = u.id === currentUser?.id;
                  const isSoftDeleted = u.full_name.startsWith("[Deleted]");

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(u.email)}`}
                            alt={u.full_name}
                            className="w-10 h-10 rounded-lg object-cover shadow-sm border border-slate-100 bg-slate-100"
                          />
                          <div>
                            <div className="font-bold text-slate-800 flex items-center gap-1.5">
                              <span>{u.full_name}</span>
                              {isSelf && (
                                <span className="bg-blue-50 text-blue-600 text-[8px] font-black uppercase px-1.5 py-0.5 rounded border border-blue-100">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-[9px] text-slate-400">ID: {u.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-semibold">
                        {u.email}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider
                          ${u.role === "admin" ? "bg-purple-50 text-purple-700 border border-purple-100" : "bg-blue-50 text-blue-700 border border-blue-100"}
                        `}>
                          {u.role === "admin" && <FaCrown size={8} />}
                          <span>{u.role}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider
                          ${isSoftDeleted 
                            ? "bg-slate-100 text-slate-600 border border-slate-200" 
                            : !isBanned 
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                              : "bg-rose-50 text-rose-700 border border-rose-100"
                          }
                        `}>
                          {isSoftDeleted ? "Deleted" : !isBanned ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 font-medium">
                        <div className="flex items-center gap-1">
                          <FaCalendarAlt size={10} className="text-slate-400" />
                          <span>{new Date(u.created_at).toLocaleDateString("id-ID", {
                            year: "numeric",
                            month: "short",
                            day: "numeric"
                          })}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenView(u)}
                            className="px-2 py-1 bg-slate-50 border border-slate-200 hover:border-primary hover:bg-primary-light hover:text-primary rounded-lg text-slate-500 font-bold text-[10px] cursor-pointer transition-all"
                            title="Detail"
                          >
                            Details
                          </button>
                          
                          {!isSoftDeleted && (
                            <>
                              <button
                                onClick={() => handleOpenEdit(u)}
                                className="p-1.5 bg-slate-50 border border-slate-200 hover:border-primary hover:bg-primary-light hover:text-primary rounded-lg text-slate-500 cursor-pointer transition-all"
                                title="Edit"
                              >
                                <FaEdit size={12} />
                              </button>
                              
                              <button
                                onClick={() => handleQuickToggleStatus(u)}
                                disabled={isSelf}
                                className={`p-1.5 border rounded-lg cursor-pointer transition-all ${
                                  isBanned
                                    ? "bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100"
                                    : "bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100"
                                } disabled:opacity-40 disabled:cursor-not-allowed`}
                                title={isBanned ? "Aktifkan Akun" : "Nonaktifkan Akun"}
                              >
                                {isBanned ? <FaUserCheck size={12} /> : <FaUserSlash size={12} />}
                              </button>

                              <button
                                onClick={() => handleDeleteClick(u)}
                                disabled={isSelf}
                                className="p-1.5 bg-slate-50 border border-slate-200 hover:border-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded-lg text-slate-500 cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                title="Soft Delete"
                              >
                                <FaTrash size={12} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {sortedUsers.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-400 font-semibold">
                      Tidak ada pengguna yang cocok dengan kriteria pencarian.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* TABLE FOOTER / PAGINATION */}
        {!loading && sortedUsers.length > 0 && (
          <div className="border-t border-slate-100 py-3.5 px-4 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-500 font-medium">
            <div>
              Menampilkan {Math.min(sortedUsers.length, (currentPage - 1) * itemsPerPage + 1)} sampai{" "}
              {Math.min(sortedUsers.length, currentPage * itemsPerPage)} dari {sortedUsers.length} pengguna
            </div>
            
            {totalPages > 1 && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-all text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Sebelumnya
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-7 h-7 rounded-lg border transition-all cursor-pointer ${
                      currentPage === i + 1
                        ? "bg-primary text-white border-primary"
                        : "border-slate-200 bg-white hover:bg-slate-50 text-slate-650"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-all text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Selanjutnya
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* VIEW MODAL */}
      {showViewModal && selectedUser && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden border border-slate-200/80 text-slate-800 animate-slide">
            <div className="border-b border-slate-100 p-5 flex items-center gap-3 bg-slate-50">
              <img
                src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(selectedUser.email)}`}
                alt={selectedUser.full_name}
                className="w-12 h-12 rounded-xl object-cover shadow-sm bg-slate-100"
              />
              <div>
                <h3 className="text-xs font-bold text-slate-900">Rincian Profil Pengguna</h3>
                <p className="text-[10px] text-slate-400">{selectedUser.email}</p>
              </div>
            </div>

            <div className="p-5 space-y-4 text-xs font-medium text-slate-600">
              <div className="grid grid-cols-3 py-1.5 border-b border-slate-50">
                <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">ID</span>
                <span className="col-span-2 text-slate-800 select-all font-mono text-[10px]">{selectedUser.id}</span>
              </div>
              
              <div className="grid grid-cols-3 py-1.5 border-b border-slate-50">
                <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Nama Lengkap</span>
                <span className="col-span-2 text-slate-800 font-bold">{selectedUser.full_name}</span>
              </div>

              <div className="grid grid-cols-3 py-1.5 border-b border-slate-50">
                <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Email</span>
                <span className="col-span-2 text-slate-800 font-bold">{selectedUser.email}</span>
              </div>

              <div className="grid grid-cols-3 py-1.5 border-b border-slate-50">
                <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Role</span>
                <span className="col-span-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider
                    ${selectedUser.role === "admin" ? "bg-purple-50 text-purple-700 border border-purple-100" : "bg-blue-50 text-blue-700 border border-blue-100"}
                  `}>
                    {selectedUser.role}
                  </span>
                </span>
              </div>

              <div className="grid grid-cols-3 py-1.5 border-b border-slate-50">
                <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Status Login</span>
                <span className="col-span-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider
                    ${isUserBanned(selectedUser.banned_until) 
                      ? "bg-rose-50 text-rose-700 border border-rose-100" 
                      : "bg-emerald-50 text-emerald-700 border border-emerald-100"}
                  `}>
                    {isUserBanned(selectedUser.banned_until) ? "Disabled (Suspended)" : "Active / Allowed"}
                  </span>
                </span>
              </div>

              <div className="grid grid-cols-3 py-1.5 border-b border-slate-50">
                <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Terdaftar</span>
                <span className="col-span-2 text-slate-800">
                  {new Date(selectedUser.created_at).toLocaleString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </span>
              </div>

              <div className="flex pt-3">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl font-bold transition-all cursor-pointer text-center"
                >
                  Tutup Rincian
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade">
          <form onSubmit={handleEditSubmit} className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden border border-slate-250/80 animate-slide">
            <div className="border-b border-slate-100 p-5 flex items-center gap-3 bg-slate-50">
              <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center text-primary text-sm shadow-sm">
                <FaEdit />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">Edit Akses Pengguna</h3>
                <p className="text-[10px] text-slate-400">{selectedUser.email}</p>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  className="buiq-input text-slate-800"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Akses Role
                </label>
                <select
                  className="buiq-input bg-white text-slate-800"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {selectedUser.id !== currentUser?.id && (
                <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200/50 rounded-2xl">
                  <div>
                    <label className="text-[10px] font-bold text-slate-700 block">
                      Blokir Login Pengguna
                    </label>
                    <span className="text-[9px] text-slate-400 block mt-0.5">
                      Pengguna tidak akan bisa melakukan login jika dinonaktifkan.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded text-primary focus:ring-primary border-slate-300 cursor-pointer"
                    checked={formData.isBanned}
                    onChange={(e) => setFormData({ ...formData, isBanned: e.target.checked })}
                  />
                </div>
              )}

              <div className="flex gap-2.5 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-primary hover:bg-primary-hover text-white py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-primary/10 disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {isSubmitting && <ImSpinner2 className="animate-spin text-sm" />}
                  <span>Simpan Perubahan</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-5 bg-slate-100 text-slate-650 hover:bg-slate-200 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Batal
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
