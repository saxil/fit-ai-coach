import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';
import { useUserStore } from '@/store/userStore';
import { useWorkoutStore } from '@/store/workoutStore';
import { useNutritionStore } from '@/store/nutritionStore';
import { ChevronRight } from 'lucide-react-native';

const fitnessLevels = ['Beginner', 'Intermediate', 'Advanced'];
const fitnessGoals = ['Lose Weight', 'Build Muscle', 'Improve Fitness', 'Maintain Health'];

export default function OnboardingScreen() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedGoal, setSelectedGoal] = useState('');

  const setProfile = useUserStore((state) => state.setProfile);
  const setOnboarded = useUserStore((state) => state.setOnboarded);
  const generateWorkoutRecommendations = useWorkoutStore((state) => state.generateRecommendations);
  const generateNutritionRecommendations = useNutritionStore((state) => state.generateRecommendations);

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      completeOnboarding();
    }
  };

  const completeOnboarding = () => {
    // Save user profile
    setProfile({
      name,
      age: parseInt(age, 10),
      weight: parseInt(weight, 10),
      height: parseInt(height, 10),
      goal: selectedGoal,
      fitnessLevel: selectedLevel,
    });
    
    // Generate initial recommendations
    generateWorkoutRecommendations();
    generateNutritionRecommendations();
    
    // Mark as onboarded
    setOnboarded(true);
    
    // Navigate to main app
    router.replace('/(tabs)');
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return name.trim() !== '' && age.trim() !== '';
      case 2:
        return weight.trim() !== '' && height.trim() !== '';
      case 3:
        return selectedLevel !== '' && selectedGoal !== '';
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <Text style={styles.stepTitle}>Tell us about yourself</Text>
            <Text style={styles.stepDescription}>
              We'll use this information to personalize your experience.
            </Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Your Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor={Colors.text.light}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Your Age</Text>
              <TextInput
                style={styles.input}
                value={age}
                onChangeText={setAge}
                placeholder="Enter your age"
                placeholderTextColor={Colors.text.light}
                keyboardType="number-pad"
              />
            </View>
          </>
        );
      case 2:
        return (
          <>
            <Text style={styles.stepTitle}>Your body metrics</Text>
            <Text style={styles.stepDescription}>
              This helps us calculate your calorie needs and fitness recommendations.
            </Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Weight (lbs)</Text>
              <TextInput
                style={styles.input}
                value={weight}
                onChangeText={setWeight}
                placeholder="Enter your weight"
                placeholderTextColor={Colors.text.light}
                keyboardType="number-pad"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Height (inches)</Text>
              <TextInput
                style={styles.input}
                value={height}
                onChangeText={setHeight}
                placeholder="Enter your height"
                placeholderTextColor={Colors.text.light}
                keyboardType="number-pad"
              />
            </View>
          </>
        );
      case 3:
        return (
          <>
            <Text style={styles.stepTitle}>Your fitness profile</Text>
            <Text style={styles.stepDescription}>
              Let us know your experience level and goals.
            </Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Fitness Level</Text>
              <View style={styles.optionsContainer}>
                {fitnessLevels.map((level) => (
                  <Pressable
                    key={level}
                    style={[
                      styles.optionButton,
                      selectedLevel === level && styles.selectedOption
                    ]}
                    onPress={() => setSelectedLevel(level)}
                  >
                    <Text 
                      style={[
                        styles.optionText,
                        selectedLevel === level && styles.selectedOptionText
                      ]}
                    >
                      {level}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Fitness Goal</Text>
              <View style={styles.optionsContainer}>
                {fitnessGoals.map((goal) => (
                  <Pressable
                    key={goal}
                    style={[
                      styles.optionButton,
                      selectedGoal === goal && styles.selectedOption
                    ]}
                    onPress={() => setSelectedGoal(goal)}
                  >
                    <Text 
                      style={[
                        styles.optionText,
                        selectedGoal === goal && styles.selectedOptionText
                      ]}
                    >
                      {goal}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.progressContainer}>
          {[1, 2, 3].map((s) => (
            <View 
              key={s} 
              style={[
                styles.progressDot,
                s === step && styles.activeProgressDot,
                s < step && styles.completedProgressDot
              ]} 
            />
          ))}
        </View>
        
        <View style={styles.content}>
          {renderStep()}
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <Pressable 
          style={[
            styles.nextButton,
            !isStepValid() && styles.disabledButton
          ]}
          onPress={handleNext}
          disabled={!isStepValid()}
        >
          <Text style={styles.nextButtonText}>
            {step === 3 ? 'Complete' : 'Next'}
          </Text>
          <ChevronRight size={20} color={Colors.card} />
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
    flexGrow: 1,
    padding: 24,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.inactive,
    marginHorizontal: 4,
  },
  activeProgressDot: {
    backgroundColor: Colors.primary,
    width: 20,
  },
  completedProgressDot: {
    backgroundColor: Colors.primary,
  },
  content: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.text.primary,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionButton: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  selectedOption: {
    backgroundColor: `${Colors.primary}20`,
    borderColor: Colors.primary,
  },
  optionText: {
    fontSize: 16,
    color: Colors.text.primary,
  },
  selectedOptionText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  footer: {
    padding: 24,
    backgroundColor: Colors.background,
  },
  nextButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: Colors.inactive,
  },
  nextButtonText: {
    color: Colors.card,
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
});