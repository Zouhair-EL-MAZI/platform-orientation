import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Users, Mail, Linkedin, Github } from "lucide-react";

const sectionVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12 },
  }),
};

const AboutSection = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language?.startsWith("ar");

  const team = t("landing.about.team.members", { returnObjects: true }) as Array<{ name: string; role: string }>;

  return (
    <section id="about" className="relative overflow-hidden px-6 py-10 md:px-12 lg:py-16" style={{background:"var(--ms-bg-base)"}}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.12),transparent_40%)] dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.1),transparent_45%)]" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
        className="relative mx-auto max-w-4xl text-center"
      >
        <span className="section-eyebrow inline-flex items-center justify-center px-3 py-1.5">
          {t("landing.about.label", "About Massarek")}
        </span>

        <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-display font-bold tracking-tight sm:text-4xl md:text-5xl">
          {t("landing.about.title", "Empowering Students Through Artificial Intelligence")}
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
          {t(
            "landing.about.subtitle",
            "Massarek uses advanced AI to provide students with clear, personalized orientation and career guidance so they can make confident academic choices."
          )}
        </p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="mx-auto mt-12 max-w-6xl"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
        }}
      >
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <motion.div variants={cardVariants} custom={0} className="rounded-2xl p-8 glass-card">
            <h3 className="text-xl font-display font-bold">{t("landing.about.missionLabel", "Our mission")}</h3>
            <p className="mt-4 text-muted-foreground leading-7">{t("landing.about.mission", "Help students discover their strengths and turn them into a meaningful academic path, while removing uncertainty from career planning.")}</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl p-4 text-sm" style={{background:"var(--ms-bg-layer2)",border:"1px solid var(--ms-border-subtle)"}}>
                <h4 className="font-bold">{t("landing.about.educationLabel", "Educational Objective")}</h4>
                <p className="mt-2 text-sm text-muted-foreground">{t("landing.about.education", "Provide students with actionable insights and study pathways grounded in data and personalized AI analysis.")}</p>
              </div>
              <div className="rounded-2xl p-4 text-sm" style={{background:"var(--ms-bg-layer2)",border:"1px solid var(--ms-border-subtle)"}}>
                <h4 className="font-bold">{t("landing.about.visionLabel", "Vision & Innovation")}</h4>
                <p className="mt-2 text-sm text-muted-foreground">{t("landing.about.vision", "Build the most trusted AI companion for students to plan their academic and professional futures.")}</p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={cardVariants} custom={1} className="rounded-2xl p-8 glass-card">
            <h3 className="text-xl font-display font-bold">{t("landing.about.howAI", "How AI Helps")}</h3>
            <p className="mt-4 text-muted-foreground leading-7">{t("landing.about.howAIText", "Massarek analyzes test responses and profile signals to produce understandable recommendations and learning pathways tailored to each student.")}</p>

            <div className="mt-6 grid gap-3">
              <div className="flex items-start gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 text-white shadow-lg">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold">{t("landing.about.personalized", "Personalized Insights")}</h4>
                  <p className="text-sm text-muted-foreground">{t("landing.about.personalizedText", "Recommendations that evolve as students grow and learn.")}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-sky-500 text-white shadow-lg">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-bold">{t("landing.about.humanCentered", "Human-Centered")}</h4>
                  <p className="text-sm text-muted-foreground">{t("landing.about.humanCenteredText", "AI supports human decisions — we surface clear choices, not black boxes.")}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Team */}
        <motion.div className="mt-12" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } }}>
          <h3 className="text-center text-lg font-display font-bold">{t("landing.about.team.title", "Team")}</h3>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-muted-foreground">{t("landing.about.team.subtitle", "Built by students, for students — small, focused, and passionate.")}</p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                variants={cardVariants}
                custom={i + 2}
                whileHover={{ y: -6, boxShadow: "0 20px 60px -30px rgba(56,189,248,0.18)" }}
                className="relative overflow-hidden rounded-2xl p-6 glass-card"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-cyan-400 text-white font-semibold shadow-lg">{member.name.split(" ").map(n=>n[0]).slice(0,2).join("")}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="text-sm font-bold">{member.name}</div>
                        <div className="text-xs text-muted-foreground">{member.role}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <a aria-label="github" className="text-slate-400 hover:text-slate-700 dark:hover:text-white"><Github className="h-5 w-5" /></a>
                        <a aria-label="linkedin" className="text-slate-400 hover:text-slate-700 dark:hover:text-white"><Linkedin className="h-5 w-5" /></a>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">{t(`landing.about.team.members.${i}.bio`, "A dedicated developer focused on building beautiful and effective student experiences.")}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default AboutSection;

