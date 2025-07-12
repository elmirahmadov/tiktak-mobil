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
          text1: 'Sepet Yüklenemedi',
          text2: errorMessage || 'Bir hata oluştu',
        });
        onError?.(error);
        set({ loading: false });
      }
    },

    addToBasket: async (productId, data, onSuccess, onError) => {
      set({ loading: true });
      try {
        console.log('[BasketStore] addToBasket çağrıldı:', productId, data);
        const res = await addToBasketApi(productId, data);
        console.log('[BasketStore] API response:', res);

        const basketData = (res.data as any) || {};
        set({
          items: basketData.items || [],
          totalItems: basketData.count || 0,
          totalPrice: parseFloat(basketData.total) || 0,
          loading: false,
        });
        console.log('[BasketStore] Yeni state:', {
          items: basketData.items || [],
          totalItems: basketData.count || 0,
          totalPrice: parseFloat(basketData.total) || 0,
          loading: false,
        });

        Toast.show({
          type: 'success',
          text1: 'Sepete Eklendi',
          text2: 'Ürün başarıyla sepete eklendi',
        });

        onSuccess?.();
      } catch (error) {
        console.log('[BasketStore] HATA:', error);
        const errorResponse = error as ErrorResponse;
        const errorMessage = parseErrorMessage(
          errorResponse?.response?.data?.message,
        );

        Toast.show({
          type: 'error',
          text1: 'Sepete Eklenemedi',
          text2: errorMessage || 'Bir hata oluştu',
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

        Toast.show({
          type: 'success',
          text1: 'Sepetten Çıkarıldı',
          text2: 'Ürün sepetten çıkarıldı',
        });

        onSuccess?.();
      } catch (error) {
        const errorResponse = error as ErrorResponse;
        const errorMessage = parseErrorMessage(
          errorResponse?.response?.data?.message,
        );

        Toast.show({
          type: 'error',
          text1: 'Çıkarma İşlemi Başarısız',
          text2: errorMessage || 'Bir hata oluştu',
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

        Toast.show({
          type: 'success',
          text1: 'Sepet Temizlendi',
          text2: 'Sepet başarıyla temizlendi',
        });

        onSuccess?.();
      } catch (error) {
        const errorResponse = error as ErrorResponse;
        const errorMessage = parseErrorMessage(
          errorResponse?.response?.data?.message,
        );

        Toast.show({
          type: 'error',
          text1: 'Sepet Temizlenemedi',
          text2: errorMessage || 'Bir hata oluştu',
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

        Toast.show({
          type: 'success',
          text1: 'Tüm Ürünler Çıkarıldı',
          text2: 'Tüm ürünler sepetten çıkarıldı',
        });

        onSuccess?.();
      } catch (error) {
        const errorResponse = error as ErrorResponse;
        const errorMessage = parseErrorMessage(
          errorResponse?.response?.data?.message,
        );

        Toast.show({
          type: 'error',
          text1: 'Çıkarma İşlemi Başarısız',
          text2: errorMessage || 'Bir hata oluştu',
        });
        onError?.(error);
        set({ loading: false });
      }
    },
  },
}));
