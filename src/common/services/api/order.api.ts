import {
  IOrderListResponse,
  IOrderDetailResponse,
  ICheckoutRequest,
} from '../../types/api.types';
import { API } from '../EndpointResources.g';
import Fetcher from '../../helpers/instance';
import { REQUEST_METHODS } from '../../utils/networking';

export const getOrders = async (): Promise<IOrderListResponse> => {
  const response = await Fetcher({
    method: REQUEST_METHODS.GET,
    url: API.order.list,
  });
  return response.data;
};

export const getOrderDetail = async (
  orderId: number | string,
): Promise<IOrderDetailResponse> => {
  const response = await Fetcher({
    method: REQUEST_METHODS.GET,
    url: API.order.detail(orderId),
  });
  return response.data;
};

export const checkout = async (
  data: ICheckoutRequest,
): Promise<{ message: string; order_id: number }> => {
  const response = await Fetcher({
    method: REQUEST_METHODS.POST,
    url: API.order.checkout,
    data,
  });
  return response.data;
};
