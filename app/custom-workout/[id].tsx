import React from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';
import { useWorkoutStore } from '@/store/workoutStore';
import { Trash2, Calendar, Sparkles } from 'lucide-react-native';

export default function CustomWorkoutDetailScreen() {
  const { id } = useLocalSearchParams();
  
  const customWorkouts = useWorkoutStore((state) => state.customWorkouts);
  const deleteCustomWorkout = useWorkoutStore((state) => state.deleteCustomWorkout);
  
  // Find the custom workout
  const workout = customWorkouts.find(w => w.id === id);
  
  if (!workout) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Workout not found</Text>
      </SafeAreaView>
    );
  }
  
  const handleDelete = () => {
    Alert.alert(
      "Delete Workout",
      "Are you sure you want to delete this workout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            deleteCustomWorkout(workout.id);
            router.back();
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{workout.title}</Text>
            <View style={styles.aiGeneratedBadge}>
              <Sparkles size={14} color={Colors.primary} />
              <Text style={styles.aiGeneratedText}>AI Generated</Text>
            </View>
          </View>
          
          {workout.description && (
            <Text style={styles.description}>{workout.description}</Text>
          )}
          
          <View style={styles.dateContainer}>
            <Calendar size={16} color={Colors.text.secondary} />
            <Text style={styles.dateText}>
              Created: {new Date(workout.date).toLocaleDateString()}
            </Text>
          </View>
        </View>
        
        <View style={styles.workoutContainer}>
          <Text style={styles.workoutContent}>{workout.content}</Text>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <Pressable 
          style={styles.deleteButton}
          onPress={handleDelete}
        >
          <Trash2 size={20} color={Colors.error} />
          <Text style={styles.deleteButtonText}>Delete Workout</Text>
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
    padding: 16,
    paddingBottom: 80,
  },
  header: {
    marginBottom: 24,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginRight: 8,
  },
  aiGeneratedBadge: {
    backgroundColor: `${Colors.primary}20`,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiGeneratedText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  description: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 12,
    lineHeight: 24,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 6,
  },
  workoutContainer: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
  },
  workoutContent: {
    fontSize: 16,
    color: Colors.text.primary,
    lineHeight: 24,
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
  deleteButton: {
    backgroundColor: `${Colors.error}20`,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: Colors.error,
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