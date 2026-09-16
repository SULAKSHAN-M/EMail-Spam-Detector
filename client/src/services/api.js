import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URI || 'http://localhost:3000',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Redirect to /home on 401 (expired/invalid JWT)
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('jwt');
      window.history.replaceState(null, '', '/home');
      window.location.replace('/home');
    }
    return Promise.reject(err);
  },
);

export default API;
