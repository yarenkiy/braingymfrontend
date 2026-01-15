import React, { useState, useEffect, useCallback } from 'react';
import { wordAPI } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import './WordGame.css';



const WordGame = ({ onBack }) => {
  const { t, language } = useLanguage();
  const [challenges, setChallenges] = useState([]);
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [availableLetters, setAvailableLetters] = useState([]);
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [draggedLetter, setDraggedLetter] = useState(null);

  useEffect(() => {
    loadChallenges();
  }, [loadChallenges]);
  

  useEffect(() => {
    if (challenges.length > 0 && currentChallenge < challenges.length) {
      const letters = challenges[currentChallenge].scrambledWord.split('').map((letter, index) => ({
        id: `${currentChallenge}-${index}`,
        letter: letter,
        isUsed: false
      }));
      setAvailableLetters(letters);
      setSelectedLetters([]);
    }
  }, [challenges, currentChallenge]);
  const loadChallenges = useCallback(async () => {
    try {
      const response = await wordAPI.getWordChallenges(language);
      setChallenges(response.data);
      setCurrentChallenge(0);
      setScore(0);
      setShowResult(false);
      setGameFinished(false);
    } catch (error) {
      console.error('Kelimeler yüklenemedi:', error);
    }
  }, [language]);
  
  const handleLetterClick = (letter) => {
    if (showResult || letter.isUsed) return;
    
    setSelectedLetters([...selectedLetters, letter]);
    setAvailableLetters(availableLetters.map(l => 
      l.id === letter.id ? { ...l, isUsed: true } : l
    ));
  };

  const handleSelectedLetterClick = (index) => {
    if (showResult) return;
    
    const letter = selectedLetters[index];
    setSelectedLetters(selectedLetters.filter((_, i) => i !== index));
    setAvailableLetters(availableLetters.map(l => 
      l.id === letter.id ? { ...l, isUsed: false } : l
    ));
  };

  const handleDragStart = (e, letter) => {
    setDraggedLetter(letter);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDropToAnswer = (e) => {
    e.preventDefault();
    if (draggedLetter && !draggedLetter.isUsed && !showResult) {
      handleLetterClick(draggedLetter);
    }
    setDraggedLetter(null);
  };

  const handleSubmit = () => {
    if (showResult || selectedLetters.length === 0) return;

    const userAnswer = selectedLetters.map(l => l.letter).join('');
    const correct = userAnswer === challenges[currentChallenge].correctWord;
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentChallenge + 1 < challenges.length) {
        setCurrentChallenge(currentChallenge + 1);
        setShowResult(false);
      } else {
        setGameFinished(true);
      }
    }, 2000);
  };

  const restartGame = () => {
    setCurrentChallenge(0);
    setScore(0);
    setSelectedLetters([]);
    setShowResult(false);
    setIsCorrect(false);
    setGameFinished(false);
    loadChallenges();
  };

  if (challenges.length === 0) {
    return <div className="loading">{t('loading')}</div>;
  }

  if (gameFinished) {
    return (
      <div className="word-game-container">
        <button className="back-button" onClick={onBack}>← {t('backToMenu')}</button>
        <div className="game-result">
          <h2>{t('gameOver')}</h2>
          <p className="final-score">{t('score')}: {score} / {challenges.length}</p>
          <p className="percentage">{t('successRate')}: {((score / challenges.length) * 100).toFixed(0)}%</p>
          <div className="result-buttons">
            <button onClick={restartGame} className="restart-btn">🔄 {t('playAgain')}</button>
            <button onClick={onBack} className="menu-btn">🏠 {t('backToMenu')}</button>
          </div>
        </div>
      </div>
    );
  }

  const challenge = challenges[currentChallenge];

  return (
    <div className="word-game-container">
      <button className="back-button" onClick={onBack}>← {t('backToMenu')}</button>
      
      <div className="game-header">
        <h2>📝 {t('words')}</h2>
        <div className="progress">
          {t('question')} {currentChallenge + 1} / {challenges.length} | {t('score')}: {score}
        </div>
      </div>

      <div className="word-challenge">
        <p className="instruction">{t('dragLetters')}</p>
        
        <div 
          className="answer-area"
          onDragOver={handleDragOver}
          onDrop={handleDropToAnswer}
        >
          {selectedLetters.length === 0 ? (
            <span className="placeholder">{t('dragHere')}</span>
          ) : (
            selectedLetters.map((letter, index) => (
              <div
                key={`selected-${index}`}
                className="letter-tile selected"
                onClick={() => handleSelectedLetterClick(index)}
              >
                {letter.letter}
              </div>
            ))
          )}
        </div>

        <div className="letters-container">
          {availableLetters.map((letter) => (
            <div
              key={letter.id}
              className={`letter-tile ${letter.isUsed ? 'used' : ''}`}
              draggable={!letter.isUsed && !showResult}
              onDragStart={(e) => handleDragStart(e, letter)}
              onClick={() => handleLetterClick(letter)}
            >
              {letter.letter}
            </div>
          ))}
        </div>

        <button 
          onClick={handleSubmit} 
          className="submit-btn" 
          disabled={showResult || selectedLetters.length === 0}
        >
          {t('submit')}
        </button>

        {showResult && (
          <div className={`result-message ${isCorrect ? 'correct' : 'wrong'}`}>
            {isCorrect ? (
              <>
                <span className="result-icon">✓</span>
                <span>{t('correct')} {challenge.correctWord}</span>
              </>
            ) : (
              <>
                <span className="result-icon">✗</span>
                <span>{t('wrong')} {challenge.correctWord}</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WordGame;