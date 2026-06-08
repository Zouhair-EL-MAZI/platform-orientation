import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "@/lib/api";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";
import MassarekLogo from "@/components/MassarekLogo";
import { toast } from "@/hooks/use-toast";

const ForgotPassword = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({ title: t("auth.forgot.errorEmpty", "Error"), description: t("auth.forgot.errorEmpty"), variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      await api.post("/forgot-password", { email });
      setSent(true);
      toast({ title: t("auth.forgot.successTitle", "Reset link sent"), description: t("auth.forgot.successMessage", "Reset link sent to your email") });
    } catch (error: any) {
      console.error("Forgot password error:", error);
      toast({
        title: t("auth.forgot.errorTitle", "Error"),
        description: error.response?.data?.message || t("auth.forgot.errorDescription", "Email not found."),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex h-screen w-full overflow-hidden" style={{ fontFamily: "'Sora',sans-serif" }}>
      <Link to="/" className="fixed left-4 top-4 z-50 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-200"
        style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)", color: "hsl(var(--muted-foreground))", backdropFilter: "blur(16px)" }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--ms-border-glow)"; (e.currentTarget as HTMLElement).style.color = "var(--ms-accent-sky)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--ms-border-subtle)"; (e.currentTarget as HTMLElement).style.color = "hsl(var(--muted-foreground))"; }}
      >
        <ArrowLeft size={12} /> {t("common.returnHome")}
      </Link>

      <div className="relative hidden lg:block lg:w-[55%] h-full overflow-hidden">
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

      <div className="relative flex w-full lg:w-[45%] xl:w-[50%] flex-col items-center justify-center overflow-hidden px-5 sm:px-8" style={{ background: "var(--ms-bg-base)" }}>
        <div className="pointer-events-none absolute inset-0">
          <div style={{ position: "absolute", width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle,#2563EB,transparent 70%)", top: -120, right: -80, filter: "blur(76px)", opacity: .12 }} />
          <div style={{ position: "absolute", width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle,#0891b2,transparent 70%)", bottom: -50, left: -50, filter: "blur(76px)", opacity: .10 }} />
        </div>

        <motion.div initial={{ opacity: 0, y: 22, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: .55, ease: [.22, 1, .36, 1] }} className="relative z-10 w-full" style={{ maxWidth: 400 }}>
          <div className="flex justify-center mb-4 lg:hidden"><MassarekLogo size="lg" /></div>

          <div className="relative overflow-hidden rounded-2xl px-5 py-6" style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", boxShadow: "var(--shadow-card)" }}>
            <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "60%", height: 1, background: "linear-gradient(90deg,transparent,#22D3EE,transparent)", opacity: .5 }} />
            <div style={{ position: "absolute", top: -44, right: -44, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle,rgba(34,211,238,0.07),transparent 70%)", pointerEvents: "none" }} />

            <div className="mb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-2" style={{ background: "rgba(34,211,238,0.07)", border: "1px solid rgba(34,211,238,0.20)", color: "#22D3EE", letterSpacing: ".08em" }}>
                <motion.span style={{ width: 5, height: 5, borderRadius: "50%", background: "#22D3EE", boxShadow: "0 0 5px #22D3EE", display: "inline-block" }} animate={{ opacity: [1, .5, 1], scale: [1, .8, 1] }} transition={{ duration: 2, repeat: Infinity }} />
                <Sparkles size={9} /> Reset password
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-.03em", marginBottom: 3, color: "hsl(var(--foreground))" }}>
                {t("auth.forgot.title", "Forgot password")}
              </h2>
              <p style={{ fontSize: 12.5, color: "hsl(var(--muted-foreground))" }}>{t("auth.forgot.subtitle", "Enter your email and we will send you a reset link.")}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 text-xs font-bold uppercase tracking-widest" style={{ color: "hsl(var(--muted-foreground))" }}>
                  {t("auth.forgot.emailLabel", "Email")}
                </label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={t("auth.forgot.emailPlaceholder", "you@example.com")} required style={inputStyle} onFocus={onFocusIn} onBlur={onFocusOut} />
              </div>

              <motion.button type="submit" disabled={isLoading} whileHover={{ y: -2 }} whileTap={{ scale: .98 }} className="relative w-full overflow-hidden rounded-xl py-3 text-sm font-bold text-white disabled:opacity-50" style={{ background: "var(--ms-auth-button-bg)", border: "1px solid var(--ms-auth-button-border)", boxShadow: "var(--ms-auth-button-shadow)", fontFamily: "'Sora',sans-serif" }}>
                <motion.span className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,.13),transparent)" }} animate={{ x: ["-100%", "100%"] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", repeatDelay: .8 }} />
                <span className="relative z-10">{isLoading ? t("auth.forgot.loading", "Sending…") : t("auth.forgot.submit", "Send reset link")}</span>
              </motion.button>
            </form>

            {sent && (
              <div className="mt-4 rounded-2xl border border-green-300/30 bg-green-500/10 p-3 text-sm text-emerald-700" style={{ color: "#0f766e" }}>
                {t("auth.forgot.sentMessage", "Reset link sent to your email.")}
              </div>
            )}

            <p className="text-center text-xs mt-4" style={{ color: "hsl(var(--muted-foreground))" }}>
              {t("auth.forgot.remembered", "Remembered your password?")} <button type="button" className="font-bold transition-colors duration-200" style={{ color: "var(--ms-accent-cyan)" }} onClick={() => navigate("/login")} onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--ms-accent-blue)"} onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--ms-accent-cyan)"}>{t("auth.forgot.signInLink", "Sign in")}</button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
