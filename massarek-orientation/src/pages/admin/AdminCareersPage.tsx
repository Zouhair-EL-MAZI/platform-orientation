import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Briefcase, Plus, Edit, Trash2, Search, TrendingUp, X, Save, AlertCircle } from "lucide-react";
import {
  getAdminCareers, getAdminCareerCategories, createAdminCareer, updateAdminCareer, deleteAdminCareer,
  AdminCareer,
} from "@/services/adminApi";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const DEMAND_LEVELS = ["High", "Very High", "Growing", "Stable", "Low"];

const demandStyle = (demand: string) => {
  if (demand === "Very High") return { color: "#34D399", background: "rgba(52,211,153,0.10)", border: "1px solid rgba(52,211,153,0.20)" };
  if (demand === "High") return { color: "var(--ms-accent-sky)", background: "var(--ms-accent-glow)", border: "1px solid var(--ms-border-glow)" };
  if (demand === "Growing") return { color: "#FBBF24", background: "rgba(251,191,36,0.10)", border: "1px solid rgba(251,191,36,0.20)" };
  return { color: "hsl(var(--muted-foreground))", background: "var(--ms-bg-layer3)", border: "1px solid var(--ms-border-subtle)" };
};

const CareerModal = ({ career, categories, onClose, onSave, loading, serverError }: {
  career: AdminCareer | null;
  categories: { id: number; name: string }[];
  onClose: () => void;
  onSave: (data: Partial<AdminCareer>) => void;
  loading: boolean;
  serverError?: string | null;
}) => {
  const [title, setTitle] = useState(career?.title ?? "");
  const [description, setDescription] = useState(career?.description ?? "");
  const [categoryId, setCategoryId] = useState<number>(career?.category_id ?? categories[0]?.id ?? 0);
  const [salaryRange, setSalaryRange] = useState(career?.salary_range ?? "");
  const [demandLevel, setDemandLevel] = useState(career?.demand_level ?? "High");
  const [futureScope, setFutureScope] = useState(career?.future_scope ?? "");
  const [skills, setSkills] = useState((career?.required_skills ?? []).join(", "));
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const handleSave = () => {
    if (!title.trim()) {
      setError(t("admin.careers.titleRequired"));
      return;
    }

    if (!categoryId) {
      setError(t("admin.careers.categoryRequired"));
      return;
    }

    onSave({
      title,
      description,
      category_id: categoryId,
      salary_range: salaryRange,
      demand_level: demandLevel,
      future_scope: futureScope,
      required_skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
    });
  };

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col" style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)", backdropFilter: "blur(12px)" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: "var(--ms-border-subtle)" }}>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Briefcase size={18} style={{ color: "var(--ms-accent-sky)" }} />
            {career ? t("admin.careers.editCareerTitle") : t("admin.careers.addCareerTitle")}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-accent" style={{ color: "hsl(var(--muted-foreground))" }} disabled={loading}><X size={16} /></button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-4">
          {(error || serverError) && (
            <div className="rounded-lg p-3 flex items-start gap-2" style={{ background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.15)" }}>
              <AlertCircle size={14} style={{ color: "#F87171", flexShrink: 0, marginTop: 2 }} />
              <p className="text-xs" style={{ color: "#F87171" }}>{error || serverError}</p>
            </div>
          )}

          {[
            { label: t("admin.careers.labelTitle"), val: title, setter: setTitle, type: "text", placeholder: t("admin.careers.titleExample") },
            { label: t("admin.careers.labelSalary"), val: salaryRange, setter: setSalaryRange, type: "text", placeholder: t("admin.careers.salaryExample") },
          ].map(({ label, val, setter, type, placeholder }) => (
            <div key={label}>
              <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--ms-accent-cyan)", opacity: 0.65 }}>{label}</label>
              <input
                type={type}
                value={val}
                onChange={(e) => setter(e.target.value)}
                placeholder={placeholder}
                className="w-full mt-1 px-3 py-2 rounded-lg bg-transparent text-sm outline-none"
                style={{ border: "1px solid var(--ms-border-subtle)", color: "inherit" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--ms-border-active)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--ms-border-subtle)")}
                disabled={loading}
              />
            </div>
          ))}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--ms-accent-cyan)", opacity: 0.65 }}>{t("admin.careers.labelCategory")}</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 rounded-lg bg-transparent text-sm outline-none cursor-pointer"
                style={{ border: "1px solid var(--ms-border-subtle)", color: "inherit" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--ms-border-active)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--ms-border-subtle)")}
                disabled={loading}
              >
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--ms-accent-cyan)", opacity: 0.65 }}>{t("admin.careers.labelDemand")}</label>
              <select
                value={demandLevel}
                onChange={(e) => setDemandLevel(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-lg bg-transparent text-sm outline-none cursor-pointer"
                style={{ border: "1px solid var(--ms-border-subtle)", color: "inherit" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--ms-border-active)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--ms-border-subtle)")}
                disabled={loading}
              >
                {DEMAND_LEVELS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--ms-accent-cyan)", opacity: 0.65 }}>{t("admin.careers.labelDescription")}</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full mt-1 px-3 py-2 rounded-lg bg-transparent text-sm outline-none resize-none"
              style={{ border: "1px solid var(--ms-border-subtle)", color: "inherit" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--ms-border-active)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--ms-border-subtle)")}
              disabled={loading}
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--ms-accent-cyan)", opacity: 0.65 }}>
              {t("admin.careers.labelSkills")} <span style={{ opacity: 0.5 }}>{t("admin.careers.labelSkillsHint")}</span>
            </label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder={t("admin.careers.skillsExample")}
              className="w-full mt-1 px-3 py-2 rounded-lg bg-transparent text-sm outline-none"
              style={{ border: "1px solid var(--ms-border-subtle)", color: "inherit" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--ms-border-active)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--ms-border-subtle)")}
              disabled={loading}
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--ms-accent-cyan)", opacity: 0.65 }}>{t("admin.careers.labelFutureScope")}</label>
            <textarea
              value={futureScope}
              onChange={(e) => setFutureScope(e.target.value)}
              rows={2}
              className="w-full mt-1 px-3 py-2 rounded-lg bg-transparent text-sm outline-none resize-none"
              style={{ border: "1px solid var(--ms-border-subtle)", color: "inherit" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--ms-border-active)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--ms-border-subtle)")}
              disabled={loading}
            />
          </div>
        </div>

        <div className="flex gap-2 p-5 border-t" style={{ borderColor: "var(--ms-border-subtle)" }}>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-xl text-xs font-bold"
            style={{ background: "var(--ms-bg-layer2)", border: "1px solid var(--ms-border-subtle)", color: "hsl(var(--muted-foreground))" }}
            disabled={loading}
          >
            {t("admin.cancel")}
          </button>
          <button
            onClick={handleSave}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white"
            style={{ background: "linear-gradient(135deg, #1D4ED8, #0E7490)", border: "1px solid rgba(34,211,238,0.25)" }}
            disabled={loading}
          >
            <Save size={12} />{loading ? t("admin.saving") : t("admin.save")}
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminCareersPage = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [activeField, setActiveField] = useState("All");
  const [careers, setCareers] = useState<AdminCareer[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [modal, setModal] = useState<{ open: boolean; career: AdminCareer | null }>({ open: false, career: null });
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const PAGE_SIZE = 10;

  const showSuccess = (msg: string) => { setSuccessMessage(msg); setTimeout(() => setSuccessMessage(null), 3000); };

  const load = async () => {
    setLoading(true);
    try {
      const [cRes, catRes] = await Promise.all([getAdminCareers(), getAdminCareerCategories()]);
      setCareers(cRes.data.data);
      setCategories(catRes.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const fields = [
    { label: t("admin.careers.filterAll"), value: "All" },
    ...Array.from(new Set(categories.map((c) => c.name))).map((name) => ({ label: name, value: name })),
  ];

  const filtered = careers.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase());
    const matchField = activeField === "All" || c.category?.name === activeField;
    return matchSearch && matchField;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [search, activeField, careers]);

  const handleSave = async (data: Partial<AdminCareer>) => {
    setModalLoading(true);
    setModalError(null);
    try {
      if (modal.career) {
        const res = await updateAdminCareer(modal.career.id, data);
        setCareers((prev) => prev.map((c) => c.id === modal.career!.id ? res.data.data : c));
        showSuccess(t("admin.careers.updatedSuccess"));
      } else {
        const res = await createAdminCareer(data);
        setCareers((prev) => [...prev, res.data.data]);
        showSuccess(t("admin.careers.addedSuccess"));
      }
      setModal({ open: false, career: null });
    } catch (error: unknown) {
      const e = error as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } } | null;
      const msg = e?.response?.data?.message || e?.response?.data?.errors
        ? Object.values(e.response?.data?.errors ?? {}).flat().join(", ")
        : t("admin.careers.failedSave");
      setModalError(typeof msg === "string" ? msg : t("admin.careers.failedSave"));
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t("admin.careers.confirmDelete"))) return;
    try {
      await deleteAdminCareer(id);
      setCareers((prev) => prev.filter((c) => c.id !== id));
      showSuccess(t("admin.careers.deletedSuccess"));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      {successMessage && (
        <div className="rounded-xl px-4 py-3 text-sm font-semibold flex items-center gap-2" style={{ background: "rgba(52,211,153,0.10)", border: "1px solid rgba(52,211,153,0.20)", color: "#34D399" }}>
          ✓ {successMessage}
        </div>
      )}

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Briefcase size={22} style={{ color: "var(--ms-accent-cyan)" }} />{t("admin.careers.title")}
          </h1>
          <p className="text-sm mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>
            {careers.length} {t("admin.careers.careerPaths")}
          </p>
        </div>
        <button
          onClick={() => setModal({ open: true, career: null })}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white"
          style={{ background: "linear-gradient(135deg, #1D4ED8, #0E7490)", border: "1px solid rgba(34,211,238,0.25)", boxShadow: "0 4px 16px rgba(14,116,144,0.20)" }}
        >
          <Plus size={14} />{t("admin.careers.addCareer")}
        </button>
      </div>

      <div className="rounded-2xl p-4 flex flex-wrap gap-3 items-center" style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)", backdropFilter: "blur(12px)" }}>
        <div className="relative flex items-center gap-2 flex-1 min-w-[200px] max-w-sm rounded-xl h-9 px-3" style={{ background: "var(--ms-bg-layer2)", border: "1px solid var(--ms-border-subtle)" }}>
          <Search size={13} className="text-muted-foreground" />
          <input
            type="text"
            placeholder={t("admin.careers.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1">
          {fields.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveField(f.value)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={activeField === f.value
                ? { background: "var(--ms-accent-glow)", border: "1px solid var(--ms-border-glow)", color: "var(--ms-accent-sky)" }
                : { background: "transparent", border: "1px solid transparent", color: "hsl(var(--muted-foreground))" }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden card-top-glow" style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)", backdropFilter: "blur(12px)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--ms-border-subtle)" }}>
                {[
                  t("admin.careers.labelTitle"),
                  t("admin.careers.labelCategory"),
                  t("admin.careers.labelSalary"),
                  t("admin.careers.labelDemand"),
                  t("admin.careers.labelSkills"),
                  "",
                ].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: "var(--ms-accent-cyan)", opacity: 0.65 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(6)].map((_, j) => (
                      <td key={j} className="px-5 py-3"><div className="skeleton h-4 rounded" /></td>
                    ))}
                  </tr>
                ))
              ) : paginated.map((c) => (
                <tr key={c.id} className="activity-hover" style={{ borderBottom: "1px solid var(--ms-border-subtle)" }}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "var(--ms-accent-glow)", border: "1px solid var(--ms-border-glow)" }}>
                        <Briefcase size={14} style={{ color: "var(--ms-accent-cyan)" }} />
                      </div>
                      <div>
                        <div className="font-semibold">{c.title}</div>
                        {c.description && (
                          <div className="text-xs mt-0.5 line-clamp-1 max-w-[200px]" style={{ color: "hsl(var(--muted-foreground))" }}>{c.description}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{c.category?.name}</td>
                  <td className="px-5 py-3 text-xs font-medium">{c.salary_range || "—"}</td>
                  <td className="px-5 py-3">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={demandStyle(c.demand_level)}>{c.demand_level || "—"}</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap gap-1">
                      {(c.required_skills ?? []).slice(0, 3).map((s, i) => (
                        <span key={i} className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "var(--ms-bg-layer3)", color: "hsl(var(--muted-foreground))", border: "1px solid var(--ms-border-subtle)" }}>
                          {s}
                        </span>
                      ))}
                      {(c.required_skills ?? []).length > 3 && (
                        <span className="text-[10px]" style={{ color: "hsl(var(--muted-foreground))" }}>+{c.required_skills.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setModal({ open: true, career: c })} className="p-1.5 rounded-lg transition-all hover:text-[var(--ms-accent-cyan)]" style={{ color: "hsl(var(--muted-foreground))" }}><Edit size={13} /></button>
                      <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg transition-all hover:text-[#F87171]" style={{ color: "hsl(var(--muted-foreground))" }}><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-xs" style={{ borderTop: "1px solid var(--ms-border-subtle)", color: "hsl(var(--muted-foreground))" }}>
          <span>
            {t("admin.careers.showing")} {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}
            {filtered.length > 0 && `–${Math.min(page * PAGE_SIZE, filtered.length)}`} {t("admin.careers.of")} {filtered.length} {t("admin.careers.careers")}
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <TrendingUp size={12} style={{ color: "var(--ms-accent-cyan)" }} />
              <span style={{ color: "var(--ms-accent-sky)" }}>{categories.length} {t("admin.careers.categories")}</span>
            </div>
            {totalPages > 1 && (
              <Pagination className="mt-2 sm:mt-0">
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page > 1) setPage((prev) => Math.max(1, prev - 1));
                  }}
                  className={page === 1 ? "pointer-events-none opacity-50" : undefined}
                />
                <PaginationContent>
                  {Array.from({ length: totalPages }, (_, index) => {
                    const pageNumber = index + 1;
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          href="#"
                          isActive={page === pageNumber}
                          onClick={(e) => {
                            e.preventDefault();
                            setPage(pageNumber);
                          }}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                </PaginationContent>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page < totalPages) setPage((prev) => Math.min(totalPages, prev + 1));
                  }}
                  className={page === totalPages ? "pointer-events-none opacity-50" : undefined}
                />
              </Pagination>
            )}
          </div>
        </div>
      </div>

      {modal.open && (
        <CareerModal
          career={modal.career}
          categories={categories}
          onClose={() => { setModal({ open: false, career: null }); setModalError(null); }}
          onSave={handleSave}
          loading={modalLoading}
          serverError={modalError}
        />
      )}
    </div>
  );
};

export default AdminCareersPage;
