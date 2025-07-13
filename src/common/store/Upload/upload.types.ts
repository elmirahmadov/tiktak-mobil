export interface UploadState {
  isLoading: boolean;
  error: string | null;
  uploadedImageUrl: string | null;
}

export interface UploadActions {
  uploadImage: (file: {
    uri: string;
    type: string;
    name: string;
  }) => Promise<string>;
  resetUpload: () => void;
  setError: (error: string) => void;
}
