import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Colors from '@/constants/colors';
import { useUserStore } from '@/store/userStore';

export default function WelcomeScreen() {
  const isOnboarded = useUserStore((state) => state.isOnboarded);

  useEffect(() => {
    if (isOnboarded) {
      router.replace('/(tabs)');
    }
  }, [isOnboarded]);

  const handleGetStarted = () => {
    router.push('/onboarding');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1770&auto=format&fit=crop' }}
        style={styles.backgroundImage}
        contentFit="cover"
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.gradient}
      />
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>FitAI</Text>
          <Text style={styles.logoSubtext}>Coach</Text>
        </View>
        <Text style={styles.tagline}>Your Personal AI Fitness Coach</Text>
        <Text style={styles.description}>
          Get personalized workout plans, nutrition advice, and motivation to reach your fitness goals.
        </Text>
        <Pressable 
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed
          ]}
          onPress={handleGetStarted}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 24,
    paddingBottom: 48,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: Colors.card,
  },
  logoSubtext: {
    fontSize: 24,
    fontWeight: '500',
    color: Colors.primary,
    marginLeft: 4,
  },
  tagline: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.card,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: Colors.card,
    opacity: 0.8,
    marginBottom: 32,
    lineHeight: 24,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.9,
  },
  buttonText: {
    color: Colors.card,
    fontSize: 18,
    fontWeight: 'bold',
  },
});