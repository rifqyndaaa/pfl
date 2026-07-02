import { useState, useEffect, useMemo } from "react";
import Card from "../components/Card";
import { activityLogService } from "../services/activityLogService";
import {
  FaSearch,
  FaCalendarAlt,
  FaHistory,
  FaUser,
  FaCrown,
  FaFilter,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaInfoCircle,
  FaTimes,
  FaLaptopCode,
  FaFolderOpen
} from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";

// Module configurations for pretty badges
const MODULES = [
  { value: "All", label: "Semua Modul" },
  { value: "User", label: "User" },
  { value: "Product", label: "Product" },
  { value: "Customer", label: "Customer" },
  { value: "Orders", label: "Orders" },
  { value: "User Management", label: "User Management" },
  { value: "Membership", label: "Membership" }
];

const ROLES = [
  { value: "All", label: "Semua Role" },
  { value: "Admin", label: "Admin" },
  { value: "Member", label: "Member" },
  { value: "System", label: "System" }
];

// Predefined activities dictionary based on modules
const ACTIVITIES_BY_MODULE = {
  All: ["All"],
  User: ["Login", "Logout", "Register", "Reset Password"],
  Product: ["Tambah Produk", "Edit Produk", "Hapus Produk"],
  Customer: ["Tambah Customer", "Edit Customer", "Hapus Customer"],
  Orders: [
    "Tambah Order",
    "Edit Order",
    "Hapus Order",
    "Status Order berubah menjadi Completed",
    "Status Order berubah menjadi Cancelled"
  ],
  "User Management": [
    "Tambah User",
    "Edit User",
    "Ubah Role",
    "Nonaktifkan User",
    "Aktifkan User",
    "Hapus User"
  ],
  Membership: [
    "Point bertambah",
    "Point berkurang",
    "Membership Tier berubah",
    "Voucher berhasil ditukar"
  ]
};

