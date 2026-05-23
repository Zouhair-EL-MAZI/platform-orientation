import { Link } from "react-router-dom";
import { Sparkles, FileQuestion, Briefcase, MessageSquare, TrendingUp, BookOpen, Clock, CheckCircle } from "lucide-react";

const quickActions = [
  { icon: FileQuestion, title: "Take Test", desc: "Start orientation test", to: "/test", primary: true },
  { icon: Sparkles, title: "AI Results", desc: "View recommendations", to: "/recommendations", primary: false },
  { icon: Briefcase, title: "Careers", desc: "Explore career paths", to: "/careers", primary: false },
  { icon: MessageSquare, title: "Chatbot", desc: "Ask AI assistant", to: "/chatbot", primary: false },
];

const recommendations = [
  { field: "Computer Science", match: 92, trend: "High demand" },
  { field: "Data Science", match: 87, trend: "Growing" },
  { field: "UX Design", match: 78, trend: "Emerging" },
];

const Dashboard = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">

      {/* Welcome Banner */}
      <div
        className="rounded-2xl p-6 md:p-8 relative overflow-hidden"
        style={{
          background: "linear-gradient(120deg, #1E3A8A 0%, #0E7490 50%, #1E40AF 100%)",
          border: "1px solid rgba(34,211,238,0.20)",
          boxShadow: "0 8px 40px rgba(14,116,144,0.28), inset 0 1px 0 rgba(255,255,255,0.10)",
        }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(34,211,238,0.18), transparent 70%)", transform: "translate(30%, -40%)" }} />
        <div className="absolute bottom-0 left-1/4 w-48 h-48 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(37,99,235,0.25), transparent 70%)", transform: "translateY(40%)" }} />
        <div className="relative z-10">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 text-white">Welcome back, Student! 👋</h1>
          <p className="text-white/65 font-sans">Continue your orientation journey and discover the perfect path for your future.</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((a) => (
          <Link
            key={a.title}
            to={a.to}
            className="rounded-2xl p-5 transition-all duration-250 group relative overflow-hidden"
            style={a.primary ? {
              background: "linear-gradient(135deg, #1E40AF, #0E7490)",
              border: "1px solid rgba(34,211,238,0.30)",
              boxShadow: "0 8px 24px rgba(14,116,144,0.25)",
            } : {
              background: "var(--ms-bg-card)",
              border: "1px solid var(--ms-border-subtle)",
              backdropFilter: "blur(12px)",
            }}
            onMouseEnter={e => {
              if (!a.primary) {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--ms-border-glow)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              } else {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 40px rgba(14,116,144,0.40)";
              }
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.transform = "";
              if (!a.primary) (e.currentTarget as HTMLElement).style.borderColor = "var(--ms-border-subtle)";
              else (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(14,116,144,0.25)";
            }}
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
              style={a.primary
                ? { background: "rgba(255,255,255,0.18)" }
                : { background: "var(--ms-accent-glow)", border: "1px solid var(--ms-border-subtle)" }
              }
            >
              <a.icon size={18} style={{ color: a.primary ? "#fff" : "var(--ms-accent-cyan)" }} className="group-hover:scale-110 transition-transform" />
            </div>
            <div className="font-bold text-sm" style={{ color: a.primary ? "#fff" : undefined }}>{a.title}</div>
            <div className="text-xs mt-0.5" style={{ color: a.primary ? "rgba(255,255,255,0.65)" : undefined, opacity: a.primary ? 1 : 0.7 }}>{a.desc}</div>
          </Link>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Progress */}
        <div
          className="lg:col-span-1 rounded-2xl p-6 relative overflow-hidden card-top-glow"
          style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)", backdropFilter: "blur(12px)" }}
        >
          <h2 className="font-bold mb-5 flex items-center gap-2 text-base">
            <TrendingUp size={18} style={{ color: "var(--ms-accent-cyan)" }} />
            Your Progress
          </h2>
          <div className="space-y-5">
            {[
              { label: "Profile completion", val: "75%", pct: 75 },
              { label: "Tests completed", val: "2/5", pct: 40 },
              { label: "Career exploration", val: "60%", pct: 60 },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground font-medium">{item.label}</span>
                  <span className="font-bold">{item.val}</span>
                </div>
                <div
                  className="h-[6px] rounded-full overflow-hidden"
                  style={{ background: "var(--ms-bg-layer3)", border: "1px solid var(--ms-border-subtle)" }}
                >
                  <div
                    className="h-full progress-fill-glow"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendations */}
        <div
          className="lg:col-span-2 rounded-2xl p-6 relative overflow-hidden card-top-glow"
          style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)", backdropFilter: "blur(12px)" }}
        >
          <h2 className="font-bold mb-5 flex items-center gap-2 text-base">
            <Sparkles size={18} style={{ color: "var(--ms-accent-cyan)" }} />
            AI Recommendations
          </h2>
          <div className="space-y-3">
            {recommendations.map((r) => (
              <div
                key={r.field}
                className="flex items-center gap-4 p-3 rounded-xl rec-item-hover cursor-pointer"
                style={{
                  background: "rgba(37,99,235,0.06)",
                  border: "1px solid var(--ms-border-subtle)",
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center font-extrabold text-sm flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #1E3A8A, #0E7490)",
                    border: "1px solid rgba(34,211,238,0.22)",
                    boxShadow: "0 0 12px rgba(14,116,144,0.20)",
                    color: "var(--ms-accent-sky)",
                  }}
                >
                  {r.match}%
                </div>
                <div className="flex-1">
                  <div className="font-bold text-sm">{r.field}</div>
                  <span
                    className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1"
                    style={{
                      background: "var(--ms-accent-glow)",
                      border: "1px solid var(--ms-border-glow)",
                      color: "var(--ms-accent-sky)",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {r.trend}
                  </span>
                </div>
                <Link
                  to="/recommendations"
                  className="text-sm font-bold transition-all duration-200"
                  style={{ color: "var(--ms-accent-cyan)" }}
                >
                  →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div
        className="rounded-2xl p-6 relative overflow-hidden card-top-glow"
        style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)", backdropFilter: "blur(12px)" }}
      >
        <h2 className="font-bold mb-5 flex items-center gap-2 text-base">
          <Clock size={18} style={{ color: "var(--ms-accent-cyan)" }} />
          Recent Activity
        </h2>
        <div>
          {[
            { icon: CheckCircle, text: "Completed Personality Test", time: "2 hours ago", type: "success" },
            { icon: BookOpen, text: "Explored Computer Science career path", time: "Yesterday", type: "info" },
            { icon: Sparkles, text: "New AI recommendations available", time: "2 days ago", type: "accent" },
          ].map((a, i) => (
            <div
              key={i}
              className="flex items-center gap-3 py-3 activity-hover"
              style={{ borderBottom: i < 2 ? "1px solid var(--ms-border-subtle)" : "none" }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={
                  a.type === "success"
                    ? { background: "rgba(16,185,129,0.10)", border: "1px solid rgba(16,185,129,0.20)", color: "#10B981" }
                    : a.type === "info"
                    ? { background: "rgba(56,189,248,0.10)", border: "1px solid rgba(56,189,248,0.20)", color: "var(--ms-accent-sky)" }
                    : { background: "rgba(34,211,238,0.10)", border: "1px solid rgba(34,211,238,0.20)", color: "var(--ms-accent-cyan)" }
                }
              >
                <a.icon size={14} />
              </div>
              <span className="flex-1 text-sm font-medium">{a.text}</span>
              <span className="text-xs font-mono-ts" style={{ color: "var(--ms-accent-cyan)", opacity: 0.5 }}>{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
