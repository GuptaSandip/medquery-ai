import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MessageSquare, Trash2, Loader,
  Clock, ChevronRight, AlertCircle
} from "lucide-react";
import { chatApi } from "../../services/chatApi";
import Toast from "../../components/ui/Toast";

export default function HistoryPage() {
  const navigate           = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [clearing, setClearing] = useState(false);
  const [toast,    setToast]    = useState(null);

  const showToast = (message, type = "success") =>
    setToast({ message, type });

  const fetchHistory = () => {
    setLoading(true);
    chatApi.getHistory()
      .then(res => setSessions(res.data))
      .catch(() => showToast("Failed to load history", "error"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchHistory(); }, []);

  const handleClearAll = async () => {
    if (!confirm("Clear all chat history? This cannot be undone.")) return;
    setClearing(true);
    try {
      await chatApi.clearHistory();
      setSessions([]);
      showToast("Chat history cleared");
    } catch {
      showToast("Failed to clear history", "error");
    } finally {
      setClearing(false);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now   = new Date();
    const diff  = now - date;
    const days  = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7)  return `${days} days ago`;
    return date.toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric"
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 
                         flex items-center gap-2">
            <MessageSquare className="w-7 h-7 text-green-600" />
            Chat History
          </h1>
          <p className="text-gray-500 mt-1">
            All your previous conversations
          </p>
        </div>

        {sessions.length > 0 && (
          <button
            onClick={handleClearAll}
            disabled={clearing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl 
                       text-sm text-red-500 border border-red-200 
                       hover:bg-red-50 transition-all disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            {clearing ? "Clearing..." : "Clear All"}
          </button>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader className="w-8 h-8 text-green-500 animate-spin" />
        </div>
      ) : sessions.length === 0 ? (
        <div className="card text-center py-16">
          <MessageSquare className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No chat history yet</p>
          <p className="text-gray-400 text-sm mt-1">
            Start a conversation to see it here
          </p>
          <button
            onClick={() => navigate("/chat")}
            className="btn-primary mt-6 text-sm"
          >
            Start Chatting
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-gray-400 text-sm mb-4">
            {sessions.length} conversation{sessions.length !== 1 ? "s" : ""}
          </p>

          {sessions.map(session => (
            <div
              key={session.id}
            //   onClick={() => navigate("/chat")}
              onClick={() => navigate("/chat", { state: { sessionId: session.id } })}
              className="card hover:shadow-md transition-all cursor-pointer 
                         group flex items-center gap-4"
            >
              {/* Icon */}
              <div className="bg-green-100 p-3 rounded-xl flex-shrink-0 
                              group-hover:bg-green-200 transition-colors">
                <MessageSquare className="w-5 h-5 text-green-600" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {session.title}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1 
                                   text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    {formatDate(session.created_at)}
                  </span>
                  <span className="text-xs text-gray-400">
                    {session.messages?.length || 0} messages
                  </span>
                </div>
              </div>

              {/* Arrow */}
              <ChevronRight className="w-5 h-5 text-gray-300 
                                       group-hover:text-gray-500 
                                       transition-colors flex-shrink-0" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}