import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  Sparkles,
  FileQuestion,
  Briefcase,
  MessageSquare,
  TrendingUp,
  Clock,
  CheckCircle,
  BookOpen,
  RefreshCw,
  AlertCircle,
  User,
  Target,
  Trophy,
  ArrowRight,
  Zap,
} from "lucide-react";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip as RechartsTooltip,
} from "recharts";
import { getDashboard, type DashboardData } from "@/services/studentApi";
import { useAuth } from "@/hooks/use-auth";

// ─── Types ────────────────────────────────────────────────────────────────────

// DashboardController returns `stats.recommendations` (not `recommendations_count`)
// and `recent_activity[].time` (not `timestamp`) — exact field names preserved
interface Stats {
  profile_completion: number;
  tests_completed: number;
  total_tests: number;
  recommendations: number;
}

interface TopRec {
  career: string;
  category: string;
  match_score: number;
  analysis: string;
}

interface ActivityItem {
  type: string;
  text: string;
  time: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const QUICK_ACTIONS = [
  {
    icon: FileQuestion,
    title: "Take Test",
    desc: "Start orientation",
    to: "/test",
    primary: true,
    gradient: "linear-gradient(135deg, #1E40AF 0%, #0E7490 100%)",
    glow: "0 8px 24px rgba(14,116,144,0.30)",
    hoverGlow: "0 14px 36px rgba(14,116,144,0.50)",
  },
  {
    icon: Sparkles,
    title: "AI Results",
    desc: "View recommendations",
    to: "/recommendations",
    accent: "#A78BFA",
    accentGlow: "rgba(167,139,250,0.14)",
  },
  {
    icon: Briefcase,
    title: "Careers",
    desc: "Explore paths",
    to: "/careers",
    accent: "#34D399",
    accentGlow: "rgba(52,211,153,0.14)",
  },
  {
    icon: MessageSquare,
    title: "AI Chatbot",
    desc: "Ask anything",
    to: "/chatbot",
    accent: "var(--ms-accent-cyan)",
    accentGlow: "var(--ms-accent-glow)",
  },
] as const;

// Sparkline shape — drives the AreaChart; values are illustrative engagement weights
const SPARKLINE = [
  { d: "M", v: 1 },
  { d: "T", v: 2 },
  { d: "W", v: 2 },
  { d: "T", v: 4 },
  { d: "F", v: 3 },
  { d: "S", v: 5 },
  { d: "S", v: 4 },
];

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const Bone = ({ className = "" }: { className?: string }) => (
  <div
    className={`relative overflow-hidden rounded-xl ${className}`}
    style={{ background: "var(--ms-bg-layer3)" }}
  >
    <div
      className="absolute inset-0"
      style={{
        background:
          "linear-gradient(90deg,transparent 0%,var(--ms-bg-layer2) 50%,transparent 100%)",
        animation: "shimmer 1.6s ease-in-out infinite",
      }}
    />
  </div>
);

function SkeletonDashboard() {
  return (
    <div className="max-w-6xl mx-auto space-y-5">
      {/* Banner */}
      <div
        className="rounded-2xl p-12 flex flex-col items-center text-center gap-4"
        style={{
          background: "var(--ms-bg-card)",
          border: "1px solid var(--ms-border-subtle)",
        }}
      >
        <Bone className="h-6 w-48 rounded-full" />
        <Bone className="h-3 w-28 rounded-full mt-4" />
      </div>
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-2xl p-5 space-y-3"
            style={{
              background: "var(--ms-bg-card)",
              border: "1px solid var(--ms-border-subtle)",
            }}
          >
            <div className="flex items-center gap-3">
              <Bone className="w-10 h-10 rounded-xl flex-shrink-0" />
              <Bone className="h-3 w-20" />
            </div>
            <Bone className="h-7 w-16" />
            <Bone className="h-1.5 w-full rounded-full" />
          </div>
        ))}
      </div>
      {/* Quick actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-2xl p-5 space-y-3"
            style={{
              background: "var(--ms-bg-card)",
              border: "1px solid var(--ms-border-subtle)",
            }}
          >
            <Bone className="w-9 h-9 rounded-lg" />
            <Bone className="h-4 w-20" />
            <Bone className="h-3 w-28" />
          </div>
        ))}
      </div>
      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-5">
        <div
          className="rounded-2xl p-6 space-y-4"
          style={{
            background: "var(--ms-bg-card)",
            border: "1px solid var(--ms-border-subtle)",
          }}
        >
          <Bone className="h-5 w-32" />
          <div
            className="flex items-center gap-4 p-3 rounded-xl"
            style={{ background: "var(--ms-accent-glow)" }}
          >
            <Bone className="w-16 h-16 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Bone className="h-4 w-24" />
              <Bone className="h-3 w-32" />
            </div>
          </div>
          {[0, 1, 2].map((i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between">
                <Bone className="h-3 w-28" />
                <Bone className="h-3 w-10" />
              </div>
              <Bone className="h-1.5 w-full rounded-full" />
            </div>
          ))}
        </div>
        <div
          className="lg:col-span-2 rounded-2xl p-6 space-y-4"
          style={{
            background: "var(--ms-bg-card)",
            border: "1px solid var(--ms-border-subtle)",
          }}
        >
          <Bone className="h-5 w-44" />
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-xl"
              style={{ background: "var(--ms-accent-glow)" }}
            >
              <Bone className="w-8 h-8 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Bone className="h-3 w-36" />
                <Bone className="h-2 w-20" />
              </div>
              <Bone className="h-2 w-16 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Animated progress bar ────────────────────────────────────────────────────

function ProgressBar({
  pct,
  delay = 0,
  color,
}: {
  pct: number;
  delay?: number;
  color?: string;
}) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 120 + delay);
    return () => clearTimeout(t);
  }, [pct, delay]);

  return (
    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200/20 overflow-hidden">
      <div
        className="h-full rounded-full bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-400 dark:from-blue-500 dark:via-purple-500 dark:to-cyan-400 shadow-[0_0_12px_rgba(56,189,248,0.3)] transition-all duration-500"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

// ─── Radial ring via recharts ─────────────────────────────────────────────────

function RadialRing({
  value,
  color,
  size = 76,
}: {
  value: number;
  color: string;
  size?: number;
}) {
  return (
    <ResponsiveContainer width={size} height={size}>
      <RadialBarChart
        cx="50%"
        cy="50%"
        innerRadius="62%"
        outerRadius="100%"
        startAngle={90}
        endAngle={-270}
        data={[{ value, fill: color }]}
        barSize={7}
      >
        <RadialBar
          dataKey="value"
          cornerRadius={6}
          background={{ fill: "var(--ms-bg-layer3)" }}
        />
      </RadialBarChart>
    </ResponsiveContainer>
  );
}

// ─── Rank colours ─────────────────────────────────────────────────────────────

const RANK = [
  {
    bg: "rgba(251,191,36,0.12)",
    border: "rgba(251,191,36,0.28)",
    text: "#FBBF24",
  },
  {
    bg: "rgba(148,163,184,0.12)",
    border: "rgba(148,163,184,0.28)",
    text: "#94A3B8",
  },
  {
    bg: "rgba(180,120,60,0.12)",
    border: "rgba(180,120,60,0.28)",
    text: "#B47C3C",
  },
] as const;

// ─── Main component ───────────────────────────────────────────────────────────

const Dashboard = () => {
  const { t } = useTranslation();
  const { user: authUser } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getDashboard();
      setData(res.data.data);
    } catch {
      setError(t("dashboard.errorTitle"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // ── Derived values ───────────────────────────────────────────────────────
  const userName = data?.user?.name || authUser?.name || "Student";
  const firstName = userName.split(" ")[0];
  const avatar = data?.user?.avatar || authUser?.avatar;
  const initial = firstName.charAt(0).toUpperCase();

  const stats = data?.stats as Stats | undefined;
  const profilePct = stats?.profile_completion ?? 0;
  const testsDone = stats?.tests_completed ?? 0;
  const testsTotal = stats?.total_tests ?? 0;
  const recCount = stats?.recommendations ?? 0;
  const testsPct =
    testsTotal > 0 ? Math.round((testsDone / testsTotal) * 100) : 0;
  const topRecs = (data?.top_recommendations ?? []) as TopRec[];
  const activity = (data?.recent_activity ?? []) as ActivityItem[];

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) return <SkeletonDashboard />;

  // ── Error ────────────────────────────────────────────────────────────────
  if (error)
    return (
      <div className="max-w-6xl mx-auto">
        <div
          className="rounded-2xl p-12 flex flex-col items-center text-center gap-4"
          style={{
            background: "var(--ms-bg-card)",
            border: "1px solid var(--ms-border-subtle)",
          }}
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{
              background: "rgba(248,113,113,0.10)",
              border: "1px solid rgba(248,113,113,0.20)",
            }}
          >
            <AlertCircle size={28} style={{ color: "#F87171" }} />
          </div>
          <div>
            <p className="font-semibold text-base mb-1">
              {t("dashboard.errorTitle")}
            </p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
          <button
            onClick={load}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{
              background:
                "linear-gradient(135deg,var(--ms-accent-blue),#0E7490)",
              boxShadow: "0 4px 16px var(--ms-accent-glow-strong)",
            }}
          >
            <RefreshCw size={14} /> Try again
          </button>
        </div>
      </div>
    );

  // ── Stat card definitions (live data) ────────────────────────────────────
  const STAT_CARDS = [
    {
      icon: User,
      label: t("dashboard.stats.profile"),
      value: `${profilePct}%`,
      sub: profilePct < 80 ? t("dashboard.stats.incomplete") : t("dashboard.stats.lookingComplete"),
      color: "var(--ms-accent-cyan)",
      glow: "var(--ms-accent-glow)",
      pct: profilePct,
      link: "/profile",
    },
    {
      icon: FileQuestion,
      label: t("dashboard.stats.testsDone"),
      value: `${testsDone}`,
      sub: `${t("dashboard.stats.of")} ${testsTotal} ${t("dashboard.stats.available")}`,
      color: "#A78BFA",
      glow: "rgba(167,139,250,0.13)",
      pct: testsPct,
      link: "/test",
    },
    {
      icon: Sparkles,
      label: t("dashboard.stats.aiMatches"),
      value: `${recCount}`,
      sub: recCount > 0 ? t("dashboard.stats.personalised") : t("dashboard.stats.takeTestFirst"),
      color: "#34D399",
      glow: "rgba(52,211,153,0.13)",
      pct: Math.min(recCount * 34, 100),
      link: "/recommendations",
    },
    {
      icon: Target,
      label: t("dashboard.stats.exploration"),
      value: recCount > 0 ? t("dashboard.stats.active") : t("dashboard.stats.pending"),
      sub:
        recCount > 0
          ? `${recCount} ${t("dashboard.stats.pathsFound")}`
          : t("dashboard.stats.completeTest"),
      color: "var(--ms-accent-sky)",
      glow: "rgba(56,189,248,0.13)",
      pct: recCount > 0 ? 100 : 0,
      link: "/careers",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-5 animate-fade-in">
      {/* ── Welcome Banner ─────────────────────────────────────────────── */}
      <div
        className="rounded-2xl p-6 md:p-8 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(120deg, #1E3A8A 0%, #0E7490 50%, #1E40AF 100%)",
          border: "1px solid rgba(34,211,238,0.20)",
          boxShadow:
            "0 8px 40px rgba(14,116,144,0.28), inset 0 1px 0 rgba(255,255,255,0.10)",
        }}
      >
        <div
          className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(34,211,238,0.18), transparent 70%)",
            transform: "translate(30%, -40%)",
          }}
        />
        <div
          className="absolute bottom-0 left-1/4 w-48 h-48 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(37,99,235,0.25), transparent 70%)",
            transform: "translateY(40%)",
          }}
        />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2 text-white">
              {t("dashboard.welcomeTitle", { name: userName })}
            </h1>
            <p className="text-white/65 font-sans">{t("dashboard.welcomeSubtitle")}</p>
          </div>
          <button
            onClick={load}
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
            style={{
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.20)",
              color: "#fff",
            }}
          >
              <RefreshCw size={14} /> {t("dashboard.refresh")}
          </button>
        </div>
      </div>

      {/* ── Stat Cards ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((s, i) => (
          <Link
            key={s.label}
            to={s.link}
            className="rounded-2xl p-5 relative overflow-hidden group block transition-all duration-200"
            style={{
              background: "var(--ms-bg-card)",
              border: "1px solid var(--ms-border-subtle)",
              backdropFilter: "blur(12px)",
              boxShadow: "var(--shadow-card)",
              animationDelay: `${i * 55}ms`,
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "var(--ms-border-glow)";
              el.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "var(--ms-border-subtle)";
              el.style.transform = "";
            }}
          >
            {/* Hover accent line */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              style={{
                background: `linear-gradient(90deg,transparent,${s.color},transparent)`,
              }}
            />

            <div className="flex items-start justify-between mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: s.glow, border: `1px solid ${s.color}22` }}
              >
                <s.icon size={18} style={{ color: s.color }} />
              </div>
              <ArrowRight
                size={13}
                className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-0.5"
                style={{ color: s.color }}
              />
            </div>

            <div
              className="text-xl font-extrabold mb-0.5 tabular-nums"
              style={{ color: s.color }}
            >
              {s.value}
            </div>
            <div className="text-xs font-semibold text-muted-foreground mb-3">
              {s.label}
            </div>

            <ProgressBar pct={s.pct} delay={i * 80} />
            <div className="text-[10px] text-muted-foreground mt-1.5 truncate">
              {s.sub}
            </div>
          </Link>
        ))}
      </div>

      {/* ── Quick Actions ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {QUICK_ACTIONS.map((a, i) => (
          <Link
            key={a.title}
            to={a.to}
            className="rounded-2xl p-5 group relative overflow-hidden block transition-all duration-200"
            style={
              a.primary
                ? {
                    background: (a as any).gradient,
                    border: "1px solid rgba(34,211,238,0.25)",
                    boxShadow: (a as any).glow,
                  }
                : {
                    background: "var(--ms-bg-card)",
                    border: "1px solid var(--ms-border-subtle)",
                    backdropFilter: "blur(12px)",
                    boxShadow: "var(--shadow-card)",
                  }
            }
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = "translateY(-3px)";
              if (a.primary) el.style.boxShadow = (a as any).hoverGlow;
              else el.style.borderColor = "var(--ms-border-glow)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = "";
              if (a.primary) el.style.boxShadow = (a as any).glow;
              else el.style.borderColor = "var(--ms-border-subtle)";
            }}
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
              style={
                a.primary
                  ? { background: "rgba(255,255,255,0.18)" }
                  : {
                      background: (a as any).accentGlow,
                      border: `1px solid ${(a as any).accent}22`,
                    }
              }
            >
              <a.icon
                size={17}
                style={{ color: a.primary ? "#fff" : (a as any).accent }}
              />
            </div>

            {(() => {
              const translations = t("dashboard.quickActions", { returnObjects: true }) as any[];
              const tx = translations && translations[i] ? translations[i] : { title: a.title, desc: a.desc };
              return (
                <>
                  <div
                    className="font-bold text-sm mb-0.5"
                    style={{ color: a.primary ? "#fff" : undefined }}
                  >
                    {tx.title}
                  </div>
                  <div
                    className="text-xs"
                    style={{
                      color: a.primary ? "rgba(255,255,255,0.62)" : undefined,
                      opacity: a.primary ? 1 : 0.65,
                    }}
                  >
                    {tx.desc}
                  </div>
                </>
              );
            })()}

            <ArrowRight
              size={12}
              className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5"
              style={{
                color: a.primary
                  ? "rgba(255,255,255,0.70)"
                  : "var(--ms-accent-cyan)",
              }}
            />
          </Link>
        ))}
      </div>

      {/* ── Progress + Recommendations ─────────────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Progress widget */}
        <div
          className="rounded-2xl p-6 relative overflow-hidden card-top-glow"
          style={{
            background: "var(--ms-bg-card)",
            border: "1px solid var(--ms-border-subtle)",
            backdropFilter: "blur(12px)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <h2 className="font-bold mb-4 flex items-center gap-2 text-sm">
            <TrendingUp size={15} style={{ color: "var(--ms-accent-cyan)" }} />
            {t("dashboard.progress.title")}
          </h2>

          {/* Radial ring + label */}
          <div
            className="flex items-center gap-3 mb-5 p-3 rounded-xl"
            style={{
              background: "var(--ms-accent-glow)",
              border: "1px solid var(--ms-border-subtle)",
            }}
          >
            <div className="relative flex-shrink-0">
              <RadialRing value={profilePct} color="var(--ms-accent-cyan)" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span
                  className="text-xs font-bold text-blue-600 dark:text-cyan-400 bg-blue-50 dark:bg-cyan-950/40 px-1.5 py-0.5 rounded-md tabular-nums"
                >
                  {profilePct}%
                </span>
              </div>
            </div>
            <div className="min-w-0">
              <div className="text-sm font-bold">{t("dashboard.progress.profile")}</div>
              <div className="text-xs text-muted-foreground leading-snug">
                {profilePct < 40
                  ? t("dashboard.progress.justStarted")
                  : profilePct < 80
                    ? t("dashboard.progress.almostComplete")
                    : t("dashboard.progress.lookingGreat")}
              </div>
              {profilePct < 100 && (
                <Link
                  to="/profile"
                  className="text-[10px] font-bold mt-1 flex items-center gap-0.5 w-fit"
                  style={{ color: "var(--ms-accent-sky)" }}
                >
                  {t("dashboard.progress.completeProfile")} <ArrowRight size={9} />
                </Link>
              )}
            </div>
          </div>

          {/* Progress bars */}
          <div className="space-y-4">
            {[
              {
                label: t("dashboard.progress.profile"),
                val: `${profilePct}%`,
                pct: profilePct,
                delay: 0,
                color: "var(--ms-accent-cyan)",
              },
              {
                label: t("dashboard.progress.testsCompleted"),
                val: `${testsDone}/${testsTotal}`,
                pct: testsPct,
                delay: 100,
                color: "#A78BFA",
              },
              {
                label: t("dashboard.progress.recommendations"),
                val: `${recCount}`,
                pct: Math.min(recCount * 34, 100),
                delay: 200,
                color: "#34D399",
              },
            ].map((row) => (
              <div key={row.label}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground font-medium">
                    {row.label}
                  </span>
                  <span className="font-bold tabular-nums">{row.val}</span>
                </div>
                <ProgressBar
                  pct={row.pct}
                  delay={row.delay}
                  color={`linear-gradient(90deg,${row.color}99,${row.color})`}
                />
              </div>
            ))}
          </div>

          {/* Stat badges */}
          <div className="grid grid-cols-3 gap-2 mt-5">
            {[
              {
                icon: Trophy,
                label: t("dashboard.progress.tests"),
                value: testsDone,
                color: "#FBBF24",
              },
              {
                icon: Sparkles,
                label: t("dashboard.progress.matches"),
                value: recCount,
                color: "#34D399",
              },
              {
                icon: Target,
                label: t("dashboard.progress.score"),
                value: profilePct > 0 ? `${profilePct}` : "—",
                color: "var(--ms-accent-sky)",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl p-2.5 text-center"
                style={{
                  background: "var(--ms-accent-glow)",
                  border: "1px solid var(--ms-border-subtle)",
                }}
              >
                <s.icon
                  size={11}
                  className="mx-auto mb-1"
                  style={{ color: s.color }}
                />
                <div
                  className="font-extrabold text-sm tabular-nums"
                  style={{ color: s.color }}
                >
                  {s.value}
                </div>
                <div className="text-[9px] text-muted-foreground font-semibold uppercase tracking-wide">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendations */}
        <div
          className="lg:col-span-2 rounded-2xl p-6 relative overflow-hidden card-top-glow"
          style={{
            background: "var(--ms-bg-card)",
            border: "1px solid var(--ms-border-subtle)",
            backdropFilter: "blur(12px)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold flex items-center gap-2 text-sm">
              <Sparkles size={15} style={{ color: "var(--ms-accent-cyan)" }} />
              {t("dashboard.recommendations.title")}
            </h2>
            {topRecs.length > 0 && (
              <Link
                to="/recommendations"
                className="text-xs font-bold flex items-center gap-1 transition-all hover:gap-1.5"
                style={{ color: "var(--ms-accent-sky)" }}
              >
                {t("dashboard.recommendations.viewAll")} <ArrowRight size={11} />
              </Link>
            )}
          </div>

          {topRecs.length > 0 ? (
            <div className="space-y-2.5">
              {topRecs.map((r, i) => {
                const rank = RANK[i] ?? RANK[2];
                const match = Math.round(r.match_score);
                return (
                  <Link
                    key={i}
                    to="/recommendations"
                    className="flex items-center gap-3 p-3.5 rounded-xl group block transition-all duration-200"
                    style={{
                      background: "var(--ms-accent-glow)",
                      border: "1px solid var(--ms-border-subtle)",
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = "var(--ms-border-glow)";
                      el.style.transform = "translateX(4px)";
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = "var(--ms-border-subtle)";
                      el.style.transform = "";
                    }}
                  >
                    {/* Rank badge */}
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-extrabold flex-shrink-0"
                      style={{
                        background: rank.bg,
                        border: `1px solid ${rank.border}`,
                        color: rank.text,
                      }}
                    >
                      #{i + 1}
                    </div>

                    {/* Career info */}
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm truncate">
                        {r.career}
                      </div>
                      <span
                        className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5"
                        style={{
                          background: "var(--ms-bg-layer3)",
                          border: "1px solid var(--ms-border-glow)",
                          color: "var(--ms-accent-sky)",
                        }}
                      >
                        {r.category}
                      </span>
                    </div>

                    {/* Match bar + score */}
                    <div className="flex-shrink-0 hidden sm:block text-right">
                      <div
                        className="text-xs font-extrabold mb-1 tabular-nums"
                        style={{ color: rank.text }}
                      >
                        {match}%
                      </div>
                      <div
                        className="w-20 h-1.5 rounded-full"
                        style={{ background: "var(--ms-bg-layer3)" }}
                      >
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${match}%`,
                            background: `linear-gradient(90deg,var(--ms-accent-blue),${rank.text})`,
                          }}
                        />
                      </div>
                    </div>

                    <ArrowRight
                      size={13}
                      className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                      style={{ color: "var(--ms-accent-sky)" }}
                    />
                  </Link>
                );
              })}
              <p className="text-[10px] text-muted-foreground pt-1">
                {t("dashboard.recommendations.basedOn")} {" "}
                <Link
                  to="/recommendations"
                  className="underline"
                  style={{ color: "var(--ms-accent-cyan)" }}
                >
                  {t("dashboard.recommendations.seeFullAnalysis")}
                </Link>
              </p>
            </div>
          ) : (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                style={{
                  background: "var(--ms-accent-glow)",
                  border: "1px solid var(--ms-border-subtle)",
                }}
              >
                <Sparkles
                  size={24}
                  style={{ color: "var(--ms-accent-cyan)", opacity: 0.55 }}
                />
              </div>
              <p className="font-semibold text-sm mb-1">{t("dashboard.recommendations.noTitle")}</p>
              <p className="text-xs text-muted-foreground mb-5 max-w-[260px] leading-relaxed">{t("dashboard.recommendations.noDesc")}</p>
              <Link
                to="/test"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105"
                style={{
                  background:
                    "linear-gradient(135deg,var(--ms-accent-blue),#0E7490)",
                  boxShadow: "0 4px 16px var(--ms-accent-glow-strong)",
                }}
              >
                <FileQuestion size={14} /> {t("dashboard.recommendations.takeTest")}
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ── Analytics + Activity ───────────────────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Sparkline analytics card */}
        <div
          className="rounded-2xl p-6 relative overflow-hidden card-top-glow"
          style={{
            background: "var(--ms-bg-card)",
            border: "1px solid var(--ms-border-subtle)",
            backdropFilter: "blur(12px)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <h2 className="font-bold flex items-center gap-2 text-sm mb-0.5">
            <TrendingUp size={15} style={{ color: "var(--ms-accent-cyan)" }} />
            {t("dashboard.analytics.title")}
          </h2>
          <p className="text-xs text-muted-foreground mb-4">{t("dashboard.analytics.subtitle")}</p>

          <ResponsiveContainer width="100%" height={76}>
            <AreaChart
              data={SPARKLINE}
              margin={{ top: 2, right: 0, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--ms-accent-cyan)"
                    stopOpacity={0.28}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--ms-accent-cyan)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <XAxis dataKey="d" hide />
              <RechartsTooltip
                contentStyle={{
                  background: "var(--ms-bg-layer2)",
                  border: "1px solid var(--ms-border-subtle)",
                  borderRadius: "8px",
                  fontSize: "11px",
                  color: "hsl(var(--foreground))",
                  padding: "6px 10px",
                }}
                cursor={{ stroke: "var(--ms-border-glow)", strokeWidth: 1 }}
              />
              <Area
                type="monotone"
                dataKey="v"
                stroke="var(--ms-accent-cyan)"
                strokeWidth={2}
                fill="url(#areaGrad)"
                dot={false}
                activeDot={{
                  r: 4,
                  fill: "var(--ms-accent-cyan)",
                  stroke: "var(--ms-bg-card)",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>

          {/* Mini stat row */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            {[
              { label: t("dashboard.analytics.sessions"), value: "7" },
              { label: t("dashboard.analytics.actions"), value: String(testsDone + recCount) },
              { label: t("dashboard.analytics.streak"), value: "1d" },
            ].map((m) => (
              <div key={m.label} className="text-center">
                <div className="font-extrabold text-base tabular-nums">
                  {m.value}
                </div>
                <div className="text-[9px] text-muted-foreground uppercase tracking-wide font-semibold">
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div
          className="lg:col-span-2 rounded-2xl p-6 relative overflow-hidden card-top-glow"
          style={{
            background: "var(--ms-bg-card)",
            border: "1px solid var(--ms-border-subtle)",
            backdropFilter: "blur(12px)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <h2 className="font-bold flex items-center gap-2 text-sm mb-5">
            <Clock size={15} style={{ color: "var(--ms-accent-cyan)" }} />
            {t("dashboard.activity.title")}
          </h2>

          {activity.length > 0 ? (
            <div>
              {activity.map((a, i) => {
                const isTest =
                  a.type === "test_answer" || a.type === "test_completed";
                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 py-3 activity-hover"
                    style={{
                      borderBottom:
                        i < activity.length - 1
                          ? "1px solid var(--ms-border-subtle)"
                          : "none",
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={
                        isTest
                          ? {
                              background: "rgba(52,211,153,0.10)",
                              border: "1px solid rgba(52,211,153,0.22)",
                              color: "#34D399",
                            }
                          : {
                              background: "var(--ms-accent-glow)",
                              border: "1px solid var(--ms-border-glow)",
                              color: "var(--ms-accent-cyan)",
                            }
                      }
                    >
                      {isTest ? (
                        <CheckCircle size={13} />
                      ) : (
                        <Sparkles size={13} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium truncate block">
                        {a.text}
                      </span>
                    </div>
                    <span
                      className="text-[10px] font-mono flex-shrink-0 tabular-nums"
                      style={{ color: "var(--ms-accent-cyan)", opacity: 0.45 }}
                    >
                      {a.time}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty activity state */
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
                style={{
                  background: "var(--ms-accent-glow)",
                  border: "1px solid var(--ms-border-subtle)",
                }}
              >
                <BookOpen
                  size={20}
                  style={{ color: "var(--ms-accent-cyan)", opacity: 0.5 }}
                />
              </div>
              <p className="text-sm font-semibold mb-1">{t("dashboard.activity.noTitle")}</p>
              <p className="text-xs text-muted-foreground mb-4">{t("dashboard.activity.noDesc")}</p>
              <Link
                to="/test"
                className="text-xs font-bold flex items-center gap-1 transition-all hover:gap-1.5"
                style={{ color: "var(--ms-accent-sky)" }}
              >
                {t("dashboard.activity.startTest")} <ArrowRight size={11} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
