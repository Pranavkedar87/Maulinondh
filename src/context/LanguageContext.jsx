import React, { createContext, useContext, useState, useEffect } from 'react';
import enDict from '../locales/en.json';
import mrDict from '../locales/mr.json';
import hiDict from '../locales/hi.json';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

// All supported local dictionaries — no API needed
const LOCAL_DICTS = {
  en: enDict,
  mr: mrDict,
  hi: hiDict,
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    const saved = localStorage.getItem('maulinondh_lang');
    // Only allow languages we have local dictionaries for
    if (saved && LOCAL_DICTS[saved]) return saved;
    return 'en';
  });

  // Clear old API-cached translations on first load
  useEffect(() => {
    ['hi', 'mr', 'gu', 'bn', 'ta', 'te', 'ml', 'as', 'kn', 'pa'].forEach(lang => {
      localStorage.removeItem(`maulinondh_lang_${lang}`);
    });
  }, []);

  const setLanguage = (lang) => {
    localStorage.setItem('maulinondh_lang', lang);
    setLanguageState(lang);
  };

  const getTranslation = (path, params = {}) => {
    const dict = LOCAL_DICTS[language] || LOCAL_DICTS['en'];
    const fallback = LOCAL_DICTS['en'];

    const keys = path.split('.');

    // Try current language dict first
    let value = dict;
    let found = true;
    for (const key of keys) {
      if (value && value[key] !== undefined) {
        value = value[key];
      } else {
        found = false;
        break;
      }
    }

    // If not found, fall back to English
    if (!found) {
      value = fallback;
      for (const key of keys) {
        if (value && value[key] !== undefined) {
          value = value[key];
        } else {
          return path; // Return path as last resort
        }
      }
    }

    // Handle template params like {name}
    if (typeof value === 'string' && Object.keys(params).length > 0) {
      let templated = value;
      for (const [k, v] of Object.entries(params)) {
        templated = templated.replace(`{${k}}`, v);
      }
      return templated;
    }

    return value;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: getTranslation, isTranslating: false }}>
      {children}
    </LanguageContext.Provider>
  );
};
