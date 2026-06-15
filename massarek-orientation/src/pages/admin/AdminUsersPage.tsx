import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";
import {
  Users, Search, UserCheck, Shield, CheckCircle2,
  Trash2, Edit2, Eye, UserPlus, Download, X, Save,
  AlertCircle, ChevronLeft, ChevronRight, ChevronDown, Sparkles,
  FileQuestion, MapPin, GraduationCap,
  Mail, Phone,
} from "lucide-react";
import {
  getAdminUsers, getAdminTests, getAdminUserById, updateAdminUser,
  deleteAdminUser, createAdminUser, AdminUser, AdminTestRaw,
} from "@/services/adminApi";

type AdminUserProfile = {
  age?: number | null;
  city?: string | null;
  education_level?: string | null;
  academic_level?: string | null;
  statut?: string | null;
  bio?: string | null;
  interests?: string[];
  preferred_fields?: string[];
  phone?: string | null;
};

type AdminUserDetails = AdminUser & {
  joined_human?: string;
  education_level?: string | null;
  level?: string | null;
  grade?: string | null;
  studyLevel?: string | null;
  academicLevel?: string | null;
  orientationInsights?: string[] | string;
  interests?: string[] | string;
  completedTests?: Array<{ name?: string; title?: string; points?: number | string; score?: number | string }>;
  profile?: AdminUserProfile;
  completed_tests?: Array<{ title: string; total_score: number | string; completed_at: string }>;
  recommendations?: Array<{ career: string; match_score: number; created_at: string }>;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" }) {
  const dim = size === "sm" ? "w-7 h-7 text-[11px]" : "w-9 h-9 text-sm";
  return (
    <div className={`${dim} rounded-full flex items-center justify-center font-bold text-white flex-shrink-0`}
      style={{ background: "linear-gradient(135deg,#1D4ED8,#0E7490)" }}>
      {name?.charAt(0)?.toUpperCase() ?? "?"}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const s = (status ?? "").toLowerCase();
  const style =
    s === "active" || s === "actif"   ? { bg: "rgba(52,211,153,0.10)",  color: "#34D399",  border: "rgba(52,211,153,0.22)"  } :
    s === "inactive" || s === "inactif" ? { bg: "rgba(248,113,113,0.08)", color: "#F87171",  border: "rgba(248,113,113,0.18)" } :
                                           { bg: "rgba(251,191,36,0.10)",  color: "#FBBF24",  border: "rgba(251,191,36,0.22)"  };
  return (
    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full capitalize"
      style={{ background: style.bg, color: style.color, border: `1px solid ${style.border}` }}>
      {status || "—"}
    </span>
  );
}

function VerifiedBadge({ verified }: { verified: boolean }) {
  return verified ? (
    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
      style={{ background: "rgba(34,211,238,0.10)", color: "var(--ms-accent-cyan)", border: "1px solid rgba(34,211,238,0.20)" }}>
      ✓ Verified
    </span>
  ) : (
    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
      style={{ background: "rgba(148,163,184,0.08)", color: "hsl(var(--muted-foreground))", border: "1px solid rgba(148,163,184,0.15)" }}>
      Pending
    </span>
  );
}

function TestStatusBadge({ completed, count, total }: { completed: boolean; count: number; total: number }) {
  const inProgress = !completed && count > 0;
  const label = completed
    ? "Completed"
    : inProgress
      ? `In Progress (${count}/${total})`
      : "Not Started";

  return (
    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest"
      style={completed
        ? { background: "rgba(34,197,94,0.12)", color: "#16A34A", border: "1px solid rgba(34,197,94,0.22)" }
        : inProgress
          ? { background: "rgba(249,115,22,0.12)", color: "#C2410C", border: "1px solid rgba(249,115,22,0.22)" }
          : { background: "rgba(148,163,184,0.10)", color: "#475569", border: "1px solid rgba(148,163,184,0.18)" }}>
      {label}
    </span>
  );
}

function RoleBadge({ role }: { role: string }) {
  const isAdmin = role === "admin";
  return (
    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 w-fit"
      style={isAdmin
        ? { background: "rgba(167,139,250,0.10)", color: "#A78BFA", border: "1px solid rgba(167,139,250,0.22)" }
        : { background: "var(--ms-accent-glow)", color: "var(--ms-accent-sky)", border: "1px solid var(--ms-border-glow)" }
      }>
      {isAdmin && <Shield size={9} />}
      {role}
    </span>
  );
}

function SkeletonRow() {
  return (
    <tr>
      {[140, 180, 70, 70, 50, 80, 80, 48].map((w, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 rounded animate-pulse" style={{ background: "var(--ms-border-subtle)", width: w }} />
        </td>
      ))}
    </tr>
  );
}

// ─── Input helper ─────────────────────────────────────────────────────────────
function Field({ label, value, onChange, type = "text", disabled = false, options, placeholder }: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; disabled?: boolean; options?: { value: string; label: string }[]; placeholder?: string;
}) {
  const base = "w-full mt-1 px-3 py-2 rounded-xl text-sm outline-none transition-all bg-white text-black placeholder-gray-500 border border-slate-200 dark:bg-[#131c35] dark:text-white dark:placeholder-slate-500 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500";
  const style = {};
  return (
    <div>
      <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">{label}</label>
      {options ? (
        <div className="relative w-full mt-1">
          <select value={value} onChange={(e) => onChange(e.target.value)} className="appearance-none w-full px-3 py-2 rounded-xl text-sm outline-none transition-all bg-white text-black placeholder-gray-500 border border-slate-200 dark:bg-[#131c35] dark:text-white dark:placeholder-slate-500 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer" disabled={disabled}>
            {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4" />
        </div>
      ) : (
        <input type={type} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} className={base} disabled={disabled} />
      )}
    </div>
  );
}

