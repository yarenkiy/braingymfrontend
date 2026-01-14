import React, { useState } from 'react';
import './App.css';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import LanguageSelector from './components/LanguageSelector';
import GameMenu from './components/GameMenu';
import Sudoku from './components/Sudoku';
import MemoryGame from './components/MemoryGame';
import CountryPlates from './components/CountryPlates';
import CountryCapitals from './components/CountryCapitals';
import CountryCities from './components/CountryCities';
import WordGame from './components/WordGame';

function AppContent() {
  const [currentGame, setCurrentGame] = useState(null);
  const { language, setLanguage } = useLanguage();

  const handleLanguageSelect = (lang) => {
    setLanguage(lang);
  };

  if (!language) {
    return <LanguageSelector onSelectLanguage={handleLanguageSelect} />;
  }

  const renderGame = () => {
    switch(currentGame) {
      case 'sudoku':
        return <Sudoku onBack={() => setCurrentGame(null)} />;
      case 'memory':
        return <MemoryGame onBack={() => setCurrentGame(null)} />;
      case 'plates':
        return <CountryPlates onBack={() => setCurrentGame(null)} />;
      case 'capitals':
        return <CountryCapitals onBack={() => setCurrentGame(null)} />;
      case 'cities':
        return <CountryCities onBack={() => setCurrentGame(null)} />;
      case 'words':
        return <WordGame onBack={() => setCurrentGame(null)} />;
      default:
        return <GameMenu onSelectGame={setCurrentGame} />;
    }
  };

  return (
    <div className="App">
      {renderGame()}
      <button 
        className="language-switch-btn" 
        onClick={() => setLanguage(language === 'tr' ? 'en' : 'tr')}
        title={language === 'tr' ? 'Switch to English' : 'Türkçe\'ye Geç'}
      >
        {language === 'tr' ? '🇬🇧 EN' : '🇹🇷 TR'}
      </button>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;