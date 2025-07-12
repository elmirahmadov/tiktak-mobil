import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import type { ICategoriesStore } from './categories.types';
import { getCategories as fetchCategories } from '../../services/api/category.api';

type ErrorResponse = {
  response?: {
    data: {
      message: string | string[];
    };
  };
};

const initial: Omit<ICategoriesStore, 'actions'> = {
  loading: false,
  categories: [],
};

const parseErrorMessage = (message: string | string[] | undefined): string => {
  if (!message) return '';
  if (Array.isArray(message)) {
    return message.join(', ');
  }
  return message.toString();
};

export const useCategoriesStore = create<ICategoriesStore>()(
  persist(
    (set, _get) => ({
      ...initial,
      actions: {
        setLoading: loading => set({ loading }),

        reset: () => set({ ...initial }),

        getCategories: async (onSuccess, onError) => {
          set({ loading: true });
          try {
            console.log('[getCategories] API çağrılıyor');
            const res = await fetchCategories();
            console.log('[getCategories] API response:', res);

            set({
              categories: res.data || [],
              loading: false,
            });
            console.log('[getCategories] State güncellendi:', res.data || []);

            onSuccess?.();
          } catch (error) {
            console.error('[getCategories] API ERROR:', error);
            const errorResponse = error as ErrorResponse;
            const errorMessage = parseErrorMessage(
              errorResponse?.response?.data?.message,
            );

            Toast.show({
              type: 'error',
              text1: 'Kategoriler Yüklenemedi',
              text2: errorMessage || 'Bir hata oluştu',
            });
            onError?.(error);
            set({ loading: false });
          }
        },
      },
    }),
    {
      name: 'categories-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        categories: state.categories,
      }),
    },
  ),
);
