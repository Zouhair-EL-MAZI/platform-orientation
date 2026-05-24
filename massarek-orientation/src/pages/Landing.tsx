import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Sparkles, ArrowRight, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../hooks/use-auth";
import FeaturesSection  from "../components/FeaturesSection";
import AboutSection     from "../components/AboutSection";
import ContactSection   from "../components/ContactSection";
import HowItWorks       from "../components/HowItWorks";

/* ── tiny floating dot ── */
const Dot = ({ x, y, s, d }: { x:number; y:number; s:number; d:number }) => (
  <motion.div className="absolute rounded-full pointer-events-none"
    style={{ left:`${x}%`, top:`${y}%`, width:s, height:s,
      background:"rgba(34,211,238,0.7)", boxShadow:"0 0 6px rgba(34,211,238,0.9)" }}
    animate={{ y:[-8,8,-8], opacity:[0.2,0.65,0.2] }}
    transition={{ duration:3+d, repeat:Infinity, ease:"easeInOut", delay:d }}
  />
);
const DOTS = Array.from({length:20},(_,i)=>({
  id:i, x:5+((i*47)%90), y:5+((i*61)%88), s:2+(i%3), d:(i*.35)%3.2,
}));

/* ── stat number ── */
const AnimatedStat = ({ target, suffix }: { target:number; suffix:string }) => {
  const mv = useMotionValue(0);
  const sv = useSpring(mv, { stiffness:120, damping:18 });
  const [display, setDisplay] = useState(0);
  useEffect(()=>{ const u = sv.on("change",(v)=>setDisplay(v)); mv.set(target); return u; },[mv,sv,target]);
  return (
    <div className="font-display font-extrabold" style={{
      fontSize:"clamp(2rem,4vw,3rem)",
      background:"linear-gradient(135deg,hsl(var(--foreground)),var(--ms-accent-sky))",
      WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
    }}>
      {Math.round(display).toLocaleString()}{suffix}
    </div>
  );
};

