import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import type { IProductsStore } from './products.types';
import {
  getProducts as fetchProducts,
  getProductDetail as fetchProductDetail,
  toggleFavorite as toggleFavoriteApi,
  getFavorites as fetchFavorites,
} from '../../services/api/products.api';

type ErrorResponse = {
  response?: {
    data: {
      message: string | string[];
    };
  };
};

const initial: Omit<IProductsStore, 'actions'> = {
  loading: false,
  products: [],
  selectedProduct: null,
  totalProducts: 0,
  currentPage: 1,
  hasMore: true,
  favorites: [],
};

const parseErrorMessage = (message: string | string[] | undefined): string => {
  if (!message) return '';
  if (Array.isArray(message)) {
    return message.join(', ');
  }
  return message.toString();
};

export const useProductsStore = create<IProductsStore>()(
  persist(
    (set, get) => ({
      ...initial,
      actions: {
        setLoading: loading => set({ loading }),

        reset: () => set({ ...initial }),

        getProducts: async (params, onSuccess, onError) => {
          set({ loading: true });
          try {
            const res = await fetchProducts(params);

            const products = res.data || [];
            const total = res.total || 0;
            const page = res.page || 1;

            const currentState = get();
            const newProducts =
              params?.page === 1
                ? products
                : [...currentState.products, ...products];
            const hasMore = newProducts.length < total;

            set({
              products: newProducts,
              totalProducts: total,
              currentPage: page,
              hasMore,
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
              text1: 'Ürünler Yüklenemedi',
              text2: errorMessage || 'Bir hata oluştu',
            });
            onError?.(error);
            set({ loading: false });
          }
        },

        getProductDetail: async (productId, onSuccess, onError) => {
          set({ loading: true });
          try {
            const res = await fetchProductDetail(productId);

            set({
              selectedProduct: res.data,
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
              text1: 'Ürün Detayı Yüklenemedi',
              text2: errorMessage || 'Bir hata oluştu',
            });
            onError?.(error);
            set({ loading: false });
          }
        },

        toggleFavorite: async (productId, onSuccess, onError) => {
          try {
            const res = await toggleFavoriteApi(productId);

            Toast.show({
              type: res.is_favorite ? 'success' : 'info',
              text1: res.is_favorite
                ? 'Favorilere Eklendi'
                : 'Favorilerden Çıkarıldı',
              text2: res.message,
            });

            await get().actions.getFavorites();

            onSuccess?.();
          } catch (error) {
            const errorResponse = error as ErrorResponse;
            const errorMessage = parseErrorMessage(
              errorResponse?.response?.data?.message,
            );

            Toast.show({
              type: 'error',
              text1: 'Favori İşlemi Başarısız',
              text2: errorMessage || 'Bir hata oluştu',
            });
            onError?.(error);
          }
        },

        getFavorites: async (onSuccess?: any, onError?: any) => {
          try {
            const data = await fetchFavorites();
            const favoriteIds = Array.isArray(data)
              ? data.map((p: any) => p.id)
              : [];
            set({ favorites: favoriteIds });
            onSuccess?.(data);
          } catch (error) {
            onError?.(error);
          }
        },
      },
    }),
    {
      name: 'products-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        products: state.products,
        favorites: state.favorites,
        totalProducts: state.totalProducts,
        currentPage: state.currentPage,
        hasMore: state.hasMore,
      }),
    },
  ),
);
