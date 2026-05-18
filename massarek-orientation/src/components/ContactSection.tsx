import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { toast } from "@/hooks/use-toast";

const ContactSection = () => {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      toast({
        title: t("landing.contactForm.errorTitle", "Please complete all fields"),
        description: t("landing.contactForm.errorMessage", "Fill in your name, email, and message before sending."),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 700));
      toast({
        title: t("landing.contactForm.successTitle", "Message sent"),
        description: t("landing.contactForm.successMessage", "We’ll get back to you shortly."),
      });
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      toast({
        title: t("landing.contactForm.errorTitle", "Submission failed"),
        description: t("landing.contactForm.errorNetwork", "Please try again later."),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.section
      id="contact"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="relative overflow-hidden px-6 md:px-12 py-16 bg-[linear-gradient(180deg,rgba(241,248,255,0.94),rgba(236,245,255,0.82))] dark:bg-[linear-gradient(180deg,rgba(9,19,35,0.92),rgba(15,23,42,0.88))]"
    >
      <div className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-sky-500/12 blur-3xl" />
      <div className="pointer-events-none absolute left-0 top-24 h-56 w-56 rounded-full bg-cyan-400/12 blur-3xl" />
      <div className="max-w-6xl mx-auto grid gap-10 xl:grid-cols-[0.95fr_1.05fr] items-center">
        <div className="space-y-6">
          <p className="text-sm uppercase tracking-[0.3em] text-primary font-semibold">
            {t("landing.contact.label")}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            {t("landing.contact.title")}
          </h2>
          <p className="text-base leading-8 text-muted-foreground max-w-xl">
            {t("landing.contact.description")}
          </p>
          <div className="rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-card backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70">
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-sky-500 font-semibold mb-2">
                  {t("landing.contact.emailLabel")}
                </p>
                <a href={`mailto:${t("landing.contact.email")}`} className="text-xl font-semibold text-foreground hover:text-sky-500 transition">
                  {t("landing.contact.email")}
                </a>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-50/95 p-4 border border-slate-200 shadow-sm backdrop-blur-sm dark:bg-slate-900/85 dark:border-slate-700">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400 mb-2">{t("landing.contactForm.fastReply", "Fast reply")}</p>
                  <p className="text-sm text-foreground dark:text-slate-100">{t("landing.contactForm.fastReplyDesc", "We respond within one business day.")}</p>
                </div>
                <div className="rounded-3xl bg-slate-50/95 p-4 border border-slate-200 shadow-sm backdrop-blur-sm dark:bg-slate-900/85 dark:border-slate-700">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400 mb-2">{t("landing.contactForm.support", "Trusted support")}</p>
                  <p className="text-sm text-foreground dark:text-slate-100">{t("landing.contactForm.supportDesc", "Premium guidance for students and partners.")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          whileHover={{ y: -4, scale: 1.001 }}
          className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white/95 p-8 shadow-card backdrop-blur-3xl dark:border-white/10 dark:bg-slate-950/90"
        >
          <div className="mb-8 text-center">
            <p className="text-sm uppercase tracking-[0.28em] text-sky-500 font-semibold mb-2">
              {t("landing.contactForm.sectionLabel")}
            </p>
            <h3 className="text-2xl font-semibold text-foreground">
              {t("landing.contactForm.title")}
            </h3>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              {t("landing.contactForm.subtitle")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm text-foreground">
                <span className="font-medium">{t("landing.contactForm.nameLabel")}</span>
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder={t("landing.contactForm.namePlaceholder")}
                  className="h-14 rounded-3xl border border-slate-200 bg-slate-50/95 px-4 text-sm text-foreground shadow-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 dark:border-slate-800 dark:bg-slate-900/90 dark:text-white"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-foreground">
                <span className="font-medium">{t("landing.contactForm.emailLabel")}</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={t("landing.contactForm.emailPlaceholder")}
                  className="h-14 rounded-3xl border border-slate-200 bg-slate-50/95 px-4 text-sm text-foreground shadow-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 dark:border-slate-800 dark:bg-slate-900/90 dark:text-white"
                />
              </label>
            </div>

            <label className="flex flex-col gap-2 text-sm text-foreground">
              <span className="font-medium">{t("landing.contactForm.messageLabel")}</span>
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder={t("landing.contactForm.messagePlaceholder")}
                rows={6}
                className="min-h-[170px] rounded-[2rem] border border-slate-200 bg-slate-50/95 px-4 py-4 text-sm text-foreground shadow-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 dark:border-slate-800 dark:bg-slate-900/90 dark:text-white"
              />
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center rounded-3xl bg-gradient-to-r from-sky-500 to-cyan-400 px-6 py-4 text-sm font-semibold text-white shadow-[0_20px_50px_-25px_rgba(56,189,248,0.85)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_60px_-30px_rgba(56,189,248,0.9)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? t("landing.contactForm.sending") : t("landing.contactForm.sendButton")}
            </button>
          </form>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ContactSection;
