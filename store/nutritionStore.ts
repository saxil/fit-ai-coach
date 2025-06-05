import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MealPlan, Meal } from '@/types';
import { mealPlans } from '@/constants/mockData';

interface NutritionState {
  recommendedPlans: MealPlan[];
  currentPlan: MealPlan | null;
  consumedMeals: { mealId: string; date: string }[];
  setCurrentPlan: (plan: MealPlan | null) => void;
  logMeal: (mealId: string) => void;
  generateRecommendations: () => void;
}

export const useNutritionStore = create<NutritionState>()(
  persist(
    (set) => ({
      recommendedPlans: [],
      currentPlan: null,
      consumedMeals: [],
      setCurrentPlan: (plan) => set({ currentPlan: plan }),
      logMeal: (mealId) => set((state) => ({
        consumedMeals: [
          ...state.consumedMeals,
          { mealId, date: new Date().toISOString() }
        ]
      })),
      generateRecommendations: () => {
        // In a real app, this would use AI to generate personalized recommendations
        // For now, we'll just use the mock data
        set({ recommendedPlans: mealPlans });
      },
    }),
    {
      name: 'nutrition-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);