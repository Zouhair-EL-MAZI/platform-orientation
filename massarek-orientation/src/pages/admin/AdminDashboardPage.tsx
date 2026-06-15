import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/use-auth";
import {
  Users, FileQuestion, Briefcase, Sparkles,
  TrendingUp, ShieldCheck, CheckCircle2, UserCheck,
  ArrowUpRight, RefreshCw, AlertCircle,
} from "lucide-react";
import api from "@/lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────
interface DashboardData {
  stats: {
    total_students: number; total_admins: number;
    active_users: number; verified_users: number;
    total_tests: number; active_tests: number;
    total_submissions: number; total_recommendations: number;
    total_careers: number; total_categories: number;
    avg_match_score: number; avg_test_score: number;
  };
  trend: { date: string; count: number }[];
  recent_users: { id: number; name: string; email: string; status: string; verified: boolean; joined: string; joined_human: string }[];
  recent_submissions: { user_name: string; user_email: string; test_title: string; score: number; time: string }[];
  recent_recommendations: { user_name: string; user_email: string; career: string; match_score: number; time: string }[];
}

// ─── Sparkline SVG ────────────────────────────────────────────────────────────
function Sparkline({ data, color }: { data: number[]; color: string }) {
  if (!data.length || data.every((v) => v === 0)) {
    return <div className="h-8 flex items-center justify-center text-[10px]" style={{ color: "hsl(var(--muted-foreground))", opacity: 0.4 }}>no data</div>;
  }
  const max = Math.max(...data, 1);
  const W = 120; const H = 32;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - 2 - ((v / max) * (H - 4));
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-8">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={`0,${H} ${pts} ${W},${H}`} fill={color} fillOpacity="0.10" stroke="none" />
    </svg>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color, glow, linkTo }: {
  label: string; value: string | number; icon: React.ElementType;
  color: string; glow: string; linkTo?: string;
}) {
  const inner = (
    <div
      className="rounded-2xl p-4 flex items-center gap-3 transition-all hover:scale-[1.02] group"
      style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", backdropFilter: "blur(12px)" }}
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: glow }}>
        <Icon size={18} style={{ color }} />
      </div>
      <div className="min-w-0">
        <p className="text-xl font-bold tabular-nums leading-tight">{typeof value === "number" ? value.toLocaleString() : value}</p>
        <p className="text-[11px] font-medium truncate" style={{ color: "hsl(var(--muted-foreground))" }}>{label}</p>
      </div>
      {linkTo && <ArrowUpRight size={14} className="ml-auto flex-shrink-0 opacity-0 group-hover:opacity-60 transition-opacity" style={{ color }} />}
    </div>
  );
  return linkTo ? <Link to={linkTo}>{inner}</Link> : inner;
}

// ─── Section card wrapper ─────────────────────────────────────────────────────
function SectionCard({ title, icon: Icon, color = "var(--ms-accent-cyan)", linkTo, linkLabel, children }: {
  title: string; icon: React.ElementType; color?: string; linkTo?: string; linkLabel?: string; children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)", backdropFilter: "blur(12px)" }}>
      <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--ms-border-subtle)" }}>
        <h2 className="text-sm font-bold flex items-center gap-2">
          <Icon size={15} style={{ color }} />
          {title}
        </h2>
        {linkTo && (
          <Link to={linkTo} className="text-xs font-bold transition-opacity hover:opacity-70" style={{ color }}>
            {linkLabel ?? "View all"} 
          </Link>
        )}
      </div>
      {children}
    </div>
  );
}

