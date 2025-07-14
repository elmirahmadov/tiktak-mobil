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
            const res = await fetchCampaigns();

            set({
              campaigns: res.data || [],
              loading: false,
            });

            onSuccess?.();
          } catch (error) {
            console.error('[getCampaigns] API ERROR:', error);
            const errorResponse = error as ErrorResponse;
            const errorMessage = parseErrorMessage(
              errorResponse?.response?.data?.message,
            );

            Toast.show({
              type: 'error',
              text1: 'Kampaniyalar Yüklənmədi',
              text2: errorMessage || 'Bir xəta baş verdi',
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
