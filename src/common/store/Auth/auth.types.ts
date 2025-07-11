import type {
  ILoginRequest,
  ISignupRequest,
  IRefreshTokenRequest,
  IProfileUpdateRequest,
  IUser,
} from '../../types/api.types';

export interface IAuthStoreActions {
  setLoading: (loading: boolean) => void;
  reset: () => void;
  login: (
    data: ILoginRequest,
    onSuccess?: () => void,
    onError?: (err: any) => void,
  ) => Promise<void>;
  signup: (
    data: ISignupRequest,
    onSuccess?: () => void,
    onError?: (err: any) => void,
  ) => Promise<void>;
  refreshToken: (
    data: IRefreshTokenRequest,
    onSuccess?: () => void,
    onError?: (err: any) => void,
  ) => Promise<void>;
  getProfile: (onError?: (err: any) => void) => Promise<void>;
  updateProfile: (
    data: IProfileUpdateRequest,
    onSuccess?: () => void,
    onError?: (err: any) => void,
  ) => Promise<void>;
  logout: (onSuccess?: () => void) => Promise<void>;
}

export interface IAuthStore {
  loading: boolean;
  user: IUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  actions: IAuthStoreActions;
}
