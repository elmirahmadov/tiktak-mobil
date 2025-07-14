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
  console.log('🔑 AUTH API: login isteği gönderiliyor:', data);

  try {
    const response = await Fetcher({
      method: REQUEST_METHODS.POST,
      url: API.auth.login,
      data,
    });

    console.log('✅ AUTH API: login yanıtı alındı:', response);

    // Yanıt verisi çıkarma
    const responseData =
      response.data && response.data.data ? response.data.data : response.data;

    console.log('📋 AUTH API: işlenmiş yanıt verisi:', responseData);

    return responseData;
  } catch (error) {
    console.error('❌ AUTH API: login hatası oluştu:', error);
    console.error('📌 AUTH API: hata yanıtı:', error.response?.data);
    throw error; // Hatayı store'da işlenmek üzere yeniden fırlat
  }
};

export const signup = async (data: ISignupRequest): Promise<IAuthResponse> => {
  console.log('📝 AUTH API: signup isteği gönderiliyor:', data);

  try {
    const response = await Fetcher({
      method: REQUEST_METHODS.POST,
      url: API.auth.signup,
      data,
    });

    console.log('✅ AUTH API: signup yanıtı alındı:', response);

    const responseData =
      response.data && response.data.data ? response.data.data : response.data;

    return responseData;
  } catch (error) {
    console.error('❌ AUTH API: signup hatası oluştu:', error);
    console.error('📌 AUTH API: hata yanıtı:', error.response?.data);
    throw error;
  }
};

export const refreshToken = async (
  data: IRefreshTokenRequest,
): Promise<IAuthResponse> => {
  console.log('🔄 AUTH API: token yenileme isteği gönderiliyor');

  try {
    const response = await Fetcher({
      method: REQUEST_METHODS.POST,
      url: API.auth.refresh,
      data,
    });

    console.log('✅ AUTH API: token yenileme yanıtı alındı:', response);

    const responseData =
      response.data && response.data.data ? response.data.data : response.data;

    return responseData;
  } catch (error) {
    console.error('❌ AUTH API: token yenileme hatası oluştu:', error);
    console.error('📌 AUTH API: hata yanıtı:', error.response?.data);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  console.log('🚪 AUTH API: logout isteği gönderiliyor');

  try {
    await Fetcher({
      method: REQUEST_METHODS.POST,
      url: API.auth.logout,
    });

    console.log('✅ AUTH API: logout başarılı');
  } catch (error) {
    console.error('❌ AUTH API: logout hatası oluştu:', error);
    // Logout hatasını yok sayabiliriz, bu yüzden hatayı yeniden fırlatmıyoruz
  }
};
