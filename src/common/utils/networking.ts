export const REQUEST_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
};

export const DEFAULT_TIMEOUT = 10000;

export const getAuthHeaders = (token?: string) =>
  token ? { Authorization: `Bearer ${token}` } : {};

export const getErrorMessage = (error: any) => {
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.message) return error.message;
  return 'Bilinmeyen hata';
};
