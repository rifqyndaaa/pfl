import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  MdDashboard,
  MdStore,
  MdInventory,
  MdShoppingBag,
  MdErrorOutline,
  MdWarning,
  MdLogout,
  MdWidgets,
  MdInfo,
  MdCardMembership,
} from "react-icons/md";

const menuItems = [
  {
    group: "MAIN MENU",
    items: [
      { icon: MdDashboard, label: "Dashboard", path: "/dashboard" },
      { icon: MdStore, label: "Orders", path: "/orders" },
      { icon: MdShoppingBag, label: "Products", path: "/products-management" },
      { icon: MdInventory, label: "Customer Management", path: "/customer-management" },
    ],
  },
  {
    group: "BUSINESS",
    items: [
      { icon: MdCardMembership, label: "Member Management", path: "/member-management" },
      { icon: MdInfo, label: "About BUIQ", path: "/about" },
    ],
  },
  {
    group: "INFORMATION",
    items: [
      { icon: MdWidgets, label: "Components", path: "/components" },
    ],
  },
  {
    group: "SYSTEM",
    items: [
      { icon: MdErrorOutline, label: "Error 400", path: "/error-400" },
      { icon: MdWarning, label: "Error 401", path: "/error-401" },
      { icon: MdErrorOutline, label: "Error 403", path: "/error-403" },
    ],
  },
];

export default function Sidebar({ isCollapsed, isMobile, setMobileOpen }) {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("buiq_token");
    localStorage.removeItem("buiq_user");
    sessionStorage.clear();
    setShowLogoutModal(false);
    navigate("/");
  };

  const menuClass = ({ isActive }) =>
    `group flex items-center gap-2.5 px-3 py-2.5 rounded-xl mb-0.5 text-xs font-bold transition-all duration-200 border-l-[3px] active:scale-[0.98] ${
      isActive
        ? "bg-primary-light text-primary border-primary shadow-sm shadow-primary/5"
        : "text-slate-600 hover:bg-slate-50/70 hover:text-slate-950 border-transparent"
    } ${isCollapsed ? "justify-center px-0 border-l-0" : ""}`;

  return (
    <>
      <aside className={`flex flex-col h-screen bg-white border-r border-slate-200/80 shrink-0 z-20 transition-all duration-300 ${
        isCollapsed ? "w-[80px]" : "w-[260px]"
      }`}>
        {/* Branding Section */}
        <div className={`px-5 py-6 border-b border-slate-100 mb-4 flex items-center ${
          isCollapsed ? "justify-center" : "gap-3"
        }`}>
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white font-black text-lg shrink-0 shadow-md shadow-primary/20">
            B
          </div>
          {!isCollapsed && (
            <div>
              <div className="flex items-baseline">
                <span className="text-base font-black text-slate-800 tracking-tight">BUIQ</span>
                <span className="text-lg font-black text-primary">.</span>
              </div>
              <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                Lifestyle Platform
              </p>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 overflow-y-auto space-y-4">
          {menuItems.map((section, idx) => (
            <div key={section.group}>
              {idx > 0 && <div className="my-3 border-t border-slate-100" />}
              {!isCollapsed ? (
                <p className="text-[9px] font-bold text-slate-400/80 px-3 mb-2 tracking-[0.15em] uppercase">
                  {section.group}
                </p>
              ) : (
                <div className="h-2" />
              )}
              <div className="space-y-1">
                {section.items.map(({ icon: Icon, label, path }) => (
                  <NavLink
                    key={label}
                    to={path}
                    className={menuClass}
                    onClick={() => isMobile && setMobileOpen(false)}
                    title={isCollapsed ? label : undefined}
                  >
                    <Icon className={`text-base shrink-0 transition-transform group-hover:scale-105 ${isCollapsed ? "text-lg" : ""}`} />
                    {!isCollapsed && <span>{label}</span>}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Logout Footer Section */}
        <div className={`px-3 pb-6 border-t border-slate-100 pt-4 flex flex-col ${
          isCollapsed ? "items-center" : ""
        }`}>
          <button 
            onClick={() => setShowLogoutModal(true)}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-rose-50/60 hover:text-rose-600 transition-all cursor-pointer ${
              isCollapsed ? "justify-center w-10 h-10 px-0" : "w-full"
            }`}
            title={isCollapsed ? "Logout" : undefined}
          >
            <MdLogout className="text-base shrink-0" />
            {!isCollapsed && <span className="text-xs font-semibold">Logout</span>}
          </button>
          {!isCollapsed && (
            <p className="text-[8px] text-slate-400 font-bold text-center mt-4 tracking-widest uppercase">
              BUIQ v.1.0.0
              </p>
          )}
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200/80 text-center animate-slide">
            <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-rose-500">
              <MdLogout size={24} />
            </div>
            <h3 className="text-sm font-bold text-slate-800 mb-2">Logout Account</h3>
            <p className="text-slate-400 text-[10px] leading-relaxed mb-6">
              Are you sure you want to logout from your account?
            </p>
            <div className="flex gap-3 justify-center">
              <button 
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 text-slate-500 bg-white hover:bg-slate-50 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleLogout}
                className="flex-1 px-4 py-2 rounded-xl text-xs font-bold text-white bg-danger hover:bg-primary-hover transition-all cursor-pointer shadow-md shadow-danger/10"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}