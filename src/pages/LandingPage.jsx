import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdShoppingBag,
  MdStar,
  MdCheckCircle,
  MdArrowBackIos,
  MdArrowForwardIos,
  MdMenu,
  MdClose,
  MdKeyboardArrowUp,
  MdChat,
  MdSend,
  MdLayers,
  MdLocalOffer,
  MdHeadsetMic,
  MdLocalShipping,
  MdStyle,
} from "react-icons/md";
import { FaInstagram, FaTiktok, FaFacebook } from "react-icons/fa";

// ─── DATA ────────────────────────────────────────────────────────────────────

const categories = [
  { id: "mens",       name: "Men's Fashion",        desc: "Refined apparel for the modern man",            img: "/img/mens_fashion.png",        position: "object-[50%_20%]" },
  { id: "womens",     name: "Women's Fashion",       desc: "Chic designs for everyday confidence",          img: "/img/womens_fashion.png",      position: "object-[50%_25%]" },
  { id: "accessories",name: "Bags & Accessories",    desc: "Elevate your look with premium details",        img: "/img/bags_accessories.png",    position: "object-[50%_40%]" },
  { id: "shoes",      name: "Shoes Collection",      desc: "Step out in comfort and modern style",          img: "/img/shoes_collection.png",    position: "object-[50%_50%]" },
  { id: "lifestyle",  name: "Lifestyle Essentials",  desc: "Designed for your daily routine",               img: "/img/lifestyle_essentials.png",position: "object-[50%_35%]" },
];

const products = [
  { id: 1, name: "Premium Cotton Heavyweight Tee",     category: "mens",        price: 189000, rating: 5, stock: "Available", img: "/img/mens_fashion.png",         position: "object-[50%_20%]" },
  { id: 2, name: "Classic Fit Oxford Shirt",           category: "mens",        price: 349000, rating: 5, stock: "Available", img: "/img/mens_fashion.png",         position: "object-[50%_25%]" },
  { id: 3, name: "Minimalist Oversized Hoodie",        category: "womens",      price: 429000, rating: 5, stock: "Available", img: "/img/womens_fashion.png",       position: "object-[50%_22%]" },
  { id: 4, name: "Structured Utility Jacket",          category: "womens",      price: 549000, rating: 4, stock: "Low Stock", img: "/img/womens_fashion.png",       position: "object-[50%_28%]" },
  { id: 5, name: "Water-Resistant Commuter Backpack",  category: "accessories", price: 599000, rating: 5, stock: "Available", img: "/img/bags_accessories.png",     position: "object-[50%_40%]" },
  { id: 6, name: "Retro Canvas Streetwear Sneakers",   category: "shoes",       price: 499000, rating: 5, stock: "Available", img: "/img/shoes_collection.png",     position: "object-[50%_50%]" },
  { id: 7, name: "Signature Leather Wallet",           category: "accessories", price: 299000, rating: 4, stock: "Available", img: "/img/bags_accessories.png",     position: "object-[50%_45%]" },
  { id: 8, name: "Minimalist Matte Water Bottle",      category: "lifestyle",   price: 249000, rating: 4, stock: "Low Stock", img: "/img/lifestyle_essentials.png", position: "object-[50%_35%]" },
];

const testimonials = [
  {
    quote: "BUIQ's CRM transformed our store operations. We synced our offline loyalty program with our online boutique store, resulting in a 40% increase in repeat customer purchases within the first quarter.",
    author: "Rian Pramana",
    role: "Retail Operations Director",
    company: "ZARA Indonesia",
    avatar: "/img/mens_fashion.png",
    rating: 5
  },
  {
    quote: "The inventory analytics and automated low-stock warnings are exceptionally precise. We reduced overstocking costs by 25% while maintaining a 99% availability rate for our seasonal highlights.",
    author: "Amanda Safitri",
    role: "Chief Merchant & Designer",
    company: "COS Store Jakarta",
    avatar: "/img/womens_fashion.png",
    rating: 5
  },
  {
    quote: "Our floor staff love the clienteling interface. They can look up buyer profiles, past sizes, and VIP loyalty status in under 10 seconds. It makes customer service feel incredibly personalized.",
    author: "Daniel Wijaya",
    role: "Founder & Creative Director",
    company: "W/D Studio Jakarta",
    avatar: "/img/mens_fashion.png",
    rating: 5
  },
];

const navItems = [
  { label: "Home", id: "hero" },
  { label: "Features", id: "why-us" },
  { label: "About", id: "about" },
  { label: "Contact", id: "contact" }
];

const heroVideoUrl = "https://www.shutterstock.com/shutterstock/videos/4034527353/preview/stock-footage-tromso-norway-people-at-storgata-main-pedestrian-shopping-street-in-the-city-center.mp4";

