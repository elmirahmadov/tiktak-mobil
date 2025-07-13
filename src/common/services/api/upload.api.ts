import instance from '../../helpers/instance';
import { API } from '../EndpointResources.g';

export const uploadImage = async (file: {
  uri: string;
  type: string;
  name: string;
}) => {
  const formData = new FormData();
  formData.append('file', file);

  console.log('Upload API call - URL:', API.upload.image);
  console.log('Upload API call - FormData:', formData);

  const response = await instance.post(API.upload.image, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  console.log('Upload API response status:', response.status);
  console.log('Upload API response data:', response.data);

  return response.data;
};
