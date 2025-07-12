import type { ICampaign } from '../../types/api.types';

export interface ICampaignsStoreActions {
  setLoading: (loading: boolean) => void;
  reset: () => void;

  getCampaigns: (
    onSuccess?: () => void,
    onError?: (err: any) => void,
  ) => Promise<void>;
}

export interface ICampaignsStore {
  loading: boolean;
  campaigns: ICampaign[];
  actions: ICampaignsStoreActions;
}
