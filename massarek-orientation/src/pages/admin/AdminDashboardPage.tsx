import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Users, FileQuestion, Briefcase, TrendingUp, Sparkles,
  Activity, ArrowUpRight, CheckCircle, UserCheck, Clock,
  BarChart2,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import api from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";

// ── Types ─────────────────────────────────────────────────────────────────────
interface DashboardStats {
  total_users: number;
  total_verified_users: number;
  total_submissions: number;
  total_tests: number;
  total_recommendations: number;
  total_careers: number;
  total_categories: number;
  avg_match_score: number;
}

interface RecentUser {
  id: number; name: string; email: string; role: string;
  tests: number; status: string; verified: boolean;
  joined: string; lastActive: string;
}

interface DashboardData {
  stats: DashboardStats;
  recent_users: RecentUser[];
}

// ── Custom Tooltip ────────────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl px-3 py-2 text-xs shadow-xl"
      style={{
        background: "var(--ms-bg-card)",
        border: "1px solid var(--ms-border-glow)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="font-bold mb-1" style={{ color: "var(--ms-accent-sky)" }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span style={{ color: "hsl(var(--muted-foreground))" }}>{p.name}:</span>
          <span className="font-bold">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

// ── Skeleton ──────────────────────────────────────────────────────────────────
const StatSkeleton = () => (
  <div
    className="rounded-2xl p-5 animate-pulse"
    style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)" }}
  >
    <div className="flex items-center justify-between mb-4">
      <div className="w-9 h-9 rounded-lg" style={{ background: "var(--ms-bg-layer3)" }} />
      <div className="w-4 h-4 rounded" style={{ background: "var(--ms-bg-layer3)" }} />
    </div>
    <div className="h-7 w-16 rounded mb-1" style={{ background: "var(--ms-bg-layer3)" }} />
    <div className="h-3 w-24 rounded" style={{ background: "var(--ms-bg-layer3)" }} />
  </div>
);

// ── Main ──────────────────────────────────────────────────────────────────────
const AdminDashboardPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/dashboard")
      .then((r) => setData(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const stats = data
    ? [
        {
          label: t("admin.statTotalUsers"),
          value: data.stats.total_users,
          icon: Users,
          color: "var(--ms-accent-cyan)",
          glow: "rgba(34,211,238,0.15)",
          to: "/admin/users",
        },
        {
          label: t("admin.statVerifiedUsers"),
          value: data.stats.total_verified_users,
          icon: CheckCircle,
          color: "#34D399",
          glow: "rgba(52,211,153,0.15)",
          to: "/admin/users",
        },
        {
          label: t("admin.statSubmissions"),
          value: data.stats.total_submissions,
          icon: FileQuestion,
          color: "var(--ms-accent-sky)",
          glow: "rgba(14,165,233,0.15)",
          to: "/admin/tests",
        },
        {
          label: t("admin.statActiveTests"),
          value: data.stats.total_tests,
          icon: Activity,
          color: "#A78BFA",
          glow: "rgba(167,139,250,0.15)",
          to: "/admin/tests",
        },
        {
          label: t("admin.statRecommendations"),
          value: data.stats.total_recommendations,
          icon: Sparkles,
          color: "#F97316",
          glow: "rgba(249,115,22,0.15)",
          to: "/admin/recommendations",
        },
        {
          label: t("admin.statCareerPaths"),
          value: data.stats.total_careers,
          icon: Briefcase,
          color: "#8B5CF6",
          glow: "rgba(139,92,246,0.15)",
          to: "/admin/careers",
        },
        {
          label: t("admin.statCareerCategories"),
          value: data.stats.total_categories,
          icon: TrendingUp,
          color: "#38BDF8",
          glow: "rgba(56,189,248,0.15)",
          to: "/admin/careers",
        },
        {
          label: t("admin.statAvgScore"),
          value: `${data.stats.avg_match_score}%`,
          icon: BarChart2,
          color: "#10B981",
          glow: "rgba(16,185,129,0.15)",
          to: "/admin/recommendations",
        },
      ]
    : [];

  // Derive chart data from stats
  const barData = data
    ? [
        { name: t("admin.statTotalUsers", "Users"),     value: data.stats.total_users,           fill: "var(--ms-accent-cyan)" },
        { name: t("admin.statActiveTests", "Tests"),    value: data.stats.total_tests,           fill: "#A78BFA" },
        { name: t("admin.statCareerPaths", "Careers"),  value: data.stats.total_careers,         fill: "#8B5CF6" },
        { name: t("admin.statRecommendations", "Recs"), value: data.stats.total_recommendations, fill: "#F97316" },
        { name: t("admin.statSubmissions", "Submiss."), value: data.stats.total_submissions,     fill: "var(--ms-accent-sky)" },
      ]
    : [];

  // Verification breakdown for the donut-style bar
  const verifiedPct = data
    ? Math.round((data.stats.total_verified_users / Math.max(data.stats.total_users, 1)) * 100)
    : 0;

  // Recent users excluding admins
  const recentStudents = (data?.recent_users ?? []).filter((u) => u.role !== "admin").slice(0, 5);

  // Quick actions
  const quickLinks = [
    { icon: Users,        title: t("admin.manageUsers"),           desc: t("admin.manageUsersDesc"),     to: "/admin/users",           primary: true  },
    { icon: FileQuestion, title: t("admin.manageTests"),           desc: t("admin.manageTestsDesc"),     to: "/admin/tests",           primary: false },
    { icon: Briefcase,    title: t("admin.careersDb"),             desc: t("admin.careersDbDesc"),       to: "/admin/careers",         primary: false },
    { icon: Sparkles,     title: t("admin.recommendations.title"), desc: t("admin.recommendationsDesc"), to: "/admin/recommendations", primary: false },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">

      {/* ── Welcome Banner ───────────────────────────────────────────────── */}
      <div
        className="rounded-2xl p-6 md:p-8 relative overflow-hidden"
        style={{
          background: "linear-gradient(120deg, #1E3A8A 0%, #0E7490 55%, #1E40AF 100%)",
          border: "1px solid rgba(34,211,238,0.20)",
          boxShadow: "0 8px 40px rgba(14,116,144,0.28)",
        }}
      >
        {/* Decorative glow */}
        <div
          className="absolute -top-12 -right-12 w-48 h-48 rounded-full pointer-events-none"
          style={{ background: "rgba(34,211,238,0.08)", filter: "blur(40px)" }}
        />
        <div className="relative z-10 flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1 text-white">
              {t("admin.welcomeAdmin", "Welcome back")}, {user?.name || "Admin"}
            </h1>
            <p className="text-white/65 text-sm">{t("admin.welcomeSubtitle")}</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {data && (
              <div
                className="px-4 py-2 rounded-xl text-sm font-bold text-white"
                style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)" }}
              >
                <span className="opacity-70 text-xs mr-1">{t("admin.statVerifiedUsers")}:</span>
                {verifiedPct}%
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Stat Cards ───────────────────────────────────────────────────── */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <StatSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <Link
              key={s.label}
              to={s.to}
              className="rounded-2xl p-5 relative overflow-hidden group transition-all duration-200 hover:scale-[1.02]"
              style={{
                background: "var(--ms-bg-card)",
                border: "1px solid var(--ms-border-subtle)",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--ms-border-glow)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--ms-border-subtle)")}
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
                <ArrowUpRight
                  size={14}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: s.color }}
                />
              </div>
              <div className="text-2xl font-bold mb-0.5">{s.value}</div>
              <div className="text-xs font-medium" style={{ color: s.color, opacity: 0.75 }}>
                {s.label}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* ── Charts Row ───────────────────────────────────────────────────── */}
      {!loading && data && (
        <div className="grid lg:grid-cols-5 gap-4">
          {/* Bar chart: platform overview */}
          <div
            className="lg:col-span-3 rounded-2xl p-5"
            style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-sm flex items-center gap-2">
                <BarChart2 size={15} style={{ color: "var(--ms-accent-cyan)" }} />
                {t("admin.platformOverview", "Platform Overview")}
              </h2>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={barData} barSize={36}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="var(--ms-border-subtle)"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  width={30}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--ms-accent-glow)" }} />
                <Bar dataKey="value" name="Count" radius={[6, 6, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Verification card + quick stats */}
          <div className="lg:col-span-2 space-y-4">
            {/* User verification rate */}
            <div
              className="rounded-2xl p-5"
              style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)" }}
            >
              <h2 className="font-bold text-sm mb-3 flex items-center gap-2">
                <UserCheck size={15} style={{ color: "#34D399" }} />
                {t("admin.verificationRate", "Verification Rate")}
              </h2>
              <div className="text-3xl font-bold mb-2" style={{ color: "#34D399" }}>
                {verifiedPct}%
              </div>
              <div
                className="h-2 rounded-full overflow-hidden"
                style={{ background: "var(--ms-bg-layer3)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${verifiedPct}%`,
                    background: "linear-gradient(90deg, #34D399, #10B981)",
                  }}
                />
              </div>
              <div className="flex justify-between text-xs mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>
                <span>{data.stats.total_verified_users} {t("admin.statVerifiedUsers", "verified")}</span>
                <span>{data.stats.total_users} {t("admin.statTotalUsers", "total")}</span>
              </div>
            </div>

            {/* Avg match score */}
            <div
              className="rounded-2xl p-5 relative overflow-hidden"
              style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)" }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
                style={{ background: "linear-gradient(90deg, transparent, #10B981, transparent)" }}
              />
              <h2 className="font-bold text-sm mb-1 flex items-center gap-2">
                <TrendingUp size={15} style={{ color: "#10B981" }} />
                {t("admin.statAvgScore", "Avg Match Score")}
              </h2>
              <div className="text-3xl font-bold" style={{ color: "#10B981" }}>
                {data.stats.avg_match_score}%
              </div>
              <p className="text-xs mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>
                {t("admin.acrossRecommendations", "across all recommendations")}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Quick Actions ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickLinks.map((a) => (
          <Link
            key={a.title}
            to={a.to}
            className="rounded-2xl p-5 transition-all duration-200 group relative overflow-hidden hover:scale-[1.02]"
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
                  }
            }
            onMouseEnter={(e) => {
              if (!a.primary) (e.currentTarget as HTMLElement).style.borderColor = "var(--ms-border-glow)";
            }}
            onMouseLeave={(e) => {
              if (!a.primary) (e.currentTarget as HTMLElement).style.borderColor = "var(--ms-border-subtle)";
            }}
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
              style={
                a.primary
                  ? { background: "rgba(255,255,255,0.18)" }
                  : { background: "var(--ms-accent-glow)", border: "1px solid var(--ms-border-subtle)" }
              }
            >
              <a.icon size={18} style={{ color: a.primary ? "#fff" : "var(--ms-accent-cyan)" }} />
            </div>
            <div className="font-bold text-sm" style={{ color: a.primary ? "#fff" : undefined }}>
              {a.title}
            </div>
            <div
              className="text-xs mt-0.5"
              style={{ color: a.primary ? "rgba(255,255,255,0.65)" : "hsl(var(--muted-foreground))" }}
            >
              {a.desc}
            </div>
            <ArrowUpRight
              size={14}
              className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: a.primary ? "rgba(255,255,255,0.65)" : "var(--ms-accent-cyan)" }}
            />
          </Link>
        ))}
      </div>

      {/* ── Recent Users Table ────────────────────────────────────────────── */}
      {!loading && data && (
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)" }}
        >
          <div
            className="px-6 py-4 flex items-center justify-between"
            style={{ borderBottom: "1px solid var(--ms-border-subtle)" }}
          >
            <h2 className="font-bold flex items-center gap-2 text-sm">
              <Clock size={15} style={{ color: "var(--ms-accent-cyan)" }} />
              {t("admin.recentUsers")}
            </h2>
            <Link
              to="/admin/users"
              className="text-xs font-bold hover:opacity-80 flex items-center gap-1"
              style={{ color: "var(--ms-accent-sky)" }}
            >
              {t("admin.viewAll")} <ArrowUpRight size={11} />
            </Link>
          </div>

          {recentStudents.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Users size={32} className="mx-auto mb-3 opacity-20" />
              <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
                {t("admin.noRecentUsers", "No recent users")}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--ms-border-subtle)" }}>
                    {[
                      t("admin.users.columns.name"),
                      t("common.email", "Email"),
                      t("admin.users.columns.tests"),
                      t("admin.users.columns.status"),
                      t("admin.users.columns.joined"),
                    ].map((h) => (
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
                  {recentStudents.map((u) => (
                    <tr
                      key={u.id}
                      className="activity-hover"
                      style={{ borderBottom: "1px solid var(--ms-border-subtle)" }}
                    >
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
                            style={{
                              background: "linear-gradient(135deg, #1D4ED8, #0E7490)",
                              border: "1px solid var(--ms-border-glow)",
                            }}
                          >
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-sm">{u.name}</span>
                        </div>
                      </td>
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
                              ? { background: "rgba(52,211,153,0.10)", color: "#34D399", border: "1px solid rgba(52,211,153,0.20)" }
                              : { background: "rgba(251,191,36,0.12)", color: "#FBBF24", border: "1px solid rgba(251,191,36,0.22)" }
                          }
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                        {u.joined}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Loading skeleton for recent table */}
      {loading && (
        <div
          className="rounded-2xl overflow-hidden animate-pulse"
          style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)" }}
        >
          <div
            className="px-6 py-4"
            style={{ borderBottom: "1px solid var(--ms-border-subtle)" }}
          >
            <div className="h-4 w-32 rounded" style={{ background: "var(--ms-bg-layer3)" }} />
          </div>
          <div className="p-4 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full" style={{ background: "var(--ms-bg-layer3)" }} />
                <div className="flex-1 h-4 rounded" style={{ background: "var(--ms-bg-layer3)" }} />
                <div className="w-20 h-4 rounded" style={{ background: "var(--ms-bg-layer3)" }} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
