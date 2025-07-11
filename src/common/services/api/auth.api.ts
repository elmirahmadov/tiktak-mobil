import {
  IAuthResponse,
  ILoginRequest,
  ISignupRequest,
  IRefreshTokenRequest,
} from '../../types/api.types';
import { API } from '../EndpointResources.g';
import Fetcher from '../../helpers/instance';
import { REQUEST_METHODS } from '../../utils/networking';

export const login = async (data: ILoginRequest): Promise<IAuthResponse> => {
  const response = await Fetcher({
    method: REQUEST_METHODS.POST,
    url: API.auth.login,
    data,
  });
  return response.data && response.data.data
    ? response.data.data
    : response.data;
};

export const signup = async (data: ISignupRequest): Promise<IAuthResponse> => {
  const response = await Fetcher({
    method: REQUEST_METHODS.POST,
    url: API.auth.signup,
    data,
  });
  return response.data && response.data.data
    ? response.data.data
    : response.data;
};

export const refreshToken = async (
  data: IRefreshTokenRequest,
): Promise<IAuthResponse> => {
  const response = await Fetcher({
    method: REQUEST_METHODS.POST,
    url: API.auth.refresh,
    data,
  });
  return response.data && response.data.data
    ? response.data.data
    : response.data;
};

export const logout = async (): Promise<void> => {
  await Fetcher({
    method: REQUEST_METHODS.POST,
    url: API.auth.logout,
  });
};