export default function ActivityLog() {
  const [logs, setLogs] = useState([]);
  const [totalLogs, setTotalLogs] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Search States
  const [searchTerm, setSearchTerm] = useState("");
  const [moduleFilter, setModuleFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");
  const [activityFilter, setActivityFilter] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Sorting State
  const [sortField, setSortField] = useState("created_at");
  const [sortDirection, setSortDirection] = useState("desc");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Stats State
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    admin: 0,
    member: 0
  });

  // Modal State
  const [selectedLog, setSelectedLog] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Dynamic listing of activities based on selected module
  const availableActivities = useMemo(() => {
    return ["All", ...(ACTIVITIES_BY_MODULE[moduleFilter] || [])];
  }, [moduleFilter]);

  // If selected module changes, reset activity filter to All
  useEffect(() => {
    setActivityFilter("All");
  }, [moduleFilter]);

  // Fetch Stats and Logs
  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch Logs
      const logsResult = await activityLogService.getAll({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        module: moduleFilter,
        role: roleFilter,
        activity: activityFilter,
        startDate: startDate,
        endDate: endDate,
        sortBy: sortField,
        sortDir: sortDirection
      });

      setLogs(logsResult.data);
      setTotalLogs(logsResult.total);

      // Fetch Stats
      const statsResult = await activityLogService.getStats();
      setStats(statsResult);

      setError(null);
    } catch (err) {
      console.error("Gagal memuat log aktivitas:", err);
      setError(err.message || "Gagal mengambil data log aktivitas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [
    currentPage,
    searchTerm,
    moduleFilter,
    roleFilter,
    activityFilter,
    startDate,
    endDate,
    sortField,
    sortDirection
  ]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc"); // Default to newest/descending first
    }
    setCurrentPage(1);
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return <FaSort className="text-slate-400" size={10} />;
    return sortDirection === "asc" ? (
      <FaSortUp className="text-primary" size={10} />
    ) : (
      <FaSortDown className="text-primary" size={10} />
    );
  };

  const getModuleBadgeClass = (module) => {
    switch (module) {
      case "User":
        return "bg-blue-50 text-blue-700 border border-blue-100";
      case "Product":
        return "bg-purple-50 text-purple-700 border border-purple-100";
      case "Customer":
        return "bg-orange-50 text-orange-700 border border-orange-100";
      case "Orders":
        return "bg-emerald-50 text-emerald-700 border border-emerald-100";
      case "User Management":
        return "bg-indigo-50 text-indigo-700 border border-indigo-100";
      case "Membership":
        return "bg-amber-50 text-amber-700 border border-amber-100";
      default:
        return "bg-slate-50 text-slate-700 border border-slate-200";
    }
  };

  const getRoleBadgeClass = (role) => {
    const r = role ? role.toUpperCase() : "";
    switch (r) {
      case "ADMIN":
        return "bg-red-50 text-red-700 border border-red-100 font-extrabold";
      case "MEMBER":
        return "bg-blue-50 text-blue-700 border border-blue-150 font-semibold";
      case "SYSTEM":
        return "bg-slate-100 text-slate-700 border border-slate-200 font-medium";
      default:
        return "bg-slate-50 text-slate-600";
    }
  };

  const handleOpenDetail = (log) => {
    setSelectedLog(log);
    setShowModal(true);
  };

  const totalPages = Math.ceil(totalLogs / itemsPerPage);

  const resetFilters = () => {
    setSearchTerm("");
    setModuleFilter("All");
    setRoleFilter("All");
    setActivityFilter("All");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-700 text-xs p-4 rounded-2xl font-medium flex items-center gap-2 animate-fade">
          <FaInfoCircle className="shrink-0" />
          <span>Gagal mengambil data log: {error}</span>
        </div>
      )}

      {/* DASHBOARD STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Logs", val: stats.total, color: "text-primary", icon: <FaHistory /> },
          { label: "Aktivitas Hari Ini", val: stats.today, color: "text-emerald-500", icon: <FaCalendarAlt /> },
          { label: "Aktivitas Admin", val: stats.admin, color: "text-rose-500", icon: <FaCrown /> },
          { label: "Aktivitas Member", val: stats.member, color: "text-blue-500", icon: <FaUser /> }
        ].map((s, i) => (
          <Card key={i}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {s.label}
                </p>
                <p className="text-2xl font-black text-slate-800 mt-1">
                  {s.val.toLocaleString()}
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
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-2">
            <FaFilter className="text-slate-400 text-xs" />
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Filter Audit Trail</h3>
          </div>
          <button
            onClick={resetFilters}
            className="text-[10px] font-bold text-primary hover:text-primary-hover flex items-center gap-1 cursor-pointer transition-colors"
          >
            <FaTimes size={8} /> Reset Filter
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search bar */}
          <div className="relative">
            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Cari Kata Kunci</label>
            <div className="relative">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]" />
              <input
                type="text"
                placeholder="Cari nama, aktivitas, detail..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary text-xs outline-none transition-all placeholder:text-slate-400 font-medium text-slate-800"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          {/* Module Filter */}
          <div>
            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Modul</label>
            <select
              value={moduleFilter}
              onChange={(e) => {
                setModuleFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary text-xs outline-none text-slate-700 font-medium cursor-pointer"
            >
              {MODULES.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>

          {/* Activity Filter */}
          <div>
            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Aktivitas Spesifik</label>
            <select
              value={activityFilter}
              onChange={(e) => {
                setActivityFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary text-xs outline-none text-slate-700 font-medium cursor-pointer"
            >
              {availableActivities.map((act) => (
                <option key={act} value={act}>{act === "All" ? "Semua Aktivitas" : act}</option>
              ))}
            </select>
          </div>

          {/* Role Filter */}
          <div>
            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Akses Role</label>
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary text-xs outline-none text-slate-700 font-medium cursor-pointer"
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* Start Date */}
          <div>
            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Tanggal Mulai</label>
            <div className="relative">
              <FaCalendarAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary text-xs outline-none text-slate-700 font-medium cursor-pointer"
              />
            </div>
          </div>

          {/* End Date */}
          <div>
            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Tanggal Akhir</label>
            <div className="relative">
              <FaCalendarAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]" />
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary text-xs outline-none text-slate-700 font-medium cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="min-h-[300px] flex flex-col items-center justify-center gap-3">
            <ImSpinner2 className="animate-spin text-primary text-2xl" />
            <span className="text-xs text-slate-500 font-semibold">Memuat log audit trail...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200/80">
                  <th className="py-3 px-4 cursor-pointer select-none" onClick={() => handleSort("created_at")}>
                    <div className="flex items-center gap-1">
                      <span>Waktu</span>
                      {getSortIcon("created_at")}
                    </div>
                  </th>
                  <th className="py-3 px-4 cursor-pointer select-none" onClick={() => handleSort("module")}>
                    <div className="flex items-center gap-1">
                      <span>Modul</span>
                      {getSortIcon("module")}
                    </div>
                  </th>
                  <th className="py-3 px-4 cursor-pointer select-none" onClick={() => handleSort("user_name")}>
                    <div className="flex items-center gap-1">
                      <span>Pelaku</span>
                      {getSortIcon("user_name")}
                    </div>
                  </th>
                  <th className="py-3 px-4 cursor-pointer select-none" onClick={() => handleSort("activity")}>
                    <div className="flex items-center gap-1">
                      <span>Aktivitas</span>
                      {getSortIcon("activity")}
                    </div>
                  </th>
                  <th className="py-3 px-4">Deskripsi</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => {
                  const dateFormatted = new Date(log.created_at).toLocaleString("id-ID", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                  });

                  return (
                    <tr
                      key={log.id}
                      className="hover:bg-slate-50/50 transition-colors cursor-pointer"
                      onClick={() => handleOpenDetail(log)}
                    >
                      <td className="py-3.5 px-4 text-slate-500 font-semibold whitespace-nowrap">
                        {dateFormatted}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${getModuleBadgeClass(log.module)}`}>
                          {log.module}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-col">
                            <span className="font-bold text-slate-800 block leading-tight">{log.user_name}</span>
                            <span className={`inline-block px-1.5 py-0.2 rounded text-[7px] font-black uppercase tracking-wider mt-0.5 ${getRoleBadgeClass(log.user_role)}`}>
                              {log.user_role}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-800 whitespace-nowrap">
                        {log.activity}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium max-w-xs truncate" title={log.description}>
                        {log.description}
                      </td>
                      <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleOpenDetail(log)}
                          className="px-2.5 py-1 bg-slate-50 border border-slate-200 hover:border-primary hover:bg-primary-light hover:text-primary rounded-lg text-slate-500 font-bold text-[10px] cursor-pointer transition-all"
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {logs.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-400 font-semibold">
                      Tidak ada rekaman log audit trail yang cocok.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* PAGINATION */}
        {!loading && logs.length > 0 && (
          <div className="border-t border-slate-100 py-3.5 px-4 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-500 font-medium">
            <div>
              Menampilkan {Math.min(totalLogs, (currentPage - 1) * itemsPerPage + 1)} sampai{" "}
              {Math.min(totalLogs, currentPage * itemsPerPage)} dari {totalLogs} log audit
            </div>

            {totalPages > 1 && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-all text-slate-650 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
                  className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-all text-slate-650 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Selanjutnya
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* DETAIL MODAL */}
      {showModal && selectedLog && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-200/80 text-slate-800 animate-slide">
            <div className="border-b border-slate-100 p-5 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center text-primary text-sm shadow-sm">
                  <FaLaptopCode />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Rincian Log Aktivitas</h3>
                  <p className="text-[10px] text-slate-400">ID: {selectedLog.id}</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <FaTimes size={16} />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs font-medium text-slate-600">
              {/* Timestamp */}
              <div className="grid grid-cols-3 py-1.5 border-b border-slate-50">
                <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Waktu Kejadian</span>
                <span className="col-span-2 text-slate-800 font-bold">
                  {new Date(selectedLog.created_at).toLocaleString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    timeZoneName: "short"
                  })}
                </span>
              </div>

              {/* Modul */}
              <div className="grid grid-cols-3 py-1.5 border-b border-slate-50">
                <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Modul Sistem</span>
                <span className="col-span-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${getModuleBadgeClass(selectedLog.module)}`}>
                    {selectedLog.module}
                  </span>
                </span>
              </div>

              {/* Aktivitas */}
              <div className="grid grid-cols-3 py-1.5 border-b border-slate-50">
                <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Jenis Aktivitas</span>
                <span className="col-span-2 text-slate-800 font-black">{selectedLog.activity}</span>
              </div>

              {/* Pelaku */}
              <div className="grid grid-cols-3 py-1.5 border-b border-slate-50">
                <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Pelaku (User)</span>
                <span className="col-span-2 text-slate-850">
                  <div className="font-bold text-slate-800">{selectedLog.user_name}</div>
                  <div className="flex gap-1.5 mt-1 items-center">
                    <span className={`inline-block px-1.5 py-0.2 rounded text-[7px] font-black uppercase tracking-wider ${getRoleBadgeClass(selectedLog.user_role)}`}>
                      {selectedLog.user_role}
                    </span>
                    {selectedLog.user_id && (
                      <span className="text-[8px] text-slate-400 font-mono">UID: {selectedLog.user_id}</span>
                    )}
                  </div>
                </span>
              </div>

              {/* Deskripsi */}
              <div className="grid grid-cols-3 py-1.5 border-b border-slate-50">
                <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Deskripsi Log</span>
                <span className="col-span-2 text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-150 leading-relaxed font-semibold">
                  {selectedLog.description}
                </span>
              </div>

              {/* Reference ID */}
              <div className="grid grid-cols-3 py-1.5 border-b border-slate-50">
                <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Reference ID</span>
                <span className="col-span-2 text-slate-500 font-mono text-[10px] truncate select-all" title={selectedLog.reference_id}>
                  {selectedLog.reference_id || "-"}
                </span>
              </div>

              <div className="flex pt-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl font-bold transition-all cursor-pointer text-center"
                >
                  Tutup Rincian
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
