import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import fr from "./locales/fr.json";
import ar from "./locales/ar.json";

const defaultLanguage = "en";
const savedLanguage = typeof window !== "undefined" ? localStorage.getItem("language") : null;
const initialLanguage = savedLanguage || defaultLanguage;

const setDirection = (language: string) => {
  if (typeof document !== "undefined") {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }
};

setDirection(initialLanguage);

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      ar: { translation: ar },
    },
    lng: initialLanguage,
    fallbackLng: defaultLanguage,
    supportedLngs: ["en", "fr", "ar"],
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

i18n.on("languageChanged", (lng) => {
  setDirection(lng);
  if (typeof localStorage !== "undefined") {
    localStorage.setItem("language", lng);
  }
});

export default i18n;
