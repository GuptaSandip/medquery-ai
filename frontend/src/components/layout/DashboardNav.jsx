import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Heart, LayoutDashboard, MessageSquare,
  FileText, BookOpen, History, User,
  LogOut, Shield, Menu, X
} from "lucide-react";
import { useAuth } from "../../context/useAuth";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardNav() {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();
  const { pathname }     = useLocation();
  const [open, setOpen]  = useState(false);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navItems = [
    { label: "Dashboard",  icon: LayoutDashboard, to: "/dashboard" },
    { label: "Chat",       icon: MessageSquare,   to: "/chat"      },
    { label: "Documents",  icon: FileText,        to: "/documents" },
    { label: "Library",    icon: BookOpen,        to: "/library"   },
    { label: "History",    icon: History,         to: "/history"   },
    { label: "Profile",    icon: User,            to: "/profile"   },
  ];

  if (user?.role === "admin") {
    navItems.push({ label: "Admin", icon: Shield, to: "/admin" });
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100 flex items-center
                      justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg text-gray-900">
            Med<span className="text-blue-600">Query</span> AI
          </span>
        </Link>
        {/* Close button — mobile only */}
        <button
          onClick={() => setOpen(false)}
          className="lg:hidden text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(item => (
          <Link
            key={item.to}
            to={item.to}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl
                        text-sm font-medium transition-all
              ${pathname === item.to
                ? "bg-blue-50 text-blue-600"
                : item.to === "/admin"
                  ? "text-purple-600 hover:bg-purple-50"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {item.label}
            {item.to === "/admin" && (
              <span className="ml-auto bg-purple-100 text-purple-700
                               text-xs px-2 py-0.5 rounded-full">
                Admin
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 mb-3 px-2">
          {user?.avatar_url ? (
            <img src={user.avatar_url} alt="avatar"
                 className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-blue-600
                            flex items-center justify-center
                            text-white text-sm font-bold flex-shrink-0">
              {user?.full_name?.[0]?.toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.full_name}
            </p>
            <p className="text-xs text-gray-400 capitalize">
              {user?.role === "admin" ? "👑 Admin" : "👤 User"}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-4 py-2
                     rounded-xl text-sm text-red-500
                     hover:bg-red-50 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Desktop Sidebar ─────────────────────────────── */}
      <aside className="hidden lg:flex w-64 bg-white border-r
                        border-gray-100 min-h-screen flex-col
                        fixed left-0 top-0 z-30">
        <SidebarContent />
      </aside>

      {/* ── Mobile Hamburger Button ──────────────────────── */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 bg-white
                   border border-gray-200 rounded-xl p-2.5
                   shadow-md hover:shadow-lg transition-all"
      >
        <Menu className="w-5 h-5 text-gray-600" />
      </button>

      {/* ── Mobile Overlay ───────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
            />

            {/* Slide-in Sidebar */}
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="lg:hidden fixed left-0 top-0 h-full w-72
                         bg-white z-50 shadow-2xl flex flex-col"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}