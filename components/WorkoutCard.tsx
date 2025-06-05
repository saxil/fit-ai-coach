import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { WorkoutPlan } from '@/types';
import Colors from '@/constants/colors';
import { Dumbbell, Clock } from 'lucide-react-native';

interface WorkoutCardProps {
  workout: WorkoutPlan;
  onPress: () => void;
}

export default function WorkoutCard({ workout, onPress }: WorkoutCardProps) {
  return (
    <Pressable 
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed
      ]}
      onPress={onPress}
    >
      <Image
        source={{ uri: workout.image }}
        style={styles.image}
        contentFit="cover"
        transition={300}
      />
      <View style={styles.overlay} />
      <View style={styles.content}>
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>{workout.level}</Text>
        </View>
        <Text style={styles.title}>{workout.title}</Text>
        <Text style={styles.description}>{workout.description}</Text>
        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Dumbbell size={16} color={Colors.card} />
            <Text style={styles.metaText}>{workout.category}</Text>
          </View>
          <View style={styles.metaItem}>
            <Clock size={16} color={Colors.card} />
            <Text style={styles.metaText}>{workout.duration}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    height: 200,
    position: 'relative',
  },
  pressed: {
    opacity: 0.9,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  levelBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  levelText: {
    color: Colors.card,
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    color: Colors.card,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    color: Colors.card,
    fontSize: 14,
    marginBottom: 8,
  },
  metaContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    color: Colors.card,
    fontSize: 14,
  },
});