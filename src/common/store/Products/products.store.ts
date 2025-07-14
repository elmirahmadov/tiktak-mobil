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
              text1: 'Məhsullar Yüklənmədi',
              text2: errorMessage || 'Bir xəta baş verdi',
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
              text1: 'Məhsul Detalı Yüklənmədi',
              text2: errorMessage || 'Bir xəta baş verdi',
            });
            onError?.(error);
            set({ loading: false });
          }
        },

        toggleFavorite: async (productId, onSuccess, onError) => {
          try {
            await toggleFavoriteApi(productId);
            await get().actions.getFavorites();

            // Favoriler güncellendikten sonra state'ten kontrol et
            const favorites = get().favorites;
            const isNowFavorite = favorites.includes(Number(productId));

            Toast.show({
              type: isNowFavorite ? 'success' : 'info',
              text1: isNowFavorite
                ? 'Favoritlərə əlavə edildi'
                : 'Favoritlərdən çıxarıldı',
              text2: undefined,
            });

            onSuccess?.();
          } catch (error) {
            const errorResponse = error as ErrorResponse;
            const errorMessage = parseErrorMessage(
              errorResponse?.response?.data?.message,
            );

            Toast.show({
              type: 'error',
              text1: 'Favori Əməliyyatı Uğursuz Oldu',
              text2: errorMessage || 'Bir xəta baş verdi',
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
