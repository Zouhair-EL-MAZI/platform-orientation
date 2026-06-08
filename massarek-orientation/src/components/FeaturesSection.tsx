import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Cpu, ClipboardList, Compass, Bot, Star,
  ArrowRight, Zap, Shield, TrendingUp
} from "lucide-react";

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.65, delay: i * 0.11, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* icon accent configs — each feature gets its own glow color */
const ACCENTS = [
  { grad: "from-blue-500 to-cyan-400",    shadow: "rgba(34,211,238,0.35)",  ring: "rgba(34,211,238,0.15)"  },
  { grad: "from-violet-500 to-indigo-400",shadow: "rgba(139,92,246,0.35)",  ring: "rgba(139,92,246,0.15)"  },
  { grad: "from-sky-500 to-blue-400",     shadow: "rgba(56,189,248,0.35)",  ring: "rgba(56,189,248,0.15)"  },
  { grad: "from-cyan-500 to-teal-400",    shadow: "rgba(20,184,166,0.35)",   ring: "rgba(20,184,166,0.15)"  },
  { grad: "from-indigo-500 to-blue-500",  shadow: "rgba(99,102,241,0.35)",  ring: "rgba(99,102,241,0.15)"  },
];

const FeatureCard = ({
  title, description, icon: Icon, index, isHero = false,
  heroBullet1, heroBullet2,
}: {
  title: string; description: string; icon: typeof Cpu;
  index: number; isHero?: boolean;
  heroBullet1?: string; heroBullet2?: string;
}) => {
  const ac = ACCENTS[index % ACCENTS.length];

  if (isHero) {
    return (
      <motion.article
        custom={index}
        initial="hidden" whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={cardVariants}
        whileHover={{ y: -8 }}
        transition={{ type: "spring", stiffness: 220, damping: 20 }}
        className="relative overflow-hidden rounded-2xl p-8 lg:row-span-2"
        style={{
          background: "var(--ms-bg-card)",
          border: "1px solid var(--ms-border-subtle)",
          backdropFilter: "blur(14px)",
        }}
      >
        {/* ambient glow */}
        <div className="pointer-events-none absolute inset-0" style={{
          background: `radial-gradient(ellipse 70% 50% at 20% 20%, ${ac.ring}, transparent 65%)`,
        }}/>
        {/* top glow line */}
        <div style={{
          position:"absolute", top:0, left:"50%", transform:"translateX(-50%)",
          width:"55%", height:1,
          background:`linear-gradient(90deg,transparent,${ac.shadow.replace("0.35","0.6")},transparent)`,
          opacity:.7,
        }}/>

        {/* icon + label row */}
        <div className="relative flex items-center gap-4 mb-5">
          <div
            className={`inline-flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${ac.grad} text-white`}
            style={{ boxShadow: `0 0 24px ${ac.shadow}, 0 8px 20px rgba(0,0,0,0.2)` }}
          >
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em]" style={{ color: "var(--ms-accent-cyan)" }}>
              {title}
            </p>
            <h3 className="text-2xl font-display font-extrabold mt-0.5">{title}</h3>
          </div>
        </div>

        <p className="relative text-base leading-7 text-muted-foreground mb-8">{description}</p>

        <div className="grid gap-3 sm:grid-cols-2">
          {[heroBullet1, heroBullet2].map((b, i) => (
            <div key={i} className="relative rounded-xl p-4 text-sm"
              style={{
                background: "var(--ms-bg-layer2)",
                border: "1px solid var(--ms-border-subtle)",
              }}
            >
              <div className="flex items-start gap-2">
                <div className="mt-0.5 flex-shrink-0 rounded-full p-1"
                  style={{ background: ac.ring, border: `1px solid ${ac.shadow}` }}>
                  {i === 0
                    ? <Zap className="h-3 w-3" style={{ color: "var(--ms-accent-cyan)" }}/>
                    : <TrendingUp className="h-3 w-3" style={{ color: "var(--ms-accent-cyan)" }}/>
                  }
                </div>
                <span style={{ color: "hsl(var(--foreground))", fontWeight: 500 }}>{b}</span>
              </div>
            </div>
          ))}
        </div>

        {/* decorative bottom gradient */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24" style={{
          background: `linear-gradient(to top, ${ac.ring}, transparent)`,
        }}/>
      </motion.article>
    );
  }

  return (
    <motion.article
      custom={index}
      initial="hidden" whileInView="visible"
      viewport={{ once: true, amount: 0.35 }}
      variants={cardVariants}
      whileHover={{ y: -6 }}
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
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
        background: `radial-gradient(circle at top left, ${ac.ring}, transparent 60%)`,
      }}/>

      <div className="relative flex items-start gap-4 mb-4">
        {/* premium icon container */}
        <div className="relative flex-shrink-0">
          <div
            className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${ac.grad} text-white transition-transform duration-300 group-hover:scale-110`}
            style={{ boxShadow: `0 0 18px ${ac.shadow}, 0 6px 16px rgba(0,0,0,0.18)` }}
          >
            <Icon className="h-5 w-5" />
          </div>
          {/* pulsing ring on hover */}
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ boxShadow: `0 0 0 4px ${ac.ring}` }}/>
        </div>
        <h3 className="text-base font-display font-bold mt-1.5">{title}</h3>
      </div>

      <p className="relative flex-1 text-sm leading-6 text-muted-foreground">{description}</p>

      {/* bottom CTA hint */}
      <div className="relative mt-4 flex items-center gap-1.5 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{ color: "var(--ms-accent-sky)" }}>
        <ArrowRight className="h-3.5 w-3.5"/>
        Learn more
      </div>
    </motion.article>
  );
};

const FeaturesSection = () => {
  const { t } = useTranslation();

  const featureCards = [
    {
      title:       t("landing.featuresSection.cards.0.title", "AI Recommendations"),
      description: t("landing.featuresSection.cards.0.desc",  "Smart course and career matches powered by adaptive AI analysis and student growth models."),
      icon: Cpu,
    },
    {
      title:       t("landing.featuresSection.cards.1.title", "Orientation Tests"),
      description: t("landing.featuresSection.cards.1.desc",  "Precision diagnostics with guided assessments that reveal strengths, interests, and next-step clarity."),
      icon: ClipboardList,
    },
    {
      title:       t("landing.featuresSection.cards.2.title", "Career Explorer"),
      description: t("landing.featuresSection.cards.2.desc",  "Interactive discovery tools that map high-growth paths, study options, and future-ready roles."),
      icon: Compass,
    },
    {
      title:       t("landing.featuresSection.cards.3.title", "AI Chatbot"),
      description: t("landing.featuresSection.cards.3.desc",  "Instant advice, friendly guidance, and real-time answers from a conversational assistant built for students."),
      icon: Bot,
    },
    {
      title:       t("landing.featuresSection.cards.4.title", "Personalized Guidance"),
      description: t("landing.featuresSection.cards.4.desc",  "Tailored plans, milestones, and recommendations that evolve with every academic decision."),
      icon: Star,
    },
  ];

  const heroFeature = featureCards[3];
  const leftFeatures  = featureCards.slice(0, 2);
  const rightFeatures = [featureCards[2], featureCards[4]];

  return (
    <section id="features" className="relative overflow-hidden px-6 py-10 md:px-12 lg:py-16"
      style={{ background: "var(--ms-bg-base)" }}>

      {/* ambient bg */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-96"
        style={{ background: "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(34,211,238,0.10), transparent)" }}/>
      <div className="pointer-events-none absolute right-16 top-24 h-40 w-40 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle,rgba(37,99,235,0.12),transparent)" }}/>
      <div className="pointer-events-none absolute left-8 bottom-32 h-32 w-32 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle,rgba(14,116,144,0.12),transparent)" }}/>

      {/* header */}
      <motion.div
        initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7 }}
        className="relative mx-auto max-w-5xl text-center"
      >
        <span className="section-eyebrow inline-flex items-center justify-center gap-1.5 px-3 py-1.5 mb-2">
          <Shield className="h-3 w-3"/> {t("landing.featuresSection.badge", "Features")}
        </span>
        <h2 className="mx-auto mt-5 max-w-3xl text-3xl font-display font-bold tracking-tight sm:text-4xl md:text-5xl">
          {t("landing.featuresSection.title", "Powerful AI features designed for your future")}
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
          {t("landing.featuresSection.subtitle", "Massarek combines intelligent guidance, immersive assessments, and conversational AI to help students choose the best path with confidence and clarity.")}
        </p>
      </motion.div>

      {/* 3-column grid */}
      <div className="mt-14 grid gap-5 lg:grid-cols-[1fr_1.15fr_1fr] lg:items-start xl:gap-6">

        {/* left column */}
        <div className="grid gap-5">
          {leftFeatures.map((f, i) => (
            <FeatureCard key={f.title} {...f} index={i}/>
          ))}
        </div>

        {/* center hero card */}
        <FeatureCard
          {...heroFeature}
          index={3}
          isHero
          heroBullet1={t("landing.featuresSection.heroBullet1", "Adaptive support for every question.")}
          heroBullet2={t("landing.featuresSection.heroBullet2", "Conversational recommendations and next-step clarity.")}
        />

        {/* right column */}
        <div className="grid gap-5">
          {rightFeatures.map((f, i) => (
            <FeatureCard key={f.title} {...f} index={i + 2}/>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;