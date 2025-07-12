import type {
  IBasketItem,
  IAddToBasketRequest,
  IRemoveFromBasketRequest,
} from '../../types/api.types';

export interface IBasketStoreActions {
  setLoading: (loading: boolean) => void;
  reset: () => void;

  getBasket: (
    onSuccess?: () => void,
    onError?: (err: any) => void,
  ) => Promise<void>;

  addToBasket: (
    productId: number | string,
    data: IAddToBasketRequest,
    onSuccess?: () => void,
    onError?: (err: any) => void,
  ) => Promise<void>;

  removeFromBasket: (
    data: IRemoveFromBasketRequest,
    onSuccess?: () => void,
    onError?: (err: any) => void,
  ) => Promise<void>;

  clearBasket: (
    basketId: number | string,
    onSuccess?: () => void,
    onError?: (err: any) => void,
  ) => Promise<void>;

  removeAllFromBasket: (
    basketId: number | string,
    onSuccess?: () => void,
    onError?: (err: any) => void,
  ) => Promise<void>;
}

export interface IBasketStore {
  loading: boolean;
  items: IBasketItem[];
  totalItems: number;
  totalPrice: number;
  actions: IBasketStoreActions;
}
