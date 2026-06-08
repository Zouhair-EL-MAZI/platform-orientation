import { Link } from "react-router-dom";
import {
  Users, FileQuestion, Briefcase, TrendingUp, Sparkles,
  Activity, ArrowUpRight, Clock, CheckCircle, AlertCircle, UserPlus,
} from "lucide-react";
const stats = [
  {
    label: "Total Users",
    value: "1,284",
    change: "+12%",
    changeUp: true,
    icon: Users,
    color: "var(--ms-accent-cyan)",
    glow: "rgba(34,211,238,0.15)",
  },
  {
    label: "Tests Taken",
    value: "3,542",
    change: "+8%",
    changeUp: true,
    icon: FileQuestion,
    color: "var(--ms-accent-sky)",
    glow: "rgba(14,165,233,0.15)",
  },
  {
    label: "Careers Explored",
    value: "856",
    change: "+15%",
    changeUp: true,
    icon: Briefcase,
    color: "#A78BFA",
    glow: "rgba(167,139,250,0.15)",
  },
  {
    label: "Avg. Match Score",
    value: "84%",
    change: "+3%",
    changeUp: true,
    icon: TrendingUp,
    color: "#34D399",
    glow: "rgba(52,211,153,0.15)",
  },
];

const recentUsers = [
  { name: "Ahmed B.", email: "ahmed@example.com", tests: 3, status: "Active", joined: "2h ago" },
  { name: "Sara M.", email: "sara@example.com", tests: 5, status: "Active", joined: "5h ago" },
  { name: "Youssef K.", email: "youssef@example.com", tests: 1, status: "Inactive", joined: "1d ago" },
  { name: "Fatima Z.", email: "fatima@example.com", tests: 4, status: "Active", joined: "2d ago" },
  { name: "Omar H.", email: "omar@example.com", tests: 2, status: "Active", joined: "3d ago" },
];

const recentActivity = [
  { icon: UserPlus, text: "New user registered: Karim A.", time: "2 min ago", type: "success" },
  { icon: CheckCircle, text: "Test completed by Sara M.", time: "18 min ago", type: "info" },
  { icon: Sparkles, text: "Recommendations generated for 12 users", time: "1h ago", type: "accent" },
  { icon: AlertCircle, text: "Failed login attempt detected", time: "2h ago", type: "warning" },
  { icon: Activity, text: "System health check passed", time: "3h ago", type: "success" },
];

const quickLinks = [
  { icon: Users, title: "Manage Users", desc: "View and edit all users", to: "/admin/users", primary: true },
  { icon: FileQuestion, title: "Manage Tests", desc: "Edit orientation tests", to: "/admin/tests", primary: false },
  { icon: Briefcase, title: "Careers DB", desc: "Update career paths", to: "/admin/careers", primary: false },
  { icon: Sparkles, title: "Recommendations", desc: "Review the latest student matches", to: "/admin/recommendations", primary: false },
];

