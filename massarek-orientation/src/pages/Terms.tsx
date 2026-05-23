import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import MassarekLogo from "@/components/MassarekLogo";

const Terms = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100" style={{ fontFamily: "'Sora',sans-serif" }}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(14,165,233,0.14),_transparent_28%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(56,189,248,0.12),_transparent_30%)]" />

      <Link to="/" className="fixed left-4 top-4 z-50 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/90 px-3 py-2 text-xs font-semibold text-slate-200 shadow-lg shadow-slate-900/30 transition hover:border-cyan-400 hover:text-cyan-300">
        <ArrowLeft size={14} /> Retour
      </Link>

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-6 py-16 sm:px-10 lg:px-16">
        <div className="rounded-[32px] border border-slate-800/80 bg-slate-950/95 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <div className="inline-flex items-center gap-3 rounded-3xl bg-cyan-500/10 px-4 py-3 text-cyan-200">
                <MassarekLogo size="md" />
                <span className="font-semibold">Massarek</span>
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight text-white">Conditions générales d'utilisation</h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
                  Ces conditions décrivent l'utilisation de Massarek, une plateforme d'orientation académique alimentée par l'IA.
                </p>
              </div>
            </div>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-cyan-300">Introduction</h2>
              <p className="text-sm leading-7 text-slate-300">
                Massarek est une plateforme d'orientation académique et professionnelle assistée par l'intelligence artificielle. Nous proposons des recommandations personnalisées pour aider les étudiants à choisir leurs parcours et à mieux préparer leur avenir.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-cyan-300">Acceptation des conditions</h2>
              <p className="text-sm leading-7 text-slate-300">
                En créant un compte et en utilisant Massarek, vous acceptez ces conditions générales. Vous vous engagez à utiliser la plateforme de manière responsable et conforme à la loi.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-cyan-300">Utilisation du service</h2>
              <p className="text-sm leading-7 text-slate-300">
                La plateforme est destinée aux étudiants et jeunes chercheurs de parcours scolaires ou professionnels. Toute utilisation abusive ou détournée du service est interdite.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-cyan-300">Compte utilisateur</h2>
              <p className="text-sm leading-7 text-slate-300">
                Vous êtes responsable de la confidentialité de vos identifiants et de toute activité réalisée avec votre compte. Ne partagez pas vos accès avec des tiers.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-cyan-300">Propriété intellectuelle</h2>
              <p className="text-sm leading-7 text-slate-300">
                Tous les contenus, designs, recommandations et algorithmes publiés sur Massarek restent la propriété exclusive de Massarek.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-cyan-300">Limitation de responsabilité</h2>
              <p className="text-sm leading-7 text-slate-300">
                Massarek fournit des conseils et des orientations uniquement à titre indicatif. Les résultats ne sont pas garantis et ne remplacent pas un accompagnement professionnel personnalisé.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-cyan-300">Modifications</h2>
              <p className="text-sm leading-7 text-slate-300">
                Nous pouvons mettre à jour ces conditions à tout moment. Les utilisateurs seront informés des changements via la plateforme ou par email.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-cyan-300">Contact</h2>
              <p className="text-sm leading-7 text-slate-300">
                Pour toute question relative aux conditions, contactez-nous à <span className="font-semibold text-cyan-200">contact@massarek.ma</span>.
              </p>
            </section>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Terms;
