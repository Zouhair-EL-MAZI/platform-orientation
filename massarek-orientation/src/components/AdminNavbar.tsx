import { useState, useEffect, useRef } from "react";
import { Shield, Search, X, Users, Briefcase, FileQuestion, Sparkles } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MassarekLogo from "./MassarekLogo";
import { SidebarTrigger } from "./ui/sidebar";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";
import { useAuth } from "@/hooks/use-auth";
import { getAdminUsers, getAdminCareers, getAdminTests } from "@/services/adminApi";

// ── Breadcrumb map ────────────────────────────────────────────────────────────
const BREADCRUMBS: Record<string, { label: string; parent?: string; parentPath?: string }> = {
  "/admin/dashboard":       { label: "Dashboard" },
  "/admin/users":           { label: "Users",           parent: "Dashboard", parentPath: "/admin/dashboard" },
  "/admin/tests":           { label: "Tests",           parent: "Dashboard", parentPath: "/admin/dashboard" },
  "/admin/careers":         { label: "Careers",         parent: "Dashboard", parentPath: "/admin/dashboard" },
  "/admin/recommendations": { label: "Recommendations", parent: "Dashboard", parentPath: "/admin/dashboard" },
  "/admin/analytics":       { label: "Analytics",       parent: "Dashboard", parentPath: "/admin/dashboard" },
  "/admin/settings":        { label: "Settings",        parent: "Dashboard", parentPath: "/admin/dashboard" },
};

type SearchResult = { type: string; label: string; sub: string; path: string; icon: React.ElementType };

