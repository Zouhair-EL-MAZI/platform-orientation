import { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import MassarekLogo from "./MassarekLogo";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";
import { cn } from "@/lib/utils";

const LandingNavbar = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("#home");
  const observerRef = useRef<IntersectionObserver | null>(null);

  const navItems = [
    { label: t("common.home"), hash: "#home", id: "home" },
    { label: t("common.features"), hash: "#features", id: "features" },
    { label: t("landing.howItWorks.badge"), hash: "#how-it-works", id: "how-it-works" },
    { label: t("common.about"), hash: "#about", id: "about" },
    { label: t("common.contact"), hash: "#contact", id: "contact" },
  ];

  const activeHash = location.pathname === "/" ? activeSection : "";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (location.pathname !== "/") return;
    observerRef.current = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) setActiveSection(`#${e.target.id}`); }); },
      { root: null, rootMargin: "-50% 0px -50% 0px", threshold: 0 }
    );
    navItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el && observerRef.current) observerRef.current.observe(el);
    });
    return () => { if (observerRef.current) observerRef.current.disconnect(); };
  }, [location.pathname]);

  const scrollToSection = (hash: string) => {
    const el = document.getElementById(hash.slice(1));
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 96, behavior: "smooth" });
    setActiveSection(hash);
  };

  const handleNavClick = (hash: string) => { scrollToSection(hash); setIsOpen(false); };

  useEffect(() => { if (location.hash) scrollToSection(location.hash); }, [location.hash]);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-4 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={cn(
          "pointer-events-auto flex flex-wrap items-center justify-between gap-3 rounded-full border p-3 transition-all duration-300",
          "bg-white/80 dark:bg-[rgba(5,8,22,0.85)]",
          "backdrop-blur-2xl",
          "border-[rgba(2,132,199,0.12)] dark:border-[rgba(34,211,238,0.10)]",
          scrolled
            ? "shadow-[0_8px_32px_rgba(2,132,199,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
            : "shadow-sm"
        )}>
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3 rounded-full focus:outline-none">
              <MassarekLogo size="md" />
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.hash}
                onClick={() => handleNavClick(item.hash)}
                className={cn(
                  "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 border",
                  activeHash === item.hash
                    ? "bg-[var(--ms-accent-glow)] text-[var(--ms-accent-sky)] border-[var(--ms-border-glow)]"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-[var(--ms-accent-glow)] border-transparent hover:border-[var(--ms-border-subtle)]"
                )}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <LanguageSwitcher />
            <ThemeToggle />
            <div className="hidden md:flex items-center gap-2">
              <Link
                to="/login"
                className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 border border-[var(--ms-border-subtle)] hover:border-[var(--ms-border-glow)] hover:text-[var(--ms-accent-sky)] transition-all duration-200 backdrop-blur-sm"
              >
                {t("common.signIn")}
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 glow-pulse"
                style={{
                  background: "linear-gradient(135deg, var(--ms-accent-blue), #0E7490)",
                  border: "1px solid var(--ms-border-glow)",
                  boxShadow: "0 0 20px var(--ms-accent-glow-strong), inset 0 1px 0 rgba(255,255,255,0.15)"
                }}
              >
                {t("common.getStarted")}
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen((p) => !p)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--ms-border-subtle)] bg-[var(--ms-bg-card)] text-muted-foreground backdrop-blur-sm transition hover:border-[var(--ms-border-glow)] hover:text-[var(--ms-accent-cyan)] md:hidden"
            >
              {isOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      <div className={cn(
        "pointer-events-auto overflow-hidden transition-[max-height,opacity] duration-300 md:hidden",
        isOpen ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0"
      )}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 mt-2">
          <div
            className="space-y-2 overflow-hidden rounded-3xl px-4 pb-5 pt-4 backdrop-blur-2xl"
            style={{
              background: "var(--ms-bg-card)",
              border: "1px solid var(--ms-border-subtle)"
            }}
          >
            {navItems.map((item) => (
              <button
                key={item.hash}
                onClick={() => handleNavClick(item.hash)}
                className={cn(
                  "w-full block rounded-2xl px-4 py-3 text-base font-semibold transition-all duration-200 text-left border",
                  activeHash === item.hash
                    ? "text-[var(--ms-accent-sky)] bg-[var(--ms-accent-glow)] border-[var(--ms-border-glow)]"
                    : "text-muted-foreground hover:text-foreground hover:bg-[var(--ms-accent-glow)] border-transparent"
                )}
              >
                {item.label}
              </button>
            ))}
            <div className="flex flex-col gap-2 pt-2">
              <Link to="/login" onClick={() => setIsOpen(false)}
                className="rounded-2xl px-4 py-3 text-center text-sm font-semibold text-muted-foreground border border-[var(--ms-border-subtle)] hover:border-[var(--ms-border-glow)] transition-all"
              >
                {t("common.signIn")}
              </Link>
              <Link to="/register" onClick={() => setIsOpen(false)}
                className="rounded-2xl px-4 py-3 text-center text-sm font-bold text-white transition hover:-translate-y-0.5"
                style={{
                  background: "linear-gradient(135deg, var(--ms-accent-blue), #0E7490)",
                  boxShadow: "0 0 20px var(--ms-accent-glow-strong)"
                }}
              >
                {t("common.getStarted")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default LandingNavbar;
