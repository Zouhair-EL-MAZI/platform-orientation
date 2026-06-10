import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Users, FileQuestion, Briefcase, TrendingUp,
  Sparkles, Activity, ArrowUpRight, Clock, UserPlus, CheckCircle, AlertCircle,
} from "lucide-react";
import api from "@/lib/api";

interface DashboardData {
  stats: {
    total_users: number;
    total_verified_users: number;
    total_submissions: number;
    total_tests: number;
    total_recommendations: number;
    total_careers: number;
    total_categories: number;
    avg_match_score: number;
  };
  recent_users: { id: number; name: string; email: string; role: string; tests: number; status: string; verified: boolean; joined: string; lastActive: string }[];
}

const AdminDashboardPage = () => {
  const { t } = useTranslation();
  const [data, setData]       = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const quickLinks = [
    { icon: Users,        title: t("admin.manageUsers"),             desc: t("admin.manageUsersDesc"),          to: "/admin/users",           primary: true  },
    { icon: FileQuestion, title: t("admin.manageTests"),             desc: t("admin.manageTestsDesc"),          to: "/admin/tests",           primary: false },
    { icon: Briefcase,    title: t("admin.careersDb"),               desc: t("admin.careersDbDesc"),            to: "/admin/careers",         primary: false },
    { icon: Sparkles,     title: t("admin.recommendations.title"),   desc: t("admin.recommendationsDesc"),      to: "/admin/recommendations", primary: false },
  ];

  useEffect(() => {
    api.get("/admin/dashboard")
      .then(r => setData(r.data.data))
      .finally(() => setLoading(false));
  }, []);

  const stats = data ? [
    { label: t("admin.statTotalUsers"),       value: data.stats.total_users,           icon: Users,        color: "var(--ms-accent-cyan)", glow: "rgba(34,211,238,0.15)" },
    { label: t("admin.statVerifiedUsers"),    value: data.stats.total_verified_users,  icon: CheckCircle,  color: "#34D399",               glow: "rgba(52,211,153,0.15)" },
    { label: t("admin.statSubmissions"),      value: data.stats.total_submissions,     icon: FileQuestion, color: "var(--ms-accent-sky)",  glow: "rgba(14,165,233,0.15)" },
    { label: t("admin.statActiveTests"),      value: data.stats.total_tests,           icon: Activity,     color: "#A78BFA",               glow: "rgba(167,139,250,0.15)" },
    { label: t("admin.statRecommendations"),  value: data.stats.total_recommendations, icon: Sparkles,     color: "#F97316",               glow: "rgba(249,115,22,0.15)" },
    { label: t("admin.statCareerPaths"),      value: data.stats.total_careers,         icon: Briefcase,    color: "#8B5CF6",               glow: "rgba(139,92,246,0.15)" },
    { label: t("admin.statCareerCategories"), value: data.stats.total_categories,      icon: TrendingUp,   color: "#38BDF8",               glow: "rgba(56,189,248,0.15)" },
    { label: t("admin.statAvgScore"),         value: `${data.stats.avg_match_score}%`, icon: TrendingUp,   color: "#10B981",               glow: "rgba(16,185,129,0.15)" },
  ] : [];

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">

      {/* Header Banner */}
      <div className="rounded-2xl p-6 md:p-8 relative overflow-hidden"
        style={{ background: "linear-gradient(120deg, #1E3A8A 0%, #0E7490 50%, #1E40AF 100%)", border: "1px solid rgba(34,211,238,0.20)", boxShadow: "0 8px 40px rgba(14,116,144,0.28)" }}>
        <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1 text-white">{t("admin.welcomeAdmin")}</h1>
            <p className="text-white/65 text-sm">{t("admin.welcomeSubtitle")}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-24 rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(s => (
            <div key={s.label} className="rounded-2xl p-5 relative overflow-hidden"
              style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)" }}>
              <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
                style={{ background: `linear-gradient(90deg, transparent, ${s.color}, transparent)` }} />
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ background: s.glow, border: `1px solid ${s.color}22` }}>
                  <s.icon size={18} style={{ color: s.color }} />
                </div>
                <ArrowUpRight size={14} style={{ color: s.color, opacity: 0.6 }} />
              </div>
              <div className="text-2xl font-bold mb-0.5">{s.value}</div>
              <div className="text-xs font-medium" style={{ color: s.color, opacity: 0.65 }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickLinks.map(a => (
          <Link key={a.title} to={a.to}
            className="rounded-2xl p-5 transition-all duration-250 group relative overflow-hidden"
            style={a.primary
              ? { background: "linear-gradient(135deg, #1E40AF, #0E7490)", border: "1px solid rgba(34,211,238,0.30)", boxShadow: "0 8px 24px rgba(14,116,144,0.25)" }
              : { background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)" }}>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
              style={a.primary ? { background: "rgba(255,255,255,0.18)" } : { background: "var(--ms-accent-glow)", border: "1px solid var(--ms-border-subtle)" }}>
              <a.icon size={18} style={{ color: a.primary ? "#fff" : "var(--ms-accent-cyan)" }} />
            </div>
            <div className="font-bold text-sm" style={{ color: a.primary ? "#fff" : undefined }}>{a.title}</div>
            <div className="text-xs mt-0.5" style={{ color: a.primary ? "rgba(255,255,255,0.65)" : undefined, opacity: a.primary ? 1 : 0.7 }}>{a.desc}</div>
          </Link>
        ))}
      </div>

      {/* Recent Users */}
      {!loading && data && (
        <div className="rounded-2xl overflow-hidden"
          style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)" }}>
          <div className="px-6 py-4 flex items-center justify-between"
            style={{ borderBottom: "1px solid var(--ms-border-subtle)" }}>
            <h2 className="font-bold flex items-center gap-2 text-base">
              <Users size={16} style={{ color: "var(--ms-accent-cyan)" }} /> {t("admin.recentUsers")}
            </h2>
            <Link to="/admin/users" className="text-xs font-bold hover:opacity-80" style={{ color: "var(--ms-accent-sky)" }}>{t("admin.viewAll")}</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--ms-border-subtle)" }}>
                  {[t("admin.users.columns.name"), t("common.email"), t("admin.users.columns.tests"), t("admin.users.columns.status"), t("admin.users.columns.joined")].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider"
                      style={{ color: "var(--ms-accent-cyan)", opacity: 0.65 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.recent_users.map(u => (
                  <tr key={u.id} style={{ borderBottom: "1px solid var(--ms-border-subtle)" }}>
                    <td className="px-6 py-3 font-semibold text-sm">{u.name}</td>
                    <td className="px-6 py-3 text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{u.email}</td>
                    <td className="px-6 py-3 font-bold text-sm" style={{ color: "var(--ms-accent-sky)" }}>{u.tests}</td>
                    <td className="px-6 py-3">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                        style={u.status === "Active"
                          ? { background: "rgba(52,211,153,0.10)", color: "#34D399", border: "1px solid rgba(52,211,153,0.20)" }
                          : { background: "var(--ms-bg-layer3)", color: "hsl(var(--muted-foreground))", border: "1px solid var(--ms-border-subtle)" }}>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{u.joined}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