const Landing = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const statsTranslations = t("landing.statsSection.cards",{returnObjects:true}) as Array<{label:string}>;
  const statCards = [
    { value:12,  suffix:"K+", label: statsTranslations?.[0]?.label ?? "Students Guided"          },
    { value:96,  suffix:"%",  label: statsTranslations?.[1]?.label ?? "Recommendation Accuracy"   },
    { value:250, suffix:"+",  label: statsTranslations?.[2]?.label ?? "Career Paths"              },
    { value:60,  suffix:"+",  label: statsTranslations?.[3]?.label ?? "Orientation Modules"       },
  ];

  const handleProtectedClick = (path:string) => {
    if (isAuthenticated) { navigate(path); }
    else { localStorage.setItem("intendedDestination", path); navigate("/login"); }
  };

  /* stat accent colors */
  const STAT_ACCENTS = [
    { grad:"from-cyan-500 to-blue-500",   glow:"rgba(34,211,238,0.35)"  },
    { grad:"from-blue-500 to-indigo-500", glow:"rgba(37,99,235,0.35)"   },
    { grad:"from-sky-500 to-cyan-400",    glow:"rgba(56,189,248,0.35)"  },
    { grad:"from-indigo-500 to-blue-500", glow:"rgba(99,102,241,0.35)"  },
  ];

  return (
    <div style={{ background:"var(--ms-bg-base)" }}>

      {/* ══════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════ */}
      <section id="home" className="relative overflow-hidden px-6 md:px-12 pt-12 pb-28">

        {/* grid lines */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage:"linear-gradient(rgba(34,211,238,0.032) 1px,transparent 1px),linear-gradient(90deg,rgba(34,211,238,0.032) 1px,transparent 1px)",
          backgroundSize:"58px 58px",
        }}/>

        {/* ambient radials */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background:[
            "radial-gradient(ellipse 80% 55% at 72% 48%,rgba(14,116,144,0.13),transparent)",
            "radial-gradient(ellipse 55% 80% at 8%  28%,rgba(37,99,235,0.11),transparent)",
            "radial-gradient(ellipse 40% 40% at 50% 90%,rgba(34,211,238,0.06),transparent)",
          ].join(", "),
        }}/>

        {/* floating dots */}
        {DOTS.map(d=><Dot key={d.id} x={d.x} y={d.y} s={d.s} d={d.d}/>)}

        <div className="relative z-10 mx-auto grid gap-12 lg:grid-cols-[minmax(0,1fr)_520px] lg:items-center max-w-7xl">

          {/* ── left: text ── */}
          <motion.div initial={{opacity:0,y:28}} animate={{opacity:1,y:0}} transition={{duration:.85,ease:[.22,1,.36,1]}}>

            {/* badge */}
            <motion.div
              initial={{opacity:0,scale:.9}} animate={{opacity:1,scale:1}} transition={{duration:.6,delay:.15}}
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold mb-7"
              style={{
                background:"rgba(34,211,238,0.07)",
                border:"1px solid rgba(34,211,238,0.24)",
                color:"var(--ms-accent-cyan)",
                letterSpacing:"0.07em",
                boxShadow:"0 0 20px rgba(34,211,238,0.12)",
              }}
            >
              <motion.span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background:"var(--ms-accent-cyan)", boxShadow:"0 0 6px var(--ms-accent-cyan)" }}
                animate={{opacity:[1,.4,1],scale:[1,.75,1]}} transition={{duration:2,repeat:Infinity}}
              />
              <Sparkles size={12}/>
              {t("landing.hero.label")}
            </motion.div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.06]">
              {t("landing.hero.title")} <br/>
              <span style={{
                background:"linear-gradient(90deg,#22D3EE,#38BDF8,#60A5FA)",
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
              }}>
                {t("landing.hero.highlight")}
              </span>
            </h1>

            <p className="text-lg md:text-xl max-w-2xl leading-relaxed mb-10 text-muted-foreground">
              {t("landing.hero.subtitle")}
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              {/* primary CTA */}
              <motion.button
                onClick={()=>handleProtectedClick("/test")}
                whileHover={{y:-2,boxShadow:"0 0 44px rgba(34,211,238,0.45),0 14px 36px rgba(37,99,235,0.40)"}}
                whileTap={{scale:.97}}
                className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-base font-bold text-white transition-all duration-300"
                style={{
                  background:"linear-gradient(135deg,#2563EB,#0E7490)",
                  border:"1px solid rgba(34,211,238,0.32)",
                  boxShadow:"0 0 28px rgba(34,211,238,0.28),0 8px 24px rgba(37,99,235,0.28),inset 0 1px 0 rgba(255,255,255,0.15)",
                  fontFamily:"'Sora',sans-serif",
                }}
              >
                {t("landing.hero.startTest")} <ArrowRight size={17}/>
              </motion.button>

              {/* secondary CTA */}
              <motion.button
                onClick={()=>handleProtectedClick("/careers")}
                whileHover={{y:-1}}
                className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-base font-semibold transition-all duration-200"
                style={{
                  background:"rgba(255,255,255,0.04)",
                  border:"1px solid var(--ms-border-subtle)",
                  color:"hsl(var(--muted-foreground))",
                  backdropFilter:"blur(10px)",
                  fontFamily:"'Sora',sans-serif",
                }}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor="var(--ms-border-glow)";(e.currentTarget as HTMLElement).style.color="hsl(var(--foreground))";}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor="var(--ms-border-subtle)";(e.currentTarget as HTMLElement).style.color="hsl(var(--muted-foreground))";}}
              >
                {t("landing.hero.exploreCareers")}
              </motion.button>
            </div>

            {/* scroll hint */}
            <motion.div
              className="mt-12 hidden md:flex items-center gap-2 text-xs font-semibold"
              style={{ color:"hsl(var(--muted-foreground))", opacity:.5 }}
              animate={{ y:[0,4,0] }} transition={{ duration:2.5, repeat:Infinity, ease:"easeInOut" }}
            >
              <ChevronDown size={14}/>
              Scroll to explore
            </motion.div>
          </motion.div>

          {/* ── right: image card ── */}
          <motion.div
            initial={{opacity:0,y:28,scale:.97}} animate={{opacity:1,y:0,scale:1}}
            transition={{delay:.22,duration:1,ease:[.22,1,.36,1]}}
            className="relative"
          >
            {/* floating glow behind card */}
            <div className="absolute -inset-4 rounded-[3rem] blur-2xl pointer-events-none" style={{
              background:"radial-gradient(ellipse,rgba(34,211,238,0.12),transparent 70%)",
            }}/>

            <motion.div
              animate={{y:[0,-6,0]}} transition={{duration:5,repeat:Infinity,ease:"easeInOut"}}
              className="relative overflow-hidden rounded-[2.5rem]"
              style={{
                background:"var(--ms-bg-card)",
                border:"1px solid var(--ms-border-glow)",
                boxShadow:"0 24px 64px rgba(0,0,0,0.4), 0 0 0 1px var(--ms-border-subtle), 0 0 60px rgba(34,211,238,0.06)",
                backdropFilter:"blur(12px)",
              }}
            >
              {/* inner glow overlay */}
              <div className="absolute inset-0 pointer-events-none" style={{
                background:"radial-gradient(circle at 30% 28%,rgba(34,211,238,0.13),transparent 55%),radial-gradient(circle at 72% 72%,rgba(37,99,235,0.16),transparent 55%)",
              }}/>
              {/* top glow line */}
              <div style={{ position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:"55%",height:1,background:"linear-gradient(90deg,transparent,#22D3EE,transparent)",opacity:.6 }}/>

              <div className="relative p-4 sm:p-6 lg:p-8">
                <div className="relative overflow-hidden rounded-[2rem]" style={{ border:"1px solid var(--ms-border-subtle)" }}>
                  <img
                    src="/imagHome.png"
                    alt="Futuristic AI orientation interface"
                    className="h-full w-full min-h-[360px] object-cover"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          STATS SECTION
      ══════════════════════════════════════ */}
      <section
        className="relative overflow-hidden px-6 md:px-12 py-16"
        style={{ background:"var(--ms-bg-layer1)", borderTop:"1px solid var(--ms-border-subtle)", borderBottom:"1px solid var(--ms-border-subtle)" }}
      >
        {/* ambient */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-64" style={{
          background:"radial-gradient(ellipse 60% 50% at 50% 0%,rgba(34,211,238,0.07),transparent)",
        }}/>

        <div className="relative mx-auto max-w-5xl">
          <motion.div
            initial={{opacity:0,y:22}} whileInView={{opacity:1,y:0}}
            viewport={{once:true,amount:.4}} transition={{duration:.7}}
            className="text-center mb-12"
          >
            <span className="section-eyebrow inline-flex items-center gap-1.5 mb-3">
              <Sparkles className="h-3 w-3"/>
              {t("landing.statsSection.badge")}
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold max-w-3xl mx-auto">
              {t("landing.statsSection.title")}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mt-4 leading-relaxed">
              {t("landing.statsSection.subtitle")}
            </p>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {statCards.map((stat, index) => {
              const ac = STAT_ACCENTS[index];
              return (
                <motion.div
                  key={stat.label}
                  initial={{opacity:0,y:24}}
                  whileInView={{opacity:1,y:0}}
                  whileHover={{y:-6}}
                  viewport={{once:true,amount:.4}}
                  transition={{duration:.65,delay:index*.1}}
                  className="group relative overflow-hidden rounded-2xl p-7"
                  style={{
                    background:"var(--ms-bg-card)",
                    border:"1px solid var(--ms-border-subtle)",
                    backdropFilter:"blur(12px)",
                    transition:"border-color .25s",
                  }}
                  onMouseEnter={e=>(e.currentTarget as HTMLElement).style.borderColor="var(--ms-border-glow)"}
                  onMouseLeave={e=>(e.currentTarget as HTMLElement).style.borderColor="var(--ms-border-subtle)"}
                >
                  {/* top glow line */}
                  <div style={{ position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:"55%",height:1,background:`linear-gradient(90deg,transparent,${ac.glow.replace("0.35","0.8")},transparent)`,opacity:.55 }}/>
                  {/* hover inner glow */}
                  <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background:`radial-gradient(circle at top center,${ac.glow.replace("0.35","0.10")},transparent 55%)` }}/>

                  {/* icon */}
                  <div className={`inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${ac.grad} mb-4`}
                    style={{ boxShadow:`0 0 16px ${ac.glow}` }}>
                    <Sparkles className="h-4 w-4 text-white"/>
                  </div>

                  <p className="text-[10px] uppercase tracking-[0.16em] font-bold mb-2" style={{ color:"var(--ms-accent-cyan)" }}>
                    {stat.label}
                  </p>
                  <AnimatedStat target={stat.value} suffix={stat.suffix}/>
                  <div className={`h-[2px] w-14 rounded-full mt-5 bg-gradient-to-r ${ac.grad}`}
                    style={{ boxShadow:`0 0 8px ${ac.glow}` }}/>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <FeaturesSection/>
      <HowItWorks/>
      <AboutSection/>
      <ContactSection/>
    </div>
  );
};

export default Landing;
