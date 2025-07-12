import type { ICategory } from '../../types/api.types';

export interface ICategoriesStoreActions {
  setLoading: (loading: boolean) => void;
  reset: () => void;

  getCategories: (
    onSuccess?: () => void,
    onError?: (err: any) => void,
  ) => Promise<void>;
}

export interface ICategoriesStore {
  loading: boolean;
  categories: ICategory[];
  actions: ICategoriesStoreActions;
}