const AdminDashboardPage = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">

      {/* Header Banner */}
      <div
        className="rounded-2xl p-6 md:p-8 relative overflow-hidden"
        style={{
          background: "linear-gradient(120deg, #1E3A8A 0%, #0E7490 50%, #1E40AF 100%)",
          border: "1px solid rgba(34,211,238,0.20)",
          boxShadow: "0 8px 40px rgba(14,116,144,0.28), inset 0 1px 0 rgba(255,255,255,0.10)",
        }}
      >
        <div
          className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(34,211,238,0.18), transparent 70%)",
            transform: "translate(30%, -40%)",
          }}
        />
        <div
          className="absolute bottom-0 left-1/4 w-48 h-48 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(37,99,235,0.25), transparent 70%)",
            transform: "translateY(40%)",
          }}
        />
        <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
          <div>
            <div
              className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] px-2.5 py-1 rounded-full mb-3"
              style={{
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.20)",
                color: "rgba(255,255,255,0.85)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#22D3EE] pulse-dot" />
              Admin Control Panel
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2 text-white">
              Welcome, Administrator 🛡️
            </h1>
            <p className="text-white/65 font-sans text-sm">
              Monitor platform activity, manage users and content, and review analytics.
            </p>
          </div>
          <div
            className="hidden md:flex flex-col items-end gap-1"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            <span className="text-xs font-mono-ts">Last updated</span>
            <span className="text-sm font-bold text-white/80">Just now</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl p-5 relative overflow-hidden card-top-glow group"
            style={{
              background: "var(--ms-bg-card)",
              border: "1px solid var(--ms-border-subtle)",
              backdropFilter: "blur(12px)",
              transition: "all 0.25s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--ms-border-glow)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--ms-border-subtle)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
              style={{ background: `linear-gradient(90deg, transparent, ${s.color}, transparent)` }}
            />
            <div className="flex items-center justify-between mb-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: s.glow, border: `1px solid ${s.color}22` }}
              >
                <s.icon size={18} style={{ color: s.color }} />
              </div>
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1"
                style={{
                  background: s.changeUp ? "rgba(52,211,153,0.10)" : "rgba(248,113,113,0.10)",
                  color: s.changeUp ? "#34D399" : "#F87171",
                  border: `1px solid ${s.changeUp ? "rgba(52,211,153,0.20)" : "rgba(248,113,113,0.20)"}`,
                }}
              >
                <ArrowUpRight size={10} />
                {s.change}
              </span>
            </div>
            <div className="text-2xl font-bold mb-0.5">{s.value}</div>
            <div className="text-xs font-medium" style={{ color: "var(--ms-accent-cyan)", opacity: 0.65 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickLinks.map((a) => (
          <Link
            key={a.title}
            to={a.to}
            className="rounded-2xl p-5 transition-all duration-250 group relative overflow-hidden"
            style={
              a.primary
                ? {
                    background: "linear-gradient(135deg, #1E40AF, #0E7490)",
                    border: "1px solid rgba(34,211,238,0.30)",
                    boxShadow: "0 8px 24px rgba(14,116,144,0.25)",
                  }
                : {
                    background: "var(--ms-bg-card)",
                    border: "1px solid var(--ms-border-subtle)",
                    backdropFilter: "blur(12px)",
                  }
            }
            onMouseEnter={(e) => {
              if (!a.primary) {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--ms-border-glow)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              } else {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 12px 40px rgba(14,116,144,0.40)";
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "";
              if (!a.primary)
                (e.currentTarget as HTMLElement).style.borderColor = "var(--ms-border-subtle)";
              else
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 8px 24px rgba(14,116,144,0.25)";
            }}
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
              style={
                a.primary
                  ? { background: "rgba(255,255,255,0.18)" }
                  : {
                      background: "var(--ms-accent-glow)",
                      border: "1px solid var(--ms-border-subtle)",
                    }
              }
            >
              <a.icon
                size={18}
                style={{ color: a.primary ? "#fff" : "var(--ms-accent-cyan)" }}
                className="group-hover:scale-110 transition-transform"
              />
            </div>
            <div className="font-bold text-sm" style={{ color: a.primary ? "#fff" : undefined }}>
              {a.title}
            </div>
            <div
              className="text-xs mt-0.5"
              style={{
                color: a.primary ? "rgba(255,255,255,0.65)" : undefined,
                opacity: a.primary ? 1 : 0.7,
              }}
            >
              {a.desc}
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom Grid: Users + Activity */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Users */}
        <div
          className="lg:col-span-2 rounded-2xl relative overflow-hidden card-top-glow"
          style={{
            background: "var(--ms-bg-card)",
            border: "1px solid var(--ms-border-subtle)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div
            className="px-6 py-4 flex items-center justify-between"
            style={{ borderBottom: "1px solid var(--ms-border-subtle)" }}
          >
            <h2 className="font-bold flex items-center gap-2 text-base">
              <Users size={16} style={{ color: "var(--ms-accent-cyan)" }} />
              Recent Users
            </h2>
            <Link
              to="/admin/users"
              className="text-xs font-bold transition-all hover:opacity-80"
              style={{ color: "var(--ms-accent-sky)" }}
            >
              View all →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--ms-border-subtle)" }}>
                  {["Name", "Email", "Tests", "Status", "Joined"].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider"
                      style={{ color: "var(--ms-accent-cyan)", opacity: 0.65 }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((u) => (
                  <tr
                    key={u.email}
                    className="activity-hover"
                    style={{ borderBottom: "1px solid var(--ms-border-subtle)" }}
                  >
                    <td className="px-6 py-3 font-semibold text-sm">{u.name}</td>
                    <td className="px-6 py-3 text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                      {u.email}
                    </td>
                    <td className="px-6 py-3 font-bold text-sm" style={{ color: "var(--ms-accent-sky)" }}>
                      {u.tests}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className="text-xs font-bold px-2.5 py-1 rounded-full"
                        style={
                          u.status === "Active"
                            ? {
                                background: "rgba(52,211,153,0.10)",
                                color: "#34D399",
                                border: "1px solid rgba(52,211,153,0.20)",
                              }
                            : {
                                background: "var(--ms-bg-layer3)",
                                color: "hsl(var(--muted-foreground))",
                                border: "1px solid var(--ms-border-subtle)",
                              }
                        }
                      >
                        {u.status}
                      </span>
                    </td>
                    <td
                      className="px-6 py-3 text-xs font-mono-ts"
                      style={{ color: "var(--ms-accent-cyan)", opacity: 0.5 }}
                    >
                      {u.joined}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div
          className="lg:col-span-1 rounded-2xl p-6 relative overflow-hidden card-top-glow"
          style={{
            background: "var(--ms-bg-card)",
            border: "1px solid var(--ms-border-subtle)",
            backdropFilter: "blur(12px)",
          }}
        >
          <h2 className="font-bold mb-5 flex items-center gap-2 text-base">
            <Clock size={16} style={{ color: "var(--ms-accent-cyan)" }} />
            Activity Feed
          </h2>
          <div className="space-y-0">
            {recentActivity.map((a, i) => (
              <div
                key={i}
                className="flex items-start gap-3 py-3 activity-hover"
                style={{
                  borderBottom:
                    i < recentActivity.length - 1 ? "1px solid var(--ms-border-subtle)" : "none",
                }}
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={
                    a.type === "success"
                      ? {
                          background: "rgba(52,211,153,0.10)",
                          border: "1px solid rgba(52,211,153,0.20)",
                          color: "#34D399",
                        }
                      : a.type === "warning"
                      ? {
                          background: "rgba(251,191,36,0.10)",
                          border: "1px solid rgba(251,191,36,0.20)",
                          color: "#FBBF24",
                        }
                      : a.type === "accent"
                      ? {
                          background: "rgba(34,211,238,0.10)",
                          border: "1px solid rgba(34,211,238,0.20)",
                          color: "var(--ms-accent-cyan)",
                        }
                      : {
                          background: "rgba(56,189,248,0.10)",
                          border: "1px solid rgba(56,189,248,0.20)",
                          color: "var(--ms-accent-sky)",
                        }
                  }
                >
                  <a.icon size={13} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium leading-relaxed">{a.text}</p>
                  <span
                    className="text-[10px] font-mono-ts"
                    style={{ color: "var(--ms-accent-cyan)", opacity: 0.5 }}
                  >
                    {a.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
