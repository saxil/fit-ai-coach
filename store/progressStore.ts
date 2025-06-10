import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WeightData } from '@/types';

interface ProgressState {
  weightEntries: WeightData[];
  addWeightEntry: (weight: number) => void;
  getWeightTrend: () => 'up' | 'down' | 'stable' | null;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      weightEntries: [],
      addWeightEntry: (weight) => set((state) => ({
        weightEntries: [
          ...state.weightEntries,
          { date: new Date().toISOString(), value: weight }
        ]
      })),
      getWeightTrend: () => {
        const entries = get().weightEntries;
        if (entries.length < 2) return null;
        
        const sortedEntries = [...entries].sort((a, b) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        
        const latest = sortedEntries[sortedEntries.length - 1].value;
        const previous = sortedEntries[sortedEntries.length - 2].value;
        
        if (latest > previous) return 'up';
        if (latest < previous) return 'down';
        return 'stable';
      },
    }),
    {
      name: 'progress-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);