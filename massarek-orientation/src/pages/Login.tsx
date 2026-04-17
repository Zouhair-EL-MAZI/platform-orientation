import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import MassarekLogo from "@/components/MassarekLogo";
import GoogleButton from "@/components/GoogleButton";
import LanguageSwitcher from "@/components/LanguageSwitcher";
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
    <div className="bg-background px-4 py-16 min-h-[calc(100vh-96px)]">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <div className="mx-auto flex w-full max-w-md flex-col gap-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <MassarekLogo size="lg" />
          </div>
          <h1 className="text-2xl font-bold">{t("auth.login.title")}</h1>
          <p className="text-muted-foreground text-sm mt-2">{t("auth.login.subtitle")}</p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-8 shadow-card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-2 block">{t("auth.login.emailLabel")}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("auth.login.emailPlaceholder")}
                className="w-full rounded-2xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">{t("auth.login.passwordLabel")}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("auth.login.passwordPlaceholder")}
                className="w-full rounded-2xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all"
                required
              />
            </div>
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? t("auth.login.loading") : t("auth.login.submit")}
              </button>
            </div>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground">{t("common.or")}</span>
            </div>
          </div>

          <GoogleButton />
        </div>

        <p className="text-center text-sm text-muted-foreground">
          {t("auth.login.noAccount")} <Link to="/register" className="text-primary font-medium hover:underline">{t("auth.login.signUpLink")}</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

