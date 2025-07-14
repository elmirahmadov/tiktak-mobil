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
  try {
    const response = await Fetcher({
      method: REQUEST_METHODS.POST,
      url: API.auth.login,
      data,
    });

    const responseData =
      response.data && response.data.data ? response.data.data : response.data;

    return responseData;
  } catch (error) {
    throw error;
  }
};

export const signup = async (data: ISignupRequest): Promise<IAuthResponse> => {
  try {
    const response = await Fetcher({
      method: REQUEST_METHODS.POST,
      url: API.auth.signup,
      data,
    });

    const responseData =
      response.data && response.data.data ? response.data.data : response.data;

    return responseData;
  } catch (error) {
    throw error;
  }
};

export const refreshToken = async (
  data: IRefreshTokenRequest,
): Promise<IAuthResponse> => {
  try {
    const response = await Fetcher({
      method: REQUEST_METHODS.POST,
      url: API.auth.refresh,
      data,
    });

    const responseData =
      response.data && response.data.data ? response.data.data : response.data;

    return responseData;
  } catch (error) {
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await Fetcher({
      method: REQUEST_METHODS.POST,
      url: API.auth.logout,
    });
  } catch (error) {}
};
