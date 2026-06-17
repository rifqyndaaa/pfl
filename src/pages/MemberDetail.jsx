import { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Card from "../components/Card";
import {
  FaArrowLeft,
  FaChevronRight,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaRegCalendarAlt,
  FaCrown,
  FaShoppingBag,
  FaMoneyBillWave,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaPlus,
  FaChevronDown
} from "react-icons/fa";

export default function MemberDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Load members
  const [members, setMembers] = useState(() => {
    const stored = localStorage.getItem("buiq_members");
    return stored ? JSON.parse(stored) : [];
  });

  // Load orders
  const [orders, setOrders] = useState(() => {
    const stored = localStorage.getItem("buiq_orders");
    return stored ? JSON.parse(stored) : [];
  });

  // Find target member
  const member = useMemo(() => {
    return members.find((m) => m.memberId === id);
  }, [members, id]);

  // If member is not found
  if (!member) {
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

  // Get orders history specifically for this member name
  const memberOrders = useMemo(() => {
    return orders.filter(
      (o) => o.customerName.toLowerCase() === member.fullName.toLowerCase()
    );
  }, [orders, member.fullName]);

  // Compute total spending and orders dynamically if orders exist, otherwise fallback to recorded member stats
  const calculatedStats = useMemo(() => {
    if (memberOrders.length > 0) {
      const totalOrders = memberOrders.length;
      const totalSpending = memberOrders.reduce((sum, o) => sum + o.totalPrice, 0);
      return { totalOrders, totalSpending };
    }
    return { totalOrders: member.totalOrders, totalSpending: member.totalSpending };
  }, [memberOrders, member.totalOrders, member.totalSpending]);

  // Generate activities for timeline
  const activityTimeline = useMemo(() => {
    const list = [];
    
    // 1. Joined event
    list.push({
      type: "join",
      title: "Joined BUIQ CRM",
      desc: "Successfully registered as a new boutique member.",
      time: member.joinDate,
      icon: <FaUser className="text-xs" />,
      bg: "bg-primary-light text-primary"
    });

    // 2. Tier event (if not Basic)
    if (member.membershipType !== "Basic") {
      list.push({
        type: "upgrade",
        title: `Upgraded to ${member.membershipType}`,
        desc: `Loyalty membership tier upgraded to ${member.membershipType}.`,
        time: member.joinDate, // set to registration date or slightly after
        icon: <FaCrown className="text-xs" />,
        bg: "bg-amber-50 text-amber-600"
      });
    }

    // 3. Order events
    memberOrders.forEach((o) => {
      list.push({
        type: "order",
        title: `Placed Order #${o.orderId}`,
        desc: `Purchased ${o.product} for Rp ${o.totalPrice.toLocaleString()}. Status: ${o.status}.`,
        time: o.orderDate,
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
  }, [member, memberOrders]);

  // Handle tier change
  const handleUpdateTier = (newTier) => {
    const updated = members.map((m) => {
      if (m.memberId === member.memberId) {
        return { ...m, membershipType: newTier };
      }
      return m;
    });
    setMembers(updated);
    localStorage.setItem("buiq_members", JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
  };

  // Handle status change
  const handleUpdateStatus = (newStatus) => {
    const updated = members.map((m) => {
      if (m.memberId === member.memberId) {
        return { ...m, status: newStatus };
      }
      return m;
    });
    setMembers(updated);
    localStorage.setItem("buiq_members", JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
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
              value={member.membershipType}
              onChange={(e) => handleUpdateTier(e.target.value)}
              className="bg-white border border-slate-200 hover:border-slate-350 font-bold text-[11px] px-3 py-1.5 rounded-xl outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-slate-700 cursor-pointer"
            >
              <option value="Basic">Basic</option>
              <option value="Silver">Silver</option>
              <option value="Gold">Gold</option>
              <option value="VIP">VIP</option>
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
            src={member.image}
            alt={member.fullName}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover shadow-md border-2 border-white relative z-10"
          />

          <div className="flex-1 space-y-4 text-center sm:text-left relative z-10">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h1 className="text-xl font-black text-slate-800 tracking-tight leading-tight">{member.fullName}</h1>
                <div className="flex gap-1.5 justify-center sm:justify-start">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${getTypeBadge(member.membershipType)}`}>
                    {member.membershipType}
                  </span>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${getStatusBadge(member.status)}`}>
                    {member.status}
                  </span>
                </div>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">ID: {member.memberId}</p>
            </div>

            {/* Profile Contact info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-4 border-t border-slate-100 text-slate-600 text-xs">
              <div className="flex items-center gap-2.5 justify-center sm:justify-start">
                <FaEnvelope className="text-primary text-sm shrink-0" />
                <span className="font-semibold truncate">{member.email}</span>
              </div>
              <div className="flex items-center gap-2.5 justify-center sm:justify-start">
                <FaPhone className="text-primary text-sm shrink-0" />
                <span className="font-semibold">{member.phone}</span>
              </div>
              <div className="flex items-center gap-2.5 justify-center sm:justify-start">
                <FaRegCalendarAlt className="text-primary text-sm shrink-0" />
                <span>Joined on <strong className="font-bold text-slate-800">{member.joinDate}</strong></span>
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
              <p className="text-[9px] text-slate-400 font-semibold mt-1">Average spent: Rp {Math.round(calculatedStats.totalSpending / (calculatedStats.totalOrders || 1)).toLocaleString()}</p>
            </div>
          </Card>
        </div>
      </div>

      {/* ── ROW 2: Order History & Activity Timeline ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Order History */}
        <Card className="lg:col-span-2 space-y-4 flex flex-col p-6">
          <div>
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Purchase History</h3>
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
                {memberOrders.map((order) => (
                  <tr key={order.orderId} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-400">
                      <span className="bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-250">
                        #{order.orderId}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800">{order.product}</td>
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
                      Rp {order.totalPrice.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center text-slate-400 font-semibold">{order.orderDate}</td>
                  </tr>
                ))}
                {memberOrders.length === 0 && (
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
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Member Timeline</h3>
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
