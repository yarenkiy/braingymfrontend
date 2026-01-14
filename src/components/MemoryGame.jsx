import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './MemoryGame.css';

const MemoryGame = ({ onBack }) => {
  const { t, language } = useLanguage();
  const [difficulty, setDifficulty] = useState(null);
  const [theme, setTheme] = useState(null);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const themes = {
    emojis: ['🍎', '🍌', '🍇', '🍓', '🍊', '🍋', '🥝', '🍉', '🍒', '🥭', '🍑', '🍍'],
    animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮'],
    sports: ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱', '🏓', '🏸', '🏒', '🏑'],
    vehicles: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🚚', '🚛'],
    hearts: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💖', '💗', '💝'],
    
  };

  const themeNames = {
    tr: {
      emojis: 'Meyveler',
      animals: 'Hayvanlar',
      sports: 'Sporlar',
      vehicles: 'Araçlar',
      hearts: 'Kalpler',
     
    },
    en: {
      emojis: 'Fruits',
      animals: 'Animals',
      sports: 'Sports',
      vehicles: 'Vehicles',
      hearts: 'Hearts',
    
    }
  };

  const difficulties = {
    easy: { pairs: 6, gridCols: 4, name: t('easy') },
    medium: { pairs: 8, gridCols: 4, name: t('medium') },
    hard: { pairs: 12, gridCols: 6, name: t('hard') }
  };

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const initializeGame = (selectedTheme, selectedDifficulty) => {
    setTheme(selectedTheme);
    setDifficulty(selectedDifficulty);
    
    const diff = difficulties[selectedDifficulty];
    const themeIcons = themes[selectedTheme];
    const selectedIcons = themeIcons.slice(0, diff.pairs);
    
    const gameCards = [...selectedIcons, ...selectedIcons]
      .sort(() => Math.random() - 0.5)
      .map((icon, index) => ({ id: index, icon, flipped: false }));
    
    setCards(gameCards);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setTimer(0);
    setIsRunning(false);
  };

  const handleCardClick = (id) => {
    if (!isRunning) setIsRunning(true);
    
    if (flipped.length === 2 || flipped.includes(id) || matched.includes(id)) {
      return;
    }

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      const [first, second] = newFlipped;
      const firstCard = cards.find(c => c.id === first);
      const secondCard = cards.find(c => c.id === second);

      if (firstCard.icon === secondCard.icon) {
        setMatched([...matched, first, second]);
        setFlipped([]);
        
        if (matched.length + 2 === cards.length) {
          setIsRunning(false);
          setTimeout(() => {
            alert(`${t('congratulations')} ${t('moves')}: ${moves + 1}, ${t('time')}: ${formatTime(timer)}`);
          }, 500);
        }
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const resetGame = () => {
    setDifficulty(null);
    setTheme(null);
  };

  if (!theme || !difficulty) {
    return (
      <div className="memory-game-container">
        <button className="back-button" onClick={onBack}>{t('backToMenu')}</button>
        
        <div className="setup-screen">
          <h2>🃏 {t('memory')}</h2>
          
          {!theme ? (
            <>
              <h3 className="setup-title">{language === 'tr' ? 'Tema Seçin' : 'Choose Theme'}</h3>
              <div className="theme-grid">
                {Object.entries(themes).map(([key, icons]) => (
                  <div
                    key={key}
                    className="theme-card"
                    onClick={() => setTheme(key)}
                  >
                    <div className="theme-icons">
                      {icons.slice(0, 4).map((icon, idx) => (
                        <span key={idx}>{icon}</span>
                      ))}
                    </div>
                    <p className="theme-name">{themeNames[language][key]}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <h3 className="setup-title">{language === 'tr' ? 'Zorluk Seviyesi Seçin' : 'Choose Difficulty'}</h3>
              <div className="difficulty-grid">
                {Object.entries(difficulties).map(([key, diff]) => (
                  <div
                    key={key}
                    className={`difficulty-card ${key}`}
                    onClick={() => initializeGame(theme, key)}
                  >
                    <h4>{diff.name}</h4>
                    <p>{diff.pairs} {language === 'tr' ? 'Çift' : 'Pairs'}</p>
                    <p className="card-count">{diff.pairs * 2} {language === 'tr' ? 'Kart' : 'Cards'}</p>
                  </div>
                ))}
              </div>
              <button className="back-theme-btn" onClick={() => setTheme(null)}>
                ← {language === 'tr' ? 'Tema Değiştir' : 'Change Theme'}
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  const gridCols = difficulties[difficulty].gridCols;

  return (
    <div className="memory-game-container">
      <button className="back-button" onClick={onBack}>{t('backToMenu')}</button>
      
      <div className="memory-header">
        <h2>🃏 {t('memory')}</h2>
        <div className="memory-stats">
          <span className="stat-item">
            <span className="stat-icon">🎯</span>
            <span>{moves} {t('moves')}</span>
          </span>
          <span className="stat-item">
            <span className="stat-icon">⏱️</span>
            <span>{formatTime(timer)}</span>
          </span>
          <span className="stat-item">
            <span className="stat-icon">✓</span>
            <span>{matched.length / 2}/{cards.length / 2}</span>
          </span>
        </div>
      </div>

      <div className={`cards-grid cols-${gridCols}`}>
        {cards.map((card) => (
          <div
            key={card.id}
            className={`memory-card ${
              flipped.includes(card.id) || matched.includes(card.id) ? 'flipped' : ''
            } ${matched.includes(card.id) ? 'matched' : ''}`}
            onClick={() => handleCardClick(card.id)}
          >
            <div className="card-inner">
              <div className="card-front">
                <div className="card-pattern"></div>
              </div>
              <div className="card-back">{card.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="game-controls">
        <button className="control-btn restart" onClick={() => initializeGame(theme, difficulty)}>
          🔄 {t('restart')}
        </button>
        <button className="control-btn change" onClick={resetGame}>
          🎨 {t('changeTheme')}
        </button>
      </div>
    </div>
  );
};

export default MemoryGame;