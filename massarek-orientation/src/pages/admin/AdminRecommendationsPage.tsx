import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Sparkles, Search, RefreshCw, CheckCircle, AlertCircle, Eye, User, X } from "lucide-react";
import { getAdminRecommendations, regenerateAdminRecommendations, AdminRecommendation } from "@/services/adminApi";

const statusStyle = (s: string) => {
  if (s === "Generated")
    return { background: "rgba(52,211,153,0.12)", color: "#34D399", border: "1px solid rgba(52,211,153,0.24)" };
  return { background: "rgba(251,191,36,0.20)", color: "#FBBF24", border: "1px solid rgba(251,191,36,0.30)" };
};

const AdminRecommendationsPage = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [filterReviewed, setFilterReviewed] = useState<"all" | "reviewed" | "unreviewed">("all");
  const [recs, setRecs] = useState<AdminRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [regenLoading, setRegenLoading] = useState(false);
  const [viewingRec, setViewingRec] = useState<any>(null);
  const [editingRec, setEditingRec] = useState<any>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getAdminRecommendations();
      setRecs(res.data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleRegenerate = async () => {
    setRegenLoading(true);
    try {
      await regenerateAdminRecommendations();
      await load();
    } catch (e) {
      console.error(e);
    } finally {
      setRegenLoading(false);
    }
  };

  const normalized = recs.map(r => ({
    ...r,
    userName: typeof r.user === "string" ? r.user : (r.user?.name || ""),
    userEmail: typeof r.user === "object" ? r.user?.email : (r.email || ""),
    recommendations: Array.isArray(r.recommendations) ? r.recommendations : (r.career ? [r.career] : []),
    topScore: r.topScore || r.match_score || 0,
    status: r.status || "Generated",
    reviewed: r.reviewed ?? false,
  }));

  const filtered = normalized.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch = r.userName.toLowerCase().includes(q) || r.userEmail.toLowerCase().includes(q);
    const matchReview =
      filterReviewed === "all" ||
      (filterReviewed === "reviewed" && r.reviewed) ||
      (filterReviewed === "unreviewed" && !r.reviewed);
    return matchSearch && matchReview;
  });

  const totalGenerated = normalized.filter(r => r.status === "Generated").length;
  const pending = normalized.filter(r => r.status === "Pending").length;
  const reviewedCount = normalized.filter(r => r.reviewed).length;
  const avgTop = normalized.length ? Math.round(normalized.reduce((a, b) => a + b.topScore, 0) / normalized.length) : 0;

  return (
    <>
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles size={22} style={{ color: "var(--ms-accent-cyan)" }} />
            {t("admin.recommendations.title")}
          </h1>
          <p className="text-sm mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>
            {t("admin.recommendations.subtitle")}
          </p>
        </div>
        {/* "Regenerate All" button removed from frontend as requested */}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: t("admin.recommendations.summary.totalGenerated"), value: totalGenerated, color: "#34D399" },
          { label: t("admin.recommendations.summary.pendingGeneration"), value: pending, color: "#FBBF24" },
          { label: t("admin.recommendations.summary.avgTopScore"), value: `${avgTop}%`, color: "var(--ms-accent-sky)" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl p-5 card-top-glow"
            style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)", backdropFilter: "blur(12px)" }}
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl" style={{ background: `linear-gradient(90deg, transparent, ${s.color}, transparent)` }} />
            <div className="text-2xl font-bold mb-1" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="rounded-2xl p-4 flex flex-wrap gap-3 items-center" style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)", backdropFilter: "blur(12px)" }}>
        <div className="relative flex items-center gap-2 flex-1 min-w-[200px] max-w-sm rounded-xl h-9 px-3" style={{ background: "var(--ms-bg-layer2)", border: "1px solid var(--ms-border-subtle)" }}>
          <Search size={13} className="text-muted-foreground" />
          <input type="text" placeholder={t("admin.recommendations.searchPlaceholder")} value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
        </div>
        {/* Filters removed per request: Tous / Revu / Non revu */}
      </div>

      {/* Recommendations Table */}
      <div className="rounded-2xl overflow-hidden card-top-glow" style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)", backdropFilter: "blur(12px)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--ms-border-subtle)" }}>
                {[t("admin.recommendations.table.student"), t("admin.recommendations.table.topRecommendations"), t("admin.recommendations.table.topScore"), t("admin.recommendations.table.testDate"), t("admin.recommendations.table.status"), "Actions"].map((h, i) => (
                      <th key={i} className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: "var(--ms-accent-cyan)", opacity: 0.65 }}>{h}</th>
                    ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="activity-hover" style={{ borderBottom: "1px solid var(--ms-border-subtle)" }}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: "linear-gradient(135deg, #1D4ED8, #0E7490)" }}>{r.userName.charAt(0) || "?"}</div>
                      <div>
                        <div className="font-semibold text-xs">{r.userName}</div>
                        <div className="text-[10px]" style={{ color: "hsl(var(--muted-foreground))" }}>{r.userEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap gap-1">
                      {r.recommendations.slice(0, 2).map((rec) => (
                        <span key={rec} className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "var(--ms-accent-glow)", color: "var(--ms-accent-sky)", border: "1px solid var(--ms-border-glow)" }}>{rec}</span>
                      ))}
                      {r.recommendations.length > 2 && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ color: "hsl(var(--muted-foreground))" }}>+{r.recommendations.length - 2}</span>}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-12 rounded-full overflow-hidden" style={{ background: "var(--ms-bg-layer3)" }}>
                        <div className="h-full progress-fill-glow" style={{ width: `${r.topScore}%` }} />
                      </div>
                      <span className="text-xs font-bold" style={{ color: "var(--ms-accent-sky)" }}>{r.topScore}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{r.created_at || r.testDate || "-"}</td>
                      <td className="px-5 py-3"><span className="text-xs font-bold px-2.5 py-1 rounded-full" style={statusStyle(r.status)}>{t(`admin.recommendations.status.${(r.status || "").toString().toLowerCase()}`, r.status)}</span></td>
                      <td className="px-5 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setViewingRec(r)} className="p-1.5 rounded-lg hover:text-[var(--ms-accent-cyan)]" style={{ color: "hsl(var(--muted-foreground))" }} title={t("admin.recommendations.view")}>
                        <Eye size={14} />
                      </button>
                      <button onClick={() => setEditingRec(r)} className="p-1.5 rounded-lg hover:text-[var(--ms-accent-sky)]" style={{ color: "hsl(var(--muted-foreground))" }} title={t("admin.recommendations.edit")}>
                        <User size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>

      {/* View Modal */}
      {viewingRec && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">{t("admin.recommendations.viewDetails")}</h2>
              <button onClick={() => setViewingRec(null)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-semibold">{t("admin.recommendations.table.student")}:</span> {viewingRec.userName}
              </div>
              <div>
                <span className="font-semibold">{t("admin.recommendations.table.topRecommendations")}:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {viewingRec.recommendations.map((r: string) => (
                    <span key={r} className="px-2 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100">{r}</span>
                  ))}
                </div>
              </div>
              <div>
                <span className="font-semibold">{t("admin.recommendations.table.topScore")}:</span> {viewingRec.topScore}%
              </div>
              <div>
                <span className="font-semibold">{t("admin.recommendations.table.testDate")}:</span> {viewingRec.created_at || "-"}
              </div>
            </div>
            <button onClick={() => setViewingRec(null)} className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">
              {t("admin.close")}
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingRec && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">{t("admin.recommendations.editDetails")}</h2>
              <button onClick={() => setEditingRec(null)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold mb-1">{t("admin.recommendations.table.student")}</label>
                <input type="text" value={editingRec.userName} readOnly className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-slate-800 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">{t("admin.recommendations.table.topRecommendations")}</label>
                <input type="text" value={editingRec.recommendations.join(", ")} readOnly className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-slate-800 text-sm" />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold">
                  <input type="checkbox" checked={editingRec.reviewed} onChange={(e) => setEditingRec({...editingRec, reviewed: e.target.checked})} className="rounded" />
                  {t("admin.recommendations.markReviewed")}
                </label>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditingRec(null)} className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800">
                {t("admin.cancel")}
              </button>
              <button onClick={() => { setEditingRec(null); }} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">
                {t("admin.save")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminRecommendationsPage;
