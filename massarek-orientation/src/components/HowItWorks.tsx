import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { UserCheck, Activity, Cpu, WandSparkles, MapPin } from "lucide-react";

const sectionVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const stepVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const iconVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.5, delay: 0.1 },
  },
};

const pulseVariants = {
  animate: {
    boxShadow: [
      "0 0 0 0 rgba(56, 189, 248, 0.7)",
      "0 0 0 12px rgba(56, 189, 248, 0)",
    ],
    transition: { duration: 2, repeat: Infinity },
  },
};

const connectorVariants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: (i: number) => ({
    scaleX: 1,
    opacity: 1,
    transition: {
      duration: 0.8,
      delay: 0.3 + i * 0.15,
    },
  }),
};

const HowItWorks = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isRTL = document.documentElement.dir === "rtl" || document.documentElement.lang?.startsWith("ar");

  const steps = [
    {
      icon: UserCheck,
      title: t("landing.howItWorks.steps.0.title", "Create Account"),
      desc: t(
        "landing.howItWorks.steps.0.desc",
        "Sign up in seconds and set up your student profile with your basic information."
      ),
      accent: "from-blue-500 to-cyan-400",
      glow: "shadow-blue-500/30",
    },
    {
      icon: Activity,
      title: t("landing.howItWorks.steps.1.title", "Take Orientation Test"),
      desc: t(
        "landing.howItWorks.steps.1.desc",
        "Complete an adaptive quiz that reveals your strengths, interests, and academic preferences."
      ),
      accent: "from-sky-500 to-blue-400",
      glow: "shadow-sky-500/30",
    },
    {
      icon: Cpu,
      title: t("landing.howItWorks.steps.2.title", "AI Analyzes Responses"),
      desc: t(
        "landing.howItWorks.steps.2.desc",
        "Our intelligent engine processes your answers to understand your unique profile and potential."
      ),
      accent: "from-indigo-500 to-sky-400",
      glow: "shadow-indigo-500/30",
    },
    {
      icon: WandSparkles,
      title: t("landing.howItWorks.steps.3.title", "Receive Personalized Recommendations"),
      desc: t(
        "landing.howItWorks.steps.3.desc",
        "Get tailored suggestions for fields, majors, and career paths that match your profile perfectly."
      ),
      accent: "from-purple-500 to-indigo-400",
      glow: "shadow-purple-500/30",
    },
    {
      icon: MapPin,
      title: t("landing.howItWorks.steps.4.title", "Explore Careers & Study Fields"),
      desc: t(
        "landing.howItWorks.steps.4.desc",
        "Deep dive into detailed information about careers, salaries, education requirements, and growth paths."
      ),
      accent: "from-violet-500 to-purple-400",
      glow: "shadow-violet-500/30",
    },
  ];

  return (
    <section id="how-it-works" className="relative overflow-hidden px-6 py-10 md:px-12 lg:py-16" style={{background:"var(--ms-bg-layer1)"}}>
      {/* Background gradients */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.15),transparent_40%)] dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.12),transparent_45%)]" />
      <div className="absolute left-1/2 top-20 h-32 w-32 -translate-x-1/2 rounded-full bg-sky-200/20 blur-3xl dark:bg-sky-500/10" />
      <div className="absolute right-10 top-40 h-40 w-40 rounded-full bg-blue-200/15 blur-3xl dark:bg-blue-500/10" />
      <div className="absolute left-5 bottom-20 h-32 w-32 rounded-full bg-indigo-200/15 blur-3xl dark:bg-indigo-500/10" />

      {/* Header */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
        className="relative mx-auto max-w-4xl text-center"
      >
        <span className="section-eyebrow inline-flex items-center justify-center px-3 py-1.5 mb-6">
          {t("landing.howItWorks.badge", "How It Works")}
        </span>

        <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-display font-bold tracking-tight sm:text-4xl md:text-5xl">
          {t("landing.howItWorks.title", "Simple Steps Powered by Artificial Intelligence")}
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
          {t(
            "landing.howItWorks.subtitle",
            "Follow our streamlined process to discover your perfect academic path. From account creation to career exploration, every step is designed to guide you professionally."
          )}
        </p>
      </motion.div>

      {/* Steps Grid */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={containerVariants}
        className="relative mx-auto mt-20 max-w-6xl"
      >
        {/* Desktop Timeline Connectors */}
        <div className="absolute top-24 hidden h-1 w-full 2xl:block">
          <div className="flex justify-between gap-0 h-full">
            {steps.slice(0, -1).map((_, i) => (
              <motion.div
                key={`connector-${i}`}
                custom={i}
                variants={connectorVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                className="flex-1 origin-left bg-gradient-to-r from-sky-400/40 via-blue-400/40 to-transparent dark:from-sky-500/30 dark:via-blue-500/30 dark:to-transparent"
                style={{ height: "2px" }}
              />
            ))}
          </div>
        </div>

        {/* Steps Container */}
        <div className="grid gap-6 md:gap-8 md:grid-cols-3 xl:grid-cols-5">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                custom={index}
                variants={stepVariants}
                className="relative"
              >
                {/* Step Card */}
                <motion.div
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group relative flex h-full flex-col overflow-hidden rounded-[30px] border border-white/10 bg-white/5 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-3 hover:border-cyan-300/20 hover:shadow-sky-400/20"
                style={{ minHeight: 340 }}
              >
                  {/* Background gradient accent */}
                  <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br from-blue-300/20 to-transparent blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-blue-500/10" />

                  {/* Step Number Badge */}
                  <div className="relative mb-6 flex items-center gap-4">
                    <motion.div
                      variants={iconVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      className="flex-shrink-0"
                    >
                      <motion.div
                        animate="animate"
                        variants={pulseVariants}
                        className={`inline-flex h-16 w-16 items-center justify-center rounded-[26px] bg-gradient-to-br ${step.accent} shadow-lg ${step.glow} transition-transform duration-300 group-hover:scale-110`}
                      >
                        <Icon className="h-8 w-8 text-white" />
                      </motion.div>
                    </motion.div>
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-950/90 text-sm font-display font-bold text-white shadow-sm shadow-slate-900/40 border border-white/10">
                      {index + 1}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="relative flex-1">
                    <h3 className="text-xl font-display font-bold leading-tight mb-4">
                      {step.title}
                    </h3>
                    <p className="text-sm leading-7 text-muted-foreground">
                      {step.desc}
                    </p>
                  </div>

                  {/* Arrow indicator */}
                  <motion.div
                    className={`mt-4 flex items-center gap-2 text-sky-600 dark:text-sky-400 transition-all duration-300 group-hover:translate-x-1 ${
                      isRTL ? "flex-row-reverse" : ""
                    }`}
                    whileHover={{ [isRTL ? "x" : "x"]: isRTL ? -4 : 4 }}
                  >
                    <span className="text-xs font-semibold uppercase tracking-wide">
                      {index < steps.length - 1 ? t("landing.howItWorks.next", "Next") : t("landing.howItWorks.start", "Start Now")}
                    </span>
                    <svg
                      className={`h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 ${
                        isRTL ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile Timeline Dots */}
        <div className="mt-8 flex justify-center gap-3 lg:hidden">
          {steps.map((_, i) => (
            <motion.div
              key={`dot-${i}`}
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="h-2 w-2 rounded-full bg-sky-400 dark:bg-sky-500"
            />
          ))}
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
        transition={{ delay: 0.3 }}
        className="relative mx-auto mt-20 max-w-2xl rounded-2xl p-8 glass-card sm:p-10"
      >
        <div className="absolute -left-10 top-8 h-24 w-24 rounded-full bg-sky-400/10 blur-3xl dark:bg-sky-500/10" />
        <div className="absolute right-0 top-20 h-20 w-20 rounded-full bg-blue-400/10 blur-3xl dark:bg-blue-500/10" />

        <div className="relative text-center">
          <p className="mb-4 section-eyebrow">
            {t("landing.howItWorks.cta.label", "Ready to start?")}
          </p>
          <h3 className="text-2xl font-display font-bold sm:text-3xl">
            {t("landing.howItWorks.cta.title", "Begin Your Orientation Journey Today")}
          </h3>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
            {t(
              "landing.howItWorks.cta.subtitle",
              "Join thousands of students discovering their perfect academic path with Massarek's AI-powered guidance."
            )}
          </p>
          <motion.button
            type="button"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/register")}
            className="mt-8 inline-flex items-center justify-center rounded-full px-8 py-3 font-bold text-white transition-all duration-300 hover:-translate-y-0.5 glow-pulse"
            style={{ background: "linear-gradient(135deg,var(--ms-accent-blue),#0E7490)", border: "1px solid var(--ms-border-glow)", boxShadow: "0 0 24px var(--ms-accent-glow-strong)" }}
          >
            {t("landing.howItWorks.cta.button", "Get Started Free")}
            <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
};

export default HowItWorks;
