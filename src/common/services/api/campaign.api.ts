import { ICampaignListResponse } from '../../types/api.types';
import { API } from '../EndpointResources.g';
import Fetcher from '../../helpers/instance';
import { REQUEST_METHODS } from '../../utils/networking';

export const getCampaigns = async (): Promise<ICampaignListResponse> => {
  const response = await Fetcher({
    method: REQUEST_METHODS.GET,
    url: API.campaign.list,
  });
  return response.data;
};
