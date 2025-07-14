import instance from '../../helpers/instance';
import { API } from '../EndpointResources.g';

export const uploadImage = async (file: {
  uri: string;
  type: string;
  name: string;
}) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await instance.post(API.upload.image, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};
