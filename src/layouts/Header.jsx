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
    { id: 1, name: "Nasi Goreng" },
    { id: 2, name: "Mie Ayam" },
    { id: 3, name: "Ayam Bakar" },
    { id: 4, name: "Es Teh Manis" },
    { id: 5, name: "Kopi Susu" },
  ];

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setOpenSearch(false);
        setOpenSettings(false);
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <>
      {/* 🔥 HEADER FULL HIJAU - Enhanced */}
      <div className="flex justify-between items-center px-6 py-3 bg-gradient-to-r from-hijau to-emerald-700 text-white rounded-xl shadow-lg mb-4 transition-all duration-300 hover:shadow-xl">
        
        {/* SEARCH - Enhanced */}
        <div className="relative w-full max-w-md group">
          <input
            type="text"
            placeholder="Search Here..."
            onClick={() => setOpenSearch(true)}
            className="bg-white/20 backdrop-blur-sm placeholder-white/70 p-2.5 pr-10 w-full rounded-xl outline-none text-sm text-white transition-all duration-200 border border-white/20 focus:bg-white/30 focus:border-white/40 hover:bg-white/25"
          />
          <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 text-sm transition-transform group-hover:scale-110" />
          
          {/* Animated search indicator */}
          <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white/50 transition-all duration-300 group-focus-within:w-full"></div>
        </div>

        {/* ICONS */}
        <div className="flex items-center space-x-2">

          {/* BELL - Enhanced */}
          <div className="relative">
            <div
              onClick={() => setOpenNotif(!openNotif)}
              className="relative p-2.5 bg-white/20 rounded-2xl cursor-pointer hover:bg-white/30 transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              <FaBell />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
            </div>

            {openNotif && (
              <div className="absolute right-0 mt-3 w-72 bg-white text-gray-700 shadow-2xl rounded-xl overflow-hidden z-50 animate-fadeInDown border border-gray-100">
                <div className="p-4 bg-gradient-to-r from-hijau to-emerald-600 text-white">
                  <p className="font-semibold">Notifikasi</p>
                  <p className="text-xs opacity-80 mt-1">Pemberitahuan terbaru</p>
                </div>
                <div className="divide-y divide-gray-100">
                  <div className="p-3 hover:bg-gray-50 transition-colors cursor-pointer flex items-start space-x-3">
                    <span className="text-xl">🛒</span>
                    <div>
                      <p className="text-sm font-medium">Order baru masuk</p>
                      <p className="text-xs text-gray-500">2 menit yang lalu</p>
                    </div>
                  </div>
                  <div className="p-3 hover:bg-gray-50 transition-colors cursor-pointer flex items-start space-x-3">
                    <span className="text-xl">🚚</span>
                    <div>
                      <p className="text-sm font-medium">Pesanan dikirim</p>
                      <p className="text-xs text-gray-500">1 jam yang lalu</p>
                    </div>
                  </div>
                  <div className="p-3 hover:bg-gray-50 transition-colors cursor-pointer flex items-start space-x-3">
                    <span className="text-xl">💰</span>
                    <div>
                      <p className="text-sm font-medium">Pembayaran diterima</p>
                      <p className="text-xs text-gray-500">3 jam yang lalu</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CHAT - Enhanced */}
          <div className="p-2.5 bg-white/20 rounded-2xl cursor-pointer hover:bg-white/30 transition-all duration-200 transform hover:scale-105 active:scale-95 group relative">
            <FaComments />
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Chat
            </span>
          </div>

          {/* GIFT - Enhanced */}
          <div className="p-2.5 bg-white/20 rounded-2xl cursor-pointer hover:bg-white/30 transition-all duration-200 transform hover:scale-105 active:scale-95 group relative">
            <FaGift />
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Promo
            </span>
          </div>

          {/* SETTINGS - Enhanced */}
          <div
            onClick={() => setOpenSettings(true)}
            className="p-2.5 bg-white/20 rounded-2xl cursor-pointer hover:bg-white/30 transition-all duration-200 transform hover:rotate-90 active:scale-95"
          >
            <SlSettings />
          </div>

          {/* PROFILE - Enhanced */}
          <div className="flex items-center space-x-3 border-l border-white/30 pl-4 ml-2">
            <div className="text-right">
              <span className="text-sm font-medium block">
                Hello, boss
              </span>
              <span className="text-xs text-white/70">Selamat datang</span>
            </div>
            <div className="relative group">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4140/4140048.png"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-md transition-transform group-hover:scale-105"
                alt="profile"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full ring-2 ring-white"></div>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH MODAL - Enhanced */}
      {openSearch && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn"
          onClick={() => setOpenSearch(false)}
        >
          <div
            className="bg-white rounded-2xl w-96 shadow-2xl transform transition-all duration-300 animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">🔍 Search Menu</h2>
                <button 
                  onClick={() => setOpenSearch(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors text-xl"
                >
                  ✕
                </button>
              </div>
              <div className="relative">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border-2 border-gray-200 p-3 pl-10 w-full rounded-xl outline-none text-sm focus:border-hijau transition-all duration-200"
                  placeholder="Cari menu..."
                  autoFocus
                />
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              <div className="mt-4 max-h-80 overflow-y-auto space-y-2">
                {filteredData.map((item, index) => (
                  <div 
                    key={item.id} 
                    className="p-3 bg-gray-50 rounded-xl hover:bg-hijau/10 transition-all duration-200 cursor-pointer group transform hover:translate-x-1"
                  >
                    <p className="text-gray-700 group-hover:text-hijau font-medium">{item.name}</p>
                  </div>
                ))}
                {filteredData.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-lg">😢</p>
                    <p>Menu tidak ditemukan</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SETTINGS MODAL - Enhanced */}
      {openSettings && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn"
          onClick={() => setOpenSettings(false)}
        >
          <div
            className="bg-white rounded-2xl w-96 shadow-2xl transform transition-all duration-300 animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">⚙️ Settings</h2>
                <button 
                  onClick={() => setOpenSettings(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors text-xl"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Dark Mode Toggle Card */}
                <div className="p-4 bg-gray-50 rounded-xl hover:shadow-md transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-800">🌙 Dark Mode</p>
                      <p className="text-xs text-gray-500 mt-1">Tampilan lebih nyaman di malam hari</p>
                    </div>
                    <button
                      onClick={() => setDarkMode(!darkMode)}
                      className="relative w-14 h-8 rounded-full transition-all duration-300 focus:outline-none"
                      style={{ backgroundColor: darkMode ? '#10b981' : '#cbd5e1' }}
                    >
                      <span 
                        className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ${
                          darkMode ? 'left-7' : 'left-1'
                        }`}
                      />
                      <span className="absolute left-1 top-1/2 -translate-y-1/2 text-xs">
                        {darkMode ? '🌙' : '☀️'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Additional Settings */}
                <div className="p-4 bg-gray-50 rounded-xl hover:shadow-md transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-800">🔔 Notifikasi</p>
                      <p className="text-xs text-gray-500 mt-1">Terima pemberitahuan</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-hijau/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-hijau"></div>
                    </label>
                  </div>
                </div>

                <button className="w-full bg-gradient-to-r from-hijau to-emerald-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95">
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-fadeInDown {
          animation: fadeInDown 0.2s ease-out;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
      `}</style>
    </>
  );
}