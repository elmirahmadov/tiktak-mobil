import { useOrdersStore } from './orders.store';
import { IOrdersStore } from './orders.types';

export const useOrdersActions = () =>
  useOrdersStore((state: IOrdersStore) => state.actions);

export const useOrders = () =>
  useOrdersStore((state: IOrdersStore) => ({
    orders: state.orders,
    selectedOrder: state.selectedOrder,
    loading: state.loading,
    totalOrders: state.totalOrders,
    currentPage: state.currentPage,
    hasMore: state.hasMore,
  }));

export const useOrdersLoading = () =>
  useOrdersStore((state: IOrdersStore) => state.loading);

export const useOrdersList = () =>
  useOrdersStore((state: IOrdersStore) => state.orders);

export const useSelectedOrder = () =>
  useOrdersStore((state: IOrdersStore) => state.selectedOrder);

export const useOrdersPagination = () =>
  useOrdersStore((state: IOrdersStore) => ({
    totalOrders: state.totalOrders,
    currentPage: state.currentPage,
    hasMore: state.hasMore,
  }));

export { useOrdersStore } from './orders.store';
