import {
  IProductListResponse,
  IProductDetailResponse,
  IFavoriteResponse,
  IPaginationParams,
} from '../../types/api.types';
import { API } from '../EndpointResources.g';
import Fetcher from '../../helpers/instance';
import { REQUEST_METHODS } from '../../utils/networking';

export const getProducts = async (
  params?: IPaginationParams,
): Promise<IProductListResponse> => {
  const response = await Fetcher({
    method: REQUEST_METHODS.GET,
    url: API.products.list,
    params,
  });
  return response.data;
};

export const getProductDetail = async (
  productId: number | string,
): Promise<IProductDetailResponse> => {
  const response = await Fetcher({
    method: REQUEST_METHODS.GET,
    url: API.products.detail(productId),
  });
  return response.data;
};

export const toggleFavorite = async (
  productId: number | string,
): Promise<IFavoriteResponse> => {
  const response = await Fetcher({
    method: REQUEST_METHODS.POST,
    url: API.products.favorites.post(productId),
  });
  return response.data;
};

export const getFavorites = async () => {
  const response = await Fetcher({
    method: REQUEST_METHODS.GET,
    url: '/api/tiktak/products/favorites',
  });
  return response.data.data;
};
