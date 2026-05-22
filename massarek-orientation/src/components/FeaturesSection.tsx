import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Activity, Cpu, MessageCircle, Search, Sparkles } from "lucide-react";


const sectionVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, delay: i * 0.12 },
  }),
};

const FeatureCard = ({
  title,
  description,
  icon: Icon,
  index,
  accent,
}: {
  title: string;
  description: string;
  icon: typeof Cpu;
  index: number;
  accent: string;
}) => (
  <motion.article
    custom={index}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.35 }}
    variants={cardVariants}
    whileHover={{ y: -8 }}
    transition={{ type: "spring", stiffness: 220, damping: 20 }}
    className="group relative flex h-full flex-col overflow-hidden rounded-2xl p-7 transition-all duration-300" style={{background:"var(--ms-bg-card)",border:"1px solid var(--ms-border-subtle)",backdropFilter:"blur(12px)"}}
  >
    <div className="pointer-events-none absolute -left-8 top-6 h-28 w-28 rounded-full bg-gradient-to-br from-sky-400/20 via-transparent to-cyan-400/0 blur-2xl opacity-70" />
    <div className="relative flex items-start gap-4">
      <span className={`inline-flex h-12 w-12 items-center justify-center rounded-3xl ${accent} shadow-lg shadow-sky-500/10 transition-all duration-300 group-hover:scale-105`}>
        <Icon className="h-5 w-5 text-white" />
      </span>
      <div>
        <h3 className="text-lg font-display font-bold">{title}</h3>
      </div>
    </div>
    <p className="mt-5 text-sm leading-7 text-muted-foreground">{description}</p>
  </motion.article>
);

const FeaturesSection = () => {
  const { t } = useTranslation();

  const featureCards = [
    {
      title: t("landing.featuresSection.cards.0.title", "AI Recommendations"),
      description: t(
        "landing.featuresSection.cards.0.desc",
        "Smart course and career matches powered by adaptive AI analysis and student growth models."
      ),
      icon: Cpu,
      accent: "bg-gradient-to-br from-sky-500 to-cyan-400",
    },
    {
      title: t("landing.featuresSection.cards.1.title", "Orientation Tests"),
      description: t(
        "landing.featuresSection.cards.1.desc",
        "Precision diagnostics with guided assessments that reveal strengths, interests, and next-step clarity."
      ),
      icon: Activity,
      accent: "bg-gradient-to-br from-sky-500 to-cyan-400",
    },
    {
      title: t("landing.featuresSection.cards.2.title", "Career Explorer"),
      description: t(
        "landing.featuresSection.cards.2.desc",
        "Interactive discovery tools that map high-growth paths, study options, and future-ready roles."
      ),
      icon: Search,
      accent: "bg-gradient-to-br from-slate-900 to-sky-500",
    },
    {
      title: t("landing.featuresSection.cards.3.title", "AI Chatbot"),
      description: t(
        "landing.featuresSection.cards.3.desc",
        "Instant advice, friendly guidance, and real-time answers from a conversational assistant built for students."
      ),
      icon: MessageCircle,
      accent: "bg-gradient-to-br from-sky-500 to-cyan-400",
    },
    {
      title: t("landing.featuresSection.cards.4.title", "Personalized Guidance"),
      description: t(
        "landing.featuresSection.cards.4.desc",
        "Tailored plans, milestones, and recommendations that evolve with every academic decision."
      ),
      icon: Sparkles,
      accent: "bg-gradient-to-br from-indigo-500 to-sky-500",
    },
  ];

  const heroFeature = featureCards[3];
  const HeroIcon = heroFeature.icon;
  const rightFeatures = [featureCards[2], featureCards[4]];

  return (
    <section id="features" className="relative overflow-hidden px-6 py-10 md:px-12 lg:py-16" style={{background:"var(--ms-bg-base)"}}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.14),transparent_32%)] dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.14),transparent_38%)]" />
      <div className="absolute left-1/2 top-12 h-24 w-24 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="absolute right-12 top-24 h-32 w-32 rounded-full bg-sky-500/10 blur-3xl" />
      <div className="absolute left-10 top-56 h-20 w-20 rounded-full bg-slate-900/10 blur-3xl dark:bg-sky-500/10" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={sectionVariants}
        className="relative mx-auto max-w-5xl text-center"
      >
        <span className="section-eyebrow inline-flex items-center justify-center px-2">
          {t("landing.featuresSection.badge", "Features")}
        </span>
        <h2 className="mx-auto mt-6 max-w-3xl text-3xl font-display font-bold tracking-tight sm:text-4xl md:text-5xl">
          {t("landing.featuresSection.title", "Powerful AI features designed for your future")}
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
          {t(
            "landing.featuresSection.subtitle",
            "Massarek combines intelligent guidance, immersive assessments, and conversational AI to help students choose the best path with confidence and clarity."
          )}
        </p>
      </motion.div>

      <div className="mt-16 grid gap-6 lg:grid-cols-[1fr_1.15fr_1fr] lg:items-start xl:gap-8">
        <div className="grid gap-6">
          {featureCards.slice(0, 2).map((feature, featureIndex) => (
            <FeatureCard
              key={feature.title}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              index={featureIndex}
              accent={feature.accent}
            />
          ))}
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          custom={1}
          variants={cardVariants}
          whileHover={{ y: -10 }}
          transition={{ type: "spring", stiffness: 230, damping: 20 }}
          className="relative overflow-hidden rounded-2xl p-10 transition-all duration-300 glass-card lg:row-span-2"
        >
          <div className="absolute -left-10 top-12 h-28 w-28 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="absolute right-0 top-16 h-24 w-24 rounded-full bg-sky-400/10 blur-3xl" />
          <div className="relative flex flex-col gap-4 rounded-3xl border border-sky-200/50 bg-slate-950/5 px-5 py-4 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/45">
            <span className={`inline-flex h-14 w-14 items-center justify-center rounded-3xl ${heroFeature.accent} text-white shadow-lg shadow-sky-500/20`}>
              <HeroIcon className="h-6 w-6" />
            </span>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-sky-600 dark:text-sky-300">{heroFeature.title}</p>
              <h3 className="mt-2 text-2xl font-display font-semibold text-slate-950 dark:text-white sm:text-3xl">
                {heroFeature.title}
              </h3>
            </div>
          </div>
          <p className="mt-8 text-base leading-8 text-slate-600 dark:text-slate-300">
            {heroFeature.description}
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-200/70 bg-slate-50/90 p-4 text-sm text-slate-700 shadow-sm dark:border-slate-700/70 dark:bg-slate-900/60 dark:text-slate-200">
              {t("landing.featuresSection.heroBullet1", "Adaptive support for every question.")}
            </div>
            <div className="rounded-3xl border border-slate-200/70 bg-slate-50/90 p-4 text-sm text-slate-700 shadow-sm dark:border-slate-700/70 dark:bg-slate-900/60 dark:text-slate-200">
              {t("landing.featuresSection.heroBullet2", "Conversational recommendations and next-step clarity.")}
            </div>
          </div>
        </motion.div>

        <div className="grid gap-6">
          {rightFeatures.map((feature, featureIndex) => (
            <FeatureCard
              key={feature.title}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              index={featureIndex + 2}
              accent={feature.accent}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
