import { useAuthStore } from './auth.store';
import { IAuthStore } from './auth.types';

export const useAuthActions = () =>
  useAuthStore((state: IAuthStore) => state.actions);

export const useAuth = () =>
  useAuthStore((state: IAuthStore) => ({
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    accessToken: state.accessToken,
    refreshToken: state.refreshToken,
  }));

export const useAuthReset = () =>
  useAuthStore((state: IAuthStore) => state.actions.reset);

export const useAuthLoading = () =>
  useAuthStore((state: IAuthStore) => state.loading);

export const useAuthUser = () =>
  useAuthStore((state: IAuthStore) => state.user);

export const useIsAuthenticated = () =>
  useAuthStore((state: IAuthStore) => state.isAuthenticated);

export { useAuthStore } from './auth.store';