// ── Global Search ─────────────────────────────────────────────────────────────
function GlobalSearch() {
  const [query, setQuery]       = useState("");
  const [results, setResults]   = useState<SearchResult[]>([]);
  const [loading, setLoading]   = useState(false);
  const [open, setOpen]         = useState(false);
  const inputRef                = useRef<HTMLInputElement>(null);
  const navigate                = useNavigate();

  useEffect(() => {
    if (!query.trim()) { setResults([]); setOpen(false); return; }
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const [users, careers, tests] = await Promise.all([
          getAdminUsers({ search: query, per_page: 3 }),
          getAdminCareers({ search: query, per_page: 3 }),
          getAdminTests(),
        ]);
        const r: SearchResult[] = [];
        users.data.data.forEach((u) => r.push({ type: "user",   label: u.name,  sub: u.email,       path: "/admin/users",   icon: Users }));
        careers.data.data.forEach((c) => r.push({ type: "career", label: c.title, sub: c.category?.name ?? "", path: "/admin/careers", icon: Briefcase }));
        tests.data.data.filter((t) => t.title.toLowerCase().includes(query.toLowerCase())).slice(0, 3)
          .forEach((t) => r.push({ type: "test", label: t.title, sub: `${t.submissions_count} submissions`, path: "/admin/tests", icon: FileQuestion }));
        setResults(r.slice(0, 8));
        setOpen(r.length > 0);
      } catch { /* silent */ }
      finally { setLoading(false); }
    }, 350);
    return () => clearTimeout(t);
  }, [query]);

  const clear = () => { setQuery(""); setResults([]); setOpen(false); };
  const go    = (path: string) => { navigate(path); clear(); };

  return (
    <div className="relative flex-1 max-w-sm hidden sm:block">
      <div className="relative flex items-center">
        <Search size={13} className="absolute left-3 text-muted-foreground pointer-events-none" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Search users, careers, tests…"
          className="w-full pl-8 pr-8 py-1.5 text-xs rounded-xl bg-transparent focus:outline-none transition-all"
          style={{
            background: "var(--ms-bg-card)",
            border: "1px solid var(--ms-border-subtle)",
            color: "inherit",
          }}
          onFocus={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--ms-border-glow)"; }}
          onBlur={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--ms-border-subtle)"; setTimeout(() => setOpen(false), 150); }}
        />
        {query && (
          <button onClick={clear} className="absolute right-2.5 text-muted-foreground hover:opacity-70">
            <X size={11} />
          </button>
        )}
        {loading && <span className="absolute right-2.5 w-3 h-3 border-2 rounded-full animate-spin" style={{ borderColor: "var(--ms-accent-cyan)", borderTopColor: "transparent" }} />}
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1.5 rounded-xl overflow-hidden z-50 shadow-2xl"
          style={{ background: "var(--ms-bg-layer1)", border: "1px solid var(--ms-border-subtle)" }}>
          {results.map((r, i) => (
            <button key={i} onMouseDown={() => go(r.path)}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-xs transition-colors hover:bg-[var(--ms-accent-glow)]"
              style={{ borderBottom: i < results.length - 1 ? "1px solid var(--ms-border-subtle)" : "none" }}>
              <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "var(--ms-accent-glow)", border: "1px solid var(--ms-border-glow)" }}>
                <r.icon size={11} style={{ color: "var(--ms-accent-sky)" }} />
              </div>
              <div className="min-w-0">
                <p className="font-semibold truncate">{r.label}</p>
                <p className="text-[10px] text-muted-foreground truncate">{r.sub}</p>
              </div>
              <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-md flex-shrink-0"
                style={{ background: "var(--ms-accent-glow)", color: "var(--ms-accent-sky)", border: "1px solid var(--ms-border-glow)" }}>
                {r.type}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
const AdminNavbar = () => {
  const { t }     = useTranslation();
  const { user }  = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  const crumb = BREADCRUMBS[location.pathname] ?? { label: "Admin" };
  const initials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase()
    : "A";

  return (
    <header
      className="sticky top-0 z-30 h-[60px] flex items-center px-4 sm:px-6 gap-3 backdrop-blur-xl border-b transition-all duration-300"
      style={{ background: "var(--ms-bg-navbar)", borderColor: "var(--ms-border-subtle)" }}
    >
      {/* Left: trigger + logo + breadcrumb */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <SidebarTrigger
          className="rounded-lg border transition-all hover:text-[var(--ms-accent-cyan)]"
          style={{ borderColor: "var(--ms-border-subtle)", background: "transparent" }}
        />
        <Link to="/admin/dashboard" className="lg:hidden">
          <MassarekLogo size="sm" imageSize="md" />
        </Link>
      </div>

      {/* Breadcrumb */}
      <div className="hidden md:flex items-center gap-1.5 text-xs flex-shrink-0">
        {crumb.parent && (
          <>
            <Link to={crumb.parentPath!} className="text-muted-foreground hover:text-[var(--ms-accent-sky)] transition-colors font-medium">
              {crumb.parent}
            </Link>
            <span className="text-muted-foreground">/</span>
          </>
        )}
        <span className="font-bold" style={{ color: "var(--ms-accent-sky)" }}>{crumb.label}</span>
      </div>

      {/* Admin badge */}
      <div
        className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold flex-shrink-0"
        style={{
          background: "linear-gradient(135deg, rgba(37,99,235,0.12), rgba(34,211,238,0.08))",
          border: "1px solid var(--ms-border-glow)",
          color: "var(--ms-accent-sky)",
        }}
      >
        <Shield size={11} />
        <span>{t("adminNavbar.adminPanel", "Admin Panel")}</span>
      </div>

      {/* Center: global search */}
      <div className="flex-1 flex justify-center px-2">
        <GlobalSearch />
      </div>

      {/* Right: controls */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <LanguageSwitcher />
        <div
          className="rounded-full p-1.5 transition-all hover:text-[var(--ms-accent-cyan)] cursor-pointer"
          style={{ border: "1px solid var(--ms-border-subtle)", background: "var(--ms-bg-card)" }}
        >
          <ThemeToggle />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-white text-xs font-bold transition-all hover:scale-[1.04]"
              style={{
                background: "linear-gradient(135deg, #1D4ED8, #0E7490)",
                border: "2px solid var(--ms-border-glow)",
                boxShadow: "0 0 12px var(--ms-accent-glow-strong)",
              }}
            >
              {initials}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="min-w-[160px] rounded-2xl border border-[var(--ms-border-subtle)] bg-[var(--ms-bg-card)] p-1 shadow-xl"
          >
            <div className="px-3 py-2 border-b border-[var(--ms-border-subtle)] mb-1">
              <p className="text-xs font-bold truncate">{user?.name}</p>
              <p className="text-[11px] text-muted-foreground truncate">{user?.email}</p>
            </div>
            <DropdownMenuItem asChild>
              <Link to="/profile" className="block w-full rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-[var(--ms-accent-glow)] hover:text-[var(--ms-accent-cyan)]">
                My Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/admin/settings" className="block w-full rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-[var(--ms-accent-glow)] hover:text-[var(--ms-accent-cyan)]">
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={(e) => { e.preventDefault(); navigate("/logout"); }}
              className="text-sm text-rose-400 hover:text-rose-300 rounded-lg px-3 py-2"
            >
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default AdminNavbar;