// ─── Avatar initial ───────────────────────────────────────────────────────────
function Avatar({ name }: { name: string }) {
  return (
    <div
      className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
      style={{ background: "linear-gradient(135deg, #1D4ED8, #0E7490)" }}
    >
      {name?.charAt(0)?.toUpperCase() ?? "?"}
    </div>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const s = status?.toLowerCase();
  const style =
    s === "active"   ? { background: "rgba(52,211,153,0.10)", color: "#34D399",  border: "1px solid rgba(52,211,153,0.22)" } :
    s === "inactive" ? { background: "rgba(248,113,113,0.08)", color: "#F87171", border: "1px solid rgba(248,113,113,0.18)" } :
                       { background: "rgba(251,191,36,0.10)",  color: "#FBBF24", border: "1px solid rgba(251,191,36,0.22)" };
  return (
    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full capitalize" style={style}>{s}</span>
  );
}

// ─── Bar chart (inline SVG) ───────────────────────────────────────────────────
function TrendChart({ data, color }: { data: { date: string; count: number }[]; color: string }) {
  const counts = data.map((d) => d.count);
  const max    = Math.max(...counts, 1);
  // Show only every 3rd label to avoid crowding
  return (
    <div className="space-y-2 pt-1">
      <div className="flex items-end gap-[3px] h-20">
        {data.map((d, i) => {
          const pct = Math.max(4, (d.count / max) * 100);
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-0.5 group relative">
              {/* Tooltip */}
              <div
                className="absolute -top-6 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10"
                style={{ background: "var(--ms-bg-layer1)", border: "1px solid var(--ms-border-glow)", color }}
              >
                {d.count}
              </div>
              <div
                className="w-full rounded-t-sm transition-all"
                style={{ height: `${pct}%`, background: color, opacity: 0.5 + (i / data.length) * 0.5 }}
              />
            </div>
          );
        })}
      </div>
      <div className="flex justify-between text-[9px]" style={{ color: "hsl(var(--muted-foreground))" }}>
        <span>{data[0]?.date}</span>
        <span>{data[Math.floor(data.length / 2)]?.date}</span>
        <span>{data[data.length - 1]?.date}</span>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
const AdminDashboardPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [data, setData]       = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  const load = async () => {
    setLoading(true); setError("");
    try {
      const r = await api.get("/admin/dashboard");
      setData(r.data.data);
    } catch {
      setError("Failed to load dashboard data.");
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const s = data?.stats;

  const statCards = s ? [
    { label: t("admin.statTotalUsers", "Total Students"), value: s.total_students,        icon: Users,        color: "var(--ms-accent-cyan)", glow: "rgba(34,211,238,0.12)", linkTo: "/admin/users"    },
    { label: "Total Admins",                              value: s.total_admins,           icon: ShieldCheck,  color: "#A78BFA",               glow: "rgba(167,139,250,0.12)"                           },
    { label: "Active Users",                              value: s.active_users,           icon: UserCheck,    color: "#34D399",               glow: "rgba(52,211,153,0.12)",  linkTo: "/admin/users"    },
    { label: t("admin.statVerifiedUsers", "Verified"),    value: s.verified_users,         icon: CheckCircle2, color: "#38BDF8",               glow: "rgba(56,189,248,0.12)"                            },
    { label: t("admin.statActiveTests", "Tests"),         value: s.total_tests,            icon: FileQuestion, color: "var(--ms-accent-sky)",  glow: "rgba(14,165,233,0.12)",  linkTo: "/admin/tests"    },
    { label: t("admin.statSubmissions", "Submissions"),   value: s.total_submissions,      icon: TrendingUp,   color: "#F59E0B",               glow: "rgba(245,158,11,0.12)"                            },
    { label: t("admin.statCareerPaths", "Careers"),       value: s.total_careers,          icon: Briefcase,    color: "#8B5CF6",               glow: "rgba(139,92,246,0.12)",  linkTo: "/admin/careers"  },
    { label: t("admin.statRecommendations", "AI Recs"),   value: s.total_recommendations,  icon: Sparkles,     color: "#F97316",               glow: "rgba(249,115,22,0.12)",  linkTo: "/admin/recommendations" },
  ] : [];

  const quickLinks = [
    { icon: Users,        title: t("admin.manageUsers"),           to: "/admin/users",           primary: true  },
    { icon: FileQuestion, title: t("admin.manageTests"),           to: "/admin/tests",           primary: false },
    { icon: Briefcase,    title: t("admin.careersDb"),             to: "/admin/careers",         primary: false },
    { icon: Sparkles,     title: t("admin.recommendations.title"), to: "/admin/recommendations", primary: false },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">

      {/* Hero banner */}
      <div
        className="rounded-2xl p-5 md:p-7 relative overflow-hidden"
        style={{
          background: "linear-gradient(120deg, #1E3A8A 0%, #0E7490 55%, #1E40AF 100%)",
          border: "1px solid rgba(34,211,238,0.18)",
          boxShadow: "0 8px 40px rgba(14,116,144,0.25)",
        }}
      >
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-cyan-300 mb-1">Admin Panel</p>
            <h1 className="text-xl md:text-2xl font-bold text-white">
              {t("admin.welcomeAdmin", "Welcome")}, {user?.name ?? "Admin"} 👋
            </h1>
            <p className="text-sm text-blue-200/70 mt-0.5">{t("admin.welcomeSubtitle", "Platform overview and management")}</p>
          </div>
          <button
            onClick={load} disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-80 self-start sm:self-auto"
            style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.20)" }}
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            {loading ? "Loading…" : "Refresh"}
          </button>
        </div>
        <div className="absolute -right-12 -top-12 w-40 h-40 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #22D3EE, transparent)" }} />
        <div className="absolute -left-6 -bottom-6 w-28 h-28 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #A78BFA, transparent)" }} />
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold"
          style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.18)", color: "#F87171" }}>
          <AlertCircle size={15} /> {error}
        </div>
      )}

      {/* Stats grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="rounded-2xl h-[72px] animate-pulse" style={{ background: "var(--ms-bg-card)" }} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {statCards.map((c) => <StatCard key={c.label} {...c} />)}
        </div>
      )}

      {/* Avg scores strip */}
      {!loading && s && (
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Avg Match Score",  value: `${s.avg_match_score}%`, color: "#34D399" },
            { label: "Avg Test Score",   value: `${s.avg_test_score} pts`, color: "var(--ms-accent-sky)" },
          ].map((m) => (
            <div key={m.label} className="rounded-xl px-4 py-3 flex items-center justify-between"
              style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)" }}>
              <span className="text-xs font-medium" style={{ color: "hsl(var(--muted-foreground))" }}>{m.label}</span>
              <span className="text-sm font-bold tabular-nums" style={{ color: m.color }}>{m.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Trend chart + Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Trend summary */}
        <div className="lg:col-span-2 rounded-2xl p-5" style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)", backdropFilter: "blur(12px)" }}>
          <h2 className="text-sm font-bold mb-4 flex items-center gap-2">
            <TrendingUp size={14} style={{ color: "var(--ms-accent-cyan)" }} />
            Recent Activity Overview
          </h2>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 rounded-xl animate-pulse" style={{ background: "var(--ms-border-subtle)" }} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-2xl p-4" style={{ background: "var(--ms-bg-layer2)", border: "1px solid var(--ms-border-subtle)" }}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Total Submissions</p>
                <p className="text-3xl font-bold mt-3 tabular-nums">{s?.total_submissions ?? 0}</p>
                <p className="text-[11px] mt-2" style={{ color: "hsl(var(--muted-foreground))" }}>Last 14 days summary</p>
              </div>
              <div className="rounded-2xl p-4" style={{ background: "var(--ms-bg-layer2)", border: "1px solid var(--ms-border-subtle)" }}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Active Users</p>
                <p className="text-3xl font-bold mt-3 tabular-nums">{s?.active_users ?? 0}</p>
                <p className="text-[11px] mt-2" style={{ color: "hsl(var(--muted-foreground))" }}>Current platform activity</p>
              </div>
              <div className="rounded-2xl p-4" style={{ background: "var(--ms-bg-layer2)", border: "1px solid var(--ms-border-subtle)" }}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Average Score</p>
                <p className="text-3xl font-bold mt-3 tabular-nums">{s?.avg_test_score ?? 0}%</p>
                <p className="text-[11px] mt-2" style={{ color: "hsl(var(--muted-foreground))" }}>Average test performance</p>
              </div>
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="rounded-2xl p-5" style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)", backdropFilter: "blur(12px)" }}>
          <h2 className="text-sm font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-2.5">
            {quickLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="flex flex-col items-center gap-2 py-4 px-2 rounded-xl text-center text-xs font-semibold transition-all hover:scale-[1.03]"
                style={l.primary
                  ? { background: "linear-gradient(135deg,#1D4ED8,#0E7490)", color: "#fff", border: "1px solid rgba(34,211,238,0.22)", boxShadow: "0 4px 16px rgba(14,116,144,0.25)" }
                  : { background: "var(--ms-bg-layer2)", border: "1px solid var(--ms-border-subtle)", color: "var(--ms-accent-sky)" }
                }
              >
                <l.icon size={18} />
                <span>{l.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent activity — 3 sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Recent registrations */}
        <SectionCard
          title={t("admin.recentUsers", "Recent Registrations")}
          icon={Users}
          linkTo="/admin/users"
          linkLabel={t("admin.viewAll", "View all")}
        >
          {loading ? (
            <div className="p-4 space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full animate-pulse" style={{ background: "var(--ms-border-subtle)", flexShrink: 0 }} />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 rounded animate-pulse" style={{ background: "var(--ms-border-subtle)", width: "60%" }} />
                    <div className="h-2.5 rounded animate-pulse" style={{ background: "var(--ms-border-subtle)", width: "80%" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (data?.recent_users ?? []).length === 0 ? (
            <p className="px-5 py-8 text-center text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>No students yet.</p>
          ) : (
            <div className="divide-y" style={{ "--tw-divide-opacity": 1 } as any}>
              {(data?.recent_users ?? []).map((u, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3 hover:bg-[var(--ms-accent-glow)] transition-colors">
                  <Avatar name={u.name} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate">{u.name}</p>
                    <p className="text-[10px] truncate" style={{ color: "hsl(var(--muted-foreground))" }}>{u.email}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <StatusBadge status={u.status} />
                    <span className="text-[9px]" style={{ color: "hsl(var(--muted-foreground))" }}>{u.joined_human}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        {/* Recent test submissions */}
        <SectionCard
          title="Recent Test Submissions"
          icon={FileQuestion}
          color="var(--ms-accent-sky)"
          linkTo="/admin/tests"
          linkLabel={t("admin.viewAll", "View all")}
        >
          {loading ? (
            <div className="p-4 space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-10 rounded-xl animate-pulse" style={{ background: "var(--ms-border-subtle)" }} />
              ))}
            </div>
          ) : (data?.recent_submissions ?? []).length === 0 ? (
            <p className="px-5 py-8 text-center text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>No submissions yet.</p>
          ) : (
            <div className="divide-y" style={{ "--tw-divide-opacity": 1 } as any}>
              {(data?.recent_submissions ?? []).map((s, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3 hover:bg-[var(--ms-accent-glow)] transition-colors">
                  <Avatar name={s.user_name} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate">{s.user_name}</p>
                    <p className="text-[10px] truncate" style={{ color: "hsl(var(--muted-foreground))" }}>{s.test_title}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="text-xs font-bold tabular-nums" style={{ color: "var(--ms-accent-sky)" }}>{s.score} pts</span>
                    <span className="text-[9px]" style={{ color: "hsl(var(--muted-foreground))" }}>{s.time}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        {/* Recent AI recommendations */}
        <SectionCard
          title="Recent AI Recommendations"
          icon={Sparkles}
          color="#A78BFA"
          linkTo="/admin/recommendations"
          linkLabel={t("admin.viewAll", "View all")}
        >
          {loading ? (
            <div className="p-4 space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-10 rounded-xl animate-pulse" style={{ background: "var(--ms-border-subtle)" }} />
              ))}
            </div>
          ) : (data?.recent_recommendations ?? []).length === 0 ? (
            <p className="px-5 py-8 text-center text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>No recommendations yet.</p>
          ) : (
            <div className="divide-y" style={{ "--tw-divide-opacity": 1 } as any}>
              {(data?.recent_recommendations ?? []).map((r, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3 hover:bg-[var(--ms-accent-glow)] transition-colors">
                  <Avatar name={r.user_name} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate">{r.user_name}</p>
                    <p className="text-[10px] truncate" style={{ color: "hsl(var(--muted-foreground))" }}>{r.career}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="text-xs font-bold tabular-nums" style={{ color: "#A78BFA" }}>{r.match_score}%</span>
                    <span className="text-[9px]" style={{ color: "hsl(var(--muted-foreground))" }}>{r.time}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
