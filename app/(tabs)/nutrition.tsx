import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';
import { useNutritionStore } from '@/store/nutritionStore';
import MealCard from '@/components/MealCard';
import AiSuggestionCard from '@/components/AiSuggestionCard';

export default function NutritionScreen() {
  const mealPlans = useNutritionStore((state) => state.recommendedPlans);
  
  const handleMealPress = (mealId: string) => {
    router.push(`/meal/${mealId}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Nutrition</Text>
        
        <AiSuggestionCard
          title="Get Meal Recommendations"
          description="Let AI suggest meals based on your goals and preferences"
          onPress={() => {}}
        />
        
        <View style={styles.macrosContainer}>
          <Text style={styles.macrosTitle}>Daily Targets</Text>
          <View style={styles.macrosGrid}>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>2,100</Text>
              <Text style={styles.macroLabel}>Calories</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>160g</Text>
              <Text style={styles.macroLabel}>Protein</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>210g</Text>
              <Text style={styles.macroLabel}>Carbs</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>70g</Text>
              <Text style={styles.macroLabel}>Fat</Text>
            </View>
          </View>
        </View>
        
        <Text style={styles.sectionTitle}>Meal Plans</Text>
        {mealPlans.map((plan) => (
          <View key={plan.id} style={styles.mealPlanContainer}>
            <View style={styles.mealPlanHeader}>
              <View>
                <Text style={styles.mealPlanTitle}>{plan.title}</Text>
                <Text style={styles.mealPlanDescription}>{plan.description}</Text>
              </View>
              <View style={styles.caloriesBadge}>
                <Text style={styles.caloriesText}>{plan.calories} cal</Text>
              </View>
            </View>
            
            {plan.meals.length > 0 ? (
              plan.meals.map((meal, index) => (
                <MealCard
                  key={index}
                  meal={meal}
                  onPress={() => handleMealPress(plan.id)}
                />
              ))
            ) : (
              <Text style={styles.emptyText}>No meals available for this plan</Text>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  macrosContainer: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  macrosTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  macrosGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroItem: {
    alignItems: 'center',
  },
  macroValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  macroLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  mealPlanContainer: {
    marginBottom: 24,
  },
  mealPlanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  mealPlanTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  mealPlanDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  caloriesBadge: {
    backgroundColor: `${Colors.secondary}20`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  caloriesText: {
    color: Colors.secondary,
    fontWeight: '600',
  },
  emptyText: {
    color: Colors.text.light,
    textAlign: 'center',
    padding: 16,
  },
});