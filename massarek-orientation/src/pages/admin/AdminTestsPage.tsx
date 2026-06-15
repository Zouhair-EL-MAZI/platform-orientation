import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  FileQuestion, Plus, Edit, Trash2, Eye, Search,
  ToggleLeft, ToggleRight, Clock, Users, X, Save,
  AlertCircle, ChevronDown, ChevronUp, PlusCircle,
} from "lucide-react";
import {
  getAdminTests, updateAdminTestStatus, createAdminTest, updateAdminTest, deleteAdminTest,
  getAdminTestQuestions, createAdminQuestion, updateAdminQuestion, deleteAdminQuestion,
  AdminTest, AdminTestRaw, AdminQuestion,
} from "@/services/adminApi";

const CATEGORIES = [
  { labelKey: "admin.tests.filterAll", value: "All" },
  { labelKey: "admin.tests.category.personality", value: "personality" },
  { labelKey: "admin.tests.category.aptitude", value: "aptitude" },
  { labelKey: "admin.tests.category.skills", value: "skills" },
];
const CAT_VALUES = [
  { labelKey: "admin.tests.category.aptitude", value: "aptitude" },
  { labelKey: "admin.tests.category.personality", value: "personality" },
  { labelKey: "admin.tests.category.skills", value: "skills" },
];

const categoryStyle = (cat: string) => {
  const c = cat?.toLowerCase();
  if (c === "personality") return { background: "rgba(167,139,250,0.10)", color: "#A78BFA", border: "1px solid rgba(167,139,250,0.20)" };
  if (c === "aptitude") return { background: "rgba(251,191,36,0.10)", color: "#FBBF24", border: "1px solid rgba(251,191,36,0.20)" };
  return { background: "var(--ms-accent-glow)", color: "var(--ms-accent-sky)", border: "1px solid var(--ms-border-glow)" };
};

