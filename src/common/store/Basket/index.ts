import { useBasketStore } from './basket.store';
import { IBasketStore } from './basket.types';

export const useBasketActions = () =>
  useBasketStore((state: IBasketStore) => state.actions);

export const useBasket = () =>
  useBasketStore((state: IBasketStore) => ({
    items: state.items,
    loading: state.loading,
    totalItems: state.totalItems,
    totalPrice: state.totalPrice,
  }));

export const useBasketLoading = () =>
  useBasketStore((state: IBasketStore) => state.loading);

export const useBasketItems = () =>
  useBasketStore((state: IBasketStore) => state.items);

export const useBasketTotal = () =>
  useBasketStore((state: IBasketStore) => ({
    totalItems: state.totalItems,
    totalPrice: state.totalPrice,
  }));

export { useBasketStore } from './basket.store';
