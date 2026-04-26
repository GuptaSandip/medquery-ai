import { useEffect, useState } from "react";
import { useAuth } from "../../context/useAuth";
import { FileText, MessageSquare, BookOpen, Upload, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { usersApi } from "../../services/usersApi";

export default function DashboardPage() {
  const { user }  = useAuth();
  const [stats, setStats]     = useState({
    my_documents:   0,
    chat_sessions:  0,
    shared_library: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    usersApi.getUserStats()
      .then(res => setStats(res.data))
      .catch(err => console.error("Stats error:", err))
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    {
      label: "My Documents",
      value:  stats.my_documents,
      icon:   FileText,
      color:  "blue",
      to:     "/documents",
      desc:   "Private PDFs uploaded"
    },
    {
      label: "Chat Sessions",
      value:  stats.chat_sessions,
      icon:   MessageSquare,
      color:  "green",
      to:     "/history",
      desc:   "Total conversations"
    },
    {
      label: "Shared Library",
      value:  stats.shared_library,
      icon:   BookOpen,
      color:  "purple",
      to:     "/library",
      desc:   "Admin shared docs"
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* Welcome Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.full_name?.split(" ")[0]} 👋
          </h1>
          <p className="text-gray-500 mt-1">
            Your medical AI assistant is ready
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 
                        bg-green-50 text-green-700 px-4 py-2 
                        rounded-full text-sm font-medium">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          System Online
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat) => (
          <Link key={stat.label} to={stat.to}>
            <div className="card hover:shadow-md transition-all 
                            cursor-pointer group">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-3 rounded-xl bg-${stat.color}-100 
                                 group-hover:bg-${stat.color}-200 
                                 transition-colors`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <TrendingUp className="w-4 h-4 text-gray-300 
                                       group-hover:text-gray-400" />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {loading ? (
                  <span className="inline-block w-8 h-8 bg-gray-200 
                                   rounded animate-pulse" />
                ) : stat.value}
              </p>
              <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
              <p className="text-gray-400 text-xs mt-0.5">{stat.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Quick Actions
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Link to="/documents">
          <div className="card hover:shadow-md transition-all cursor-pointer
                          border-2 border-dashed border-blue-200
                          hover:border-blue-400 text-center py-10 group">
            <Upload className="w-10 h-10 text-blue-300 mx-auto mb-3 
                               group-hover:text-blue-500 transition-colors" />
            <p className="font-semibold text-gray-700">Upload Medical PDF</p>
            <p className="text-gray-400 text-sm mt-1">
              Reports, guidelines, or research papers
            </p>
          </div>
        </Link>

        <Link to="/chat">
          <div className="card hover:shadow-md transition-all cursor-pointer
                          bg-gradient-to-br from-blue-600 to-blue-700 
                          text-white text-center py-10">
            <MessageSquare className="w-10 h-10 text-white mx-auto mb-3" />
            <p className="font-semibold text-white">Start AI Chat</p>
            <p className="text-blue-100 text-sm mt-1">
              Ask questions about your documents
            </p>
          </div>
        </Link>
      </div>

      {/* Account Info */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Account Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">
              Full Name
            </p>
            <p className="text-gray-800 font-medium mt-1">
              {user?.full_name}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">
              Email
            </p>
            <p className="text-gray-800 font-medium mt-1">
              {user?.email}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">
              Account Type
            </p>
            <span className={`inline-block mt-1 px-3 py-1 rounded-full 
                              text-xs font-semibold
              ${user?.role === "admin"
                ? "bg-purple-100 text-purple-700"
                : "bg-blue-100 text-blue-700"
              }`}>
              {user?.role === "admin" ? "👑 Admin" : "👤 User"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}