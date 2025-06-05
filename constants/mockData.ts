// Mock data for FitAI Coach

export const workoutPlans = [
  {
    id: '1',
    title: 'Beginner Strength',
    description: 'Perfect for those new to strength training',
    duration: '4 weeks',
    level: 'Beginner',
    category: 'Strength',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1740&auto=format&fit=crop',
    workouts: [
      {
        day: 1,
        exercises: [
          { name: 'Squats', sets: 3, reps: 10 },
          { name: 'Push-ups', sets: 3, reps: 8 },
          { name: 'Plank', sets: 3, duration: '30 seconds' },
        ]
      },
      {
        day: 2,
        exercises: [
          { name: 'Walking', duration: '30 minutes' },
        ]
      },
      {
        day: 3,
        exercises: [
          { name: 'Lunges', sets: 3, reps: 10 },
          { name: 'Dumbbell Rows', sets: 3, reps: 12 },
          { name: 'Bicycle Crunches', sets: 3, reps: 15 },
        ]
      }
    ]
  },
  {
    id: '2',
    title: 'HIIT Cardio Blast',
    description: 'High intensity interval training to burn calories',
    duration: '3 weeks',
    level: 'Intermediate',
    category: 'Cardio',
    image: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?q=80&w=1774&auto=format&fit=crop',
    workouts: [
      {
        day: 1,
        exercises: [
          { name: 'Jumping Jacks', duration: '45 seconds', rest: '15 seconds' },
          { name: 'Mountain Climbers', duration: '45 seconds', rest: '15 seconds' },
          { name: 'Burpees', duration: '45 seconds', rest: '15 seconds' },
          { name: 'High Knees', duration: '45 seconds', rest: '15 seconds' },
        ]
      }
    ]
  },
  {
    id: '3',
    title: 'Yoga Flow',
    description: 'Improve flexibility and mindfulness',
    duration: '4 weeks',
    level: 'All Levels',
    category: 'Flexibility',
    image: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?q=80&w=1770&auto=format&fit=crop',
    workouts: []
  },
  {
    id: '4',
    title: 'Advanced Strength',
    description: 'Challenge yourself with complex movements',
    duration: '6 weeks',
    level: 'Advanced',
    category: 'Strength',
    image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1769&auto=format&fit=crop',
    workouts: []
  }
];

export const mealPlans = [
  {
    id: '1',
    title: 'High Protein Plan',
    description: 'Ideal for muscle building and recovery',
    calories: 2200,
    meals: [
      {
        type: 'Breakfast',
        name: 'Protein Oatmeal',
        ingredients: ['Oats', 'Protein powder', 'Banana', 'Almond milk', 'Chia seeds'],
        calories: 450,
        protein: 30,
        carbs: 60,
        fat: 10,
        image: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?q=80&w=1776&auto=format&fit=crop'
      },
      {
        type: 'Lunch',
        name: 'Chicken Salad',
        ingredients: ['Grilled chicken', 'Mixed greens', 'Cherry tomatoes', 'Cucumber', 'Olive oil dressing'],
        calories: 550,
        protein: 40,
        carbs: 20,
        fat: 25,
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1770&auto=format&fit=crop'
      },
      {
        type: 'Dinner',
        name: 'Salmon with Quinoa',
        ingredients: ['Baked salmon', 'Quinoa', 'Asparagus', 'Lemon', 'Herbs'],
        calories: 650,
        protein: 45,
        carbs: 40,
        fat: 30,
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=1974&auto=format&fit=crop'
      }
    ]
  },
  {
    id: '2',
    title: 'Low Carb Plan',
    description: 'Focus on healthy fats and proteins',
    calories: 1800,
    meals: []
  },
  {
    id: '3',
    title: 'Balanced Nutrition',
    description: 'Well-rounded meals for overall health',
    calories: 2000,
    meals: []
  }
];

export const progressData = {
  weight: [
    { date: '2025-04-01', value: 185 },
    { date: '2025-04-08', value: 183 },
    { date: '2025-04-15', value: 181 },
    { date: '2025-04-22', value: 180 },
    { date: '2025-04-29', value: 178 },
    { date: '2025-05-06', value: 177 },
    { date: '2025-05-13', value: 176 },
    { date: '2025-05-20', value: 175 },
    { date: '2025-05-27', value: 174 },
  ],
  workouts: [
    { date: '2025-05-01', count: 1 },
    { date: '2025-05-03', count: 1 },
    { date: '2025-05-05', count: 1 },
    { date: '2025-05-08', count: 1 },
    { date: '2025-05-10', count: 1 },
    { date: '2025-05-12', count: 1 },
    { date: '2025-05-15', count: 1 },
    { date: '2025-05-17', count: 1 },
    { date: '2025-05-19', count: 1 },
    { date: '2025-05-22', count: 1 },
    { date: '2025-05-24', count: 1 },
    { date: '2025-05-26', count: 1 },
    { date: '2025-05-29', count: 1 },
  ]
};

export const motivationalQuotes = [
  "The only bad workout is the one that didn't happen.",
  "Your body can stand almost anything. It's your mind that you have to convince.",
  "Fitness is not about being better than someone else. It's about being better than you used to be.",
  "The hard days are the best because that's when champions are made.",
  "Don't wish for it, work for it.",
  "Strength does not come from the body. It comes from the will.",
  "The difference between try and triumph is a little umph.",
  "The only place where success comes before work is in the dictionary.",
  "Your health is an investment, not an expense.",
  "The pain you feel today will be the strength you feel tomorrow."
];