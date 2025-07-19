import axios from 'axios';
import { useAuthStore } from '../store/Auth/auth.store';
import { CommonActions } from '@react-navigation/native';

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

let navigationRef: any = null;

export const setNavigationRef = (ref: any) => {
  navigationRef = ref;
};

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

instance.interceptors.response.use(
  response => response,
  async error => {
    if (
      error.response &&
      error.response.status === 401 &&
      error.config &&
      error.config.url !== '/api/tiktak/auth/login' &&
      error.config.url !== '/api/tiktak/auth/refresh'
    ) {
      const originalRequest = error.config;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return instance(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { actions, refreshToken } = useAuthStore.getState();

        if (refreshToken) {
          await actions.refreshToken({ refresh_token: refreshToken });
          const newToken = useAuthStore.getState().accessToken;

          processQueue(null, newToken);
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

          isRefreshing = false;
          return instance(originalRequest);
        } else {
          throw new Error('Refresh token bulunamadı');
        }
      } catch (e) {
        processQueue(e, null);
        isRefreshing = false;

        const { actions } = useAuthStore.getState();
        await actions.logout();
        if (navigationRef) {
          navigationRef.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            }),
          );
        }
      }
    }
    return Promise.reject(error);
  },
);
