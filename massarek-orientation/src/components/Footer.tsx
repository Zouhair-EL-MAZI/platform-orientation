import { Github, Linkedin, Twitter, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MassarekLogo from "./MassarekLogo";

const Footer = () => {
  const { t } = useTranslation();

  const quickLinks = [
    { label: t("common.home"), href: "/#home" },
    { label: t("common.features"), href: "/#features" },
    { label: t("common.about"), href: "/#about" },
    { label: t("common.contact"), href: "/#contact" },
  ];

  return (
    <footer className="border-t border-border bg-card/95 text-foreground">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-12 sm:px-6 lg:px-8 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-xl space-y-4">
          <Link to="/" className="inline-flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-xl">
            <MassarekLogo size="md" />
          </Link>
          <p className="text-sm leading-6 text-muted-foreground">
            {t("footer.description", "Massarek helps students discover the right academic path with AI-powered guidance, career exploration, and personalized recommendations.")}
          </p>
          <div className="flex items-center gap-3">
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-background text-muted-foreground transition-colors hover:border-primary hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background">
              <Twitter size={18} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-background text-muted-foreground transition-colors hover:border-primary hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background">
              <Linkedin size={18} />
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-background text-muted-foreground transition-colors hover:border-primary hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background">
              <Github size={18} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-background text-muted-foreground transition-colors hover:border-primary hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background">
              <Instagram size={18} />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-[1fr_auto]">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">{t("footer.quickLinks")}</h3>
            <div className="flex flex-col gap-3">
              {quickLinks.map((link) => (
                <Link key={link.href} to={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">{t("footer.contact")}</h3>
            <div className="text-sm text-muted-foreground leading-6">
              <p>{t("footer.support")}</p>
              <a href="mailto:contact@massarek.ai" className="text-foreground hover:text-primary">
                {t("footer.email")}
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-border bg-background/80 px-4 py-4 text-center text-xs text-muted-foreground sm:px-6 lg:px-8">
        {t("footer.copyright")}
      </div>
    </footer>
  );
};

export default Footer;
