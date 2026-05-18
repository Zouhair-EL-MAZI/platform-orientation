import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import MassarekLogo from "@/components/MassarekLogo";
import GoogleButton from "@/components/GoogleButton";
import { toast } from "@/hooks/use-toast";

const Login = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: t("auth.login.errorEmpty", "Error"),
        description: t("auth.login.errorEmpty"),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login", {
        email,
        password,
      });

      const { user, token } = response.data;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      toast({
        title: t("auth.login.successTitle"),
        description: t("auth.login.successMessage"),
      });

      // Check if there's an intended destination
      const intendedDestination = localStorage.getItem("intendedDestination");
      if (intendedDestination) {
        localStorage.removeItem("intendedDestination");
        navigate(intendedDestination);
      } else {
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: t("auth.login.failedTitle"),
        description: error.response?.data?.message || t("auth.login.failedMessage"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative px-4 py-10 sm:px-6 lg:px-8 overflow-hidden bg-background">
      <Link to="/" className="absolute left-6 top-6 z-20">
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/85 dark:bg-slate-900/75 border border-slate-200/70 dark:border-slate-700/70 text-slate-900 dark:text-slate-100 shadow-sm transition backdrop-blur-md hover:bg-white dark:hover:bg-slate-800">
          <span className="text-xl">←</span>
          <span className="text-sm font-semibold">{t("common.returnHome")}</span>
        </div>
      </Link>

      <div className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, -10, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-28 -top-24 w-[520px] h-[520px] rounded-full bg-gradient-to-br from-sky-400/12 to-indigo-500/10 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, 18, 0], y: [0, 6, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-32 -bottom-24 w-[420px] h-[420px] rounded-full bg-gradient-to-br from-cyan-400/10 to-sky-500/8 blur-3xl"
        />
        <div className="absolute inset-x-0 top-16 h-56 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.25),transparent_50%)] opacity-70" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[min(100%,520px)] p-8 rounded-[2.5rem] border border-white/20 bg-[rgba(255,255,255,0.72)] dark:border-slate-700/60 dark:bg-[rgba(15,23,42,0.64)] backdrop-blur-[28px] shadow-[0_35px_90px_-45px_rgba(56,189,248,0.35)] sm:p-10"
      >
        <div className="flex flex-col items-center text-center mb-4">
          <div className="flex items-center justify-center mb-4">
            <MassarekLogo size="lg" />
          </div>
          <h1 className="text-2xl font-bold">{t("auth.login.title")}</h1>
          <p className="text-muted-foreground text-sm mt-2">{t("auth.login.subtitle")}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label mb-2 block text-sm">{t("auth.login.emailLabel")}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("auth.login.emailPlaceholder")}
              className="w-full rounded-2xl border border-slate-200/70 bg-white/85 dark:border-slate-700/60 dark:bg-slate-900/75 px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-400/30 transition"
              required
            />
          </div>
          <div>
            <label className="form-label mb-2 block text-sm">{t("auth.login.passwordLabel")}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("auth.login.passwordPlaceholder")}
              className="w-full rounded-2xl border border-slate-200/70 bg-white/85 dark:border-slate-700/60 dark:bg-slate-900/75 px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-400/30 transition"
              required
            />
            <div className="text-right mt-2">
              <Link to="/forgot" className="text-sm text-muted-foreground hover:underline">{t("auth.login.forgot", "Forgot password?")}</Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-400 px-4 py-3 text-sm font-semibold text-white shadow-[0_20px_45px_-20px_rgba(56,189,248,0.48)] transition hover:opacity-95 disabled:opacity-50"
            >
              {isLoading ? t("auth.login.loading") : t("auth.login.submit")}
            </button>
          </div>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gradient-to-b from-white/5 to-white/3 text-muted-foreground">{t("common.or")}</span>
          </div>
        </div>

        <GoogleButton />

        <p className="text-center text-sm text-muted-foreground mt-6">
          {t("auth.login.noAccount")} <Link to="/register" className="text-primary font-medium hover:underline">{t("auth.login.signUpLink")}</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;

