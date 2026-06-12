import { Shield } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MassarekLogo from "./MassarekLogo";
import { SidebarTrigger } from "./ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";
import { useAuth } from "@/hooks/use-auth";

const AdminNavbar = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "A";

  return (
    <header
      className="sticky top-0 z-30 h-[60px] flex items-center px-4 sm:px-6 gap-3 backdrop-blur-xl border-b transition-all duration-300"
      style={{
        background: "var(--ms-bg-navbar)",
        borderColor: "var(--ms-border-subtle)",
      }}
    >
      <div className="flex items-center gap-2">
        <SidebarTrigger
          className="rounded-lg border transition-all hover:text-[var(--ms-accent-cyan)]"
          style={{ borderColor: "var(--ms-border-subtle)", background: "transparent" }}
        />
        <Link to="/admin/dashboard" className="lg:hidden">
          <MassarekLogo size="sm" imageSize="md" />
        </Link>
      </div>

      {/* Admin badge */}
      <div
        className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold"
        style={{
          background: "linear-gradient(135deg, rgba(37,99,235,0.15), rgba(34,211,238,0.10))",
          border: "1px solid var(--ms-border-glow)",
          color: "var(--ms-accent-sky)",
        }}
      >
        <Shield size={12} />
        <span>{t("adminNavbar.adminPanel")}</span>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-2">
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
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white text-sm font-bold transition-all hover:scale-[1.02]"
              style={{
                background: "linear-gradient(135deg, #1D4ED8, #0E7490)",
                border: "2px solid var(--ms-border-glow)",
                boxShadow: "0 0 14px var(--ms-accent-glow-strong)",
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
            {/* Profile link removed as requested */}
            <DropdownMenuItem asChild>
              <Link
                to="/admin/settings"
                className="block w-full rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-[var(--ms-accent-glow)] hover:text-[var(--ms-accent-cyan)]"
              >
                {t("adminSidebar.settings")}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={(event) => {
                event.preventDefault();
                navigate("/logout");
              }}
              className="text-sm text-rose-400 hover:text-rose-300"
            >
              {t("adminSidebar.signOut")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default AdminNavbar;
