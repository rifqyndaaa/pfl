import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";
import { orderService } from "../services/orderService";
import { motion, AnimatePresence, animate } from "framer-motion";
import {
  MdShoppingBag,
  MdShoppingCart,
  MdNotifications,
  MdStar,
  MdCheckCircle,
  MdArrowBackIos,
  MdArrowForwardIos,
  MdMenu,
  MdClose,
  MdSearch,
  MdOutlineCheckroom,
  MdCardMembership,
  MdInfo,
  MdLocalShipping,
  MdSecurity,
  MdKeyboardArrowDown,
  MdTrendingUp,
  MdInventory2,
  MdPeople,
  MdReceiptLong,
  MdBarChart,
  MdPayment,
  MdThumbUpAlt,
} from "react-icons/md";
import { FaInstagram, FaTiktok, FaFacebook, FaTshirt, FaFemale, FaShoePrints, FaGem } from "react-icons/fa";

// ─── STATIC DATA ─────────────────────────────────────────────────────────────

const categoriesList = [
  { id: "Fashion", name: "Fashion", icon: FaTshirt, desc: "Premium outfits & streetwear" },
  { id: "Dress", name: "Dress", icon: FaFemale, desc: "Elegant designer silhouettes" },
  { id: "Shoes", name: "Shoes", icon: FaShoePrints, desc: "Step out in absolute comfort" },
  { id: "Bag", name: "Bag", icon: MdShoppingBag, desc: "Handcrafted boutique bags" },
  { id: "Accessories", name: "Accessories", icon: FaGem, desc: "Chic accents to elevate your look" }
];

const membershipTiers = [
  {
    name: "Bronze",
    color: "from-amber-600 to-amber-800",
    pointsReq: "0 Points Required",
    multiplier: "1.0x Points",
    voucher: "Rp 10.000 Welcome Voucher",
    reward: "Standard Redeem Rate",
    shipping: "Standard Rates",
    discount: "None"
  },
  {
    name: "Silver",
    color: "from-slate-400 to-slate-600",
    pointsReq: "500 Points Required",
    multiplier: "1.2x Points",
    voucher: "Rp 25.000 Birthday Voucher",
    reward: "Priority Redeem",
    shipping: "Free Shipping (Min Rp 500k)",
    discount: "5% Off Selected Items"
  },
  {
    name: "Gold",
    color: "from-yellow-500 to-amber-600",
    pointsReq: "1,500 Points Required",
    multiplier: "1.5x Points",
    voucher: "Rp 50.000 Monthly Voucher",
    reward: "VIP Redeem Benefits",
    shipping: "Free Shipping (Min Rp 300k)",
    discount: "10% Off All Items"
  },
  {
    name: "Platinum",
    color: "from-slate-800 to-slate-950",
    pointsReq: "5,000 Points Required",
    multiplier: "2.0x Points",
    voucher: "Rp 100.000 Seasonal Voucher",
    reward: "Instant Reward Claims",
    shipping: "Free Shipping (No Min Spend)",
    discount: "15% Off All Items + Early Access"
  }
];

const crmFlowSteps = [
  { num: "01", step: "Guest", desc: "Browses boutique store layout." },
  { num: "02", step: "Register", desc: "Creates verified member profile." },
  { num: "03", step: "Browse Product", desc: "Checks premium products database." },
  { num: "04", step: "Shopping Cart", desc: "Adds outfits to temporary cart." },
  { num: "05", step: "Checkout", desc: "Initiates purchase transaction." },
  { num: "06", step: "Order", desc: "Creates order with status Pending." },
  { num: "07", step: "Payment", desc: "Verifies payment validation." },
  { num: "08", step: "Completed", desc: "Order triggers profile CRM changes." },
  { num: "09", step: "Reward Point", desc: "Awards points dynamically to account." },
  { num: "10", step: "Tier Upgrade", desc: "Promotes user tier level (e.g. Gold)." },
  { num: "11", step: "Voucher", desc: "Claims special discount reward vouchers." },
  { num: "12", step: "Repeat Purchase", desc: "Returns for recurring fashion styles." },
  { num: "13", step: "Retention", desc: "Retained via automation campaign triggers." }
];

const brandTestimonials = [
  {
    quote: "Aesthetics are top notch! I got 85 loyalty points on my very first Silk Dress order, and the delivery to Jakarta was incredibly fast.",
    author: "Rissa Handayani",
    role: "Premium Member",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop"
  },
  {
    quote: "The loyalty point automation is seamless. I was automatically upgraded to Gold membership tier after my third transaction completed.",
    author: "Bimo Wicaksono",
    role: "Gold VIP Member",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop"
  },
  {
    quote: "Highly recommended boutique! Customer service responds instantly, and the exclusive discounts for Silver tier are great.",
    author: "Safira Putri",
    role: "Silver Member",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop"
  }
];

const fallbackImg = "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500&auto=format&fit=crop";

const fallbackProducts = [
  {
    id: 1,
    product_code: "PRD-0001",
    product_name: "Classic Silk Evening Dress",
    category: "Dress",
    price: 1250000,
    stock: 15,
    image_url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop",
    status: "Available",
    reward_points: 120
  },
  {
    id: 2,
    product_code: "PRD-0002",
    product_name: "Premium Leather Shoulder Bag",
    category: "Bag",
    price: 1890000,
    stock: 8,
    image_url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop",
    status: "Available",
    reward_points: 180
  },
  {
    id: 3,
    product_code: "PRD-0003",
    product_name: "Minimalist Gold Necklace",
    category: "Accessories",
    price: 750000,
    stock: 20,
    image_url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop",
    status: "Available",
    reward_points: 75
  },
  {
    id: 4,
    product_code: "PRD-0004",
    product_name: "Suede High Heel Shoes",
    category: "Shoes",
    price: 1450000,
    stock: 4,
    image_url: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&auto=format&fit=crop",
    status: "Available",
    reward_points: 140
  },
  {
    id: 5,
    product_code: "PRD-0005",
    product_name: "Oversized Cashmere Coat",
    category: "Fashion",
    price: 2450000,
    stock: 6,
    image_url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop",
    status: "Available",
    reward_points: 250
  },
  {
    id: 6,
    product_code: "PRD-0006",
    product_name: "Tailored Slim Fit Blazer",
    category: "Fashion",
    price: 1150000,
    stock: 12,
    image_url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&auto=format&fit=crop",
    status: "Available",
    reward_points: 110
  }
];

