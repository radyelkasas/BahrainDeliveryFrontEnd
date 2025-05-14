import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import enTranslation from '../locales/en.json';
import arTranslation from '../locales/ar.json';

// Set up i18next with translations and language detection
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation
      },
      ar: {
        translation: arTranslation
      }
    },
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false // React already safes from XSS
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'language',
      caches: ['localStorage']
    },
    react: {
      useSuspense: false
    }
  });

// Utility functions for language handling
export const setLanguage = (lang) => {
  localStorage.setItem('language', lang);
  // Set dir attribute on document body for RTL support
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
  i18n.changeLanguage(lang);
};

export const getCurrentLanguage = () => {
  return i18n.language || localStorage.getItem('language') || 'en';
};

export const isRTL = () => {
  return getCurrentLanguage() === 'ar';
};

// Initialize direction based on saved language
const savedLanguage = localStorage.getItem('language') || 'en';
document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
document.documentElement.lang = savedLanguage;

export default i18n;
