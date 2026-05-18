import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import MassarekLogo from "@/components/MassarekLogo";
import GoogleButton from "@/components/GoogleButton";
import { toast } from "@/hooks/use-toast";

const Register = () => {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast({
        title: t("auth.register.errorEmpty", "Error"),
        description: t("auth.register.errorEmpty"),
        variant: "destructive",
      });
      return;
    }

    if (password.length < 8) {
      toast({
        title: t("auth.register.errorPasswordLength", "Error"),
        description: t("auth.register.errorPasswordLength"),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/register", {
        name,
        email,
        password,
      });

      toast({
        title: t("auth.register.successTitle"),
        description: t("auth.register.successMessage"),
      });

      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("token", response.data.token);

      navigate("/dashboard");
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: t("auth.register.errorTitle", "Error"),
        description: error.response?.data?.message || t("auth.register.errorDescription"),
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
          animate={{ x: [0, 20, 0], y: [0, -12, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-28 -top-16 w-[520px] h-[520px] rounded-full bg-gradient-to-br from-cyan-400/12 to-sky-500/10 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, 10, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-32 -bottom-24 w-[420px] h-[420px] rounded-full bg-gradient-to-br from-slate-200/35 to-sky-400/10 blur-3xl"
        />
        <div className="absolute inset-x-0 top-14 h-44 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.24),transparent_55%)] opacity-75" />
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
          <h1 className="text-2xl font-bold">{t("auth.register.title")}</h1>
          <p className="text-muted-foreground text-sm mt-2">{t("auth.register.subtitle")}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label mb-2 block text-sm">{t("auth.register.nameLabel")}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("auth.register.namePlaceholder")}
              className="w-full rounded-2xl border border-slate-200/70 bg-white/85 dark:border-slate-700/60 dark:bg-slate-900/75 px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-400/30 transition"
              required
            />
          </div>
          <div>
            <label className="form-label mb-2 block text-sm">{t("auth.register.emailLabel")}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("auth.register.emailPlaceholder")}
              className="w-full rounded-2xl border border-slate-200/70 bg-white/85 dark:border-slate-700/60 dark:bg-slate-900/75 px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-400/30 transition"
              required
            />
          </div>
          <div>
            <label className="form-label mb-2 block text-sm">{t("auth.register.passwordLabel")}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("auth.register.passwordPlaceholder")}
              className="w-full rounded-2xl border border-slate-200/70 bg-white/85 dark:border-slate-700/60 dark:bg-slate-900/75 px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-400/30 transition"
              required
              minLength={8}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-400 px-4 py-3 text-sm font-semibold text-white shadow-[0_20px_45px_-20px_rgba(56,189,248,0.48)] transition hover:opacity-95 disabled:opacity-50"
            >
              {isLoading ? t("auth.register.loading") : t("auth.register.submit")}
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
          {t("auth.register.alreadyAccount")} <Link to="/login" className="text-primary font-medium hover:underline">{t("auth.register.signInLink")}</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;

