// frontend/src/api.js
import axios from 'axios';

const API_URL = 'https://volcom-api.onrender.com';

export const api = axios.create({
  baseURL: `${API_URL}/api`
});

// add token to every request if logged in
api.interceptors.request.use(config => {
  const token = localStorage.getItem('volcom_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