// ─── ANIMATED COUNTER COMPONENT ──────────────────────────────────────────────
function AnimatedCounter({ value, suffix = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const controls = animate(0, value, {
            duration: 2,
            ease: "easeOut",
            onUpdate(val) {
              node.textContent = Math.round(val).toLocaleString() + suffix;
            }
          });
          observer.unobserve(node);
          return () => controls.stop();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [value, suffix]);

  return <span ref={ref} className="font-mono font-black text-slate-900 dark:text-white">0{suffix}</span>;
}

export default function LandingPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // state variables
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  
  // Search Autocomplete state (Supabase powered)
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  // Real-time statistics from Supabase
  const [liveStats, setLiveStats] = useState({ members: 0, orders: 0, products: 0, satisfaction: 99 });

  // Modal and checkout actions
  const [checkoutProduct, setCheckoutProduct] = useState(null);
  const [checkoutQty, setCheckoutQty] = useState(1);
  const [submittingCheckout, setSubmittingCheckout] = useState(false);
  const [detailProduct, setDetailProduct] = useState(null);

  // visual state
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [toastMsg, setToastMsg] = useState("");
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);

  // Fetch real products from Supabase
  useEffect(() => {
    async function getProducts() {
      try {
        setLoadingProducts(true);
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("id", { ascending: true });

        if (error) throw error;
        if (data && data.length > 0) {
          setProducts(data);
        } else {
          setProducts(fallbackProducts);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts(fallbackProducts);
      } finally {
        setLoadingProducts(false);
      }
    }
    getProducts();
  }, []);

  // Fetch live statistics from Supabase
  useEffect(() => {
    async function fetchStats() {
      try {
        const { count: customerCount } = await supabase
          .from("customers")
          .select("*", { count: "exact", head: true });
        
        const { count: ordersCount } = await supabase
          .from("orders")
          .select("*", { count: "exact", head: true });

        const { count: productsCount } = await supabase
          .from("products")
          .select("*", { count: "exact", head: true });

        setLiveStats({
          members: customerCount || 1284,
          orders: ordersCount || 349,
          products: productsCount || 85,
          satisfaction: 99
        });
      } catch (err) {
        console.error("Error fetching realtime statistics:", err);
      }
    }
    fetchStats();
  }, []);

  // Supabase Autocomplete Search query with debouncer
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const delayDebounce = setTimeout(async () => {
      try {
        setSearchLoading(true);
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .ilike("product_name", `%${searchQuery}%`)
          .limit(6);

        if (!error && data) {
          setSearchResults(data);
        }
      } catch (err) {
        console.error("Autocomplete search error:", err);
      } finally {
        setSearchLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // scroll listener for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // auto scroll testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % brandTestimonials.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  // Toast notifier helper
  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg("");
    }, 3500);
  };
  

  // add to cart
  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
    showToast(`${product.product_name} ditambahkan ke Cart.`);
  };

  // update cart quantity
  const handleUpdateQty = (prodId, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.product.id === prodId) {
            const nextQty = item.quantity + delta;
            return { ...item, quantity: nextQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  // checkout actions logic
  const handleOpenCheckout = (product, quantity) => {
    if (!user) {
      showToast("Silakan login sebagai Member untuk melakukan pembelian.");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
      return;
    }
    if (user.role !== "member") {
      showToast("Hanya Member yang dapat melakukan transaksi.");
      return;
    }
    setCheckoutProduct(product);
    setCheckoutQty(quantity || 1);
  };

  const handleConfirmCheckout = async () => {
    if (!user || user.role !== "member") return;
    try {
      setSubmittingCheckout(true);
      // Fetch customer ID
      const { data: customer, error: custErr } = await supabase
        .from("customers")
        .select("id")
        .eq("email", user.email)
        .single();

      if (custErr || !customer) {
        throw new Error("Customer profile not found. Please re-login.");
      }

      const orderPayload = {
        customer_id: customer.id,
        product_id: checkoutProduct.id,
        quantity: checkoutQty,
        total_price: parseFloat((checkoutProduct.price * checkoutQty).toFixed(2)),
        status: "Pending" // Automatically triggers loyalty updates via DB trigger
      };

      await orderService.create(orderPayload);
      showToast(`Pesanan ${checkoutProduct.product_name} berhasil dibuat! (Status: Pending)`);
      
      // Clear cart of this item if it existed in the cart
      setCart((prev) => prev.filter((item) => item.product.id !== checkoutProduct.id));
      setCheckoutProduct(null);
    } catch (err) {
      console.error(err);
      showToast(err.message || "Gagal membuat order.");
    } finally {
      setSubmittingCheckout(false);
    }
  };

  // checkout all cart items in a loop
  const handleCartCheckout = async () => {
    if (!user) {
      showToast("Silakan login sebagai Member untuk melakukan pembelian.");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }
    if (user.role !== "member") {
      showToast("Hanya Member yang dapat melakukan transaksi.");
      return;
    }
    if (cart.length === 0) return;

    try {
      setSubmittingCheckout(true);
      const { data: customer, error: custErr } = await supabase
        .from("customers")
        .select("id")
        .eq("email", user.email)
        .single();

      if (custErr || !customer) {
        throw new Error("Customer profile not found.");
      }

      for (const item of cart) {
        const orderPayload = {
          customer_id: customer.id,
          product_id: item.product.id,
          quantity: item.quantity,
          total_price: parseFloat((item.product.price * item.quantity).toFixed(2)),
          status: "Pending"
        };
        await orderService.create(orderPayload);
      }

      showToast("Checkout keranjang berhasil! Semua order berstatus Pending.");
      setCart([]);
      setCartOpen(false);
    } catch (err) {
      console.error(err);
      showToast("Gagal memproses checkout keranjang.");
    } finally {
      setSubmittingCheckout(false);
    }
  };

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      showToast("Logout sukses.");
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased selection:bg-primary selection:text-white font-sans">
      
      {/* Toast Notification Banner */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] bg-slate-900 text-white text-xs font-semibold px-6 py-3.5 rounded-full shadow-2xl flex items-center gap-3 border border-white/10"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── STICKY GLASSMORPHISM NAVBAR ── */}
      <header
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 py-3.5 shadow-md shadow-slate-100/50"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="font-serif text-xl sm:text-2xl font-black tracking-[0.25em] text-slate-900 hover:text-primary transition-colors uppercase"
          >
            BUIQ
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-7">
            <button
              onClick={() => scrollToSection("home")}
              className="text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-primary transition-colors cursor-pointer"
            >
              Home
            </button>

            {/* Mega Menu Toggle */}
            <div
              className="relative"
              onMouseEnter={() => setMegaMenuOpen(true)}
              onMouseLeave={() => setMegaMenuOpen(false)}
            >
              <button
                className="text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-primary transition-colors flex items-center gap-1 cursor-pointer py-2"
              >
                Products <MdKeyboardArrowDown className="text-sm" />
              </button>

              {/* Mega Menu Drops */}
              <AnimatePresence>
                {megaMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    transition={{ duration: 0.25 }}
                    className="absolute left-1/2 -translate-x-1/2 top-full w-[600px] bg-white border border-slate-200 shadow-2xl rounded-2xl p-6 grid grid-cols-3 gap-6"
                  >
                    <div className="col-span-2 space-y-3">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                        Collections Categories
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { label: "New Arrival", filter: "All" },
                          { label: "Dress", filter: "Dress" },
                          { label: "Outer", filter: "Fashion" },
                          { label: "Shoes", filter: "Shoes" },
                          { label: "Bag", filter: "Bag" },
                          { label: "Accessories", filter: "Accessories" },
                          { label: "Membership", action: "membership" },
                          { label: "Promo", filter: "Fashion" },
                        ].map((m) => (
                          <button
                            key={m.label}
                            onClick={() => {
                              if (m.action) {
                                scrollToSection(m.action);
                              } else {
                                setSelectedCategory(m.filter);
                                scrollToSection("products");
                              }
                              setMegaMenuOpen(false);
                            }}
                            className="text-left text-xs font-semibold text-slate-650 hover:text-primary transition-all p-1.5 rounded-lg hover:bg-slate-50"
                          >
                            {m.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-primary/5 rounded-xl p-4 flex flex-col justify-between border border-primary/10">
                      <div>
                        <span className="bg-primary text-white text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md">
                          Campaign
                        </span>
                        <h4 className="text-xs font-extrabold text-slate-900 mt-2.5">
                          New Season Drops
                        </h4>
                        <p className="text-[10px] text-slate-450 mt-1 leading-relaxed">
                          Get double loyalty point multiplier for all dress purchases.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedCategory("Dress");
                          scrollToSection("products");
                          setMegaMenuOpen(false);
                        }}
                        className="text-[9px] font-bold text-primary flex items-center gap-1 mt-4 hover:underline"
                      >
                        Explore Now →
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => scrollToSection("membership")}
              className="text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-primary transition-colors cursor-pointer"
            >
              Membership
            </button>
            <button
              onClick={() => scrollToSection("features")}
              className="text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-primary transition-colors cursor-pointer"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-primary transition-colors cursor-pointer"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-primary transition-colors cursor-pointer"
            >
              Contact
            </button>
          </nav>

          {/* Right Side Options */}
          <div className="hidden md:flex items-center gap-5">
            
            {/* Autocomplete Search input */}
            <div className="relative">
              <div className="flex items-center bg-slate-100 rounded-xl px-3 py-1.5 border border-slate-200 focus-within:border-primary/50 focus-within:bg-white transition-all w-48 focus-within:w-64">
                <MdSearch className="text-slate-400 text-lg mr-1.5" />
                <input
                  type="text"
                  placeholder="Search Products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                  className="bg-transparent border-none text-[11px] outline-none w-full text-slate-700 placeholder:text-slate-400"
                />
              </div>

              {/* Autocomplete Results Box */}
              <AnimatePresence>
                {searchFocused && (searchQuery.trim().length > 0) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-full mt-2 w-80 bg-white border border-slate-200 shadow-2xl rounded-2xl p-3 space-y-2 z-50 overflow-hidden"
                  >
                    {searchLoading ? (
                      <p className="text-[10px] text-slate-400 text-center py-3">Searching live stock...</p>
                    ) : searchResults.length === 0 ? (
                      <p className="text-[10px] text-slate-400 text-center py-3">No product matched "{searchQuery}"</p>
                    ) : (
                      <div className="space-y-1">
                        {searchResults.map((res) => (
                          <button
                            key={res.id}
                            onMouseDown={() => setDetailProduct(res)}
                            className="w-full flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-all text-left"
                          >
                            <img
                              src={res.image_url || fallbackImg}
                              alt=""
                              className="w-9 h-9 object-cover rounded-lg bg-slate-100 border border-slate-100"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-[10.5px] font-bold text-slate-850 truncate">{res.product_name}</p>
                              <p className="text-[9.5px] text-slate-450 mt-0.5">Rp {parseFloat(res.price).toLocaleString()}</p>
                            </div>
                            <span className="text-[9px] bg-amber-50 text-amber-600 font-bold px-1.5 py-0.5 rounded-md border border-amber-100 shrink-0">
                              +{res.reward_points} Pts
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Shopping Cart Icon with Badge */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors"
            >
              <MdShoppingCart className="text-xl" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-[9px] font-black rounded-full flex items-center justify-center border border-white">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>

            {/* Notification Badge */}
            <div className="relative p-2 rounded-xl text-slate-700">
              <MdNotifications className="text-xl" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border border-white" />
            </div>

            {/* Auth Actions */}
            {user ? (
              <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
                <span className="text-[11px] font-semibold text-slate-500">
                  Hi, {user.full_name.split(" ")[0]}
                </span>
                <Link
                  to={user.role === "admin" ? "/dashboard" : "/member-dashboard"}
                  className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md shadow-primary/10"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-[11px] font-bold text-slate-400 hover:text-rose-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
                <Link
                  to="/login"
                  className="text-xs font-bold px-3 py-2 text-slate-650 hover:text-primary transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-slate-900 hover:bg-slate-950 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 rounded-xl text-slate-700"
            >
              <MdShoppingCart className="text-xl" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-primary text-white text-[8px] font-black rounded-full flex items-center justify-center">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1 rounded-xl text-slate-800"
            >
              <MdMenu className="text-2xl" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-50 bg-black"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed inset-y-0 right-0 z-50 w-64 bg-white p-6 shadow-2xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                  <span className="font-extrabold text-sm tracking-wider text-slate-950">
                    BUIQ MENU
                  </span>
                  <button onClick={() => setMobileMenuOpen(false)}>
                    <MdClose className="text-xl text-slate-400" />
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  {[
                    { label: "Home", id: "home" },
                    { label: "Products", id: "products" },
                    { label: "Membership", id: "membership" },
                    { label: "Features", id: "features" },
                    { label: "About", id: "about" },
                    { label: "Contact", id: "contact" }
                  ].map((link) => (
                    <button
                      key={link.id}
                      onClick={() => scrollToSection(link.id)}
                      className="text-left text-xs font-bold text-slate-655 hover:text-primary py-2.5 transition-colors border-b border-slate-50 border-solid"
                    >
                      {link.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 space-y-2">
                {user ? (
                  <>
                    <Link
                      to={user.role === "admin" ? "/dashboard" : "/member-dashboard"}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full bg-primary text-white text-center py-2.5 rounded-xl text-xs font-bold shadow-md shadow-primary/15"
                    >
                      Go to Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleLogout();
                      }}
                      className="block w-full border border-slate-200 text-slate-500 text-center py-2.5 rounded-xl text-xs font-bold"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full text-slate-700 text-center py-2.5 rounded-xl text-xs font-bold hover:bg-slate-50"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full bg-slate-950 text-white text-center py-2.5 rounded-xl text-xs font-bold"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── HERO SECTION WITH LUXURIOUS WHITE BACKGROUND & SIGNATURE BOUTIQUE IMAGE ── */}
      <section
        id="home"
        className="relative h-screen min-h-[600px] flex items-center justify-center bg-[#FAF9F6] overflow-hidden"
      >
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />

        {/* Decorative subtle ambient lights */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[55%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[50%] rounded-full bg-amber-500/5 blur-[120px]" />
        
        {/* Content with Framer Motion animations */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            <div className="flex items-center gap-2">
              <span className="w-8 h-0.5 bg-primary" />
              <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-primary">
                BUIQ PLATFORM
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black text-slate-900 tracking-tight leading-[1.08]">
              Elevate Your <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-500">
                Boutique Lifestyle
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl font-light">
              Kelola boutique sekaligus nikmati Loyalty Membership terbaik. Dapatkan point loyalty reward otomatis dari setiap produk fashion premium kami.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => scrollToSection("products")}
                className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-8 py-4 rounded-xl shadow-lg shadow-primary/20 transition-all cursor-pointer"
              >
                Shop Now
              </button>
              <Link
                to={user ? "/member-dashboard" : "/register"}
                className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold px-8 py-4 rounded-xl transition-all shadow-sm"
              >
                Join Membership
              </Link>
            </div>
          </motion.div>

          {/* Right Side - Signature Boutique Image & Floating Cards */}
          <div className="lg:col-span-5 relative w-full flex items-center justify-center hidden lg:block">
            {/* Elegant Image Frame */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative w-full max-w-[340px] aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white bg-white"
            >
              <img
                src="/img/boutique_signature.png"
                alt="Signature BUIQ Boutique"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent" />
            </motion.div>

            {/* Total Members Card (Floating) */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="absolute top-8 -left-10 bg-white/95 backdrop-blur-md border border-slate-250/60 rounded-2xl p-4 shadow-xl text-left w-48 text-slate-800 z-30"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-base">
                  <MdPeople />
                </div>
                <div>
                  <p className="text-[9px] text-slate-400 font-bold uppercase">Total Members</p>
                  <p className="text-sm font-extrabold font-mono text-slate-900">
                    {liveStats.members.toLocaleString()}+
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Today's Orders Card (Floating) */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
              className="absolute bottom-16 -right-6 bg-white/95 backdrop-blur-md border border-slate-250/60 rounded-2xl p-4 shadow-xl text-left w-48 text-slate-800 z-30"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 text-base">
                  <MdReceiptLong />
                </div>
                <div>
                  <p className="text-[9px] text-slate-400 font-bold uppercase">Today's Orders</p>
                  <p className="text-sm font-extrabold font-mono text-slate-900">
                    {liveStats.orders.toLocaleString()}+
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Loyalty Points Card (Floating) */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 4.2, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md border border-slate-250/60 rounded-2xl p-4 shadow-xl text-left w-48 text-slate-800 z-30"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 text-base">
                  <MdStar />
                </div>
                <div>
                  <p className="text-[9px] text-slate-400 font-bold uppercase">Loyalty Points</p>
                  <p className="text-sm font-extrabold font-mono text-slate-900">450K+ Pts</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── INTERACTIVE CATEGORY FILTER ── */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
            <p className="text-[9px] font-bold tracking-[0.25em] uppercase text-primary">
              Curation Categories
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Browse Boutique Categories
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categoriesList.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id === selectedCategory ? "All" : cat.id);
                    scrollToSection("products");
                  }}
                  className={`group p-6 rounded-2xl border text-center transition-all duration-300 cursor-pointer flex flex-col items-center justify-center space-y-4 ${
                    selectedCategory === cat.id
                      ? "border-primary bg-primary/5 shadow-md shadow-primary/5"
                      : "border-slate-150 bg-slate-50 hover:bg-white hover:border-slate-350 hover:shadow-md"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      selectedCategory === cat.id
                        ? "bg-primary text-white"
                        : "bg-white text-slate-700 shadow-sm group-hover:bg-primary group-hover:text-white"
                    }`}
                  >
                    <Icon className="text-lg" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-850">{cat.name}</h4>
                    <p className="text-[9px] text-slate-400 mt-1">{cat.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS (6 ITEMS FROM SUPABASE) ── */}
      <section id="products" className="py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="space-y-2 text-left">
              <p className="text-[9px] font-bold tracking-[0.25em] uppercase text-primary">
                Live Store Collection
              </p>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Featured Products Catalog
              </h2>
              <p className="text-xs text-slate-400 max-w-xl font-light">
                Klik produk fashion premium di bawah untuk melihat rincian poin loyalitas atau melakukan transaksi.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap gap-1.5 bg-slate-150 p-1 rounded-xl self-start md:self-end">
              {["All", "Fashion", "Dress", "Shoes", "Bag", "Accessories"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {loadingProducts ? (
            <div className="py-12 text-center text-xs text-slate-400 font-semibold">
              Loading boutique items...
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {products
                .filter((p) => selectedCategory === "All" || p.category.toLowerCase() === selectedCategory.toLowerCase())
                .slice(0, 6)
                .map((p, idx) => {
                  // Determine dynamic badges based on product specs
                  const isLowStock = p.stock <= 5;
                  const isBestSeller = p.reward_points >= 120;
                  const isNewArrival = p.id % 2 !== 0;
                  const isDiscount = p.price >= 1500000;

                  return (
                    <div
                      key={p.id}
                      className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-slate-350 transition-all duration-300 flex flex-col justify-between"
                    >
                      <div className="relative aspect-[3/4] bg-slate-100 overflow-hidden">
                        <img
                          src={p.image_url || fallbackImg}
                          alt={p.product_name}
                          onError={(e) => {
                            e.target.src = fallbackImg;
                          }}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />

                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                          <span className="bg-slate-900/80 backdrop-blur-md text-white text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
                            {p.category}
                          </span>
                          {isLowStock && (
                            <span className="bg-rose-50 text-rose-750 border border-rose-100 text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
                              Low Stock
                            </span>
                          )}
                          {isBestSeller && (
                            <span className="bg-amber-50 text-amber-700 border border-amber-100 text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
                              Best Seller
                            </span>
                          )}
                          {isNewArrival && !isBestSeller && (
                            <span className="bg-blue-50 text-blue-750 border border-blue-100 text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
                              New Arrival
                            </span>
                          )}
                          {isDiscount && (
                            <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
                              Member Discount
                            </span>
                          )}
                        </div>

                        <div className="absolute top-3 right-3">
                          <span className="bg-amber-500 text-white text-[9px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                            ★ {p.reward_points} Pts
                          </span>
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 group-hover:text-primary transition-colors line-clamp-1">
                            {p.product_name}
                          </h4>
                          <p className="text-[10px] text-slate-400 mt-0.5">Code: {p.product_code}</p>
                        </div>

                        <div className="mt-4 space-y-3.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-slate-900">
                              Rp {parseFloat(p.price).toLocaleString()}
                            </span>
                            <span className="text-[9px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                              Stock: {p.stock}
                            </span>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => setDetailProduct(p)}
                              className="flex-1 border border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-slate-600 text-[10px] font-bold py-2.5 rounded-xl transition-all cursor-pointer text-center"
                            >
                              Detail
                            </button>
                            <button
                              onClick={() => {
                                handleAddToCart(p);
                                handleOpenCheckout(p, 1);
                              }}
                              className="flex-1 bg-primary hover:bg-primary-hover text-white text-[10px] font-bold py-2.5 rounded-xl transition-all cursor-pointer text-center shadow-md shadow-primary/10"
                            >
                              Beli Sekarang
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </section>

      {/* ── WHY CHOOSE BUIQ (CRM FEATURE OVERVIEW) ── */}
      <section id="features" className="py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
            <p className="text-[9px] font-bold tracking-[0.25em] uppercase text-primary">
              Core CRM Systems
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Why Choose BUIQ?
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              BUIQ menggabungkan kemewahan butik fisik dengan kecanggihan sistem CRM otomatis untuk meningkatkan loyalitas dan retensi pelanggan Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: MdCardMembership,
                title: "Loyalty Membership",
                desc: "Sistem tiering Bronze, Silver, Gold, hingga Platinum dengan reward multiplier otomatis berdasarkan total poin."
              },
              {
                icon: MdStar,
                title: "Reward Points Program",
                desc: "Kumpulkan poin loyalitas dari setiap transaksi yang dapat ditukarkan dengan welcome voucher & voucher khusus tier."
              },
              {
                icon: MdInventory2,
                title: "Inventory Management",
                desc: "Pelacakan stok real-time dengan status 'Available', 'Low Stock', dan 'Out of Stock' untuk mengoptimalkan persediaan."
              },
              {
                icon: MdPeople,
                title: "Customer Tracking",
                desc: "Catat data profil pembeli, riwayat pesanan, status loyalty, dan total pembelanjaan secara otomatis."
              },
              {
                icon: MdReceiptLong,
                title: "Order Monitoring",
                desc: "Pantau status pengiriman, checkout orders, dan histori order history secara transparan dan realtime."
              },
              {
                icon: MdBarChart,
                title: "Dashboard Analytics",
                desc: "Visualisasi analitik penjualan, revenue bulanan, dan total pertumbuhan member baru dalam satu dashboard."
              }
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="bg-slate-50 border border-slate-200/60 p-8 rounded-3xl hover:bg-white hover:border-slate-350 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center text-xl mb-6">
                    <Icon />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900 mb-2">{f.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-light">{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CRM FLOW VISUALIZATION ── */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden border-b border-slate-950">
        <div className="absolute inset-0 bg-grid opacity-5 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-xl mx-auto mb-20 space-y-3">
            <p className="text-[9px] font-bold tracking-[0.25em] uppercase text-primary">
              Automation Workflow
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Sistem Otomatisasi CRM Flow
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Bagaimana data interaksi pelanggan mengalir dari awal pendaftaran hingga memicu reward loyalitas otomatis di database.
            </p>
          </div>

          <div className="relative">
            {/* Desktop Timeline Line */}
            <div className="absolute top-[38px] left-[5%] right-[5%] h-0.5 bg-slate-800 hidden lg:block z-0" />
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 relative z-10">
              {[
                { step: "01", name: "Guest", desc: "Browses boutique showroom layout." },
                { step: "02", name: "Register", desc: "Creates verified member account." },
                { step: "03", name: "Browse Product", desc: "Checks premium products catalog." },
                { step: "04", name: "Shopping Cart", desc: "Adds fashion items to cart." },
                { step: "05", name: "Checkout", desc: "Initiates purchase transaction." },
                { step: "06", name: "Order", desc: "Creates order with status Pending." },
                { step: "07", name: "Payment", desc: "Verifies payment validation." },
                { step: "08", name: "Completed", desc: "Triggers CRM profile stats update." },
                { step: "09", name: "Reward Point", desc: "Awards points dynamically." },
                { step: "10", name: "Membership Upgrade", desc: "Promotes member tier level." },
                { step: "11", name: "Voucher", desc: "Claims tier welcome voucher." },
                { step: "12", name: "Repeat Purchase", desc: "Re-enters cycle with VIP perks." },
              ].map((s, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950/40 backdrop-blur-md border border-white/5 p-5 rounded-2xl text-left space-y-3 hover:border-primary/50 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-primary font-bold">{s.step}</span>
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{s.name}</h4>
                    <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── MEMBERSHIP TIMELINE & BENEFITS ── */}
      <section id="membership" className="py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
            <p className="text-[9px] font-bold tracking-[0.25em] uppercase text-primary">
              Loyalty Loyalty Program
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              BUIQ Membership Tiers
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Kumpulkan reward points dari setiap checkout belanja untuk meningkatkan tier member Anda dan membuka potongan harga spesial.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {membershipTiers.map((tier) => (
              <div
                key={tier.name}
                className="bg-slate-50 rounded-3xl p-6 border border-slate-200 hover:shadow-xl hover:border-slate-350 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className={`h-2.5 rounded-full bg-gradient-to-r ${tier.color} mb-6`} />
                  <h3 className="text-lg font-black text-slate-900 mb-1">{tier.name}</h3>
                  <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase block mb-6">
                    {tier.pointsReq}
                  </span>

                  <ul className="space-y-3.5 text-xs text-slate-600 font-medium">
                    <li className="flex items-center gap-2">
                      <MdCheckCircle className="text-primary shrink-0" />
                      <span>{tier.multiplier} Multiplier</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <MdCheckCircle className="text-primary shrink-0" />
                      <span>{tier.discount} discount</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <MdCheckCircle className="text-primary shrink-0" />
                      <span className="truncate">{tier.voucher}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <MdCheckCircle className="text-primary shrink-0" />
                      <span className="truncate">{tier.shipping}</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-200">
                  <span className="text-[10px] text-slate-400 block font-light">
                    Redemption Benefit
                  </span>
                  <p className="text-[11px] font-bold text-slate-800 mt-1">{tier.reward}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REALTIME STATISTICS SECTION WITH SCROLL COUNT TRIGGER ── */}
      <section className="bg-slate-100 py-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-slate-250">
            <div className="flex flex-col items-center justify-center p-4">
              <span className="text-4xl sm:text-5xl font-black">
                <AnimatedCounter value={liveStats.members} />+
              </span>
              <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mt-2">
                Total Members
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-4 pt-8 lg:pt-4">
              <span className="text-4xl sm:text-5xl font-black">
                <AnimatedCounter value={liveStats.orders} />+
              </span>
              <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mt-2">
                Today's Orders
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-4 pt-8 lg:pt-4">
              <span className="text-4xl sm:text-5xl font-black">
                <AnimatedCounter value={liveStats.products} />
              </span>
              <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mt-2">
                Premium Products
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-4 pt-8 lg:pt-4">
              <span className="text-4xl sm:text-5xl font-black">
                <AnimatedCounter value={liveStats.satisfaction} suffix="%" />
              </span>
              <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mt-2">
                Customer Satisfaction
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS SECTION ── */}
      <section className="py-24 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-[9px] font-bold tracking-[0.25em] uppercase text-primary mb-3">
            Customer Voice
          </p>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-12">
            What Members Say
          </h2>

          <div className="min-h-[160px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <div className="flex justify-center text-amber-500 text-sm">
                  <MdStar /><MdStar /><MdStar /><MdStar /><MdStar />
                </div>
                <blockquote className="font-serif text-lg md:text-xl text-slate-700 italic leading-relaxed">
                  "{brandTestimonials[activeTestimonial].quote}"
                </blockquote>
                <div className="flex flex-col items-center gap-2">
                  <img
                    src={brandTestimonials[activeTestimonial].avatar}
                    alt=""
                    className="w-11 h-11 object-cover rounded-full border border-slate-200 shadow-sm"
                  />
                  <p className="text-xs font-black text-slate-900">
                    {brandTestimonials[activeTestimonial].author}
                  </p>
                  <p className="text-[9px] text-slate-400 tracking-wider uppercase font-bold">
                    {brandTestimonials[activeTestimonial].role}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center gap-2.5 mt-8">
            {brandTestimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTestimonial(idx)}
                className={`h-1.5 rounded-full transition-all duration-350 cursor-pointer ${
                  activeTestimonial === idx ? "bg-primary w-6" : "bg-slate-200 w-3"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT SECTION ── */}
      <section id="about" className="py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6 text-left">
              <p className="text-[9px] font-bold tracking-[0.25em] uppercase text-primary">
                Brand Origin
              </p>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                About BUIQ Boutique
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed font-light">
                BUIQ didirikan di Jakarta dengan mengutamakan kualitas jahitan struktur bahan baku terbaik, dan minimalis tanpa logo mencolok. Kami menyederhanakan cara berpakaian agar Anda tetap tampil elegan di berbagai kesempatan, baik santai maupun formal.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-900">
                    Visi
                  </h4>
                  <p className="text-[11px] text-slate-405 mt-1 leading-relaxed">
                    Menjadi pionir brand fashion premium yang memadukan keindahan butik dengan otomatisasi CRM terbaik di Asia Tenggara.
                  </p>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-900">
                    Misi
                  </h4>
                  <p className="text-[11px] text-slate-405 mt-1 leading-relaxed">
                    Menghasilkan pakaian elegan berkualitas tinggi dengan kemudahan transaksi berkat sistem points & loyalty modern.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop"
                alt=""
                className="w-full aspect-[4/3] object-cover rounded-3xl bg-white border border-slate-200 shadow-sm"
              />
              <img
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop"
                alt=""
                className="w-full aspect-[4/3] object-cover rounded-3xl bg-white border border-slate-200 shadow-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT SECTION ── */}
      <section id="contact" className="py-24 bg-white border-b border-slate-250">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5 space-y-8 text-left">
              <div>
                <p className="text-[9px] font-bold tracking-[0.25em] uppercase text-primary mb-2">
                  Customer Care
                </p>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                  Get in Touch
                </h2>
              </div>

              <div className="space-y-5 text-xs text-slate-500 font-light leading-relaxed">
                <div>
                  <h4 className="text-[10px] font-bold uppercase text-slate-800">Jakarta Showroom</h4>
                  <p>BUIQ Showroom Building, Jl. Sudirman Kav 21, Jakarta Selatan 12920</p>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase text-slate-800">Digital Support</h4>
                  <p>Email: support@buiqstore.com</p>
                  <p>WA Chat: +62 812-9876-5432</p>
                </div>
              </div>

              <div className="flex gap-3">
                {[FaInstagram, FaTiktok, FaFacebook].map((Icon, idx) => (
                  <a
                    key={idx}
                    href="#"
                    className="w-9 h-9 rounded-full bg-slate-100 hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center text-slate-700 border border-slate-200/50"
                  >
                    <Icon className="text-sm" />
                  </a>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 bg-slate-50 rounded-3xl p-8 border border-slate-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-4 mb-6">
                Send us a Message
              </h4>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  showToast("Message sent successfully! Our sales team will get back to you.");
                  e.target.reset();
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] font-bold uppercase text-slate-500 block mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Your Name"
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold uppercase text-slate-500 block mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="Your Email"
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-bold uppercase text-slate-500 block mb-1">
                    Your Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Write your message here..."
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs outline-none focus:border-primary resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-slate-950 hover:bg-primary text-white text-xs font-bold py-3.5 rounded-xl transition-all shadow-md"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-slate-950 text-slate-450 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-14 border-b border-slate-800">
            <div className="space-y-5 text-left">
              <span className="font-serif text-2xl font-black tracking-widest text-white uppercase">
                BUIQ
              </span>
              <p className="text-xs text-slate-400 leading-relaxed font-light">
                Sleek boutique fashion catalog integrated with automated CRM & loyalty tier automation program.
              </p>
            </div>

            <div className="space-y-4 text-left">
              <h4 className="text-[10px] font-bold uppercase text-white tracking-widest">Products</h4>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li>
                  <button onClick={() => { setSelectedCategory("Dress"); scrollToSection("products"); }} className="hover:text-primary transition-colors cursor-pointer">
                    Dress Collections
                  </button>
                </li>
                <li>
                  <button onClick={() => { setSelectedCategory("Bag"); scrollToSection("products"); }} className="hover:text-primary transition-colors cursor-pointer">
                    Boutique Bags
                  </button>
                </li>
                <li>
                  <button onClick={() => { setSelectedCategory("Shoes"); scrollToSection("products"); }} className="hover:text-primary transition-colors cursor-pointer">
                    Designer Shoes
                  </button>
                </li>
                <li>
                  <button onClick={() => { setSelectedCategory("Accessories"); scrollToSection("products"); }} className="hover:text-primary transition-colors cursor-pointer">
                    Jewelry & Accessories
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-4 text-left">
              <h4 className="text-[10px] font-bold uppercase text-white tracking-widest">Membership</h4>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li>
                  <button onClick={() => scrollToSection("membership")} className="hover:text-primary transition-colors cursor-pointer">
                    Bronze Benefits
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection("membership")} className="hover:text-primary transition-colors cursor-pointer">
                    Silver Benefits
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection("membership")} className="hover:text-primary transition-colors cursor-pointer">
                    Gold VIP Perks
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection("membership")} className="hover:text-primary transition-colors cursor-pointer">
                    Platinum Instant Claims
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-4 text-left">
              <h4 className="text-[10px] font-bold uppercase text-white tracking-widest">CRM Flow</h4>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li>
                  <Link to="/register" className="hover:text-primary transition-colors">
                    Create Member Account
                  </Link>
                </li>
                <li>
                  <button onClick={() => scrollToSection("products")} className="hover:text-primary transition-colors cursor-pointer">
                    Add Items to Cart
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection("products")} className="hover:text-primary transition-colors cursor-pointer">
                    Pending Orders Check
                  </button>
                </li>
                <li>
                  <Link to={user ? "/member-dashboard" : "/login"} className="hover:text-primary transition-colors">
                    Check Loyalty Points
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-[10px] text-slate-500 uppercase tracking-widest">
            <p>© 2026 BUIQ BOUTIQUE INC. ALL RIGHTS RESERVED.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* ── SHOPPING CART DRAWER (GLASSMORPHISM PANEL) ── */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              className="fixed inset-0 z-50 bg-black"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed inset-y-0 right-0 z-50 w-96 bg-white p-6 shadow-2xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                  <div className="flex items-center gap-2">
                    <MdShoppingCart className="text-xl text-primary" />
                    <span className="font-extrabold text-sm text-slate-900 tracking-wider">
                      SHOPPING BAG ({cart.reduce((sum, item) => sum + item.quantity, 0)})
                    </span>
                  </div>
                  <button onClick={() => setCartOpen(false)}>
                    <MdClose className="text-xl text-slate-400 hover:text-slate-700" />
                  </button>
                </div>

                {cart.length === 0 ? (
                  <div className="text-center py-20 space-y-4">
                    <p className="text-xs text-slate-400 font-semibold">Your shopping bag is empty.</p>
                    <button
                      onClick={() => {
                        setCartOpen(false);
                        scrollToSection("products");
                      }}
                      className="bg-primary text-white text-[10px] font-bold px-6 py-2.5 rounded-xl uppercase tracking-wider"
                    >
                      Browse Products
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 overflow-y-auto max-h-[50vh] pr-2">
                    {cart.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex gap-4 p-3 border border-slate-100 rounded-xl bg-slate-50"
                      >
                        <img
                          src={item.product.image_url || fallbackImg}
                          alt=""
                          className="w-16 h-20 object-cover rounded-lg bg-white border"
                        />
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="text-xs font-bold text-slate-800 line-clamp-1">
                              {item.product.product_name}
                            </h4>
                            <p className="text-[10px] text-slate-500 mt-1">
                              Rp {parseFloat(item.product.price).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center border border-slate-200 rounded-lg bg-white">
                              <button
                                onClick={() => handleUpdateQty(item.product.id, -1)}
                                className="px-2.5 py-1 text-xs font-bold hover:bg-slate-100 text-slate-650"
                              >
                                -
                              </button>
                              <span className="px-3 text-xs font-mono font-bold text-slate-800">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleUpdateQty(item.product.id, 1)}
                                className="px-2.5 py-1 text-xs font-bold hover:bg-slate-100 text-slate-650"
                              >
                                +
                              </button>
                            </div>
                            <span className="text-[10px] bg-amber-50 text-amber-600 font-bold px-2 py-0.5 rounded-md border border-amber-100 shrink-0">
                              ★ {item.product.reward_points * item.quantity} Pts
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="border-t border-slate-100 pt-6 space-y-4 bg-white">
                  <div className="flex justify-between items-center text-slate-900">
                    <span className="text-xs font-extrabold">SUBTOTAL</span>
                    <span className="text-sm font-black font-mono">
                      Rp{" "}
                      {cart
                        .reduce((sum, item) => sum + item.product.price * item.quantity, 0)
                        .toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-slate-450 border-b pb-4">
                    <span className="text-[10px] font-bold">TOTAL REWARD POINTS</span>
                    <span className="text-xs font-bold text-amber-500">
                      {cart.reduce((sum, item) => sum + item.product.reward_points * item.quantity, 0)} Pts
                    </span>
                  </div>

                  <button
                    onClick={handleCartCheckout}
                    disabled={submittingCheckout}
                    className="w-full bg-primary hover:bg-primary-hover text-white text-xs font-bold py-3.5 rounded-xl uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                  >
                    {submittingCheckout ? "Processing..." : "Checkout All Items"}
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── CHECKOUT CONFIRMATION MODAL ── */}
      <AnimatePresence>
        {checkoutProduct && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setCheckoutProduct(null)}
              className="fixed inset-0 z-50 bg-black"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-6 bottom-6 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-50 md:w-[480px] bg-white rounded-3xl p-6 shadow-2xl border border-slate-200/80"
            >
              <div className="flex items-center justify-between pb-3 border-b mb-4">
                <h3 className="font-extrabold text-sm text-slate-900">Konfirmasi Pembelian</h3>
                <button onClick={() => setCheckoutProduct(null)}>
                  <MdClose className="text-lg text-slate-400 hover:text-slate-700" />
                </button>
              </div>

              <div className="flex gap-4 p-3 bg-slate-50 border rounded-2xl mb-4">
                <img
                  src={checkoutProduct.image_url || fallbackImg}
                  alt=""
                  className="w-16 h-20 object-cover rounded-xl border bg-white shrink-0"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 line-clamp-1">
                      {checkoutProduct.product_name}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-1">Code: {checkoutProduct.product_code}</p>
                  </div>
                  <p className="text-xs font-black text-slate-900">
                    Rp {parseFloat(checkoutProduct.price).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-500">Jumlah Pesanan</span>
                  <div className="flex items-center border rounded-lg bg-white">
                    <button
                      onClick={() => setCheckoutQty((q) => Math.max(1, q - 1))}
                      className="px-2.5 py-1 text-xs font-bold"
                    >
                      -
                    </button>
                    <span className="px-3 text-xs font-mono font-bold text-slate-800">{checkoutQty}</span>
                    <button
                      onClick={() => setCheckoutQty((q) => Math.min(checkoutProduct.stock, q + 1))}
                      className="px-2.5 py-1 text-xs font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="space-y-2 border-t pt-4">
                  <div className="flex justify-between text-xs font-semibold text-slate-600">
                    <span>Total Pembayaran</span>
                    <span className="font-mono text-slate-900 font-bold">
                      Rp {(checkoutProduct.price * checkoutQty).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold text-slate-650">
                    <span>Loyalty Point yang Diperoleh</span>
                    <span className="text-amber-500 font-bold">
                      +{checkoutProduct.reward_points * checkoutQty} Pts
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setCheckoutProduct(null)}
                    className="flex-1 border text-slate-500 hover:bg-slate-50 text-xs font-bold py-3 rounded-xl transition-all"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleConfirmCheckout}
                    disabled={submittingCheckout}
                    className="flex-1 bg-primary hover:bg-primary-hover text-white text-xs font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-primary/20"
                  >
                    {submittingCheckout ? "Memproses..." : "Konfirmasi & Beli"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── PRODUCT DETAIL MODAL ── */}
      <AnimatePresence>
        {detailProduct && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setDetailProduct(null)}
              className="fixed inset-0 z-50 bg-black"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-6 bottom-6 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-50 md:w-[600px] bg-white rounded-3xl p-6 shadow-2xl border border-slate-200/80 grid grid-cols-1 md:grid-cols-12 gap-6"
            >
              <button
                onClick={() => setDetailProduct(null)}
                className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-white/80 backdrop-blur-md shadow-md border"
              >
                <MdClose className="text-lg text-slate-655" />
              </button>

              <div className="md:col-span-6 relative aspect-[3/4] bg-slate-100 rounded-2xl overflow-hidden border">
                <img
                  src={detailProduct.image_url || fallbackImg}
                  alt={detailProduct.product_name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="md:col-span-6 flex flex-col justify-between text-left space-y-4">
                <div>
                  <span className="bg-slate-900 text-white text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md">
                    {detailProduct.category}
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 mt-2">
                    {detailProduct.product_name}
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Code: {detailProduct.product_code}</p>
                </div>

                <div className="space-y-3.5">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-black text-slate-900">
                      Rp {parseFloat(detailProduct.price).toLocaleString()}
                    </span>
                    <span className="bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded-lg border border-amber-100 text-[10px]">
                      ★ {detailProduct.reward_points} Pts
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-relaxed font-light">
                    Koleksi premium butik BUIQ terbuat dari katun tenun terpilih untuk kenyamanan dan keawetan bentuk siluet yang sempurna.
                  </p>

                  <div className="flex justify-between text-xs font-semibold text-slate-500">
                    <span>Ketersediaan Stok</span>
                    <span className="font-mono text-slate-900 font-bold">
                      {detailProduct.stock} unit tersedia
                    </span>
                  </div>
                </div>

                <div className="flex gap-3.5 border-t pt-4">
                  <button
                    onClick={() => {
                      handleAddToCart(detailProduct);
                      setDetailProduct(null);
                    }}
                    className="flex-1 border hover:bg-slate-50 text-slate-700 text-xs font-bold py-3.5 rounded-xl transition-all cursor-pointer text-center"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => {
                      const p = detailProduct;
                      setDetailProduct(null);
                      handleAddToCart(p);
                      handleOpenCheckout(p, 1);
                    }}
                    className="flex-1 bg-primary hover:bg-primary-hover text-white text-xs font-bold py-3.5 rounded-xl transition-all cursor-pointer text-center shadow-md shadow-primary/10"
                  >
                    Beli Sekarang
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}