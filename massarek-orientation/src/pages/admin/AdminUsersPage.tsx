import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { useTranslation } from "react-i18next";
import {
  Users, Search, Filter, UserCheck,
  UserX, Trash2, Edit, Eye, UserPlus, Download, X, Save, AlertCircle,
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { getAdminUsers, getAdminUserById, updateAdminUser, deleteAdminUser, createAdminUser, AdminUser } from "@/services/adminApi";

type FilterStatus = "all" | "Active" | "Inactive" | "Pending";

// Add User Modal
const AddUserModal = ({ onClose, onSave, loading }: { onClose: () => void; onSave: (data: { name: string; email: string; password: string; role: string }) => void; loading: boolean }) => {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    if (!name.trim() || !email.trim() || !password.trim()) { setError(t("admin.users.allFieldsRequired")); return; }
    if (password.length < 8) { setError(t("admin.users.passwordMinLength")); return; }
    onSave({ name, email, password, role });
  };

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-md flex items-center justify-center z-50" onClick={onClose}>
      <div className="rounded-2xl p-6 w-full max-w-md" style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)", backdropFilter: "blur(12px)" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2"><UserPlus size={18} style={{ color: "var(--ms-accent-sky)" }} />{t("admin.users.addUserTitle")}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg transition-all hover:bg-accent" style={{ color: "hsl(var(--muted-foreground))" }} disabled={loading}><X size={16} /></button>
        </div>
        {error && (
          <div className="rounded-lg p-3 mb-4 flex items-start gap-2" style={{ background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.15)" }}>
            <AlertCircle size={14} style={{ color: "#F87171", flexShrink: 0, marginTop: 2 }} />
            <p className="text-xs" style={{ color: "#F87171" }}>{error}</p>
          </div>
        )}
        <div className="space-y-4">
          {([{label:t("admin.users.labelName"),val:name,setter:setName,type:"text"},{label:t("admin.users.labelEmail"),val:email,setter:setEmail,type:"email"},{label:t("admin.users.labelPassword"),val:password,setter:setPassword,type:"password"}] as {label:string;val:string;setter:(v:string)=>void;type:string}[]).map(({label,val,setter,type}) => (
            <div key={label}>
              <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--ms-accent-cyan)", opacity: 0.65 }}>{label}</label>
              <input type={type} value={val} onChange={(e) => setter(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg bg-transparent text-sm outline-none transition-all" style={{ border: "1px solid var(--ms-border-subtle)", color: "inherit" }} onFocus={(e) => (e.currentTarget.style.borderColor = "var(--ms-border-active)")} onBlur={(e) => (e.currentTarget.style.borderColor = "var(--ms-border-subtle)")} disabled={loading} />
            </div>
          ))}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--ms-accent-cyan)", opacity: 0.65 }}>{t("admin.users.labelRole")}</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg bg-transparent text-sm outline-none transition-all cursor-pointer" style={{ border: "1px solid var(--ms-border-subtle)", color: "inherit" }} onFocus={(e) => (e.currentTarget.style.borderColor = "var(--ms-border-active)")} onBlur={(e) => (e.currentTarget.style.borderColor = "var(--ms-border-subtle)")} disabled={loading}>
              <option value="student">{t("admin.users.roleStudent")}</option>
              <option value="admin">{t("admin.users.roleAdmin")}</option>
            </select>
          </div>
        </div>
        <div className="flex gap-2 mt-6">
          <button onClick={onClose} className="flex-1 px-4 py-2 rounded-xl text-xs font-bold transition-all" style={{ background: "var(--ms-bg-layer2)", border: "1px solid var(--ms-border-subtle)", color: "hsl(var(--muted-foreground))" }} onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--ms-border-glow)")} onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--ms-border-subtle)")} disabled={loading}>{t("admin.cancel")}</button>
          <button onClick={handleSave} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all" style={{ background: "linear-gradient(135deg, #1D4ED8, #0E7490)", border: "1px solid rgba(34,211,238,0.25)", boxShadow: "0 4px 16px rgba(14,116,144,0.20)" }} disabled={loading}>
            <Save size={12} />{loading ? t("admin.users.creating") : t("admin.users.createUser")}
          </button>
        </div>
      </div>
    </div>
  );
};

