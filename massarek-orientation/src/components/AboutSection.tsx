import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Target, Lightbulb, GraduationCap, Telescope,
  TrendingUp, Heart, Github, Linkedin, Users2
} from "lucide-react";

const sectionVariants = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

const AboutSection = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language?.startsWith("ar");

  const team = t("landing.about.team.members", { returnObjects: true }) as Array<{ name: string; role: string }>;

  return (
    <section id="about" className="relative overflow-hidden px-6 py-10 md:px-12 lg:py-16"
      style={{ background: "var(--ms-bg-base)" }}>

      {/* ambient */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-96"
        style={{ background: "radial-gradient(ellipse 70% 40% at 50% 0%,rgba(34,211,238,0.09),transparent)" }}/>
      <div className="pointer-events-none absolute right-10 top-28 h-44 w-44 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle,rgba(37,99,235,0.10),transparent)" }}/>
      <div className="pointer-events-none absolute left-6 bottom-20 h-36 w-36 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle,rgba(14,116,144,0.10),transparent)" }}/>

      {/* header */}
      <motion.div
        initial="hidden" whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
        className="relative mx-auto max-w-4xl text-center"
      >
        <span className="section-eyebrow inline-flex items-center justify-center gap-1.5 px-3 py-1.5 mb-4">
          <Users2 className="h-3 w-3"/>
          {t("landing.about.label", "About Massarek")}
        </span>
        <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-display font-bold tracking-tight sm:text-4xl md:text-5xl">
          {t("landing.about.title", "Empowering Students Through Artificial Intelligence")}
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
          {t("landing.about.subtitle", "Massarek uses advanced AI to provide students with clear, personalized orientation and career guidance so they can make confident academic choices.")}
        </p>
      </motion.div>

      {/* main grid */}
      <motion.div
        initial="hidden" whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={{ hidden:{opacity:0}, visible:{opacity:1,transition:{staggerChildren:.12}} }}
        className="mx-auto mt-12 max-w-6xl"
      >
        <div className="grid gap-6 lg:grid-cols-2 lg:items-start">

          {/* Mission card */}
          <motion.div variants={cardVariants} custom={0}
            className="relative overflow-hidden rounded-2xl p-8"
            style={{ background:"var(--ms-bg-card)", border:"1px solid var(--ms-border-subtle)", backdropFilter:"blur(12px)" }}
          >
            <div style={{ position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:"55%",height:1,background:"linear-gradient(90deg,transparent,#22D3EE,transparent)",opacity:.45 }}/>
            <div className="pointer-events-none absolute inset-0"
              style={{ background:"radial-gradient(ellipse 60% 40% at 10% 10%,rgba(34,211,238,0.06),transparent)" }}/>

            <div className="relative flex items-center gap-3 mb-4">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 text-white"
                style={{ boxShadow:"0 0 18px rgba(34,211,238,0.35)" }}>
                <Target className="h-4.5 w-4.5 h-[18px] w-[18px]"/>
              </div>
              <h3 className="text-xl font-display font-bold">{t("landing.about.missionLabel","Our mission")}</h3>
            </div>
            <p className="relative text-muted-foreground leading-7">
              {t("landing.about.mission","Help students discover their strengths and turn them into a meaningful academic path, while removing uncertainty from career planning.")}
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                {
                  icon: GraduationCap,
                  label: t("landing.about.educationLabel","Educational Objective"),
                  text:  t("landing.about.education","Provide students with actionable insights and study pathways grounded in data and personalized AI analysis."),
                  grad:  "from-sky-500 to-cyan-400",
                  glow:  "rgba(34,211,238,0.30)",
                },
                {
                  icon: Telescope,
                  label: t("landing.about.visionLabel","Vision & Innovation"),
                  text:  t("landing.about.vision","Build the most trusted AI companion for students to plan their academic and professional futures."),
                  grad:  "from-indigo-500 to-blue-500",
                  glow:  "rgba(99,102,241,0.30)",
                },
              ].map((item, i) => (
                <div key={i} className="group rounded-xl p-4"
                  style={{ background:"var(--ms-bg-layer2)", border:"1px solid var(--ms-border-subtle)", transition:"border-color .2s" }}
                  onMouseEnter={e=>(e.currentTarget as HTMLElement).style.borderColor="var(--ms-border-glow)"}
                  onMouseLeave={e=>(e.currentTarget as HTMLElement).style.borderColor="var(--ms-border-subtle)"}
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className={`inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br ${item.grad} text-white flex-shrink-0`}
                      style={{ boxShadow:`0 0 12px ${item.glow}` }}>
                      <item.icon className="h-3.5 w-3.5"/>
                    </div>
                    <h4 className="font-bold text-sm">{item.label}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground leading-5">{item.text}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* AI Helps card */}
          <motion.div variants={cardVariants} custom={1}
            className="relative overflow-hidden rounded-2xl p-8"
            style={{ background:"var(--ms-bg-card)", border:"1px solid var(--ms-border-subtle)", backdropFilter:"blur(12px)" }}
          >
            <div style={{ position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:"55%",height:1,background:"linear-gradient(90deg,transparent,#22D3EE,transparent)",opacity:.45 }}/>
            <div className="pointer-events-none absolute inset-0"
              style={{ background:"radial-gradient(ellipse 60% 40% at 90% 10%,rgba(99,102,241,0.07),transparent)" }}/>

            <div className="relative flex items-center gap-3 mb-4">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 text-white"
                style={{ boxShadow:"0 0 18px rgba(99,102,241,0.35)" }}>
                <Lightbulb className="h-[18px] w-[18px]"/>
              </div>
              <h3 className="text-xl font-display font-bold">{t("landing.about.howAI","How AI Helps")}</h3>
            </div>
            <p className="relative text-muted-foreground leading-7 mb-6">
              {t("landing.about.howAIText","Massarek analyzes test responses and profile signals to produce understandable recommendations and learning pathways tailored to each student.")}
            </p>

            <div className="grid gap-4">
              {[
                {
                  icon: TrendingUp,
                  label: t("landing.about.personalized","Personalized Insights"),
                  text:  t("landing.about.personalizedText","Recommendations that evolve as students grow and learn."),
                  grad:  "from-sky-500 to-cyan-400",
                  glow:  "rgba(34,211,238,0.32)",
                },
                {
                  icon: Heart,
                  label: t("landing.about.humanCentered","Human-Centered"),
                  text:  t("landing.about.humanCenteredText","AI supports human decisions — we surface clear choices, not black boxes."),
                  grad:  "from-indigo-500 to-sky-500",
                  glow:  "rgba(99,102,241,0.32)",
                },
              ].map((item, i) => (
                <div key={i} className="group flex items-start gap-3 rounded-xl p-4"
                  style={{ background:"var(--ms-bg-layer2)", border:"1px solid var(--ms-border-subtle)", transition:"border-color .2s" }}
                  onMouseEnter={e=>(e.currentTarget as HTMLElement).style.borderColor="var(--ms-border-glow)"}
                  onMouseLeave={e=>(e.currentTarget as HTMLElement).style.borderColor="var(--ms-border-subtle)"}
                >
                  <div className={`inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.grad} text-white mt-0.5`}
                    style={{ boxShadow:`0 0 14px ${item.glow}` }}>
                    <item.icon className="h-4 w-4"/>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm mb-1">{item.label}</h4>
                    <p className="text-xs text-muted-foreground leading-5">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Team */}
        <motion.div className="mt-14"
          variants={{ hidden:{opacity:0}, visible:{opacity:1,transition:{staggerChildren:.09}} }}
        >
          <div className="text-center mb-8">
            <h3 className="text-xl font-display font-bold">{t("landing.about.team.title","Team")}</h3>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground">
              {t("landing.about.team.subtitle","Built by students, for students — small, focused, and passionate.")}
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 max-w-5xl mx-auto">
            {team.map((member, i) => {
              const initials = member.name.split(" ").map(n => n[0]).slice(0, 2).join("");
              const grads = ["from-blue-500 to-cyan-400", "from-indigo-500 to-blue-500"];
              const glows = ["rgba(34,211,238,0.35)", "rgba(99,102,241,0.35)"];
              return (
                <motion.div
                  key={member.name}
                  variants={cardVariants}
                  custom={i + 2}
                  whileHover={{ y: -6 }}
                  transition={{ type:"spring", stiffness:220, damping:20 }}
                  className="relative overflow-hidden rounded-2xl p-6"
                  style={{ background:"var(--ms-bg-card)", border:"1px solid var(--ms-border-subtle)", backdropFilter:"blur(12px)", transition:"border-color .25s" }}
                  onMouseEnter={e=>(e.currentTarget as HTMLElement).style.borderColor="var(--ms-border-glow)"}
                  onMouseLeave={e=>(e.currentTarget as HTMLElement).style.borderColor="var(--ms-border-subtle)"}
                >
                  {/* glow */}
                  <div className="pointer-events-none absolute inset-0"
                    style={{ background:`radial-gradient(circle at top left,${glows[i % 2].replace("0.35","0.08")},transparent 60%)` }}/>

                  <div className={`flex items-start gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                    {/* avatar */}
                    <div className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${grads[i % 2]} text-white font-bold text-lg`}
                      style={{ boxShadow:`0 0 20px ${glows[i % 2]}` }}>
                      {initials}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <div>
                          <div className="text-sm font-bold">{member.name}</div>
                          <div className="text-xs font-semibold" style={{ color:"var(--ms-accent-sky)" }}>{member.role}</div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <a href="#" aria-label="github"
                            className="inline-flex h-7 w-7 items-center justify-center rounded-lg transition-all duration-200"
                            style={{ color:"hsl(var(--muted-foreground))", border:"1px solid var(--ms-border-subtle)", background:"var(--ms-bg-layer2)" }}
                            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor="var(--ms-border-glow)";(e.currentTarget as HTMLElement).style.color="var(--ms-accent-sky)";}}
                            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor="var(--ms-border-subtle)";(e.currentTarget as HTMLElement).style.color="hsl(var(--muted-foreground))";}}
                          >
                            <Github className="h-3.5 w-3.5"/>
                          </a>
                          <a href="#" aria-label="linkedin"
                            className="inline-flex h-7 w-7 items-center justify-center rounded-lg transition-all duration-200"
                            style={{ color:"hsl(var(--muted-foreground))", border:"1px solid var(--ms-border-subtle)", background:"var(--ms-bg-layer2)" }}
                            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor="var(--ms-border-glow)";(e.currentTarget as HTMLElement).style.color="var(--ms-accent-sky)";}}
                            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor="var(--ms-border-subtle)";(e.currentTarget as HTMLElement).style.color="hsl(var(--muted-foreground))";}}
                          >
                            <Linkedin className="h-3.5 w-3.5"/>
                          </a>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground leading-5 mt-2">
                        {t(`landing.about.team.members.${i}.bio`, "A dedicated developer focused on building beautiful and effective student experiences.")}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default AboutSection;