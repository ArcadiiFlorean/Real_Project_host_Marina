import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import ro from './locales/ro.json';
import en from './locales/en.json';
import ru from './locales/ru.json';

i18n
  .use(LanguageDetector) // Detectează limba automат
  .use(initReactI18next)
  .init({
    resources: {
      ro: { translation: ro },
      en: { translation: en },
      ru: { translation: ru }
    },
    fallbackLng: 'ro', // Limba default
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'], // Ordinea detecției
      caches: ['localStorage'] // Salvează preferința
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;