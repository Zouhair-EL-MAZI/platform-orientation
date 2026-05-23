import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  UserRoundPlus, ClipboardCheck, BrainCircuit,
  Sparkles, Map, ArrowRight, Rocket
} from "lucide-react";

const sectionVariants = {
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const containerVariants = {
  hidden:   { opacity: 0 },
  visible:  { opacity: 1, transition: { staggerChildren: 0.13, delayChildren: 0.15 } },
};

const stepVariants = {
  hidden:   { opacity: 0, y: 22 },
  visible:  { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const STEPS_META = [
  { icon: UserRoundPlus, grad: "from-blue-500 to-cyan-400",     glow: "rgba(34,211,238,0.40)",   ring: "rgba(34,211,238,0.15)"  },
  { icon: ClipboardCheck,grad: "from-sky-500 to-blue-400",      glow: "rgba(56,189,248,0.38)",   ring: "rgba(56,189,248,0.13)"  },
  { icon: BrainCircuit,  grad: "from-indigo-500 to-sky-400",    glow: "rgba(99,102,241,0.38)",   ring: "rgba(99,102,241,0.13)"  },
  { icon: Sparkles,      grad: "from-purple-500 to-indigo-400", glow: "rgba(168,85,247,0.38)",   ring: "rgba(168,85,247,0.13)"  },
  { icon: Map,           grad: "from-violet-500 to-purple-400", glow: "rgba(139,92,246,0.38)",   ring: "rgba(139,92,246,0.13)"  },
];

const HowItWorks = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isRTL = document.documentElement.dir === "rtl";

  const steps = [
    {
      title: t("landing.howItWorks.steps.0.title", "Create Account"),
      desc:  t("landing.howItWorks.steps.0.desc",  "Sign up in seconds and set up your student profile with your basic information."),
    },
    {
      title: t("landing.howItWorks.steps.1.title", "Take Orientation Test"),
      desc:  t("landing.howItWorks.steps.1.desc",  "Complete an adaptive quiz that reveals your strengths, interests, and academic preferences."),
    },
    {
      title: t("landing.howItWorks.steps.2.title", "AI Analyzes Responses"),
      desc:  t("landing.howItWorks.steps.2.desc",  "Our intelligent engine processes your answers to understand your unique profile and potential."),
    },
    {
      title: t("landing.howItWorks.steps.3.title", "Receive Personalized Recommendations"),
      desc:  t("landing.howItWorks.steps.3.desc",  "Get tailored suggestions for fields, majors, and career paths that match your profile perfectly."),
    },
    {
      title: t("landing.howItWorks.steps.4.title", "Explore Careers & Study Fields"),
      desc:  t("landing.howItWorks.steps.4.desc",  "Deep dive into detailed information about careers, salaries, education requirements, and growth paths."),
    },
  ];

  return (
    <section id="how-it-works" className="relative overflow-hidden px-6 py-10 md:px-12 lg:py-16"
      style={{ background: "var(--ms-bg-layer1)" }}>

      {/* ambient */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-96"
        style={{ background: "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(34,211,238,0.08), transparent)" }}/>
      <div className="pointer-events-none absolute right-12 top-32 h-40 w-40 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle,rgba(37,99,235,0.10),transparent)" }}/>
      <div className="pointer-events-none absolute left-6 bottom-24 h-36 w-36 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle,rgba(14,116,144,0.10),transparent)" }}/>

      {/* header */}
      <motion.div
        initial="hidden" whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
        className="relative mx-auto max-w-4xl text-center"
      >
        <span className="section-eyebrow inline-flex items-center justify-center gap-1.5 px-3 py-1.5 mb-6">
          <Rocket className="h-3 w-3"/>
          {t("landing.howItWorks.badge", "How It Works")}
        </span>
        <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-display font-bold tracking-tight sm:text-4xl md:text-5xl">
          {t("landing.howItWorks.title", "Simple Steps Powered by Artificial Intelligence")}
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
          {t("landing.howItWorks.subtitle", "Follow our streamlined process to discover your perfect academic path. From account creation to career exploration, every step is designed to guide you professionally.")}
        </p>
      </motion.div>

      {/* steps */}
      <motion.div
        initial="hidden" whileInView="visible"
        viewport={{ once: true, amount: 0.08 }}
        variants={containerVariants}
        className="relative mx-auto mt-16 max-w-6xl"
      >
        {/* connector line desktop */}
        <div className="absolute top-[52px] left-[8%] right-[8%] hidden xl:block" style={{ height: 2, zIndex: 0 }}>
          <div className="h-full w-full" style={{
            background: "linear-gradient(90deg, transparent, rgba(34,211,238,0.25) 15%, rgba(56,189,248,0.30) 50%, rgba(34,211,238,0.25) 85%, transparent)",
          }}/>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {steps.map((step, index) => {
            const meta = STEPS_META[index];
            const Icon = meta.icon;
            const isLast = index === steps.length - 1;

            return (
              <motion.div key={index} variants={stepVariants} className="relative">
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 220, damping: 20 }}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl p-6"
                  style={{
                    background: "var(--ms-bg-card)",
                    border: "1px solid var(--ms-border-subtle)",
                    backdropFilter: "blur(12px)",
                    transition: "border-color .25s",
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--ms-border-glow)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--ms-border-subtle)"}
                >
                  {/* hover inner glow */}
                  <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: `radial-gradient(circle at top left, ${meta.ring}, transparent 55%)` }}/>

                  {/* icon + step number */}
                  <div className="relative mb-5 flex items-center gap-3">
                    {/* icon */}
                    <div className="relative flex-shrink-0">
                      <motion.div
                        className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${meta.grad} text-white`}
                        style={{ boxShadow: `0 0 22px ${meta.glow}, 0 6px 18px rgba(0,0,0,0.18)` }}
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Icon className="h-6 w-6"/>
                      </motion.div>
                      {/* pulse ring */}
                      <motion.div
                        className="absolute inset-0 rounded-2xl"
                        animate={{ boxShadow: [`0 0 0 0 ${meta.glow}`, `0 0 0 10px transparent`] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
                      />
                    </div>

                    {/* step badge */}
                    <div
                      className="inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-extrabold"
                      style={{
                        background: meta.ring,
                        border: `1px solid ${meta.glow.replace("0.40","0.35")}`,
                        color: "var(--ms-accent-sky)",
                        fontFamily: "'Sora',sans-serif",
                      }}
                    >
                      {index + 1}
                    </div>
                  </div>

                  {/* content */}
                  <div className="relative flex-1">
                    <h3 className="text-sm font-display font-bold mb-2 leading-snug">{step.title}</h3>
                    <p className="text-xs leading-5 text-muted-foreground">{step.desc}</p>
                  </div>

                  {/* CTA row */}
                  <div
                    className={`relative mt-4 flex items-center gap-1.5 text-xs font-semibold transition-all duration-200 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 ${isRTL ? "flex-row-reverse group-hover:-translate-x-1 group-hover:translate-x-0" : ""}`}
                    style={{ color: "var(--ms-accent-sky)" }}
                  >
                    <span>{isLast ? t("landing.howItWorks.start","Start Now") : t("landing.howItWorks.next","Next")}</span>
                    <ArrowRight className={`h-3.5 w-3.5 ${isRTL ? "rotate-180" : ""}`}/>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* mobile dots */}
        <div className="mt-7 flex justify-center gap-2.5 xl:hidden">
          {steps.map((_, i) => (
            <motion.div key={i}
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: STEPS_META[i].glow.replace("0.40","0.9") }}
            />
          ))}
        </div>
      </motion.div>

      {/* CTA box */}
      <motion.div
        initial="hidden" whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
        transition={{ delay: 0.3 }}
        className="relative mx-auto mt-16 max-w-2xl overflow-hidden rounded-2xl p-8 sm:p-10"
        style={{
          background: "var(--ms-bg-card)",
          border: "1px solid var(--ms-border-glow)",
          backdropFilter: "blur(14px)",
          boxShadow: "0 0 60px rgba(34,211,238,0.06)",
        }}
      >
        {/* top glow */}
        <div style={{
          position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",
          width:"55%",height:1,background:"linear-gradient(90deg,transparent,#22D3EE,transparent)",opacity:.5,
        }}/>
        <div className="pointer-events-none absolute -left-10 top-8 h-24 w-24 rounded-full blur-3xl"
          style={{ background:"radial-gradient(circle,rgba(34,211,238,0.12),transparent)" }}/>

        <div className="relative text-center">
          <p className="mb-4 section-eyebrow inline-flex items-center gap-1.5">
            <Sparkles className="h-3 w-3"/>
            {t("landing.howItWorks.cta.label","Ready to start?")}
          </p>
          <h3 className="text-2xl font-display font-bold sm:text-3xl">
            {t("landing.howItWorks.cta.title","Begin Your Orientation Journey Today")}
          </h3>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
            {t("landing.howItWorks.cta.subtitle","Join thousands of students discovering their perfect academic path with Massarek's AI-powered guidance.")}
          </p>
          <motion.button
            type="button"
            whileHover={{ y: -2, boxShadow: "0 0 44px rgba(34,211,238,0.45),0 14px 36px rgba(37,99,235,0.40)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/register")}
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 font-bold text-white transition-all duration-300"
            style={{
              background: "linear-gradient(135deg,var(--ms-accent-blue),#0E7490)",
              border: "1px solid var(--ms-border-glow)",
              boxShadow: "0 0 28px rgba(34,211,238,0.25), 0 8px 24px rgba(37,99,235,0.25), inset 0 1px 0 rgba(255,255,255,0.14)",
              fontFamily: "'Sora',sans-serif",
            }}
          >
            {t("landing.howItWorks.cta.button","Get Started Free")}
            <ArrowRight className="h-4 w-4"/>
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
};

export default HowItWorks;