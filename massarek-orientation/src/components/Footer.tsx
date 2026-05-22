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

  const socialIcon = (Icon: typeof Github) => (
    <a
      href="#"
      target="_blank"
      rel="noreferrer"
      className="inline-flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200"
      style={{
        border: "1px solid var(--ms-border-subtle)",
        background: "var(--ms-bg-card)",
        color: "var(--ms-accent-cyan)",
        opacity: 0.6,
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.opacity = "1";
        (e.currentTarget as HTMLElement).style.borderColor = "var(--ms-border-glow)";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 0 12px var(--ms-accent-glow)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.opacity = "0.6";
        (e.currentTarget as HTMLElement).style.borderColor = "var(--ms-border-subtle)";
        (e.currentTarget as HTMLElement).style.boxShadow = "";
      }}
    >
      <Icon size={16} />
    </a>
  );

  return (
    <footer
      style={{
        background: "var(--ms-bg-layer1)",
        borderTop: "1px solid var(--ms-border-subtle)",
        backgroundImage: "radial-gradient(circle at 14% 20%, rgba(34,211,238,0.16), transparent 18%), radial-gradient(circle at 86% 10%, rgba(56,189,248,0.12), transparent 20%), radial-gradient(circle at 58% 78%, rgba(14,165,233,0.08), transparent 24%), linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
        backgroundBlendMode: "screen, normal",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), inset 0 24px 72px rgba(0,0,0,0.18)",
      }}
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-12 sm:px-6 lg:px-8 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-xs space-y-4">
          <Link to="/" className="inline-flex items-center gap-3 rounded-xl">
            <MassarekLogo size="md" />
          </Link>
          <p className="text-sm leading-6 text-muted-foreground">
            {t("footer.description", "Massarek helps students discover the right academic path with AI-powered guidance, career exploration, and personalized recommendations.")}
          </p>
          <div className="flex items-center gap-2">
            {socialIcon(Twitter)}
            {socialIcon(Linkedin)}
            {socialIcon(Github)}
            {socialIcon(Instagram)}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
          <div className="space-y-3">
            <h3
              className="text-[11px] font-bold uppercase tracking-[0.15em]"
              style={{ color: "var(--ms-accent-cyan)" }}
            >
              {t("footer.quickLinks")}
            </h3>
            <div className="flex flex-col gap-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-sm text-muted-foreground transition-all duration-200 hover:translate-x-1"
                  style={{}}
                  onMouseEnter={e => (e.currentTarget.style.color = "var(--ms-accent-sky)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "")}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <h3
              className="text-[11px] font-bold uppercase tracking-[0.15em]"
              style={{ color: "var(--ms-accent-cyan)" }}
            >
              {t("footer.contact")}
            </h3>
            <div className="text-sm text-muted-foreground leading-6">
              <p>{t("footer.support")}</p>
              <a
                href={`mailto:${t("footer.email")}`}
                className="transition-colors"
                onMouseEnter={e => (e.currentTarget.style.color = "var(--ms-accent-sky)")}
                onMouseLeave={e => (e.currentTarget.style.color = "")}
              >
                {t("footer.email")}
              </a>
            </div>
          </div>
        </div>
      </div>
      <div
        className="px-4 py-4 text-center text-xs font-mono-ts"
        style={{
          borderTop: "1px solid rgba(255,255,255,0.08)",
          background: "linear-gradient(180deg, rgba(255,255,255,0.04), var(--ms-bg-layer2))",
          color: "var(--ms-accent-cyan)",
          opacity: 0.6,
          backdropFilter: "blur(10px)",
        }}
      >
        {t("footer.copyright")}
      </div>
    </footer>
  );
};

export default Footer;
