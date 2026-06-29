import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";
import { getWishlist } from "../utils/crmSync";
import {
  FaCrown,
  FaSignOutAlt,
  FaShoppingBag,
  FaHeart,
  FaGift,
  FaRegCalendarAlt,
  FaCopy,
  FaCheck,
  FaLock,
  FaHistory,
  FaSlidersH,
  FaChevronRight,
  FaUserEdit,
  FaBell,
  FaUser,
  FaCoins
} from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";

// Helper to determine customer loyalty membership type dynamically from spent
const getMembershipType = (spent) => {
  const s = parseFloat(spent || 0);
  if (s >= 15000000) return "VIP";
  if (s >= 5000000) return "Gold";
  if (s >= 1500000) return "Silver";
  return "Basic";
};

export default function MemberDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [memberProfile, setMemberProfile] = useState(null);
  const [memberOrders, setMemberOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [copiedCode, setCopiedCode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Tabs: 'dashboard', 'riwayat', 'loyalty', 'wishlist'
  const [activeTab, setActiveTab] = useState("dashboard");

  // Quick Action Modal States
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [voucherClaimed, setVoucherClaimed] = useState({});

  // Profile Form States
  const [profileForm, setProfileForm] = useState({
    phone: "",
    city: "Jakarta",
    birthday: "1998-08-20"
  });

  const fetchMemberData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      // Fetch member profile from customers
      const { data: profile, error: profileErr } = await supabase
        .from("customers")
        .select("*")
        .eq("email", user.email)
        .maybeSingle();

      if (profileErr) throw profileErr;

      if (profile) {
        setMemberProfile(profile);
        setProfileForm({
          phone: profile.phone || "",
          city: profile.address || "Jakarta",
          birthday: "1998-08-20" // default placeholder as it's not in DB schema
        });

        // Fetch member orders
        const { data: orderData, error: ordersErr } = await supabase
          .from("orders")
          .select("*, products(*)")
          .eq("customer_id", profile.id)
          .order("created_at", { ascending: false });

        if (ordersErr) throw ordersErr;
        setMemberOrders(orderData || []);
      }
      setError(null);
    } catch (err) {
      console.error("Error loading member dashboard:", err);
      setError(err.message || "Failed to load loyalty dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchMemberData();
    setWishlist(getWishlist());
  }, [user, navigate]);

  // Derived Fashion Preferences
  const preferences = useMemo(() => {
    if (memberOrders.length === 0) {
      return {
        favorite: "Dresses",
        mostPurchased: "Dresses (0)",
        style: "Minimalist Chic"
      };
    }

    const counts = {};
    memberOrders.forEach(o => {
      const cat = o.products?.category || "Casual Wear";
      counts[cat] = (counts[cat] || 0) + 1;
    });

    let favorite = "Dresses";
    let maxVal = -1;
    Object.keys(counts).forEach(k => {
      if (counts[k] > maxVal) {
        maxVal = counts[k];
        favorite = k;
      }
    });

    const mostPurchased = Object.entries(counts)
      .map(([cat, cnt]) => `${cat} (${cnt})`)
      .join(", ");

    let style = "Minimalist Chic";
    if (favorite === "Outerwear" || favorite === "Bags" || favorite === "Outer" || favorite === "Bag") style = "Contemporary Statement";
    else if (favorite === "Shoes") style = "Streetwear Premium";
    else if (favorite === "Dresses" || favorite === "Dress" || favorite === "Accessories") style = "Classic Elegance";

    return { favorite, mostPurchased, style };
  }, [memberOrders]);

  // Loyalty Progression Details (Points & CRM Tiers)
  const tierConfig = useMemo(() => {
    if (!memberProfile) return null;
    const tier = memberProfile.membership_tier || "Bronze";
    const points = parseInt(memberProfile.points || 0);

    let progress = 0;
    let nextTier = "Max Tier";
    let nextThreshold = points;
    let currentThreshold = 0;

    if (tier === "Bronze") {
      nextTier = "Silver";
      currentThreshold = 0;
      nextThreshold = 100;
      progress = Math.min((points / 100) * 100, 100);
    } else if (tier === "Silver") {
      nextTier = "Gold";
      currentThreshold = 100;
      nextThreshold = 500;
      progress = Math.min(((points - 100) / 400) * 100, 100);
    } else if (tier === "Gold") {
      nextTier = "Platinum";
      currentThreshold = 500;
      nextThreshold = 1000;
      progress = Math.min(((points - 500) / 500) * 100, 100);
    } else {
      nextTier = "Platinum Elite";
      progress = 100;
    }

    // Dynamic points multiplier based on tier
    let multiplier = 1.0;
    if (tier === "Silver") multiplier = 1.2;
    else if (tier === "Gold") multiplier = 1.5;
    else if (tier === "Platinum") multiplier = 2.0;

    return { progress, nextTier, nextThreshold, currentThreshold, computedPoints: points, multiplier, tier };
  }, [memberProfile]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("MemberDashboard logout error:", err);
    }
  };

  const handleCopyReferral = () => {
    const referralCode = `BUIQ-${user?.firstName?.toUpperCase() || "MEMBER"}-${memberProfile?.customer_code?.split("-")[1] || "999"}`;
    navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!memberProfile) return;

    try {
      const { data, error: updateErr } = await supabase
        .from("customers")
        .update({
          phone: profileForm.phone,
          address: profileForm.city
        })
        .eq("id", memberProfile.id)
        .select()
        .single();

      if (updateErr) throw updateErr;
      setMemberProfile(data);
      setShowEditProfile(false);
    } catch (err) {
      alert("Gagal memperbarui profil: " + err.message);
    }
  };

  // Mock collections access list
  const collectionsList = [
    { id: "c1", name: "Modern Capsule", tierRequired: "Bronze", price: "Rp 320.000", image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400" },
    { id: "c2", name: "Summer Tailored Linen", tierRequired: "Silver", price: "Rp 680.000", image: "https://images.unsplash.com/photo-1509319117193-57bab727e09d?w=400" },
    { id: "c3", name: "Premium Cashmere Knitwear", tierRequired: "Gold", price: "Rp 1.450.000", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400" },
    { id: "c4", name: "VIP Silk Trench Coat", tierRequired: "Platinum", price: "Rp 3.500.000", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400" }
  ];

  // Helper to verify tier authorization level
  const checkTierAuth = (requiredTier) => {
    if (!tierConfig) return false;
    const currentTier = tierConfig.tier;
    const tierPriority = { "Bronze": 0, "Silver": 1, "Gold": 2, "Platinum": 3 };
    const requiredMapped = requiredTier === "Basic" ? "Bronze" : requiredTier === "VIP" ? "Platinum" : requiredTier;
    return tierPriority[currentTier] >= (tierPriority[requiredMapped] ?? 0);
  };

  // Tier color styling classes
  const getBadgeClass = (tier) => {
    if (tier === "Platinum" || tier === "VIP") return "bg-purple-100 text-purple-800 border-purple-200";
    if (tier === "Gold") return "bg-amber-100 text-amber-800 border-amber-200";
    if (tier === "Silver") return "bg-slate-100 text-slate-800 border-slate-200";
    return "bg-slate-50 text-slate-650 border-slate-100";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F7]">
        <div className="flex flex-col items-center gap-3">
          <ImSpinner2 className="animate-spin text-primary text-2xl" />
          <span className="text-xs font-semibold text-slate-500">Loading Member Profile...</span>
        </div>
      </div>
    );
  }

  if (error || !memberProfile || !tierConfig) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF9F7] p-6 text-center">
        <FaExclamationTriangle className="text-rose-500 text-3xl mb-3" />
        <h2 className="text-base font-bold text-slate-800">Gagal Memuat Profil Keanggotaan</h2>
        <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4">
          Akun Anda belum memiliki data customer di database atau terjadi kesalahan koneksi. Silakan hubungi admin.
        </p>
        <button
          onClick={handleLogout}
          className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-xl"
        >
          Logout
        </button>
      </div>
    );
  }

  const referralCode = `BUIQ-${user?.firstName?.toUpperCase() || "MEMBER"}-${memberProfile.customer_code?.split("-")[1] || "999"}`;
  const joinDateStr = memberProfile.created_at ? new Date(memberProfile.created_at).toISOString().split("T")[0] : "-";

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      <style>{`
        body {
          background-color: #FAF9F7 !important;
          font-family: 'Outfit', sans-serif !important;
        }
        h1, h2, h3, .font-serif {
          font-family: 'Playfair Display', serif !important;
        }
        .buiq-vip-card {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          box-shadow: 0 20px 40px rgba(15, 23, 42, 0.15);
        }
        .blur-card {
          filter: blur(4px);
        }
        .animate-slide {
          animation: slideUp 0.3s ease-out forwards;
        }
        @keyframes slideUp {
          from { transform: translateY(15px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>

      <div className="min-h-screen pb-20 text-[#0F172A]">
        
        {/* DEDICATED MEMBER HEADER */}
        <header className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-slate-200/80 z-40 px-6 py-4 shadow-sm">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
            
            {/* Left: BUIQ Logo */}
            <div className="flex items-center gap-2 flex-shrink-0 cursor-pointer" onClick={() => setActiveTab("dashboard")}>
              <div className="w-8 h-8 rounded-lg bg-[#2B7FFF] flex items-center justify-center font-black text-white text-base">
                B
              </div>
              <span className="font-extrabold text-xs uppercase tracking-widest text-[#0F172A] hidden sm:inline-block">
                BUIQ <span className="font-light text-slate-400">Portal</span>
              </span>
            </div>

            {/* Center: Tabs list */}
            <nav className="flex items-center gap-1.5 md:gap-3 bg-slate-50 border border-slate-200/50 p-1 rounded-full text-xs font-semibold text-slate-500 overflow-x-auto scrollbar-none max-w-full">
              {[
                { id: "dashboard", label: "Dashboard", icon: <FaSlidersH className="text-[10px]" /> },
                { id: "riwayat", label: "Riwayat", icon: <FaHistory className="text-[10px]" /> },
                { id: "loyalty", label: "Loyalty & Reward", icon: <FaGift className="text-[10px]" /> },
                { id: "wishlist", label: "Wishlist & Catalog", icon: <FaHeart className="text-[10px]" /> }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-[#2B7FFF] text-white shadow-sm font-bold"
                      : "hover:text-slate-900 hover:bg-slate-100/60"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>

            {/* Right: Bell, Profile, Badge */}
            <div className="flex items-center gap-3 flex-shrink-0">
              
              {/* Notification Bell */}
              <button 
                onClick={() => setShowNotificationModal(true)}
                className="relative p-2.5 hover:bg-slate-100 rounded-full transition-all text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                <FaBell size={15} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white animate-pulse"></span>
              </button>

              {/* Profile Image & Badge Block */}
              <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
                <img
                  src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(memberProfile.email)}`}
                  alt="avatar"
                  className="w-8 h-8 rounded-full object-cover border border-slate-200 bg-slate-100"
                />
                <div className="hidden md:block text-left leading-none">
                  <p className="text-[11px] font-extrabold text-slate-800">{memberProfile.full_name?.split(" ")[0]}</p>
                  <span className={`inline-block border text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md mt-0.5 ${getBadgeClass(tierConfig.tier)}`}>
                    {tierConfig.tier} Member
                  </span>
                </div>
              </div>

              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-full transition-all cursor-pointer"
                title="Logout"
              >
                <FaSignOutAlt size={14} />
              </button>
            </div>

          </div>
        </header>

        {/* HERO GREETING HERO SECTION */}
        <div className="max-w-6xl mx-auto px-6 mt-8">
          <div className="bg-white border border-slate-200/66 rounded-3xl p-6 md:p-8 shadow-xs space-y-1.5">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight">
              Halo, {user.firstName || "Emily"}! 👋
            </h1>
            <p className="text-xs text-slate-500">
              Senang melihatmu kembali. Terus kumpulkan poin loyalty Anda dan dapatkan reward fashion eksklusif dari BUIQ.
            </p>
          </div>
        </div>

        {/* DYNAMIC CONTENT PANE */}
        <main className="max-w-6xl mx-auto px-6 mt-6">
          
          {/* 1. DASHBOARD TAB */}
          {activeTab === "dashboard" && (
            <div className="space-y-8 animate-slide">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Membership Card */}
                <div className="lg:col-span-7">
                  <div className="buiq-vip-card text-white rounded-3xl p-6 md:p-8 relative overflow-hidden flex flex-col justify-between h-72">
                    <div className="absolute right-[-40px] top-[-40px] w-48 h-48 rounded-full bg-white/5 border border-white/10 pointer-events-none"></div>
                    <div className="absolute right-20 bottom-[-60px] w-36 h-36 rounded-full bg-white/5 border border-white/5 pointer-events-none"></div>

                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-light text-slate-400 uppercase tracking-widest">Digital Loyalty Wallet</span>
                        <h2 className="text-xl font-bold tracking-wide mt-0.5">BUIQ Boutique</h2>
                      </div>
                      <div className="bg-[#2B7FFF] text-white p-2 rounded-xl text-xs font-black tracking-wide shadow-lg shadow-[#2B7FFF]/20">
                        {tierConfig.tier} Tier
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] font-light text-slate-400 uppercase tracking-widest">Member ID</span>
                      <p className="text-lg font-bold font-mono tracking-wider">{memberProfile.customer_code}</p>
                    </div>

                    <div className="flex justify-between items-end border-t border-white/15 pt-4">
                      <div>
                        <span className="text-[8px] font-light text-slate-400 uppercase tracking-widest block">Join Date</span>
                        <span className="text-xs font-semibold">{joinDateStr}</span>
                      </div>
                      <div>
                        <span className="text-[8px] font-light text-slate-400 uppercase tracking-widest block text-right">Loyalty Points</span>
                        <span className="text-xl font-bold text-[#EAF3FF] block text-right">
                          {tierConfig.computedPoints} <span className="text-xs font-light text-slate-300">PTS</span>
                        </span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[8px] font-light text-slate-400 uppercase tracking-widest block mb-1">Referral Link</span>
                        <button
                          onClick={handleCopyReferral}
                          className="bg-white/10 hover:bg-white/20 transition-all text-white py-1 px-2.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5 cursor-pointer border border-white/10"
                        >
                          {copiedCode ? <FaCheck className="text-emerald-400" /> : <FaCopy />}
                          <span>{referralCode}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Loyalty Progress Tracker */}
                <div className="lg:col-span-5 bg-white border border-slate-200/60 rounded-3xl p-6 flex flex-col justify-between shadow-xs">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                      <FaCoins className="text-[#2B7FFF] text-sm" />
                      <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Loyalty Tracker</h2>
                    </div>

                    <div className="space-y-4 pt-1">
                      <div className="flex justify-between items-baseline">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lifetime Spending</span>
                        <span className="text-sm font-black text-[#2B7FFF]">
                          {parseFloat(memberProfile.total_spent || 0).toLocaleString("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 })}
                        </span>
                      </div>

                      <div className="flex justify-between items-baseline">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Completed Purchases</span>
                        <span className="text-sm font-black text-slate-800">
                          {memberProfile.total_orders || 0} <span className="text-[10px] font-normal text-slate-400">Orders</span>
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="relative pt-1">
                        <div className="overflow-hidden h-2.5 text-xs flex rounded-full bg-slate-100">
                          <div
                            style={{ width: `${tierConfig.progress}%` }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#2B7FFF] rounded-full transition-all duration-700"
                          ></div>
                        </div>
                      </div>

                      <div className="flex justify-between text-[10px] font-bold text-slate-400 pt-1">
                        <span>Tier {tierConfig.tier}</span>
                        {tierConfig.tier !== "Platinum" ? (
                          <span>Upgrade at {tierConfig.nextThreshold.toLocaleString()} PTS</span>
                        ) : (
                          <span>Max Platinum Tier Reached</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 mt-6 flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    <span>Points Multiplier: {tierConfig.multiplier}x</span>
                    {tierConfig.tier !== "Platinum" && (
                      <span className="text-[#2B7FFF]">{Math.round(100 - tierConfig.progress)}% to {tierConfig.nextTier}</span>
                    )}
                  </div>
                </div>

              </div>

              {/* Second row: Fashion Preferences & Profile Info */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                
                {/* Fashion Preferences Card */}
                <div className="md:col-span-6 bg-white border border-slate-200/60 rounded-3xl p-6 shadow-xs">
                  <div className="flex items-center gap-2 pb-4 border-b border-slate-100 mb-4">
                    <FaSlidersH className="text-[#2B7FFF] text-sm" />
                    <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Fashion Preferences</h2>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-medium">Favorite Category</span>
                      <span className="bg-[#2B7FFF]/10 text-[#2B7FFF] font-extrabold px-3 py-1 rounded-full text-[10px]">
                        {preferences.favorite}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-medium">Shopping Style</span>
                      <span className="font-bold text-slate-800">{preferences.style}</span>
                    </div>
                    <div className="flex justify-between items-start text-xs">
                      <span className="text-slate-400 font-medium">Derived Orders</span>
                      <span className="font-semibold text-slate-600 text-right max-w-[200px]">
                        {preferences.mostPurchased}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Profile Information Summary */}
                <div className="md:col-span-6 bg-white border border-slate-200/60 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                      <div className="flex items-center gap-2">
                        <FaUser className="text-[#2B7FFF] text-sm" />
                        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Profile Info</h2>
                      </div>
                      <button
                        onClick={() => setShowEditProfile(true)}
                        className="text-[10px] font-bold text-[#2B7FFF] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <FaUserEdit />
                        <span>Edit</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-slate-400 block font-medium">Email Address</span>
                        <span className="font-bold text-slate-800 truncate block">{memberProfile.email}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Phone Number</span>
                        <span className="font-bold text-slate-800 block">{memberProfile.phone || "-"}</span>
                      </div>
                      <div className="mt-2">
                        <span className="text-slate-400 block font-medium">Address / City</span>
                        <span className="font-bold text-slate-800 block">{memberProfile.address || "-"}</span>
                      </div>
                      <div className="mt-2">
                        <span className="text-slate-400 block font-medium">Birthday</span>
                        <span className="font-bold text-slate-800 block">{profileForm.birthday}</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* 2. RIWAYAT TAB */}
          {activeTab === "riwayat" && (
            <div className="bg-white border border-slate-200/60 rounded-3xl overflow-hidden shadow-xs animate-slide">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FaHistory className="text-slate-700 text-sm" />
                  <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Purchase History</h2>
                </div>
                <span className="text-xs text-slate-400 font-bold">{memberOrders.length} Completed Orders</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200/60 text-slate-500 font-bold uppercase tracking-wider">
                      <th className="py-3.5 px-6">Transaction ID</th>
                      <th className="py-3.5 px-6">Date</th>
                      <th className="py-3.5 px-6">Product Ordered</th>
                      <th className="py-3.5 px-6 text-center">Qty</th>
                      <th className="py-3.5 px-6">Amount</th>
                      <th className="py-3.5 px-6">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {memberOrders.map(ord => {
                      const orderDateStr = ord.order_date || (ord.created_at ? new Date(ord.created_at).toISOString().split("T")[0] : "-");
                      return (
                        <tr key={ord.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 px-6 font-bold text-slate-400">
                            <span className="bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200">
                              {ord.order_number}
                            </span>
                          </td>
                          <td className="py-4 px-6 font-medium text-slate-600">{orderDateStr}</td>
                          <td className="py-4 px-6 font-bold text-slate-800">{ord.products?.product_name || "Unknown Product"}</td>
                          <td className="py-4 px-6 text-center font-bold text-slate-600">{ord.quantity}x</td>
                          <td className="py-4 px-6 font-black text-[#2B7FFF]">
                            Rp {parseFloat(ord.total_price || 0).toLocaleString()}
                          </td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider
                              ${ord.status === "Completed" ? "bg-emerald-50 text-emerald-700" : ""}
                              ${ord.status === "Pending" ? "bg-amber-50 text-amber-700" : ""}
                              ${ord.status === "Cancelled" ? "bg-rose-50 text-rose-700" : ""}
                            `}>
                              {ord.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                    {memberOrders.length === 0 && (
                      <tr>
                        <td colSpan="6" className="py-8 text-center text-slate-400">No transactions recorded.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. LOYALTY & REWARD TAB */}
          {activeTab === "loyalty" && (
            <div className="space-y-8 animate-slide">
              
              {/* Points Summary & Available Vouchers list */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Points Card */}
                <div className="lg:col-span-4 bg-white border border-slate-200/60 rounded-3xl p-6 flex flex-col justify-between shadow-xs">
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Loyalty Points Balance</span>
                    <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight flex items-baseline gap-1">
                      {tierConfig.computedPoints} <span className="text-xs font-semibold text-slate-400">PTS</span>
                    </h2>
                    <p className="text-[11px] text-slate-500 leading-normal pt-1">
                      Use your points at checkout to claim discounts, vouchers, and member-exclusive fashion items.
                    </p>
                  </div>
                  <div className="border-t border-slate-100 pt-4 mt-6">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Earn Rate Multiplier</span>
                    <span className="text-xs font-extrabold text-[#2B7FFF] block mt-1">{tierConfig.multiplier}x Points per Rp 10.000 spent</span>
                  </div>
                </div>

                {/* Voucher Codes Redemptions */}
                <div className="lg:col-span-8 bg-white border border-slate-200/60 rounded-3xl p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Claim Vouchers</h2>
                    <span className="text-xs text-slate-400 font-medium">Claim using your member tier</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { id: "v1", title: "Rp 50k Welcome Voucher", desc: "No minimum spend, standard items.", code: "WELCOME50", tier: "Bronze" },
                      { id: "v2", title: "Rp 100k Birthday Gift", desc: "Silver tier & above, birthday month.", code: "BDAY100", tier: "Silver" },
                      { id: "v3", title: "Rp 250k Platinum Treat", desc: "For Gold & Platinum loyalty tiers.", code: "PLATINUM250", tier: "Gold" },
                      { id: "v4", title: "Free Shipping Voucher", desc: "Free priority shipping, no minimum spend.", code: "FREESHIPVIP", tier: "Bronze" }
                    ].map(v => {
                      const isClaimable = checkTierAuth(v.tier);
                      const claimed = voucherClaimed[v.id];
                      return (
                        <div key={v.id} className="border border-slate-200/80 p-4 rounded-2xl flex flex-col justify-between gap-3 bg-slate-50/50">
                          <div>
                            <div className="flex justify-between items-start">
                              <h4 className="text-xs font-bold text-slate-800">{v.title}</h4>
                              <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${getBadgeClass(v.tier)}`}>{v.tier}+</span>
                            </div>
                            <p className="text-[10px] text-slate-400 leading-normal mt-1">{v.desc}</p>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-slate-100/50 mt-1">
                            <span className="font-mono text-[10px] font-bold text-slate-500">Code: {v.code}</span>
                            <button
                              onClick={() => {
                                if (isClaimable) {
                                  setVoucherClaimed({ ...voucherClaimed, [v.id]: true });
                                }
                              }}
                              disabled={claimed || !isClaimable}
                              className={`px-3 py-1.5 rounded-xl text-[9px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                                claimed
                                  ? "bg-slate-150 text-slate-400 cursor-not-allowed border border-slate-200"
                                  : !isClaimable
                                  ? "bg-slate-100 text-slate-350 cursor-not-allowed border border-slate-200"
                                  : "bg-[#2B7FFF] hover:bg-[#2B7FFF]/90 text-white shadow-xs"
                              }`}
                            >
                              {claimed ? (
                                <>
                                  <FaCheck size={7} />
                                  <span>Redeemed</span>
                                </>
                              ) : !isClaimable ? (
                                <>
                                  <FaLock size={7} />
                                  <span>Locked</span>
                                </>
                              ) : (
                                <span>Claim</span>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Tier Benefits Comparison Grid */}
              <section className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="pb-3 border-b border-slate-100">
                  <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Membership Tier Benefits</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { name: "Bronze", spend: "< 100 PTS", mult: "1.0x Points", vouchers: "Rp 50k Welcome Gift", birthday: "1x Points Boost", access: "Standard Catalog Only" },
                    { name: "Silver", spend: "100 - 499 PTS", mult: "1.2x Points", vouchers: "Rp 100k Voucher", birthday: "Rp 50k Voucher", access: "Early Access Releases" },
                    { name: "Gold", spend: "500 - 999 PTS", mult: "1.5x Points", vouchers: "Rp 250k Voucher + Free Ship", birthday: "Rp 100k Voucher + Premium Gift", access: "Premium Collection Entry" },
                    { name: "Platinum", spend: ">= 1000 PTS", mult: "2.0x Points", vouchers: "Rp 500k Voucher + Priority", birthday: "Rp 200k Voucher + Custom Gift", access: "VIP Exclusive Catalog Access" }
                  ].map((tierItem, idx) => {
                    const isActive = tierConfig.tier === tierItem.name;
                    return (
                      <div
                        key={idx}
                        className={`border rounded-2xl p-5 relative ${
                          isActive
                            ? "border-[#2B7FFF] bg-[#2B7FFF]/5 ring-1 ring-[#2B7FFF]/30"
                            : "border-slate-200/60 bg-white"
                        }`}
                      >
                        {isActive && (
                          <span className="absolute top-2 right-2 bg-[#2B7FFF] text-white text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                            Current Tier
                          </span>
                        )}

                        <h3 className="text-xs font-bold text-slate-850">{tierItem.name}</h3>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">Spend: {tierItem.spend}</p>

                        <div className="mt-4 space-y-2.5 text-xs">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400 font-medium">Multiplier</span>
                            <span className="font-bold text-slate-800">{tierItem.mult}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400 font-medium">Vouchers</span>
                            <span className="font-bold text-slate-800">{tierItem.vouchers}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400 font-medium">Birthday Perks</span>
                            <span className="font-bold text-slate-800">{tierItem.birthday}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400 font-medium">Collections</span>
                            <span className="font-bold text-slate-800 text-right">{tierItem.access}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

            </div>
          )}

          {/* 4. WISHLIST & CATALOG TAB */}
          {activeTab === "wishlist" && (
            <div className="space-y-10 animate-slide">
              
              {/* Wishlist */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FaHeart className="text-rose-500 text-sm animate-pulse" />
                    <h2 className="text-base font-bold text-slate-800 uppercase tracking-wider">My Saved Wishlist</h2>
                  </div>
                  <span className="text-xs font-bold text-slate-400">{wishlist.length} Items Saved</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {wishlist.map(item => (
                    <div key={item.id} className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between group">
                      <div className="relative aspect-square overflow-hidden bg-slate-100 border-b border-slate-100">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-2 left-2 bg-[#0F172A]/80 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[8px] uppercase tracking-wider font-bold">
                          {item.category}
                        </span>
                        {!item.inStock && (
                          <div className="absolute inset-0 bg-[#0F172A]/60 backdrop-blur-xs flex items-center justify-center">
                            <span className="bg-rose-500 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded">Out of Stock</span>
                          </div>
                        )}
                      </div>
                      <div className="p-4 space-y-1">
                        <h3 className="text-xs font-bold text-slate-800 truncate">{item.name}</h3>
                        <p className="text-xs font-black text-[#2B7FFF]">
                          Rp {item.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* VIP Collection early access */}
              <section className="space-y-4">
                <div className="space-y-1">
                  <h2 className="text-base font-bold text-slate-800 uppercase tracking-wider">Exclusive Collection Entry</h2>
                  <p className="text-xs text-slate-500">Access exclusive releases based on your membership tier level.</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {collectionsList.map(col => {
                    const isAuthorized = checkTierAuth(col.tierRequired);
                    return (
                      <div key={col.id} className="relative bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between group">
                        
                        {/* Locked backdrop blur layer */}
                        {!isAuthorized && (
                          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs z-10 flex flex-col items-center justify-center p-4 text-center text-white space-y-2">
                            <div className="w-8 h-8 rounded-full bg-white/20 border border-white/20 flex items-center justify-center text-xs">
                              <FaLock />
                            </div>
                            <div>
                              <p className="text-[11px] font-bold tracking-wide uppercase">{col.tierRequired} Access Only</p>
                              <p className="text-[9px] font-light text-slate-350 mt-0.5">Upgrade tier to unlock catalog item</p>
                            </div>
                          </div>
                        )}

                        <div className="relative aspect-square overflow-hidden bg-slate-100">
                          <img
                            src={col.image}
                            alt={col.name}
                            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${!isAuthorized ? "blur-xs" : ""}`}
                          />
                          <span className="absolute top-2 left-2 bg-[#2B7FFF] text-white px-2 py-0.5 rounded text-[8px] uppercase tracking-wider font-bold">
                            {col.tierRequired} Tier
                          </span>
                        </div>

                        <div className="p-4 space-y-1">
                          <h3 className="text-xs font-bold text-slate-800 truncate">{col.name}</h3>
                          <p className="text-xs font-black text-slate-900">{col.price}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Recommended For You */}
              <section className="space-y-4">
                <div className="space-y-1">
                  <h2 className="text-base font-bold text-slate-800 uppercase tracking-wider">Recommended For You</h2>
                  <p className="text-xs text-slate-500">
                    Product selections tailored for your style (<span className="text-[#2B7FFF] font-bold">{preferences.style}</span>).
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { name: "Silk Midi Dress", reason: `Matches favorite Dress collection`, price: "Rp 580.000", img: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400" },
                    { name: "Leather Sling Bag", reason: `Recommended for ${tierConfig.tier} Tier`, price: "Rp 1.150.000", img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400" },
                    { name: "Linen Lightweight Blazer", reason: "Ideal for layering & Minimalist style", price: "Rp 780.000", img: "https://images.unsplash.com/photo-1509319117193-57bab727e09d?w=400" }
                  ].map((rec, i) => (
                    <div key={i} className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-xs flex items-center p-3 gap-4 group">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                        <img src={rec.img} alt={rec.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      </div>
                      <div className="space-y-1 flex-1 min-w-0">
                        <span className="text-[8px] font-bold text-[#2B7FFF] bg-[#2B7FFF]/10 px-2 py-0.5 rounded-full block w-fit">
                          {rec.reason}
                        </span>
                        <h3 className="text-xs font-bold text-slate-850 truncate">{rec.name}</h3>
                        <p className="text-xs font-black text-slate-900">{rec.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

            </div>
          )}

        </main>
      </div>

      {/* EDIT PROFILE MODAL */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl border border-slate-200/80 overflow-hidden animate-slide">
            <div className="bg-slate-50 border-b border-slate-150 p-5 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Edit Member Profile</h2>
              <button onClick={() => setShowEditProfile(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">&times;</button>
            </div>
            <form onSubmit={handleUpdateProfile} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Phone Number</label>
                <input
                  type="text"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary text-xs outline-none"
                  value={profileForm.phone}
                  onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Address / City</label>
                <input
                  type="text"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary text-xs outline-none"
                  value={profileForm.city}
                  onChange={e => setProfileForm({ ...profileForm, city: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Birthday</label>
                <input
                  type="date"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary text-xs outline-none"
                  value={profileForm.birthday}
                  onChange={e => setProfileForm({ ...profileForm, birthday: e.target.value })}
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#2B7FFF] hover:bg-[#2B7FFF]/90 text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-[#2B7FFF]/10 cursor-pointer"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditProfile(false)}
                  className="px-5 bg-slate-100 text-slate-600 hover:bg-slate-200 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NOTIFICATION MODAL */}
      {showNotificationModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4" onClick={() => setShowNotificationModal(false)}>
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl border border-slate-200/80 overflow-hidden animate-slide" onClick={e => e.stopPropagation()}>
            <div className="bg-slate-50 border-b border-slate-150 p-5 flex justify-between items-center">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Notifications</h2>
              <button onClick={() => setShowNotificationModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">&times;</button>
            </div>
            <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
              {[
                { title: "Loyalty Tier Upgraded", desc: `Selamat! Akun Anda berhasil disinkronkan ke tier ${tierConfig.tier}.`, time: "Baru saja" },
                { title: "Birthday Reward Available", desc: "Klaim voucher ulang tahun Anda di tab Loyalty & Reward.", time: "1 hari lalu" }
              ].map((notif, idx) => (
                <div key={idx} className="p-3 hover:bg-slate-50 rounded-xl transition-all border border-slate-100 flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#EAF3FF] text-[#2B7FFF] flex items-center justify-center text-xs flex-shrink-0">
                    <FaBell />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{notif.title}</h4>
                    <p className="text-[10px] text-slate-500 leading-normal mt-0.5">{notif.desc}</p>
                    <span className="text-[9px] text-slate-400 font-medium block mt-1">{notif.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </>
  );
}
