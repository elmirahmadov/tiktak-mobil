import { IUser } from '../../types/api.types';
import { API } from '../EndpointResources.g';
import Fetcher from '../../helpers/instance';
import { REQUEST_METHODS } from '../../utils/networking';

export const getProfile = async (): Promise<IUser> => {
  const response = await Fetcher({
    method: REQUEST_METHODS.GET,
    url: API.client.profile,
  });
  return response.data.data; // Sadece user objesi dön
};

export const updateProfile = async (data: any) => {
  return Fetcher({
    method: REQUEST_METHODS.PUT,
    url: API.client.profile,
    data,
  });
};
