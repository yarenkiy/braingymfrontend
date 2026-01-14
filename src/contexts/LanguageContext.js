import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(null);
  const [translations, setTranslations] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (language) {
      loadTranslations(language);
    }
  }, [language]);

  const loadTranslations = async (lang) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/api/language/translations/${lang}`);
      setTranslations(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Çeviriler yüklenemedi:', error);
      setLoading(false);
    }
  };

  const t = (key) => {
    return translations[key] || key;
  };

  const value = {
    language,
    setLanguage,
    translations,
    t,
    loading
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};