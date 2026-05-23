import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { api } from "@/lib/api";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowLeft, Sparkles } from "lucide-react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import MassarekLogo from "@/components/MassarekLogo";
import GoogleButton from "@/components/GoogleButton";
import { auth, googleProvider } from "@/lib/firebase";
import { toast } from "@/hooks/use-toast";

const Login = () => {
  const { t } = useTranslation();
  const [email,    setEmail]     = useState("");
  const [password, setPassword]  = useState("");
  const [isLoading,setIsLoading] = useState(false);
  const [showPass, setShowPass]  = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [verificationError, setVerificationError] = useState("");
  const [resendVerificationLoading, setResendVerificationLoading] = useState(false);
  const navigate = useNavigate();

  /* ── logic unchanged ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: t("auth.login.errorEmpty","Error"), description: t("auth.login.errorEmpty"), variant:"destructive" });
      return;
    }
    setVerificationError("");
    setIsLoading(true);
    try {
      const response = await api.post("/login", { email, password, remember_me: rememberMe });
      const { user, token } = response.data;
      localStorage.setItem("user",  JSON.stringify(user));
      localStorage.setItem("token", token);
      toast({ title: t("auth.login.successTitle"), description: t("auth.login.successMessage") });
      const intended = localStorage.getItem("intendedDestination");
      if (intended) { localStorage.removeItem("intendedDestination"); navigate(intended); }
      else { navigate("/dashboard"); }
    } catch (error: unknown) {
      console.error("Login error:", error);
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        setVerificationError(error.response?.data?.message || "Please verify your email before logging in");
      } else {
        const message = axios.isAxiosError(error) ? error.response?.data?.message : undefined;
        toast({ title: t("auth.login.failedTitle"), description: message || t("auth.login.failedMessage"), variant:"destructive" });
      }
    } finally { setIsLoading(false); }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const idToken = credential?.idToken ?? await result.user.getIdToken();
      if (!idToken) {
        throw new Error("Unable to retrieve Google ID token.");
      }
      const response = await api.post("/auth/google", { token: idToken });
      const { user, token } = response.data;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      toast({ title: t("auth.login.successTitle"), description: t("auth.login.successMessage") });
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Google login error:", error);
      toast({
        title: t("auth.login.failedTitle"),
        description: axios.isAxiosError(error) ? error.response?.data?.message : t("auth.login.failedMessage"),
        variant: "destructive",
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  const iS: React.CSSProperties = {
    width:"100%", borderRadius:13, padding:"12px 14px", fontSize:14,
    lineHeight:1.5, minHeight:50,
    outline:"none", fontFamily:"'Sora',sans-serif", transition:"all .2s",
    background:"var(--ms-auth-input-bg)",
    border:"1px solid var(--ms-auth-input-border)",
    color:"hsl(var(--foreground))",
  };
  const iF = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "var(--ms-border-active)";
    e.target.style.boxShadow   = "0 0 0 3px var(--ms-accent-glow),0 0 12px var(--ms-accent-glow)";
    e.target.style.background  = "var(--ms-bg-card)";
  };
  const iB = (e: React.FocusEvent<HTMLInputElement>) => {
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

        {/* image */}
        <img
          src="/images/massarek-ai-hero.png"
          alt="Massarek AI"
          className="absolute inset-0 h-full w-full object-cover object-center"
          style={{ transform:"scale(1.04)" }}
        />

        {/* dark vignette overlay */}
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

        {/* bottom-left logo + tagline overlay */}
        <motion.div
          initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:.7, delay:.3 }}
          className="absolute bottom-8 left-8 z-10"
        >
          <MassarekLogo size="lg"/>
          <p className="mt-2 text-sm font-medium" style={{ color:"rgba(241,249,255,0.55)" }}>
            AI-Powered Academic Guidance
          </p>
        </motion.div>

        
      </div>

      {/* ═══════════════════════════════════════
          RIGHT — Form (45%)
          inherits global theme automatically
      ═══════════════════════════════════════ */}
      <div
        className="relative flex w-full lg:w-[45%] flex-col items-center justify-center overflow-y-visible px-5 sm:px-8"
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
          {/* mobile logo */}
          <div className="flex justify-center mb-5 lg:hidden">
            <MassarekLogo size="lg"/>
          </div>

          {/* ── glassmorphism card ── */}
          <div
            className="relative overflow-hidden rounded-3xl px-6 py-6"
            style={{
              background:"var(--ms-bg-card)",
              border:"1px solid var(--ms-border-subtle)",
              backdropFilter:"blur(24px)", WebkitBackdropFilter:"blur(24px)",
              boxShadow:"var(--shadow-card)",
            }}
          >
            {/* top glow line */}
            <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)",
              width:"60%", height:1, background:"linear-gradient(90deg,transparent,#22D3EE,transparent)", opacity:.5 }}/>
            {/* corner ambient */}
            <div style={{ position:"absolute", top:-44, right:-44, width:160, height:160, borderRadius:"50%",
              background:"radial-gradient(circle,rgba(34,211,238,0.07),transparent 70%)", pointerEvents:"none" }}/>

            {/* header */}
            <div className="mb-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-3"
                style={{ background:"rgba(34,211,238,0.07)", border:"1px solid rgba(34,211,238,0.20)", color:"#22D3EE", letterSpacing:".08em" }}>
                <motion.span style={{ width:5, height:5, borderRadius:"50%", background:"#22D3EE", boxShadow:"0 0 5px #22D3EE", display:"inline-block" }}
                  animate={{ opacity:[1,.5,1], scale:[1,.8,1] }} transition={{ duration:2, repeat:Infinity }}/>
                <Sparkles size={9}/> AI-Powered Platform
              </div>
              <h2 style={{ fontSize:22, fontWeight:800, letterSpacing:"-.03em", marginBottom:6, color:"hsl(var(--foreground))" }}>
                {t("auth.login.title")} {" "}
                <span style={{ background:"linear-gradient(90deg,#22D3EE,#38BDF8)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                  {t("auth.login.highlight","back")}
                </span>
              </h2>
              <p style={{ fontSize:15, lineHeight:1.6, color:"hsl(var(--muted-foreground))" }}>{t("auth.login.subtitle")}</p>
            </div>

            {/* form */}
            <form onSubmit={handleSubmit} className="space-y-3">

              <div>
                <label className="block mb-2 text-sm font-bold uppercase tracking-widest"
                  style={{ color:"hsl(var(--muted-foreground))" }}>
                  {t("auth.login.emailLabel")}
                </label>
                <input type="email" value={email}
                  onChange={e => { setEmail(e.target.value); setVerificationError(""); }}
                  placeholder={t("auth.login.emailPlaceholder")} required
                  style={iS} onFocus={iF} onBlur={iB}
                />
                <label className="block mb-2 text-sm font-bold uppercase tracking-widest mt-4"
                  style={{ color:"hsl(var(--muted-foreground))" }}>
                  {t("auth.login.passwordLabel")}
                </label>
                <div className="relative">
                  <input type={showPass ? "text" : "password"} value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder={t("auth.login.passwordPlaceholder")} required
                    style={{ ...iS, paddingRight: 44 }} onFocus={iF} onBlur={iB} />
                  <button type="button" onClick={()=>setShowPass(p=>!p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-200"
                    style={{ color:"hsl(var(--muted-foreground))" }}
                    onMouseEnter={e=>(e.currentTarget as HTMLElement).style.color="var(--ms-accent-sky)"}
                    onMouseLeave={e=>(e.currentTarget as HTMLElement).style.color="hsl(var(--muted-foreground))"}
                  >
                    {showPass?<EyeOff size={16}/>:<Eye size={16}/>}
                  </button>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <div onClick={() => setRememberMe(p => !p)}
                      className="w-4 h-4 rounded flex items-center justify-center transition-all duration-200"
                      style={{
                        background: rememberMe ? "linear-gradient(135deg,var(--ms-accent-blue),var(--ms-accent-cyan))" : "var(--ms-auth-input-bg)",
                        border: rememberMe ? "none" : "1.5px solid var(--ms-border-subtle)",
                        boxShadow: rememberMe ? "0 0 8px var(--ms-accent-glow-strong)" : "none",
                        borderRadius: 4,
                      }}
                    >
                      {rememberMe && <svg width="9" height="7" fill="none" viewBox="0 0 9 7"><path d="M1 3.5l2.5 2.5 4.5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </div>
                    <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                      {t("auth.login.rememberMe", "Se souvenir de moi")}
                    </span>
                  </label>
                  <Link to="/forgot-password" className="text-sm font-semibold transition-colors duration-200"
                    style={{ color:"var(--ms-accent-cyan)" }}
                    onMouseEnter={e=>(e.currentTarget as HTMLElement).style.color="var(--ms-accent-blue)"}
                    onMouseLeave={e=>(e.currentTarget as HTMLElement).style.color="var(--ms-accent-cyan)"}
                  >
                    {t("auth.login.forgot","Forgot password?")}
                  </Link>
                </div>
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
                  {isLoading ? t("auth.login.loading") : `${t("auth.login.submit")} →`}
                </span>
              </motion.button>

              {/* divider */}
              <div className="flex items-center gap-3 my-1">
                <div style={{ flex:1, height:1, background:"linear-gradient(90deg,transparent,var(--ms-border-glow))" }}/>
                <span style={{ fontSize:10, fontWeight:700, color:"hsl(var(--muted-foreground))", letterSpacing:".1em", textTransform:"uppercase" }}>
                  {t("common.or")}
                </span>
                <div style={{ flex:1, height:1, background:"linear-gradient(270deg,transparent,var(--ms-border-glow))" }}/>
              </div>

              <GoogleButton onClick={handleGoogleLogin} isLoading={googleLoading} />

            </form>

            {verificationError && (
              <div className="mt-4 rounded-3xl border border-red-300/20 bg-red-500/10 p-4 text-sm text-red-100">
                <p className="font-semibold">{verificationError}</p>
                <button type="button" onClick={async () => {
                  if (!email) return;
                  setResendVerificationLoading(true);
                  try {
                    await api.post("/resend-verification-email", { email });
                    toast({ title: "Email renvoyé", description: "Vérifiez votre boîte de réception.", });
                  } catch (error: any) {
                    toast({ title: "Erreur", description: error.response?.data?.message || "Impossible de renvoyer l'email.", variant: "destructive" });
                  } finally {
                    setResendVerificationLoading(false);
                  }
                }} disabled={resendVerificationLoading}
                  className="mt-3 inline-flex items-center rounded-full bg-slate-800 px-3 py-2 text-sm font-semibold text-cyan-300 transition hover:bg-slate-700 disabled:opacity-60"
                >
                  {resendVerificationLoading ? "Envoi…" : "Renvoyer l'email de vérification"}
                </button>
              </div>
            )}

            {/* switch */}
            <p className="text-center text-sm mt-4" style={{ color:"hsl(var(--muted-foreground))" }}>
              {t("auth.login.noAccount")}{" "}
              <Link to="/register" className="font-bold transition-colors duration-200"
                style={{ color:"var(--ms-accent-cyan)" }}
                onMouseEnter={e=>(e.currentTarget as HTMLElement).style.color="var(--ms-accent-blue)"}
                onMouseLeave={e=>(e.currentTarget as HTMLElement).style.color="var(--ms-accent-cyan)"}
              >
                {t("auth.login.signUpLink")}
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
