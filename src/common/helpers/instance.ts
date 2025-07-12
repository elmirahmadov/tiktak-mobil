import axios from 'axios';
import { useAuthStore } from '../store/Auth/auth.store';

const API_BASE_URL = 'https://api.sarkhanrahimli.dev';

const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use(
  async config => {
    try {
      const token = useAuthStore.getState().accessToken;
      if (token) {
        config.headers = config.headers || {};
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    } catch (e) {}
    return config;
  },
  error => Promise.reject(error),
);

export default instance;
