import { NavLink } from "react-router-dom";

import {
  MdDashboard,
  MdStore,
  MdInventory,
  MdShoppingBag,
  MdErrorOutline,
  MdWarning,
  MdLogout,
  MdWidgets,
} from "react-icons/md";

const menuItems = [
  {
    group: "MAIN MENU",

    items: [
      {
        icon: MdDashboard,
        label: "Dashboard",
        path: "/",
      },

      {
        icon: MdStore,
        label: "Orders",
        path: "/orders",
      },

      {
        icon: MdShoppingBag,
        label: "Products",
        path: "/products-management",
      },

      {
        icon: MdInventory,
        label: "Customer Management",
        path: "/customer-management",
      },

      {
        icon: MdWidgets,
        label: "Components",
        path: "/components",
      },
    ],
  },

  {
    group: "ERROR PAGES",

    items: [
      {
        icon: MdErrorOutline,
        label: "Error 400",
        path: "/error-400",
      },

      {
        icon: MdWarning,
        label: "Error 401",
        path: "/error-401",
      },

      {
        icon: MdErrorOutline,
        label: "Error 403",
        path: "/error-403",
      },
    ],
  },
];

export default function Sidebar() {

  const menuClass = ({ isActive }) =>
    `group flex items-center gap-3 px-4 py-3 rounded-2xl mb-1 text-[13px] font-semibold transition-all duration-300 ${
      isActive
        ? "bg-blue-500 text-white shadow-lg shadow-blue-200 translate-x-2"
        : "text-gray-500 hover:bg-gray-50 hover:text-blue-600"
    }`;

  return (
    <aside className="flex flex-col h-screen w-[260px] bg-white border-r border-gray-100 flex-shrink-0 z-20 sticky top-0">

      {/* Logo */}
      <div className="px-8 py-10">

        <div className="flex items-center gap-1">

          <div className="w-2 h-8 bg-blue-500 rounded-full"></div>

          <div className="flex items-baseline ml-2">

            <span className="text-3xl font-black text-gray-800 italic">
              BUIQ
            </span>

            <span className="text-4xl font-black text-blue-500">
              .
            </span>

          </div>
        </div>

        <p className="text-[10px] text-gray-400 mt-1 font-bold uppercase tracking-[0.2em] ml-3">
          PREMIUM PLATFORM
        </p>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4 overflow-y-auto">

        {menuItems.map((section) => (
          <div key={section.group} className="mb-6">

            <p className="text-[10px] font-black text-gray-300 px-4 mb-3 tracking-[0.15em]">
              {section.group}
            </p>

            {section.items.map(({ icon: Icon, label, path }) => (

              <NavLink
                key={label}
                to={path}
                className={menuClass}
              >

                <div className="p-1.5 rounded-lg">
                  <Icon className="text-[18px]" />
                </div>

                <span>{label}</span>

              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 pb-6">

        <div className="relative overflow-hidden rounded-[2rem] p-5 bg-slate-900">

          <div className="relative z-10 text-center">

            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">✨</span>
            </div>

            <p className="text-white font-bold text-xs mb-1">
              Upgrade BUIQ Pro
            </p>

            <p className="text-white/50 text-[10px] leading-relaxed mb-4">
              Get more features & analytics reports
            </p>

            <button className="w-full bg-blue-500 hover:bg-blue-400 text-white text-[11px] font-black py-2.5 rounded-xl transition-all">
              Check Benefits
            </button>

          </div>
        </div>

        <div className="mt-6 px-4">

          <div className="flex items-center gap-3 py-3 border-t border-gray-50 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">

            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
              <MdLogout size={16} />
            </div>

            <span className="text-[12px] font-bold text-gray-600">
              Logout
            </span>

          </div>

          <p className="text-[9px] text-gray-300 font-medium text-center mt-2 tracking-widest uppercase">
            BUIQ v.1.0.0
          </p>
        </div>
      </div>
    </aside>
  );
}