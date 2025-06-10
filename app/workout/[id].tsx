import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';
import { useWorkoutStore } from '@/store/workoutStore';
import { workoutPlans } from '@/constants/mockData';
import { Clock, Dumbbell, Award, CheckCircle, Sparkles } from 'lucide-react-native';
import AiWorkoutGenerator from '@/components/AiWorkoutGenerator';
import AiGeneratedWorkout from '@/components/AiGeneratedWorkout';

export default function WorkoutDetailScreen() {
  const { id } = useLocalSearchParams();
  const [selectedDay, setSelectedDay] = useState(1);
  const [showAiGenerator, setShowAiGenerator] = useState(false);
  const [aiGeneratedWorkout, setAiGeneratedWorkout] = useState<string | null>(null);
  
  const completeWorkout = useWorkoutStore((state) => state.completeWorkout);
  const saveCustomWorkout = useWorkoutStore((state) => state.saveCustomWorkout);
  
  // Find the workout plan from mock data
  const workoutPlan = workoutPlans.find(plan => plan.id === id);
  
  if (!workoutPlan) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Workout not found</Text>
      </SafeAreaView>
    );
  }
  
  const handleCompleteWorkout = () => {
    completeWorkout(workoutPlan.id, selectedDay);
    router.back();
  };
  
  const handleWorkoutGenerated = (workout: string) => {
    setAiGeneratedWorkout(workout);
    setShowAiGenerator(false);
  };

  const handleSaveCustomWorkout = () => {
    if (aiGeneratedWorkout) {
      saveCustomWorkout(
        `${workoutPlan.title} (AI Modified)`,
        `AI-modified version of ${workoutPlan.title}`,
        aiGeneratedWorkout
      );
      setAiGeneratedWorkout(null);
      router.back();
    }
  };
  
  // Get the selected day's workout
  const dayWorkout = workoutPlan.workouts.find(w => w.day === selectedDay);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image
          source={{ uri: workoutPlan.image }}
          style={styles.coverImage}
          contentFit="cover"
        />
        
        <View style={styles.content}>
          <Text style={styles.title}>{workoutPlan.title}</Text>
          <Text style={styles.description}>{workoutPlan.description}</Text>
          
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Clock size={16} color={Colors.text.secondary} />
              <Text style={styles.metaText}>{workoutPlan.duration}</Text>
            </View>
            <View style={styles.metaItem}>
              <Dumbbell size={16} color={Colors.text.secondary} />
              <Text style={styles.metaText}>{workoutPlan.category}</Text>
            </View>
            <View style={styles.metaItem}>
              <Award size={16} color={Colors.text.secondary} />
              <Text style={styles.metaText}>{workoutPlan.level}</Text>
            </View>
          </View>
          
          {!showAiGenerator && !aiGeneratedWorkout && (
            <Pressable 
              style={styles.customizeButton}
              onPress={() => setShowAiGenerator(true)}
            >
              <Sparkles size={20} color={Colors.primary} />
              <Text style={styles.customizeButtonText}>Customize with AI</Text>
            </Pressable>
          )}
          
          {showAiGenerator && (
            <AiWorkoutGenerator onWorkoutGenerated={handleWorkoutGenerated} />
          )}
          
          {aiGeneratedWorkout && (
            <AiGeneratedWorkout
              workout={aiGeneratedWorkout}
              onSave={handleSaveCustomWorkout}
              onDismiss={() => setAiGeneratedWorkout(null)}
            />
          )}
          
          <Text style={styles.sectionTitle}>Workout Schedule</Text>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.daysContainer}
          >
            {workoutPlan.workouts.map((workout) => (
              <Pressable
                key={workout.day}
                style={[
                  styles.dayPill,
                  selectedDay === workout.day && styles.selectedDayPill
                ]}
                onPress={() => setSelectedDay(workout.day)}
              >
                <Text 
                  style={[
                    styles.dayText,
                    selectedDay === workout.day && styles.selectedDayText
                  ]}
                >
                  Day {workout.day}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
          
          {dayWorkout ? (
            <>
              <Text style={styles.sectionTitle}>Exercises</Text>
              {dayWorkout.exercises.map((exercise, index) => (
                <View key={index} style={styles.exerciseCard}>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                  <View style={styles.exerciseDetails}>
                    {exercise.sets !== undefined && exercise.reps !== undefined && (
                      <Text style={styles.exerciseText}>
                        {exercise.sets} sets × {exercise.reps} reps
                      </Text>
                    )}
                    {exercise.sets !== undefined && exercise.duration && !exercise.reps && (
                      <Text style={styles.exerciseText}>
                        {exercise.sets} sets × {exercise.duration}
                      </Text>
                    )}
                    {!exercise.sets && exercise.duration && (
                      <Text style={styles.exerciseText}>
                        {exercise.duration}
                      </Text>
                    )}
                    {exercise.rest && (
                      <Text style={styles.exerciseText}>
                        Rest: {exercise.rest}
                      </Text>
                    )}
                  </View>
                </View>
              ))}
            </>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No exercises for this day</Text>
            </View>
          )}
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <Pressable 
          style={styles.completeButton}
          onPress={handleCompleteWorkout}
        >
          <CheckCircle size={20} color={Colors.card} />
          <Text style={styles.completeButtonText}>Complete Workout</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  coverImage: {
    width: '100%',
    height: 240,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 16,
    lineHeight: 24,
  },
  metaContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    color: Colors.text.secondary,
    fontSize: 14,
    marginLeft: 4,
  },
  customizeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${Colors.primary}20`,
    borderRadius: 12,
    paddingVertical: 12,
    marginBottom: 24,
  },
  customizeButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  daysContainer: {
    marginBottom: 24,
  },
  dayPill: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  selectedDayPill: {
    backgroundColor: Colors.primary,
  },
  dayText: {
    color: Colors.text.primary,
    fontSize: 14,
  },
  selectedDayText: {
    color: Colors.card,
    fontWeight: '600',
  },
  exerciseCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  exerciseDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  exerciseText: {
    color: Colors.text.secondary,
    fontSize: 14,
    backgroundColor: Colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: Colors.text.light,
    fontSize: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  completeButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeButtonText: {
    color: Colors.card,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  errorText: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginTop: 24,
  },
});