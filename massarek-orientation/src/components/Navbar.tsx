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
    <header className="sticky top-4 z-30 mx-4 mb-4 rounded-[2rem] border border-border bg-card/90 px-4 py-3 shadow-sm shadow-slate-900/5 backdrop-blur-xl backdrop-saturate-150 transition-all duration-300 sm:mx-6 lg:mx-8">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="mr-1" />
          <Link to="/" className="lg:hidden">
            <MassarekLogo size="sm" imageSize="md" />
          </Link>
        </div>

        <div className="flex-1 min-w-[160px]" />

        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input
            type="text"
            placeholder={t("navbar.searchPlaceholder")}
            className="w-56 rounded-2xl border border-input bg-background/90 py-2 pl-10 pr-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <LanguageSwitcher />
          <ThemeToggle />
          <button className="relative rounded-2xl border border-border bg-background/80 p-2 text-muted-foreground transition hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-primary/20">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400" />
          </button>
          <Link to="/profile" className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 text-primary-foreground text-sm font-semibold shadow-lg shadow-sky-500/10">
            S
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
