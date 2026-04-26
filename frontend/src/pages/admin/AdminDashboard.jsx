import { useState, useEffect } from "react";
import { useAuth } from "../../context/useAuth";
import { useNavigate } from "react-router-dom";
import {
  Users, FileText, MessageSquare,
  BookOpen, Loader, Trash2, Upload, Shield
} from "lucide-react";
import { adminApi } from "../../services/adminApi";
import Toast from "../../components/ui/Toast";

export default function AdminDashboard() {
  const { user }              = useAuth();
  const navigate              = useNavigate();
  const [stats,    setStats]  = useState(null);
  const [users,    setUsers]  = useState([]);
  const [loading,  setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [toast,    setToast]  = useState(null);

  const showToast = (message, type = "success") =>
    setToast({ message, type });

  useEffect(() => {
    // Redirect non-admins
    if (user && user.role !== "admin") {
      navigate("/dashboard");
      return;
    }

    Promise.all([
      adminApi.getStats(),
      adminApi.getAllUsers()
    ]).then(([statsRes, usersRes]) => {
      setStats(statsRes.data);
      setUsers(usersRes.data);
    }).catch(() => showToast("Failed to load admin data", "error"))
      .finally(() => setLoading(false));
  }, [user, navigate]);

  const handleDeleteUser = async (userId, email) => {
    if (!confirm(`Delete user "${email}"? This cannot be undone.`)) return;
    try {
      await adminApi.deleteUser(userId);
      setUsers(prev => prev.filter(u => u.id !== userId));
      showToast("User deleted");
    } catch (err) {
      showToast(err.response?.data?.detail || "Failed to delete", "error");
    }
  };

  const handleUploadShared = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);

    try {
      await adminApi.uploadSharedDoc(formData);
      showToast("Shared document uploaded successfully!");
    } catch (err) {
      showToast(err.response?.data?.detail || "Upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  const statCards = [
    { label: "Total Users",     value: stats?.total_users,     icon: Users,          color: "blue"   },
    { label: "Total Documents", value: stats?.total_documents, icon: FileText,       color: "green"  },
    { label: "Chat Sessions",   value: stats?.total_sessions,  icon: MessageSquare,  color: "yellow" },
    { label: "Shared Docs",     value: stats?.shared_documents, icon: BookOpen,      color: "purple" },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-purple-100 p-2 rounded-xl">
          <Shield className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="text-gray-500 text-sm">
            Platform management and statistics
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statCards.map(stat => (
          <div key={stat.label} className="card">
            <div className={`p-2 rounded-lg bg-${stat.color}-100 
                             w-fit mb-3`}>
              <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {stat.value ?? 0}
            </p>
            <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Upload Shared Doc */}
      <div className="card mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 
                       flex items-center gap-2">
          <Upload className="w-5 h-5 text-blue-600" />
          Upload Shared Medical Document
        </h2>
        <p className="text-gray-400 text-sm mb-4">
          Documents uploaded here are available to ALL users in the Shared Library
        </p>
        <label className="flex items-center gap-3 cursor-pointer 
                           border-2 border-dashed border-gray-200 
                           rounded-xl p-6 hover:border-blue-400 
                           hover:bg-blue-50 transition-all w-fit">
          <Upload className="w-5 h-5 text-gray-400" />
          <span className="text-gray-600 font-medium">
            {uploading ? "Uploading & Processing..." : "Click to upload PDF"}
          </span>
          <input
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handleUploadShared}
            disabled={uploading}
          />
        </label>
      </div>

      {/* Users Table */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 
                       flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          All Users ({users.length})
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 text-gray-500 
                               font-medium">Name</th>
                <th className="text-left py-3 px-4 text-gray-500 
                               font-medium">Email</th>
                <th className="text-left py-3 px-4 text-gray-500 
                               font-medium">Role</th>
                <th className="text-left py-3 px-4 text-gray-500 
                               font-medium">Provider</th>
                <th className="text-left py-3 px-4 text-gray-500 
                               font-medium">Status</th>
                <th className="text-left py-3 px-4 text-gray-500 
                               font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}
                    className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">
                    {u.full_name}
                  </td>
                  <td className="py-3 px-4 text-gray-500">{u.email}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs 
                                      font-semibold
                      ${u.role === "admin"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-gray-100 text-gray-600"
                      }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-500 capitalize">
                    {u.auth_provider}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs
                      ${u.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                      }`}>
                      {u.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {u.role !== "admin" && (
                      <button
                        onClick={() => handleDeleteUser(u.id, u.email)}
                        className="text-red-400 hover:text-red-600 
                                   transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}