// ─── Add/Edit Modal ───────────────────────────────────────────────────────────
function UserModal({ user, onClose, onSaved }: {
  user: AdminUser | null; onClose: () => void; onSaved: () => void;
}) {
  const { t } = useTranslation();
  const isEdit = !!user;
  const [name,     setName]     = useState(user?.name ?? "");
  const [email,    setEmail]    = useState(user?.email ?? "");
  const [password, setPassword] = useState("");
  const [status,   setStatus]   = useState(user?.status?.toLowerCase() ?? "active");
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState("");

  const handleSave = async () => {
    if (!name.trim() || !email.trim()) { setError(t("admin.users.nameEmailRequired")); return; }
    // client-side email format validation
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) { setError("Please enter a valid email address."); return; }
    if (!isEdit && password.length < 8) { setError(t("admin.users.passwordMinLength")); return; }
    setSaving(true); setError("");
    try {
      if (isEdit) {
        await updateAdminUser(user!.id, { name, email, status });
      } else {
        // explicitly create as student
        await createAdminUser({ name, email, password, role: "student" });
      }
      onSaved();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Save failed.");
    } finally { setSaving(false); }
  };

  // Render modal without backdrop overlay. Outer wrapper uses pointer-events-none so
  // background remains fully visible and interactive; modal itself is pointer-events-auto.
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
      <div className="pointer-events-auto rounded-2xl p-6 w-full max-w-md shadow-xl bg-white dark:bg-[#0b1329]" style={{ border: "1px solid var(--ms-border-subtle)" }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">{isEdit ? t("admin.users.editUser") : t("admin.users.addUserTitle")}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-600 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 transition-colors" style={{ border: "1px solid var(--ms-border-subtle)" }}><X size={14} /></button>
        </div>
        {error && (
          <div className="rounded-xl px-3 py-2 mb-4 flex items-center gap-2 text-xs font-medium"
            style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.18)", color: "#F87171" }}>
            <AlertCircle size={13} /> {error}
          </div>
        )}
        <div className="space-y-3">
          <Field label={t("admin.users.labelName")}  value={name}     onChange={setName}     disabled={saving} placeholder="Enter student's full name" />
          <Field label={t("admin.users.labelEmail")} value={email}    onChange={setEmail}    type="email" disabled={saving} placeholder="Enter your email address" />
          {!isEdit && <Field label={t("admin.users.labelPassword")} value={password} onChange={setPassword} type="password" disabled={saving} placeholder="••••••••" />}
          {isEdit && (
            <Field label="Status" value={status} onChange={setStatus} disabled={saving}
              options={[{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }]} />
          )}
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-70 bg-white dark:bg-slate-800 text-black dark:text-white border border-slate-200 dark:border-slate-700">
            {t("admin.cancel")}
          </button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
            style={{ background: "linear-gradient(135deg,#1D4ED8,#0E7490)" }}>
            <Save size={14} />
            {saving ? (isEdit ? t("admin.saving") : "Creating...") : isEdit ? t("admin.save") : "Create Student"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Delete confirm ───────────────────────────────────────────────────────────
function DeleteModal({ user, onClose, onDeleted }: { user: AdminUser; onClose: () => void; onDeleted: () => void }) {
  const { t } = useTranslation();
  const [deleting, setDeleting] = useState(false);
  const confirm = async () => {
    setDeleting(true);
    try { await deleteAdminUser(user.id); onDeleted(); }
    catch { setDeleting(false); }
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-transparent" onClick={onClose}>
      <div className="rounded-2xl p-6 w-full max-w-sm shadow-2xl bg-white dark:bg-[#131c35]" style={{ border: "1px solid var(--ms-border-subtle)" }} onClick={(e) => e.stopPropagation()}>
        <h2 className="text-base font-bold mb-2 text-slate-900 dark:text-slate-100">{t("admin.delete")} User</h2>
        <p className="text-sm mb-5" style={{ color: "hsl(var(--muted-foreground))" }}>
          {t("admin.users.confirmDeleteUser")} <strong>{user.name}</strong>?
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2 rounded-xl text-sm font-semibold"
            style={{ background: "var(--ms-bg-layer2)", border: "1px solid var(--ms-border-subtle)" }}>
            {t("admin.cancel")}
          </button>
          <button onClick={confirm} disabled={deleting}
            className="flex-1 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
            style={{ background: "linear-gradient(135deg,#DC2626,#EF4444)" }}>
            {deleting ? "Deleting…" : t("admin.delete")}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Student Details Modal ───────────────────────────────────────────────────
function UserViewModal({ userId, onClose }: { userId: number; onClose: () => void }) {
  const [user, setUser]     = useState<AdminUserDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminUserById(userId)
      .then((r) => setUser(r.data.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, [userId]);

  const academicLevel = user?.academic_level ?? user?.education_level ?? user?.profile?.academic_level ?? user?.profile?.education_level ?? user?.level ?? user?.academicLevel ?? user?.studyLevel ?? user?.grade ?? 'Not provided';

  const orientationInsights = (() => {
    const raw = user?.orientationInsights ?? user?.interests ?? user?.profile?.interests;
    if (Array.isArray(raw)) return raw;
    if (typeof raw === 'string') return raw.split(',').map((item) => item.trim()).filter(Boolean);
    return [];
  })();

  const completedTests = (() => {
    const raw = user?.completedTests ?? user?.completed_tests ?? user?.tests;
    if (Array.isArray(raw)) return raw;
    return [];
  })();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <div className="absolute inset-0 bg-transparent" onClick={onClose} />
      <div className="relative w-full max-w-3xl overflow-hidden rounded-[20px] bg-white shadow-2xl dark:bg-[#131c35] border border-slate-200 dark:border-slate-800 transform transition-all duration-300 ease-out">
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Student Details</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Profile & Orientation Information</p>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-slate-600 hover:text-red-500 dark:text-slate-300 dark:hover:text-red-400 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-6">
          {loading ? (
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-10 rounded-2xl animate-pulse bg-slate-200 dark:bg-slate-700" />
              ))}
            </div>
          ) : !user ? (
            <div className="rounded-3xl bg-slate-50 p-8 text-center text-sm text-slate-500 dark:bg-slate-900 dark:text-slate-300">
              Unable to load student details.
            </div>
          ) : (
            <StudentProfileSection student={user} />
          )}
        </div>
      </div>
    </div>
  );
}

