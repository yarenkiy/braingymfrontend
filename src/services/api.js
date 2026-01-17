import axios from 'axios';

// Backend URL'i al, sonuna /api ekle
const API_BASE_URL = process.env.REACT_APP_API_URL 
  ? `${process.env.REACT_APP_API_URL}/api`
  : 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const sudokuAPI = {
  generateSudoku: (difficulty) => api.get(`/sudoku/generate/${difficulty}`),
  validateSudoku: (board) => api.post('/sudoku/validate', board),
};

export const countryAPI = {
  getPlateQuestions: (lang = 'tr') => api.get(`/country/plates?lang=${lang}`),
  getCapitalQuestions: (lang = 'tr') => api.get(`/country/capitals?lang=${lang}`),
  getCityQuestions: (lang = 'tr') => api.get(`/country/cities?lang=${lang}`),
};

export const wordAPI = {
  getWordChallenges: (lang = 'tr') => api.get(`/word/challenge?lang=${lang}`),
  validateWord: (word, lang = 'tr') => api.post(`/word/validate?lang=${lang}`, word),
};

export default api;