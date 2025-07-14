import { create } from 'zustand';
import Toast from 'react-native-toast-message';
import type { IBasketStore } from './basket.types';
import {
  getBasket as fetchBasket,
  addToBasket as addToBasketApi,
  removeFromBasket as removeFromBasketApi,
  clearBasket as clearBasketApi,
  removeAllFromBasket as removeAllFromBasketApi,
} from '../../services/api/basket.api';

type ErrorResponse = {
  response?: {
    data: {
      message: string | string[];
    };
  };
};

const initial: Omit<IBasketStore, 'actions'> = {
  loading: false,
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

const parseErrorMessage = (message: string | string[] | undefined): string => {
  if (!message) return '';
  if (Array.isArray(message)) {
    return message.join(', ');
  }
  return message.toString();
};

export const useBasketStore = create<IBasketStore>()((set, _get) => ({
  ...initial,
  actions: {
    setLoading: loading => set({ loading }),

    reset: () => set({ ...initial }),

    getBasket: async (onSuccess, onError) => {
      set({ loading: true });
      try {
        const res = await fetchBasket();

        const basketData = (res.data as any) || {};
        set({
          items: basketData.items || [],
          totalItems: basketData.count || 0,
          totalPrice: parseFloat(basketData.total) || 0,
          loading: false,
        });

        onSuccess?.();
      } catch (error) {
        const errorResponse = error as ErrorResponse;
        const errorMessage = parseErrorMessage(
          errorResponse?.response?.data?.message,
        );

        Toast.show({
          type: 'error',
          text1: 'Səbət Yüklənmədi',
          text2: errorMessage || 'Bir xəta baş verdi',
        });
        onError?.(error);
        set({ loading: false });
      }
    },

    addToBasket: async (productId, data, onSuccess, onError) => {
      set({ loading: true });
      try {
        const res = await addToBasketApi(productId, data);

        const basketData = (res.data as any) || {};
        set({
          items: basketData.items || [],
          totalItems: basketData.count || 0,
          totalPrice: parseFloat(basketData.total) || 0,
          loading: false,
        });

        onSuccess?.();
      } catch (error) {
        const errorResponse = error as ErrorResponse;
        const errorMessage = parseErrorMessage(
          errorResponse?.response?.data?.message,
        );

        Toast.show({
          type: 'error',
          text1: 'Səbətə Əlavə Olunmadı',
          text2: errorMessage || 'Bir xəta baş verdi',
        });
        onError?.(error);
        set({ loading: false });
      }
    },

    removeFromBasket: async (data, onSuccess, onError) => {
      set({ loading: true });
      try {
        const res = await removeFromBasketApi(data.product_id, data);

        const basketData = (res.data as any) || {};
        set({
          items: basketData.items || [],
          totalItems: basketData.count || 0,
          totalPrice: parseFloat(basketData.total) || 0,
          loading: false,
        });

        onSuccess?.();
      } catch (error) {
        const errorResponse = error as ErrorResponse;
        const errorMessage = parseErrorMessage(
          errorResponse?.response?.data?.message,
        );

        Toast.show({
          type: 'error',
          text1: 'Çıxarma Əməliyyatı Uğursuz Oldu',
          text2: errorMessage || 'Bir xəta baş verdi',
        });
        onError?.(error);
        set({ loading: false });
      }
    },

    clearBasket: async (basketId, onSuccess, onError) => {
      set({ loading: true });
      try {
        await clearBasketApi(basketId);

        set({
          items: [],
          totalItems: 0,
          totalPrice: 0,
          loading: false,
        });

        onSuccess?.();
      } catch (error) {
        const errorResponse = error as ErrorResponse;
        const errorMessage = parseErrorMessage(
          errorResponse?.response?.data?.message,
        );

        Toast.show({
          type: 'error',
          text1: 'Səbət Təmizlənmədi',
          text2: errorMessage || 'Bir xəta baş verdi',
        });
        onError?.(error);
        set({ loading: false });
      }
    },

    removeAllFromBasket: async (basketId, onSuccess, onError) => {
      set({ loading: true });
      try {
        await removeAllFromBasketApi(basketId);

        set({
          items: [],
          totalItems: 0,
          totalPrice: 0,
          loading: false,
        });

        onSuccess?.();
      } catch (error) {
        const errorResponse = error as ErrorResponse;
        const errorMessage = parseErrorMessage(
          errorResponse?.response?.data?.message,
        );

        Toast.show({
          type: 'error',
          text1: 'Çıxarma Əməliyyatı Uğursuz Oldu',
          text2: errorMessage || 'Bir xəta baş verdi',
        });
        onError?.(error);
        set({ loading: false });
      }
    },
  },
}));
