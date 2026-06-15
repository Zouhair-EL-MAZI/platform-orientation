import { useState, useEffect } from "react";
import {
  BarChart3, TrendingUp, Users, FileQuestion,
  Sparkles, RefreshCw, MapPin, GraduationCap,
} from "lucide-react";
import api from "@/lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────
interface AnalyticsData {
  kpi: { total_students: number; total_subs: number; avg_test_score: number; total_recs: number; avg_match_score: number; wow_students: number };
  charts: {
    registrations_30d: { date: string; count: number }[];
    submissions_30d:   { date: string; count: number }[];
    top_careers:       { career: string; count: number; avg_score: number }[];
    test_performance:  { test: string; submissions: number; avg_score: number }[];
    by_education:      { level: string; count: number }[];
    by_city:           { city: string; count: number }[];
  };
}

// ─── SVG sparkline ────────────────────────────────────────────────────────────
function Sparkline({ data, color, h = 48 }: { data: number[]; color: string; h?: number }) {
  if (!data.length || data.every((v) => v === 0)) return (
    <div className="flex items-center justify-center text-[10px] h-12" style={{ color: "hsl(var(--muted-foreground))", opacity: 0.4 }}>no data yet</div>
  );
  const max = Math.max(...data, 1);
  const W = 280;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = h - 2 - ((v / max) * (h - 6));
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${h}`} className="w-full" style={{ height: h }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={`0,${h} ${pts} ${W},${h}`} fill={color} fillOpacity="0.08" stroke="none" />
    </svg>
  );
}

// ─── Horizontal bar ───────────────────────────────────────────────────────────
function HBar({ label, value, max, color, sub }: { label: string; value: number; max: number; color: string; sub?: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex items-center gap-3 group">
      <div className="w-32 flex-shrink-0">
        <p className="text-xs font-medium truncate group-hover:opacity-80 transition-opacity">{label}</p>
        {sub && <p className="text-[10px]" style={{ color: "hsl(var(--muted-foreground))" }}>{sub}</p>}
      </div>
      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "var(--ms-border-subtle)" }}>
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-xs font-bold tabular-nums w-8 text-right">{value.toLocaleString()}</span>
    </div>
  );
}

// ─── KPI card ─────────────────────────────────────────────────────────────────
function KpiCard({ label, value, icon: Icon, color, glow, wow }: {
  label: string; value: string | number;
  icon: React.ElementType; color: string; glow: string; wow?: number;
}) {
  return (
    <div className="rounded-2xl p-4 flex items-center gap-3 transition-all hover:scale-[1.01]"
      style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)", backdropFilter: "blur(12px)" }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: glow }}>
        <Icon size={18} style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xl font-bold tabular-nums leading-tight">{typeof value === "number" ? value.toLocaleString() : value}</p>
        <p className="text-[11px] font-medium truncate" style={{ color: "hsl(var(--muted-foreground))" }}>{label}</p>
      </div>
      {wow !== undefined && (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
          style={{
            background: wow >= 0 ? "rgba(52,211,153,0.10)"  : "rgba(248,113,113,0.08)",
            color:      wow >= 0 ? "#34D399"                 : "#F87171",
            border:     wow >= 0 ? "1px solid rgba(52,211,153,0.22)" : "1px solid rgba(248,113,113,0.18)",
          }}>
          {wow >= 0 ? "+" : ""}{wow}%
        </span>
      )}
    </div>
  );
}

// ─── Section card ─────────────────────────────────────────────────────────────
function Card({ title, icon: Icon, color = "var(--ms-accent-cyan)", children }: {
  title: string; icon: React.ElementType; color?: string; children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)", backdropFilter: "blur(12px)" }}>
      <div className="flex items-center gap-2 px-5 py-4" style={{ borderBottom: "1px solid var(--ms-border-subtle)" }}>
        <Icon size={14} style={{ color }} />
        <h2 className="text-sm font-bold">{title}</h2>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
const AdminAnalyticsPage = () => {
  const [data,    setData]    = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  const load = async () => {
    setLoading(true); setError("");
    try {
      const r = await api.get("/admin/analytics");
      setData(r.data.data);
    } catch {
      setError("Failed to load analytics data.");
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const kpi    = data?.kpi;
  const charts = data?.charts;
  const reg    = charts?.registrations_30d.map((p) => p.count) ?? [];
  const sub    = charts?.submissions_30d.map((p) => p.count) ?? [];

  const maxCareer = Math.max(...(charts?.top_careers ?? []).map((c) => c.count), 1);
  const maxTestSub = Math.max(...(charts?.test_performance ?? []).map((t) => t.submissions), 1);
  const maxEdu    = Math.max(...(charts?.by_education ?? []).map((e) => e.count), 1);
  const maxCity   = Math.max(...(charts?.by_city ?? []).map((c) => c.count), 1);

  const PALETTE = ["var(--ms-accent-cyan)", "var(--ms-accent-sky)", "#34D399", "#A78BFA", "#F59E0B"];

  const SkeletonBar = () => (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-32 h-3 rounded animate-pulse" style={{ background: "var(--ms-border-subtle)" }} />
          <div className="flex-1 h-2 rounded-full animate-pulse" style={{ background: "var(--ms-border-subtle)" }} />
          <div className="w-6 h-3 rounded animate-pulse" style={{ background: "var(--ms-border-subtle)" }} />
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <BarChart3 size={18} style={{ color: "var(--ms-accent-cyan)" }} />
            Analytics
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>
            Real-time platform metrics — last 30 days
          </p>
        </div>
        <button onClick={load} disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
          style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)", color: "var(--ms-accent-sky)" }}>
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-xl px-4 py-3 text-sm font-medium"
          style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.18)", color: "#F87171" }}>
          {error}
        </div>
      )}

      {/* KPI row */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[...Array(5)].map((_, i) => <div key={i} className="rounded-2xl h-20 animate-pulse" style={{ background: "var(--ms-bg-card)" }} />)}
        </div>
      ) : kpi ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <KpiCard label="Total Students"   value={kpi.total_students}  icon={Users}        color="var(--ms-accent-cyan)" glow="rgba(34,211,238,0.12)" wow={kpi.wow_students} />
          <KpiCard label="Tests Completed"  value={kpi.total_subs}      icon={FileQuestion} color="var(--ms-accent-sky)"  glow="rgba(14,165,233,0.12)" />
          <KpiCard label="Avg Test Score"   value={`${kpi.avg_test_score} pts`} icon={TrendingUp} color="#34D399" glow="rgba(52,211,153,0.12)" />
          <KpiCard label="AI Recs"          value={kpi.total_recs}      icon={Sparkles}     color="#A78BFA"               glow="rgba(167,139,250,0.12)" />
          <KpiCard label="Avg Match Score"  value={`${kpi.avg_match_score}%`} icon={BarChart3} color="#F59E0B"            glow="rgba(245,158,11,0.12)" />
        </div>
      ) : null}

      {/* Trend charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card title="Student Registrations — 30 days" icon={Users}>
          {loading
            ? <div className="h-14 rounded animate-pulse" style={{ background: "var(--ms-border-subtle)" }} />
            : <>
              <Sparkline data={reg} color="var(--ms-accent-cyan)" />
              <div className="flex justify-between text-[10px] mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>
                <span>{charts?.registrations_30d[0]?.date}</span>
                <span className="font-bold" style={{ color: "var(--ms-accent-cyan)" }}>{reg.reduce((a, b) => a + b, 0)} total</span>
                <span>{charts?.registrations_30d.at(-1)?.date}</span>
              </div>
            </>
          }
        </Card>

        <Card title="Test Submissions — 30 days" icon={FileQuestion} color="var(--ms-accent-sky)">
          {loading
            ? <div className="h-14 rounded animate-pulse" style={{ background: "var(--ms-border-subtle)" }} />
            : <>
              <Sparkline data={sub} color="var(--ms-accent-sky)" />
              <div className="flex justify-between text-[10px] mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>
                <span>{charts?.submissions_30d[0]?.date}</span>
                <span className="font-bold" style={{ color: "var(--ms-accent-sky)" }}>{sub.reduce((a, b) => a + b, 0)} total</span>
                <span>{charts?.submissions_30d.at(-1)?.date}</span>
              </div>
            </>
          }
        </Card>
      </div>

      {/* Bar charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card title="Most Recommended Careers" icon={Sparkles} color="#A78BFA">
          {loading ? <SkeletonBar /> : (charts?.top_careers ?? []).length === 0
            ? <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>No recommendation data yet.</p>
            : <div className="space-y-3">
              {(charts?.top_careers ?? []).map((c, i) => (
                <HBar key={i} label={c.career} value={c.count} max={maxCareer}
                  sub={`avg ${c.avg_score}%`} color={PALETTE[i % PALETTE.length]} />
              ))}
            </div>
          }
        </Card>

        <Card title="Test Performance" icon={FileQuestion} color="var(--ms-accent-sky)">
          {loading ? <SkeletonBar /> : (charts?.test_performance ?? []).length === 0
            ? <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>No test submissions yet.</p>
            : <div className="space-y-3">
              {(charts?.test_performance ?? []).map((t, i) => (
                <HBar key={i} label={t.test} value={t.submissions} max={maxTestSub}
                  sub={`avg ${t.avg_score} pts`} color={PALETTE[i % PALETTE.length]} />
              ))}
            </div>
          }
        </Card>

        <Card title="Students by Education Level" icon={GraduationCap} color="#34D399">
          {loading ? <SkeletonBar /> : (charts?.by_education ?? []).length === 0
            ? <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>No profile data yet.</p>
            : <div className="space-y-3">
              {(charts?.by_education ?? []).map((e, i) => (
                <HBar key={i} label={e.level} value={e.count} max={maxEdu} color={PALETTE[i % PALETTE.length]} />
              ))}
            </div>
          }
        </Card>

        <Card title="Students by City (Top 8)" icon={MapPin} color="#F59E0B">
          {loading ? <SkeletonBar /> : (charts?.by_city ?? []).length === 0
            ? <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>No city data yet.</p>
            : <div className="space-y-3">
              {(charts?.by_city ?? []).map((c, i) => (
                <HBar key={i} label={c.city} value={c.count} max={maxCity} color={PALETTE[i % PALETTE.length]} />
              ))}
            </div>
          }
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