const heroSlides = [
  { id: 0, tag: "BUIQ CRM Platform", headline: "Manage your fashion", italic: "business with confidence", desc: "The unified CRM and store operations platform built specifically for modern fashion and lifestyle brands. Connect customer relationships, inventory analytics, and orders in one single experience." },
  { id: 1, tag: "Data-Driven Insights", headline: "Real-time retail", italic: "and product analytics", desc: "Track sales performance, optimize your stock levels, and deliver personalized customer journeys. Make informed business decisions with quiet, precise, and powerful CRM features." },
  { id: 2, tag: "Direct-to-Customer", headline: "Build deeper client", italic: "relationships easily", desc: "Understand buyer preferences, segment your audience, and coordinate orders seamlessly. Elevate your brand operations to match the premium quality of your collections." }
];

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [activeTab,          setActiveTab         ] = useState("all");
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentSlide,       setCurrentSlide      ] = useState(0);
  const [scrolled,           setScrolled          ] = useState(false);
  const [mobileMenuOpen,     setMobileMenuOpen    ] = useState(false);
  const [cartCount,          setCartCount         ] = useState(0);
  const [showNotification,   setShowNotification  ] = useState(false);
  const [notificationMsg,    setNotificationMsg   ] = useState("");
  const [contactForm,        setContactForm       ] = useState({ name: "", email: "", message: "" });
  const [formSubmitted,      setFormSubmitted      ] = useState(false);
  const [showScrollTop,      setShowScrollTop     ] = useState(false);
  const [activeHotspot,      setActiveHotspot     ] = useState(0);
  const [activeNavId,        setActiveNavId       ] = useState("");
  const [chatOpen,           setChatOpen          ] = useState(false);
  const [chatInput,          setChatInput         ] = useState("");
  const [chatMessages,       setChatMessages      ] = useState([{ sender: "bot", text: "Welcome to BUIQ CRM Support. How can I assist you with your brand operations today?" }]);
  const [isTyping,           setIsTyping          ] = useState(false);
  const [videoError,         setVideoError        ] = useState(false);

  const { user, logout } = useAuth();
  const isLoggedIn = !!user;

  const handleLogout = async () => {
    try {
      await logout();
      setMobileMenuOpen(false);
    } catch (err) {
      console.error("LandingPage logout error:", err);
    }
  };

  const chatEndRef = useRef(null);
  const videoRef   = useRef(null);

  // Scroll handling
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      setShowScrollTop(window.scrollY > 500);
      const pos = window.scrollY + 160;
      for (const item of navItems) {
        const el = document.getElementById(item.id);
        if (el && pos >= el.offsetTop && pos < el.offsetTop + el.offsetHeight) {
          setActiveNavId(item.id);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Hero slide autoplay
  useEffect(() => {
    const t = setInterval(() => setCurrentSlide(p => (p + 1) % heroSlides.length), 8000);
    return () => clearInterval(t);
  }, []);

  // Testimonial autoplay
  useEffect(() => {
    const t = setInterval(() => setCurrentTestimonial(p => (p + 1) % testimonials.length), 9000);
    return () => clearInterval(t);
  }, []);

  // Chat scroll
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatMessages, isTyping]);

  // Swap video src on slide change

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    setActiveNavId(id);
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 96, behavior: "smooth" });
  };

  const handleAddToBag = (name) => {
    setCartCount(p => p + 1);
    setNotificationMsg(`CRM Event: ${name} added to cart (Simulated Checkout Logged).`);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3200);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setContactForm({ name: "", email: "", message: "" });
    setTimeout(() => setFormSubmitted(false), 4000);
  };

  const formatIDR = (n) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

  const filteredProducts = activeTab === "all" ? products : products.filter(p => p.category === activeTab);

  const triggerBotResponse = (text) => {
    setIsTyping(true);
    const t = text.toLowerCase();
    let reply = "I'm here to help you explore BUIQ CRM. Ask me about features, integrations, pricing, or the live store demo.";
    if (t.includes("feature") || t.includes("show") || t.includes("crm")) {
      reply = "BUIQ CRM Core Features:\n• VIP Loyalty & Member Tiering\n• Real-Time Inventory Turn Tracking\n• Omnichannel Sales Operations\n• Actionable Customer Insights\n\nScroll to the 'Why Choose BUIQ' section to learn more.";
    } else if (t.includes("demo") || t.includes("shop") || t.includes("cat")) {
      reply = "The catalog below is a live demo of a retail shop powered by BUIQ CRM. Try adding items to the bag to see how BUIQ registers real-time orders!";
    } else if (t.includes("integrat") || t.includes("shopify")) {
      reply = "BUIQ integrates seamlessly with Shopify, WooCommerce, and offline POS systems to sync all your customer profiles and sales streams.";
    } else if (t.includes("pricing") || t.includes("cost")) {
      reply = "We offer flexible pricing tiers for growing boutiques and enterprise brands. Contact our sales team using the contact form below for a custom quote.";
    } else if (t.includes("hi") || t.includes("hello")) {
      reply = "Hello! Welcome to BUIQ CRM. How can I help you optimize your retail brand operations today?";
    }
    setTimeout(() => { setIsTyping(false); setChatMessages(p => [...p, { sender: "bot", text: reply }]); }, 750);
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const msg = chatInput;
    setChatMessages(p => [...p, { sender: "user", text: msg }]);
    setChatInput("");
    triggerBotResponse(msg);
  };

  const handleQuickAction = (label, query) => {
    setChatMessages(p => [...p, { sender: "user", text: label }]);
    triggerBotResponse(query);
  };

  // ── RENDER ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-white text-[#0F172A] antialiased selection:bg-[#2B7FFF] selection:text-white">

      {/* Toast */}
      <AnimatePresence>
        {showNotification && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[60] bg-[#0F172A] text-white text-[10px] font-semibold tracking-widest uppercase px-6 py-3.5 rounded-full shadow-xl flex items-center gap-2.5 border border-white/5">
            <MdCheckCircle className="text-[#2B7FFF]" size={14} />
            {notificationMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-28 right-8 z-40 w-11 h-11 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-md hover:border-[#2B7FFF] hover:text-[#2B7FFF] transition-all">
            <MdKeyboardArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Chat widget ─────────────────────────────────────────────────────── */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
        <AnimatePresence>
          {chatOpen && (
            <motion.div initial={{ opacity: 0, y: 12, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white border border-slate-200 shadow-2xl rounded-2xl w-[340px] sm:w-[360px] h-[480px] flex flex-col mb-4 overflow-hidden">
              {/* Header */}
              <div className="bg-[#0F172A] px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#2B7FFF] flex items-center justify-center text-white text-[10px] font-bold">AI</div>
                  <div>
                    <p className="text-[11px] font-bold tracking-wider text-white uppercase">BUIQ Assistant</p>
                    <p className="text-[9px] text-[#2B7FFF] font-medium tracking-wide mt-0.5">Online now</p>
                  </div>
                </div>
                <button onClick={() => setChatOpen(false)} className="text-slate-400 hover:text-white transition-colors"><MdClose size={18} /></button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F8FAFC]">
                {chatMessages.map((m, i) => (
                  <div key={i} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed whitespace-pre-line ${m.sender === "user" ? "bg-[#2B7FFF] text-white" : "bg-white text-[#0F172A] border border-slate-100 shadow-sm"}`}>
                      {m.text}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-slate-100 rounded-2xl px-4 py-3 flex items-center gap-1 shadow-sm">
                      {[0,200,400].map(d => <span key={d} style={{ animationDelay: `${d}ms` }} className="w-1.5 h-1.5 bg-[#2B7FFF] rounded-full animate-bounce" />)}
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Quick actions */}
              <div className="px-4 py-2.5 bg-white border-t border-slate-100 flex flex-wrap gap-1.5">
                {["CRM Features", "Live Demo", "Integrations", "Pricing", "Contact Sales"].map(a => (
                  <button key={a} onClick={() => handleQuickAction(a, a.toLowerCase())}
                    className="bg-[#F8FAFC] hover:bg-[#EAF3FF] hover:text-[#2B7FFF] text-[#0F172A] border border-slate-200 px-2.5 py-1 rounded-full text-[9px] font-semibold uppercase tracking-wider transition-colors">
                    {a}
                  </button>
                ))}
              </div>

              {/* Input */}
              <form onSubmit={handleSendChat} className="px-3 py-3 border-t border-slate-100 flex gap-2 bg-white">
                <input type="text" placeholder="Ask anything…" value={chatInput} onChange={e => setChatInput(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-[#2B7FFF] placeholder:text-slate-300" />
                <button type="submit" className="w-8 h-8 rounded-xl bg-[#2B7FFF] hover:bg-[#1a6ee8] text-white flex items-center justify-center transition-colors">
                  <MdSend size={13} />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
        <button onClick={() => setChatOpen(!chatOpen)}
          className="w-13 h-13 w-[52px] h-[52px] bg-[#2B7FFF] hover:bg-[#1a6ee8] text-white rounded-full flex items-center justify-center shadow-xl shadow-[#2B7FFF]/30 transition-all">
          {chatOpen ? <MdClose size={20} /> : <MdChat size={20} />}
        </button>
      </div>

      {/* ── Navigation ──────────────────────────────────────────────────────── */}
      <header className="fixed top-4 inset-x-0 z-40 px-4 sm:px-8">
        <div className={`max-w-7xl mx-auto px-6 py-4 flex items-center justify-between rounded-full border transition-all duration-300 ${
          scrolled ? "bg-white/85 border-slate-300/80 shadow-[0_8px_30px_rgb(0,0,0,0.06)]" : "bg-white/75 border-slate-200/60 shadow-[0_4px_20px_rgb(0,0,0,0.02)]"
        } backdrop-blur-md`}>

          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="font-['Playfair_Display',serif] text-xl font-bold tracking-[0.18em] text-[#0F172A] hover:text-[#2B7FFF] transition-colors">
            BUIQ
          </button>

          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map(item => (
              <button key={item.id} onClick={() => scrollToSection(item.id)}
                className={`text-[16px] font-semibold tracking-[-0.01em] py-1.5 relative transition-colors hover:text-[#2B7FFF] ${activeNavId === item.id ? "text-[#2B7FFF]" : "text-slate-600"}`}>
                {item.label}
                {activeNavId === item.id && (
                  <motion.span layoutId="navUnderline" className="absolute -bottom-1 inset-x-0 h-[2px] bg-[#2B7FFF] rounded-full" transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} />
                )}
              </button>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-6">
            <button onClick={() => scrollToSection("catalog")} className="relative text-[#0F172A] hover:text-[#2B7FFF] transition-colors p-1">
              <MdShoppingBag size={21} />
              {cartCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#2B7FFF] text-white text-[8px] font-bold rounded-full flex items-center justify-center">{cartCount}</span>}
            </button>
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <button onClick={handleLogout} className="text-xs font-semibold text-slate-500 hover:text-[#2B7FFF] transition-colors cursor-pointer">
                  Logout
                </button>
                <Link to="/dashboard" className="bg-[#2B7FFF] hover:bg-[#2B7FFF]/80 text-white text-xs font-semibold tracking-wide px-6 py-3 rounded-full transition-all duration-300 shadow-md shadow-[#2B7FFF]/10">
                  Dashboard
                </Link>
              </div>
            ) : (
              <Link to="/login" className="bg-[#0F172A] hover:bg-[#2B7FFF] text-white text-xs font-semibold tracking-wide px-6 py-3 rounded-full transition-all duration-300 shadow-md shadow-[#0F172A]/10 hover:shadow-[#2B7FFF]/20">
                Login
              </Link>
            )}
          </div>

          {/* Mobile */}
          <div className="flex items-center gap-4 lg:hidden">
            <button onClick={() => scrollToSection("catalog")} className="relative text-[#0F172A] p-1">
              <MdShoppingBag size={22} />
              {cartCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#2B7FFF] text-white text-[8px] font-bold rounded-full flex items-center justify-center">{cartCount}</span>}
            </button>
            <button onClick={() => setMobileMenuOpen(true)} className="p-1"><MdMenu size={24} className="text-[#0F172A]" /></button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.35 }} exit={{ opacity: 0 }} onClick={() => setMobileMenuOpen(false)} className="fixed inset-0 z-50 bg-black" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "tween", duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-y-0 right-0 z-50 w-72 bg-white p-8 shadow-2xl flex flex-col">
              <div className="flex items-center justify-between mb-12">
                <span className="font-['Playfair_Display',serif] text-lg font-bold tracking-[0.22em]">BUIQ</span>
                <button onClick={() => setMobileMenuOpen(false)}><MdClose size={22} className="text-slate-400" /></button>
              </div>
              <div className="flex flex-col gap-1 mb-auto">
                {navItems.map(item => (
                  <button key={item.id} onClick={() => scrollToSection(item.id)}
                    className="text-left text-[13px] font-medium text-slate-650 hover:text-[#2B7FFF] py-3 border-b border-slate-50 transition-colors">
                    {item.label}
                  </button>
                ))}
              </div>
              {isLoggedIn ? (
                <div className="space-y-3 mt-8">
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}
                    className="w-full bg-[#2B7FFF] hover:bg-[#2B7FFF]/80 text-white text-[10px] font-semibold tracking-[0.12em] py-3.5 rounded-full text-center transition-colors block">
                    Dashboard
                  </Link>
                  <button onClick={handleLogout}
                    className="w-full border border-slate-200 text-slate-500 hover:text-[#2B7FFF] text-[10px] font-semibold tracking-[0.12em] py-3.5 rounded-full text-center transition-colors block">
                    Logout
                  </button>
                </div>
              ) : (
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}
                  className="mt-8 w-full bg-[#0F172A] hover:bg-[#2B7FFF] text-white text-[10px] font-semibold tracking-[0.12em] py-3.5 rounded-full text-center transition-colors block">
                  Login
                </Link>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section id="hero" className="relative h-screen min-h-[680px] flex items-center overflow-hidden bg-[#0D0D0D]">

        {/* Video background */}
        {!videoError ? (
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover opacity-50"
            src={heroVideoUrl}
            autoPlay muted loop playsInline
            onError={() => setVideoError(true)}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#1a2744] to-[#0F172A]" />
        )}

        {/* Layered overlay: bottom-weighted for text legibility */}
        <div className="absolute inset-0 z-0" style={{ background: "linear-gradient(180deg, rgba(15,23,42,0.65), rgba(15,23,42,0.45))" }} />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full pt-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center w-full">

            {/* Left side info */}
            <div className="lg:col-span-7 text-left space-y-6">
              <AnimatePresence mode="wait">
                <motion.div key={currentSlide} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="space-y-6">

                  {/* Eyebrow */}
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-px bg-[#2B7FFF]" />
                    <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-[#2B7FFF]">
                      {heroSlides[currentSlide].tag}
                    </span>
                  </div>

                  {/* Headline */}
                  <h1 className="font-['Playfair_Display',serif] text-5xl sm:text-6xl lg:text-7xl font-normal text-white leading-[1.06] tracking-tight">
                    {heroSlides[currentSlide].headline}<br />
                    <span className="italic text-white/80">{heroSlides[currentSlide].italic}</span>
                  </h1>

                  {/* Body */}
                  <p className="text-sm sm:text-base text-white/75 leading-relaxed max-w-xl font-light tracking-wide">
                    {heroSlides[currentSlide].desc}
                  </p>

                  {/* CTAs */}
                  <div className="flex flex-wrap gap-4 pt-2">
                    <button onClick={() => scrollToSection("catalog")}
                      className="bg-white hover:bg-[#2B7FFF] text-[#0F172A] hover:text-white text-[11px] font-semibold tracking-[0.12em] uppercase px-8 py-4 rounded-full transition-all duration-300 shadow-lg">
                      Shop Collection
                    </button>
                    <Link to={isLoggedIn ? "/dashboard" : "/login"}
                      className="border border-white/30 hover:border-white/70 text-white text-[11px] font-semibold tracking-[0.12em] uppercase px-8 py-4 rounded-full transition-all duration-300 backdrop-blur-sm">
                      {isLoggedIn ? "Dashboard" : "Login"}
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Slide dots */}
              <div className="flex gap-2.5 pt-4">
                {heroSlides.map((_, i) => (
                  <button key={i} onClick={() => setCurrentSlide(i)}
                    className={`h-0.5 rounded-full transition-all duration-500 ${currentSlide === i ? "bg-white w-8" : "bg-white/30 w-3"}`} />
                ))}
              </div>
            </div>

            {/* Right side Dashboard Mockup */}
            <div className="lg:col-span-5 hidden lg:block">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                className="relative"
              >
                {/* Floating active users bubble */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="absolute -top-6 -left-6 z-20 bg-[#2B7FFF] text-white text-[10px] font-mono font-bold tracking-wider px-3.5 py-2 rounded-xl shadow-lg shadow-[#2B7FFF]/25 flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                  Live Members: 1,842
                </motion.div>

                {/* Floating sale alert bubble */}
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
                  className="absolute -bottom-6 -right-4 z-20 bg-emerald-500 text-white text-[10px] font-mono font-bold tracking-wider px-3.5 py-2 rounded-xl shadow-lg shadow-emerald-500/25 flex items-center gap-2"
                >
                  New Order +Rp 349,000
                </motion.div>

                {/* Main Dashboard Card */}
                <div className="bg-slate-950/75 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden">

                  {/* Glowing background hint */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#2B7FFF]/10 rounded-full blur-2xl pointer-events-none" />

                  {/* Top Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-6">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                    </div>
                    <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">BUIQ CRM v1.4</span>
                  </div>

                  {/* Content Grid */}
                  <div className="space-y-6">

                    {/* Revenue stat block */}
                    <div className="text-left space-y-1.5">
                      <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">MONTHLY PLATFORM REVENUE</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold font-mono text-white">Rp 142.85M</span>
                        <span className="text-[10px] text-emerald-400 font-bold font-mono bg-emerald-500/10 px-2 py-0.5 rounded-md">+14.2%</span>
                      </div>
                    </div>


                    {/* Recent internal activities */}
                    <div className="space-y-3 pt-2">
                      <p className="text-[9px] text-slate-400 font-mono uppercase tracking-widest text-left">RECENT CRM EVENTS</p>
                      <div className="space-y-2.5">
                        {[
                          { name: "Daniel Wijaya (Kebayoran)", type: "Purchased Oxford Shirt", time: "2m ago" },
                          { name: "Amanda Safitri (Bandung)", type: "Upgraded to VIP Tier", time: "12m ago" }
                        ].map((evt, idx) => (
                          <div key={idx} className="flex items-center justify-between text-[11px] p-2.5 rounded-xl bg-white/5 border border-white/5">
                            <div className="flex items-center gap-2.5 text-left">
                              <div className={`w-2 h-2 rounded-full ${idx === 0 ? "bg-[#2B7FFF]" : "bg-emerald-400"}`} />
                              <div>
                                <p className="font-semibold text-white">{evt.name}</p>
                                <p className="text-[10px] text-slate-400 mt-0.5">{evt.type}</p>
                              </div>
                            </div>
                            <span className="text-[9px] font-mono text-slate-500">{evt.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              </motion.div>
            </div>

          </div>
        </div>

        {/* Slide controls */}
        <div className="absolute right-8 bottom-8 z-10 flex items-center gap-2">
          <button onClick={() => setCurrentSlide(p => (p - 1 + heroSlides.length) % heroSlides.length)}
            className="w-9 h-9 rounded-full border border-white/20 text-white flex items-center justify-center hover:bg-white/10 transition-all backdrop-blur-sm">
            <MdArrowBackIos size={10} className="translate-x-[2px]" />
          </button>
          <button onClick={() => setCurrentSlide(p => (p + 1) % heroSlides.length)}
            className="w-9 h-9 rounded-full border border-white/20 text-white flex items-center justify-center hover:bg-white/10 transition-all backdrop-blur-sm">
            <MdArrowForwardIos size={10} />
          </button>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 z-10">
          <span className="text-[8px] tracking-[0.3em] uppercase font-medium">Scroll</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent" />
        </div>
      </section>

      {/* ── Marquee strip ───────────────────────────────────────────────────── */}
      <div className="bg-[#0F172A] py-4 overflow-hidden border-y border-slate-800">
        <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="flex gap-12 whitespace-nowrap">
          {[...Array(4)].map((_, i) =>
            ["BUIQ CRM Platform", "Omnichannel Retail Operations", "VIP Customer Profiling", "Real-Time Inventory Turn Tracking", "Expedited Order Management", "Direct Clienteling System"].map(t => (
              <span key={`${i}-${t}`} className="text-[9px] font-semibold tracking-[0.28em] uppercase text-slate-500">
                {t} <span className="text-[#2B7FFF] mx-4">·</span>
              </span>
            ))
          )}
        </motion.div>
      </div>

      {/* ── Trust Statistics Section ────────────────────────────────────────── */}
      <section className="bg-[#0b0f19] py-10 border-b border-slate-800/40">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-800/60">
            {[
              { val: "1,200+", lbl: "Active Boutiques" },
              { val: "150,000+", lbl: "VIP Customers" },
              { val: "99.99%", lbl: "Platform Uptime" },
              { val: "24/7", lbl: "Support Availability" }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: idx * 0.1 }}
                className="flex flex-col items-center justify-center text-center px-4 pt-6 md:pt-0"
              >
                <span className="text-3xl md:text-4xl font-extrabold font-mono text-white tracking-tight">{stat.val}</span>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mt-1">{stat.lbl}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trusted By Section ──────────────────────────────────────────────── */}
      <section className="bg-[#0b0f19] py-8 border-b border-slate-800/40 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col sm:flex-row items-center gap-6 sm:gap-12 justify-between">
          <span className="text-[8px] font-bold tracking-[0.25em] uppercase text-slate-600 shrink-0">TRUSTED BY LEADING BRANDS</span>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-45 grayscale contrast-200">
            {["ZARA", "COS", "ZALORA", "MANGO", "UNIQLO"].map((logo) => (
              <span key={logo} className="font-['Playfair_Display',serif] text-base md:text-lg font-bold tracking-[0.25em] text-white">
                {logo}
              </span>
            ))}
          </div>
        </div>
      </section>



      {/* ── How BUIQ Works Section ──────────────────────────────────────────── */}
      <section className="py-36 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          
          <div className="max-w-3xl mx-auto space-y-4 mb-24">
            <p className="text-[9px] font-semibold tracking-[0.3em] uppercase text-[#2B7FFF]">Workflow</p>
            <h2 className="font-['Playfair_Display',serif] text-4xl md:text-5xl font-semibold text-[#0F172A] tracking-tight leading-tight">
              Simple. Intelligent. Effective.
            </h2>
            <p className="text-sm text-slate-500 max-w-xl mx-auto leading-relaxed font-light">
              Four streamlined steps to scale your store operations from chaotic spreadsheets to structured growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative text-left">
            {/* Desktop timeline horizontal line */}
            <div className="absolute top-[28px] left-[12%] right-[12%] h-[1px] bg-slate-100 hidden md:block z-0" />

            {[
              { num: "01", step: "Import Customers", desc: "Bulk-upload offline customer spreadsheets or sync your existing Shopify clients in minutes." },
              { num: "02", step: "Manage Inventory", desc: "Set product styles, categories, sizing variants, pricing structures, and low-stock thresholds." },
              { num: "03", step: "Track Sales", desc: "Log walk-in cash, credit card, and digital checkout events directly into our high-speed logger." },
              { num: "04", step: "Grow Loyalty", desc: "Establish automated customer reward tiers and VIP membership status based on lifetime value (LTV)." }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: idx * 0.1 }}
                className="relative z-10 space-y-5 px-4 text-center md:text-left"
              >
                <div className="flex items-center justify-center md:justify-start">
                  <span className="w-14 h-14 rounded-2xl bg-[#F8FAFC] border border-slate-100 flex items-center justify-center text-[#2B7FFF] font-mono text-lg font-bold shadow-sm">
                    {item.num}
                  </span>
                </div>
                <div className="space-y-2">
                  <h4 className="text-base font-bold text-[#0F172A] tracking-tight">{item.step}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-light">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ── Why BUIQ Section (SaaS Value Proposition) ───────────────────────── */}
      <section className="py-36 bg-[#F8FAFC] border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="max-w-3xl space-y-4 mb-24 text-center md:text-left">
            <p className="text-[9px] font-semibold tracking-[0.3em] uppercase text-[#2B7FFF]">Why Choose BUIQ CRM</p>
            <h2 className="font-['Playfair_Display',serif] text-4xl md:text-5xl font-semibold text-[#0F172A] tracking-tight leading-tight">
              Designed for Modern Brand Commerce
            </h2>
            <p className="text-sm text-slate-500 max-w-xl leading-relaxed font-light">
              BUIQ helps premium brands bridge checkout events, inventory turns, and VIP relations to run stores with data-driven confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: MdStyle, title: "Omnichannel Orders", desc: "Unify transactions from your retail boutiques and web stores into one real-time checkout stream." },
              { icon: MdLayers, title: "Loyalty & Clienteling", desc: "Understand shopper preferences, sizes, and VIP status to customize service directly on the store floor." },
              { icon: MdLocalOffer, title: "Smart Stock Planning", desc: "Avoid stockouts and overstock. Get smart alerts based on real-time sell-through velocity." },
              { icon: MdHeadsetMic, title: "Actionable Insights", desc: "Gain visibility on top categories, customer average order values (AOV), and overall retail growth." }
            ].map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: idx * 0.08 }}
                className="bg-white border border-slate-100 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between"
              >
                <div className="w-12 h-12 rounded-xl bg-[#2B7FFF]/5 border border-[#2B7FFF]/10 flex items-center justify-center text-[#2B7FFF] mb-6">
                  <card.icon size={22} />
                </div>
                <div className="space-y-2 mt-auto">
                  <h4 className="text-base font-bold text-[#0F172A] tracking-tight">{card.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-light">{card.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ── Categories ──────────────────────────────────────────────────────── */}
      <section id="categories" className="py-36 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">

          <div className="mb-16 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="space-y-2">
              <p className="text-[9px] font-semibold tracking-[0.3em] uppercase text-[#2B7FFF]">Interactive Sandbox</p>
              <h2 className="font-['Playfair_Display',serif] text-3xl md:text-4xl font-semibold text-[#0F172A] tracking-tight">Live Storefront Demo</h2>
              <p className="text-xs text-slate-400 font-light mt-1 max-w-xl">
                See how a BUIQ-powered online store syncs product categories, inventory changes, and customer transactions directly with the CRM console.
              </p>
            </div>
            <button onClick={() => scrollToSection("catalog")} className="text-[10px] font-semibold tracking-widest uppercase text-slate-400 hover:text-[#2B7FFF] transition-colors flex items-center gap-2 group">
              View All <MdArrowForwardIos size={10} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat, i) => (
              <motion.div key={cat.id} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: i * 0.06 }}
                onClick={() => { setActiveTab(cat.id); scrollToSection("catalog"); }}
                className="group relative aspect-[3/4] overflow-hidden rounded-2xl cursor-pointer bg-slate-100">

                <img src={cat.img} alt={cat.name} className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${cat.position}`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent transition-opacity duration-300" />

                <div className="absolute inset-0 p-5 flex flex-col justify-end text-white">
                  <p className="text-[9px] font-mono tracking-widest text-white/50 mb-1.5">0{i + 1}</p>
                  <h3 className="text-xs font-semibold leading-tight">{cat.name}</h3>
                  <p className="text-[9px] text-white/60 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Catalog ─────────────────────────────────────────────────────────── */}
      <section id="catalog" className="py-36 bg-[#F8FAFC] border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12">

          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-14 gap-8">
            <div className="space-y-2">
              <p className="text-[9px] font-semibold tracking-[0.3em] uppercase text-[#2B7FFF]">BUIQ Engine Demo</p>
              <h2 className="font-['Playfair_Display',serif] text-3xl md:text-4xl font-semibold text-[#0F172A] tracking-tight">Live Product Sandbox</h2>
              <p className="text-xs text-slate-400 font-light mt-1 max-w-xl">
                Add mock collection items to the shopping bag below to simulate customer purchase actions and view real-time data sync alerts.
              </p>
            </div>

            {/* Filter tabs */}
            <div className="flex flex-wrap gap-0.5">
              {[{ id: "all", name: "All Items" }, ...categories].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-[10px] font-semibold tracking-wider uppercase rounded-full transition-all ${
                    activeTab === tab.id ? "bg-[#0F172A] text-white" : "text-slate-400 hover:text-[#0F172A]"
                  }`}>
                  {tab.name?.replace(" Collection", "").replace(" & Accessories", "").replace(" Essentials", "") ?? "All Items"}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map(p => (
                <motion.div key={p.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}
                  className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-slate-200 hover:shadow-xl hover:shadow-black/[0.06] transition-all duration-400">

                  <div className="relative aspect-[3/4] bg-slate-50 overflow-hidden">
                    <img src={p.img} alt={p.name} className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${p.position}`} />
                    {p.stock === "Low Stock" && (
                      <div className="absolute top-3 left-3">
                        <span className="text-[8px] font-bold uppercase tracking-wider px-2.5 py-1 bg-white text-rose-500 border border-rose-100 rounded-full">Low Stock</span>
                      </div>
                    )}
                    <div className="absolute bottom-3 inset-x-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                      <button onClick={() => handleAddToBag(p.name)}
                        className="w-full bg-[#0F172A] hover:bg-[#2B7FFF] text-white text-[9px] font-bold uppercase tracking-[0.15em] py-3 rounded-xl transition-colors">
                        Add to Bag
                      </button>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-xs font-semibold text-[#0F172A] leading-snug line-clamp-1 group-hover:text-[#2B7FFF] transition-colors">{p.name}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs font-bold text-[#0F172A]">{formatIDR(p.price)}</span>
                      <div className="flex items-center gap-0.5 text-[9px] text-slate-400">
                        <MdStar className="text-amber-400" size={11} />
                        <span className="font-mono font-semibold">{p.rating}.0</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ── Why BUIQ ────────────────────────────────────────────────────────── */}
      <section id="why-us" className="py-36 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">

          <div className="mb-16 max-w-xl">
            <p className="text-[9px] font-semibold tracking-[0.3em] uppercase text-[#2B7FFF] mb-3">Core Pillars</p>
            <h2 className="font-['Playfair_Display',serif] text-3xl md:text-4xl font-semibold text-[#0F172A] tracking-tight">Why Choose BUIQ</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {[
              { title: "Unified Platform",  desc: "Consolidate customer data, product catalogues, and checkout logs under one roof.", icon: <MdLayers size={18} />        },
              { title: "Flexible Tiers",    desc: "Transparent pricing models tailored for boutique growth and enterprise scale.",        icon: <MdLocalOffer size={18} />    },
              { title: "Dedicated Success", desc: "Direct channel support with CRM specialists to assist in system migration.",           icon: <MdHeadsetMic size={18} />    },
              { title: "Expedited Syncing", desc: "High-speed webhook triggers to dispatch transaction data instantly between systems.",  icon: <MdLocalShipping size={18} /> },
              { title: "Tailored UI",       desc: "Clean, minimal console design customized to fit boutique daily workflows.",           icon: <MdStyle size={18} />         },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: i * 0.07 }}
                className="group p-7 rounded-2xl border border-slate-100 bg-white hover:border-[#2B7FFF]/20 hover:shadow-lg hover:shadow-[#2B7FFF]/5 transition-all duration-300 relative overflow-hidden">

                <div className="absolute top-0 inset-x-0 h-0.5 bg-[#2B7FFF] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-400" />

                <div className="w-9 h-9 rounded-xl bg-[#EAF3FF] group-hover:bg-[#2B7FFF] flex items-center justify-center text-[#2B7FFF] group-hover:text-white transition-all duration-300 mb-6">
                  {item.icon}
                </div>
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#0F172A] mb-2">{item.title}</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">{item.desc}</p>
                <span className="absolute top-5 right-5 text-[9px] font-mono text-slate-200 group-hover:text-[#2B7FFF]/40 transition-colors">0{i + 1}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────────────────────────── */}
      <section id="testimonials" className="py-28 bg-[#0F172A] overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-[9px] font-semibold tracking-[0.3em] uppercase text-[#2B7FFF] mb-12">Customer Testimonials</p>

          <div className="min-h-[220px] flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div key={currentTestimonial} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }} className="space-y-6">

                {/* Star rating */}
                <div className="flex items-center justify-center gap-0.5 text-amber-400">
                  {[...Array(testimonials[currentTestimonial].rating || 5)].map((_, i) => (
                    <MdStar key={i} size={14} />
                  ))}
                </div>

                <blockquote className="font-['Playfair_Display',serif] text-xl md:text-2xl font-normal text-white/85 leading-relaxed italic max-w-2xl mx-auto">
                  "{testimonials[currentTestimonial].quote}"
                </blockquote>

                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10">
                    <img src={testimonials[currentTestimonial].avatar} alt="" className="w-full h-full object-cover object-[50%_22%]" />
                  </div>
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-white">{testimonials[currentTestimonial].author}</p>
                  <p className="text-[9px] font-medium tracking-[0.2em] uppercase text-slate-500">
                    {testimonials[currentTestimonial].role} · <span className="text-[#2B7FFF]">{testimonials[currentTestimonial].company}</span>
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-center gap-5 mt-12">
            <button onClick={() => setCurrentTestimonial(p => (p - 1 + testimonials.length) % testimonials.length)}
              className="w-9 h-9 rounded-full border border-white/15 text-white/50 hover:border-white/50 hover:text-white flex items-center justify-center transition-all cursor-pointer">
              <MdArrowBackIos size={10} className="translate-x-[2px]" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setCurrentTestimonial(i)}
                  className={`h-0.5 rounded-full transition-all duration-400 cursor-pointer ${currentTestimonial === i ? "bg-white w-6" : "bg-white/20 w-3"}`} />
              ))}
            </div>
            <button onClick={() => setCurrentTestimonial(p => (p + 1) % testimonials.length)}
              className="w-9 h-9 rounded-full border border-white/15 text-white/50 hover:border-white/50 hover:text-white flex items-center justify-center transition-all cursor-pointer">
              <MdArrowForwardIos size={10} />
            </button>
          </div>
        </div>
      </section>

      {/* ── About ───────────────────────────────────────────────────────────── */}
      <section id="about" className="py-36 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

            {/* Story */}
            <motion.div initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-4 space-y-7">
              <div>
                <p className="text-[9px] font-semibold tracking-[0.3em] uppercase text-[#2B7FFF] mb-3">The Origin</p>
                <h2 className="font-['Playfair_Display',serif] text-3xl md:text-4xl font-semibold text-[#0F172A] tracking-tight">About BUIQ</h2>
                <div className="w-8 h-px bg-[#2B7FFF] mt-5" />
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                BUIQ was established in Jakarta as a response to the demand for refined, high-quality fashion silhouettes that translate seamlessly throughout your day. We remove unnecessary details to focus on raw garment construction, fabric resilience, and structural balance.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                {[
                  { t: "Vision",  d: "To serve as the primary fashion destination cultivating quiet confidence for the modern generation." },
                  { t: "Mission", d: "To manufacture structured wardrobe items and accessories with strict quality and high utility design." },
                ].map(v => (
                  <div key={v.t}>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#0F172A] mb-2">{v.t}</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{v.d}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Image */}
            <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="lg:col-span-3 aspect-[3/4] rounded-2xl overflow-hidden border border-slate-100 shadow-lg bg-slate-50">
              <img src="/img/lifestyle_essentials.png" alt="BUIQ lifestyle" className="w-full h-full object-cover object-[50%_35%] hover:scale-105 transition-transform duration-[1.2s]" />
            </motion.div>

            {/* Values */}
            <motion.div initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
              className="lg:col-span-5 bg-[#0F172A] rounded-2xl p-10 md:p-12 text-white relative overflow-hidden">

              <div className="absolute top-0 right-0 w-48 h-48 bg-[#2B7FFF]/5 rounded-full blur-3xl pointer-events-none" />

              <p className="text-[8px] font-semibold tracking-[0.35em] uppercase text-slate-500 border-b border-slate-800 pb-3 mb-8 inline-block">Core Principles</p>
              <h3 className="font-['Playfair_Display',serif] text-xl font-semibold text-white/90 mb-8">Standard of Curation</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {[
                  { n: "01", t: "Quiet Aesthetics",  d: "No loud logos. Clean outlines, balanced proportions, and neutral hues." },
                  { n: "02", t: "Refined Weaves",     d: "Selected cotton composites that preserve structure and feel over time." },
                  { n: "03", t: "Everyday Utility",   d: "Clothing designed to shift from campus mornings to evening socials." },
                  { n: "04", t: "Direct Distribution",d: "Garments go straight from production to boutique, guaranteeing value." },
                ].map(v => (
                  <div key={v.n} className="space-y-1.5">
                    <p className="text-[9px] font-mono text-[#2B7FFF] font-semibold">{v.n} //</p>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-white/90">{v.t}</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{v.d}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Contact ─────────────────────────────────────────────────────────── */}
      <section id="contact" className="py-36 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-start">

            {/* Info */}
            <div className="lg:col-span-5 space-y-10">
              <div>
                <p className="text-[9px] font-semibold tracking-[0.3em] uppercase text-[#2B7FFF] mb-3">Direct Channels</p>
                <h2 className="font-['Playfair_Display',serif] text-3xl md:text-4xl font-semibold text-[#0F172A] tracking-tight">Get in touch</h2>
              </div>

              <div className="space-y-6 text-sm text-slate-500">
                {[
                  { title: "Jakarta Flagship", lines: ["BUIQ Flagship Building", "Jl. Fashion Avenue No. 42, Kebayoran Baru", "Jakarta Selatan 12160"] },
                  { title: "Direct Support",   lines: ["Phone: +62 21 555 1234", "WhatsApp: +62 812 3456 7890"] },
                  { title: "Digital",          lines: ["info@buiqstore.com", "orders@buiqstore.com"] },
                ].map(s => (
                  <div key={s.title}>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#0F172A] mb-2">{s.title}</h4>
                    {s.lines.map(l => <p key={l} className="text-xs leading-relaxed">{l}</p>)}
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                {[{ icon: <FaInstagram size={14} /> }, { icon: <FaTiktok size={13} /> }, { icon: <FaFacebook size={14} /> }].map((s, i) => (
                  <a key={i} href="#" className="w-9 h-9 rounded-full border border-slate-200 bg-white flex items-center justify-center text-[#0F172A] hover:bg-[#0F172A] hover:text-white hover:border-[#0F172A] transition-all shadow-xs">
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 shadow-xl shadow-black/[0.05] p-8 md:p-12">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#0F172A] mb-8 pb-4 border-b border-slate-50">Send a message</h3>

              {formSubmitted ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#EAF3FF] flex items-center justify-center mx-auto">
                    <MdCheckCircle className="text-[#2B7FFF]" size={22} />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#0F172A]">Message dispatched</p>
                  <p className="text-[10px] text-slate-400">We'll reply within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-5">
                  {[
                    { label: "Full Name",      key: "name",    type: "text",  placeholder: "Your name"  },
                    { label: "Email Address",  key: "email",   type: "email", placeholder: "Your email" },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="text-[8px] font-bold uppercase tracking-[0.25em] text-[#2B7FFF] block mb-2">{f.label}</label>
                      <input type={f.type} required placeholder={f.placeholder}
                        value={contactForm[f.key]} onChange={e => setContactForm({ ...contactForm, [f.key]: e.target.value })}
                        className="w-full px-4 py-3.5 text-xs border border-slate-150 rounded-xl bg-[#F8FAFC] focus:bg-white outline-none focus:border-[#2B7FFF] focus:ring-2 focus:ring-[#2B7FFF]/10 placeholder:text-slate-300 transition-all" />
                    </div>
                  ))}
                  <div>
                    <label className="text-[8px] font-bold uppercase tracking-[0.25em] text-[#2B7FFF] block mb-2">Message</label>
                    <textarea required rows={4} placeholder="Type your message…"
                      value={contactForm.message} onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                      className="w-full px-4 py-3.5 text-xs border border-slate-150 rounded-xl bg-[#F8FAFC] focus:bg-white outline-none focus:border-[#2B7FFF] focus:ring-2 focus:ring-[#2B7FFF]/10 placeholder:text-slate-300 transition-all resize-none" />
                  </div>
                  <button type="submit"
                    className="w-full bg-[#0F172A] hover:bg-[#2B7FFF] text-white text-[10px] font-semibold uppercase tracking-[0.18em] py-4 rounded-full transition-all duration-300 shadow-lg shadow-black/10 mt-2">
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
      {/* ── Secondary CTA Section ────────────────────────────────────────────── */}
      <section className="py-24 bg-[#0B0F19] text-center relative overflow-hidden border-t border-slate-800">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 space-y-8">
          <h2 className="font-['Playfair_Display',serif] text-4xl md:text-5xl font-normal text-white leading-tight tracking-tight">
            Ready to Grow Your Fashion Business?
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto leading-relaxed font-light font-sans">
            Join leading fashion brands managing customer connections, inventory turns, and online/offline checkout transactions with BUIQ CRM.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link to={isLoggedIn ? "/dashboard" : "/login"}
              className="bg-[#2B7FFF] hover:bg-[#2B7FFF]/90 text-white text-[11px] font-semibold tracking-[0.12em] uppercase px-8 py-4 rounded-full transition-all duration-300 shadow-lg shadow-[#2B7FFF]/20">
              {isLoggedIn ? "Access Dashboard" : "Launch CRM Portal"}
            </Link>
            <button onClick={() => scrollToSection("contact")}
              className="border border-white/20 hover:border-white/50 text-white text-[11px] font-semibold tracking-[0.12em] uppercase px-8 py-4 rounded-full transition-all duration-300 backdrop-blur-sm cursor-pointer">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="bg-[#0b0f19] text-slate-400 pt-24 pb-12 border-t border-slate-800/40">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-16 border-b border-slate-800/60">
            
            {/* Brand Col */}
            <div className="space-y-6">
              <span className="font-['Playfair_Display',serif] text-xl font-bold tracking-[0.2em] text-white">BUIQ</span>
              <p className="text-[11.5px] leading-relaxed text-slate-500 font-light font-sans">
                Sleek CRM and clienteling operations for modern fashion and lifestyle brands. Empowers boutiques to run efficiently.
              </p>
              <div className="flex gap-3 pt-2">
                {[
                  { icon: <FaInstagram size={14} />, url: "#" },
                  { icon: <FaTiktok size={13} />, url: "#" },
                  { icon: <FaFacebook size={14} />, url: "#" }
                ].map((s, idx) => (
                  <a key={idx} href={s.url} className="w-8 h-8 rounded-full border border-slate-800 bg-slate-900 flex items-center justify-center text-slate-400 hover:text-[#2B7FFF] hover:border-[#2B7FFF] transition-colors">
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Product Links */}
            <div className="space-y-5">
              <h4 className="text-[9px] font-bold uppercase tracking-[0.25em] text-white">Product</h4>
              <ul className="space-y-3 text-[11px] text-slate-500 font-light font-sans">
                <li>
                  <Link to={isLoggedIn ? "/dashboard" : "/login"} className="hover:text-white transition-colors">
                    CRM Dashboard
                  </Link>
                </li>
                <li>
                  <Link to={isLoggedIn ? "/dashboard" : "/login"} className="hover:text-white transition-colors">
                    Member Loyalty
                  </Link>
                </li>
                <li>
                  <Link to={isLoggedIn ? "/dashboard" : "/login"} className="hover:text-white transition-colors">
                    Inventory Control
                  </Link>
                </li>
                <li>
                  <Link to={isLoggedIn ? "/dashboard" : "/login"} className="hover:text-white transition-colors">
                    Order Analytics
                  </Link>
                </li>
                <li>
                  <Link to="/components" className="hover:text-white transition-colors">
                    UI Component Library
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company Links */}
            <div className="space-y-5">
              <h4 className="text-[9px] font-bold uppercase tracking-[0.25em] text-white">Company</h4>
              <ul className="space-y-3 text-[11px] text-slate-500 font-light font-sans">
                <li>
                  <button onClick={() => scrollToSection("about")} className="hover:text-white transition-colors text-left cursor-pointer">
                    About Us
                  </button>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <Link to={isLoggedIn ? "/dashboard" : "/login"} className="hover:text-white transition-colors">
                    Staff Portal
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-5">
              <h4 className="text-[9px] font-bold uppercase tracking-[0.25em] text-white">Contact</h4>
              <ul className="space-y-3.5 text-[11px] text-slate-500 font-light font-sans">
                <li className="leading-relaxed">
                  Jl. Fashion Avenue No. 42,<br />
                  Kebayoran Baru, Jakarta, Indonesia
                </li>
                <li>
                  support@buiqstore.com
                </li>
                <li>
                  +62 21 555 1234
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-10 text-[9px] font-medium tracking-[0.2em] uppercase text-slate-600">
            <p>© 2026 BUIQ Fashion & Lifestyle. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}