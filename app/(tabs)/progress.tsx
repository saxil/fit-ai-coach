import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';
import { useProgressStore } from '@/store/progressStore';
import { useUserStore } from '@/store/userStore';
import ProgressChart from '@/components/ProgressChart';
import { progressData } from '@/constants/mockData';
import { Plus } from 'lucide-react-native';

export default function ProgressScreen() {
  const [showWeightInput, setShowWeightInput] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  
  const weightEntries = useProgressStore((state) => state.weightEntries);
  const addWeightEntry = useProgressStore((state) => state.addWeightEntry);
  const getWeightTrend = useProgressStore((state) => state.getWeightTrend);
  const profile = useUserStore((state) => state.profile);
  
  const handleAddWeight = () => {
    if (newWeight && !isNaN(parseFloat(newWeight))) {
      addWeightEntry(parseFloat(newWeight));
      setNewWeight('');
      setShowWeightInput(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Progress</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {weightEntries.length > 0 
                ? weightEntries[weightEntries.length - 1].value 
                : profile?.weight || '--'} lbs
            </Text>
            <Text style={styles.statLabel}>Current Weight</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {progressData.workouts.length}
            </Text>
            <Text style={styles.statLabel}>Workouts</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {profile?.goal || '--'}
            </Text>
            <Text style={styles.statLabel}>Goal</Text>
          </View>
        </View>
        
        <View style={styles.chartSection}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Weight Tracking</Text>
            <Pressable 
              style={styles.addButton}
              onPress={() => setShowWeightInput(true)}
            >
              <Plus size={20} color={Colors.primary} />
            </Pressable>
          </View>
          
          {showWeightInput && (
            <View style={styles.weightInputContainer}>
              <TextInput
                style={styles.weightInput}
                value={newWeight}
                onChangeText={setNewWeight}
                placeholder="Enter weight (lbs)"
                placeholderTextColor={Colors.text.light}
                keyboardType="numeric"
                autoFocus
              />
              <Pressable 
                style={styles.saveButton}
                onPress={handleAddWeight}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </Pressable>
            </View>
          )}
          
          <ProgressChart 
            data={weightEntries.length > 0 ? weightEntries : progressData.weight}
            type="weight"
            trend={getWeightTrend()}
          />
        </View>
        
        <View style={styles.chartSection}>
          <Text style={styles.chartTitle}>Workout Frequency</Text>
          <ProgressChart 
            data={progressData.workouts}
            type="workouts"
          />
        </View>
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statItem: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  chartSection: {
    marginBottom: 24,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${Colors.primary}20`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weightInputContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  weightInput: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 12,
    marginRight: 8,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  saveButtonText: {
    color: Colors.card,
    fontWeight: 'bold',
  },
});