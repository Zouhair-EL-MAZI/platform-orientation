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
    <section id="about" className="relative overflow-hidden px-6 py-10 md:px-12 lg:py-16 bg-[linear-gradient(180deg,rgba(241,248,255,0.96),rgba(238,246,255,0.82))] dark:bg-[linear-gradient(180deg,rgba(11,17,33,0.94),rgba(15,23,42,0.9))]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.12),transparent_40%)] dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.1),transparent_45%)]" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
        className="relative mx-auto max-w-4xl text-center"
      >
        <span className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.6em] text-sky-600 dark:text-sky-400">
          {t("landing.about.label", "About Massarek")}
        </span>

        <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-display font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl md:text-5xl">
          {t("landing.about.title", "Empowering Students Through Artificial Intelligence")}
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg">
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
          <motion.div variants={cardVariants} custom={0} className="rounded-[1.6rem] border border-slate-200/60 bg-white/85 p-8 shadow-[0_20px_80px_-50px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-white/6 dark:bg-slate-900/60">
            <h3 className="text-xl font-display font-semibold text-slate-900 dark:text-white">{t("landing.about.missionLabel", "Our mission")}</h3>
            <p className="mt-4 text-slate-700 dark:text-slate-300 leading-7">{t("landing.about.mission", "Help students discover their strengths and turn them into a meaningful academic path, while removing uncertainty from career planning.")}</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-100/60 bg-slate-50/90 p-4 text-sm dark:border-slate-700/60 dark:bg-slate-900/50">
                <h4 className="font-semibold text-slate-900 dark:text-white">{t("landing.about.educationLabel", "Educational Objective")}</h4>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{t("landing.about.education", "Provide students with actionable insights and study pathways grounded in data and personalized AI analysis.")}</p>
              </div>
              <div className="rounded-2xl border border-slate-100/60 bg-slate-50/90 p-4 text-sm dark:border-slate-700/60 dark:bg-slate-900/50">
                <h4 className="font-semibold text-slate-900 dark:text-white">{t("landing.about.visionLabel", "Vision & Innovation")}</h4>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{t("landing.about.vision", "Build the most trusted AI companion for students to plan their academic and professional futures.")}</p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={cardVariants} custom={1} className="rounded-[1.6rem] border border-slate-200/50 bg-gradient-to-br from-white/70 via-sky-50/40 to-white/70 p-8 shadow-[0_25px_90px_-55px_rgba(56,189,248,0.08)] backdrop-blur-2xl dark:border-sky-500/20 dark:bg-gradient-to-br dark:from-slate-900/60 dark:via-slate-900/35 dark:to-slate-950/60">
            <h3 className="text-xl font-display font-semibold text-slate-900 dark:text-white">{t("landing.about.howAI", "How AI Helps")}</h3>
            <p className="mt-4 text-slate-700 dark:text-slate-300 leading-7">{t("landing.about.howAIText", "Massarek analyzes test responses and profile signals to produce understandable recommendations and learning pathways tailored to each student.")}</p>

            <div className="mt-6 grid gap-3">
              <div className="flex items-start gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 text-white shadow-lg">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">{t("landing.about.personalized", "Personalized Insights")}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{t("landing.about.personalizedText", "Recommendations that evolve as students grow and learn.")}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-sky-500 text-white shadow-lg">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">{t("landing.about.humanCentered", "Human-Centered")}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{t("landing.about.humanCenteredText", "AI supports human decisions — we surface clear choices, not black boxes.")}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Team */}
        <motion.div className="mt-12" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } }}>
          <h3 className="text-center text-lg font-display font-semibold text-slate-900 dark:text-white">{t("landing.about.team.title", "Team")}</h3>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-slate-600 dark:text-slate-300">{t("landing.about.team.subtitle", "Built by students, for students — small, focused, and passionate.")}</p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                variants={cardVariants}
                custom={i + 2}
                whileHover={{ y: -6, boxShadow: "0 20px 60px -30px rgba(56,189,248,0.18)" }}
                className="relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white/90 p-6 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.08)] backdrop-blur-md dark:border-white/6 dark:bg-slate-900/55"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-cyan-400 text-white font-semibold shadow-lg">{member.name.split(" ").map(n=>n[0]).slice(0,2).join("")}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-white">{member.name}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-300">{member.role}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <a aria-label="github" className="text-slate-400 hover:text-slate-700 dark:hover:text-white"><Github className="h-5 w-5" /></a>
                        <a aria-label="linkedin" className="text-slate-400 hover:text-slate-700 dark:hover:text-white"><Linkedin className="h-5 w-5" /></a>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{t(`landing.about.team.members.${i}.bio`, "A dedicated developer focused on building beautiful and effective student experiences.")}</p>
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
