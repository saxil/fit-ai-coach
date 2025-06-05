export interface Workout {
  day: number;
  exercises: Exercise[];
}

export interface Exercise {
  name: string;
  sets?: number;
  reps?: number;
  duration?: string;
  rest?: string;
}

export interface WorkoutPlan {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  category: string;
  image: string;
  workouts: Workout[];
}

export interface Meal {
  type: string;
  name: string;
  ingredients: string[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  image: string;
}

export interface MealPlan {
  id: string;
  title: string;
  description: string;
  calories: number;
  meals: Meal[];
}

export interface WeightData {
  date: string;
  value: number;
}

export interface WorkoutData {
  date: string;
  count: number;
}

export interface ProgressData {
  weight: WeightData[];
  workouts: WorkoutData[];
}

export interface UserProfile {
  name: string;
  age: number;
  weight: number;
  height: number;
  goal: string;
  fitnessLevel: string;
  profileImage?: string;
}