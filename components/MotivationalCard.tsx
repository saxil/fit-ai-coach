import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';
import { motivationalQuotes } from '@/constants/mockData';

export default function MotivationalCard() {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    // Get a random quote
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    setQuote(motivationalQuotes[randomIndex]);
  }, []);

  return (
    <LinearGradient
      colors={[Colors.primary, Colors.secondary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <Text style={styles.quoteText}>{quote}</Text>
      <Text style={styles.sourceText}>FitAI Coach</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
  },
  quoteText: {
    color: Colors.card,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  sourceText: {
    color: Colors.card,
    fontSize: 14,
    textAlign: 'right',
    opacity: 0.8,
  },
});