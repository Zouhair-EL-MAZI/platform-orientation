import { Link, useNavigate } from "react-router-dom";
import { Sparkles, FileQuestion, MessageSquare, Briefcase, ArrowRight, Compass, Target, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../hooks/use-auth";

const featureIcons = [Sparkles, FileQuestion, MessageSquare, Briefcase];

const Landing = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const features = t("landing.features", { returnObjects: true }) as Array<{ title: string; desc: string }>;
  const stats = t("landing.stats", { returnObjects: true }) as Array<{ value: string; label: string }>;
  const steps = t("landing.howItWorks.steps", { returnObjects: true }) as Array<{ title: string; desc: string }>;
  const aboutSection = t("landing.about", { returnObjects: true }) as { label: string; title: string; description: string; missionLabel: string; mission: string };
  const contactSection = t("landing.contact", { returnObjects: true }) as { label: string; title: string; description: string; emailLabel: string; email: string };

  const handleProtectedClick = (path: string) => {
    if (isAuthenticated) {
      navigate(path);
    } else {
      localStorage.setItem("intendedDestination", path);
      navigate("/login");
    }
  };

  return (
    <div className="bg-background">
      <section id="home" className="relative overflow-hidden px-6 md:px-12 pt-8 pb-28">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)", backgroundSize: "40px 40px" }} />
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-6 animate-fade-in">
            <Sparkles size={14} /> {t("landing.hero.label")}
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            {t("landing.hero.title")} <br />
            <span className="gradient-text">{t("landing.hero.highlight")}</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            {t("landing.hero.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <button onClick={() => handleProtectedClick("/test")} className="inline-flex items-center justify-center gap-2 gradient-primary text-primary-foreground font-semibold px-8 py-3.5 rounded-2xl hover:opacity-90 transition-opacity text-base shadow-elevated">
              {t("landing.hero.startTest")} <ArrowRight size={18} />
            </button>
            <button onClick={() => handleProtectedClick("/careers")} className="inline-flex items-center justify-center gap-2 border border-border bg-card font-semibold px-8 py-3.5 rounded-2xl hover:bg-accent transition-colors text-base">
              {t("landing.hero.exploreCareers")}
            </button>
          </div>
        </div>

        <div className="hidden lg:block absolute top-32 left-16 animate-float">
          <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center shadow-card">
            <Compass size={24} className="text-primary" />
          </div>
        </div>
        <div className="hidden lg:block absolute top-48 right-20 animate-float" style={{ animationDelay: "1s" }}>
          <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center shadow-card">
            <Target size={24} className="text-secondary" />
          </div>
        </div>
        <div className="hidden lg:block absolute bottom-20 right-32 animate-float" style={{ animationDelay: "2s" }}>
          <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center shadow-card">
            <TrendingUp size={24} className="text-primary" />
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 py-12 border-y border-border bg-card">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-bold gradient-text">{s.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="px-6 md:px-12 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("landing.featuresSection.title", "Everything you need to choose your future")}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t("landing.featuresSection.subtitle", "Our AI-powered platform provides comprehensive tools to help you make the best academic and career decisions.")}</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((f, index) => {
              const Icon = featureIcons[index];
              return (
                <div key={f.title} className="bg-card rounded-2xl p-6 border border-border shadow-card hover:shadow-elevated transition-shadow group">
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <Icon size={22} className="text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="px-6 md:px-12 py-20 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm uppercase tracking-[0.24em] text-primary font-semibold mb-3">{t("landing.howItWorks.label")}</p>
            <h2 className="text-3xl md:text-4xl font-bold">{t("landing.howItWorks.title")}</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title} className="rounded-3xl border border-border bg-card p-8 shadow-card hover:shadow-elevated transition-shadow">
                <div className="text-xl font-semibold text-primary mb-3">{t("common.step", "Step")} {index + 1}</div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="px-6 md:px-12 py-20">
        <div className="max-w-5xl mx-auto grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-primary font-semibold mb-3">{aboutSection.label}</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{aboutSection.title}</h2>
            <p className="text-muted-foreground text-lg leading-8">{aboutSection.description}</p>
          </div>
          <div className="rounded-3xl border border-border bg-card p-8 shadow-card">
            <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground mb-4">{aboutSection.missionLabel}</p>
            <p className="text-foreground leading-7">{aboutSection.mission}</p>
          </div>
        </div>
      </section>

      <section id="contact" className="px-6 md:px-12 py-20 bg-card">
        <div className="max-w-5xl mx-auto rounded-3xl border border-border bg-background p-10 shadow-card">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-primary font-semibold mb-3">{contactSection.label}</p>
              <h2 className="text-3xl md:text-4xl font-bold">{contactSection.title}</h2>
              <p className="text-muted-foreground mt-3 max-w-xl">{contactSection.description}</p>
            </div>
            <div className="rounded-2xl bg-primary px-6 py-5 text-primary-foreground shadow-elevated">
              <p className="text-sm uppercase tracking-[0.24em] font-semibold mb-2">{contactSection.emailLabel}</p>
              <a href={`mailto:${contactSection.email}`} className="text-lg font-semibold hover:underline">{contactSection.email}</a>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 py-20">
        <div className="max-w-3xl mx-auto gradient-primary rounded-3xl p-10 md:p-14 text-center text-primary-foreground">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("landing.cta.readyTitle")}</h2>
          <p className="opacity-90 mb-8 text-lg">{t("landing.cta.readySubtitle")}</p>
          <Link to="/register" className="inline-flex items-center gap-2 bg-card text-foreground font-semibold px-8 py-3.5 rounded-2xl hover:opacity-90 transition-opacity">
            {t("landing.cta.start")} <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;
