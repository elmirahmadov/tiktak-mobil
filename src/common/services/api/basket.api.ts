import {
  IBasketResponse,
  IAddToBasketRequest,
  IRemoveFromBasketRequest,
} from '../../types/api.types';
import { API } from '../EndpointResources.g';
import Fetcher from '../../helpers/instance';
import { REQUEST_METHODS } from '../../utils/networking';

export const getBasket = async (): Promise<IBasketResponse> => {
  const response = await Fetcher({
    method: REQUEST_METHODS.GET,
    url: API.products.basket.get,
  });
  return response.data;
};

export const addToBasket = async (
  productId: number | string,
  data: IAddToBasketRequest,
): Promise<IBasketResponse> => {
  const response = await Fetcher({
    method: REQUEST_METHODS.POST,
    url: API.products.basket.add(productId),
    data,
  });
  return response.data;
};

export const removeFromBasket = async (
  productId: number | string,
  data: IRemoveFromBasketRequest,
): Promise<IBasketResponse> => {
  const response = await Fetcher({
    method: REQUEST_METHODS.POST,
    url: `/api/tiktak/basket/${productId}/remove`,
    data,
  });
  return response.data;
};

export const clearBasket = async (
  basketId: number | string,
): Promise<{ message: string }> => {
  const response = await Fetcher({
    method: REQUEST_METHODS.DELETE,
    url: API.products.basket.clear(basketId),
  });
  return response.data;
};

export const removeAllFromBasket = async (
  basketId: number | string,
): Promise<{ message: string }> => {
  const response = await Fetcher({
    method: REQUEST_METHODS.DELETE,
    url: API.products.basket.removeAll(basketId),
  });
  return response.data;
};
