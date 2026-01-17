import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

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
      const response = await axios.get(
        `${API_BASE_URL}/api/language/translations/${lang}`
      );
      setTranslations(response.data);
    } catch (error) {
      console.error('Çeviriler yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const t = (key) => translations[key] || key;

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, translations, t, loading }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
