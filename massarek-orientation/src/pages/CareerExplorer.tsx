import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  Search, Briefcase, TrendingUp, DollarSign, X, ChevronDown,
  ChevronUp, Heart, BookOpen, MapPin, GraduationCap, Star,
  AlertCircle, RefreshCw, Filter,
} from "lucide-react";
import {
  getCareers, getCareerCategories, getCareer,
  type Career, type CareerCategory,
} from "@/services/studentApi";
import { toast } from "sonner";

// ─────────────────────────────────────────────────────────────────────────────
// Favorites — persisted in localStorage, never touches backend
// ─────────────────────────────────────────────────────────────────────────────
const FAV_KEY = "massarek_fav_careers";

function readFavs(): Set<number> {
  try {
    const raw = localStorage.getItem(FAV_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch { return new Set(); }
}

function writeFavs(ids: Set<number>): void {
  try { localStorage.setItem(FAV_KEY, JSON.stringify([...ids])); } catch {}
}

// ─────────────────────────────────────────────────────────────────────────────
// Demand level badge config
// ─────────────────────────────────────────────────────────────────────────────
function demandStyle(level?: string | null): { bg: string; color: string; border: string } {
  switch (level) {
    case "Very High": return { bg: "rgba(16,185,129,0.12)", color: "#059669", border: "rgba(16,185,129,0.30)" };
    case "High":      return { bg: "rgba(14,165,233,0.10)", color: "#0284C7", border: "rgba(14,165,233,0.28)" };
    case "Growing":   return { bg: "rgba(167,139,250,0.12)", color: "#7C3AED", border: "rgba(167,139,250,0.30)" };
    default:          return { bg: "rgba(245,158,11,0.10)", color: "#D97706", border: "rgba(245,158,11,0.28)" };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Career Detail Modal — full Moroccan context
// ─────────────────────────────────────────────────────────────────────────────
function CareerModal({
  career, isFav, onToggleFav, onClose,
}: {
  career: Career; isFav: boolean; onToggleFav: () => void; onClose: () => void;
}) {
  const ds = demandStyle(career.demand_level);
  const { t } = useTranslation();
  const [tab, setTab] = useState<"overview" | "morocco" | "skills">("overview");

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4"
      style={{ background: "rgba(0,0,0,0.60)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl max-h-[92vh] overflow-hidden flex flex-col ms-page-enter"
        style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-glow)", boxShadow: "0 24px 60px rgba(0,0,0,0.30)" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Top accent */}
        <div className="h-1 flex-shrink-0"
          style={{ background: "linear-gradient(90deg, #1E40AF, #0E7490, var(--ms-accent-cyan))" }} />

        {/* Header */}
        <div className="p-5 md:p-6 flex-shrink-0"
          style={{ borderBottom: "1px solid var(--ms-border-subtle)" }}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: "var(--ms-accent-glow)", border: "1px solid var(--ms-border-glow)", color: "var(--ms-accent-sky)" }}>
                  {career.category.name}
                </span>
                {career.demand_level && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"
                    style={{ background: ds.bg, border: `1px solid ${ds.border}`, color: ds.color }}>
                    <TrendingUp size={9} /> {career.demand_level}
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold leading-tight">{career.title}</h2>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={onToggleFav}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                style={isFav ? {
                  background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.30)",
                } : {
                  background: "var(--ms-accent-glow)", border: "1px solid var(--ms-border-subtle)",
                }}
                aria-label={isFav ? t("career.save.remove") : t("career.save.add")}
              >
                <Heart size={15} fill={isFav ? "#EF4444" : "none"}
                  style={{ color: isFav ? "#EF4444" : "var(--ms-accent-sky)" }} />
              </button>
              <button onClick={onClose}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                style={{ background: "var(--ms-accent-glow)", border: "1px solid var(--ms-border-subtle)" }}>
                <X size={14} style={{ color: "var(--ms-accent-sky)" }} />
              </button>
            </div>
          </div>

          {/* Meta row */}
          {career.salary_range && (
            <div className="flex items-center gap-1.5 mt-3 text-sm font-semibold"
              style={{ color: "#059669" }}>
              <DollarSign size={14} /> {career.salary_range}
            </div>
          )}
        </div>

        {/* Tab nav */}
        <div className="flex gap-1 px-5 pt-3 flex-shrink-0"
          style={{ borderBottom: "1px solid var(--ms-border-subtle)" }}>
          {[
            { key: "overview", label: t("career.modal.tab.overview") },
            { key: "morocco",  label: t("career.modal.tab.morocco") },
            { key: "skills",   label: t("career.modal.tab.skills") },
          ].map(t => (
            <button key={t.key}
              onClick={() => setTab(t.key as any)}
              className="px-4 py-2 text-xs font-bold rounded-t-xl transition-all border-b-2"
              style={{
                borderColor: tab === t.key ? "var(--ms-accent-cyan)" : "transparent",
                color: tab === t.key ? "var(--ms-accent-cyan)" : "var(--ms-accent-sky)",
                background: tab === t.key ? `${`var(--ms-accent-glow)`}` : "transparent",
                opacity: tab === t.key ? 1 : 0.6,
              }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content — scrollable */}
        <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-4">

          {/* Overview tab */}
          {tab === "overview" && (
            <>
              <p className="text-sm text-muted-foreground leading-relaxed">{career.description}</p>

              {career.future_scope && (
                <div className="rounded-xl p-4"
                  style={{ background: "var(--ms-bg-layer3)", border: "1px solid var(--ms-border-subtle)" }}>
                  <div className="flex items-center gap-1.5 mb-2">
                    <TrendingUp size={13} style={{ color: "#34D399" }} />
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "#34D399" }}>
                      {t("career.modal.careerProspects")}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{career.future_scope}</p>
                </div>
              )}
            </>
          )}

          {/* Morocco tab */}
          {tab === "morocco" && (
            <>
              {career.moroccan_context ? (
                <div className="rounded-xl p-4"
                  style={{ background: "rgba(30,64,175,0.06)", border: "1px solid rgba(30,64,175,0.15)" }}>
                  <div className="flex items-center gap-1.5 mb-2">
                    <MapPin size={13} style={{ color: "var(--ms-accent-sky)" }} />
                    <span className="text-xs font-bold uppercase tracking-wider"
                      style={{ color: "var(--ms-accent-sky)" }}>{t("career.modal.moroccanContext")}</span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--foreground))" }}>
                    {career.moroccan_context}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Moroccan context data not available for this career yet.
                </p>
              )}

              {career.recommended_schools && career.recommended_schools.length > 0 && (
                <div className="rounded-xl p-4"
                  style={{ background: "var(--ms-bg-layer3)", border: "1px solid var(--ms-border-subtle)" }}>
                  <div className="flex items-center gap-1.5 mb-3">
                    <GraduationCap size={13} style={{ color: "#A78BFA" }} />
                    <span className="text-xs font-bold uppercase tracking-wider"
                      style={{ color: "#A78BFA" }}>{t("career.modal.recommendedSchools")}</span>
                  </div>
                  <div className="space-y-1.5">
                    {career.recommended_schools.map(s => (
                      <div key={s} className="flex items-center gap-2 text-sm">
                        <Star size={10} style={{ color: "#A78BFA", flexShrink: 0 }} />
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Skills & Study tab */}
          {tab === "skills" && (
            <>
              {career.required_skills?.length > 0 && (
                <div className="rounded-xl p-4"
                  style={{ background: "var(--ms-bg-layer3)", border: "1px solid var(--ms-border-subtle)" }}>
                  <div className="flex items-center gap-1.5 mb-3">
                    <BookOpen size={13} style={{ color: "var(--ms-accent-cyan)" }} />
                    <span className="text-xs font-bold uppercase tracking-wider"
                      style={{ color: "var(--ms-accent-cyan)" }}>{t("career.modal.requiredSkills")}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {career.required_skills.map(s => (
                      <span key={s}
                        className="text-xs font-semibold px-3 py-1.5 rounded-full"
                        style={{ background: "rgba(34,211,238,0.10)", border: "1px solid rgba(34,211,238,0.22)", color: "var(--ms-accent-sky)" }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {career.study_paths && career.study_paths.length > 0 && (
                <div className="rounded-xl p-4"
                  style={{ background: "var(--ms-bg-layer3)", border: "1px solid var(--ms-border-subtle)" }}>
                  <div className="flex items-center gap-1.5 mb-3">
                    <GraduationCap size={13} style={{ color: "#F59E0B" }} />
                    <span className="text-xs font-bold uppercase tracking-wider"
                      style={{ color: "#F59E0B" }}>{t("career.modal.studyPaths")}</span>
                  </div>
                  <div className="space-y-2">
                    {career.study_paths.map((p, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5"
                          style={{ background: "rgba(245,158,11,0.15)", color: "#F59E0B" }}>
                          {i + 1}
                        </span>
                        <span className="text-muted-foreground leading-snug">{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CareerCard — rich card with favorite support
// ─────────────────────────────────────────────────────────────────────────────
function CareerCard({
  career, isFav, onToggleFav, onClick,
}: {
  career: Career; isFav: boolean; onToggleFav: (e: React.MouseEvent) => void; onClick: () => void;
}) {
  const ds = demandStyle(career.demand_level);
  const skills = career.required_skills ?? [];
  const { t } = useTranslation();

  return (
    <div
      className="ms-card-hover rounded-2xl overflow-hidden cursor-pointer group relative"
      style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)" }}
      onClick={onClick}
    >
      {/* Category color top strip */}
      <div className="h-1"
        style={{ background: `linear-gradient(90deg, transparent, var(--ms-accent-cyan)55, transparent)` }} />

      <div className="p-4 md:p-5">
        {/* Top row: badge + fav */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap flex-1 min-w-0">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
              style={{ background: "var(--ms-accent-glow)", border: "1px solid var(--ms-border-glow)", color: "var(--ms-accent-sky)" }}>
              {career.category.name}
            </span>
            {career.demand_level && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                style={{ background: ds.bg, border: `1px solid ${ds.border}`, color: ds.color }}>
                {career.demand_level}
              </span>
            )}
          </div>

          {/* Favorite button */}
          <button
            onClick={onToggleFav}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all flex-shrink-0 hover:scale-110"
            style={isFav ? {
              background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.25)",
            } : {
              background: "var(--ms-bg-layer3)", border: "1px solid var(--ms-border-subtle)",
            }}
            aria-label={isFav ? t("career.save.remove") : t("career.save.add")}
          >
            <Heart size={13} fill={isFav ? "#EF4444" : "none"}
              style={{ color: isFav ? "#EF4444" : "var(--ms-accent-sky)" }} />
          </button>
        </div>

        {/* Title */}
        <h3 className="font-bold text-base leading-tight mb-1.5 group-hover:text-[var(--ms-accent-sky)] transition-colors">
          {career.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-3">
          {career.description}
        </p>

        {/* Salary */}
        {career.salary_range && (
          <div className="flex items-center gap-1.5 text-xs font-semibold mb-3"
            style={{ color: "#059669" }}>
            <DollarSign size={11} /> {career.salary_range}
          </div>
        )}

        {/* Skills tags */}
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {skills.slice(0, 3).map(s => (
              <span key={s}
                className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                style={{ background: "var(--ms-bg-layer3)", border: "1px solid var(--ms-border-subtle)", color: "var(--ms-accent-sky)" }}>
                {s}
              </span>
            ))}
            {skills.length > 3 && (
              <span className="text-[10px] text-muted-foreground px-1 py-0.5">+{skills.length - 3}</span>
            )}
          </div>
        )}

        {/* Footer CTA */}
        <div className="flex items-center justify-between mt-auto pt-2"
          style={{ borderTop: "1px solid var(--ms-border-subtle)" }}>
          <span className="text-xs text-muted-foreground">{t("career.card.clickToExplore")}</span>
          <span className="text-xs font-bold" style={{ color: "var(--ms-accent-cyan)" }}>
            {t("career.card.details")}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CareerExplorer — main page
// ─────────────────────────────────────────────────────────────────────────────
const CareerExplorer = () => {
  const { t } = useTranslation();
  type CareerPaginator = {
    current_page?: number | string;
    last_page?: number | string;
    total?: number | string;
    per_page?: number | string;
    data?: Career[];
  };

  const [careers, setCareers]         = useState<Career[]>([]);
  const [categories, setCategories]   = useState<CareerCategory[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);
  const [search, setSearch]           = useState("");
  const [debouncedSearch, setDbSearch]= useState("");
  const [selectedCat, setSelectedCat] = useState<number | null>(null);
  const [page, setPage]               = useState(1);
  const [pagination, setPagination]   = useState<{ current_page: number; last_page: number; total: number; per_page: number } | null>(null);
  const [showFavsOnly, setShowFavsOnly] = useState(false);
  const [modalCareer, setModalCareer] = useState<Career | null>(null);
  const [favIds, setFavIds]           = useState<Set<number>>(() => readFavs());
  const [showFilters, setShowFilters] = useState(false);
  const searchInputRef                = useRef<HTMLInputElement>(null);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDbSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  // Load categories once
  useEffect(() => {
    getCareerCategories()
      .then(r => setCategories(r.data.data))
      .catch(() => {});
  }, []);

  // Load careers on filter change
  const loadCareers = useCallback(async () => {
    console.log("CareerExplorer.loadCareers start", { selectedCat, debouncedSearch });
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, number | string> = { page };
      if (debouncedSearch) params.search      = debouncedSearch;
      if (selectedCat)     params.category_id = selectedCat;
      const res = await getCareers(params);
      console.log("CareerExplorer API response", res.data);
      const responseData = res.data.data as unknown;
      const responseObject = responseData as CareerPaginator;
      const careersArray = Array.isArray(responseData)
        ? responseData
        : Array.isArray(responseObject.data)
          ? responseObject.data
          : [];
      const paginationInfo = !Array.isArray(responseData) && responseData && typeof responseData === "object"
        ? {
            current_page: Number(responseObject.current_page ?? 1),
            last_page: Number(responseObject.last_page ?? 1),
            total: Number(responseObject.total ?? careersArray.length),
            per_page: Number(responseObject.per_page ?? careersArray.length),
          }
        : null;
      console.log("CareerExplorer careersArray", careersArray, paginationInfo);
      setCareers(careersArray);
      setPagination(paginationInfo);
    } catch (error: unknown) {
      console.error("CareerExplorer load error", error);
      const err = error as { response?: { data?: { message?: string } } };
      const msg = err?.response?.data?.message || "Failed to load careers.";
      setError(msg);
      setCareers([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, selectedCat, page]);

  useEffect(() => { loadCareers(); }, [loadCareers]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, selectedCat]);

  // Open modal with full detail
  const openDetail = async (career: Career) => {
    try {
      const res = await getCareer(career.id);
      setModalCareer(res.data.data);
    } catch {
      setModalCareer(career);
    }
  };

  // Toggle favorite
  const toggleFav = (id: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setFavIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        toast.success(t("career.toast.removed"));
      } else {
        next.add(id);
        toast.success(t("career.toast.saved"));
      }
      writeFavs(next);
      return next;
    });
  };

  // Displayed careers (apply fav filter client-side)
  const displayed = showFavsOnly
    ? careers.filter(c => favIds.has(c.id))
    : careers;

  const totalCareersInCat = selectedCat
    ? categories.find(c => c.id === selectedCat)?.careers_count ?? 0
    : categories.reduce((s, c) => s + c.careers_count, 0);

  useEffect(() => {
    console.log("CareerExplorer state", {
      loading,
      error,
      careers,
      displayed,
      selectedCat,
      debouncedSearch,
      showFavsOnly,
      totalCareersInCat,
    });
  }, [loading, error, careers, displayed, selectedCat, debouncedSearch, showFavsOnly, totalCareersInCat]);

  return (
    <div className="max-w-6xl mx-auto space-y-5 ms-page-enter">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2.5">
            <Briefcase size={22} style={{ color: "var(--ms-accent-cyan)" }} />
            {t("career.title")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t("career.subtitle")}
          </p>
        </div>

        {/* Saved toggle */}
        <button
          onClick={() => setShowFavsOnly(f => !f)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex-shrink-0"
          style={showFavsOnly ? {
            background: "rgba(239,68,68,0.10)",
            border: "1px solid rgba(239,68,68,0.28)",
            color: "#EF4444",
          } : {
            background: "var(--ms-bg-card)",
            border: "1px solid var(--ms-border-subtle)",
            color: "var(--ms-accent-sky)",
          }}>
          <Heart size={14} fill={showFavsOnly ? "#EF4444" : "none"}
            style={{ color: showFavsOnly ? "#EF4444" : "var(--ms-accent-sky)" }} />
          {t("career.saved", { count: favIds.size })}
        </button>
      </div>

      {/* Search bar */}
      <div className="flex gap-2.5">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "var(--ms-accent-cyan)" }} />
          <input
            ref={searchInputRef}
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t("career.searchPlaceholder")}
            className="w-full pl-11 pr-10 py-3 rounded-xl text-sm focus:outline-none transition-all"
            style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)" }}
          />
          {search && (
            <button onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 transition-all hover:opacity-70"
              style={{ color: "var(--ms-accent-sky)" }}>
              <X size={15} />
            </button>
          )}
        </div>

        {/* Filter toggle (mobile) */}
        <button
          onClick={() => setShowFilters(f => !f)}
          className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all sm:hidden"
          style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)" }}>
          <Filter size={14} />
        </button>
      </div>

      {/* Category filters */}
      <div className={`flex gap-2 flex-wrap transition-all ${showFilters || "hidden sm:flex"}`}>
          <button
          onClick={() => setSelectedCat(null)}
          className="px-4 py-2 rounded-xl text-xs font-bold transition-all"
          style={selectedCat === null ? {
            background: "linear-gradient(135deg, #1E40AF, #0E7490)",
            color: "#fff", border: "none",
          } : {
            background: "var(--ms-bg-card)",
            border: "1px solid var(--ms-border-subtle)",
          }}>
          {t("career.all")}{totalCareersInCat > 0 ? ` (${totalCareersInCat})` : ""}
        </button>
        {categories.map(cat => (
          <button key={cat.id}
            onClick={() => setSelectedCat(selectedCat === cat.id ? null : cat.id)}
            className="px-4 py-2 rounded-xl text-xs font-bold transition-all"
            style={selectedCat === cat.id ? {
              background: "linear-gradient(135deg, #1E40AF, #0E7490)",
              color: "#fff", border: "none",
            } : {
              background: "var(--ms-bg-card)",
              border: "1px solid var(--ms-border-subtle)",
            }}>
            {cat.name} ({cat.careers_count})
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl"
          style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.20)" }}>
          <AlertCircle size={16} style={{ color: "#EF4444", flexShrink: 0 }} />
          <span className="text-sm text-muted-foreground flex-1">{error}</span>
          <button onClick={loadCareers}
            className="text-xs font-bold flex items-center gap-1 flex-shrink-0"
            style={{ color: "#EF4444" }}>
            <RefreshCw size={12} /> {t("career.retry")}
          </button>
        </div>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton h-56 rounded-2xl" />
          ))}
        </div>
      )}

      {/* Empty states */}
      {!loading && !error && displayed.length === 0 && (
        <div className="text-center py-16 space-y-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto"
            style={{ background: "var(--ms-accent-glow)", border: "1px solid var(--ms-border-subtle)" }}>
            {showFavsOnly
              ? <Heart size={22} style={{ color: "var(--ms-accent-cyan)", opacity: 0.5 }} />
              : <Briefcase size={22} style={{ color: "var(--ms-accent-cyan)", opacity: 0.5 }} />}
          </div>
          <div>
            <p className="font-bold text-sm">
              {showFavsOnly
                ? t("career.empty.savedTitle")
                : careers.length === 0
                  ? "No careers available right now. Check the API response in the console."
                  : t("career.empty.noResultsTitle")}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {showFavsOnly
                ? t("career.empty.savedDesc")
                : careers.length === 0
                  ? "The career API returned no careers for your current session. See console logs for details."
                  : t("career.empty.noResultsDesc")}
            </p>
          </div>
          {(search || selectedCat || showFavsOnly) && (
              <button
              onClick={() => { setSearch(""); setSelectedCat(null); setShowFavsOnly(false); }}
              className="text-xs font-bold flex items-center gap-1.5 mx-auto"
              style={{ color: "var(--ms-accent-sky)" }}>
              <X size={12} /> {t("career.clearFilters")}
            </button>
          )}
        </div>
      )}

      {/* Career cards grid */}
      {!loading && displayed.length > 0 && (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {displayed.map(career => (
              <CareerCard
                key={career.id}
                career={career}
                isFav={favIds.has(career.id)}
                onToggleFav={(e) => toggleFav(career.id, e)}
                onClick={() => openDetail(career)}
              />
            ))}
          </div>

          {/* Results footer */}
          <p className="text-xs text-center text-muted-foreground pb-2">
            {t("career.results.showing")} {displayed.length} {displayed.length !== 1 ? t("career.results.careers_plural") : t("career.results.careers")}
            {selectedCat ? ` ${t("career.results.in")} "${categories.find(c => c.id === selectedCat)?.name}"` : ""}
            {debouncedSearch ? ` ${t("career.results.matching")} "${debouncedSearch}"` : ""}
            {showFavsOnly ? ` ${t("career.results.saved")}` : ""}
          </p>
          {pagination?.last_page > 1 && (
            <div className="flex items-center justify-center gap-3 py-3">
              <button
                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                disabled={pagination.current_page <= 1}
                className="px-4 py-2 rounded-xl text-sm font-semibold transition-opacity"
                style={{
                  background: "var(--ms-bg-card)",
                  border: "1px solid var(--ms-border-subtle)",
                  opacity: pagination.current_page <= 1 ? 0.45 : 1,
                }}>
                {t("career.pagination.prev", "Previous")}
              </button>
              <span className="text-xs text-muted-foreground">
                {t("career.pagination.page", "Page")} {pagination.current_page} / {pagination.last_page}
              </span>
              <button
                onClick={() => setPage(prev => Math.min(prev + 1, pagination.last_page))}
                disabled={pagination.current_page >= pagination.last_page}
                className="px-4 py-2 rounded-xl text-sm font-semibold transition-opacity"
                style={{
                  background: "var(--ms-bg-card)",
                  border: "1px solid var(--ms-border-subtle)",
                  opacity: pagination.current_page >= pagination.last_page ? 0.45 : 1,
                }}>
                {t("career.pagination.next", "Next")}
              </button>
            </div>
          )}
        </>
      )}

      {/* Detail modal */}
      {modalCareer && (
        <CareerModal
          career={modalCareer}
          isFav={favIds.has(modalCareer.id)}
          onToggleFav={() => toggleFav(modalCareer.id)}
          onClose={() => setModalCareer(null)}
        />
      )}
    </div>
  );
};

export default CareerExplorer;
