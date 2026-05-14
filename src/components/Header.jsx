import { useState, useEffect } from "react";
import { FaBell, FaSearch, FaComments, FaGift } from "react-icons/fa";
import { SlSettings } from "react-icons/sl";

export default function Header() {
  const [openSearch, setOpenSearch] = useState(false);
  const [openNotif, setOpenNotif] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);

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

      <header className="flex justify-between items-center px-8 py-4 bg-white/70 backdrop-blur-md border border-gray-100 rounded-[2rem] shadow-sm mb-8 sticky top-4 z-40 transition-all">
        
        <div className="hidden md:block">
          <h1 className="text-xl font-black text-slate-800 tracking-tight">
            BUIQ <span className="text-blue-500 text-3xl leading-none">.</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Welcome back, Chief!</p>
        </div>

        <div className="flex items-center gap-3">
          
          <button 
            onClick={() => setOpenSearch(true)}
            className="flex items-center gap-3 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-400 transition-all border border-transparent hover:border-slate-200 group"
          >
            <FaSearch className="text-sm group-hover:text-blue-500 transition-colors" />
            <span className="text-xs font-semibold pr-8 hidden lg:inline">Quick search...</span>
            <kbd className="hidden lg:inline-flex h-5 items-center gap-1 rounded border border-slate-200 bg-white px-1.5 font-mono text-[10px] font-medium text-slate-400 uppercase">
              Esc
            </kbd>
          </button>

          <div className="flex items-center gap-2 px-2 border-l border-slate-100 ml-2">
            {[
              { icon: FaGift, label: "Promo", color: "text-orange-500" },
              { icon: FaComments, label: "Chat", color: "text-blue-500" },
            ].map((item, i) => (
              <button key={i} className="p-3 hover:bg-slate-50 rounded-2xl text-slate-500 transition-all active:scale-90 relative">
                <item.icon size={18} />
              </button>
            ))}

            <div className="relative">
              <button 
                onClick={() => setOpenNotif(!openNotif)}
                className={`p-3 rounded-2xl transition-all active:scale-90 ${openNotif ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-50 text-slate-500'}`}
              >
                <FaBell size={18} />
                <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
              </button>

              {openNotif && (
                <div className="absolute right-0 mt-4 w-80 glass-card border border-white rounded-[2rem] shadow-2xl p-2 animate-slide z-50">
                  <div className="p-4 border-b border-gray-100/50">
                    <h3 className="font-black text-slate-800">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto p-2">
                    {[1, 2].map((n) => (
                      <div key={n} className="flex gap-4 p-3 hover:bg-white rounded-[1.5rem] transition-colors cursor-pointer group">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">🛒</div>
                        <div>
                          <p className="text-xs font-bold text-slate-700">New Order #8829</p>
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
              className="p-3 hover:bg-slate-50 rounded-2xl text-slate-500 transition-all hover:rotate-45"
            >
              <SlSettings size={18} />
            </button>
          </div>

          <div className="flex items-center gap-3 pl-4 border-l border-slate-100 group cursor-pointer">
            <div className="hidden xl:block text-right leading-none">
              <p className="text-xs font-black text-slate-800">Rifqi Aldi</p>
              <p className="text-[9px] font-bold text-blue-500 uppercase tracking-tighter">Administrator</p>
            </div>
            <div className="relative">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4140/4140048.png"
                className="w-10 h-10 rounded-2xl object-cover shadow-md group-hover:scale-110 transition-transform"
                alt="admin"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-4 border-white"></div>
            </div>
          </div>

        </div>
      </header>

      {/* Search Modal */}
      {openSearch && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex justify-center items-start pt-20 z-[60] p-4" onClick={() => setOpenSearch(false)}>
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-slide" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-50 flex items-center gap-4">
              <FaSearch className="text-slate-300" size={20} />
              <input
                autoFocus
                type="text"
                placeholder="What are you looking for?"
                className="w-full text-xl font-bold text-slate-800 outline-none placeholder:text-slate-200"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button onClick={() => setOpenSearch(false)} className="text-slate-300 hover:text-slate-800 text-sm font-bold bg-slate-50 px-4 py-2 rounded-xl">ESC</button>
            </div>
            <div className="p-4 max-h-[60vh] overflow-y-auto bg-slate-50/50">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-4 mb-4">Results</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {filteredData.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 bg-white rounded-3xl border border-transparent hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100 transition-all cursor-pointer group">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-xl group-hover:bg-blue-500 group-hover:text-white transition-all">🍽️</div>
                    <div>
                      <p className="font-bold text-slate-700">{item.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{item.cat}</p>
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
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm flex justify-center items-center z-[60]" onClick={() => setOpenSettings(false)}>
          <div className="bg-white p-10 rounded-[3rem] w-full max-w-sm shadow-2xl animate-slide text-center" onClick={e => e.stopPropagation()}>
            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-3xl">⚙️</div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">Preferences</h2>
            <p className="text-slate-400 text-sm mb-8">Personalize your workspace</p>
            
            <div className="space-y-4">
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className={`w-full p-5 rounded-3xl border-2 transition-all flex items-center justify-between ${darkMode ? 'border-blue-500 bg-blue-50' : 'border-slate-100'}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{darkMode ? '🌙' : '☀️'}</span>
                  <span className="font-bold text-slate-700">Dark Appearance</span>
                </div>
                <div className={`w-10 h-6 rounded-full relative transition-all ${darkMode ? 'bg-blue-500' : 'bg-slate-200'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${darkMode ? 'left-5' : 'left-1'}`}></div>
                </div>
              </button>

              <button className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black hover:bg-black transition-all shadow-xl shadow-slate-200">
                Save & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}