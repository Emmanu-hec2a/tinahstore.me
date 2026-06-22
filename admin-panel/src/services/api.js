import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api/v1',
});

// Request interceptor: attach Authorization header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ts_admin_token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// Response interceptor: handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ts_admin_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
