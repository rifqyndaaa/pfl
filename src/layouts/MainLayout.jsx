import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";

export default function MainLayout() {
  const [isCollapsed, setCollapsed] = useState(false);
  const [isMobileOpen, setMobileOpen] = useState(false);
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-semibold text-slate-500">Loading App Layout...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div id="app-container" className="bg-background min-h-screen flex text-foreground overflow-hidden">
      {/* Desktop Sidebar (visible on lg screens) */}
      <div className={`hidden lg:block shrink-0 transition-all duration-300 ease-in-out ${isCollapsed ? "w-[80px]" : "w-[260px]"}`}>
        <Sidebar isCollapsed={isCollapsed} />
      </div>

      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 lg:hidden transition-opacity duration-300"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-[260px] transform ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out lg:hidden bg-white shadow-2xl`}>
        <Sidebar isMobile={true} setMobileOpen={setMobileOpen} />
      </div>

      {/* Main Content Pane */}
      <div id="main-content" className="flex-1 min-w-0 flex flex-col h-screen overflow-y-auto p-4 md:p-6">
        <Header
          setMobileOpen={setMobileOpen}
          isCollapsed={isCollapsed}
          setCollapsed={setCollapsed}
        />
        <div className="flex-1 mt-2">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
