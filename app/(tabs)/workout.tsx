import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Pressable, Modal } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';
import { useWorkoutStore } from '@/store/workoutStore';
import WorkoutCard from '@/components/WorkoutCard';
import AiWorkoutGenerator from '@/components/AiWorkoutGenerator';
import AiGeneratedWorkout from '@/components/AiGeneratedWorkout';
import { Search, Plus } from 'lucide-react-native';

export default function WorkoutsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [aiGeneratedWorkout, setAiGeneratedWorkout] = useState<string | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [workoutTitle, setWorkoutTitle] = useState('');
  const [workoutDescription, setWorkoutDescription] = useState('');
  
  const workouts = useWorkoutStore((state) => state.recommendedPlans);
  const customWorkouts = useWorkoutStore((state) => state.customWorkouts);
  const saveCustomWorkout = useWorkoutStore((state) => state.saveCustomWorkout);
  
  const handleWorkoutPress = (id: string) => {
    router.push(`/workout/${id}`);
  };

  const handleCustomWorkoutPress = (id: string) => {
    router.push(`/custom-workout/${id}`);
  };

  const handleWorkoutGenerated = (workout: string) => {
    setAiGeneratedWorkout(workout);
  };

  const handleSaveWorkout = () => {
    if (aiGeneratedWorkout && workoutTitle.trim()) {
      saveCustomWorkout(
        workoutTitle,
        workoutDescription,
        aiGeneratedWorkout
      );
      setAiGeneratedWorkout(null);
      setWorkoutTitle('');
      setWorkoutDescription('');
      setShowSaveModal(false);
    }
  };

  const handleDismissWorkout = () => {
    setAiGeneratedWorkout(null);
  };

  const filteredWorkouts = workouts.filter(workout => {
    const matchesSearch = workout.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          workout.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'All' || workout.category === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const filters = ['All', 'Strength', 'Cardio', 'Flexibility', 'HIIT'];

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Workouts</Text>
        
        <View style={styles.searchContainer}>
          <Search size={20} color={Colors.text.secondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search workouts"
            placeholderTextColor={Colors.text.light}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {filters.map((filter) => (
              <Pressable
                key={filter}
                style={[
                  styles.filterPill,
                  selectedFilter === filter && styles.activeFilterPill
                ]}
                onPress={() => setSelectedFilter(filter)}
              >
                <Text 
                  style={[
                    styles.filterText,
                    selectedFilter === filter && styles.activeFilterText
                  ]}
                >
                  {filter}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
        
        <AiWorkoutGenerator onWorkoutGenerated={handleWorkoutGenerated} />
        
        {aiGeneratedWorkout && (
          <AiGeneratedWorkout
            workout={aiGeneratedWorkout}
            onSave={() => setShowSaveModal(true)}
            onDismiss={handleDismissWorkout}
          />
        )}
        
        {customWorkouts.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>My Custom Workouts</Text>
            {customWorkouts.map((workout) => (
              <Pressable 
                key={workout.id}
                style={styles.customWorkoutCard}
                onPress={() => handleCustomWorkoutPress(workout.id)}
              >
                <View>
                  <Text style={styles.customWorkoutTitle}>{workout.title}</Text>
                  <Text style={styles.customWorkoutDescription}>{workout.description}</Text>
                  <Text style={styles.customWorkoutDate}>
                    Created: {new Date(workout.date).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.aiGeneratedBadge}>
                  <Text style={styles.aiGeneratedText}>AI</Text>
                </View>
              </Pressable>
            ))}
          </>
        )}
        
        <Text style={styles.sectionTitle}>Recommended For You</Text>
        {filteredWorkouts.map((workout) => (
          <WorkoutCard
            key={workout.id}
            workout={workout}
            onPress={() => handleWorkoutPress(workout.id)}
          />
        ))}
      </ScrollView>

      <Modal
        visible={showSaveModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSaveModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Save Custom Workout</Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder="Workout Title"
              placeholderTextColor={Colors.text.light}
              value={workoutTitle}
              onChangeText={setWorkoutTitle}
            />
            
            <TextInput
              style={[styles.modalInput, styles.modalTextarea]}
              placeholder="Description (optional)"
              placeholderTextColor={Colors.text.light}
              value={workoutDescription}
              onChangeText={setWorkoutDescription}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
            
            <View style={styles.modalButtons}>
              <Pressable 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowSaveModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              
              <Pressable 
                style={[
                  styles.modalButton, 
                  styles.saveButton,
                  !workoutTitle.trim() && styles.disabledButton
                ]}
                onPress={handleSaveWorkout}
                disabled={!workoutTitle.trim()}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 8,
    fontSize: 16,
    color: Colors.text.primary,
  },
  filterContainer: {
    marginBottom: 24,
  },
  filterPill: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  activeFilterPill: {
    backgroundColor: Colors.primary,
  },
  filterText: {
    color: Colors.text.primary,
    fontSize: 14,
  },
  activeFilterText: {
    color: Colors.card,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  customWorkoutCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  customWorkoutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  customWorkoutDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  customWorkoutDate: {
    fontSize: 12,
    color: Colors.text.light,
  },
  aiGeneratedBadge: {
    backgroundColor: `${Colors.primary}20`,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  aiGeneratedText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  modalInput: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 16,
  },
  modalTextarea: {
    minHeight: 80,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: Colors.background,
  },
  cancelButtonText: {
    color: Colors.text.primary,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: Colors.primary,
  },
  saveButtonText: {
    color: Colors.card,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: Colors.inactive,
  },
});