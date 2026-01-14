import React from 'react';
import './LanguageSelector.css';

const LanguageSelector = ({ onSelectLanguage }) => {
  return (
    <div className="language-selector-container">
      <div className="language-selector-card">
        <h1 className="language-title">🌍</h1>
        <h2 className="language-question">
          Hangi dilde devam etmek istersiniz?
          <br />
          <span className="language-question-en">Which language would you like to continue in?</span>
        </h2>
        
        <div className="language-options">
          <div 
            className="language-option turkish"
            onClick={() => onSelectLanguage('tr')}
          >
            <div className="language-flag">🇹🇷</div>
            <h3 className="language-name">Türkçe</h3>
            <p className="language-native">Turkish</p>
          </div>
          
          <div 
            className="language-option english"
            onClick={() => onSelectLanguage('en')}
          >
            <div className="language-flag">🇬🇧</div>
            <h3 className="language-name">English</h3>
            <p className="language-native">İngilizce</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;