import { useState } from "react";
import { useAuth } from "../../context/useAuth";
import { usersApi } from "../../services/usersApi";
import {
  User, Mail, Shield, Calendar,
  Edit2, Save, X
} from "lucide-react";
import Toast from "../../components/ui/Toast";

export default function ProfilePage() {
  const { user, login } = useAuth();

  const [editing, setEditing] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [toast,   setToast]   = useState(null);
  const [form, setForm]       = useState({
    full_name: user?.full_name || "",
    bio:       user?.bio || "",
  });

  const showToast = (message, type = "success") =>
    setToast({ message, type });

  const handleSave = async () => {
    setSaving(true);
    try {
      await usersApi.updateProfile(form);
      showToast("Profile updated successfully!");
      setEditing(false);
      // Refresh user data
      const res = await usersApi.getProfile();
      // Update local state via re-fetching
    } catch (err) {
      showToast(
        err.response?.data?.detail || "Failed to update profile",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({
      full_name: user?.full_name || "",
      bio:       user?.bio || "",
    });
    setEditing(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        👤 My Profile
      </h1>

      {/* Profile Card */}
      <div className="card mb-6">
        {/* Avatar + Name */}
        <div className="flex items-center gap-5 mb-6 pb-6 
                        border-b border-gray-100">
          <div className="relative">
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt="Avatar"
                className="w-20 h-20 rounded-full object-cover 
                           border-4 border-blue-100"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br 
                              from-blue-500 to-blue-700 
                              flex items-center justify-center 
                              text-white text-3xl font-bold 
                              border-4 border-blue-100">
                {user?.full_name?.[0]?.toUpperCase()}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {user?.full_name}
            </h2>
            <p className="text-gray-500">{user?.email}</p>
            <span className={`inline-block mt-2 px-3 py-1 rounded-full 
                              text-xs font-semibold
              ${user?.role === "admin"
                ? "bg-purple-100 text-purple-700"
                : "bg-blue-100 text-blue-700"
              }`}>
              {user?.role === "admin" ? "👑 Admin" : "👤 User"}
            </span>
          </div>

          {/* Edit Button */}
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="ml-auto flex items-center gap-2 px-4 py-2 
                         rounded-xl text-sm border border-gray-200 
                         hover:bg-gray-50 transition-all text-gray-600"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
          )}
        </div>

        {/* Profile Fields */}
        <div className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="flex items-center gap-2 text-sm 
                               font-medium text-gray-600 mb-2">
              <User className="w-4 h-4" />
              Full Name
            </label>
            {editing ? (
              <input
                type="text"
                value={form.full_name}
                onChange={(e) =>
                  setForm(p => ({ ...p, full_name: e.target.value }))
                }
                className="input-field"
              />
            ) : (
              <p className="text-gray-900 font-medium bg-gray-50 
                            px-4 py-3 rounded-lg">
                {user?.full_name}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="flex items-center gap-2 text-sm 
                               font-medium text-gray-600 mb-2">
              <Mail className="w-4 h-4" />
              Email Address
            </label>
            <p className="text-gray-500 bg-gray-50 px-4 py-3 
                          rounded-lg flex items-center gap-2">
              {user?.email}
              <span className="text-xs bg-gray-200 text-gray-500 
                               px-2 py-0.5 rounded-full">
                Cannot change
              </span>
            </p>
          </div>

          {/* Bio */}
          <div>
            <label className="flex items-center gap-2 text-sm 
                               font-medium text-gray-600 mb-2">
              <Edit2 className="w-4 h-4" />
              Bio
            </label>
            {editing ? (
              <textarea
                value={form.bio}
                onChange={(e) =>
                  setForm(p => ({ ...p, bio: e.target.value }))
                }
                placeholder="Tell us about yourself..."
                rows={3}
                className="input-field resize-none"
              />
            ) : (
              <p className="text-gray-900 bg-gray-50 px-4 py-3 
                            rounded-lg min-h-[60px]">
                {user?.bio || (
                  <span className="text-gray-400 italic">
                    No bio added yet
                  </span>
                )}
              </p>
            )}
          </div>

          {/* Auth Provider */}
          <div>
            <label className="flex items-center gap-2 text-sm 
                               font-medium text-gray-600 mb-2">
              <Shield className="w-4 h-4" />
              Login Method
            </label>
            <p className="text-gray-900 bg-gray-50 px-4 py-3 
                          rounded-lg capitalize flex items-center gap-2">
              {user?.auth_provider === "google" ? (
                <>
                  <img
                    src="https://www.google.com/favicon.ico"
                    alt="Google" className="w-4 h-4"
                  />
                  Google Account
                </>
              ) : (
                <>🔐 Email & Password</>
              )}
            </p>
          </div>

          {/* Member Since */}
          <div>
            <label className="flex items-center gap-2 text-sm 
                               font-medium text-gray-600 mb-2">
              <Calendar className="w-4 h-4" />
              Member Since
            </label>
            <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">
              {user?.created_at
                ? new Date(user.created_at).toLocaleDateString("en-IN", {
                    day: "numeric", month: "long", year: "numeric"
                  })
                : "—"
              }
            </p>
          </div>
        </div>

        {/* Edit Actions */}
        {editing && (
          <div className="flex gap-3 mt-6 pt-6 border-t border-gray-100">
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={handleCancel}
              className="btn-outline flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}