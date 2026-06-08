import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff, Sparkles } from "lucide-react";
import MassarekLogo from "@/components/MassarekLogo";
import { toast } from "@/hooks/use-toast";

const ResetPassword = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      toast({ title: t("auth.reset.errorTitle", "Invalid token"), description: t("auth.reset.errorMissingToken", "Reset token is missing from the URL."), variant: "destructive" });
    }
  }, [token, t]);

  const inputStyle: React.CSSProperties = {
    width: "100%",
    borderRadius: 10,
    padding: "10px 14px",
    fontSize: 13.5,
    outline: "none",
    background: "var(--ms-auth-input-bg)",
    border: "1px solid var(--ms-auth-input-border)",
    color: "hsl(var(--foreground))",
    fontFamily: "'Sora',sans-serif",
    transition: "all .2s",
  };

  const onFocusIn = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "var(--ms-border-active)";
    e.target.style.boxShadow = "0 0 0 3px var(--ms-accent-glow),0 0 12px var(--ms-accent-glow)";
    e.target.style.background = "var(--ms-bg-card)";
  };

  const onFocusOut = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "var(--ms-auth-input-border)";
    e.target.style.boxShadow = "none";
    e.target.style.background = "var(--ms-auth-input-bg)";
  };

  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (!password || !confirmPassword) {
      toast({ title: t("auth.reset.errorEmpty", "Error"), description: t("auth.reset.errorEmpty", "Please complete both fields."), variant: "destructive" });
      return;
    }
    if (password.length < 8) {
      toast({ title: t("auth.reset.errorPasswordLength", "Error"), description: t("auth.reset.errorPasswordLength", "Password must be at least 8 characters."), variant: "destructive" });
      return;
    }
    if (!passwordsMatch) {
      toast({ title: t("auth.reset.errorMismatch", "Error"), description: t("auth.reset.errorMismatch", "Passwords do not match."), variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      await api.post("/reset-password", {
        token,
        password,
        password_confirmation: confirmPassword,
      });
      setResetComplete(true);
      toast({ title: t("auth.reset.successTitle", "Password reset"), description: t("auth.reset.successMessage", "Your password has been updated. Please sign in."), });
      setTimeout(() => navigate("/login"), 1800);
    } catch (error: any) {
      console.error("Reset password error:", error);
      toast({ title: t("auth.reset.errorTitle", "Error"), description: error.response?.data?.message || t("auth.reset.errorDescription", "Unable to reset password."), variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex h-screen w-full overflow-hidden" style={{ fontFamily: "'Sora',sans-serif" }}>
      <Link to="/" className="fixed left-4 top-4 z-50 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs sm:text-sm font-semibold transition-all duration-200"
        style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)", color: "hsl(var(--muted-foreground))", backdropFilter: "blur(16px)" }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--ms-border-glow)"; (e.currentTarget as HTMLElement).style.color = "var(--ms-accent-sky)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--ms-border-subtle)"; (e.currentTarget as HTMLElement).style.color = "hsl(var(--muted-foreground))"; }}
      >
        <ArrowLeft size={14} /> <span className="hidden sm:inline">{t("common.returnHome")}</span>
      </Link>

      <div className="relative hidden md:block md:w-[48%] lg:w-[55%] h-full overflow-hidden">
        <img src="/images/massarek-ai-hero.png" alt="Massarek AI" className="absolute inset-0 h-full w-full object-cover object-center" style={{ transform: "scale(1.04)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(5,8,22,0.18) 0%, transparent 40%, rgba(5,8,22,0.55) 100%)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-40" style={{ background: "linear-gradient(to top, rgba(2,132,199,0.12) 0%, rgba(34,211,238,0.06) 25%, transparent 60%)" }} />
        <div className="absolute top-0 left-0 right-0 h-24" style={{ background: "linear-gradient(to bottom, rgba(5,8,22,0.40), transparent)" }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 45% at 35% 50%, rgba(34,211,238,0.09), transparent 70%)" }} />
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .3 }} className="absolute bottom-8 left-8 z-10">
          <MassarekLogo size="lg" />
          <p className="mt-2 text-sm font-medium" style={{ color: "rgba(241,249,255,0.55)" }}>
            Academic Guidance
          </p>
        </motion.div>
      </div>

      <div className="relative flex w-full md:w-[52%] lg:w-[45%] xl:w-[50%] flex-col items-center justify-center overflow-hidden px-4 sm:px-6 md:px-8 lg:px-12" style={{ background: "var(--ms-bg-base)" }}>
        <div className="pointer-events-none absolute inset-0">
          <div style={{ position: "absolute", width: "clamp(240px, 50vw, 360px)", height: "clamp(240px, 50vw, 360px)", borderRadius: "50%", background: "radial-gradient(circle,#2563EB,transparent 70%)", top: "clamp(-80px, -20vw, -120px)", right: "clamp(-60px, -15vw, -80px)", filter: "blur(76px)", opacity: .12 }} />
          <div style={{ position: "absolute", width: "clamp(200px, 40vw, 280px)", height: "clamp(200px, 40vw, 280px)", borderRadius: "50%", background: "radial-gradient(circle,#0891b2,transparent 70%)", bottom: "clamp(-30px, -10vw, -50px)", left: "clamp(-30px, -10vw, -50px)", filter: "blur(76px)", opacity: .10 }} />
        </div>

        <motion.div initial={{ opacity: 0, y: 22, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: .55, ease: [.22, 1, .36, 1] }} className="relative z-10 w-full" style={{ maxWidth: "100%", width: "100%" }}>
          <div className="flex justify-center mb-4 md:mb-6 lg:hidden"><MassarekLogo size="lg" /></div>

          <div className="relative overflow-hidden rounded-2xl px-4 sm:px-6 py-6 sm:py-8" style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", boxShadow: "var(--shadow-card)" }}>
            <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "60%", height: 1, background: "linear-gradient(90deg,transparent,#22D3EE,transparent)", opacity: .5 }} />
            <div style={{ position: "absolute", top: -44, right: -44, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle,rgba(34,211,238,0.07),transparent 70%)", pointerEvents: "none" }} />

            <div className="mb-5 sm:mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-3 sm:mb-4" style={{ background: "rgba(34,211,238,0.07)", border: "1px solid rgba(34,211,238,0.20)", color: "#22D3EE", letterSpacing: ".08em" }}>
                <motion.span style={{ width: 5, height: 5, borderRadius: "50%", background: "#22D3EE", boxShadow: "0 0 5px #22D3EE", display: "inline-block" }} animate={{ opacity: [1, .5, 1], scale: [1, .8, 1] }} transition={{ duration: 2, repeat: Infinity }} />
                <Sparkles size={9} /> Reset password
              </div>
              <h2 style={{ fontSize: "clamp(18px, 5vw, 24px)", fontWeight: 800, letterSpacing: "-.03em", marginBottom: 3, color: "hsl(var(--foreground))" }}>
                {t("auth.reset.title", "Reset your password")}
              </h2>
              <p style={{ fontSize: "clamp(12px, 4vw, 14px)", color: "hsl(var(--muted-foreground))" }}>{t("auth.reset.subtitle", "Enter a new password so you can sign in again.")}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div>
                <label className="block mb-2 text-xs sm:text-sm font-bold uppercase tracking-widest" style={{ color: "hsl(var(--muted-foreground))" }}>
                  {t("auth.reset.passwordLabel", "New password")}
                </label>
                <div className="relative">
                  <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder={t("auth.reset.passwordPlaceholder", "********")} required minLength={8} style={{ ...inputStyle, paddingRight: 44 }} onFocus={onFocusIn} onBlur={onFocusOut} />
                  <button type="button" onClick={() => setShowPass(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-200" style={{ color: "hsl(var(--muted-foreground))" }} onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--ms-accent-sky)"} onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "hsl(var(--muted-foreground))"}>
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block mb-2 text-xs sm:text-sm font-bold uppercase tracking-widest" style={{ color: "hsl(var(--muted-foreground))" }}>
                  {t("auth.reset.confirmPasswordLabel", "Confirm password")}
                </label>
                <div className="relative">
                  <input type={showConfirm ? "text" : "password"} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder={t("auth.reset.confirmPasswordPlaceholder", "********")} required minLength={8} style={{ ...inputStyle, paddingRight: 44 }} onFocus={onFocusIn} onBlur={onFocusOut} />
                  <button type="button" onClick={() => setShowConfirm(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-200" style={{ color: "hsl(var(--muted-foreground))" }} onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--ms-accent-sky)"} onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "hsl(var(--muted-foreground))"}>
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {confirmPassword.length > 0 && (
                  <p className="mt-2 text-xs font-semibold" style={{ color: passwordsMatch ? "#10B981" : "#F87171" }}>
                    {passwordsMatch ? t("auth.reset.matchMessage", "Passwords match ✓") : t("auth.reset.mismatchMessage", "Passwords do not match")}
                  </p>
                )}
              </div>

              <motion.button type="submit" disabled={isLoading || !token} whileHover={{ y: -2 }} whileTap={{ scale: .98 }} className="relative w-full overflow-hidden rounded-xl py-3 text-sm font-bold text-white disabled:opacity-50" style={{ background: "var(--ms-auth-button-bg)", border: "1px solid var(--ms-auth-button-border)", boxShadow: "var(--ms-auth-button-shadow)", fontFamily: "'Sora',sans-serif" }}>
                <motion.span className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,.13),transparent)" }} animate={{ x: ["-100%", "100%"] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", repeatDelay: .8 }} />
                <span className="relative z-10">{isLoading ? t("auth.reset.loading", "Resetting…") : t("auth.reset.submit", "Reset password")}</span>
              </motion.button>
            </form>

            {resetComplete && (
              <div className="mt-4 sm:mt-5 rounded-2xl border border-sky-300/30 bg-sky-500/10 p-3 sm:p-4 text-xs sm:text-sm text-sky-700" style={{ color: "#0c4a6e" }}>
                {t("auth.reset.completeMessage", "Password updated successfully. Redirecting to login...")}
              </div>
            )}

            <p className="text-center text-xs sm:text-sm mt-5 sm:mt-6" style={{ color: "hsl(var(--muted-foreground))" }}>
              {t("auth.reset.remembered", "Remembered your password?")} <Link to="/login" className="font-bold transition-colors duration-200" style={{ color: "var(--ms-accent-cyan)" }} onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--ms-accent-blue)"} onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--ms-accent-cyan)"}>{t("auth.reset.signInLink", "Sign in")}</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPassword;
