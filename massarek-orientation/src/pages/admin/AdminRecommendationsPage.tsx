import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  Sparkles, Search, ChevronLeft, ChevronRight, TrendingUp, BarChart3,
} from "lucide-react";
import { getAdminRecommendations } from "@/services/adminApi";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Rec {
  id: number;
  user: { name: string; email: string };
  career: string;
  category: string;
  match_score: number;
  created_at: string;
  created_human: string;
}
interface Analytics {
  total: number;
  avg_score: number;
  top_careers: { career: string; count: number; avg_score: number }[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function Avatar({ name }: { name: string }) {
  return (
    <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
      style={{ background: "linear-gradient(135deg,#1D4ED8,#0E7490)" }}>
      {name?.charAt(0)?.toUpperCase() ?? "?"}
    </div>
  );
}

function ScoreBar({ score }: { score: number }) {
  const n = Number(score);
  const color = n >= 80 ? "#34D399" : n >= 60 ? "var(--ms-accent-sky)" : "#FBBF24";
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--ms-border-subtle)" }}>
        <div className="h-full rounded-full" style={{ width: `${Math.min(n, 100)}%`, background: color }} />
      </div>
      <span className="text-xs font-bold tabular-nums" style={{ color }}>{n}%</span>
    </div>
  );
}

function HBar({ label, value, max, color, sub }: { label: string; value: number; max: number; color: string; sub?: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="w-32 flex-shrink-0 min-w-0">
        <p className="text-xs font-medium truncate">{label}</p>
        {sub && <p className="text-[10px]" style={{ color: "hsl(var(--muted-foreground))" }}>{sub}</p>}
      </div>
      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "var(--ms-border-subtle)" }}>
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-xs font-bold tabular-nums w-8 text-right">{value}</span>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
const AdminRecommendationsPage = () => {
  const { t } = useTranslation();
  const [recs,      setRecs]      = useState<Rec[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search,    setSearch]    = useState("");
  const [page,      setPage]      = useState(1);
  const [lastPage,  setLastPage]  = useState(1);
  const [total,     setTotal]     = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const r = await getAdminRecommendations({ search, page, per_page: 15 });
      const d = r.data as any;
      setRecs(d.data ?? []);
      setAnalytics(d.analytics ?? null);
      setLastPage(d.meta?.last_page ?? 1);
      setTotal(d.meta?.total ?? 0);
    } catch { setError(t("admin.recommendations.failedLoad")); }
    finally { setLoading(false); }
  }, [search, page, t]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => { setSearch(searchInput); setPage(1); }, 350);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [searchInput]);

  const maxCareer = Math.max(...(analytics?.top_careers ?? []).map((c) => c.count), 1);

  return (
    <div className="max-w-7xl mx-auto space-y-5 animate-fade-in">

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Sparkles size={18} style={{ color: "#A78BFA" }} />
          {t("admin.recommendations.title")}
        </h1>
        <p className="text-sm mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>
          {t("admin.recommendations.subtitle")}
        </p>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: t("admin.recommendations.summary.totalGenerated"), value: analytics?.total ?? 0,     color: "#A78BFA", icon: Sparkles },
          { label: t("admin.recommendations.summary.avgTopScore"),    value: `${analytics?.avg_score ?? 0}%`, color: "#34D399", icon: TrendingUp },
          { label: "Unique Careers",                                   value: analytics?.top_careers.length ?? 0, color: "var(--ms-accent-sky)", icon: BarChart3 },
        ].map((s) => (
          <div key={s.label} className="rounded-xl px-4 py-3 flex items-center gap-3"
            style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)" }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${s.color}18` }}>
              <s.icon size={15} style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-base font-bold tabular-nums">{typeof s.value === "number" ? s.value.toLocaleString() : s.value}</p>
              <p className="text-[10px]" style={{ color: "hsl(var(--muted-foreground))" }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative max-w-sm">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "hsl(var(--muted-foreground))" }} />
            <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
              placeholder={t("admin.recommendations.searchPlaceholder")}
              className="w-full pl-8 pr-3 py-2 text-sm rounded-xl outline-none"
              style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)", color: "inherit" }} />
          </div>

          <div className="rounded-2xl overflow-hidden"
            style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)" }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--ms-border-subtle)" }}>
                    {[t("admin.recommendations.table.student"), "Career", "Score", "Date"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider"
                        style={{ color: "hsl(var(--muted-foreground))" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    [...Array(8)].map((_, i) => (
                      <tr key={i}>
                        {[120, 120, 80, 70].map((w, j) => (
                          <td key={j} className="px-4 py-3">
                            <div className="h-4 rounded animate-pulse" style={{ background: "var(--ms-border-subtle)", width: w }} />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : recs.length === 0 ? (
                    <tr><td colSpan={4} className="px-4 py-16 text-center text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>No recommendations found.</td></tr>
                  ) : recs.map((r) => (
                    <tr key={r.id} className="transition-colors hover:bg-[var(--ms-accent-glow)]"
                      style={{ borderTop: "1px solid var(--ms-border-subtle)" }}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={r.user.name} />
                          <div className="min-w-0">
                            <p className="text-xs font-semibold truncate max-w-[100px]">{r.user.name}</p>
                            <p className="text-[10px] truncate max-w-[100px]" style={{ color: "hsl(var(--muted-foreground))" }}>{r.user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs font-medium truncate max-w-[120px]">{r.career}</p>
                        {r.category && <p className="text-[10px]" style={{ color: "hsl(var(--muted-foreground))" }}>{r.category}</p>}
                      </td>
                      <td className="px-4 py-3"><ScoreBar score={r.match_score} /></td>
                      <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: "hsl(var(--muted-foreground))" }}>{r.created_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {lastPage > 1 && (
              <div className="flex items-center justify-between px-4 py-3" style={{ borderTop: "1px solid var(--ms-border-subtle)" }}>
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                  className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg disabled:opacity-40"
                  style={{ background: "var(--ms-bg-layer2)", border: "1px solid var(--ms-border-subtle)" }}>
                  <ChevronLeft size={13} /> Prev
                </button>
                <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                  {page} / {lastPage} · {total} total
                </span>
                <button onClick={() => setPage((p) => Math.min(lastPage, p + 1))} disabled={page === lastPage}
                  className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg disabled:opacity-40"
                  style={{ background: "var(--ms-bg-layer2)", border: "1px solid var(--ms-border-subtle)" }}>
                  Next <ChevronRight size={13} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Top careers analytics */}
        <div className="rounded-2xl p-5" style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)" }}>
          <h2 className="text-sm font-bold mb-4 flex items-center gap-2">
            <BarChart3 size={14} style={{ color: "#A78BFA" }} />
            {t("admin.recommendations.summary.totalGenerated").replace("Total","Most")}
          </h2>
          {loading ? (
            <div className="space-y-3">{[...Array(6)].map((_, i) => <div key={i} className="h-4 rounded animate-pulse" style={{ background: "var(--ms-border-subtle)" }} />)}</div>
          ) : (analytics?.top_careers ?? []).length === 0 ? (
            <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>No data yet.</p>
          ) : (
            <div className="space-y-4">
              {(analytics?.top_careers ?? []).map((c, i) => (
                <HBar key={i} label={c.career} value={c.count} max={maxCareer}
                  sub={`avg ${c.avg_score}%`}
                  color={i === 0 ? "#A78BFA" : i === 1 ? "var(--ms-accent-sky)" : "var(--ms-accent-cyan)"} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminRecommendationsPage;
