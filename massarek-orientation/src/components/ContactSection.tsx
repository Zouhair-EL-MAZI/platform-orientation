import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { api } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

const ContactSection = () => {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [messageError, setMessageError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateInputs = () => {
    let valid = true;
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (trimmedName.length < 2) {
      setNameError(
        trimmedName.length === 0
          ? t("landing.contactForm.nameErrorRequired", "Name is required.")
          : t("landing.contactForm.nameErrorMin", "Name must be at least 2 characters.")
      );
      valid = false;
    } else {
      setNameError("");
    }

    if (trimmedEmail.length === 0) {
      setEmailError(t("landing.contactForm.emailErrorRequired", "Email is required."));
      valid = false;
    } else if (!emailPattern.test(trimmedEmail)) {
      setEmailError(t("landing.contactForm.emailErrorInvalid", "Enter a valid email address."));
      valid = false;
    } else {
      setEmailError("");
    }

    if (trimmedMessage.length < 5) {
      setMessageError(
        trimmedMessage.length === 0
          ? t("landing.contactForm.messageErrorRequired", "Message is required.")
          : t("landing.contactForm.messageErrorMin", "Message must be at least 5 characters.")
      );
      valid = false;
    } else {
      setMessageError("");
    }

    return valid;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) return;

    if (!validateInputs()) {
      toast({
        title: t("landing.contactForm.errorValidationTitle", "Please fix the form errors"),
        description: t("landing.contactForm.errorMessage", "Fill in your name, email, and message before sending."),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post("/contact/send", {
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      });

      toast({
        title: t("landing.contactForm.successTitle", "Message sent"),
        description: t("landing.contactForm.successMessage", "We'll get back to you shortly."),
      });
      setName("");
      setEmail("");
      setMessage("");
      setNameError("");
      setEmailError("");
      setMessageError("");
    } catch (error) {
      console.error("Contact send error:", error);
      toast({
        title: t("landing.contactForm.errorSubmitTitle", "Unable to send your message"),
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
      className="relative overflow-hidden px-6 md:px-12 py-16" style={{background:"var(--ms-bg-layer1)"}}
    >
      <div className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-sky-500/12 blur-3xl" />
      <div className="pointer-events-none absolute left-0 top-24 h-56 w-56 rounded-full bg-cyan-400/12 blur-3xl" />
      <div className="max-w-6xl mx-auto grid gap-10 xl:grid-cols-[0.95fr_1.05fr] items-center">
        <div className="space-y-6">
          <p className="section-eyebrow">
            {t("landing.contact.label")}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold">
            {t("landing.contact.title")}
          </h2>
          <p className="text-base leading-8 text-muted-foreground max-w-xl">
            {t("landing.contact.description")}
          </p>
          <div className="rounded-2xl p-8 glass-card">
            <div className="space-y-4">
              <div>
                <p className="section-eyebrow mb-2">
                  {t("landing.contact.emailLabel")}
                </p>
                <a href={`mailto:${t("landing.contact.email")}`} className="text-xl font-bold transition" style={{color:"var(--ms-accent-sky)"}}>
                  {t("landing.contact.email")}
                </a>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl p-4" style={{background:"var(--ms-bg-layer2)",border:"1px solid var(--ms-border-subtle)"}}>
                  <p className="text-[11px] uppercase tracking-[0.15em] font-bold mb-2" style={{color:"var(--ms-accent-cyan)"}}>{t("landing.contactForm.fastReply", "Fast reply")}</p>
                  <p className="text-sm text-foreground dark:text-slate-100">{t("landing.contactForm.fastReplyDesc", "We respond within one business day.")}</p>
                </div>
                <div className="rounded-2xl p-4" style={{background:"var(--ms-bg-layer2)",border:"1px solid var(--ms-border-subtle)"}}>
                  <p className="text-[11px] uppercase tracking-[0.15em] font-bold mb-2" style={{color:"var(--ms-accent-cyan)"}}>{t("landing.contactForm.support", "Trusted support")}</p>
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
          className="relative overflow-hidden rounded-2xl p-8 glass-card"
        >
          <div className="mb-8 text-center">
            <p className="section-eyebrow mb-2">
              {t("landing.contactForm.sectionLabel")}
            </p>
            <h3 className="text-2xl font-bold">
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
                  onChange={(event) => { setName(event.target.value); if (nameError) setNameError(""); }}
                  placeholder={t("landing.contactForm.namePlaceholder")}
                  className="h-14 rounded-2xl px-4 text-sm outline-none transition" style={{background:"var(--ms-bg-layer2)",border:"1px solid var(--ms-border-subtle)",color:"hsl(var(--foreground))"}}
                />
                {nameError ? <span className="text-xs text-destructive mt-1">{nameError}</span> : null}
              </label>
              <label className="flex flex-col gap-2 text-sm text-foreground">
                <span className="font-medium">{t("landing.contactForm.emailLabel")}</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => { setEmail(event.target.value); if (emailError) setEmailError(""); }}
                  placeholder={t("landing.contactForm.emailPlaceholder")}
                  className="h-14 rounded-2xl px-4 text-sm outline-none transition" style={{background:"var(--ms-bg-layer2)",border:"1px solid var(--ms-border-subtle)",color:"hsl(var(--foreground))"}}
                />
                {emailError ? <span className="text-xs text-destructive mt-1">{emailError}</span> : null}
              </label>
            </div>

            <label className="flex flex-col gap-2 text-sm text-foreground">
              <span className="font-medium">{t("landing.contactForm.messageLabel")}</span>
              <textarea
                value={message}
                onChange={(event) => { setMessage(event.target.value); if (messageError) setMessageError(""); }}
                placeholder={t("landing.contactForm.messagePlaceholder")}
                rows={6}
                className="min-h-[170px] rounded-2xl px-4 py-4 text-sm outline-none transition" style={{background:"var(--ms-bg-layer2)",border:"1px solid var(--ms-border-subtle)",color:"hsl(var(--foreground))"}}
              />
              {messageError ? <span className="text-xs text-destructive mt-1">{messageError}</span> : null}
            </label>

            <button
              type="submit"
              disabled={isSubmitting || name.trim().length < 2 || !emailPattern.test(email.trim()) || message.trim().length < 10}
              className="inline-flex w-full items-center justify-center rounded-2xl px-6 py-4 text-sm font-bold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 glow-pulse"
              style={{background:"linear-gradient(135deg,var(--ms-accent-blue),#0E7490)",border:"1px solid var(--ms-border-glow)",boxShadow:"0 0 24px var(--ms-accent-glow-strong)"}}
            >
              {isSubmitting ? t("landing.contactForm.sending", "Sending...") : t("landing.contactForm.sendButton")}
            </button>
          </form>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ContactSection;
