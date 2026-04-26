import ReactMarkdown from "react-markdown";
import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Send, Bot, User, FileText,
  Loader, AlertCircle, Plus
} from "lucide-react";
import { chatApi } from "../../services/chatApi";

export default function ChatPage() {
  const location                    = useLocation();
  const [messages,  setMessages]    = useState([]);
  const [input,     setInput]       = useState("");
  const [loading,   setLoading]     = useState(false);
  const [sessionId, setSessionId]   = useState(null);
  const [error,     setError]       = useState(null);
  const [loadingSession, setLoadingSession] = useState(false);
  const bottomRef                   = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load session if coming from history page
  useEffect(() => {
    const incomingSessionId = location.state?.sessionId;

    if (incomingSessionId) {
      setLoadingSession(true);
      setSessionId(incomingSessionId);

      chatApi.getSession(incomingSessionId)
        .then(res => {
          const session = res.data;
          // Convert DB messages to chat format
          const loadedMessages = session.messages.map(msg => ({
            role:    msg.role,
            content: msg.content,
            sources: msg.sources || []
          }));
          setMessages(loadedMessages);
        })
        .catch(() => setError("Failed to load chat session"))
        .finally(() => setLoadingSession(false));
    }
  }, [location.state]);

  const startNewChat = () => {
    setMessages([]);
    setSessionId(null);
    setError(null);
    setInput("");
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const question = input.trim();
    setInput("");
    setError(null);

    // Add user message immediately
    setMessages(prev => [...prev, {
      role:    "user",
      content: question,
      sources: []
    }]);

    setLoading(true);

    try {
      const res = await chatApi.sendQuery({
        question,
        session_id:     sessionId,
        include_shared: true
      });

      if (!sessionId) setSessionId(res.data.session_id);

      setMessages(prev => [...prev, {
        role:    "assistant",
        content: res.data.answer,
        sources: res.data.sources || []
      }]);

    } catch (err) {
      setError("Failed to get response. Please try again.");
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4
                      flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900
                         flex items-center gap-2">
            <Bot className="w-5 h-5 text-blue-600" />
            MedQuery AI Chat
            {sessionId && (
              <span className="text-xs bg-blue-100 text-blue-600
                               px-2 py-0.5 rounded-full font-normal">
                Session #{sessionId}
              </span>
            )}
          </h1>
          <p className="text-sm text-gray-400">
            Ask questions about your uploaded medical documents
          </p>
        </div>

        {/* New Chat Button */}
        {messages.length > 0 && (
          <button
            onClick={startNewChat}
            className="flex items-center gap-2 px-4 py-2 rounded-xl
                       text-sm border border-gray-200 text-gray-600
                       hover:bg-gray-50 hover:border-blue-300
                       hover:text-blue-600 transition-all"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </button>
        )}
      </div>

      {/* Loading session */}
      {loadingSession && (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-3 text-gray-500">
            <Loader className="w-5 h-5 animate-spin text-blue-500" />
            <span className="text-sm">Loading conversation...</span>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">

        {/* Welcome message — only when no messages */}
        {messages.length === 0 && !loadingSession && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center
                            bg-blue-100 p-4 rounded-2xl mb-4">
              <Bot className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Hello! I'm MedQuery AI
            </h2>
            <p className="text-gray-400 max-w-md mx-auto">
              Upload medical PDFs in the Documents section,
              then ask me anything about them.
              I'll cite my sources from your documents.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              {[
                "What are the symptoms of diabetes?",
                "Summarize this patient report",
                "What medications are mentioned?",
                "What are the treatment guidelines?"
              ].map(suggestion => (
                <button
                  key={suggestion}
                  onClick={() => setInput(suggestion)}
                  className="text-sm bg-white border border-gray-200
                             rounded-full px-4 py-2 text-gray-600
                             hover:border-blue-400 hover:text-blue-600
                             transition-all"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat messages */}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-3 ${
              msg.role === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            {/* Avatar */}
            <div className={`flex-shrink-0 w-9 h-9 rounded-full
                             flex items-center justify-center
              ${msg.role === "user"
                ? "bg-blue-600"
                : "bg-gray-100 border border-gray-200"
              }`}>
              {msg.role === "user"
                ? <User className="w-5 h-5 text-white" />
                : <Bot  className="w-5 h-5 text-blue-600" />
              }
            </div>

            {/* Message bubble */}
            <div className={`max-w-2xl flex flex-col gap-2
              ${msg.role === "user" ? "items-end" : "items-start"}`}>
              <div className={`px-5 py-4 rounded-2xl text-sm leading-relaxed
                ${msg.role === "user"
                  ? "bg-blue-600 text-white rounded-tr-none"
                  : "bg-white border border-gray-100 text-gray-800 rounded-tl-none shadow-sm"
                }`}>
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>

              {/* Source Citations */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="bg-blue-50 border border-blue-100
                                rounded-xl p-3 w-full">
                  <p className="text-xs font-semibold text-blue-700 mb-2
                                flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    Sources ({msg.sources.length})
                  </p>
                  <div className="space-y-2">
                    {msg.sources.map((source, i) => (
                      <div key={i}
                           className="bg-white rounded-lg p-2
                                      border border-blue-100">
                        <p className="text-xs font-medium text-blue-800">
                          📄 {source.filename} — Page {source.page}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {source.preview}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {loading && (
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-full bg-gray-100 border
                            border-gray-200 flex items-center justify-center">
              <Bot className="w-5 h-5 text-blue-600" />
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl
                            rounded-tl-none px-5 py-4 shadow-sm">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce
                                [animation-delay:0.1s]" />
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce
                                [animation-delay:0.2s]" />
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 text-red-500 text-sm
                          bg-red-50 px-4 py-3 rounded-xl">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-100 px-6 py-4">
        <div className="flex gap-3 items-end max-w-4xl mx-auto">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your medical documents..."
            rows={1}
            className="flex-1 resize-none input-field
                       max-h-32 overflow-y-auto py-3"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="btn-primary p-3 rounded-xl flex-shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-center text-xs text-gray-400 mt-2">
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}