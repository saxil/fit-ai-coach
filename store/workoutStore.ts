import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WorkoutPlan } from '@/types';
import { workoutPlans } from '@/constants/mockData';

interface CompletedWorkout {
  planId: string;
  day: number;
  date: string;
}

interface CustomWorkout {
  id: string;
  title: string;
  description: string;
  content: string;
  date: string;
}

interface WorkoutState {
  recommendedPlans: WorkoutPlan[];
  currentPlan: WorkoutPlan | null;
  completedWorkouts: CompletedWorkout[];
  customWorkouts: CustomWorkout[];
  setCurrentPlan: (plan: WorkoutPlan | null) => void;
  completeWorkout: (planId: string, day: number) => void;
  generateRecommendations: () => void;
  saveCustomWorkout: (title: string, description: string, content: string) => void;
  deleteCustomWorkout: (id: string) => void;
}

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set, get) => ({
      recommendedPlans: [],
      currentPlan: null,
      completedWorkouts: [],
      customWorkouts: [],
      setCurrentPlan: (plan) => set({ currentPlan: plan }),
      completeWorkout: (planId, day) => set((state) => ({
        completedWorkouts: [
          ...state.completedWorkouts,
          { planId, day, date: new Date().toISOString() }
        ]
      })),
      generateRecommendations: () => {
        // In a real app, this would use AI to generate personalized recommendations
        // For now, we'll just use the mock data
        set({ recommendedPlans: workoutPlans });
      },
      saveCustomWorkout: (title, description, content) => set((state) => ({
        customWorkouts: [
          ...state.customWorkouts,
          {
            id: Date.now().toString(),
            title,
            description,
            content,
            date: new Date().toISOString()
          }
        ]
      })),
      deleteCustomWorkout: (id) => set((state) => ({
        customWorkouts: state.customWorkouts.filter(workout => workout.id !== id)
      })),
    }),
    {
      name: 'workout-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);