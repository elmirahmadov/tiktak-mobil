import { useCategoriesStore } from './categories.store';

export const useCategories = () =>
  useCategoriesStore(state => ({
    categories: state.categories,
    loading: state.loading,
  }));

export { useCategoriesStore } from './categories.store';
