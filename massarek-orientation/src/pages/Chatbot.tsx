import { useState, useEffect, useRef } from "react";
import { Send, Bot, User, Sparkles, RefreshCw, AlertCircle } from "lucide-react";
import { sendChatMessage, type ChatMessage } from "@/services/studentApi";

const INITIAL_MESSAGE: ChatMessage = {
  role: "assistant",
  content:
    "Bonjour ! Je suis **Massarek AI**, votre conseiller d'orientation. 🎓\n\nJe suis là pour vous aider à :\n- Choisir votre filière d'études\n- Explorer des carrières professionnelles\n- Découvrir des universités et programmes\n- Développer vos compétences\n\nComment puis-je vous aider aujourd'hui ?",
};

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

const SUGGESTED_QUESTIONS = [
  "Quelles filières correspondent à un profil scientifique ?",
  "Comment choisir entre ingénierie et médecine ?",
  "Quelles universités recommandes-tu au Maroc ?",
  "Quelles compétences faut-il pour travailler en informatique ?",
];

const Chatbot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
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
      const errMsg =
        e?.response?.data?.message ||
        "Service temporarily unavailable. Please try again.";
      setError(errMsg);
      // Remove the user message if it failed
      setMessages((prev) => prev.filter((m) => m !== userMsg));
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const clearChat = () => {
    setMessages([INITIAL_MESSAGE]);
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
          style={{ background: "var(--ms-accent-glow)", border: "1px solid var(--ms-border-subtle)", color: "var(--ms-accent-sky)" }}
          title="Clear conversation"
        >
          <RefreshCw size={12} /> New chat
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
          placeholder="Posez votre question sur l'orientation…"
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
        Massarek AI répond uniquement aux questions d'orientation scolaire et professionnelle.
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
