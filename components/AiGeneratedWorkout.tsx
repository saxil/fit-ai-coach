import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import Colors from '@/constants/colors';
import { Download, X } from 'lucide-react-native';

interface AiGeneratedWorkoutProps {
  workout: string;
  onSave: () => void;
  onDismiss: () => void;
}

export default function AiGeneratedWorkout({ 
  workout, 
  onSave, 
  onDismiss 
}: AiGeneratedWorkoutProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Generated Workout</Text>
        <Pressable 
          style={styles.closeButton}
          onPress={onDismiss}
        >
          <X size={20} color={Colors.text.secondary} />
        </Pressable>
      </View>
      
      <View style={styles.workoutContainer}>
        <Text style={styles.workoutText}>{workout}</Text>
      </View>
      
      <Pressable 
        style={({ pressed }) => [
          styles.saveButton,
          pressed && styles.saveButtonPressed
        ]}
        onPress={onSave}
      >
        <Download size={20} color={Colors.card} />
        <Text style={styles.saveButtonText}>Save to My Workouts</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  workoutContainer: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  workoutText: {
    fontSize: 14,
    color: Colors.text.primary,
    lineHeight: 22,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonPressed: {
    opacity: 0.8,
  },
  saveButtonText: {
    color: Colors.card,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});