import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Send, MessageCircle, Phone, Sparkles } from "lucide-react";

const CHAT_STORAGE_KEY = "autobhaiya_chat_history";

function loadChats() {
  try {
    const raw = localStorage.getItem(CHAT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveChats(chats) {
  localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chats));
}

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

const CONTACTS = [
  {
    id: "auto-bhaiya-general",
    name: "Auto Bhaiya Support",
    avatar: "🛺",
    lastSeen: "online",
    isOnline: true,
    color: "from-emerald-500 to-teal-600",
  },
  {
    id: "auto-bhaiya-alerts",
    name: "Trip Alerts",
    avatar: "🔔",
    lastSeen: "online",
    isOnline: true,
    color: "from-amber-500 to-orange-600",
  },
  {
    id: "auto-bhaiya-payments",
    name: "Payment Help",
    avatar: "💳",
    lastSeen: "online",
    isOnline: true,
    color: "from-blue-500 to-indigo-600",
  },
];

const AUTO_REPLIES = [
  "Thanks for reaching out! I'll get back to you shortly.",
  "Sure bhaiya, let me check and confirm.",
  "Okay, noted! Will update you in a moment.",
  "Ha bhaiya, thik hai. Ek minute!",
  "Got it! I'll inform the driver.",
  "Ji bhaiya, kya seva karu?",
];

// ── Chat View ──────────────────────────────────────────────
function ActiveChatView({ contact, messages, onBack, onSend }) {
  const [input, setInput] = useState("");
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input.trim());
    setInput("");
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#e5ddd5] dark:bg-gray-950">
      {/* Header */}
      <div className="shrink-0 bg-emerald-700 px-4 py-3 flex items-center gap-3 shadow-md">
        <button onClick={onBack} className="text-white shrink-0 hover:opacity-80">
          <ArrowLeft size={22} />
        </button>
        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${contact.color} flex items-center justify-center text-lg shrink-0`}>
          {contact.avatar}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-white text-sm font-semibold truncate">{contact.name}</h3>
          <p className="text-white/70 text-[11px]">Online</p>
        </div>
      </div>

      {/* Bubbles */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4c8a8' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      >
        <div className="flex justify-center">
          <span className="bg-white/70 text-gray-600 text-[11px] font-medium px-3 py-1 rounded-lg shadow-sm">
            Today
          </span>
        </div>

        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${contact.color} flex items-center justify-center mb-3 text-2xl shadow-md`}>
              {contact.avatar}
            </div>
            <p className="text-gray-700 text-sm font-medium">
              Say hi to {contact.name}!
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Tap the input below to start chatting
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[78%] px-3 py-2 rounded-2xl shadow-sm text-sm ${
              msg.sender === "me" ? "bg-[#d9fdd3] rounded-br-md" : "bg-white rounded-bl-md"
            }`}>
              <p className="text-gray-800 leading-relaxed break-words">{msg.text}</p>
              <div className={`flex items-center justify-end gap-1 mt-1 ${msg.sender === "me" ? "text-gray-500" : "text-gray-400"}`}>
                <span className="text-[10px]">{formatTime(msg.time)}</span>
                {msg.sender === "me" && (
                  <span>
                    {msg.status === "delivered" ? (
                      <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor"><path d="M4 6l4 4 8-8" stroke="currentColor" strokeWidth="2" fill="none"/></svg>
                    ) : (
                      <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor"><path d="M2 6l4 4 8-8" stroke="currentColor" strokeWidth="2" fill="none"/></svg>
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 bg-[#f0f0f0] dark:bg-gray-900 px-3 py-3 pb-6">
        <div className="flex items-end gap-2">
          <div className="flex-1 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm flex items-end overflow-hidden">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleSend())}
              placeholder="Type a message..."
              className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-sm text-gray-800 dark:text-gray-200 placeholder:text-gray-400"
            />
            <button className="pr-3 text-gray-400 hover:text-gray-600">
              <Smile size={18} />
            </button>
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-all ${
              input.trim()
                ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-md"
                : "bg-gray-300 text-gray-500"
            }`}
          >
            <Send size={20} className={input.trim() ? "ml-0.5" : ""} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────
