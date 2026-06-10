import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Send, Bot, User, Sparkles, RefreshCw, AlertCircle } from "lucide-react";
import { sendChatMessage, type ChatMessage } from "@/services/studentApi";

// initial message moved into component to allow translations

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: "linear-gradient(135deg, #1E40AF, #0E7490)" }}
      >
        <Bot size={15} className="text-white" />
      </div>
      <div
        className="px-4 py-3 rounded-2xl rounded-bl-md flex items-center gap-1"
        style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)" }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full"
            style={{
              background: "var(--ms-accent-cyan)",
              animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === "user";

  // Simple markdown-like bold rendering
  const renderContent = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*|-\s.+)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith("- ")) {
        return (
          <span key={i} className="block ml-2">
            • {part.slice(2)}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : ""}`}>
      {!isUser && (
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1"
          style={{ background: "linear-gradient(135deg, #1E40AF, #0E7490)" }}
        >
          <Bot size={15} className="text-white" />
        </div>
      )}

      <div
        className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          isUser ? "rounded-br-md" : "rounded-bl-md"
        }`}
        style={
          isUser
            ? {
                background: "linear-gradient(135deg, #1E40AF, #0E7490)",
                color: "#fff",
                boxShadow: "0 4px 12px rgba(14,116,144,0.25)",
              }
            : {
                background: "var(--ms-bg-card)",
                border: "1px solid var(--ms-border-subtle)",
                backdropFilter: "blur(8px)",
              }
        }
      >
        {renderContent(msg.content)}
      </div>

      {isUser && (
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1"
          style={{ background: "var(--ms-accent-glow)", border: "1px solid var(--ms-border-subtle)" }}
        >
          <User size={15} style={{ color: "var(--ms-accent-cyan)" }} />
        </div>
      )}
    </div>
  );
}

// suggested questions moved into component for translations

const Chatbot = () => {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    { role: "assistant", content: t("chatbot.initialMessage") },
  ]);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    // language detection heuristic for first user message
    const detectLanguage = (s: string) => {
      try {
        if (/\p{Script=Arabic}/u.test(s)) return "ar";
      } catch (err) {
        // fallback if JS engine doesn't support Unicode property escapes
        if (/[\u0600-\u06FF]/.test(s)) return "ar";
      }
      if (/\b(bonjour|je|merci|quel|quelle|vous)\b|[éàèùâêîôûçœ]/i.test(s)) return "fr";
      return "en";
    };

    // If this is the first user message, detect language and switch translations
    try {
      if (messages.length === 1) {
        const lang = detectLanguage(content);
        if (lang && lang !== i18n.language) {
          await i18n.changeLanguage(lang);
          // update the initial assistant message to the newly selected language
          setMessages((prev) => [
            { role: "assistant", content: t("chatbot.initialMessage") },
            ...prev.slice(1),
          ]);
        }
      }
    } catch (err) {
      // ignore language switch errors and proceed
    }

    const userMsg: ChatMessage = { role: "user", content };
    const history = messages.slice(1); // exclude initial greeting from history

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await sendChatMessage(content, history);
      const assistantMsg: ChatMessage = {
        role: "assistant",
        content: res.data.message,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (e: any) {
      const errMsg = e?.response?.data?.message || t("chatbot.serviceUnavailable");
      setError(errMsg);
      // Remove the user message if it failed
      setMessages((prev) => prev.filter((m) => m !== userMsg));
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const clearChat = () => {
    setMessages([{ role: "assistant", content: t("chatbot.initialMessage") }]);
    setError(null);
  };

  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-9rem)] flex flex-col animate-fade-in">
      {/* Header */}
      <div
        className="flex items-center justify-between mb-4 pb-4"
        style={{ borderBottom: "1px solid var(--ms-border-subtle)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #1E40AF, #0E7490)", boxShadow: "0 4px 12px rgba(14,116,144,0.30)" }}
          >
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold">{t("chatbot.title")}</h1>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Sparkles size={10} style={{ color: "var(--ms-accent-cyan)" }} />
              {t("chatbot.subtitle")}
            </p>
          </div>
        </div>

        <button
          onClick={clearChat}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
          style={{ background: "var(--ms-accent-glow)", border: "1px solid var(--ms-border-subtle)", color: "var(--ms-accent-sky)" }}
          title={t("chatbot.clearTitle")}
        >
          <RefreshCw size={12} /> {t("chatbot.newChat")}
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 pb-2">
        {messages.map((m, i) => (
          <MessageBubble key={i} msg={m} />
        ))}

        {loading && <TypingIndicator />}

        {error && (
          <div
            className="flex items-start gap-2 p-3 rounded-xl text-sm"
            style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#EF4444" }}
          >
            <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Suggested Questions (shown only at start) */}
      {messages.length === 1 && (
        <div className="py-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {(t("chatbot.suggestedQuestions", { returnObjects: true }) as string[]).map((q) => (
            <button
              key={q}
              onClick={() => send(q)}
              className="text-left text-xs px-3 py-2.5 rounded-xl transition-all font-medium"
              style={{
                background: "var(--ms-bg-card)",
                border: "1px solid var(--ms-border-subtle)",
                color: "var(--ms-accent-sky)",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--ms-border-glow)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--ms-border-subtle)")}
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
        <div
        className="mt-3 flex gap-2 p-3 rounded-2xl"
        style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)", backdropFilter: "blur(12px)" }}
      >
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
            placeholder={t("chatbot.inputPlaceholder")}
          disabled={loading}
          className="flex-1 bg-transparent text-sm focus:outline-none disabled:opacity-60"
          style={{
            color: "inherit",
            border: "none",
            boxShadow: "none",
            outline: "none",
            WebkitAppearance: "none",
            MozAppearance: "none",
          }}
        />
        <button
          onClick={() => send()}
          disabled={!input.trim() || loading}
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: "linear-gradient(135deg, #1E40AF, #0E7490)",
            boxShadow: "0 2px 8px rgba(14,116,144,0.30)",
          }}
        >
          {loading ? (
            <RefreshCw size={15} className="text-white animate-spin" />
          ) : (
            <Send size={15} className="text-white" />
          )}
        </button>
      </div>

      <p className="text-[10px] text-center mt-2 text-muted-foreground opacity-50">
        {t("chatbot.note")}
      </p>

      {/* Bounce animation */}
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Chatbot;
