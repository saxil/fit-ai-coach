import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';
import { useUserStore } from '@/store/userStore';
import { useWorkoutStore } from '@/store/workoutStore';
import WorkoutCard from '@/components/WorkoutCard';
import MotivationalCard from '@/components/MotivationalCard';
import AiSuggestionCard from '@/components/AiSuggestionCard';
import { motivationalQuotes } from '@/constants/mockData';

export default function HomeScreen() {
  const [isGeneratingAdvice, setIsGeneratingAdvice] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  
  const profile = useUserStore((state) => state.profile);
  const recommendedWorkouts = useWorkoutStore((state) => state.recommendedPlans);
  
  const handleWorkoutPress = (id: string) => {
    router.push(`/workout/${id}`);
  };

  const generateAiAdvice = async () => {
    setIsGeneratingAdvice(true);
    
    try {
      // Simulate AI request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Get a random quote as mock AI advice
      const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
      setAiAdvice(motivationalQuotes[randomIndex]);
    } catch (error) {
      console.error('Error generating AI advice:', error);
    } finally {
      setIsGeneratingAdvice(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {profile?.name || 'there'}!</Text>
            <Text style={styles.subtitle}>Ready for your workout today?</Text>
          </View>
        </View>
        
        <MotivationalCard />
        
        <Text style={styles.sectionTitle}>AI Fitness Coach</Text>
        <AiSuggestionCard
          title="Get Personalized Advice"
          description="Ask for workout tips, nutrition guidance, or motivation"
          onPress={generateAiAdvice}
          isLoading={isGeneratingAdvice}
        />
        
        {aiAdvice && (
          <View style={styles.aiResponseContainer}>
            <Text style={styles.aiResponseTitle}>AI Coach Says:</Text>
            <Text style={styles.aiResponseText}>{aiAdvice}</Text>
          </View>
        )}
        
        <Text style={styles.sectionTitle}>Recommended Workouts</Text>
        {recommendedWorkouts.slice(0, 2).map((workout) => (
          <WorkoutCard
            key={workout.id}
            workout={workout}
            onPress={() => handleWorkoutPress(workout.id)}
          />
        ))}
        
        <Pressable 
          style={styles.viewAllButton}
          onPress={() => router.push('/workouts')}
        >
          <Text style={styles.viewAllText}>View All Workouts</Text>
        </Pressable>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  aiResponseContainer: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  aiResponseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  aiResponseText: {
    fontSize: 16,
    color: Colors.text.secondary,
    lineHeight: 24,
  },
  viewAllButton: {
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 16,
  },
  viewAllText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});