export default function ChatPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const prefillMessage = searchParams.get("message") || "";

  const [activeContact, setActiveContact] = useState(null);
  const [allChats, setAllChats] = useState(loadChats);

  // Auto-open the first contact and send prefill message
  useEffect(() => {
    if (prefillMessage && !activeContact) {
      const target = CONTACTS[0];
      setActiveContact(target);
      const contactChats = allChats[target.id] || [];
      const newMsg = { id: generateId(), text: prefillMessage, sender: "me", time: Date.now(), status: "sent" };
      const updated = { ...allChats, [target.id]: [...contactChats, newMsg] };
      setAllChats(updated);
      saveChats(updated);
    }
  }, [prefillMessage]);

  const getMessages = (contactId) => allChats[contactId] || [];

  const handleSend = (text) => {
    if (!activeContact) return;
    const newMsg = { id: generateId(), text, sender: "me", time: Date.now(), status: "sent" };
    const contactChats = allChats[activeContact.id] || [];
    const updated = { ...allChats, [activeContact.id]: [...contactChats, newMsg] };
    setAllChats(updated);
    saveChats(updated);

    // Simulate delivery
    setTimeout(() => {
      setAllChats((prev) => {
        const msgs = prev[activeContact.id] || [];
        return {
          ...prev,
          [activeContact.id]: msgs.map((m) => m.id === newMsg.id ? { ...m, status: "delivered" } : m),
        };
      });
    }, 800);

    // Auto-reply
    setTimeout(() => {
      const reply = {
        id: generateId(),
        text: AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)],
        sender: "them",
        time: Date.now(),
        status: "received",
      };
      setAllChats((prev) => ({
        ...prev,
        [activeContact.id]: [...(prev[activeContact.id] || []), reply],
      }));
    }, 2000);
  };

  const handleContactClick = (contact) => {
    setActiveContact(contact);
    navigate("/chat", { replace: true });
  };

  // Contact list view
  if (!activeContact) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 pb-24">
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3 px-4 py-3">
            <button onClick={() => navigate(-1)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
              <ArrowLeft size={22} className="text-gray-700 dark:text-gray-300" />
            </button>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">Auto Bhaiyas</h1>
          </div>
        </div>

        <div className="px-4 py-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Available Bhaiyas</p>
          {CONTACTS.map((contact) => {
            const msgs = getMessages(contact.id);
            const lastMsg = msgs[msgs.length - 1];
            return (
              <button
                key={contact.id}
                onClick={() => handleContactClick(contact)}
                className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
              >
                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${contact.color} flex items-center justify-center text-2xl shrink-0 shadow-sm`}>
                  {contact.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900 dark:text-white">{contact.name}</span>
                    {lastMsg && (
                      <span className="text-[10px] text-gray-400 shrink-0">{formatTime(lastMsg.time)}</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {lastMsg
                      ? lastMsg.sender === "me"
                        ? `You: ${lastMsg.text}`
                        : lastMsg.text
                      : "Tap to start chatting"}
                  </p>
                </div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
              </button>
            );
          })}
        </div>

        <div className="px-4 py-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Quick Actions</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleContactClick(CONTACTS[0])}
              className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30 flex flex-col items-center gap-2 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
            >
              <MessageCircle size={24} className="text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">New Message</span>
            </button>
            <button
              onClick={() => handleContactClick(CONTACTS[2])}
              className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 flex flex-col items-center gap-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
              <Phone size={24} className="text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">Call Support</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ActiveChatView
      contact={activeContact}
      messages={getMessages(activeContact.id)}
      onBack={() => setActiveContact(null)}
      onSend={handleSend}
    />
  );
}

function Smile({ size = 20, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...rest}>
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" y1="9" x2="9.01" y2="9" />
      <line x1="15" y1="9" x2="15.01" y2="9" />
    </svg>
  );
}
