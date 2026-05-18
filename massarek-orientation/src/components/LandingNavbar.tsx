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

  // Intersection Observer for active section detection
  useEffect(() => {
    if (location.pathname !== "/") return;

    const observerOptions = {
      root: null,
      rootMargin: "-50% 0px -50% 0px",
      threshold: 0,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(`#${entry.target.id}`);
        }
      });
    }, observerOptions);

    // Observe all sections
    navItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element && observerRef.current) {
        observerRef.current.observe(element);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [location.pathname, navItems]);

  const scrollToSection = (hash: string) => {
    const sectionId = hash.slice(1);
    const element = document.getElementById(sectionId);
    if (!element) return;

    const headerHeight = 96;
    const elementTop = element.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: elementTop - headerHeight, behavior: "smooth" });
    setActiveSection(hash);
  };

  // Handle navigation to section on link click
  const handleNavClick = (hash: string) => {
    scrollToSection(hash);
    setIsOpen(false);
  };

  // Scroll to section if hash changes in URL
  useEffect(() => {
    if (!location.hash) return;
    scrollToSection(location.hash);
  }, [location.hash]);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-4 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            "pointer-events-auto flex flex-wrap items-center justify-between gap-3 rounded-full border bg-white/80 p-3 shadow-[0_30px_80px_-55px_rgba(56,189,248,0.24)] backdrop-blur-3xl ring-1 ring-white/15 transition-all duration-300 dark:bg-slate-950/85 dark:border-slate-700/55 dark:ring-white/10",
            scrolled ? "border-opacity-100 shadow-[0_35px_90px_-55px_rgba(56,189,248,0.32)]" : "border-opacity-70",
          )}
        >
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background">
              <MassarekLogo size="md" />
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-2.5 lg:gap-4">
            {navItems.map((item) => (
              <button
                key={item.hash}
                onClick={() => handleNavClick(item.hash)}
                className={cn(
                  "inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-300",
                  activeHash === item.hash
                    ? "bg-gradient-to-r from-sky-500 to-cyan-400 text-white shadow-[0_15px_45px_-20px_rgba(56,189,248,0.55)]"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5",
                )}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:gap-4">
            <LanguageSwitcher />
            <ThemeToggle />
            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/login"
                className="rounded-full px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors duration-200 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {t("common.signIn")}
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_14px_35px_-20px_rgba(56,189,248,0.85)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_45px_-22px_rgba(56,189,248,0.9)]"
              >
                {t("common.getStarted")}
              </Link>
            </div>

            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200/70 bg-white/90 text-slate-700 shadow-sm transition hover:bg-white dark:border-slate-700/60 dark:bg-slate-950/80 dark:text-slate-200 dark:hover:bg-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background md:hidden"
              onClick={() => setIsOpen((prev) => !prev)}
              aria-expanded={isOpen}
              aria-label={isOpen ? t("landing.closeMenu", "Close navigation menu") : t("landing.openMenu", "Open navigation menu")}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "pointer-events-auto overflow-hidden transition-[max-height,opacity] duration-300 md:hidden",
          isOpen ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-3 overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white/90 px-4 pb-5 pt-4 shadow-[0_35px_90px_-50px_rgba(56,189,248,0.18)] backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-950/90">
            {navItems.map((item) => (
              <button
                key={item.hash}
                onClick={() => handleNavClick(item.hash)}
                className={cn(
                  "w-full block rounded-3xl px-4 py-3 text-base font-medium transition-all duration-300 cursor-pointer",
                  activeHash === item.hash
                    ? "bg-gradient-to-r from-sky-500 to-cyan-400 text-white shadow-[0_12px_32px_-18px_rgba(56,189,248,0.45)]"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white",
                )}
              >
                {item.label}
              </button>
            ))}
            <div className="flex flex-col gap-3 pt-2">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="rounded-full px-4 py-3 text-center text-sm font-medium text-slate-600 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
              >
                {t("common.signIn")}
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 px-4 py-3 text-center text-sm font-semibold text-white shadow-[0_14px_35px_-20px_rgba(56,189,248,0.72)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_45px_-22px_rgba(56,189,248,0.86)]"
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
