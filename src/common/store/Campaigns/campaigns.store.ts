import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import type { ICampaignsStore } from './campaigns.types';
import { getCampaigns as fetchCampaigns } from '../../services/api/campaign.api';

type ErrorResponse = {
  response?: {
    data: {
      message: string | string[];
    };
  };
};

const initial: Omit<ICampaignsStore, 'actions'> = {
  loading: false,
  campaigns: [],
};

const parseErrorMessage = (message: string | string[] | undefined): string => {
  if (!message) return '';
  if (Array.isArray(message)) {
    return message.join(', ');
  }
  return message.toString();
};

export const useCampaignsStore = create<ICampaignsStore>()(
  persist(
    (set, _get) => ({
      ...initial,
      actions: {
        setLoading: loading => set({ loading }),

        reset: () => set({ ...initial }),

        getCampaigns: async (onSuccess, onError) => {
          set({ loading: true });
          try {
            console.log('[getCampaigns] API çağrılıyor');
            const res = await fetchCampaigns();
            console.log('[getCampaigns] API response:', res);

            set({
              campaigns: res.data || [],
              loading: false,
            });
            console.log('[getCampaigns] State güncellendi:', res.data || []);

            onSuccess?.();
          } catch (error) {
            console.error('[getCampaigns] API ERROR:', error);
            const errorResponse = error as ErrorResponse;
            const errorMessage = parseErrorMessage(
              errorResponse?.response?.data?.message,
            );

            Toast.show({
              type: 'error',
              text1: 'Kampanyalar Yüklenemedi',
              text2: errorMessage || 'Bir hata oluştu',
            });
            onError?.(error);
            set({ loading: false });
          }
        },
      },
    }),
    {
      name: 'campaigns-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        campaigns: state.campaigns,
      }),
    },
  ),
);
