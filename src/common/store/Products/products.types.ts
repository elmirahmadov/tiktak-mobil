import type { IProduct, IPaginationParams } from '../../types/api.types';

export interface IProductsStoreActions {
  setLoading: (loading: boolean) => void;
  reset: () => void;

  getProducts: (
    params?: IPaginationParams,
    onSuccess?: () => void,
    onError?: (err: any) => void,
  ) => Promise<void>;

  getProductDetail: (
    productId: number | string,
    onSuccess?: () => void,
    onError?: (err: any) => void,
  ) => Promise<void>;

  toggleFavorite: (
    productId: number | string,
    onSuccess?: () => void,
    onError?: (err: any) => void,
  ) => Promise<void>;

  getFavorites: (
    onSuccess?: (data?: any) => void,
    onError?: (err: any) => void,
  ) => Promise<void>;
}

export interface IProductsStore {
  loading: boolean;
  products: IProduct[];
  selectedProduct: IProduct | null;
  totalProducts: number;
  currentPage: number;
  hasMore: boolean;
  favorites: number[];
  actions: IProductsStoreActions;
}
