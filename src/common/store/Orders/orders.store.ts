import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { IOrdersStore } from './orders.types';
import {
  getOrders as fetchOrders,
  getOrderDetail as fetchOrderDetail,
  checkout as checkoutApi,
} from '../../services/api/order.api';
import Toast from 'react-native-toast-message';

type ErrorResponse = {
  response?: {
    data: {
      message: string | string[];
    };
  };
};

const initial: Omit<IOrdersStore, 'actions'> = {
  loading: false,
  orders: [],
  selectedOrder: null,
  totalOrders: 0,
  currentPage: 1,
  hasMore: true,
};

const parseErrorMessage = (message: string | string[] | undefined): string => {
  if (!message) return '';
  if (Array.isArray(message)) {
    return message.join(', ');
  }
  return message.toString();
};

export const useOrdersStore = create<IOrdersStore>()(
  persist(
    (set, _get) => ({
      ...initial,
      actions: {
        setLoading: loading => set({ loading }),

        reset: () => set({ ...initial }),

        getOrders: async (onSuccess, onError) => {
          set({ loading: true });
          try {
            const res = await fetchOrders();

            const orders = res.data || [];
            const total = res.total || 0;
            const page = res.page || 1;

            set({
              orders,
              totalOrders: total,
              currentPage: page,
              hasMore: orders.length < total,
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
              text1: 'Sifarişlər Yüklənmədi',
              text2: errorMessage || 'Bir xəta baş verdi',
            });
            onError?.(error);
            set({ loading: false });
          }
        },

        getOrderDetail: async (orderId, onSuccess, onError) => {
          set({ loading: true });
          try {
            const res = await fetchOrderDetail(orderId);

            set({
              selectedOrder: res.data,
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
              text1: 'Sifariş Detalı Yüklənmədi',
              text2: errorMessage || 'Bir xəta baş verdi',
            });
            onError?.(error);
            set({ loading: false });
          }
        },

        checkout: async (data, onSuccess, onError) => {
          set({ loading: true });
          try {
            await checkoutApi(data);
            set({ loading: false });
            onSuccess?.();
          } catch (error) {
            const errorResponse = error as ErrorResponse;
            const errorMessage = parseErrorMessage(
              errorResponse?.response?.data?.message,
            );

            Toast.show({
              type: 'error',
              text1: 'Sifariş Uğursuz Oldu',
              text2: errorMessage || 'Bir xəta baş verdi',
            });
            onError?.(error);
            set({ loading: false });
          }
        },
      },
    }),
    {
      name: 'orders-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        orders: state.orders,
        totalOrders: state.totalOrders,
        currentPage: state.currentPage,
        hasMore: state.hasMore,
      }),
    },
  ),
);
