import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../hooks/use-auth";
import FeaturesSection from "../components/FeaturesSection";
import AboutSection from "../components/AboutSection";
import ContactSection from "../components/ContactSection";
import HowItWorks from "../components/HowItWorks";

const Landing = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const statsTranslations = t("landing.statsSection.cards", { returnObjects: true }) as Array<{ label: string }>;
  const statCards = [
    { value: 12, suffix: "K+", label: statsTranslations?.[0]?.label ?? "Students Guided" },
    { value: 96, suffix: "%", label: statsTranslations?.[1]?.label ?? "Recommendation Accuracy" },
    { value: 250, suffix: "+", label: statsTranslations?.[2]?.label ?? "Career Paths" },
    { value: 60, suffix: "+", label: statsTranslations?.[3]?.label ?? "Orientation Modules" },
  ];

  const handleProtectedClick = (path: string) => {
    if (isAuthenticated) { navigate(path); }
    else { localStorage.setItem("intendedDestination", path); navigate("/login"); }
  };

  const AnimatedStat = ({ target, suffix }: { target: number; suffix: string }) => {
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, { stiffness: 120, damping: 18 });
    const [display, setDisplay] = useState(0);
    useEffect(() => {
      const unsub = springValue.on("change", (v) => setDisplay(v));
      motionValue.set(target);
      return unsub;
    }, [motionValue, springValue, target]);
    return (
      <div className="font-display font-extrabold stat-number-gradient" style={{ fontSize: "clamp(2rem,4vw,3rem)" }}>
        {Math.round(display).toLocaleString()}{suffix}
      </div>
    );
  };

  return (
    <div style={{ background: "var(--ms-bg-base)" }}>

      {/* HERO */}
      <section id="home" className="relative overflow-hidden px-4 sm:px-6 md:px-12 pt-24 pb-16 md:pt-10 md:pb-28">
        {/* Grid lines */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "linear-gradient(rgba(34,211,238,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(34,211,238,0.03) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }} />
        {/* Ambient overlays */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 80% 60% at 70% 50%, rgba(14,116,144,0.12), transparent), radial-gradient(ellipse 50% 80% at 10% 30%, rgba(37,99,235,0.10), transparent)",
        }} />

        <div className="relative z-10 mx-auto grid gap-8 md:gap-12 md:grid-cols-[minmax(0,1fr)_420px] lg:grid-cols-[minmax(0,1fr)_520px] md:items-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} className="relative">

            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold mb-6"
              style={{
                background: "rgba(34,211,238,0.06)",
                border: "1px solid rgba(34,211,238,0.22)",
                color: "var(--ms-accent-cyan)",
                letterSpacing: "0.06em",
                boxShadow: "0 0 16px rgba(34,211,238,0.10)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full pulse-dot flex-shrink-0" style={{ background: "var(--ms-accent-cyan)", boxShadow: "0 0 6px var(--ms-accent-cyan)" }} />
              <Sparkles size={12} />
              {t("landing.hero.label")}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight mb-4 md:mb-6 leading-tight">
              {t("landing.hero.title")} <br />
              <span className="gradient-text-hero">{t("landing.hero.highlight")}</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl max-w-2xl leading-relaxed mb-7 md:mb-10 text-muted-foreground">
              {t("landing.hero.subtitle")}
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                onClick={() => handleProtectedClick("/test")}
                className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 glow-pulse"
                style={{
                  background: "linear-gradient(135deg, #2563EB, #0E7490)",
                  border: "1px solid rgba(34,211,238,0.30)",
                  boxShadow: "0 0 30px rgba(34,211,238,0.28), 0 8px 24px rgba(37,99,235,0.30), inset 0 1px 0 rgba(255,255,255,0.15)",
                }}
              >
                {t("landing.hero.startTest")} <ArrowRight size={16} />
              </button>
              <button
                onClick={() => handleProtectedClick("/careers")}
                className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid var(--ms-border-subtle)",
                  color: "hsl(var(--muted-foreground))",
                  backdropFilter: "blur(10px)",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--ms-border-glow)";
                  (e.currentTarget as HTMLElement).style.color = "hsl(var(--foreground))";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--ms-border-subtle)";
                  (e.currentTarget as HTMLElement).style.color = "hsl(var(--muted-foreground))";
                }}
              >
                {t("landing.hero.exploreCareers")}
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="relative hidden md:block"
          >
            <div
              className="relative overflow-hidden rounded-[2.5rem]"
              style={{
                background: "var(--ms-bg-card)",
                border: "1px solid var(--ms-border-glow)",
                boxShadow: "0 24px 64px rgba(0,0,0,0.4), 0 0 0 1px var(--ms-border-subtle)",
                backdropFilter: "blur(12px)",
              }}
            >
              <div className="absolute inset-0 pointer-events-none" style={{
                background: "radial-gradient(circle at 30% 30%, rgba(34,211,238,0.12), transparent 60%), radial-gradient(circle at 70% 70%, rgba(37,99,235,0.15), transparent 60%)",
              }} />
              <div className="relative p-4 sm:p-6 lg:p-8">
                <div className="relative overflow-hidden rounded-[2rem]" style={{ border: "1px solid var(--ms-border-subtle)" }}>
                  <img
                    src="/imagHome.png"
                    alt="Futuristic AI orientation interface"
                    className="h-full w-full min-h-[360px] object-cover"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section
        className="relative px-6 md:px-12 py-16"
        style={{ background: "var(--ms-bg-layer1)", borderTop: "1px solid var(--ms-border-subtle)", borderBottom: "1px solid var(--ms-border-subtle)" }}
      >
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <p className="section-eyebrow mb-3">{t("landing.statsSection.badge")}</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold max-w-3xl mx-auto">
              {t("landing.statsSection.title")}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mt-4 leading-relaxed">
              {t("landing.statsSection.subtitle")}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -6 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.65, delay: index * 0.1 }}
                className="relative overflow-hidden rounded-2xl p-7 card-top-glow"
                style={{
                  background: "var(--ms-bg-card)",
                  border: "1px solid var(--ms-border-subtle)",
                  backdropFilter: "blur(12px)",
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--ms-border-glow)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--ms-border-subtle)"}
              >
                <p className="text-[11px] uppercase tracking-[0.15em] font-bold mb-4" style={{ color: "var(--ms-accent-cyan)" }}>
                  {stat.label}
                </p>
                <AnimatedStat target={stat.value} suffix={stat.suffix} />
                <div
                  className="h-[2px] w-16 rounded-full mt-5"
                  style={{ background: "linear-gradient(90deg, var(--ms-accent-blue), var(--ms-accent-cyan))", boxShadow: "0 0 8px rgba(34,211,238,0.50)" }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <FeaturesSection />
      <HowItWorks />
      <AboutSection />
      <ContactSection />
    </div>
  );
};

export default Landing;
