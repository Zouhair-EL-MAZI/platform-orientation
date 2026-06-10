import { useEffect, useState } from "react";
import {
  BarChart3, TrendingUp, Users, FileQuestion,
  Sparkles, RefreshCw, MapPin, GraduationCap,
} from "lucide-react";
import { getAdminAnalytics, type AnalyticsData } from "@/services/adminApi";

// ── Tiny line sparkline (SVG) ─────────────────────────────────────────────────
function Sparkline({ data, color, height = 40 }: { data: number[]; color: string; height?: number }) {
  if (!data.length) return null;
  const max    = Math.max(...data, 1);
  const w      = 200;
  const pts    = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = height - (v / max) * (height - 4);
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="w-full" style={{ height }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={`0,${height} ${pts} ${w},${height}`} fill={color} fillOpacity="0.08" stroke="none" />
    </svg>
  );
}

// ── Horizontal bar row ────────────────────────────────────────────────────────
function HBar({ label, value, max, color, sub }: { label: string; value: number; max: number; color: string; sub?: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3 group">
      <div className="w-36 flex-shrink-0 min-w-0">
        <p className="text-xs font-medium truncate group-hover:text-[var(--ms-accent-sky)] transition-colors">{label}</p>
        {sub && <p className="text-[10px] text-muted-foreground">{sub}</p>}
      </div>
      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "var(--ms-border-subtle)" }}>
        <div className="h-2 rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-xs font-bold tabular-nums w-10 text-right">{value.toLocaleString()}</span>
    </div>
  );
}

// ── KPI card ──────────────────────────────────────────────────────────────────
function KpiCard({
  label, value, sub, icon: Icon, color, glow, trend, wow,
}: {
  label: string; value: string | number; sub?: string;
  icon: React.ElementType; color: string; glow: string;
  trend?: number[]; wow?: number;
}) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-3 transition-all hover:scale-[1.01]"
      style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)", boxShadow: "var(--shadow-card)" }}
    >
      <div className="flex items-center justify-between">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: glow }}>
          <Icon size={16} style={{ color }} />
        </div>
        {wow !== undefined && (
          <span
            className="text-[11px] font-bold px-2 py-0.5 rounded-full"
            style={{
              background: wow >= 0 ? "rgba(52,211,153,0.12)" : "rgba(248,113,113,0.10)",
              color:      wow >= 0 ? "#34D399"                : "#F87171",
              border:     `1px solid ${wow >= 0 ? "rgba(52,211,153,0.25)" : "rgba(248,113,113,0.22)"}`,
            }}
          >
            {wow >= 0 ? "+" : ""}{wow}% WoW
          </span>
        )}
      </div>

      {trend && trend.length > 1 && (
        <div className="-mx-1 opacity-80">
          <Sparkline data={trend} color={color} height={36} />
        </div>
      )}

      <div>
        <p className="text-2xl font-bold tabular-nums">{typeof value === "number" ? value.toLocaleString() : value}</p>
        <p className="text-xs font-semibold text-muted-foreground mt-0.5">{label}</p>
        {sub && <p className="text-[11px] text-muted-foreground">{sub}</p>}
      </div>
    </div>
  );
}

