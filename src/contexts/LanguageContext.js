import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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

  // /api zaten eklenmiş olacak çünkü api.js'de ekliyoruz
  const API_BASE_URL = process.env.REACT_APP_API_URL 
    ? `${process.env.REACT_APP_API_URL}/api`
    : 'http://localhost:8080/api';

  const loadTranslations = useCallback(async (lang) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/language/translations/${lang}`);
      setTranslations(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Çeviriler yüklenemedi:', error);
      setLoading(false);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    if (language) {
      loadTranslations(language);
    }
  }, [language, loadTranslations]);

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