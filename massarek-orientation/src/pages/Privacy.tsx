import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import MassarekLogo from "@/components/MassarekLogo";

const Privacy = () => {
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
                <h1 className="text-3xl font-black tracking-tight text-white">Politique de confidentialité</h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
                  Notre engagement à protéger vos données personnelles lorsque vous utilisez Massarek.
                </p>
              </div>
            </div>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-cyan-300">Introduction</h2>
              <p className="text-sm leading-7 text-slate-300">
                Nous nous engageons à traiter vos informations avec le plus grand soin et à assurer la confidentialité de vos données.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-cyan-300">Données collectées</h2>
              <p className="text-sm leading-7 text-slate-300">
                Nous collectons votre nom, adresse email, résultats de tests et préférences de carrière afin de personnaliser l'expérience sur la plateforme.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-cyan-300">Utilisation des données</h2>
              <p className="text-sm leading-7 text-slate-300">
                Ces données sont utilisées pour personnaliser les recommandations, améliorer le service et envoyer des communications pertinentes.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-cyan-300">Partage des données</h2>
              <p className="text-sm leading-7 text-slate-300">
                Vos informations ne sont pas vendues. Elles peuvent être partagées uniquement avec des services de confiance pour l'hébergement et l'envoi d'emails.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-cyan-300">Sécurité</h2>
              <p className="text-sm leading-7 text-slate-300">
                Les données sont chiffrées et stockées de manière sécurisée afin de protéger votre vie privée.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-cyan-300">Droits de l'utilisateur</h2>
              <p className="text-sm leading-7 text-slate-300">
                Vous avez le droit d'accéder, modifier ou supprimer vos données en contactant notre support.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-cyan-300">Cookies</h2>
              <p className="text-sm leading-7 text-slate-300">
                Nous utilisons des cookies uniquement pour la gestion de session et l'amélioration de l'expérience utilisateur.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-cyan-300">Contact</h2>
              <p className="text-sm leading-7 text-slate-300">
                Pour toute question relative à la confidentialité, écrivez-nous à <span className="font-semibold text-cyan-200">privacy@massarek.ma</span>.
              </p>
            </section>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Privacy;
