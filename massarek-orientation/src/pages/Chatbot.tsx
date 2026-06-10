import { useState, useEffect, useRef, useCallback } from "react";
import { Send, Bot, User, Sparkles, RefreshCw, AlertCircle, WifiOff, RotateCcw } from "lucide-react";
import { sendChatMessage, type ChatMessage } from "@/services/studentApi";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface DisplayMessage extends ChatMessage {
  id: string;
  isError?: boolean;
  isFallback?: boolean;
  canRetry?: boolean;
  originalInput?: string;  // saved so retry can replay the same text
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const INITIAL_MESSAGE: DisplayMessage = {
  id: "init",
  role: "assistant",
  content:
    "Bonjour ! Je suis **Massarek AI**, votre conseiller d'orientation. 🎓\n\nJe suis là pour vous aider à :\n- Choisir votre filière d'études\n- Explorer des carrières professionnelles\n- Découvrir des universités et programmes\n- Développer vos compétences\n\nComment puis-je vous aider aujourd'hui ?",
};

const DEBOUNCE_MS     = 500;   // minimum gap between sends
const HISTORY_STORAGE = "massarek_chat_history";
const MAX_STORED_MSGS = 40;    // localStorage cap

// ─────────────────────────────────────────────────────────────────────────────
// Session persistence helpers
// ─────────────────────────────────────────────────────────────────────────────

function loadHistory(): DisplayMessage[] {
  try {
    const raw = sessionStorage.getItem(HISTORY_STORAGE);
    if (!raw) return [INITIAL_MESSAGE];
    const parsed: DisplayMessage[] = JSON.parse(raw);
    return parsed.length > 0 ? parsed : [INITIAL_MESSAGE];
  } catch {
    return [INITIAL_MESSAGE];
  }
}

function saveHistory(msgs: DisplayMessage[]): void {
  try {
    // Only persist non-error messages to avoid persisting failure states
    const clean = msgs
      .filter((m) => !m.isError)
      .slice(-MAX_STORED_MSGS);
    sessionStorage.setItem(HISTORY_STORAGE, JSON.stringify(clean));
  } catch { /* storage full — ignore */ }
}

function genId(): string {
  return Math.random().toString(36).slice(2, 9);
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

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
              animation: `chatBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function MessageBubble({
  msg,
  onRetry,
}: {
  msg: DisplayMessage;
  onRetry?: (text: string) => void;
}) {
  const isUser = msg.role === "user";

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

  // ── Error message bubble ───────────────────────────────────────────────
  if (msg.isError) {
    return (
      <div className="flex gap-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1"
          style={{
            background: "rgba(239,68,68,0.10)",
            border: "1px solid rgba(239,68,68,0.20)",
          }}
        >
          {msg.content.includes("Network") || msg.content.includes("connection")
            ? <WifiOff size={14} style={{ color: "#EF4444" }} />
            : <AlertCircle size={14} style={{ color: "#EF4444" }} />}
        </div>
        <div
          className="flex-1 px-4 py-3 rounded-2xl rounded-bl-md text-sm leading-relaxed"
          style={{
            background: "rgba(239,68,68,0.06)",
            border: "1px solid rgba(239,68,68,0.18)",
          }}
        >
          <p style={{ color: "#EF4444" }} className="font-semibold text-xs mb-1">
            {msg.content.includes("quota") ? "Quota dépassé" : "Erreur de service"}
          </p>
          <p className="text-muted-foreground text-xs">{msg.content}</p>
          {msg.canRetry && msg.originalInput && onRetry && (
            <button
              onClick={() => onRetry(msg.originalInput!)}
              className="mt-2 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:opacity-90"
              style={{
                background: "rgba(239,68,68,0.10)",
                border: "1px solid rgba(239,68,68,0.25)",
                color: "#EF4444",
              }}
            >
              <RotateCcw size={11} /> Réessayer
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── Fallback (AI unavailable — softer styling) ─────────────────────────
  if (msg.isFallback) {
    return (
      <div className="flex gap-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1"
          style={{ background: "linear-gradient(135deg, #1E40AF, #0E7490)", opacity: 0.6 }}
        >
          <Bot size={15} className="text-white" />
        </div>
        <div
          className="max-w-[80%] px-4 py-3 rounded-2xl rounded-bl-md text-sm leading-relaxed"
          style={{
            background: "var(--ms-bg-card)",
            border: "1px solid rgba(245,158,11,0.25)",
          }}
        >
          <p className="text-[10px] font-bold mb-1.5" style={{ color: "#D97706" }}>
            ⚡ Service limité
          </p>
          {renderContent(msg.content)}
        </div>
      </div>
    );
  }

  // ── Normal message ─────────────────────────────────────────────────────
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
          style={{
            background: "var(--ms-accent-glow)",
            border: "1px solid var(--ms-border-subtle)",
          }}
        >
          <User size={15} style={{ color: "var(--ms-accent-cyan)" }} />
        </div>
      )}
    </div>
  );
}

const SUGGESTED_QUESTIONS = [
  "Quelles filières correspondent à un profil scientifique ?",
  "Comment choisir entre ingénierie et médecine ?",
  "Quelles universités recommandes-tu au Maroc ?",
  "Quelles compétences faut-il pour travailler en informatique ?",
];

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

const Chatbot = () => {
  const [messages, setMessages] = useState<DisplayMessage[]>(() => loadHistory());
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const bottomRef               = useRef<HTMLDivElement>(null);
  const inputRef                = useRef<HTMLInputElement>(null);
  const lastSentAt              = useRef<number>(0);
  const abortRef                = useRef<AbortController | null>(null);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Persist on change
  useEffect(() => {
    saveHistory(messages);
  }, [messages]);

  // Cleanup on unmount
  useEffect(() => {
    return () => { abortRef.current?.abort(); };
  }, []);

  // ── Core send function ──────────────────────────────────────────────────
  const send = useCallback(async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    // Debounce: prevent accidental double-sends
    const now = Date.now();
    if (now - lastSentAt.current < DEBOUNCE_MS) return;
    lastSentAt.current = now;

    // Build history from current messages (exclude initial greeting + error messages)
    const history: ChatMessage[] = messages
      .filter((m) => m.id !== "init" && !m.isError && !m.isFallback)
      .map(({ role, content }) => ({ role, content }));

    // Optimistically show the user message
    const userMsg: DisplayMessage = {
      id: genId(),
      role: "user",
      content,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    abortRef.current = new AbortController();

    try {
      const res = await sendChatMessage(content, history);
      const data = res.data;

      if (data.success) {
        // Normal response
        setMessages((prev) => [
          ...prev,
          { id: genId(), role: "assistant", content: data.message },
        ]);
      } else if (data.fallback) {
        // Service returned a structured fallback (503 with fallback body)
        setMessages((prev) => [
          ...prev,
          { id: genId(), role: "assistant", content: data.fallback, isFallback: true },
        ]);
      } else {
        // Service error with no fallback
        setMessages((prev) => [
          ...prev,
          {
            id: genId(),
            role: "assistant",
            content: data.message || "Service temporarily unavailable.",
            isError: true,
            canRetry: true,
            originalInput: content,
          },
        ]);
      }
    } catch (e: any) {
      if (e?.name === "AbortError") return;

      const status   = e?.response?.status;
      const resData  = e?.response?.data;

      // If backend sent a fallback despite error HTTP code, show it gracefully
      if (resData?.fallback) {
        setMessages((prev) => [
          ...prev,
          {
            id: genId(),
            role: "assistant",
            content: resData.fallback,
            isFallback: true,
          },
        ]);
        return;
      }

      const isQuota   = status === 429;
      const isNetwork = !e?.response;
      const errText =
        resData?.message ||
        (isNetwork ? "Erreur réseau. Vérifiez votre connexion." : null) ||
        (isQuota   ? "Quota IA dépassé. Réessayez dans quelques minutes." : null) ||
        e?.message  ||
        "Service temporairement indisponible.";

      setMessages((prev) => [
        ...prev,
        {
          id: genId(),
          role: "assistant",
          content: errText,
          isError: true,
          canRetry: !isQuota,    // no retry button on quota errors
          originalInput: content,
        },
      ]);
    } finally {
      setLoading(false);
      abortRef.current = null;
      inputRef.current?.focus();
    }
  }, [input, loading, messages]);

  const clearChat = () => {
    abortRef.current?.abort();
    setMessages([INITIAL_MESSAGE]);
    sessionStorage.removeItem(HISTORY_STORAGE);
    setLoading(false);
    setInput("");
  };

  // ── Render ──────────────────────────────────────────────────────────────
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
            style={{
              background: "linear-gradient(135deg, #1E40AF, #0E7490)",
              boxShadow: "0 4px 12px rgba(14,116,144,0.30)",
            }}
          >
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Massarek AI</h1>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Sparkles size={10} style={{ color: "var(--ms-accent-cyan)" }} />
              Conseiller d'orientation · Powered by Gemini
            </p>
          </div>
        </div>

        <button
          onClick={clearChat}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
          style={{
            background: "var(--ms-accent-glow)",
            border: "1px solid var(--ms-border-subtle)",
            color: "var(--ms-accent-sky)",
          }}
          title="Clear conversation"
        >
          <RefreshCw size={12} /> New chat
        </button>
      </div>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 pb-2">
        {messages.map((m) => (
          <MessageBubble
            key={m.id}
            msg={m}
            onRetry={(text) => {
              // Remove the error message, then re-send
              setMessages((prev) => prev.filter((x) => x.id !== m.id));
              send(text);
            }}
          />
        ))}

        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Suggested questions — shown only when conversation is at initial state */}
      {messages.length === 1 && !loading && (
        <div className="py-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {SUGGESTED_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => send(q)}
              className="text-left text-xs px-3 py-2.5 rounded-xl transition-all font-medium"
              style={{
                background: "var(--ms-bg-card)",
                border: "1px solid var(--ms-border-subtle)",
                color: "var(--ms-accent-sky)",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.borderColor = "var(--ms-border-glow)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.borderColor = "var(--ms-border-subtle)")
              }
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div
        className="mt-3 flex gap-2 p-3 rounded-2xl"
        style={{
          background: "var(--ms-bg-card)",
          border: "1px solid var(--ms-border-subtle)",
          backdropFilter: "blur(12px)",
        }}
      >
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
          placeholder="Posez votre question sur l'orientation…"
          disabled={loading}
          maxLength={1000}
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
          {loading
            ? <RefreshCw size={15} className="text-white animate-spin" />
            : <Send size={15} className="text-white" />}
        </button>
      </div>

      <p className="text-[10px] text-center mt-2 text-muted-foreground opacity-50">
        Massarek AI répond uniquement aux questions d'orientation scolaire et professionnelle.
      </p>

      <style>{`
        @keyframes chatBounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Chatbot;
