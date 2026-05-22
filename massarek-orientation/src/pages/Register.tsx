import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowLeft, Sparkles } from "lucide-react";
import MassarekLogo from "@/components/MassarekLogo";
import GoogleButton from "@/components/GoogleButton";
import { toast } from "@/hooks/use-toast";

/* ── strength ── */
const getStrength = (val: string) => {
  let score = 0;
  if (val.length >= 8)           score++;
  if (/[A-Z]/.test(val))        score++;
  if (/[0-9]/.test(val))        score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;
  const levels = [
    { label:"Too weak",  color:"#F87171", glow:"rgba(248,113,113,.5)"  },
    { label:"Weak",      color:"#F87171", glow:"rgba(248,113,113,.5)"  },
    { label:"Fair",      color:"#FBBF24", glow:"rgba(251,191,36,.5)"   },
    { label:"Strong ✓",  color:"#10B981", glow:"rgba(16,185,129,.5)"   },
  ];
  return { score, ...(levels[Math.max(0, score - 1)] ?? levels[0]) };
};

const Register = () => {
  const { t } = useTranslation();
  const [name,    setName]      = useState("");
  const [email,   setEmail]     = useState("");
  const [password,setPassword]  = useState("");
  const [isLoading,setIsLoading]= useState(false);
  const [showPass, setShowPass] = useState(false);
  const [terms,   setTerms]     = useState(false);
  const navigate = useNavigate();
  const strength = getStrength(password);

  /* ── logic unchanged ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast({ title: t("auth.register.errorEmpty","Error"), description: t("auth.register.errorEmpty"), variant:"destructive" }); return;
    }
    if (password.length < 8) {
      toast({ title: t("auth.register.errorPasswordLength","Error"), description: t("auth.register.errorPasswordLength"), variant:"destructive" }); return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/register", { name, email, password });
      toast({ title: t("auth.register.successTitle"), description: t("auth.register.successMessage") });
      localStorage.setItem("user",  JSON.stringify(response.data.user));
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({ title: t("auth.register.errorTitle","Error"), description: error.response?.data?.message || t("auth.register.errorDescription"), variant:"destructive" });
    } finally { setIsLoading(false); }
  };

  const inputStyle: React.CSSProperties = {
    width:"100%", borderRadius:10, padding:"10px 14px", fontSize:13.5,
    outline:"none", background:"var(--ms-auth-input-bg)",
    border:"1px solid var(--ms-auth-input-border)",
    color:"hsl(var(--foreground))", fontFamily:"'Sora',sans-serif", transition:"all .2s",
  };
  const onFocusIn = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "var(--ms-border-active)";
    e.target.style.boxShadow   = "0 0 0 3px var(--ms-accent-glow),0 0 12px var(--ms-accent-glow)";
    e.target.style.background  = "var(--ms-bg-card)";
  };
  const onFocusOut = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "var(--ms-auth-input-border)";
    e.target.style.boxShadow   = "none";
    e.target.style.background  = "var(--ms-auth-input-bg)";
  };

  return (
    <div className="relative flex h-screen w-full overflow-hidden" style={{ fontFamily:"'Sora',sans-serif" }}>

      {/* ── fixed: Return to Home ── */}
      <Link to="/"
        className="fixed left-4 top-4 z-50 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-200"
        style={{ background:"var(--ms-bg-card)", border:"1px solid var(--ms-border-subtle)", color:"hsl(var(--muted-foreground))", backdropFilter:"blur(16px)" }}
        onMouseEnter={e=>{ (e.currentTarget as HTMLElement).style.borderColor="var(--ms-border-glow)"; (e.currentTarget as HTMLElement).style.color="var(--ms-accent-sky)"; }}
        onMouseLeave={e=>{ (e.currentTarget as HTMLElement).style.borderColor="var(--ms-border-subtle)"; (e.currentTarget as HTMLElement).style.color="hsl(var(--muted-foreground))"; }}
      >
        <ArrowLeft size={12}/> {t("common.returnHome")}
      </Link>

      {/* ═══════════════════════════════════════
          LEFT — AI illustration (55%)
      ═══════════════════════════════════════ */}
      <div className="relative hidden lg:block lg:w-[55%] h-full overflow-hidden">

        <img
          src="/images/massarek-ai-hero.png"
          alt="Massarek AI"
          className="absolute inset-0 h-full w-full object-cover object-center"
          style={{ transform:"scale(1.04)" }}
        />

        {/* overlays */}
        <div className="absolute inset-0" style={{
          background:"linear-gradient(to right, rgba(5,8,22,0.18) 0%, transparent 40%, rgba(5,8,22,0.55) 100%)",
        }}/>
        {/* enhanced bottom gradient with cinematic depth */}
        <div className="absolute bottom-0 left-0 right-0 h-40" style={{
          background:"linear-gradient(to top, rgba(2,132,199,0.12) 0%, rgba(34,211,238,0.06) 25%, transparent 60%)",
        }}/>
        {/* top fade with subtle blue tint */}
        <div className="absolute top-0 left-0 right-0 h-24" style={{
          background:"linear-gradient(to bottom, rgba(5,8,22,0.40), transparent)",
        }}/>
        {/* soft cyan atmosphere layer */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background:"radial-gradient(ellipse 60% 45% at 35% 50%, rgba(34,211,238,0.09), transparent 70%)",
        }}/>

        {/* bottom-left logo */}
        <motion.div
          initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:.7, delay:.3 }}
          className="absolute bottom-8 left-8 z-10"
        >
          <MassarekLogo size="lg"/>
          <p className="mt-2 text-sm font-medium" style={{ color:"rgba(241,249,255,0.55)" }}>
            Academic Guidance
          </p>
        </motion.div>

        
      </div>

      {/* ═══════════════════════════════════════
          RIGHT — Register form (45%)
          inherits global theme automatically
      ═══════════════════════════════════════ */}
      <div
        className="relative flex w-full lg:w-[45%] flex-col items-center justify-center overflow-hidden px-5 sm:px-8"
        style={{ background:"var(--ms-bg-base)" }}
      >
        {/* soft ambient for right panel (light/dark aware opacity) */}
        <div className="pointer-events-none absolute inset-0">
          <div style={{ position:"absolute", width:360, height:360, borderRadius:"50%",
            background:"radial-gradient(circle,#2563EB,transparent 70%)",
            top:-120, right:-80, filter:"blur(76px)", opacity:.12 }}/>
          <div style={{ position:"absolute", width:280, height:280, borderRadius:"50%",
            background:"radial-gradient(circle,#0891b2,transparent 70%)",
            bottom:-50, left:-50, filter:"blur(76px)", opacity:.10 }}/>
        </div>

        <motion.div
          initial={{ opacity:0, y:22, scale:.97 }}
          animate={{ opacity:1, y:0,  scale:1   }}
          transition={{ duration:.55, ease:[.22,1,.36,1] }}
          className="relative z-10 w-full" style={{ maxWidth:400 }}
        >
          <div className="flex justify-center mb-4 lg:hidden"><MassarekLogo size="lg"/></div>

          {/* ── card ── */}
          <div className="relative overflow-hidden rounded-2xl px-6 py-5"
            style={{
              background:"var(--ms-bg-card)",
              border:"1px solid var(--ms-border-subtle)",
              backdropFilter:"blur(24px)", WebkitBackdropFilter:"blur(24px)",
              boxShadow:"var(--shadow-card)",
            }}
          >
            {/* top glow */}
            <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)",
              width:"60%", height:1, background:"linear-gradient(90deg,transparent,#22D3EE,transparent)", opacity:.5 }}/>
            <div style={{ position:"absolute", top:-44, right:-44, width:160, height:160, borderRadius:"50%",
              background:"radial-gradient(circle,rgba(34,211,238,0.07),transparent 70%)", pointerEvents:"none" }}/>

            {/* header */}
            <div className="mb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-2"
                style={{ background:"rgba(34,211,238,0.07)", border:"1px solid rgba(34,211,238,0.20)", color:"#22D3EE", letterSpacing:".08em" }}>
                <motion.span style={{ width:5, height:5, borderRadius:"50%", background:"#22D3EE", boxShadow:"0 0 5px #22D3EE", display:"inline-block" }}
                  animate={{ opacity:[1,.5,1], scale:[1,.8,1] }} transition={{ duration:2, repeat:Infinity }}/>
                <Sparkles size={9}/> No credit card needed
              </div>
              <h2 style={{ fontSize:20, fontWeight:800, letterSpacing:"-.03em", marginBottom:3, color:"hsl(var(--foreground))" }}>
                {t("auth.register.title")}{" "}
                <span style={{ background:"linear-gradient(90deg,#22D3EE,#38BDF8)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                  {t("auth.register.highlight","journey")}
                </span>
              </h2>
              <p style={{ fontSize:12.5, color:"hsl(var(--muted-foreground))" }}>{t("auth.register.subtitle")}</p>
            </div>

            {/* form */}
            <form onSubmit={handleSubmit} className="space-y-2.5">

              {/* Name */}
              <div>
                <label className="block mb-1 text-xs font-bold uppercase tracking-widest"
                  style={{ color:"hsl(var(--muted-foreground))" }}>
                  {t("auth.register.nameLabel")}
                </label>
                <input type="text" value={name} onChange={e=>setName(e.target.value)}
                  placeholder={t("auth.register.namePlaceholder")} required
                  style={inputStyle} onFocus={onFocusIn} onBlur={onFocusOut}/>
              </div>

              {/* Email */}
              <div>
                <label className="block mb-1 text-xs font-bold uppercase tracking-widest"
                  style={{ color:"hsl(var(--muted-foreground))" }}>
                  {t("auth.register.emailLabel")}
                </label>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
                  placeholder={t("auth.register.emailPlaceholder")} required
                  style={inputStyle} onFocus={onFocusIn} onBlur={onFocusOut}/>
              </div>

              {/* Password */}
              <div>
                <label className="block mb-1 text-xs font-bold uppercase tracking-widest"
                  style={{ color:"hsl(var(--muted-foreground))" }}>
                  {t("auth.register.passwordLabel")}
                </label>
                <div className="relative">
                  <input type={showPass?"text":"password"} value={password}
                    onChange={e=>setPassword(e.target.value)}
                    placeholder={t("auth.register.passwordPlaceholder")} required minLength={8}
                    style={{...inputStyle, paddingRight:44}} onFocus={onFocusIn} onBlur={onFocusOut}/>
                  <button type="button" onClick={()=>setShowPass(p=>!p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-200"
                    style={{ color:"hsl(var(--muted-foreground))" }}
                    onMouseEnter={e=>(e.currentTarget as HTMLElement).style.color="var(--ms-accent-sky)"}
                    onMouseLeave={e=>(e.currentTarget as HTMLElement).style.color="hsl(var(--muted-foreground))"}
                  >
                    {showPass?<EyeOff size={15}/>:<Eye size={15}/>}
                  </button>
                </div>
                {password.length > 0 && (
                  <div className="mt-1.5">
                    <div className="flex gap-1.5">
                      {[1,2,3,4].map(i=>(
                        <div key={i} style={{
                          flex:1, height:3, borderRadius:100,
                          background:i<=strength.score?strength.color:"var(--ms-bg-layer3,rgba(16,29,54,0.8))",
                          boxShadow:i<=strength.score?`0 0 5px ${strength.glow}`:"none",
                          transition:"all .35s",
                        }}/>
                      ))}
                    </div>
                    <p className="text-xs font-semibold mt-1" style={{ color:strength.color, letterSpacing:".04em" }}>
                      {strength.label}
                    </p>
                  </div>
                )}
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2.5 pt-0.5">
                <div className="relative flex-shrink-0 mt-0.5">
                  <input type="checkbox" id="terms" checked={terms}
                    onChange={e=>setTerms(e.target.checked)} className="sr-only"/>
                  <div onClick={()=>setTerms(p=>!p)}
                    className="w-4 h-4 rounded cursor-pointer flex items-center justify-center transition-all duration-200"
                    style={{
                      background:terms?"linear-gradient(135deg,var(--ms-accent-blue),var(--ms-accent-cyan))":"var(--ms-bg-layer1)",
                      border:terms?"none":"1.5px solid var(--ms-border-subtle)",
                      boxShadow:terms?"0 0 8px var(--ms-accent-glow-strong)":"none",
                      borderRadius:4,
                    }}
                  >
                    {terms&&<svg width="9" height="7" fill="none" viewBox="0 0 9 7"><path d="M1 3.5l2.5 2.5 4.5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                </div>
                <label htmlFor="terms" className="text-xs cursor-pointer leading-snug"
                  style={{ color:"hsl(var(--muted-foreground))" }}
                  onClick={()=>setTerms(p=>!p)}>
                  {t("auth.register.terms","I agree to the")}{" "}
                  <a href="#" style={{ color:"var(--ms-accent-cyan)", fontWeight:700 }}
                    onMouseEnter={e=>(e.currentTarget as HTMLElement).style.color="var(--ms-accent-blue)"}
                    onMouseLeave={e=>(e.currentTarget as HTMLElement).style.color="var(--ms-accent-cyan)"}
                  >Terms of Service</a>{" & "}
                  <a href="#" style={{ color:"var(--ms-accent-cyan)", fontWeight:700 }}
                    onMouseEnter={e=>(e.currentTarget as HTMLElement).style.color="var(--ms-accent-blue)"}
                    onMouseLeave={e=>(e.currentTarget as HTMLElement).style.color="var(--ms-accent-cyan)"}
                  >Privacy Policy</a>
                </label>
              </div>

              {/* CTA */}
              <motion.button type="submit" disabled={isLoading}
                whileHover={{ y:-2 }} whileTap={{ scale:.98 }}
                className="relative w-full overflow-hidden rounded-xl py-3 text-sm font-bold text-white disabled:opacity-50"
                style={{
                  background:"var(--ms-auth-button-bg)",
                  border:"1px solid var(--ms-auth-button-border)",
                  boxShadow:"var(--ms-auth-button-shadow)",
                  fontFamily:"'Sora',sans-serif",
                }}
              >
                <motion.span className="absolute inset-0 pointer-events-none"
                  style={{ background:"linear-gradient(90deg,transparent,rgba(255,255,255,.13),transparent)" }}
                  animate={{ x:["-100%","100%"] }}
                  transition={{ duration:2.4, repeat:Infinity, ease:"easeInOut", repeatDelay:.8 }}
                />
                <span className="relative z-10">
                  {isLoading ? t("auth.register.loading") : `${t("auth.register.submit")} →`}
                </span>
              </motion.button>

              {/* divider */}
              <div className="flex items-center gap-3">
                <div style={{ flex:1, height:1, background:"linear-gradient(90deg,transparent,var(--ms-border-glow))" }}/>
                <span style={{ fontSize:10, fontWeight:700, color:"hsl(var(--muted-foreground))", letterSpacing:".1em", textTransform:"uppercase" }}>
                  {t("common.or")}
                </span>
                <div style={{ flex:1, height:1, background:"linear-gradient(270deg,transparent,var(--ms-border-glow))" }}/>
              </div>

              <GoogleButton/>

            </form>

            {/* switch */}
            <p className="text-center text-xs mt-3" style={{ color:"hsl(var(--muted-foreground))" }}>
              {t("auth.register.alreadyAccount")}{" "}
              <Link to="/login" className="font-bold transition-colors duration-200"
                style={{ color:"var(--ms-accent-cyan)" }}
                onMouseEnter={e=>(e.currentTarget as HTMLElement).style.color="var(--ms-accent-blue)"}
                onMouseLeave={e=>(e.currentTarget as HTMLElement).style.color="var(--ms-accent-cyan)"}
              >
                {t("auth.register.signInLink")}
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
