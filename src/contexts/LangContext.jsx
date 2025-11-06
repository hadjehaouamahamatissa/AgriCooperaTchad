import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../i18n/translation';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('fr'); // Français par défaut

  // Charger la langue sauvegardée au démarrage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('appLanguage');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (newLang) => {
    setLanguage(newLang);
    localStorage.setItem('appLanguage', newLang);
    console.log('🌍 Langue changée:', newLang);
  };

  // Fonction de traduction SIMPLE
  const t = (key) => {
    try {
      const keys = key.split('.');
      let value = translations[language];
      
      for (const k of keys) {
        value = value?.[k];
      }
      
      return value || translations['fr'][keys[0]] || key;
    } catch (error) {
      console.warn('Traduction non trouvée:', key);
      return key;
    }
  };

  const value = {
    language,
    changeLanguage,
    t,
    isRTL: language === 'ar'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};