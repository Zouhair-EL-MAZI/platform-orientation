import { useState, useEffect } from "react";
import {
  Users, Search, Filter, MoreHorizontal, UserCheck,
  UserX, Trash2, Edit, Eye, UserPlus, Download,
} from "lucide-react";
import { getAdminUsers, AdminUser } from "@/services/adminApi";

type FilterStatus = "all" | "Active" | "Inactive" | "Pending";

const AdminUsersPage = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

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

  const toggleSelect = (id: number) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );

  const toggleAll = () =>
    setSelectedIds(
      selectedIds.length === filtered.length ? [] : filtered.map((u) => u.id)
    );

  const filterButtons: { label: string; value: FilterStatus }[] = [
    { label: "All", value: "all" },
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" },
    { label: "Pending", value: "Pending" },
  ];

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
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users size={22} style={{ color: "var(--ms-accent-cyan)" }} />
            Users Management
          </h1>
          <p className="text-sm mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>
            {totalUsers} total users · {users.filter((u) => u.status === "Active").length} active
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
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
            Export
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all duration-200"
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
          >
            <UserPlus size={14} />
            Add User
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
            placeholder="Search users..."
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
              {selectedIds.length} selected
            </span>
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={{
                background: "rgba(248,113,113,0.08)",
                border: "1px solid rgba(248,113,113,0.18)",
                color: "#F87171",
              }}
            >
              <Trash2 size={12} />
              Delete
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
                    checked={selectedIds.length === filtered.length && filtered.length > 0}
                    onChange={toggleAll}
                    className="rounded"
                  />
                </th>
                {["User", "Role", "Tests", "Status", "Verified", "Joined", "Last Active", ""].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider"
                    style={{ color: "var(--ms-accent-cyan)", opacity: 0.65 }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
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
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-bold text-sm" style={{ color: "var(--ms-accent-sky)" }}>
                    {u.tests}
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={statusStyle(u.status)}>
                      {u.status}
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
                        className="p-1.5 rounded-lg transition-all hover:text-[var(--ms-accent-cyan)]"
                        style={{ color: "hsl(var(--muted-foreground))" }}
                        title="View"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        className="p-1.5 rounded-lg transition-all hover:text-[var(--ms-accent-sky)]"
                        style={{ color: "hsl(var(--muted-foreground))" }}
                        title="Edit"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        className="p-1.5 rounded-lg transition-all hover:text-[#F87171]"
                        style={{ color: "hsl(var(--muted-foreground))" }}
                        title="Delete"
                      >
                        <MoreHorizontal size={14} />
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
          className="px-5 py-3 flex items-center justify-between text-xs"
          style={{ borderTop: "1px solid var(--ms-border-subtle)", color: "hsl(var(--muted-foreground))" }}
        >
          <span>Showing {filtered.length} of {totalUsers} users</span>
          <div className="flex items-center gap-1">
            {["←", "1", "2", "3", "→"].map((p, i) => (
              <button
                key={i}
                className="w-7 h-7 rounded-lg font-bold transition-all"
                style={
                  p === "1"
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
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;
