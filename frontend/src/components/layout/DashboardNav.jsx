import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Heart, LayoutDashboard, MessageSquare,
  FileText, BookOpen, History, User,
  LogOut, Shield
} from "lucide-react";
import { useAuth } from "../../context/useAuth";

export default function DashboardNav() {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();
  const { pathname }     = useLocation();

  const navItems = [
    { label: "Dashboard",  icon: LayoutDashboard, to: "/dashboard" },
    { label: "Chat",       icon: MessageSquare,   to: "/chat"      },
    { label: "Documents",  icon: FileText,        to: "/documents" },
    { label: "Library",    icon: BookOpen,        to: "/library"   },
    { label: "History",    icon: History,         to: "/history"   },
    { label: "Profile",    icon: User,            to: "/profile"   },
  ];

  // Add admin link if user is admin
  if (user?.role === "admin") {
    navItems.push({ label: "Admin", icon: Shield, to: "/admin" });
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-100 
                      min-h-screen flex flex-col fixed left-0 top-0 z-30">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg text-gray-900">
            Med<span className="text-blue-600">Query</span> AI
          </span>
        </Link>
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
            <item.icon className="w-5 h-5" />
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
            <img
              src={user.avatar_url}
              alt="avatar"
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-blue-600 
                            flex items-center justify-center 
                            text-white text-sm font-bold">
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
    </aside>
  );
}