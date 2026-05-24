import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import axios from "axios";
import {
  Mail, Clock, ShieldCheck, Send,
  MessageSquare, MapPin, Sparkles
} from "lucide-react";

const sectionVariants = {
  hidden:  { opacity:0, y:28 },
  visible: { opacity:1, y:0, transition:{ duration:.8 } },
};

const ContactSection = () => {
  const { t } = useTranslation();

  const [form, setForm]       = useState({ name:"", email:"", message:"" });
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent]       = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post("http://127.0.0.1:8000/api/contact", form);
      setSent(true);
      setForm({ name:"", email:"", message:"" });
    } catch {
      /* silent — keep existing error handling if any */
    } finally { setIsLoading(false); }
  };

  const iS: React.CSSProperties = {
    width:"100%", borderRadius:10, padding:"11px 14px", fontSize:13.5,
    outline:"none", fontFamily:"'Sora',sans-serif", transition:"all .22s",
    background:"var(--ms-auth-input-bg)",
    border:"1px solid var(--ms-auth-input-border)",
    color:"hsl(var(--foreground))",
  };
  const iF = (e: React.FocusEvent<HTMLInputElement|HTMLTextAreaElement>) => {
    e.target.style.borderColor="var(--ms-border-active)";
    e.target.style.boxShadow="0 0 0 3px var(--ms-accent-glow),0 0 12px var(--ms-accent-glow)";
    e.target.style.background="var(--ms-bg-card)";
  };
  const iB = (e: React.FocusEvent<HTMLInputElement|HTMLTextAreaElement>) => {
    e.target.style.borderColor="var(--ms-auth-input-border)";
    e.target.style.boxShadow="none";
    e.target.style.background="var(--ms-auth-input-bg)";
  };

  const INFO = [
    {
      icon: Mail,
      grad: "from-cyan-500 to-blue-500",
      glow: "rgba(34,211,238,0.35)",
      label: t("landing.contact.emailLabel", "Email"),
      value: t("footer.email", "contact@massarek.ma"),
      sub:   t("landing.contact.emailSub", ""),
    },
    {
      icon: Clock,
      grad: "from-sky-500 to-indigo-500",
      glow: "rgba(56,189,248,0.35)",
      label: t("landing.contact.replyLabel", "Fast Reply"),
      value: t("landing.contact.replyValue", "Within one business day"),
      sub:   t("landing.contact.replySub", ""),
    },
    {
      icon: ShieldCheck,
      grad: "from-indigo-500 to-violet-500",
      glow: "rgba(99,102,241,0.35)",
      label: t("landing.contact.supportLabel", "Trusted Support"),
      value: t("landing.contact.supportValue", "Premium guidance"),
      sub:   t("landing.contact.supportSub", "For students and partners"),
    },
  ];

  return (
    <section id="contact" className="relative overflow-hidden px-6 py-10 md:px-12 lg:py-16"
      style={{ background:"var(--ms-bg-layer1)" }}>

      {/* ambient */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80" style={{
        background:"radial-gradient(ellipse 65% 45% at 50% 0%,rgba(34,211,238,0.08),transparent)",
      }}/>
      <div className="pointer-events-none absolute right-14 top-28 h-40 w-40 rounded-full blur-3xl"
        style={{ background:"radial-gradient(circle,rgba(37,99,235,0.10),transparent)" }}/>
      <div className="pointer-events-none absolute left-8 bottom-20 h-32 w-32 rounded-full blur-3xl"
        style={{ background:"radial-gradient(circle,rgba(14,116,144,0.10),transparent)" }}/>

      <div className="relative mx-auto max-w-6xl">

        <motion.div initial="hidden" whileInView="visible" viewport={{once:true,amount:.3}}
          variants={sectionVariants} className="text-center mb-14">
          <span className="section-eyebrow inline-flex items-center gap-1.5 mb-4">
            <MessageSquare className="h-3 w-3"/>
            {t("landing.contact.badge","Contact")}
          </span>
          <h2 className="text-3xl font-display font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
            {t("landing.contact.title","Let's answer your questions")}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t("landing.contact.subtitle","Reach out if you need help getting started, want to learn more about our tools, or want a demo for students or partners.")}
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-start">

          {/* ── LEFT: info cards ── */}
          <motion.div initial={{opacity:0,x:-20}} whileInView={{opacity:1,x:0}}
            viewport={{once:true,amount:.3}} transition={{duration:.65,ease:[.22,1,.36,1]}}
            className="space-y-4"
          >
            <h3 className="text-xl font-display font-bold mb-2">
              {t("landing.contact.infoTitle","Talk to our team")}
            </h3>
            <p className="text-sm text-muted-foreground leading-6 mb-6">
              {t("landing.contact.infoSubtitle","Share your question and our student success team will reply quickly.")}
            </p>

            {INFO.map((item,i)=>(
              <motion.div key={i}
                initial={{opacity:0,x:-16}} whileInView={{opacity:1,x:0}}
                viewport={{once:true}} transition={{duration:.5,delay:i*.1}}
                className="group flex items-start gap-4 rounded-2xl p-4"
                style={{ background:"var(--ms-bg-card)", border:"1px solid var(--ms-border-subtle)", backdropFilter:"blur(10px)", transition:"border-color .22s" }}
                onMouseEnter={e=>(e.currentTarget as HTMLElement).style.borderColor="var(--ms-border-glow)"}
                onMouseLeave={e=>(e.currentTarget as HTMLElement).style.borderColor="var(--ms-border-subtle)"}
              >
                <div className={`flex-shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${item.grad} text-white mt-0.5`}
                  style={{ boxShadow:`0 0 14px ${item.glow}` }}>
                  <item.icon className="h-4 w-4"/>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] mb-0.5" style={{ color:"var(--ms-accent-cyan)" }}>
                    {item.label}
                  </p>
                  <p className="text-sm font-semibold">{item.value}</p>
                  {item.sub && <p className="text-xs text-muted-foreground mt-0.5">{item.sub}</p>}
                </div>
              </motion.div>
            ))}

            {/* map / location hint */}
            <motion.div
              initial={{opacity:0,x:-16}} whileInView={{opacity:1,x:0}}
              viewport={{once:true}} transition={{duration:.5,delay:.35}}
              className="flex items-center gap-3 rounded-2xl p-4"
              style={{ background:"var(--ms-bg-card)", border:"1px solid var(--ms-border-subtle)", backdropFilter:"blur(10px)" }}
            >
              <div className="flex-shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-400 text-white"
                style={{ boxShadow:"0 0 14px rgba(139,92,246,0.35)" }}>
                <MapPin className="h-4 w-4"/>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] mb-0.5" style={{ color:"var(--ms-accent-cyan)" }}>
                  {t("landing.contact.locationLabel", "Based in")}
                </p>
                <p className="text-sm font-semibold">{t("landing.contact.locationValue", "Morocco 🇲🇦")}</p>
              </div>
            </motion.div>
          </motion.div>

          {/* ── RIGHT: form card ── */}
          <motion.div initial={{opacity:0,x:20}} whileInView={{opacity:1,x:0}}
            viewport={{once:true,amount:.3}} transition={{duration:.65,ease:[.22,1,.36,1]}}
          >
            <div className="relative overflow-hidden rounded-2xl p-7 sm:p-8"
              style={{
                background:"var(--ms-bg-card)",
                border:"1px solid var(--ms-border-subtle)",
                backdropFilter:"blur(16px)",
                boxShadow:"var(--shadow-card)",
              }}
            >
              {/* top glow */}
              <div style={{ position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:"60%",height:1,background:"linear-gradient(90deg,transparent,#22D3EE,transparent)",opacity:.5 }}/>
              <div style={{ position:"absolute",top:-44,right:-44,width:160,height:160,borderRadius:"50%",background:"radial-gradient(circle,rgba(34,211,238,0.07),transparent 70%)",pointerEvents:"none" }}/>

              <div className="relative mb-6">
                <span className="section-eyebrow inline-flex items-center gap-1.5 mb-2">
                  <Sparkles className="h-3 w-3"/>
                  {t("landing.contact.formBadge","Send a Message")}
                </span>
                <h3 className="text-xl font-display font-bold">
                  {t("landing.contact.formTitle","Talk to our team")}
                </h3>
              </div>

              {sent ? (
                <motion.div initial={{opacity:0,scale:.95}} animate={{opacity:1,scale:1}}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 text-white mb-4"
                    style={{ boxShadow:"0 0 24px rgba(34,211,238,0.40)" }}>
                    <Send className="h-7 w-7"/>
                  </div>
                  <h4 className="text-lg font-bold mb-2">{t("landing.contact.successTitle","Message sent!")}</h4>
                  <p className="text-sm text-muted-foreground">{t("landing.contact.successText","We'll reply within one business day.")}</p>
                  <button onClick={()=>setSent(false)} className="mt-6 text-xs font-semibold" style={{ color:"var(--ms-accent-cyan)" }}>
                    {t("landing.contact.sendAnother","Send another message")} →
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="relative space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block mb-1.5 text-xs font-bold uppercase tracking-widest" style={{ color:"hsl(var(--muted-foreground))" }}>
                        {t("landing.contact.nameLabel","Your name")}
                      </label>
                      <input
                        name="name" type="text" required value={form.name} onChange={handleChange}
                        placeholder={t("landing.contact.namePlaceholder","Enter your name")}
                        style={iS} onFocus={iF} onBlur={iB}
                      />
                    </div>
                    <div>
                      <label className="block mb-1.5 text-xs font-bold uppercase tracking-widest" style={{ color:"hsl(var(--muted-foreground))" }}>
                        {t("landing.contact.emailInputLabel","Your email")}
                      </label>
                      <input
                        name="email" type="email" required value={form.email} onChange={handleChange}
                        placeholder={t("landing.contact.emailInputPlaceholder","Enter your email")}
                        style={iS} onFocus={iF} onBlur={iB}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1.5 text-xs font-bold uppercase tracking-widest" style={{ color:"hsl(var(--muted-foreground))" }}>
                      {t("landing.contact.messageLabel","Your message")}
                    </label>
                    <textarea
                      name="message" required value={form.message} onChange={handleChange}
                      placeholder={t("landing.contact.messagePlaceholder","Tell us what you'd like help with…")}
                      rows={5}
                      style={{ ...iS, resize:"vertical", minHeight:110 }}
                      onFocus={iF as any} onBlur={iB as any}
                    />
                  </div>

                  <motion.button
                    type="submit" disabled={isLoading}
                    whileHover={{y:-2,boxShadow:"0 0 44px rgba(34,211,238,0.42),0 14px 36px rgba(37,99,235,0.36)"}}
                    whileTap={{scale:.97}}
                    className="relative w-full overflow-hidden rounded-xl py-3.5 text-sm font-bold text-white disabled:opacity-50"
                    style={{
                      background:"linear-gradient(135deg,var(--ms-accent-blue),#0E7490)",
                      border:"1px solid var(--ms-border-glow)",
                      boxShadow:"0 0 28px rgba(34,211,238,0.22),0 8px 24px rgba(37,99,235,0.22),inset 0 1px 0 rgba(255,255,255,0.14)",
                      fontFamily:"'Sora',sans-serif",
                      transition:"box-shadow .25s,transform .2s",
                    }}
                  >
                    <motion.span className="absolute inset-0 pointer-events-none"
                      style={{ background:"linear-gradient(90deg,transparent,rgba(255,255,255,.13),transparent)" }}
                      animate={{x:["-100%","100%"]}} transition={{duration:2.4,repeat:Infinity,ease:"easeInOut",repeatDelay:.9}}
                    />
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isLoading ? t("landing.contact.sending","Sending…") : (
                        <>{t("landing.contact.submitButton","Send Message")} <Send className="h-4 w-4"/></>
                      )}
                    </span>
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
