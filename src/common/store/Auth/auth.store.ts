import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import type { IAuthStore } from './auth.types';
import {
  login as authLogin,
  signup as authSignup,
  refreshToken as authRefresh,
  logout as authLogout,
} from '../../services/api/auth.api';
import {
  getProfile as fetchProfile,
  updateProfile,
} from '../../services/api/profile.api';

type ErrorResponse = {
  response?: {
    data: {
      message: string | string[];
    };
  };
};

const initial: Omit<IAuthStore, 'actions'> = {
  loading: false,
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
};

const parseErrorMessage = (message: string | string[] | undefined): string => {
  if (!message) return '';
  if (Array.isArray(message)) {
    return message.join(', ');
  }
  return message.toString();
};

export const useAuthStore = create<IAuthStore>()(
  persist(
    (set, get) => ({
      ...initial,
      actions: {
        setLoading: loading => set({ loading }),

        reset: () => set({ ...initial }),
        login: async (data, onSuccess, onError) => {
          set({ loading: true });
          try {
            const res = await authLogin(data);

            let access_token: string | undefined;
            let refresh_token: string | undefined;
            let profile: any;
            if (res?.access_token && res?.refresh_token) {
              access_token = res.access_token;
              refresh_token = res.refresh_token;
              profile = res.profile || res.user;
            } else if (res?.data?.tokens) {
              access_token = res.data.tokens.access_token;
              refresh_token = res.data.tokens.refresh_token;
              profile = res.data.profile || res.data.user;
            } else if (res?.data?.access_token) {
              access_token = res.data.access_token;
              refresh_token = res.data.refresh_token;
              profile = res.data.profile || res.data.user;
            } else if (res?.tokens) {
              access_token = res.tokens.access_token;
              refresh_token = res.tokens.refresh_token;
              profile = res.profile || res.user;
            }

            if (!access_token || !refresh_token) {
              console.error('❌ AUTH STORE: Token bulunamadı!', res);
              throw new Error("API'den token alınamadı");
            }

            set({
              accessToken: access_token,
              refreshToken: refresh_token,
              user: profile,
              isAuthenticated: true,
              loading: false,
            });

            onSuccess?.();
          } catch (error) {
            try {
              let errorResponse: any = {};
              if (
                typeof error === 'object' &&
                error !== null &&
                'response' in error
              ) {
                errorResponse = error;
                const errResp = (error as any).response;
                if (
                  errResp &&
                  typeof errResp === 'object' &&
                  'data' in errResp
                ) {
                }
              }
              const rawMessage = parseErrorMessage(
                errorResponse?.response?.data?.message,
              );

              const getErrorMessage = (errorMsg: string) => {
                if (!errorMsg) return 'Bilinmeyen hata';
                const lowerMsg = errorMsg.toLowerCase();
                if (
                  lowerMsg.includes('password is wrong') ||
                  lowerMsg.includes('password incorrect')
                )
                  return 'Parol yanlış!';
                if (
                  lowerMsg.includes('user not found') ||
                  lowerMsg.includes('not found')
                )
                  return 'Bu telefon nömrəsi ilə qeydiyyat tapılmadı!';
                if (lowerMsg.includes('phone'))
                  return 'Telefon nömrəsi formatı yanlış!';
                if (lowerMsg.includes('invalid')) return 'Məlumatlar yanlış!';
                if (lowerMsg.includes('token'))
                  return 'Token alınırken hata oluştu!';
                return errorMsg;
              };

              const errorMessage = getErrorMessage(rawMessage);

              Toast.show({
                type: 'error',
                text1: 'Giriş Xətası',
                text2: errorMessage,
              });

              try {
                if (onError) {
                  onError(error);
                }
              } catch (callbackError) {}
            } catch (errorHandlingError) {
            } finally {
              set({ loading: false });
            }
          }
        },

        signup: async (data, onSuccess, onError) => {
          set({ loading: true });
          try {
            await authSignup(data);
            set({ loading: false });

            Toast.show({
              type: 'success',
              text1: 'Qeydiyyat Uğurlu',
              text2: 'Qeydiyyat uğurla tamamlandı',
            });

            onSuccess?.();
          } catch (error) {
            const errorResponse = error as ErrorResponse;
            const rawMessage = parseErrorMessage(
              errorResponse?.response?.data?.message,
            );

            const getSignupErrorMessage = (errorMsg: string) => {
              if (!errorMsg) return 'Bilinmeyen hata';
              const lowerMsg = errorMsg.toLowerCase();
              if (
                lowerMsg.includes('user is already exists') ||
                lowerMsg.includes('user already exists') ||
                lowerMsg.includes('phone already exists')
              )
                return 'Bu telefon nömrəsi ilə artıq qeydiyyat mövcuddur!';
              if (lowerMsg.includes('phone'))
                return 'Telefon nömrəsi formatı yanlış!';
              if (lowerMsg.includes('password'))
                return 'Parol formatı uyğun deyil!';
              if (lowerMsg.includes('name') || lowerMsg.includes('full_name'))
                return 'Ad sahəsi boş ola bilməz!';
              if (
                lowerMsg.includes('invalid') ||
                lowerMsg.includes('validation')
              )
                return 'Məlumatlar yanlış!';
              if (lowerMsg.includes('required'))
                return 'Bütün sahələr doldurulmalıdır!';
              return errorMsg;
            };

            const errorMessage = getSignupErrorMessage(rawMessage);

            Toast.show({
              type: 'error',
              text1: 'Qeydiyyat Xətası',
              text2: errorMessage,
            });
            onError?.(error);
            set({ loading: false });
          }
        },

        refreshToken: async (data, onSuccess, onError) => {
          set({ loading: true });
          try {
            const res = await authRefresh(data);

            let access_token: string | undefined;
            let refresh_token: string | undefined;

            if (res?.access_token && res?.refresh_token) {
              access_token = res.access_token;
              refresh_token = res.refresh_token;
            } else if (res?.data?.tokens) {
              access_token = res.data.tokens.access_token;
              refresh_token = res.data.tokens.refresh_token;
            } else if (res?.data?.access_token) {
              access_token = res.data.access_token;
              refresh_token = res.data.refresh_token;
            } else if (res?.tokens) {
              access_token = res.tokens.access_token;
              refresh_token = res.tokens.refresh_token;
            }

            if (!access_token || !refresh_token) {
              throw new Error('Token yenilenemedi');
            }

            set({
              accessToken: access_token,
              refreshToken: refresh_token,
              isAuthenticated: true,
              loading: false,
            });

            onSuccess?.();
          } catch (error) {
            await get().actions.logout();
            onError?.(error);
            set({ loading: false });
          }
        },

        getProfile: async onError => {
          set({ loading: true });
          try {
            const profile = await fetchProfile();
            set(state => {
              const mergedUser = {
                ...state.user,
                ...profile,
              };
              return {
                user: mergedUser,
                isAuthenticated: true,
                loading: false,
              };
            });
          } catch (error) {
            await get().actions.logout();
            onError?.(error);
            set({ loading: false });
          }
        },

        updateProfile: async (data, onSuccess, onError) => {
          set({ loading: true });
          try {
            const updatedProfile = await updateProfile(data);

            set(state => ({
              user: {
                ...state.user,
                ...updatedProfile.data,
              },
              loading: false,
            }));

            Toast.show({
              type: 'success',
              text1: 'Profil Yeniləndi',
              text2: 'Profil məlumatlarınız uğurla yeniləndi',
            });

            onSuccess?.();
          } catch (error) {
            const err: any = error;
            let errorMsg = err?.response?.data?.message;
            if (Array.isArray(errorMsg)) errorMsg = errorMsg.join('\n');
            console.error(
              'Profil güncelleme hatası:',
              err,
              err?.response?.data,
            );
            console.error('Full error response:', err?.response);
            console.error('Error response data:', err?.response?.data);
            console.error(
              'Error response message:',
              err?.response?.data?.message,
            );
            Toast.show({
              type: 'error',
              text1: 'Profil Yeniləmə Xətası',
              text2: errorMsg || 'Profil yenilənərkən xəta baş verdi',
            });
            onError?.(error);
            set({ loading: false });
          }
        },

        logout: async callback => {
          try {
            await authLogout();
          } catch (error) {}

          set({
            ...initial,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
          });

          callback?.();
        },
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
