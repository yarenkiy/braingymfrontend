import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './GameMenu.css';

const GameMenu = ({ onSelectGame }) => {
  const { t } = useLanguage();
  
  const games = [
    { id: 'sudoku', icon: '🔢' },
    { id: 'memory', icon: '🃏' },
    { id: 'plates', icon: '🚗' },
    { id: 'capitals', icon: '🏛️' },
    { id: 'cities', icon: '🌍' },
    { id: 'words', icon: '📝' }
  ];

  return (
    <div className="game-menu">
      <h1 className="menu-title">🎮 {t('mainTitle')}</h1>
      <p className="menu-subtitle">{t('mainSubtitle')}</p>
      
      <div className="games-grid">
        {games.map((game) => (
          <div 
            key={game.id} 
            className="game-card"
            onClick={() => onSelectGame(game.id)}
          >
            <div className="game-icon">{game.icon}</div>
            <h3 className="game-name">{t(game.id)}</h3>
            <p className="game-description">{t(game.id + 'Desc')}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameMenu;