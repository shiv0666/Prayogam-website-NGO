import axios from 'axios';

const resolveBaseUrl = () => {
  const configuredBaseUrl = import.meta.env.VITE_API_URL;

  if (import.meta.env.DEV) {
    const hostname = window.location.hostname || 'localhost';
    return `http://${hostname}:5050/api`;
  }

  return configuredBaseUrl || '/api';
};

const api = axios.create({
  baseURL: resolveBaseUrl()
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
