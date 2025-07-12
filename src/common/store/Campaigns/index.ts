import { useCampaignsStore } from './campaigns.store';

export const useCampaigns = () =>
  useCampaignsStore(state => ({
    campaigns: state.campaigns,
    loading: state.loading,
  }));

export { useCampaignsStore } from './campaigns.store';
