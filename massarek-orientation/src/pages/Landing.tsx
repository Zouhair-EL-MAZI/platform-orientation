import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Sparkles, ArrowRight, Compass, Target, TrendingUp } from "lucide-react";
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
  const aboutSection = t("landing.about", { returnObjects: true }) as { label: string; title: string; description: string; missionLabel: string; mission: string };
  const contactSection = t("landing.contact", { returnObjects: true }) as { label: string; title: string; description: string; emailLabel: string; email: string };

  const handleProtectedClick = (path: string) => {
    if (isAuthenticated) {
      navigate(path);
    } else {
      localStorage.setItem("intendedDestination", path);
      navigate("/login");
    }
  };

  const AnimatedStat = ({ target, suffix }: { target: number; suffix: string }) => {
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, { stiffness: 120, damping: 18 });
    const [display, setDisplay] = useState(0);

    useEffect(() => {
      const unsubscribe = springValue.on("change", (latest) => setDisplay(latest));
      motionValue.set(target);
      return unsubscribe;
    }, [motionValue, springValue, target]);

    return (
      <div className="text-4xl md:text-5xl font-display font-semibold text-foreground">
        {Math.round(display).toLocaleString()}
        {suffix}
      </div>
    );
  };

  return (
    <div className="bg-background">
      <section id="home" className="relative overflow-hidden px-6 md:px-12 pt-10 pb-28 bg-background dark:bg-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.16),transparent_24%),radial-gradient(circle_at_70%_15%,rgba(96,165,250,0.1),transparent_20%),radial-gradient(circle_at_20%_80%,rgba(168,212,255,0.08),transparent_18%)]" />
        <div className="absolute inset-x-0 top-0 h-[440px] bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(241,245,255,0.35))] dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.84),rgba(15,23,42,0.24))] pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-[linear-gradient(0deg,rgba(236,245,255,0.78),transparent_50%)] dark:bg-[linear-gradient(0deg,rgba(15,23,42,0.65),transparent_45%)] pointer-events-none" />

        <div className="relative z-10 mx-auto grid gap-12 lg:grid-cols-[minmax(0,1fr)_520px] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="relative"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 text-sky-400 font-semibold text-sm mb-6 backdrop-blur-xl border border-sky-500/10 shadow-sm shadow-sky-500/5 dark:bg-sky-400/10 dark:text-sky-200">
              <Sparkles size={14} /> {t("landing.hero.label")}
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight text-slate-950 dark:text-white">
              {t("landing.hero.title")} <br />
              <span className="gradient-text">{t("landing.hero.highlight")}</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed mb-10">
              {t("landing.hero.subtitle")}
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-start">
              <button onClick={() => handleProtectedClick("/test")} className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 px-8 py-3.5 text-base font-semibold text-white shadow-[0_24px_80px_-38px_rgba(14,165,233,0.9)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_26px_90px_-40px_rgba(14,165,233,0.9)]">
                {t("landing.hero.startTest")} <ArrowRight size={18} />
              </button>
              <button onClick={() => handleProtectedClick("/careers")} className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white/90 px-8 py-3.5 text-base font-semibold text-slate-900 transition duration-300 hover:border-sky-300 hover:text-sky-700 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:border-sky-400 dark:hover:text-sky-300">
                {t("landing.hero.exploreCareers")}
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-200/40 bg-white/80 shadow-[0_45px_120px_-60px_rgba(59,130,246,0.35)] backdrop-blur-3xl dark:border-slate-700/40 dark:bg-slate-950/60 dark:shadow-[0_45px_120px_-60px_rgba(14,165,233,0.24)]">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.16),transparent_30%)] opacity-90 dark:bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.24),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.18),transparent_30%)]" />
              <div className="relative p-4 sm:p-6 lg:p-8">
                <motion.div
                  animate={{ y: [0, -10, 0], x: [0, 6, 0] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                  className="pointer-events-none absolute -left-10 -top-10 h-28 w-28 rounded-full bg-sky-400/20 blur-3xl"
                />
                <motion.div
                  animate={{ y: [0, 10, 0], x: [0, -8, 0] }}
                  transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
                  className="pointer-events-none absolute -right-12 top-20 h-24 w-24 rounded-full bg-cyan-400/15 blur-3xl"
                />
                <div className="relative overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl shadow-sky-500/10">
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

      <section className="relative px-6 md:px-12 py-16">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.12),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(149,185,255,0.08),transparent_24%)]" />
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-[0.32em] text-primary font-semibold mb-3">{t("landing.statsSection.badge")}</p>
            <h2 className="text-3xl md:text-4xl font-display font-semibold text-foreground max-w-3xl mx-auto">
              {t("landing.statsSection.title")}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mt-4 leading-relaxed">{t("landing.statsSection.subtitle")}</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {statCards.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8, scale: 1.01 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.65, delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white/85 p-8 shadow-[0_30px_90px_-45px_rgba(56,189,248,0.25)] backdrop-blur-2xl transition-all duration-400 hover:shadow-[0_36px_110px_-30px_rgba(56,189,248,0.28)] dark:border-slate-700/60 dark:bg-slate-950/65"
              >
                <div className="pointer-events-none absolute inset-x-8 top-6 h-24 rounded-[1.75rem] bg-gradient-to-br from-sky-400/15 via-transparent to-cyan-300/0 blur-2xl" />
                <div className="relative">
                  <p className="text-xs uppercase tracking-[0.34em] text-sky-300 font-semibold mb-5">{stat.label}</p>
                  <AnimatedStat target={stat.value} suffix={stat.suffix} />
                  <div className="h-1.5 w-16 rounded-full bg-gradient-to-r from-sky-400 to-cyan-400 mt-6 opacity-80" />
                </div>
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