// View User Modal
const ViewUserModal = ({ user, onClose }: { user: AdminUser | null; onClose: () => void }) => {
  const { t } = useTranslation();
  if (!user) return null;

  return (
    <div
      className="fixed inset-0 bg-transparent backdrop-blur-md flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto"
        style={{
          background: "var(--ms-bg-card)",
          border: "1px solid var(--ms-border-subtle)",
          backdropFilter: "blur(12px)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Eye size={18} style={{ color: "var(--ms-accent-cyan)" }} />
            {t("admin.users.userDetails")}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition-all hover:bg-accent"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white"
            style={{
              background: "linear-gradient(135deg, #1D4ED8, #0E7490)",
              border: "1px solid var(--ms-border-glow)",
            }}
          >
            {user.name.charAt(0)}
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--ms-accent-cyan)", opacity: 0.65 }}>
              {t("admin.users.labelName")}
            </label>
            <p className="text-sm font-semibold mt-1">{user.name}</p>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--ms-accent-cyan)", opacity: 0.65 }}>
              {t("admin.users.labelEmail")}
            </label>
            <p className="text-sm mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>
              {user.email}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--ms-accent-cyan)", opacity: 0.65 }}>
                {t("admin.users.labelRole")}
              </label>
              <span
                className="text-xs font-bold px-2 py-1 rounded-full mt-1 inline-block"
                style={
                  user.role === "admin"
                    ? {
                        background: "rgba(167,139,250,0.12)",
                        color: "#A78BFA",
                        border: "1px solid rgba(167,139,250,0.22)",
                      }
                    : {
                        background: "var(--ms-accent-glow)",
                        color: "var(--ms-accent-sky)",
                        border: "1px solid var(--ms-border-glow)",
                      }
                }
              >
                {user.role}
              </span>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--ms-accent-cyan)", opacity: 0.65 }}>
                {t("admin.users.columns.status")}
              </label>
              <span
                className="text-xs font-bold px-2 py-1 rounded-full mt-1 inline-block"
                style={
                  user.status === "Active"
                    ? {
                        background: "rgba(52,211,153,0.10)",
                        color: "#34D399",
                        border: "1px solid rgba(52,211,153,0.20)",
                      }
                    : {
                        background: "rgba(251,191,36,0.18)",
                        color: "#FBBF24",
                        border: "1px solid rgba(251,191,36,0.28)",
                      }
                }
              >
                {user.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--ms-accent-cyan)", opacity: 0.65 }}>
                {t("admin.users.columns.tests")}
              </label>
              <p className="text-sm font-bold mt-1" style={{ color: "var(--ms-accent-sky)" }}>
                {user.tests}
              </p>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--ms-accent-cyan)", opacity: 0.65 }}>
                {t("admin.users.columns.verified")}
              </label>
              <div className="mt-1">
                {user.verified ? (
                  <UserCheck size={16} style={{ color: "#34D399" }} />
                ) : (
                  <UserX size={16} style={{ color: "#F87171" }} />
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--ms-accent-cyan)", opacity: 0.65 }}>
                {t("admin.users.columns.joined")}
              </label>
              <p className="text-xs mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>
                {user.joined}
              </p>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--ms-accent-cyan)", opacity: 0.65 }}>
                {t("admin.users.columns.lastActive")}
              </label>
              <p className="text-xs mt-1 font-mono-ts" style={{ color: "var(--ms-accent-cyan)", opacity: 0.5 }}>
                {user.lastActive}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 px-4 py-2 rounded-xl text-xs font-bold transition-all"
          style={{
            background: "var(--ms-bg-layer2)",
            border: "1px solid var(--ms-border-subtle)",
            color: "var(--ms-accent-sky)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--ms-border-glow)")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--ms-border-subtle)")}
        >
          {t("admin.close")}
        </button>
      </div>
    </div>
  );
};

