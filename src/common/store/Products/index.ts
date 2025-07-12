import { useProductsStore } from './products.store';
import { IProductsStore } from './products.types';
import { shallow } from 'zustand/shallow';

export const useProductsActions = () =>
  useProductsStore((state: IProductsStore) => state.actions);

export const useProducts = () =>
  useProductsStore(
    (state: IProductsStore) => ({
      products: state.products,
      selectedProduct: state.selectedProduct,
      loading: state.loading,
      totalProducts: state.totalProducts,
      currentPage: state.currentPage,
      hasMore: state.hasMore,
      favorites: state.favorites,
    }),
    shallow,
  );

export const useProductsLoading = () =>
  useProductsStore((state: IProductsStore) => state.loading);

export const useProductsList = () =>
  useProductsStore((state: IProductsStore) => state.products);

export const useSelectedProduct = () =>
  useProductsStore((state: IProductsStore) => state.selectedProduct);

export const useFavorites = () =>
  useProductsStore((state: IProductsStore) => state.favorites);

export const useProductsPagination = () =>
  useProductsStore((state: IProductsStore) => ({
    totalProducts: state.totalProducts,
    currentPage: state.currentPage,
    hasMore: state.hasMore,
  }));

export { useProductsStore } from './products.store';
