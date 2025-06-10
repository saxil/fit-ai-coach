import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, ActivityIndicator } from 'react-native';
import Colors from '@/constants/colors';
import { Sparkles, Send } from 'lucide-react-native';
import { useUserStore } from '@/store/userStore';

interface AiWorkoutGeneratorProps {
  onWorkoutGenerated: (workout: string) => void;
}

export default function AiWorkoutGenerator({ onWorkoutGenerated }: AiWorkoutGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const profile = useUserStore((state) => state.profile);

  const generateWorkout = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const userContext = profile ? 
        `User profile: ${profile.age} years old, ${profile.weight} lbs, fitness level: ${profile.fitnessLevel}, goal: ${profile.goal}.` : 
        'No user profile available.';
      
      const messages = [
        {
          role: 'system',
          content: 'You are an expert fitness coach AI. Create personalized workout plans based on user requests and profiles. Be concise, specific, and motivational. Include exercise names, sets, reps, and rest periods where appropriate.'
        },
        {
          role: 'user',
          content: `${userContext} Please create a workout plan for: ${prompt}`
        }
      ];
      
      const response = await fetch('https://toolkit.rork.com/text/llm/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate workout');
      }
      
      const data = await response.json();
      onWorkoutGenerated(data.completion);
      setPrompt('');
    } catch (err) {
      setError('Failed to generate workout. Please try again.');
      console.error('Error generating workout:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Sparkles size={20} color={Colors.primary} />
        <Text style={styles.title}>AI Workout Generator</Text>
      </View>
      
      <Text style={styles.description}>
        Describe the workout you want, and our AI will create a personalized plan for you.
      </Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={prompt}
          onChangeText={setPrompt}
          placeholder="e.g., A 30-minute HIIT workout for abs"
          placeholderTextColor={Colors.text.light}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
        <Pressable 
          style={({ pressed }) => [
            styles.sendButton,
            pressed && styles.sendButtonPressed,
            !prompt.trim() && styles.sendButtonDisabled
          ]}
          onPress={generateWorkout}
          disabled={!prompt.trim() || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={Colors.card} />
          ) : (
            <Send size={20} color={Colors.card} />
          )}
        </Pressable>
      </View>
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
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
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginLeft: 8,
  },
  description: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: Colors.text.primary,
    minHeight: 80,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: Colors.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonPressed: {
    opacity: 0.8,
  },
  sendButtonDisabled: {
    backgroundColor: Colors.inactive,
  },
  errorText: {
    color: Colors.error,
    marginTop: 8,
    fontSize: 14,
  },
});