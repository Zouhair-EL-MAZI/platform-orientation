import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  Briefcase, Plus, Search, Edit2, Trash2, X, Save,
  Tag, ChevronLeft, ChevronRight, AlertCircle, TrendingUp,
} from "lucide-react";
import {
  getAdminCareers, createAdminCareer, updateAdminCareer, deleteAdminCareer,
  getAdminCareerCategories, AdminCareer, AdminCareerCategory,
} from "@/services/adminApi";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const DEMAND_STYLE: Record<string, { color: string; bg: string }> = {
  very_high: { color: "#34D399", bg: "rgba(52,211,153,0.10)" },
  high:      { color: "var(--ms-accent-sky)", bg: "rgba(14,165,233,0.10)" },
  medium:    { color: "#FBBF24", bg: "rgba(251,191,36,0.10)" },
  low:       { color: "hsl(var(--muted-foreground))", bg: "var(--ms-bg-layer2)" },
};

function DemandBadge({ level }: { level?: string }) {
  const key  = (level ?? "medium").toLowerCase();
  const s    = DEMAND_STYLE[key] ?? DEMAND_STYLE.medium;
  return (
    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full capitalize"
      style={{ background: s.bg, color: s.color, border: `1px solid ${s.color}30` }}>
      {key.replace("_", " ")}
    </span>
  );
}

function inputCls() {
  return "w-full mt-1 px-3 py-2 rounded-xl text-sm outline-none transition-all bg-gray-50 dark:bg-slate-700";
}
function inputStyle() {
  return { border: "1px solid var(--ms-border-subtle)", color: "inherit" };
}