function StudentProfileSection({ student }: { student: AdminUserDetails }) {
  const academicLevel = student?.academic_level ?? student?.education_level ?? student?.profile?.academic_level ?? student?.profile?.education_level ?? student?.level ?? student?.academicLevel ?? student?.studyLevel ?? student?.grade ?? 'Not provided';

  const orientationInsights = (() => {
    const raw = (student as any)?.orientation_insights ?? student?.orientationInsights ?? student?.interests ?? student?.profile?.interests;
    if (Array.isArray(raw)) return raw;
    if (typeof raw === 'string') return raw.split(',').map((item) => item.trim()).filter(Boolean);
    return [];
  })();

  const scoreSource = (student as any)?.tests ?? (student as any)?.test_scores ?? {};
  const getPoints = (keys: string[]) => {
    for (const key of keys) {
      const value = scoreSource?.[key];
      if (value !== undefined && value !== null) {
        return typeof value === 'number' ? value : Number(value) || 0;
      }
    }
    const completedTestMatch = (student?.completed_tests ?? []).find((test) => {
      return keys.some((key) => (test.title ?? '').toLowerCase().includes(key.replace(/_/g, ' ')));
    });
    if (completedTestMatch) {
      return typeof completedTestMatch.total_score === 'number'
        ? completedTestMatch.total_score
        : Number(completedTestMatch.total_score) || 0;
    }
    return 0;
  };

  const completedTests = [
    { name: 'Skills & Academic Strength Test', points: getPoints(['skills', 'skills_test', 'academic_strength', 'strength_test']) },
    { name: 'Values & Personality Profile', points: getPoints(['values', 'values_test', 'personality', 'personality_score']) },
    { name: 'Aptitude & Interest Assessment', points: getPoints(['aptitude', 'aptitude_test', 'interest', 'interest_test']) },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* Column 1 - Personal / Contact Info */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full text-3xl font-bold text-white"
            style={{ background: 'linear-gradient(135deg,#1D4ED8,#0E7490)' }}>
            {student.name?.charAt(0)?.toUpperCase() ?? '?'}
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">{student.name || 'Unknown Student'}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Joined {student.joined_human ?? 'Unknown'}</p>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
          <p className="text-xs text-slate-400 mb-3">Contact Info</p>
          <div className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
            <div className="flex items-center gap-3">
              <Mail size={16} className="text-slate-400" />
              <div>{student.email ?? '—'}</div>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={16} className="text-slate-400" />
              <div>{student.profile?.phone ?? '—'}</div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin size={16} className="text-slate-400" />
              <div>{student.profile?.city ?? '—'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Column 2 - Academic & Orientation */}
      <div className="space-y-4">
        <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
          <p className="text-xs text-slate-400 mb-3">Academic Level</p>
          <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200">
            <GraduationCap size={16} className="text-slate-400" />
            <div className="font-semibold">{academicLevel}</div>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
          <p className="text-xs text-slate-400 mb-3">Orientation Insights</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {orientationInsights.length > 0 ? (
              orientationInsights.map((insight, idx) => (
                <span key={`${insight}-${idx}`} className="rounded-full px-3 py-1 text-xs font-semibold"
                  style={{ background: '#E6F6FF', color: '#0369A1', border: '1px solid rgba(3,105,161,0.06)' }}>
                  {insight}
                </span>
              ))
            ) : (
              <span className="rounded-full px-3 py-1 text-xs font-semibold"
                style={{ background: '#E6F6FF', color: '#0369A1', border: '1px solid rgba(3,105,161,0.06)' }}>
                No insights available
              </span>
            )}
          </div>

          <div>
            <p className="text-xs text-slate-400 mb-3">Completed Tests</p>
            <div className="space-y-3">
              {completedTests.length > 0 ? (
                completedTests.map((test, idx) => {
                  const name = test.name || 'Unknown Test';
                  const points = typeof test.points === 'number' ? test.points : Number(test.points) || 0;
                  const max = 200;
                  const pct = Math.min(100, Math.round((points / max) * 100));
                  return (
                    <div key={`${name}-${idx}`}>
                      <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                        <div className="font-medium">{name}</div>
                        <div className="font-semibold">{points} pts</div>
                      </div>
                      <div className="mt-2 h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800">
                        <div className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-sky-600" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-xs text-slate-500 dark:text-slate-400">No completed tests yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
const AdminUsersPage = () => {
  const { t } = useTranslation();
  const [users, setUsers]         = useState<AdminUser[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatus] = useState("");
  const [academicLevelFilter, setAcademicLevelFilter] = useState("");
  const [page, setPage]           = useState(1);
  const [lastPage, setLastPage]   = useState(1);
  const [total, setTotal]         = useState(0);
  const [totalTests, setTotalTests] = useState(3);

  const [modalUser, setModalUser]   = useState<AdminUser | null | "new">(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const [viewUserId, setViewUserId]   = useState<number | null>(null);

  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const r = await getAdminUsers({ role: "student", page, per_page: 15 });
      const d = r.data.data as any;
      const items: AdminUser[] = d?.data ?? d ?? [];
      setUsers(items);
      setLastPage(d?.last_page ?? 1);
      setTotal(d?.total ?? items.length);
    } catch {
      setError(t("admin.users.unableToLoad"));
    } finally { setLoading(false); }
  }, [page, t]);

  useEffect(() => { load(); }, [load]);

  // Client-side cumulative filtering
  const filteredStudents = useMemo(() => {
    const term = (searchInput || "").trim().toLowerCase();
    return users.filter((u) => {
      // Search by name or email
      if (term) {
        const name = (u.name || "").toLowerCase();
        const email = (u.email || "").toLowerCase();
        if (!name.includes(term) && !email.includes(term)) return false;
      }
      // Status filter
      if (statusFilter) {
        const s = (u.status || "").toLowerCase();
        if (statusFilter === "active" && !["active", "actif"].includes(s)) return false;
        if (statusFilter === "inactive" && !["inactive", "inactif"].includes(s)) return false;
      }
      // Academic level filter
      if (academicLevelFilter) {
        if ((u.academic_level || "") !== academicLevelFilter) return false;
      }
      return true;
    });
  }, [users, searchInput, statusFilter, academicLevelFilter]);

  useEffect(() => {
    getAdminTests()
      .then((r) => {
        const tests = Array.isArray(r.data.data) ? r.data.data as AdminTestRaw[] : [];
        setTotalTests(tests.filter((test) => test.active).length || 3);
      })
      .catch(() => setTotalTests(3));
  }, []);

  // Debounce search input
  // Removed server-side debounce that triggered API calls on search changes.
  // Search input is handled locally via `filteredStudents`.

  const handleExport = () => {
    if (!users.length) return;
    const ws = XLSX.utils.json_to_sheet(users.map((u) => ({
      ID: u.id,
      Name: u.name,
      Email: u.email,
      AcademicLevel: u.academic_level ?? "—",
      Status: u.status,
      Verified: u.verified ? "Yes" : "No",
      Tests: u.tests,
      Joined: u.joined,
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    XLSX.writeFile(wb, `massarek_students_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-5 animate-fade-in">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold">{t("admin.users.title")}</h1>
          <p className="text-sm mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>
            {users.length} {users.length === 1 ? "student" : "students"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all hover:opacity-80"
            style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)", color: "var(--ms-accent-sky)" }}>
            <Download size={13} /> {t("admin.users.export")}
          </button>
          <button onClick={() => setModalUser("new")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg,#1D4ED8,#0E7490)", boxShadow: "0 4px 14px rgba(14,116,144,0.25)" }}>
            <UserPlus size={14} /> {t("admin.users.addUser")}
          </button>
        </div>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { icon: Users,      color: "var(--ms-accent-cyan)", label: "Total Students", value: total },
          { icon: CheckCircle2, color: "#22C55E",               label: "Oriented Students", value: users.filter((u) => u.tests > 0).length },
          { icon: UserCheck,  color: "#38BDF8",               label: "Active Accounts", value: users.filter((u) => ["active", "actif"].includes((u.status ?? "").toLowerCase())).length },
        ].map((s) => (
          <div key={s.label} className="rounded-xl px-4 py-3 flex items-center gap-3"
            style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)" }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${s.color}18` }}>
              <s.icon size={15} style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-base font-bold tabular-nums">{s.value.toLocaleString()}</p>
              <p className="text-[10px]" style={{ color: "hsl(var(--muted-foreground))" }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search + filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 min-w-0">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "hsl(var(--muted-foreground))" }} />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={t("admin.users.searchPlaceholder")}
            className="w-full pl-10 pr-3 py-2 text-sm rounded-xl outline-none bg-white text-slate-900 placeholder-slate-500 border border-slate-200 dark:bg-[#131c35] dark:text-white dark:placeholder-slate-400 dark:border-slate-700"
          />
        </div>
        <div className="relative w-full md:w-64">
          <select
            value={statusFilter}
            onChange={(e) => { setStatus(e.target.value); }}
            className="appearance-none w-full rounded-xl pl-3 pr-10 py-2 text-sm outline-none transition-all bg-white text-slate-900 placeholder-slate-500 border border-slate-200 dark:bg-[#131c35] dark:text-white dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
        </div>
        <div className="relative w-full md:w-64">
          <select
            value={academicLevelFilter}
            onChange={(e) => { setAcademicLevelFilter(e.target.value); }}
            className="appearance-none w-full rounded-xl pl-3 pr-10 py-2 text-sm outline-none transition-all bg-white text-slate-900 placeholder-slate-500 border border-slate-200 dark:bg-[#131c35] dark:text-white dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
          >
            <option value="">All Levels</option>
            <option value="Middle School">Middle School</option>
            <option value="High School">High School</option>
            <option value="Baccalaureate">Baccalaureate</option>
            <option value="BTS/DUT (2-year)">BTS/DUT (2-year)</option>
            <option value="Bachelor's (3-year)">Bachelor's (3-year)</option>
            <option value="Bachelor's (4-year)">Bachelor's (4-year)</option>
            <option value="Master's">Master's</option>
            <option value="Doctorate">Doctorate</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-400" />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium"
          style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.18)", color: "#F87171" }}>
          <AlertCircle size={14} /> {error}
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl overflow-hidden"
        style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)", backdropFilter: "blur(12px)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--ms-border-subtle)" }}>
                {["Student", "Academic Level", "Tests", "Status", "Verified", "Joined", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider"
                    style={{ color: "hsl(var(--muted-foreground))" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? [...Array(8)].map((_, i) => <SkeletonRow key={i} />)
                : users.length === 0
                ? (
                  <tr><td colSpan={7} className="px-4 py-16 text-center text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
                    No students found.
                  </td></tr>
                )
                : filteredStudents.map((u) => (
                  <tr key={u.id} className="transition-colors hover:bg-[var(--ms-accent-glow)]"
                    style={{ borderTop: "1px solid var(--ms-border-subtle)" }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={u.name} size="sm" />
                        <div className="min-w-0">
                          <p className="font-semibold truncate max-w-[180px]">{u.name}</p>
                          <p className="text-[11px] truncate" style={{ color: "hsl(var(--muted-foreground))" }}>{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs truncate max-w-[160px]" style={{ color: "hsl(var(--muted-foreground))" }}>
                      {u.academic_level ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <TestStatusBadge
                        completed={u.tests >= totalTests}
                        count={u.tests}
                        total={totalTests}
                      />
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={u.status} /></td>
                    <td className="px-4 py-3"><VerifiedBadge verified={u.verified} /></td>
                    <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: "hsl(var(--muted-foreground))" }}>{u.joined}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => setViewUserId(u.id)}
                          className="p-1.5 rounded-lg transition-all hover:opacity-80"
                          style={{ background: "var(--ms-accent-glow)", border: "1px solid var(--ms-border-glow)", color: "var(--ms-accent-sky)" }}>
                          <Eye size={12} />
                        </button>
                        <button onClick={() => setModalUser(u)}
                          className="p-1.5 rounded-lg transition-all hover:opacity-80"
                          style={{ background: "var(--ms-bg-layer2)", border: "1px solid var(--ms-border-subtle)", color: "hsl(var(--muted-foreground))" }}>
                          <Edit2 size={12} />
                        </button>
                        {u.role !== "admin" && (
                          <button onClick={() => setDeleteTarget(u)}
                            className="p-1.5 rounded-lg transition-all hover:opacity-80"
                            style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.18)", color: "#F87171" }}>
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {lastPage > 1 && (
          <div className="flex items-center justify-between px-4 py-3"
            style={{ borderTop: "1px solid var(--ms-border-subtle)" }}>
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg disabled:opacity-40 transition-all"
              style={{ background: "var(--ms-bg-layer2)", border: "1px solid var(--ms-border-subtle)" }}>
              <ChevronLeft size={13} /> {t("admin.users.filterAll") === "Tous" ? "Préc." : "Prev"}
            </button>
            <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
              {t("admin.users.showing")} {page} / {lastPage}
            </span>
            <button onClick={() => setPage((p) => Math.min(lastPage, p + 1))} disabled={page === lastPage}
              className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg disabled:opacity-40 transition-all"
              style={{ background: "var(--ms-bg-layer2)", border: "1px solid var(--ms-border-subtle)" }}>
              Next <ChevronRight size={13} />
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      {modalUser !== null && (
        <UserModal
          user={modalUser === "new" ? null : modalUser}
          onClose={() => setModalUser(null)}
          onSaved={() => { setModalUser(null); load(); }}
        />
      )}
      {deleteTarget && (
        <DeleteModal
          user={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onDeleted={() => { setDeleteTarget(null); load(); }}
        />
      )}
      {viewUserId !== null && (
        <UserViewModal userId={viewUserId} onClose={() => setViewUserId(null)} />
      )}
    </div>
  );
};

export default AdminUsersPage;
