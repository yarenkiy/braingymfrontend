import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

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
  getPlateQuestions: () => api.get('/country/plates'),
  getCapitalQuestions: () => api.get('/country/capitals'),
  getCityQuestions: () => api.get('/country/cities'),
};

export const wordAPI = {
  getWordChallenges: () => api.get('/word/challenge'),
  validateWord: (word) => api.post('/word/validate', word),
};

export default api;