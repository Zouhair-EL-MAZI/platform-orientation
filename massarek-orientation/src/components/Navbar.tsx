import { Bell, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MassarekLogo from "./MassarekLogo";
import { SidebarTrigger } from "./ui/sidebar";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";

const Navbar = () => {
  const { t } = useTranslation();
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
        <Link to="/" className="lg:hidden">
          <MassarekLogo size="sm" imageSize="md" />
        </Link>
      </div>

      <div
        className="relative hidden sm:flex items-center gap-2 flex-1 max-w-sm rounded-full h-9 px-4 backdrop-blur-sm transition-all"
        style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)" }}
      >
        <Search size={14} className="text-muted-foreground flex-shrink-0" />
        <input
          type="text"
          placeholder={t("navbar.searchPlaceholder")}
          className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground font-sans"
        />
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
        <button
          className="relative rounded-full p-2 text-muted-foreground transition-all hover:text-[var(--ms-accent-cyan)]"
          style={{ border: "1px solid var(--ms-border-subtle)", background: "var(--ms-bg-card)" }}
        >
          <Bell size={16} />
          <span
            className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full border-2"
            style={{
              background: "var(--ms-accent-cyan)",
              boxShadow: "0 0 6px var(--ms-accent-cyan)",
              borderColor: "var(--ms-bg-base)",
            }}
          />
        </button>
        <Link
          to="/profile"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white text-sm font-bold"
          style={{
            background: "linear-gradient(135deg, var(--ms-accent-blue), var(--ms-accent-cyan))",
            border: "2px solid var(--ms-border-glow)",
            boxShadow: "0 0 14px var(--ms-accent-glow-strong)",
          }}
        >
          S
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
