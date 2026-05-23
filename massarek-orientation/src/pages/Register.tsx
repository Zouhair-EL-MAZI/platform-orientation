import { Link, useNavigate } from "react-router-dom";
import { CSSProperties, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { api } from "@/lib/api";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowLeft, Sparkles, Mail } from "lucide-react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import MassarekLogo from "@/components/MassarekLogo";
import GoogleButton from "@/components/GoogleButton";
import { auth, googleProvider } from "@/lib/firebase";
import { toast } from "@/hooks/use-toast";

/* ── strength ── */
const getStrength = (val: string) => {
  let score = 0;
  if (val.length >= 8)           score++;
  if (/[A-Z]/.test(val))        score++;
  if (/[0-9]/.test(val))        score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;
  return score;
};

const Register = () => {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [terms, setTerms] = useState(false);
  const [registrationCompleted, setRegistrationCompleted] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const strength = getStrength(password);
  const strengthLevels = [
    { label: t("auth.register.strengthWeak", "Faible"),   color:"#F87171", glow:"rgba(248,113,113,.5)" },
    { label: t("auth.register.strengthWeak", "Faible"),   color:"#F87171", glow:"rgba(248,113,113,.5)" },
    { label: t("auth.register.strengthFair", "Moyen"),    color:"#FBBF24", glow:"rgba(251,191,36,.5)"  },
    { label: t("auth.register.strengthStrong", "Fort ✓"), color:"#10B981", glow:"rgba(16,185,129,.5)"  },
  ];
  const strengthInfo = strengthLevels[Math.max(0, strength - 1)] ?? strengthLevels[0];
  const passwordsMatch = password && confirmPassword && password === confirmPassword;
  const [isLargeScreen, setIsLargeScreen] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth > 1280 : false
  );

  useEffect(() => {
    const update = () => setIsLargeScreen(window.innerWidth > 1280);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (resendCountdown <= 0) return;
    const timer = window.setInterval(() => setResendCountdown((current) => Math.max(0, current - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [resendCountdown]);

  const inputStyle = useMemo<CSSProperties>(() => ({
    width: "100%",
    borderRadius: 10,
    padding: isLargeScreen ? "12px 16px" : "10px 14px",
    fontSize: 13.5,
    outline: "none",
    background: "var(--ms-auth-input-bg)",
    border: "1px solid var(--ms-auth-input-border)",
    color: "hsl(var(--foreground))",
    fontFamily: "'Sora',sans-serif",
    transition: "all .2s",
  }), [isLargeScreen]);

  const titleFontSize = isLargeScreen ? 22 : 20;

  /* ── logic unchanged ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      toast({ title: t("auth.register.errorEmpty","Error"), description: t("auth.register.errorEmpty"), variant:"destructive" }); return;
    }
    if (password.length < 8) {
      toast({ title: t("auth.register.errorPasswordLength","Error"), description: t("auth.register.errorPasswordLength"), variant:"destructive" }); return;
    }
    if (!passwordsMatch) {
      toast({ title: t("auth.register.errorMismatch","Error"), description: t("auth.register.errorMismatch","Passwords do not match."), variant:"destructive" }); return;
    }
    setIsLoading(true);
    try {
      await api.post("/register", { name, email, password });
      setRegisteredEmail(email);
      setRegistrationCompleted(true);
      setResendCountdown(30);
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({ title: t("auth.register.errorTitle","Error"), description: error.response?.data?.message || t("auth.register.errorDescription"), variant:"destructive" });
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
      toast({ title: t("auth.register.successTitle","Success"), description: t("auth.register.successMessage","Logged in successfully") });
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Google register error:", error);
      toast({
        title: t("auth.register.failedTitle","Error"),
        description: axios.isAxiosError(error) ? error.response?.data?.message : t("auth.register.failedMessage","Unable to sign in with Google."),
        variant: "destructive",
      });
    } finally {
      setGoogleLoading(false);
    }
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
      <div className="relative hidden lg:block lg:w-[55%] xl:w-[50%] h-full overflow-hidden">

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
        className="relative flex w-full lg:w-[45%] xl:w-[50%] flex-col items-center justify-center overflow-hidden px-5 sm:px-8"
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
          className="relative z-10 w-full xl:max-w-[440px]" style={{ maxWidth:440 }}
        >
          <div className="flex justify-center mb-4 lg:hidden"><MassarekLogo size="lg"/></div>

          {/* ── card ── */}
          <div className="relative overflow-hidden rounded-2xl px-5 py-4 xl:px-7 xl:py-6 xl:min-h-[580px]"
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
                <Sparkles size={9}/> {t("auth.register.badge", "Orientation IA gratuite")}
              </div>
              <h2 style={{ fontSize:titleFontSize, fontWeight:800, letterSpacing:"-.03em", marginBottom:3, color:"hsl(var(--foreground))" }}>
                {t("auth.register.title")}
              </h2>
              <p style={{ fontSize:12.5, color:"hsl(var(--muted-foreground))" }}>{t("auth.register.subtitle")}</p>
            </div>

            {/* form */}
            {registrationCompleted ? (
              <div className="space-y-5">
                <div className="rounded-[28px] border border-cyan-300/15 bg-slate-900/80 p-6 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-cyan-500/10 text-cyan-300">
                    <Mail size={30} />
                  </div>
                  <h3 className="text-xl font-bold" style={{ color: "hsl(var(--foreground))" }}>{t("auth.register.verifyTitle", "Vérifiez votre email")}</h3>
                  <p className="mt-3 text-sm leading-6" style={{ color: "hsl(var(--muted-foreground))" }}>
                    {t("auth.register.verifyDesc", "Un lien de vérification a été envoyé à")}{" "}
                    <strong style={{ color: "hsl(var(--foreground))" }}>{registeredEmail}</strong>.
                    {" "}{t("auth.register.verifyDesc2", "Cliquez sur le lien pour activer votre compte.")}
                  </p>
                </div>

                <button type="button" onClick={async () => {
                  setResendLoading(true);
                  try {
                    await api.post("/resend-verification-email", { email: registeredEmail });
                    setResendCountdown(30);
                    toast({ title: "Email renvoyé", description: "Vérifiez votre boîte de réception.", });
                  } catch (error: any) {
                    toast({ title: "Erreur", description: error.response?.data?.message || "Impossible de renvoyer l'email.", variant: "destructive" });
                  } finally {
                    setResendLoading(false);
                  }
                }} disabled={resendLoading || resendCountdown > 0}
                  className="w-full rounded-xl py-3 text-sm font-bold text-white"
                  style={{
                    background: resendLoading || resendCountdown > 0 ? "rgba(51,65,85,0.9)" : "var(--ms-auth-button-bg)",
                    border: "1px solid var(--ms-auth-button-border)",
                    boxShadow: "var(--ms-auth-button-shadow)",
                    fontFamily: "'Sora',sans-serif",
                    opacity: resendLoading || resendCountdown > 0 ? 0.55 : 1,
                    cursor: resendLoading || resendCountdown > 0 ? "not-allowed" : "pointer",
                  }}
                >
                  {resendCountdown > 0 ? `${t("auth.register.resendCooldown", "Renvoyer")} (${resendCountdown}s)` : (resendLoading ? t("auth.register.resendLoading", "Envoi…") : t("auth.register.resendBtn", "Renvoyer l'email"))}
                </button>

                <p className="text-center text-xs text-slate-400">{t("auth.register.spamNote", "Pensez à vérifier vos spams.")}</p>
              </div>
            ) : (
              <>
                <form onSubmit={handleSubmit} className="space-y-2.5 xl:space-y-3.5">

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
                          background:i<=strength?strengthInfo.color:"var(--ms-bg-layer3,rgba(16,29,54,0.8))",
                          boxShadow:i<=strength?`0 0 5px ${strengthInfo.glow}`:"none",
                          transition:"all .35s",
                        }}/>
                      ))}
                    </div>
                    <p className="text-xs font-semibold mt-1" style={{ color:strengthInfo.color, letterSpacing:".04em" }}>
                      {strengthInfo.label}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block mb-1 text-xs font-bold uppercase tracking-widest"
                  style={{ color:"hsl(var(--muted-foreground))" }}>
                  {t("auth.register.confirmPasswordLabel", "Confirmer le mot de passe")}
                </label>
                <div className="relative">
                  <input type={showConfirm?"text":"password"} value={confirmPassword}
                    onChange={e=>setConfirmPassword(e.target.value)}
                    placeholder={t("auth.register.confirmPasswordPlaceholder", "Confirmez votre mot de passe")} required minLength={8}
                    style={{...inputStyle, paddingRight:44}} onFocus={onFocusIn} onBlur={onFocusOut}/>
                  <button type="button" onClick={()=>setShowConfirm(p=>!p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-200"
                    style={{ color:"hsl(var(--muted-foreground))" }}
                    onMouseEnter={e=>(e.currentTarget as HTMLElement).style.color="var(--ms-accent-sky)"}
                    onMouseLeave={e=>(e.currentTarget as HTMLElement).style.color="hsl(var(--muted-foreground))"}
                  >
                    {showConfirm?<EyeOff size={15}/>:<Eye size={15}/>}
                  </button>
                </div>
                {confirmPassword.length > 0 && (
                  <p className="mt-2 text-xs font-semibold" style={{ color: passwordsMatch ? "#10B981" : "#F87171" }}>
                    {passwordsMatch ? t("auth.register.matchMessage", "Mots de passe identiques ✓") : t("auth.register.mismatchMessage", "Les mots de passe ne correspondent pas")}
                  </p>
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
                  {t("auth.register.terms", "J'accepte les")}{" "}
                  <Link to="/terms" className="font-semibold" style={{ color:"var(--ms-accent-cyan)" }}
                    onMouseEnter={e=>(e.currentTarget as HTMLElement).style.color="var(--ms-accent-blue)"}
                    onMouseLeave={e=>(e.currentTarget as HTMLElement).style.color="var(--ms-accent-cyan)"}
                  >{t("auth.register.termsLink", "Conditions d'utilisation")}</Link>{" "}{t("auth.register.termsAnd", "et la")}{" "}
                  <Link to="/privacy" className="font-semibold" style={{ color:"var(--ms-accent-cyan)" }}
                    onMouseEnter={e=>(e.currentTarget as HTMLElement).style.color="var(--ms-accent-blue)"}
                    onMouseLeave={e=>(e.currentTarget as HTMLElement).style.color="var(--ms-accent-cyan)"}
                  >{t("auth.register.privacyLink", "Politique de confidentialité")}</Link>
                </label>
              </div>

              {/* CTA */}
              <motion.button type="submit" disabled={!terms || isLoading}
                whileHover={{ y:-2 }} whileTap={{ scale:.98 }}
                className="relative w-full overflow-hidden rounded-xl py-3 text-sm font-bold text-white"
                style={{
                  opacity: !terms ? 0.55 : 1,
                  cursor: !terms ? 'not-allowed' : 'pointer',
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

              <GoogleButton onClick={handleGoogleLogin} isLoading={googleLoading}/>

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
              </>
          )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
