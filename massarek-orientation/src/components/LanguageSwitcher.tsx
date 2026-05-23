import { useRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Globe, Check } from "lucide-react";

const languages = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "ar", label: "العربية" },
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const current = i18n.language || i18n.resolvedLanguage || "en";
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = languages.find((l) => l.code === current);

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="relative inline-flex">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-foreground transition-all duration-200 hover:bg-accent hover:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/20"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Globe size={14} className="text-primary" />
        <span className="hidden sm:inline">{currentLang?.code.toUpperCase()}</span>
        <svg
          className={`h-3 w-3 text-muted-foreground transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-full mt-1.5 w-40 origin-top-right animate-in fade-in zoom-in-95 rounded-lg border border-border bg-card shadow-lg z-50"
          role="listbox"
        >
          <div className="p-1">
            {languages.map((language) => (
              <button
                key={language.code}
                type="button"
                onClick={() => handleLanguageChange(language.code)}
                className={`relative w-full flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-medium text-left transition-all duration-200 ${
                  current === language.code
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
                role="option"
                aria-selected={current === language.code}
              >
                <span className="flex-1">{language.label}</span>
                {current === language.code && (
                  <Check size={13} className="text-primary flex-shrink-0" strokeWidth={3} />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
