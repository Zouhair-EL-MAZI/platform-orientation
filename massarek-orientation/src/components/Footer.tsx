import { Github, Linkedin, Instagram, Sparkles, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import MassarekLogo from "./MassarekLogo";

const Footer = () => {
  const { t } = useTranslation();

  const quickLinks = [
    { label: t("common.home"),     href:"/#home"       },
    { label: t("common.features"), href:"/#features"   },
    { label: t("common.about"),    href:"/#about"      },
    { label: t("common.contact"),  href:"/#contact"    },
  ];

  const legalLinks = [
    { label: t("footer.privacy","Privacy Policy"), href:"/privacy" },
    { label: t("footer.terms","Terms of Use"),     href:"/terms" },
  ];

  const SOCIALS = [
    { Icon:Linkedin,  label:"LinkedIn",  grad:"from-blue-600 to-indigo-500", glow:"rgba(37,99,235,0.40)"   },
    { Icon:Github,    label:"GitHub",    grad:"from-slate-600 to-slate-500", glow:"rgba(100,116,139,0.35)" },
    { Icon:Instagram, label:"Instagram", grad:"from-pink-500 to-rose-400",   glow:"rgba(236,72,153,0.38)"  },
  ];

  return (
    <footer className="relative overflow-hidden"
      style={{ background:"var(--ms-bg-layer1)", borderTop:"1px solid var(--ms-border-subtle)" }}>

      {/* ambient */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72" style={{
        background:"radial-gradient(ellipse 60% 45% at 50% 0%,rgba(34,211,238,0.07),transparent)",
      }}/>
      <div className="pointer-events-none absolute right-10 top-10 h-44 w-44 rounded-full blur-3xl"
        style={{ background:"radial-gradient(circle,rgba(37,99,235,0.08),transparent)" }}/>

      {/* main content */}
      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">

          {/* brand column */}
          <div className="space-y-5">
            <Link to="/" className="inline-flex items-center gap-2.5 rounded-xl">
              <MassarekLogo size="md"/>
            </Link>
            <p className="text-sm leading-6 text-muted-foreground max-w-xs">
              {t("footer.description","Massarek helps students discover the right academic path with AI-powered guidance, career exploration, and personalized recommendations.")}
            </p>

            {/* social icons */}
            <div className="flex items-center gap-2">
              {SOCIALS.map(({Icon,label,grad,glow})=>(
                <motion.a
                  key={label} href="#" target="_blank" rel="noreferrer" aria-label={label}
                  whileHover={{y:-3,boxShadow:`0 0 16px ${glow}`}}
                  transition={{type:"spring",stiffness:300,damping:20}}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-white"
                  style={{ background:`linear-gradient(135deg,var(--ms-bg-layer2),var(--ms-bg-layer2))`, border:"1px solid var(--ms-border-subtle)" }}
                  onMouseEnter={e=>{
                    (e.currentTarget as HTMLElement).style.background=`linear-gradient(135deg, var(--${grad.split("-")[1]}-500, var(--${grad.split("-")[3]}-400))`;
                    (e.currentTarget as HTMLElement).style.borderColor="transparent";
                  }}
                  onMouseLeave={e=>{
                    (e.currentTarget as HTMLElement).style.background="var(--ms-bg-layer2)";
                    (e.currentTarget as HTMLElement).style.borderColor="var(--ms-border-subtle)";
                  }}
                >
                  <Icon size={15} style={{ color:"hsl(var(--muted-foreground))" }}/>
                </motion.a>
              ))}
            </div>

            {/* AI badge */}
            <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold"
              style={{ background:"rgba(34,211,238,0.07)", border:"1px solid rgba(34,211,238,0.18)", color:"var(--ms-accent-cyan)" }}>
              <Sparkles className="h-3 w-3"/>
              {t("footer.aiBadge","AI-Powered Platform")}
            </div>
          </div>

          {/* quick links */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color:"var(--ms-accent-cyan)" }}>
              {t("footer.quickLinks","Quick Links")}
            </h3>
            <div className="flex flex-col gap-2.5">
              {quickLinks.map(link=>(
                <Link key={link.href} to={link.href}
                  className="group flex items-center gap-1.5 text-sm text-muted-foreground transition-all duration-200 hover:translate-x-1"
                  onMouseEnter={e=>(e.currentTarget as HTMLElement).style.color="var(--ms-accent-sky)"}
                  onMouseLeave={e=>(e.currentTarget as HTMLElement).style.color=""}
                >
                  {link.label}
                  <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color:"var(--ms-accent-sky)" }}/>
                </Link>
              ))}
            </div>
          </div>

          {/* contact */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color:"var(--ms-accent-cyan)" }}>
              {t("footer.contact","Contact")}
            </h3>
            <div className="space-y-2.5 text-sm text-muted-foreground">
              <p>{t("footer.support","Student support")}</p>
              <a href={`mailto:${t("footer.email","contact@massarek.ma")}`}
                className="block transition-colors duration-200"
                onMouseEnter={e=>(e.currentTarget as HTMLElement).style.color="var(--ms-accent-sky)"}
                onMouseLeave={e=>(e.currentTarget as HTMLElement).style.color=""}
              >
                {t("footer.email","contact@massarek.ma")}
              </a>
            </div>
          </div>

          {/* legal */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color:"var(--ms-accent-cyan)" }}>
              {t("footer.legal","Legal")}
            </h3>
            <div className="flex flex-col gap-2.5">
              {legalLinks.map(l=>(
                <Link key={l.label} to={l.href}
                  className="text-sm text-muted-foreground transition-colors duration-200"
                  onMouseEnter={e=>(e.currentTarget as HTMLElement).style.color="var(--ms-accent-sky)"}
                  onMouseLeave={e=>(e.currentTarget as HTMLElement).style.color=""}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* bottom bar */}
      <div
        className="relative px-4 py-4 text-center text-xs"
        style={{
          borderTop:"1px solid var(--ms-border-subtle)",
          background:"var(--ms-bg-layer2)",
          color:"hsl(var(--muted-foreground))",
        }}
      >
        <span>{t("footer.copyright")}</span>
      </div>
    </footer>
  );
};

export default Footer;
