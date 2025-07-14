import { create } from 'zustand';
import { uploadImage } from '../../services/api/upload.api';
import { UploadState, UploadActions } from './upload.types';

type UploadStore = UploadState & UploadActions;

export const useUploadStore = create<UploadStore>((set, _get) => ({
  isLoading: false,
  error: null,
  uploadedImageUrl: null,

  uploadImage: async file => {
    try {
      set({ isLoading: true, error: null });

      const response = await uploadImage(file);

      const imageUrl =
        response.img_url ||
        response.url ||
        response.data?.img_url ||
        response.data?.url;

      set({
        isLoading: false,
        uploadedImageUrl: imageUrl,
        error: null,
      });

      return imageUrl;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Upload failed';
      set({
        isLoading: false,
        error: errorMessage,
        uploadedImageUrl: null,
      });
      throw error;
    }
  },

  resetUpload: () => {
    set({
      isLoading: false,
      error: null,
      uploadedImageUrl: null,
    });
  },

  setError: (error: string) => {
    set({ error });
  },
}));
