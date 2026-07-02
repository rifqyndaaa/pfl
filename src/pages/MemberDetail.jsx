import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { customerService } from "../services/customerService";
import {
  FaArrowLeft,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaRegCalendarAlt,
  FaCrown,
  FaShoppingBag,
  FaMoneyBillWave,
  FaExclamationTriangle,
} from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";

// Reusable Card component matching dashboard design
const Card = ({ children, className = "" }) => (
  <div className={`bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md/5 transition-all ${className}`}>
    {children}
  </div>
);

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

export default function MemberDetail() {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMemberDetails = async () => {
    try {
      setLoading(true);
      // Fetch member by id
      const data = await customerService.getById(id);
      setMember(data);

      // Fetch member's order history
      const { data: orderData, error: orderErr } = await supabase
        .from("orders")
        .select("*, products(*)")
        .eq("customer_id", id)
        .order("created_at", { ascending: false });

      if (orderErr) throw orderErr;
      setOrders(orderData || []);
      setError(null);
    } catch (err) {
      console.error("Error loading member details:", err);
      setError(err.message || "Failed to load member detail");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemberDetails();
  }, [id]);

  // Compute total spending and orders dynamically from database stats
  const calculatedStats = useMemo(() => {
    return {
      totalOrders: member ? member.total_orders : 0,
      totalSpending: member ? parseFloat(member.total_spent || 0) : 0
    };
  }, [member]);

  // Generate activities for timeline
  const activityTimeline = useMemo(() => {
    if (!member) return [];
    const list = [];
    const joinDateStr = member.created_at ? new Date(member.created_at).toISOString().split("T")[0] : "-";
    const tier = member.membership_tier || "Bronze";

    // 1. Joined event
    list.push({
      type: "join",
      title: "Joined BUIQ CRM",
      desc: "Successfully registered as a new boutique member.",
      time: joinDateStr,
      icon: <FaUser className="text-xs" />,
      bg: "bg-primary-light text-primary"
    });

    // 2. Tier event (if not Bronze)
    if (tier !== "Bronze") {
      list.push({
        type: "upgrade",
        title: `Upgraded to ${tier}`,
        desc: `Loyalty membership tier upgraded to ${tier}.`,
        time: joinDateStr,
        icon: <FaCrown className="text-xs" />,
        bg: "bg-amber-50 text-amber-600"
      });
    }

    // 3. Order events
    orders.forEach((o) => {
      const orderDateStr = o.order_date || (o.created_at ? new Date(o.created_at).toISOString().split("T")[0] : "-");
      list.push({
        type: "order",
        title: `Placed Order ${o.order_number}`,
        desc: `Purchased ${o.products?.product_name || "Product"} for Rp ${parseFloat(o.total_price || 0).toLocaleString()}. Status: ${o.status}.`,
        time: orderDateStr,
        icon: <FaShoppingBag className="text-xs" />,
        bg: "bg-emerald-50 text-emerald-600"
      });
    });

    // 4. Status change (Suspended alert)
    if (member.status === "Suspended") {
      list.push({
        type: "suspended",
        title: "Account Suspended",
        desc: "Loyalty profile was flagged and suspended.",
        time: new Date().toISOString().split("T")[0],
        icon: <FaExclamationTriangle className="text-xs" />,
        bg: "bg-rose-50 text-rose-600"
      });
    }

    // Sort newest first
    return list.sort((a, b) => new Date(b.time) - new Date(a.time));
  }, [member, orders]);

  // Handle tier change
  const handleUpdateTier = async (newTier) => {
    try {
      const newSpent = getSpentForTier(newTier);
      const newPoints = newTier === "Platinum" ? 1000 : newTier === "Gold" ? 500 : newTier === "Silver" ? 100 : 0;
      const updated = await customerService.update(id, { 
        total_spent: newSpent,
        membership_tier: newTier,
        points: newPoints
      });
      setMember(updated);
    } catch (err) {
      alert("Gagal mengubah tier: " + err.message);
    }
  };

  // Handle status change
  const handleUpdateStatus = async (newStatus) => {
    try {
      const updated = await customerService.update(id, { status: newStatus });
      setMember(updated);
    } catch (err) {
      alert("Gagal mengubah status: " + err.message);
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
        <ImSpinner2 className="animate-spin text-primary text-2xl" />
        <span className="text-xs text-slate-500 font-semibold">Mengambil detail member...</span>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl p-8 text-center max-w-md mx-auto my-12 shadow-sm">
        <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
          ⚠️
        </div>
        <h2 className="text-lg font-bold text-slate-800 mb-2">Member Not Found</h2>
        <p className="text-xs text-slate-400 mb-6">
          Member dengan ID {id} tidak terdaftar di sistem.
        </p>
        <Link
          to="/member-management"
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer"
        >
          <FaArrowLeft size={10} /> Back to Members List
        </Link>
      </div>
    );
  }

  const tier = member.membership_tier || "Bronze";
  const joinDateStr = member.created_at ? new Date(member.created_at).toISOString().split("T")[0] : "-";

  return (
    <div className="space-y-6">
      
      {/* ── BREADCRUMBS & ACTION BAR ── */}
      <div className="flex justify-between items-center bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm">
        <Link
          to="/member-management"
          className="inline-flex items-center gap-2 hover:text-primary text-slate-500 font-bold text-xs transition-colors cursor-pointer"
        >
          <FaArrowLeft size={10} /> Back to Members
        </Link>

        {/* Editor Controls */}
        <div className="flex items-center gap-3">
          {/* Status Quick Select */}
          <div className="relative inline-flex items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-2 hidden sm:inline">Status:</span>
            <select
              value={member.status}
              onChange={(e) => handleUpdateStatus(e.target.value)}
              className="bg-white border border-slate-200 hover:border-slate-350 font-bold text-[11px] px-3 py-1.5 rounded-xl outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-slate-700 cursor-pointer"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>

          {/* Tier Quick Select */}
          <div className="relative inline-flex items-center border-l border-slate-100 pl-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-2 hidden sm:inline">Tier:</span>
            <select
              value={tier}
              disabled
              className="bg-slate-50 border border-slate-200 font-bold text-[11px] px-3 py-1.5 rounded-xl outline-none text-slate-400 cursor-not-allowed opacity-80"
              title="Membership tier dihitung otomatis berdasarkan riwayat belanja"
            >
              <option value="Bronze">Bronze</option>
              <option value="Silver">Silver</option>
              <option value="Gold">Gold</option>
              <option value="Platinum">Platinum</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── ROW 1: Hero Banner & Quick Cards ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile Card */}
        <Card className="lg:col-span-2 flex flex-col sm:flex-row items-center sm:items-start gap-6 relative overflow-hidden p-6">
          {/* Background Decorative Gradient */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-primary-light/40 to-transparent rounded-full -mr-24 -mt-24 pointer-events-none" />

          <img
            src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(member.email)}`}
            alt={member.full_name}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover shadow-md border-2 border-white relative z-10"
          />

          <div className="flex-1 space-y-4 text-center sm:text-left relative z-10">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h1 className="text-xl font-black text-slate-800 tracking-tight leading-tight">{member.full_name}</h1>
                <div className="flex gap-1.5 justify-center sm:justify-start">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${getTypeBadge(tier)}`}>
                    {tier}
                  </span>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${getStatusBadge(member.status)}`}>
                    {member.status}
                  </span>
                </div>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">ID: {member.customer_code}</p>
            </div>

            {/* Profile Contact info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-4 border-t border-slate-100 text-slate-600 text-xs">
              <div className="flex items-center gap-2.5 justify-center sm:justify-start">
                <FaEnvelope className="text-primary text-sm shrink-0" />
                <span className="font-semibold truncate">{member.email}</span>
              </div>
              <div className="flex items-center gap-2.5 justify-center sm:justify-start">
                <FaPhone className="text-primary text-sm shrink-0" />
                <span className="font-semibold">{member.phone || "-"}</span>
              </div>
              <div className="flex items-center gap-2.5 justify-center sm:justify-start col-span-1 sm:col-span-2">
                <FaRegCalendarAlt className="text-primary text-sm shrink-0" />
                <span>Joined on <strong className="font-bold text-slate-800">{joinDateStr}</strong></span>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Money / Spending summary cards */}
        <div className="space-y-4">
          <Card className="flex items-center gap-4 p-5">
            <div className="w-12 h-12 rounded-xl bg-primary-light text-primary flex items-center justify-center text-lg shadow-sm">
              <FaMoneyBillWave />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Spending</p>
              <p className="text-lg font-black text-slate-800 mt-0.5">Rp {calculatedStats.totalSpending.toLocaleString()}</p>
              <p className="text-[9px] text-slate-400 font-semibold mt-1">Loyalty rewards multiplier active</p>
            </div>
          </Card>

          <Card className="flex items-center gap-4 p-5">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg shadow-sm">
              <FaShoppingBag />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Orders</p>
              <p className="text-lg font-black text-slate-800 mt-0.5">{calculatedStats.totalOrders} Purchases</p>
              <p className="text-[9px] text-slate-400 font-semibold mt-1">
                Average spent: Rp {Math.round(calculatedStats.totalSpending / (calculatedStats.totalOrders || 1)).toLocaleString()}
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* ── ROW 2: Order History & Activity Timeline ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Order History */}
        <Card className="lg:col-span-2 space-y-4 flex flex-col p-6">
          <div>
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider font-bold">Purchase History</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Semua transaksi member ini di BUIQ</p>
          </div>

          <div className="overflow-x-auto border border-slate-100 rounded-2xl flex-1">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                  <th className="py-2.5 px-4">Order ID</th>
                  <th className="py-2.5 px-4">Product Purchased</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4 text-right">Price Paid</th>
                  <th className="py-2.5 px-4 text-center">Order Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => {
                  const orderDateStr = order.order_date || (order.created_at ? new Date(order.created_at).toISOString().split("T")[0] : "-");
                  return (
                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-400">
                        <span className="bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-250">
                          {order.order_number}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-800">{order.products?.product_name || "Unknown Product"}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider
                          ${order.status === "Completed" ? "bg-emerald-50 text-emerald-700" : ""}
                          ${order.status === "Pending" ? "bg-amber-50 text-amber-700" : ""}
                          ${order.status === "Cancelled" ? "bg-rose-50 text-rose-700" : ""}
                        `}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-primary">
                        Rp {parseFloat(order.total_price || 0).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center text-slate-400 font-semibold">{orderDateStr}</td>
                    </tr>
                  );
                })}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-400 font-medium">
                      No orders made yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Activity Timeline */}
        <Card className="space-y-4 p-6">
          <div>
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider font-bold">Member Timeline</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Chronology of member events</p>
          </div>

          <div className="space-y-4 overflow-y-auto max-h-[350px] pr-1">
            {activityTimeline.map((item, idx) => (
              <div key={idx} className="flex gap-3 relative">
                {/* Visual Line connector */}
                {idx < activityTimeline.length - 1 && (
                  <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-slate-100 -translate-x-1/2" />
                )}

                <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center relative z-10 shadow-sm ${item.bg}`}>
                  {item.icon}
                </div>

                <div className="flex-1 min-w-0 pb-3">
                  <div className="flex justify-between items-baseline gap-2">
                    <p className="text-xs font-bold text-slate-800">{item.title}</p>
                    <span className="text-[9px] font-bold text-slate-400 whitespace-nowrap">{item.time}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-normal mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

    </div>
  );
}
