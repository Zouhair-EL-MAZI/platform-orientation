import { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { api } from "@/lib/api";
import MassarekLogo from "@/components/MassarekLogo";

type Status = "loading" | "success" | "error";

const VerifyEmail = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) { setStatus("error"); setMessage(t("auth.verify.noToken", "Token manquant.")); return; }

    api.post("/verify-email", { token })
      .then(() => {
        localStorage.setItem("email_verified", "1");
        setStatus("success");
        setTimeout(() => window.close(), 2000);
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err.response?.data?.message || t("auth.verify.errorMsg", "Lien invalide ou expiré."));
      });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--ms-bg-base)", fontFamily: "'Sora',sans-serif" }}>

      {/* ambient */}
      <div className="pointer-events-none fixed inset-0">
        <div style={{ position:"absolute", width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle,#2563EB,transparent 70%)", top:-100, right:-80, filter:"blur(80px)", opacity:.10 }}/>
        <div style={{ position:"absolute", width:300, height:300, borderRadius:"50%", background:"radial-gradient(circle,#0891b2,transparent 70%)", bottom:-60, left:-60, filter:"blur(80px)", opacity:.08 }}/>
      </div>

      <motion.div
        initial={{ opacity:0, y:24, scale:.97 }}
        animate={{ opacity:1, y:0, scale:1 }}
        transition={{ duration:.55, ease:[.22,1,.36,1] }}
        className="relative z-10 w-full" style={{ maxWidth:440 }}
      >
        <div className="flex justify-center mb-6">
          <Link to="/"><MassarekLogo size="lg"/></Link>
        </div>

        <div className="relative overflow-hidden rounded-2xl px-8 py-10 text-center"
          style={{
            background:"var(--ms-bg-card)",
            border:"1px solid var(--ms-border-subtle)",
            backdropFilter:"blur(24px)",
            boxShadow:"var(--shadow-card)",
          }}
        >
          <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)", width:"60%", height:1, background:"linear-gradient(90deg,transparent,#22D3EE,transparent)", opacity:.5 }}/>

          {status === "loading" && (
            <>
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl" style={{ background:"rgba(34,211,238,0.08)", border:"1px solid rgba(34,211,238,0.2)" }}>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration:1, repeat:Infinity, ease:"linear" }}
                  className="w-7 h-7 rounded-full border-2 border-transparent"
                  style={{ borderTopColor:"#22D3EE", borderRightColor:"rgba(34,211,238,0.3)" }}
                />
              </div>
              <h2 style={{ fontSize:20, fontWeight:800, color:"hsl(var(--foreground))", marginBottom:8 }}>
                {t("auth.verify.loading", "Vérification en cours...")}
              </h2>
              <p style={{ fontSize:14, color:"hsl(var(--muted-foreground))" }}>
                {t("auth.verify.loadingDesc", "Veuillez patienter quelques secondes.")}
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <motion.div
                initial={{ scale:0 }} animate={{ scale:1 }}
                transition={{ type:"spring", stiffness:200, damping:15 }}
                className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl"
                style={{ background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.25)" }}
              >
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="15" stroke="#10B981" strokeWidth="1.5"/>
                  <path d="M9 16.5l4.5 4.5 9-9" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-4"
                style={{ background:"rgba(16,185,129,0.08)", border:"1px solid rgba(16,185,129,0.2)", color:"#10B981" }}>
                ✓ {t("auth.verify.verified", "Compte vérifié")}
              </div>
              <h2 style={{ fontSize:22, fontWeight:800, color:"hsl(var(--foreground))", marginBottom:8, letterSpacing:"-.03em" }}>
                {t("auth.verify.successTitle", "Email vérifié avec succès !")}
              </h2>
              <p style={{ fontSize:14, color:"hsl(var(--muted-foreground))", lineHeight:1.7, marginBottom:24 }}>
                {t("auth.verify.successDesc", "Votre compte est actif. Cet onglet va se fermer automatiquement.")}
              </p>
              <p style={{ fontSize:13, color:"hsl(var(--muted-foreground))", marginBottom:24 }}>
                {t("auth.verify.closing", "Fermeture dans")} <strong style={{ color:"#10B981" }}>2s</strong>...
              </p>
              <Link to="/login">
                <motion.div
                  whileHover={{ y:-2 }} whileTap={{ scale:.98 }}
                  className="inline-flex items-center justify-center w-full rounded-xl py-3 text-sm font-bold text-white cursor-pointer"
                  style={{ background:"var(--ms-auth-button-bg)", border:"1px solid var(--ms-auth-button-border)", boxShadow:"var(--ms-auth-button-shadow)" }}
                >
                  {t("auth.verify.goLogin", "Se connecter →")}
                </motion.div>
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <motion.div
                initial={{ scale:0 }} animate={{ scale:1 }}
                transition={{ type:"spring", stiffness:200, damping:15 }}
                className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl"
                style={{ background:"rgba(248,113,113,0.1)", border:"1px solid rgba(248,113,113,0.25)" }}
              >
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="15" stroke="#F87171" strokeWidth="1.5"/>
                  <path d="M11 11l10 10M21 11l-10 10" stroke="#F87171" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </motion.div>
              <h2 style={{ fontSize:22, fontWeight:800, color:"hsl(var(--foreground))", marginBottom:8, letterSpacing:"-.03em" }}>
                {t("auth.verify.errorTitle", "Lien invalide ou expiré")}
              </h2>
              <p style={{ fontSize:14, color:"hsl(var(--muted-foreground))", lineHeight:1.7, marginBottom:32 }}>
                {message || t("auth.verify.errorDesc", "Ce lien de vérification est invalide ou a expiré. Veuillez en demander un nouveau.")}
              </p>
              <Link to="/register">
                <motion.div
                  whileHover={{ y:-2 }} whileTap={{ scale:.98 }}
                  className="inline-flex items-center justify-center w-full rounded-xl py-3 text-sm font-bold text-white cursor-pointer"
                  style={{ background:"var(--ms-auth-button-bg)", border:"1px solid var(--ms-auth-button-border)", boxShadow:"var(--ms-auth-button-shadow)" }}
                >
                  {t("auth.verify.goRegister", "Retour à l'inscription →")}
                </motion.div>
              </Link>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
