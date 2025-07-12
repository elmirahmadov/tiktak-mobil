import type { IOrder, ICheckoutRequest } from '../../types/api.types';

export interface IOrdersStoreActions {
  setLoading: (loading: boolean) => void;
  reset: () => void;

  getOrders: (
    onSuccess?: () => void,
    onError?: (err: any) => void,
  ) => Promise<void>;

  getOrderDetail: (
    orderId: number | string,
    onSuccess?: () => void,
    onError?: (err: any) => void,
  ) => Promise<void>;

  checkout: (
    data: ICheckoutRequest,
    onSuccess?: () => void,
    onError?: (err: any) => void,
  ) => Promise<void>;
}

export interface IOrdersStore {
  loading: boolean;
  orders: IOrder[];
  selectedOrder: IOrder | null;
  totalOrders: number;
  currentPage: number;
  hasMore: boolean;
  actions: IOrdersStoreActions;
}
