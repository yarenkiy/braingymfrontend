import React, { useState, useEffect } from 'react';
import { countryAPI } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import './CountryGame.css';

const CountryCities = ({ onBack }) => {
  const { t } = useLanguage();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const response = await countryAPI.getCityQuestions();
      setQuestions(response.data);
    } catch (error) {
      console.error('Sorular yüklenemedi:', error);
    }
  };

  const handleAnswer = (answer) => {
    if (showResult) return;
    
    setSelectedAnswer(answer);
    setShowResult(true);
    
    if (answer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setGameFinished(true);
      }
    }, 1500);
  };

  const restartGame = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setGameFinished(false);
    loadQuestions();
  };

  if (questions.length === 0) {
    return <div className="loading">{t('loading')}</div>;
  }

  if (gameFinished) {
    return (
      <div className="country-game-container">
        <button className="back-button" onClick={onBack}>{t('backToMenu')}</button>
        <div className="game-result">
          <h2>{t('gameOver')}</h2>
          <p className="final-score">{t('score')}: {score} / {questions.length}</p>
          <p className="percentage">{t('successRate')}: {((score / questions.length) * 100).toFixed(0)}%</p>
          <div className="result-buttons">
            <button onClick={restartGame} className="restart-btn">🔄 {t('playAgain')}</button>
            <button onClick={onBack} className="menu-btn">🏠 {t('backToMenu')}</button>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="country-game-container">
      <button className="back-button" onClick={onBack}>{t('backToMenu')}</button>
      
      <div className="game-header">
        <h2>🌍 {t('cities')}</h2>
        <div className="progress">
          {t('question')} {currentQuestion + 1} / {questions.length} | {t('score')}: {score}
        </div>
      </div>

      <div className="question-container">
        <p className="question-text">{question.question}</p>
        
        <div className="options-grid">
          {question.options.map((option, index) => (
            <button
              key={index}
              className={`option-btn ${
                showResult && option === question.correctAnswer ? 'correct' : ''
              } ${
                showResult && option === selectedAnswer && option !== question.correctAnswer ? 'wrong' : ''
              }`}
              onClick={() => handleAnswer(option)}
              disabled={showResult}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CountryCities;