// Edit User Modal
const EditUserModal = ({ user, onClose, onSave, loading }: { user: AdminUser | null; onClose: () => void; onSave: (data: { name: string; email: string; role: string }) => void; loading: boolean }) => {
  const { t } = useTranslation();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [role, setRole] = useState(user?.role || "student");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
      setError(null);
    }
  }, [user]);

  if (!user) return null;

  const handleSave = () => {
    if (!name.trim() || !email.trim()) {
      setError(t("admin.users.nameEmailRequired"));
      return;
    }
    onSave({ name, email, role });
  };

  return (
    <div
      className="fixed inset-0 bg-transparent backdrop-blur-md flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="rounded-2xl p-6 w-full max-w-md"
        style={{
          background: "var(--ms-bg-card)",
          border: "1px solid var(--ms-border-subtle)",
          backdropFilter: "blur(12px)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Edit size={18} style={{ color: "var(--ms-accent-sky)" }} />
            {t("admin.users.editUser")}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition-all hover:bg-accent"
            style={{ color: "hsl(var(--muted-foreground))" }}
            disabled={loading}
          >
            <X size={16} />
          </button>
        </div>

        {error && (
          <div
            className="rounded-lg p-3 mb-4 flex items-start gap-2"
            style={{ background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.15)" }}
          >
            <AlertCircle size={14} style={{ color: "#F87171", flexShrink: 0, marginTop: 2 }} />
            <p className="text-xs" style={{ color: "#F87171" }}>
              {error}
            </p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--ms-accent-cyan)", opacity: 0.65 }}>
              {t("admin.users.labelName")}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-lg bg-transparent text-sm outline-none transition-all"
              style={{ border: "1px solid var(--ms-border-subtle)", color: "inherit" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--ms-border-active)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--ms-border-subtle)")}
              disabled={loading}
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--ms-accent-cyan)", opacity: 0.65 }}>
              {t("admin.users.labelEmail")}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-lg bg-transparent text-sm outline-none transition-all"
              style={{ border: "1px solid var(--ms-border-subtle)", color: "inherit" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--ms-border-active)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--ms-border-subtle)")}
              disabled={loading}
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--ms-accent-cyan)", opacity: 0.65 }}>
              {t("admin.users.labelRole")}
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-lg bg-transparent text-sm outline-none transition-all cursor-pointer"
              style={{ border: "1px solid var(--ms-border-subtle)", color: "inherit" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--ms-border-active)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--ms-border-subtle)")}
              disabled={loading}
            >
              <option value="student">{t("admin.users.roleStudent")}</option>
              <option value="admin">{t("admin.users.roleAdmin")}</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-xl text-xs font-bold transition-all"
            style={{
              background: "var(--ms-bg-layer2)",
              border: "1px solid var(--ms-border-subtle)",
              color: "hsl(var(--muted-foreground))",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--ms-border-glow)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--ms-border-subtle)")}
            disabled={loading}
          >
            {t("admin.cancel")}
          </button>
          <button
            onClick={handleSave}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all"
            style={{
              background: "linear-gradient(135deg, #1D4ED8, #0E7490)",
              border: "1px solid rgba(34,211,238,0.25)",
              boxShadow: "0 4px 16px rgba(14,116,144,0.20)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow = "0 6px 24px rgba(14,116,144,0.35)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.boxShadow = "0 4px 16px rgba(14,116,144,0.20)")
            }
            disabled={loading}
          >
            <Save size={12} />
            {loading ? t("admin.saving") : t("admin.users.saveChanges")}
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminUsersPage = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const PAGE_SIZE = 10;
  
  // Modal state
  const [viewUser, setViewUser] = useState<AdminUser | null>(null);
  const [editUser, setEditUser] = useState<AdminUser | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [addUserLoading, setAddUserLoading] = useState(false);
  const { t } = useTranslation();
  // export options removed; only XLSX supported now

  const loadUsers = async () => {
    setLoading(true);
    setFetchError(null);

    try {
      const res = await getAdminUsers();
      const payload = res.data.data;
      const usersList: AdminUser[] = Array.isArray(payload)
        ? payload
        : payload.data ?? payload;

      setUsers(usersList);
      setTotalUsers(
        !Array.isArray(payload) && typeof payload.total === "number"
          ? payload.total
          : usersList.length
      );
    } catch (error) {
      setFetchError("Unable to load users from the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || u.status === filter;
    return matchSearch && matchFilter;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [search, filter, users]);

  const toggleSelect = (id: number) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );

  const toggleAll = () =>
    setSelectedIds(
      selectedIds.length === paginated.length ? [] : paginated.map((u) => u.id)
    );

  const handleViewUser = async (userId: number) => {
    try {
      const res = await getAdminUserById(userId);
      setViewUser(res.data.data);
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  };

  const handleEditUser = async (userId: number) => {
    try {
      const res = await getAdminUserById(userId);
      setEditUser(res.data.data);
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  };

  const handleSaveUser = async (data: { name: string; email: string; role: string }) => {
    if (!editUser) return;
    
    setEditLoading(true);
    try {
      await updateAdminUser(editUser.id, data);
      setSuccessMessage(t("admin.users.updatedSuccess"));
      setTimeout(() => setSuccessMessage(null), 3000);
      await loadUsers();
      setEditUser(null);
    } catch (error) {
      console.error("Failed to update user:", error);
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm(t("admin.users.confirmDeleteUser"))) return;
    
    setDeleteLoading(userId);
    try {
      await deleteAdminUser(userId);
      setSuccessMessage(t("admin.users.deletedSuccess"));
      setTimeout(() => setSuccessMessage(null), 3000);
      await loadUsers();
      setSelectedIds((prev) => prev.filter((id) => id !== userId));
    } catch (error) {
      console.error("Failed to delete user:", error);
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleDeleteSelected = async () => {
    if (!confirm(t("admin.users.confirmDeleteSelected", { count: selectedIds.length }))) return;

    try {
      for (const id of selectedIds) {
        await deleteAdminUser(id);
      }
      setSuccessMessage(t("admin.users.deletedMultiSuccess"));
      setTimeout(() => setSuccessMessage(null), 3000);
      await loadUsers();
      setSelectedIds([]);
    } catch (error) {
      console.error("Failed to delete users:", error);
    }
  };

  const handleAddUser = async (data: { name: string; email: string; password: string; role: string }) => {
    setAddUserLoading(true);
    try {
      await createAdminUser(data);
      setSuccessMessage(t("admin.users.createdSuccess"));
      setTimeout(() => setSuccessMessage(null), 3000);
      await loadUsers();
      setShowAddUser(false);
    } catch (error) {
      console.error("Failed to create user:", error);
    } finally {
      setAddUserLoading(false);
    }
  };

  const exportXLSX = () => {
    try {
      const headers = [
        t("admin.users.columns.user"),
        t("admin.users.columns.name"),
        t("admin.users.columns.email"),
        t("admin.users.columns.role"),
        t("admin.users.columns.tests"),
        t("admin.users.columns.status"),
        t("admin.users.columns.verified"),
        t("admin.users.columns.joined"),
        t("admin.users.columns.lastActive"),
      ];
      const rows = filtered.map((u) => [
        u.id,
        u.name,
        u.email,
        translateRole(u.role),
        u.tests ?? "",
        translateStatus(u.status),
        u.verified ? t("common.yes") : t("common.no"),
        u.joined ?? "",
        u.lastActive ?? "",
      ]);

      const aoa = [headers, ...rows];
      const ws = XLSX.utils.aoa_to_sheet(aoa);

      ws["!cols"] = [
        { wch: 8 }, { wch: 22 }, { wch: 32 }, { wch: 12 }, { wch: 8 }, { wch: 12 }, { wch: 10 }, { wch: 16 }, { wch: 20 },
      ];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, t("admin.users.title"));
      XLSX.writeFile(wb, `users_${new Date().toISOString().split("T")[0]}.xlsx`);

      setSuccessMessage(t("admin.users.exportSuccess"));
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Failed to export users to Excel:", error);
      setSuccessMessage(t("admin.users.exportFailed"));
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  // CSV export removed per request

  const filterButtons: { label: string; value: FilterStatus }[] = [
    { label: t("admin.users.filterAll"), value: "all" },
    { label: t("admin.users.filterActive"), value: "Active" },
    { label: t("admin.users.filterInactive"), value: "Inactive" },
    { label: t("admin.users.filterPending"), value: "Pending" },
  ];

  const translateStatus = (status: string) => {
    if (status === "Active") return t("admin.users.filterActive");
    if (status === "Inactive") return t("admin.users.filterInactive");
    if (status === "Pending") return t("admin.users.filterPending");
    return status;
  };

  const translateRole = (role: string) => {
    if (role === "admin") return t("admin.users.roleAdmin");
    return t("admin.users.roleStudent");
  };

  const statusStyle = (status: string) => {
    if (status === "Active")
      return {
        background: "rgba(52,211,153,0.10)",
        color: "#34D399",
        border: "1px solid rgba(52,211,153,0.20)",
      };
    if (status === "Pending")
      return {
        background: "rgba(251,191,36,0.18)",
        color: "#FBBF24",
        border: "1px solid rgba(251,191,36,0.28)",
      };
    return {
      background: "var(--ms-bg-layer3)",
      color: "hsl(var(--muted-foreground))",
      border: "1px solid var(--ms-border-subtle)",
    };
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      {successMessage && (
        <div
          className="rounded-xl px-4 py-3 text-sm font-semibold flex items-center gap-2"
          style={{
            background: "rgba(52,211,153,0.10)",
            border: "1px solid rgba(52,211,153,0.20)",
            color: "#34D399",
          }}
        >
          ✓ {successMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users size={22} style={{ color: "var(--ms-accent-cyan)" }} />
            {t("admin.users.title")}
          </h1>
          <p className="text-sm mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>
            {totalUsers} {t("admin.users.totalUsers")} · {users.filter((u) => u.status === "Active").length} {t("admin.users.active")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => exportXLSX()}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200"
            style={{
              background: "var(--ms-bg-card)",
              border: "1px solid var(--ms-border-subtle)",
              color: "hsl(var(--muted-foreground))",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = "var(--ms-border-glow)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = "var(--ms-border-subtle)")
            }
          >
            <Download size={14} />
            {t("admin.users.export")}
          </button>
          
          <button
            onClick={() => setShowAddUser(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all duration-200"
            style={{
              background: "linear-gradient(135deg, #1D4ED8, #0E7490)",
              border: "1px solid rgba(34,211,238,0.25)",
              boxShadow: "0 4px 16px rgba(14,116,144,0.20)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 6px 24px rgba(14,116,144,0.35)")}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(14,116,144,0.20)")}
          >
            <UserPlus size={14} />
            {t("admin.users.addUser")}
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div
        className="rounded-2xl p-4 flex flex-wrap gap-3 items-center"
        style={{
          background: "var(--ms-bg-card)",
          border: "1px solid var(--ms-border-subtle)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Search */}
        <div
          className="relative flex items-center gap-2 flex-1 min-w-[200px] max-w-sm rounded-xl h-9 px-3"
          style={{ background: "var(--ms-bg-layer2)", border: "1px solid var(--ms-border-subtle)" }}
        >
          <Search size={13} className="text-muted-foreground flex-shrink-0" />
          <input
            type="text"
            placeholder={t("admin.users.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1">
          <Filter size={13} style={{ color: "hsl(var(--muted-foreground))" }} className="mr-1" />
          {filterButtons.map((b) => (
            <button
              key={b.value}
              onClick={() => setFilter(b.value)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200"
              style={
                filter === b.value
                  ? {
                      background: "var(--ms-accent-glow)",
                      border: "1px solid var(--ms-border-glow)",
                      color: "var(--ms-accent-sky)",
                    }
                  : {
                      background: "transparent",
                      border: "1px solid transparent",
                      color: "hsl(var(--muted-foreground))",
                    }
              }
            >
              {b.label}
            </button>
          ))}
        </div>

        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs font-medium" style={{ color: "var(--ms-accent-sky)" }}>
              {selectedIds.length} {t("admin.users.selected")}
            </span>
            <button
              onClick={handleDeleteSelected}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={{
                background: "rgba(248,113,113,0.08)",
                border: "1px solid rgba(248,113,113,0.18)",
                color: "#F87171",
              }}
            >
              <Trash2 size={12} />
              {t("admin.delete")}
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div
        className="rounded-2xl overflow-hidden card-top-glow"
        style={{
          background: "var(--ms-bg-card)",
          border: "1px solid var(--ms-border-subtle)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--ms-border-subtle)" }}>
                <th className="px-5 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === paginated.length && paginated.length > 0}
                    onChange={toggleAll}
                    className="rounded"
                  />
                </th>
                {[
                  t("admin.users.columns.user"),
                  t("admin.users.columns.role"),
                  t("admin.users.columns.tests"),
                  t("admin.users.columns.status"),
                  t("admin.users.columns.verified"),
                  t("admin.users.columns.joined"),
                  t("admin.users.columns.lastActive"),
                  "",
                ].map((h, index) => (
                  <th
                    key={`${h}-${index}`}
                    className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider"
                    style={{ color: "var(--ms-accent-cyan)", opacity: 0.65 }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((u) => (
                <tr
                  key={u.id}
                  className="activity-hover"
                  style={{
                    borderBottom: "1px solid var(--ms-border-subtle)",
                    background: selectedIds.includes(u.id) ? "var(--ms-accent-glow)" : undefined,
                  }}
                >
                  <td className="px-5 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(u.id)}
                      onChange={() => toggleSelect(u.id)}
                      className="rounded"
                    />
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                        style={{
                          background: "linear-gradient(135deg, #1D4ED8, #0E7490)",
                          border: "1px solid var(--ms-border-glow)",
                        }}
                      >
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{u.name}</div>
                        <div className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                          {u.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={
                        u.role === "admin"
                          ? {
                              background: "rgba(167,139,250,0.12)",
                              color: "#A78BFA",
                              border: "1px solid rgba(167,139,250,0.22)",
                            }
                          : {
                              background: "var(--ms-accent-glow)",
                              color: "var(--ms-accent-sky)",
                              border: "1px solid var(--ms-border-glow)",
                            }
                      }
                    >
                      {translateRole(u.role)}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-bold text-sm" style={{ color: "var(--ms-accent-sky)" }}>
                    {u.tests}
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={statusStyle(u.status)}>
                      {translateStatus(u.status)}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    {u.verified ? (
                      <UserCheck size={15} style={{ color: "#34D399" }} />
                    ) : (
                      <UserX size={15} style={{ color: "#F87171" }} />
                    )}
                  </td>
                  <td className="px-5 py-3 text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                    {u.joined}
                  </td>
                  <td
                    className="px-5 py-3 text-xs font-mono-ts"
                    style={{ color: "var(--ms-accent-cyan)", opacity: 0.5 }}
                  >
                    {u.lastActive}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleViewUser(u.id)}
                        className="p-1.5 rounded-lg transition-all hover:text-[var(--ms-accent-cyan)]"
                        style={{ color: "hsl(var(--muted-foreground))" }}
                        title={t("common.view")}
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => handleEditUser(u.id)}
                        className="p-1.5 rounded-lg transition-all hover:text-[var(--ms-accent-sky)]"
                        style={{ color: "hsl(var(--muted-foreground))" }}
                        title={t("admin.edit")}
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        disabled={deleteLoading === u.id}
                        className="p-1.5 rounded-lg transition-all hover:text-[#F87171]"
                        style={{ color: "hsl(var(--muted-foreground))" }}
                        title={t("admin.delete")}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div
          className="px-5 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-xs"
          style={{ borderTop: "1px solid var(--ms-border-subtle)", color: "hsl(var(--muted-foreground))" }}
        >
          <span>
            {t("admin.users.showing")} {paginated.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}
            {paginated.length > 0 && `–${(page - 1) * PAGE_SIZE + paginated.length}`} {t("admin.users.of")} {filtered.length} {t("admin.users.users")}
          </span>
          {totalPages > 1 && (
            <Pagination className="justify-end">
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page > 1) setPage(page - 1);
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
                  if (page < totalPages) setPage(page + 1);
                }}
                className={page === totalPages ? "pointer-events-none opacity-50" : undefined}
              />
            </Pagination>
          )}
        </div>
      </div>

      {/* Modals */}
      <ViewUserModal user={viewUser} onClose={() => setViewUser(null)} />
      <EditUserModal user={editUser} onClose={() => setEditUser(null)} onSave={handleSaveUser} loading={editLoading} />
      {showAddUser && <AddUserModal onClose={() => setShowAddUser(false)} onSave={handleAddUser} loading={addUserLoading} />}
    </div>
  );
};

export default AdminUsersPage;
