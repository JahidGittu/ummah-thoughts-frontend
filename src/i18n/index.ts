import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import bn from './locales/bn.json';

// Custom language detector that considers geolocation (client‑side only)
const geoLanguageDetector = {
  name: 'geoDetector',
  lookup: () => {
    // Guard against server‑side execution
    if (typeof window === 'undefined') return 'en';

    // Check if we have a stored preference first
    const stored = localStorage.getItem('i18nextLng');
    if (stored) return stored;

    // Check navigator language
    const browserLang = navigator.language || (navigator as any).userLanguage;
    if (browserLang?.startsWith('bn')) {
      return 'bn';
    }

    // Check timezone as a proxy for location
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (timezone === 'Asia/Dhaka') {
        return 'bn';
      }
      // For Kolkata timezone, additional checks could be added,
      // but we'll keep it simple for now.
    } catch (e) {
      // Ignore timezone detection errors
    }

    // Default to English
    return 'en';
  },
  cacheUserLanguage: (lng: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('i18nextLng', lng);
    }
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      bn: { translation: bn },
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'bn'],
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    interpolation: {
      escapeValue: false,
    },
  });

// Apply custom geo detection on init only if we're on the client
// and no stored preference exists yet.
if (typeof window !== 'undefined' && !localStorage.getItem('i18nextLng')) {
  const detectedLang = geoLanguageDetector.lookup();
  if (detectedLang && detectedLang !== i18n.language) {
    i18n.changeLanguage(detectedLang);
  }
}

export default i18n;

// Helper to change language and persist (client‑side only)
export const changeLanguage = (lng: string) => {
  i18n.changeLanguage(lng);
  if (typeof window !== 'undefined') {
    localStorage.setItem('i18nextLng', lng);
    document.documentElement.lang = lng;
  }
};

// Get current language
export const getCurrentLanguage = () => i18n.language;

// Check if current language is RTL (for future Arabic support)
export const isRTL = () => ['ar', 'fa', 'ur'].includes(i18n.language);