import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '@/types';

interface UserState {
  profile: UserProfile | null;
  isOnboarded: boolean;
  setProfile: (profile: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  setOnboarded: (value: boolean) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      profile: null,
      isOnboarded: false,
      setProfile: (profile) => set({ profile }),
      updateProfile: (updates) => 
        set((state) => ({ 
          profile: state.profile ? { ...state.profile, ...updates } : null 
        })),
      setOnboarded: (value) => set({ isOnboarded: value }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);