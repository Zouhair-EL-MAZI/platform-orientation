import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { User, LogOut, ChevronDown } from "lucide-react";
import MassarekLogo from "./MassarekLogo";
import { SidebarTrigger } from "./ui/sidebar";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";
import { useAuth } from "@/hooks/use-auth";

const Navbar = () => {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const [open, setOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  const initial = user?.name?.trim().charAt(0).toUpperCase() ?? "?";
  const avatar  = user?.avatar ?? null;
  const avatarSrc = avatar
    ? avatar.startsWith("http")
      ? avatar
      : `http://127.0.0.1:8000${avatar}`
    : null;

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header
      className="sticky top-0 z-30 h-[60px] flex items-center px-4 sm:px-6 gap-3 backdrop-blur-xl border-b transition-all duration-300"
      style={{ background: "var(--ms-bg-navbar)", borderColor: "var(--ms-border-subtle)" }}
    >
      {/* ── Left: sidebar toggle + mobile logo ── */}
      <div className="flex items-center gap-2">
        <SidebarTrigger
          className="rounded-lg border transition-all duration-200 hover:text-[var(--ms-accent-cyan)] hover:border-[var(--ms-border-glow)]"
          style={{ borderColor: "var(--ms-border-subtle)", background: "transparent" }}
        />
        <Link to="/" className="lg:hidden">
          <MassarekLogo size="sm" imageSize="md" />
        </Link>
      </div>

      <div className="flex-1" />

      {/* ── Right: Language + Theme + Avatar dropdown ── */}
      <div className="flex items-center gap-1.5">

        {/* Language switcher */}
        <LanguageSwitcher />

        {/* Theme toggle */}
        <div
          className="rounded-lg transition-all duration-200 hover:border-[var(--ms-border-glow)]"
          style={{ border: "1px solid var(--ms-border-subtle)", background: "var(--ms-bg-card)" }}
        >
          <ThemeToggle />
        </div>

        {/* Avatar + dropdown */}
        <div ref={dropRef} className="relative">

          {/* Avatar button */}
          <button
            onClick={() => setOpen(v => !v)}
            className="flex items-center gap-1.5 rounded-xl transition-all duration-200 hover:scale-105 focus:outline-none"
            style={{
              border:    "2px solid var(--ms-border-glow)",
              boxShadow: "0 0 12px var(--ms-accent-glow-strong)",
            }}
            title={user?.name ?? "Account"}
          >
            {/* Avatar circle */}
            <div
              className="h-9 w-9 rounded-[10px] flex items-center justify-center text-sm font-extrabold overflow-hidden"
              style={{
                background: avatarSrc
                  ? undefined
                  : "linear-gradient(135deg, var(--ms-accent-blue), var(--ms-accent-cyan))",
                color: "#fff",
              }}
            >
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt={user?.name ?? "Avatar"}
                  className="w-full h-full object-cover"
                  onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                />
              ) : initial}
            </div>
          </button>

          {/* Dropdown */}
          {open && (
            <div
              className="absolute right-0 top-[calc(100%+8px)] w-52 rounded-2xl overflow-hidden z-50"
              style={{
                background:    "var(--ms-bg-card)",
                border:        "1px solid var(--ms-border-subtle)",
                backdropFilter:"blur(20px)",
                boxShadow:     "0 16px 48px rgba(0,0,0,0.25)",
                animation:     "ms-msg-in 0.15s ease-out both",
              }}
            >
              {/* User info */}
              <div
                className="px-4 py-3"
                style={{ borderBottom: "1px solid var(--ms-border-subtle)" }}
              >
                <p className="text-sm font-bold truncate">{user?.name ?? "User"}</p>
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  {user?.email ?? ""}
                </p>
              </div>

              {/* Menu items */}
              <div className="p-1.5 space-y-0.5">

                {/* Profile */}
                <button
                  onClick={() => { setOpen(false); navigate("/profile"); }}
                  className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 text-left"
                  style={{ color: "hsl(var(--foreground))" }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = "var(--ms-accent-glow)";
                    (e.currentTarget as HTMLElement).style.color = "var(--ms-accent-sky)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                    (e.currentTarget as HTMLElement).style.color = "hsl(var(--foreground))";
                  }}
                >
                  <User size={15} style={{ flexShrink: 0 }} />
                  My Profile
                </button>

                {/* Divider */}
                <div style={{ height: 1, background: "var(--ms-border-subtle)", margin: "4px 0" }} />

                {/* Sign out */}
                <button
                  onClick={() => { setOpen(false); navigate("/logout"); }}
                  className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 text-left"
                  style={{ color: "#F87171" }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(248,113,113,0.10)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                  }}
                >
                  <LogOut size={15} style={{ flexShrink: 0 }} />
                  Sign out
                </button>

              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