// ─── Test Modal (New / Edit) ────────────────────────────────────────────────
const TestModal = ({ test, onClose, onSave, loading }: {
  test: AdminTest | null; onClose: () => void;
  onSave: (data: { title: string; description: string; category: string; duration: number }) => void;
  loading: boolean;
}) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState(test?.title ?? "");
  const [description, setDescription] = useState(test?.description ?? "");
  const [category, setCategory] = useState(test?.category ?? "");
  const [duration, setDuration] = useState(String(test?.duration ?? "15"));
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    if (!title.trim()) { setError(t("admin.tests.titleRequired")); return; }
    if (!category.trim()) { setError("Category is required"); return; }
    setError(null);
    onSave({ title, description, category: category.trim(), duration: Number(duration) || 15 });
  };

  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50" onClick={onClose}>
      <div className="rounded-2xl p-6 w-full max-w-md bg-white dark:bg-[#131c35] border border-slate-200 dark:border-slate-700/50" style={{ boxShadow: "0 24px 64px rgba(15, 23, 42, 0.18)" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <FileQuestion size={18} style={{ color: "var(--ms-accent-sky)" }} />
            {test ? t("admin.tests.editTest") : t("admin.tests.newTestTitle")}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-600 hover:text-red-500 dark:text-slate-300 dark:hover:text-red-400 transition-colors" disabled={loading}><X size={16} /></button>
        </div>

        {error && (
          <div className="rounded-lg p-3 mb-4 flex items-start gap-2" style={{ background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.15)" }}>
            <AlertCircle size={14} style={{ color: "#F87171", flexShrink: 0, marginTop: 2 }} />
            <p className="text-xs" style={{ color: "#F87171" }}>{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--ms-accent-cyan)", opacity: 0.65 }}>{t("admin.tests.labelTitle")}</label>
            <input type="text" placeholder="Test Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg bg-white dark:bg-[#131c35] border border-slate-200 dark:border-slate-700/50 text-sm text-slate-800 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" disabled={loading} />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--ms-accent-cyan)", opacity: 0.65 }}>{t("admin.tests.labelDescription")}</label>
            <textarea placeholder="Test Description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full mt-1 px-3 py-2 rounded-lg bg-white dark:bg-[#131c35] border border-slate-200 dark:border-slate-700/50 text-sm text-slate-800 dark:text-white placeholder-slate-400 outline-none resize-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" disabled={loading} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--ms-accent-cyan)", opacity: 0.65 }}>{t("admin.tests.labelCategory")}</label>
              <div className="relative w-full mt-1">
              <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Enter Category" className="w-full px-3 py-2 bg-white dark:bg-[#131c35] border border-slate-200 dark:border-slate-700/50 rounded-lg text-sm text-slate-800 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" disabled={loading} />
            </div>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--ms-accent-cyan)", opacity: 0.65 }}>{t("admin.tests.labelDuration")}</label>
              <input type="number" min={1} placeholder="Duration (minutes)" value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg bg-white dark:bg-[#131c35] border border-slate-200 dark:border-slate-700/50 text-sm text-slate-800 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" disabled={loading} />
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button onClick={onClose} className="flex-1 px-4 py-2 rounded-xl text-xs font-bold" style={{ background: "var(--ms-bg-layer2)", border: "1px solid var(--ms-border-subtle)", color: "hsl(var(--muted-foreground))" }} disabled={loading}>{t("admin.cancel")}</button>
          <button onClick={handleSave} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white" style={{ background: "linear-gradient(135deg, #1D4ED8, #0E7490)", border: "1px solid rgba(34,211,238,0.25)" }} disabled={loading}>
            <Save size={12} />{loading ? t("admin.saving") : t("admin.save")}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Question Row ────────────────────────────────────────────────────────────
const QuestionRow = ({ q, testId, onUpdated, onDeleted }: {
  q: AdminQuestion; testId: number;
  onUpdated: (q: AdminQuestion) => void; onDeleted: (id: number) => void;
}) => {
  const { t } = useTranslation();
  const [editing, setEditing] = useState(false);
  const [question, setQuestion] = useState(q.question);
  const [type, setType] = useState(q.type);
  const [options, setOptions] = useState<string[]>(q.options ?? ["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const questionTypeLabel = (value: string) => {
    if (value === "single_choice") return t("admin.tests.singleChoice");
    if (value === "scale") return t("admin.tests.scale");
    return t("admin.tests.text");
  };

  const save = async () => {
    setLoading(true);
    try {
      const opts = type === "single_choice" ? options.filter((o) => o.trim()) : undefined;
      const res = await updateAdminQuestion(testId, q.id, { question, type, options: opts });
      onUpdated(res.data.data);
      setEditing(false);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const del = async () => {
    if (!confirm(t("admin.tests.confirmDeleteQuestion"))) return;
    setLoading(true);
    try { await deleteAdminQuestion(testId, q.id); onDeleted(q.id); } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  return (
    <div className="rounded-xl p-4 space-y-3" style={{ background: "var(--ms-bg-layer3)", border: "1px solid var(--ms-border-subtle)" }}>
      {!editing ? (
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium leading-snug">{q.question}</p>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "var(--ms-accent-glow)", color: "var(--ms-accent-sky)", border: "1px solid var(--ms-border-glow)" }}>{questionTypeLabel(q.type)}</span>
              {q.options?.map((o, i) => <span key={i} className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "var(--ms-bg-card)", color: "hsl(var(--muted-foreground))", border: "1px solid var(--ms-border-subtle)" }}>{o}</span>)}
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button onClick={() => setEditing(true)} className="p-1.5 rounded-lg hover:text-[var(--ms-accent-sky)]" style={{ color: "hsl(var(--muted-foreground))" }}><Edit size={13} /></button>
            <button onClick={del} disabled={loading} className="p-1.5 rounded-lg hover:text-[#F87171]" style={{ color: "hsl(var(--muted-foreground))" }}><Trash2 size={13} /></button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <textarea value={question} onChange={(e) => setQuestion(e.target.value)} rows={2} className="w-full px-3 py-2 rounded-lg bg-transparent text-sm outline-none resize-none" style={{ border: "1px solid var(--ms-border-active)", color: "inherit" }} />

          <div className="space-y-2">
            {options.map((o, i) => (
              <input
                key={i}
                value={o}
                onChange={(e) => { const n = [...options]; n[i] = e.target.value; setOptions(n); }}
                placeholder={`Option ${String.fromCharCode(65 + i)}`}
                className="w-full h-9 px-3 bg-gray-50 dark:bg-[#131c35] border border-slate-200 dark:border-slate-700/50 rounded-lg text-sm mt-2"
              />
            ))}
          </div>

          <div className="flex gap-2">
            <button onClick={() => setEditing(false)} className="flex-1 py-1.5 rounded-lg text-xs font-bold" style={{ background: "var(--ms-bg-layer2)", border: "1px solid var(--ms-border-subtle)", color: "hsl(var(--muted-foreground))" }}>{t("admin.cancel")}</button>
            <button onClick={save} disabled={loading} className="flex-1 py-1.5 rounded-lg text-xs font-bold text-white" style={{ background: "linear-gradient(135deg, #1D4ED8, #0E7490)" }}>{loading ? t("admin.saving") : t("admin.save")}</button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Questions Panel ─────────────────────────────────────────────────────────
const QuestionsPanel = ({ test, onClose }: { test: AdminTest; onClose: () => void }) => {
  const { t } = useTranslation();
  const [questions, setQuestions] = useState<AdminQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newQ, setNewQ] = useState("");
  const [newOptions, setNewOptions] = useState(["", "", "", ""]);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  useEffect(() => {
    getAdminTestQuestions(test.id)
      .then((r) => setQuestions(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [test.id]);

  const addQuestion = async () => {
    if (!newQ.trim()) return;
    setSaveLoading(true);
    try {
      const opts = newOptions.filter((o) => o.trim());
      const res = await createAdminQuestion(test.id, { question: newQ, type: "single_choice", options: opts });
      setQuestions((prev) => [...prev, res.data.data]);
      setNewQ(""); setNewOptions(["", "", "", ""]); setAdding(false);
    } catch (e) { console.error(e); } finally { setSaveLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-transparent" onClick={onClose}>
      <div className="w-full max-w-2xl bg-white dark:bg-[#131c35] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: "var(--ms-border-subtle)" }}>
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2"><FileQuestion size={18} style={{ color: "var(--ms-accent-cyan)" }} />{test.title}</h2>
            <p className="text-xs mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>{questions.length} {t("admin.tests.questions")}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-600 hover:text-red-500 dark:text-slate-300 dark:hover:text-red-400 transition-colors"><X size={16} /></button>
        </div>

        {/* Questions list */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar p-5 space-y-3">
          {loading ? (
            <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}</div>
          ) : questions.length === 0 ? (
            <p className="text-center text-sm py-8" style={{ color: "hsl(var(--muted-foreground))" }}>{t("admin.tests.noQuestionsYet")}</p>
          ) : (
            questions.map((q) => (
              <QuestionRow key={q.id} q={q} testId={test.id}
                onUpdated={(updated) => setQuestions((prev) => prev.map((x) => x.id === updated.id ? updated : x))}
                onDeleted={(id) => setQuestions((prev) => prev.filter((x) => x.id !== id))}
              />
            ))
          )}

          {/* Add question form */}
          {adding ? (
            <div className="rounded-xl p-4 space-y-3" style={{ background: "var(--ms-bg-layer3)", border: "1px solid var(--ms-border-glow)" }}>
              <textarea value={newQ} onChange={(e) => setNewQ(e.target.value)} rows={2} placeholder={t("admin.tests.questionText")} className="w-full px-3 py-2 rounded-lg bg-transparent text-sm outline-none resize-none" style={{ border: "1px solid var(--ms-border-active)", color: "inherit" }} />

              <div className="space-y-2">
                {newOptions.map((o, i) => (
                  <input
                    key={i}
                    value={o}
                    onChange={(e) => { const n = [...newOptions]; n[i] = e.target.value; setNewOptions(n); }}
                    placeholder={`Option ${String.fromCharCode(65 + i)}`}
                    className="w-full h-9 px-3 bg-gray-50 dark:bg-[#131c35] border border-slate-200 dark:border-slate-700/50 rounded-lg text-sm mt-2"
                  />
                ))}
              </div>

              <div className="flex gap-2">
                <button onClick={() => setAdding(false)} className="flex-1 py-2 rounded-lg text-xs font-bold" style={{ background: "var(--ms-bg-layer2)", border: "1px solid var(--ms-border-subtle)", color: "hsl(var(--muted-foreground))" }}>{t("admin.cancel")}</button>
                <button onClick={addQuestion} disabled={saveLoading} className="flex-1 py-2 rounded-lg text-xs font-bold text-white" style={{ background: "linear-gradient(135deg, #1D4ED8, #0E7490)" }}>{saveLoading ? t("admin.tests.adding") : t("admin.tests.addQuestion")}</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setAdding(true)} className="w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all" style={{ background: "var(--ms-accent-glow)", border: "1px dashed var(--ms-border-glow)", color: "var(--ms-accent-sky)" }}>
              <PlusCircle size={14} /> {t("admin.tests.addQuestion")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ───────────────────────────────────────────────────────────────
const AdminTestsPage = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [statusFilter, setStatus] = useState("");
  const [tests, setTests] = useState<AdminTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [testModal, setTestModal] = useState<{ open: boolean; test: AdminTest | null }>({ open: false, test: null });
  const [testModalLoading, setTestModalLoading] = useState(false);
  const [questionsPanel, setQuestionsPanel] = useState<AdminTest | null>(null);

  const loadTests = async () => {
    setLoading(true);
    try {
      const res = await getAdminTests();
      const raw = res.data.data as AdminTestRaw[];
      setTests(raw.map((t) => ({
        id: t.id, title: t.title, description: t.description,
        questions: t.questions_count,
        duration: typeof t.duration === "number" ? t.duration : (parseInt(String(t.duration)) || 0),
        completions: t.submissions,
        active: t.active ?? false,
        category: t.category,
      })));
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { loadTests(); }, []);

  const showSuccess = (msg: string) => { setSuccessMessage(msg); setTimeout(() => setSuccessMessage(null), 3000); };

  const toggleActive = async (id: number) => {
    const test = tests.find((t) => t.id === id);
    if (!test) return;
    try {
      await updateAdminTestStatus(id, test.active ? "inactive" : "active");
      setTests((prev) => prev.map((t) => t.id === id ? { ...t, active: !t.active } : t));
    } catch (e) { console.error(e); }
  };

  const handleSaveTest = async (data: { title: string; description: string; category: string; duration: number }) => {
    setTestModalLoading(true);
    try {
      if (testModal.test) {
        await updateAdminTest(testModal.test.id, data);
        showSuccess(t("admin.tests.updatedSuccess"));
      } else {
        await createAdminTest(data);
        showSuccess(t("admin.tests.createdSuccess"));
      }
      await loadTests();
      setTestModal({ open: false, test: null });
    } catch (e) { console.error(e); } finally { setTestModalLoading(false); }
  };

  const handleDeleteTest = async (id: number) => {
    if (!confirm(t("admin.tests.confirmDelete"))) return;
    try {
      await deleteAdminTest(id);
      showSuccess(t("admin.tests.deletedSuccess"));
      setTests((prev) => prev.filter((t) => t.id !== id));
    } catch (e) { console.error(e); }
  };

  const filtered = tests.filter((t) => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "All" || t.category?.toLowerCase() === activeCategory.toLowerCase();
    const matchStatus = !statusFilter || statusFilter === "" ? true : (statusFilter === "active" ? !!t.active : !t.active);
    return matchSearch && matchCat && matchStatus;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      {successMessage && (
        <div className="rounded-xl px-4 py-3 text-sm font-semibold flex items-center gap-2" style={{ background: "rgba(52,211,153,0.10)", border: "1px solid rgba(52,211,153,0.20)", color: "#34D399" }}>
          ✓ {successMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileQuestion size={22} style={{ color: "var(--ms-accent-cyan)" }} />{t("admin.tests.title")}
          </h1>
          <p className="text-sm mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>
            {tests.length} {t("admin.tests.testsCount")} · {tests.filter((t) => t.active).length} {t("admin.tests.activeCount")}
          </p>
        </div>
        <button
          onClick={() => setTestModal({ open: true, test: null })}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all duration-200"
          style={{ background: "linear-gradient(135deg, #1D4ED8, #0E7490)", border: "1px solid rgba(34,211,238,0.25)", boxShadow: "0 4px 16px rgba(14,116,144,0.20)" }}
          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 6px 24px rgba(14,116,144,0.35)")}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(14,116,144,0.20)")}
        >
          <Plus size={14} />{t("admin.tests.newTest")}
        </button>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: t("admin.tests.testsCount"),  value: tests.length,                              color: "var(--ms-accent-cyan)", icon: FileQuestion },
          { label: t("admin.tests.activeCount"),  value: tests.filter((t) => t.active).length,     color: "#34D399",               icon: ToggleRight  },
          { label: "Total Submissions",           value: tests.reduce((s, t) => s + (t.completions ?? 0), 0), color: "var(--ms-accent-sky)", icon: Users },
          { label: "Avg Completion Rate",         value: tests.length ? `${Math.round((tests.reduce((s, t) => s + ((t as any).completion_rate ?? 0), 0) / tests.length))}%` : "—", color: "#A78BFA", icon: Clock },
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

      {/* Toolbar */}
      <div className="rounded-2xl p-4 flex flex-wrap gap-3 items-center" style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)", backdropFilter: "blur(12px)" }}>
        {/* Left filter group: Search + two dropdowns */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
          {/* Search */}
          <div className="relative w-full sm:max-w-xl flex-1">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input type="text" placeholder="Search tests..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full pl-10 pr-4 bg-white dark:bg-[#131c35] text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700/50 rounded-lg text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200" />
          </div>

          {/* Dropdown 1 - All Statuses */}
          <div className="relative w-full sm:w-56">
            <select value={statusFilter} onChange={(e) => setStatus(e.target.value)}
              className="appearance-none h-10 w-full px-3 bg-white dark:bg-[#131c35] text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 cursor-pointer">
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4" />
          </div>

          {/* Dropdown 2 - All Types */}
          <div className="relative w-full sm:w-56">
            <select value={activeCategory} onChange={(e) => setActiveCategory(e.target.value)}
              className="appearance-none h-10 w-full px-3 bg-white dark:bg-[#131c35] text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 cursor-pointer">
              <option value="">All Types</option>
              <option value="personality">Personality</option>
              <option value="skills">Skills</option>
              <option value="orientation">Orientation</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-52 rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((test) => (
            <div key={test.id} className="rounded-2xl p-5 relative overflow-hidden group transition-all duration-200"
              style={{ background: "var(--ms-bg-card)", border: `1px solid ${test.active ? "var(--ms-border-subtle)" : "rgba(248,113,113,0.10)"}`, backdropFilter: "blur(12px)", opacity: test.active ? 1 : 0.75 }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = test.active ? "var(--ms-border-glow)" : "rgba(248,113,113,0.25)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = test.active ? "var(--ms-border-subtle)" : "rgba(248,113,113,0.10)")}>

              <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
                style={{ background: test.active ? "linear-gradient(90deg, transparent, var(--ms-accent-cyan), transparent)" : "linear-gradient(90deg, transparent, rgba(248,113,113,0.5), transparent)" }} />

              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={categoryStyle(test.category)}>{t(`admin.tests.category.${test.category?.toLowerCase()}`)}</span>
                <button onClick={() => toggleActive(test.id)} title={test.active ? t("admin.tests.deactivate") : t("admin.tests.activate")}>
                  {test.active ? <ToggleRight size={20} style={{ color: "#34D399" }} /> : <ToggleLeft size={20} style={{ color: "hsl(var(--muted-foreground))" }} />}
                </button>
              </div>

              <h3 className="font-bold text-base mb-1">{test.title}</h3>
              <p className="text-xs leading-relaxed mb-4" style={{ color: "hsl(var(--muted-foreground))" }}>{test.description}</p>

              <div className="flex items-center gap-3 text-xs mb-4 flex-wrap" style={{ color: "hsl(var(--muted-foreground))" }}>
                <span className="flex items-center gap-1"><FileQuestion size={11} style={{ color: "var(--ms-accent-cyan)" }} />{test.questions} {t("admin.tests.questions")}</span>
                <span className="flex items-center gap-1"><Clock size={11} style={{ color: "var(--ms-accent-cyan)" }} />{test.duration} {t("admin.tests.durationUnit")}</span>
                <span className="flex items-center gap-1"><Users size={11} style={{ color: "var(--ms-accent-sky)" }} />{test.completions}</span>
                {(test as any).avg_score > 0 && (
                  <span className="font-bold tabular-nums" style={{ color: "#34D399" }}>avg {(test as any).avg_score} pts</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => setTestModal({ open: true, test })}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all"
                  style={{ background: "var(--ms-accent-glow)", border: "1px solid var(--ms-border-glow)", color: "var(--ms-accent-sky)" }}>
                  <Edit size={12} />{t("admin.edit")}
                </button>
                <button onClick={() => setQuestionsPanel(test)}
                  className="p-2 rounded-xl text-xs font-bold transition-all hover:text-[var(--ms-accent-cyan)]"
                  style={{ background: "transparent", border: "1px solid var(--ms-border-subtle)", color: "hsl(var(--muted-foreground))" }}
                  title={t("admin.tests.manageQuestions") }>
                  <Eye size={14} />
                </button>
                <button onClick={() => handleDeleteTest(test.id)}
                  className="p-2 rounded-xl text-xs font-bold transition-all hover:text-[#F87171]"
                  style={{ background: "transparent", border: "1px solid var(--ms-border-subtle)", color: "hsl(var(--muted-foreground))" }}
                  title={t("admin.delete") }>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {testModal.open && <TestModal test={testModal.test} onClose={() => setTestModal({ open: false, test: null })} onSave={handleSaveTest} loading={testModalLoading} />}
      {questionsPanel && <QuestionsPanel test={questionsPanel} onClose={() => setQuestionsPanel(null)} />}
    </div>
  );
};

export default AdminTestsPage;
