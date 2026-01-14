import React, { useState, useEffect } from 'react';
import { sudokuAPI } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import './Sudoku.css';

const Sudoku = ({ onBack }) => {
  const { t } = useLanguage();
  const [difficulty, setDifficulty] = useState(null);
  const [board, setBoard] = useState(null);
  const [solution, setSolution] = useState(null);
  const [currentBoard, setCurrentBoard] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startGame = async (level) => {
    setDifficulty(level);
    try {
      const response = await sudokuAPI.generateSudoku(level);
      setBoard(response.data.puzzle);
      setSolution(response.data.solution);
      setCurrentBoard(response.data.puzzle.map(row => [...row]));
      setTimer(0);
      setIsRunning(true);
    } catch (error) {
      console.error('Sudoku yüklenirken hata:', error);
    }
  };

  const handleCellChange = (row, col, value) => {
    if (board[row][col] !== 0) return; // Orijinal sayıları değiştirme
    
    const newBoard = currentBoard.map(r => [...r]);
    newBoard[row][col] = value === '' ? 0 : parseInt(value);
    setCurrentBoard(newBoard);
  };

  const checkSolution = () => {
    const isCorrect = JSON.stringify(currentBoard) === JSON.stringify(solution);
    if (isCorrect) {
      setIsRunning(false);
      alert(`${t('congratulations')} ${formatTime(timer)}`);
    } else {
      alert(t('wrong'));
    }
  };

  const showSolution = () => {
    setCurrentBoard(solution);
    setIsRunning(false);
  };

  if (!difficulty) {
    return (
      <div className="sudoku-container">
        <button className="back-button" onClick={onBack}>{t('backToMenu')}</button>
        <h2>{t('sudoku')} - {t('difficulty')}</h2>
        <div className="difficulty-buttons">
          <button onClick={() => startGame('cocuk')} className="difficulty-btn easy">
            👶 {t('children')}
          </button>
          <button onClick={() => startGame('kolay')} className="difficulty-btn easy">
            😊 {t('easy')}
          </button>
          <button onClick={() => startGame('orta')} className="difficulty-btn medium">
            🤔 {t('medium')}
          </button>
          <button onClick={() => startGame('zor')} className="difficulty-btn hard">
            😰 {t('hard')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="sudoku-container">
      <button className="back-button" onClick={onBack}>{t('backToMenu')}</button>
      <div className="sudoku-header">
        <h2>{t('sudoku')} - {difficulty.toUpperCase()}</h2>
        <div className="timer">⏱️ {formatTime(timer)}</div>
      </div>
      
      <div className="sudoku-board">
        {currentBoard && currentBoard.map((row, rowIndex) => (
          <div key={rowIndex} className="sudoku-row">
            {row.map((cell, colIndex) => (
              <input
                key={`${rowIndex}-${colIndex}`}
                type="text"
                maxLength="1"
                className={`sudoku-cell ${board[rowIndex][colIndex] !== 0 ? 'fixed' : ''} 
                  ${selectedCell?.row === rowIndex && selectedCell?.col === colIndex ? 'selected' : ''}`}
                value={cell === 0 ? '' : cell}
                onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                onFocus={() => setSelectedCell({row: rowIndex, col: colIndex})}
                disabled={board[rowIndex][colIndex] !== 0}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="sudoku-controls">
        <button onClick={checkSolution} className="control-btn check">
          ✓ {t('check')}
        </button>
        <button onClick={showSolution} className="control-btn solution">
          💡 {t('solution')}
        </button>
        <button onClick={() => setDifficulty(null)} className="control-btn restart">
          🔄 {t('newGame')}
        </button>
      </div>
    </div>
  );
};

export default Sudoku;