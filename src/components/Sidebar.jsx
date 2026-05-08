import { NavLink } from "react-router-dom";
import {
  MdDashboard, MdShoppingCart, MdPeople,
  MdErrorOutline, MdWarning, MdSettings, MdLogout
} from "react-icons/md";

const menuItems = [
  { group: "MAIN MENU", items: [
    { icon: MdDashboard, label: "Dashboard", path: "/" },
    { icon: MdShoppingCart, label: "Order List", path: "/orders" },
    { icon: MdPeople, label: "Customers", path: "/customers" },
  ]},
  { group: "ERROR PAGES", items: [
    { icon: MdErrorOutline, label: "Error 400", path: "/error-400" },
    { icon: MdWarning, label: "Error 401", path: "/error-401" },
    { icon: MdErrorOutline, label: "Error 403", path: "/error-403" },
  ]}
];

export default function Sidebar() {
  // Styling menu yang lebih premium
  const menuClass = ({ isActive }) =>
    `group flex items-center gap-3 px-4 py-3 rounded-2xl mb-1 text-[13px] font-semibold transition-all duration-300 ${
      isActive
        ? "bg-green-500 text-white shadow-lg shadow-green-200 translate-x-2"
        : "text-gray-500 hover:bg-gray-50 hover:text-green-600"
    }`;

  return (
    <aside className="flex flex-col h-screen w-[260px] bg-white border-r border-gray-100 flex-shrink-0 z-20 sticky top-0">
      
      {/* 🚀 Logo Section dengan Glow Effect */}
      <div className="px-8 py-10">
        <div className="flex items-center gap-1 group cursor-default">
          <div className="w-2 h-8 bg-green-500 rounded-full group-hover:h-10 transition-all duration-300"></div>
          <div className="flex items-baseline ml-2">
            <span className="text-3xl font-black text-gray-800 tracking-tighter italic">Sedap</span>
            <span className="text-4xl font-black text-green-500 leading-none">.</span>
          </div>
        </div>
        <p className="text-[10px] text-gray-400 mt-1 font-bold uppercase tracking-[0.2em] ml-3">Premium Kitchen</p>
      </div>

      {/* 🧭 Navigation with Groups */}
      <nav className="flex-1 px-4 overflow-y-auto custom-scrollbar">
        {menuItems.map((section) => (
          <div key={section.group} className="mb-6">
            <p className="text-[10px] font-black text-gray-300 px-4 mb-3 tracking-[0.15em]">
              {section.group}
            </p>
            {section.items.map(({ icon: Icon, label, path }) => (
              <NavLink key={label} to={path} className={menuClass}>
                <div className={`p-1.5 rounded-lg transition-colors ${
                  // Background icon kecil saat hover/active
                  "group-hover:bg-white/20"
                }`}>
                  <Icon className="text-[18px]" />
                </div>
                <span className="tracking-tight">{label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* 🎁 Floating Promo Card (Glassmorphism) */}
      <div className="px-4 pb-6">
        <div className="relative overflow-hidden rounded-[2rem] p-5 bg-slate-900 group">
          {/* Efek Cahaya Latar */}
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-green-500/20 blur-3xl group-hover:bg-green-500/40 transition-all"></div>
          
          <div className="relative z-10 text-center">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-3 border border-white/10">
              <span className="text-xl">✨</span>
            </div>
            <p className="text-white font-bold text-xs mb-1">Upgrade Pro</p>
            <p className="text-white/50 text-[10px] leading-relaxed mb-4">Get more features & analytics reports</p>
            
            <button className="w-full bg-green-500 hover:bg-green-400 text-white text-[11px] font-black py-2.5 rounded-xl shadow-lg shadow-green-900/20 transition-all active:scale-95">
              Check Benefits
            </button>
          </div>
        </div>
        
        {/* Footer info */}
        <div className="mt-6 px-4">
            <div className="flex items-center gap-3 py-3 border-t border-gray-50 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                    <MdLogout size={16} />
                </div>
                <span className="text-[12px] font-bold text-gray-600">Logout</span>
            </div>
            <p className="text-[9px] text-gray-300 font-medium text-center mt-2 tracking-widest uppercase">
              Sedap v.1.0.2
            </p>
        </div>
      </div>
    </aside>
  );
}