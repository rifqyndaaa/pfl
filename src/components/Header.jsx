import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FaBell, FaSearch, FaComments, FaGift, FaBars, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { SlSettings } from "react-icons/sl";

export default function Header({ setMobileOpen, isCollapsed, setCollapsed }) {
  const [openSearch, setOpenSearch] = useState(false);
  const [openNotif, setOpenNotif] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const location = useLocation();

  const getPageInfo = () => {
    const path = location.pathname;
    if (path === "/") {
      return { title: "Dashboard Analytics", label: "Dashboard" };
    } else if (path === "/orders") {
      return { title: "Orders Management", label: "Orders" };
    } else if (path === "/products-management") {
      return { title: "Products Management", label: "Products" };
    } else if (path === "/customer-management") {
      return { title: "Customer Management", label: "Customers" };
    } else if (path === "/member-management") {
      return { title: "Member Management", label: "Members" };
    } else if (path.startsWith("/member-management/")) {
      return { title: "Member Profile Detail", label: "Member Profile" };
    } else if (path === "/components") {
      return { title: "Components Playground", label: "Components" };
    } else if (path === "/about") {
      return { title: "About BUIQ", label: "About" };
    } else {
      return { title: "BUIQ Platform", label: "Admin" };
    }
  };

  const { title: pageTitle, label: breadcrumbLabel } = getPageInfo();

  const data = [
    { id: 1, name: "Matcha Latte", cat: "Drink" },
    { id: 2, name: "Brown Sugar Milk Tea", cat: "Drink" },
    { id: 3, name: "Thai Tea Original", cat: "Drink" },
    { id: 4, name: "Ice Americano", cat: "Drink" },
    { id: 6, name: "Cheesecake", cat: "Cake" },
    { id: 7, name: "Chocolate Brownies", cat: "Cake" },
  ];

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setOpenSearch(false);
        setOpenSettings(false);
        setOpenNotif(false);
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <>
      <style>
        {`
          @keyframes slideDown {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-slide { animation: slideDown 0.3s ease forwards; }
          .glass-card { background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(12px); }
        `}
      </style>

      <header className="flex justify-between items-center px-4 md:px-8 py-4 bg-white/70 backdrop-blur-md border border-slate-200/80 rounded-2xl shadow-sm mb-6 sticky top-4 z-40 transition-all">
        
        <div className="flex items-center gap-3">
          {/* Mobile hamburger menu toggle */}
          <button 
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-all active:scale-95 cursor-pointer"
            title="Open Menu"
          >
            <FaBars size={18} />
          </button>

          {/* Desktop sidebar collapse toggle */}
          <button 
            onClick={() => setCollapsed(!isCollapsed)}
            className="hidden lg:flex p-2 text-slate-400 hover:text-slate-850 hover:bg-slate-50 rounded-xl transition-all active:scale-90 cursor-pointer"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <FaChevronRight size={14} /> : <FaChevronLeft size={14} />}
          </button>

          <div className="hidden md:block">
            <h1 className="text-base md:text-lg font-bold text-slate-900 tracking-tight leading-none">
              {pageTitle}
            </h1>
            <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase tracking-[0.15em] mt-1.5">
              <span>BUIQ</span>
              <span className="text-slate-300">/</span>
              <span className="text-primary">{breadcrumbLabel}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          
          <button 
            onClick={() => setOpenSearch(true)}
            className="flex items-center gap-3 px-3 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-400 transition-all border border-transparent hover:border-slate-200 group cursor-pointer"
          >
            <FaSearch className="text-sm group-hover:text-primary transition-colors" />
            <span className="text-xs font-semibold pr-4 lg:pr-8 hidden sm:inline">Quick search...</span>
            <kbd className="hidden lg:inline-flex h-5 items-center gap-1 rounded border border-slate-200 bg-white px-1.5 font-mono text-[10px] font-medium text-slate-400 uppercase">
              Esc
            </kbd>
          </button>

          <div className="flex items-center gap-1 sm:gap-2 px-1 sm:px-2 border-l border-slate-100 ml-1 sm:ml-2">
            {[
              { icon: FaGift, label: "Promo", color: "text-orange-500" },
              { icon: FaComments, label: "Chat", color: "text-primary" },
            ].map((item, i) => (
              <button key={i} className="p-2 hover:bg-slate-50 rounded-xl text-slate-500 transition-all active:scale-95 relative cursor-pointer">
                <item.icon size={15} />
              </button>
            ))}

            <div className="relative">
              <button 
                onClick={() => setOpenNotif(!openNotif)}
                className={`p-2 rounded-xl transition-all active:scale-95 cursor-pointer ${openNotif ? 'bg-primary-light text-primary' : 'hover:bg-slate-50 text-slate-500'}`}
              >
                <FaBell size={15} />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full border border-white animate-pulse"></span>
              </button>

              {openNotif && (
                <div className="absolute right-0 mt-3 w-80 glass-card border border-slate-100 rounded-2xl shadow-xl p-1 animate-slide z-50">
                  <div className="p-3.5 border-b border-slate-100">
                    <h3 className="font-bold text-slate-800 text-sm">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto p-1.5">
                    {[1, 2].map((n) => (
                      <div key={n} className="flex gap-3.5 p-2.5 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
                        <div className="w-9 h-9 rounded-lg bg-primary-light flex items-center justify-center text-primary group-hover:scale-105 transition-transform text-sm">🛒</div>
                        <div>
                          <p className="text-xs font-semibold text-slate-700">New Order #8829</p>
                          <p className="text-[10px] text-slate-400">2 mins ago • Table 04</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={() => setOpenSettings(true)}
              className="p-2 hover:bg-slate-50 rounded-xl text-slate-500 transition-all hover:rotate-45 cursor-pointer"
            >
              <SlSettings size={15} />
            </button>
          </div>

          <div className="flex items-center gap-2.5 pl-3 border-l border-slate-100 group cursor-pointer">
            <div className="hidden xl:block text-right leading-tight">
              <p className="text-xs font-bold text-slate-800">Rifqi yanda</p>
              <p className="text-[9px] font-semibold text-primary uppercase tracking-wider">Administrator</p>
            </div>
            <div className="relative">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4140/4140048.png"
                className="w-9 h-9 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform"
                alt="admin"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-primary rounded-full border-2 border-white"></div>
            </div>
          </div>

        </div>
      </header>

      {/* Search Modal */}
      {openSearch && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex justify-center items-start pt-20 z-[60] p-4" onClick={() => setOpenSearch(false)}>
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-slide" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-100 flex items-center gap-4">
              <FaSearch className="text-slate-400" size={16} />
              <input
                autoFocus
                type="text"
                placeholder="What are you looking for?"
                className="w-full text-base font-bold text-slate-800 outline-none placeholder:text-slate-400"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button onClick={() => setOpenSearch(false)} className="text-slate-400 hover:text-slate-800 text-[10px] font-bold bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl cursor-pointer">ESC</button>
            </div>
            <div className="p-4 max-h-[60vh] overflow-y-auto bg-slate-50/50">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-3">Results</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {filteredData.map((item) => (
                  <div key={item.id} className="flex items-center gap-3.5 p-3.5 bg-white rounded-2xl border border-slate-100 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all cursor-pointer group">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-lg group-hover:bg-primary-light group-hover:text-primary transition-all">🍽️</div>
                    <div>
                      <p className="font-bold text-slate-700 text-xs">{item.name}</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase">{item.cat}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {openSettings && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex justify-center items-center z-[60]" onClick={() => setOpenSettings(false)}>
          <div className="bg-white p-6 rounded-3xl w-full max-w-sm shadow-2xl border border-slate-250/80 animate-slide text-center" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center mx-auto mb-4 text-xl">⚙️</div>
            <h2 className="text-sm font-bold text-slate-800 mb-1">Preferences</h2>
            <p className="text-slate-450 text-[10px] mb-6">Personalize your workspace</p>
            
            <div className="space-y-4">
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className={`w-full p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between cursor-pointer ${darkMode ? 'border-primary bg-primary-light/50 text-primary' : 'border-slate-100'}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">{darkMode ? '🌙' : '☀️'}</span>
                  <span className="font-bold text-slate-700 text-xs">Dark Appearance</span>
                </div>
                <div className={`w-9 h-5 rounded-full relative transition-all ${darkMode ? 'bg-primary' : 'bg-slate-200'}`}>
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${darkMode ? 'left-4.5' : 'left-0.5'}`}></div>
                </div>
              </button>

              <button 
                onClick={() => setOpenSettings(false)}
                className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-bold transition-all shadow-md shadow-primary/10 text-xs cursor-pointer"
              >
                Save & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}