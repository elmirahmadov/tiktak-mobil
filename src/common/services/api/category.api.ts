import { ICategoryListResponse } from '../../types/api.types';
import { API } from '../EndpointResources.g';
import Fetcher from '../../helpers/instance';
import { REQUEST_METHODS } from '../../utils/networking';

export const getCategories = async (): Promise<ICategoryListResponse> => {
  const response = await Fetcher({
    method: REQUEST_METHODS.GET,
    url: API.category.list,
  });
  return response.data;
};
