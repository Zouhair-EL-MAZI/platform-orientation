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
      className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-200 bg-white/90 text-sky-600 shadow-sm transition duration-200 hover:border-sky-300 hover:text-sky-700 hover:shadow-sky-200/60"
      style={{ backdropFilter: "blur(10px)" }}
    >
      <Icon size={16} />
    </a>
  );

  return (
    <footer
      style={{
        background: "linear-gradient(180deg, rgba(245,249,255,1), rgba(235,244,255,0.96))",
        borderTop: "1px solid rgba(15,23,42,0.08)",
        backgroundImage: `
          radial-gradient(circle at 18% 24%, rgba(56,189,248,0.16), transparent 16%),
          radial-gradient(circle at 82% 18%, rgba(14,165,233,0.10), transparent 18%),
          radial-gradient(circle at 50% 84%, rgba(59,130,246,0.08), transparent 22%),
          linear-gradient(135deg, rgba(255,255,255,0.45) 0%, transparent 25%, transparent 75%, rgba(255,255,255,0.45) 100%)
        `,
        backgroundBlendMode: "screen, overlay",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.7), inset 0 24px 80px rgba(14,165,233,0.06)",
      }}
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:items-start">
          <div className="space-y-4">
            <Link to="/" className="inline-flex items-center gap-3 rounded-2xl bg-white/80 px-4 py-3 shadow-sm ring-1 ring-slate-200/80 transition hover:ring-sky-300/70">
              <MassarekLogo size="md" />
            </Link>
            <p className="text-sm leading-7 text-slate-600">
              {t("footer.description")}
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-sky-600">
              {t("footer.quickLinks")}
            </h3>
            <div className="flex flex-col gap-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-sm text-slate-600 transition duration-200 hover:text-sky-700 hover:translate-x-0.5"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-sky-600">
              {t("footer.contact")}
            </h3>
            <div className="text-sm text-slate-600 leading-7 space-y-2">
              <p>{t("footer.support")}</p>
              <a
                href={`mailto:${t("footer.email")}`}
                className="text-slate-600 transition duration-200 hover:text-sky-700"
              >
                {t("footer.email")}
              </a>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-sky-600">
              {t("footer.more")}
            </h3>
            <div className="text-sm text-slate-600 leading-7 space-y-2">
              <p>{t("footer.followUs", "Follow us for updates, student stories, and new career guides.")}</p>
              <div className="flex items-center gap-3">
                {socialIcon(Twitter)}
                {socialIcon(Linkedin)}
                {socialIcon(Github)}
                {socialIcon(Instagram)}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="px-4 py-4 text-center text-xs font-mono-ts"
        style={{
          borderTop: "1px solid var(--ms-border-subtle)",
          background: "var(--ms-bg-layer1)",
          color: "var(--ms-muted-foreground)",
          opacity: 0.72,
          backdropFilter: "blur(8px)",
        }}
      >
        {t("footer.copyright")}
      </div>
    </footer>
  );
};

export default Footer;