// ── Section card wrapper ──────────────────────────────────────────────────────
function Card({ title, icon: Icon, children, className = "" }: {
  title: string; icon: React.ElementType; children: React.ReactNode; className?: string;
}) {
  return (
    <div
      className={`rounded-2xl p-6 ${className}`}
      style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)", boxShadow: "var(--shadow-card)" }}
    >
      <div className="flex items-center gap-2 mb-5 pb-3" style={{ borderBottom: "1px solid var(--ms-border-subtle)" }}>
        <Icon size={14} style={{ color: "var(--ms-accent-sky)" }} />
        <h2 className="text-sm font-bold">{title}</h2>
      </div>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function AdminAnalyticsPage() {
  const [data, setData]     = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState("");

  const load = async () => {
    setLoading(true); setError("");
    try {
      const r = await getAdminAnalytics();
      setData(r.data.data);
    } catch {
      setError("Failed to load analytics data.");
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const kpi     = data?.kpi;
  const charts  = data?.charts;
  const reg30   = charts?.registrations_30d.map((p) => p.count) ?? [];
  const sub30   = charts?.submissions_30d.map((p) => p.count) ?? [];
  const maxCareer  = Math.max(...(charts?.top_careers ?? []).map((c) => c.count), 1);
  const maxEdu     = Math.max(...(charts?.by_education ?? []).map((e) => e.count), 1);
  const maxCity    = Math.max(...(charts?.by_city ?? []).map((c) => c.count), 1);
  const maxTestSub = Math.max(...(charts?.test_performance ?? []).map((t) => t.submissions), 1);

  const kpiCards = kpi ? [
    { label: "Total Students",    value: kpi.total_students,  icon: Users,        color: "var(--ms-accent-cyan)", glow: "rgba(34,211,238,0.12)", trend: reg30, wow: kpi.wow_students },
    { label: "Tests Completed",   value: kpi.total_subs,      icon: FileQuestion, color: "var(--ms-accent-sky)",  glow: "rgba(14,165,233,0.12)", trend: sub30 },
    { label: "Avg Test Score",    value: `${kpi.avg_test_score} pts`, icon: TrendingUp, color: "#34D399", glow: "rgba(52,211,153,0.12)" },
    { label: "Recommendations",   value: kpi.total_recs,      icon: Sparkles,     color: "#A78BFA",               glow: "rgba(167,139,250,0.12)" },
    { label: "Avg Match Score",   value: `${kpi.avg_match_score}%`, icon: BarChart3, color: "#F59E0B",   glow: "rgba(245,158,11,0.12)" },
  ] : [];

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <BarChart3 size={20} style={{ color: "var(--ms-accent-cyan)" }} />
            Analytics & Statistics
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Real-time platform metrics — last 30 days
          </p>
        </div>
        <button
          onClick={load} disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
          style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)", color: "var(--ms-accent-sky)" }}
        >
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-xl px-4 py-3 text-sm font-medium" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.20)", color: "#EF4444" }}>
          {error}
        </div>
      )}

      {/* KPI row */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => <div key={i} className="rounded-2xl h-36 animate-pulse" style={{ background: "var(--ms-bg-card)" }} />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {kpiCards.map((c) => <KpiCard key={c.label} {...c} />)}
        </div>
      )}

      {/* Row 2: Registration trend + Submission trend */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <Card title="Student Registrations — 30 days" icon={Users}>
          {loading ? <div className="h-24 rounded-xl animate-pulse" style={{ background: "var(--ms-border-subtle)" }} />
          : reg30.every((v) => v === 0) ? <p className="text-sm text-muted-foreground">No registrations in this period.</p>
          : (
            <>
              <Sparkline data={reg30} color="var(--ms-accent-cyan)" height={80} />
              <div className="flex items-center justify-between mt-2 text-[11px] text-muted-foreground">
                <span>{charts?.registrations_30d[0]?.date}</span>
                <span className="font-bold" style={{ color: "var(--ms-accent-cyan)" }}>
                  {reg30.reduce((a, b) => a + b, 0)} total
                </span>
                <span>{charts?.registrations_30d[charts.registrations_30d.length - 1]?.date}</span>
              </div>
            </>
          )}
        </Card>

        <Card title="Test Submissions — 30 days" icon={FileQuestion}>
          {loading ? <div className="h-24 rounded-xl animate-pulse" style={{ background: "var(--ms-border-subtle)" }} />
          : sub30.every((v) => v === 0) ? <p className="text-sm text-muted-foreground">No submissions in this period.</p>
          : (
            <>
              <Sparkline data={sub30} color="var(--ms-accent-sky)" height={80} />
              <div className="flex items-center justify-between mt-2 text-[11px] text-muted-foreground">
                <span>{charts?.submissions_30d[0]?.date}</span>
                <span className="font-bold" style={{ color: "var(--ms-accent-sky)" }}>
                  {sub30.reduce((a, b) => a + b, 0)} total
                </span>
                <span>{charts?.submissions_30d[charts.submissions_30d.length - 1]?.date}</span>
              </div>
            </>
          )}
        </Card>
      </div>

      {/* Row 3: Top careers + Test performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <Card title="Most Recommended Careers" icon={Sparkles}>
          {loading ? (
            <div className="space-y-3">{[...Array(6)].map((_, i) => <div key={i} className="h-4 rounded animate-pulse" style={{ background: "var(--ms-border-subtle)" }} />)}</div>
          ) : (charts?.top_careers ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">No recommendations generated yet.</p>
          ) : (
            <div className="space-y-3">
              {(charts?.top_careers ?? []).map((c, i) => (
                <HBar
                  key={i}
                  label={c.career}
                  value={c.count}
                  max={maxCareer}
                  sub={`${c.category} · avg ${c.avg_score}%`}
                  color={i === 0 ? "#A78BFA" : i === 1 ? "var(--ms-accent-sky)" : "var(--ms-accent-cyan)"}
                />
              ))}
            </div>
          )}
        </Card>

        <Card title="Test Performance" icon={FileQuestion}>
          {loading ? (
            <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-4 rounded animate-pulse" style={{ background: "var(--ms-border-subtle)" }} />)}</div>
          ) : (charts?.test_performance ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">No test data yet.</p>
          ) : (
            <div className="space-y-3">
              {(charts?.test_performance ?? []).map((t, i) => (
                <HBar
                  key={i}
                  label={t.test}
                  value={t.submissions}
                  max={maxTestSub}
                  sub={`avg score: ${t.avg_score} pts`}
                  color={i === 0 ? "var(--ms-accent-sky)" : "#34D399"}
                />
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Row 4: Education level + City breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <Card title="Students by Education Level" icon={GraduationCap}>
          {loading ? (
            <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-4 rounded animate-pulse" style={{ background: "var(--ms-border-subtle)" }} />)}</div>
          ) : (charts?.by_education ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">No profile data yet.</p>
          ) : (
            <div className="space-y-3">
              {(charts?.by_education ?? []).map((e, i) => (
                <HBar
                  key={i}
                  label={e.level}
                  value={e.count}
                  max={maxEdu}
                  color={["var(--ms-accent-cyan)", "var(--ms-accent-sky)", "#34D399", "#A78BFA", "#F59E0B"][i % 5]}
                />
              ))}
            </div>
          )}
        </Card>

        <Card title="Students by City (Top 8)" icon={MapPin}>
          {loading ? (
            <div className="space-y-3">{[...Array(6)].map((_, i) => <div key={i} className="h-4 rounded animate-pulse" style={{ background: "var(--ms-border-subtle)" }} />)}</div>
          ) : (charts?.by_city ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">No city data available.</p>
          ) : (
            <div className="space-y-3">
              {(charts?.by_city ?? []).map((c, i) => (
                <HBar
                  key={i}
                  label={c.city}
                  value={c.count}
                  max={maxCity}
                  color={["#F59E0B", "var(--ms-accent-sky)", "var(--ms-accent-cyan)", "#A78BFA", "#34D399"][i % 5]}
                />
              ))}
            </div>
          )}
        </Card>
      </div>

    </div>
  );
}