// ─── Career Modal (Position Dynamique) ───────────────────────────────────────
function CareerModal({ career, categories, isOpen, onOpenChange, onSaved, position }: {
  career: AdminCareer | null; categories: AdminCareerCategory[];
  isOpen: boolean; onOpenChange: (open: boolean) => void; onSaved: () => void;
  position: { top: number; left: number };
}) {
  const { t } = useTranslation();
  const isEdit = !!career;
  const [title,       setTitle]       = useState(career?.title ?? "");
  const [description, setDescription] = useState(career?.description ?? "");
  const [catId,       setCatId]       = useState(String(career?.category_id ?? categories[0]?.id ?? ""));
  const [salary,      setSalary]      = useState(career?.salary_range ?? "");
  const [skills,      setSkills]      = useState((career?.required_skills ?? []).join(", "));
  const [futureScope, setFutureScope] = useState(career?.future_scope ?? "");
  const [moroccan,    setMoroccan]    = useState(career?.moroccan_context ?? "");
  const [demand,      setDemand]      = useState(career?.demand_level ?? "medium");
  const [saving,      setSaving]      = useState(false);
  const [error,       setError]       = useState("");
  const [adjustedPos, setAdjustedPos] = useState(position);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !modalRef.current) {
      setAdjustedPos(position);
      return;
    }
    
    // Centrer le modal à l'écran
    const modalWidth = 520; // max-w-xl
    const left = (window.innerWidth - modalWidth) / 2;
    const top = Math.max(16, window.scrollY + 80);
    
    setAdjustedPos({ top, left });
  }, [isOpen, position]);

  const handleSave = async () => {
    if (!title.trim()) { setError(t("admin.careers.titleRequired")); return; }
    if (!catId)        { setError(t("admin.careers.categoryRequired")); return; }
    setSaving(true); setError("");
    const payload = {
      title, description, category_id: Number(catId), salary_range: salary,
      required_skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
      future_scope: futureScope, moroccan_context: moroccan, demand_level: demand,
    };
    try {
      if (isEdit) await updateAdminCareer(career!.id, payload);
      else await createAdminCareer(payload);
      onSaved();
      onOpenChange(false);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? t("admin.careers.failedSave"));
    } finally { setSaving(false); }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop avec blur léger */}
      <div 
        className="fixed inset-0 z-40 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
        style={{ pointerEvents: "auto" }}
      />
      
      {/* Modal centré */}
      <div 
        ref={modalRef}
        className="fixed w-full max-w-xl bg-white dark:bg-[#131c35] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col z-50 left-1/2"
        style={{ 
          top: `${adjustedPos.top}px`, 
          transform: "translateX(-50%)",
          maxHeight: "calc(100vh - 2rem)",
          pointerEvents: "auto"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold">{isEdit ? t("admin.careers.editCareerTitle") : t("admin.careers.addCareerTitle")}</h2>
          <button onClick={() => onOpenChange(false)} className="p-1.5 rounded-lg text-slate-600 hover:text-red-500 dark:text-slate-300 dark:hover:text-red-400 transition-colors" style={{ border: "1px solid var(--ms-border-subtle)" }}><X size={14} /></button>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl px-3 py-2 mb-3 text-xs font-medium"
            style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.18)", color: "#F87171" }}>
            <AlertCircle size={13} /> {error}
          </div>
        )}

        <div className="flex-1 overflow-y-auto pr-2 space-y-4 mb-4">
          <div>
            <label className="text-xs font-semibold" style={{ color: "hsl(var(--muted-foreground))" }}>{t("admin.careers.labelTitle")} *</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls()} style={inputStyle()} disabled={saving} placeholder={t("admin.careers.titleExample")} />
          </div>
          <div>
            <label className="text-xs font-semibold" style={{ color: "hsl(var(--muted-foreground))" }}>{t("admin.careers.labelDescription")}</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className={inputCls() + " resize-none"} style={inputStyle()} disabled={saving} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold" style={{ color: "hsl(var(--muted-foreground))" }}>{t("admin.careers.labelCategory")} *</label>
              <select value={catId} onChange={(e) => setCatId(e.target.value)} className={inputCls()} style={inputStyle()} disabled={saving}>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold" style={{ color: "hsl(var(--muted-foreground))" }}>{t("admin.careers.labelDemand")}</label>
              <select value={demand} onChange={(e) => setDemand(e.target.value)} className={inputCls()} style={inputStyle()} disabled={saving}>
                {["low","medium","high","very_high"].map((d) => <option key={d} value={d}>{d.replace("_"," ")}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold" style={{ color: "hsl(var(--muted-foreground))" }}>{t("admin.careers.labelSalary")}</label>
            <input value={salary} onChange={(e) => setSalary(e.target.value)} className={inputCls()} style={inputStyle()} disabled={saving} placeholder={t("admin.careers.salaryExample")} />
          </div>
          <div>
            <label className="text-xs font-semibold" style={{ color: "hsl(var(--muted-foreground))" }}>{t("admin.careers.labelSkills")} <span className="font-normal opacity-60">{t("admin.careers.labelSkillsHint")}</span></label>
            <input value={skills} onChange={(e) => setSkills(e.target.value)} className={inputCls()} style={inputStyle()} disabled={saving} placeholder={t("admin.careers.skillsExample")} />
          </div>
          <div>
            <label className="text-xs font-semibold" style={{ color: "hsl(var(--muted-foreground))" }}>{t("admin.careers.labelFutureScope")}</label>
            <textarea value={futureScope} onChange={(e) => setFutureScope(e.target.value)} rows={2} className={inputCls() + " resize-none"} style={inputStyle()} disabled={saving} />
          </div>
          <div>
            <label className="text-xs font-semibold" style={{ color: "hsl(var(--muted-foreground))" }}>Moroccan Context</label>
            <textarea value={moroccan} onChange={(e) => setMoroccan(e.target.value)} rows={2} className={inputCls() + " resize-none"} style={inputStyle()} disabled={saving} />
          </div>
        </div>

        <div className="flex gap-3 mt-3">
          <button onClick={() => onOpenChange(false)} className="flex-1 py-2 rounded-xl text-sm font-semibold" style={{ background: "var(--ms-bg-layer2)", border: "1px solid var(--ms-border-subtle)" }}>
            {t("admin.cancel")}
          </button>
          <button onClick={handleSave} disabled={saving} className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-50" style={{ background: "linear-gradient(135deg,#1D4ED8,#0E7490)" }}>
            <Save size={14} /> {saving ? t("admin.saving") : t("admin.save")}
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Delete confirm ───────────────────────────────────────────────────────────
function DeleteModal({ career, onClose, onDeleted }: { career: AdminCareer; onClose: () => void; onDeleted: () => void }) {
  const { t } = useTranslation();
  const [deleting, setDeleting] = useState(false);
  const confirm = async () => {
    setDeleting(true);
    try { await deleteAdminCareer(career.id); onDeleted(); }
    catch { setDeleting(false); }
  };
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center  " onClick={onClose}>
      <div className="bg-white dark:bg-[#131c35] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-base font-bold mb-2">{t("admin.careers.confirmDelete")}</h2>
        <p className="text-sm mb-5" style={{ color: "hsl(var(--muted-foreground))" }}>Delete <strong>{career.title}</strong>?</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2 rounded-xl text-sm font-semibold" style={{ background: "var(--ms-bg-layer2)", border: "1px solid var(--ms-border-subtle)" }}>{t("admin.cancel")}</button>
          <button onClick={confirm} disabled={deleting} className="flex-1 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-50" style={{ background: "linear-gradient(135deg,#DC2626,#EF4444)" }}>
            {deleting ? "Deleting…" : t("admin.delete")}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
const AdminCareersPage = () => {
  const { t } = useTranslation();
  const [careers,     setCareers]    = useState<AdminCareer[]>([]);
  const [categories,  setCategories] = useState<AdminCareerCategory[]>([]);
  const [loading,     setLoading]    = useState(true);
  const [error,       setError]      = useState("");
  const [searchInput, setSearchInput]= useState("");
  const [search,      setSearch]     = useState("");
  const [catFilter,   setCatFilter]  = useState(0);
  const [page,        setPage]       = useState(1);
  const [lastPage,    setLastPage]   = useState(1);
  const [total,       setTotal]      = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCareer, setCurrentCareer] = useState<AdminCareer | null | "new">(null);
  const [toDelete,    setToDelete]   = useState<AdminCareer | null>(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const [cRes, catRes] = await Promise.all([
        getAdminCareers({ search, category_id: catFilter || undefined, page, per_page: 12 }),
        categories.length === 0 ? getAdminCareerCategories() : Promise.resolve(null),
      ]);
      const d = cRes.data as any;
      setCareers(d.data ?? []);
      setLastPage(d.meta?.last_page ?? d.last_page ?? 1);
      setTotal(d.meta?.total ?? d.total ?? 0);
      if (catRes) setCategories((catRes.data as any).data ?? []);
    } catch { setError("Failed to load careers."); }
    finally { setLoading(false); }
  }, [search, catFilter, page]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => { setSearch(searchInput); setPage(1); }, 350);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [searchInput]);

  const demandColor = (d?: string) => DEMAND_STYLE[(d ?? "").toLowerCase()]?.color ?? "hsl(var(--muted-foreground))";

  return (
    <div className="max-w-7xl mx-auto space-y-5 animate-fade-in">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold">{t("admin.careers.title")}</h1>
          <p className="text-sm mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>
            {total} {t("admin.careers.careerPaths")} · {categories.length} {t("admin.careers.categories")}
          </p>
        </div>
        <button onClick={(e) => {
          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
          const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
          const scrollTop = window.scrollY || document.documentElement.scrollTop;
          setModalPosition({ top: rect.top + scrollTop, left: rect.left + scrollLeft });
          setCurrentCareer("new");
          setIsModalOpen(true);
        }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{ background: "linear-gradient(135deg,#1D4ED8,#0E7490)", boxShadow: "0 4px 14px rgba(14,116,144,0.25)" }}>
          <Plus size={14} /> {t("admin.careers.addCareer")}
        </button>
      </div>

      {/* Stats per category */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button onClick={() => { setCatFilter(0); setPage(1); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
            style={!catFilter
              ? { background: "var(--ms-accent-glow)", border: "1px solid var(--ms-border-glow)", color: "var(--ms-accent-cyan)" }
              : { background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)", color: "hsl(var(--muted-foreground))" }
            }>
            <Tag size={11} /> {t("admin.careers.filterAll")} ({total})
          </button>
          {categories.map((c) => (
            <button key={c.id} onClick={() => { setCatFilter(c.id); setPage(1); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
              style={catFilter === c.id
                ? { background: "var(--ms-accent-glow)", border: "1px solid var(--ms-border-glow)", color: "var(--ms-accent-cyan)" }
                : { background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)", color: "hsl(var(--muted-foreground))" }
              }>
              {c.name} ({(c as any).careers_count ?? 0})
            </button>
          ))}
        </div>
      )}

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "hsl(var(--muted-foreground))" }} />
        <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
          placeholder={t("admin.careers.searchPlaceholder")}
          className="w-full pl-8 pr-3 py-2 text-sm rounded-xl outline-none"
          style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)", color: "inherit" }} />
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium"
          style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.18)", color: "#F87171" }}>
          <AlertCircle size={14} /> {error}
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="rounded-2xl h-48 animate-pulse" style={{ background: "var(--ms-bg-card)" }} />)}
        </div>
      ) : careers.length === 0 ? (
        <div className="text-center py-20">
          <Briefcase size={32} className="mx-auto mb-3 opacity-20" />
          <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>No careers found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {careers.map((c) => (
            <div key={c.id} className="rounded-2xl p-5 flex flex-col gap-3 transition-all hover:scale-[1.01]"
              style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)", backdropFilter: "blur(12px)" }}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-bold text-sm truncate">{c.title}</h3>
                  <p className="text-[11px] font-medium mt-0.5" style={{ color: "var(--ms-accent-sky)" }}>
                    {(c as any).category?.name ?? "—"}
                  </p>
                </div>
                <div className="flex gap-1.5 flex-shrink-0">
                  <button 
                    onClick={(e) => {
                      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                      const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
                      const scrollTop = window.scrollY || document.documentElement.scrollTop;
                      setModalPosition({ top: rect.top + scrollTop, left: rect.left + scrollLeft });
                      setCurrentCareer(c);
                      setIsModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg transition-all hover:opacity-80"
                    style={{ background: "var(--ms-accent-glow)", border: "1px solid var(--ms-border-glow)", color: "var(--ms-accent-sky)" }}>
                    <Edit2 size={12} />
                  </button>
                  <button onClick={() => setToDelete(c)}
                    className="p-1.5 rounded-lg transition-all hover:opacity-80"
                    style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.18)", color: "#F87171" }}>
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>

              {c.description && (
                <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "hsl(var(--muted-foreground))" }}>{c.description}</p>
              )}

              <div className="flex items-center gap-2 flex-wrap">
                <DemandBadge level={c.demand_level} />
                {c.salary_range && (
                  <span className="text-[10px] font-medium" style={{ color: "hsl(var(--muted-foreground))" }}>{c.salary_range}</span>
                )}
                {(c as any).recommendations_count > 0 && (
                  <span className="text-[10px] font-bold ml-auto" style={{ color: "#A78BFA" }}>
                    <TrendingUp size={10} className="inline mr-0.5" />{(c as any).recommendations_count}
                  </span>
                )}
              </div>

              {(c.required_skills ?? []).length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {(c.required_skills ?? []).slice(0, 3).map((s) => (
                    <span key={s} className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                      style={{ background: "var(--ms-accent-glow)", color: "var(--ms-accent-sky)", border: "1px solid var(--ms-border-glow)" }}>
                      {s}
                    </span>
                  ))}
                  {(c.required_skills ?? []).length > 3 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ color: "hsl(var(--muted-foreground))" }}>
                      +{(c.required_skills ?? []).length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {lastPage > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
            className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg disabled:opacity-40"
            style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)" }}>
            <ChevronLeft size={13} /> Prev
          </button>
          <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{page} / {lastPage}</span>
          <button onClick={() => setPage((p) => Math.min(lastPage, p + 1))} disabled={page === lastPage}
            className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg disabled:opacity-40"
            style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)" }}>
            Next <ChevronRight size={13} />
          </button>
        </div>
      )}

      <CareerModal career={currentCareer === "new" ? null : (currentCareer as AdminCareer)} categories={categories}
        isOpen={isModalOpen} onOpenChange={setIsModalOpen} 
        position={modalPosition} onSaved={() => { setIsModalOpen(false); setCurrentCareer(null); load(); }} />
      {toDelete && (
        <DeleteModal career={toDelete} onClose={() => setToDelete(null)}
          onDeleted={() => { setToDelete(null); load(); }} />
      )}
    </div>
  );
};

export default AdminCareersPage;
