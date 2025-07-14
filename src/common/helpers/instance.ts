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

instance.interceptors.response.use(
  response => response,
  async error => {
    if (
      error.response &&
      error.response.status === 401 &&
      error.config &&
      error.config.url !== '/api/tiktak/auth/login'
    ) {
      try {
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
      } catch (e) {}
    }
    return Promise.reject(error);
  },
);
