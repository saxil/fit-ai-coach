import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { WeightData, WorkoutData } from '@/types';
import Colors from '@/constants/colors';
import { ArrowUpRight, ArrowDownRight, ArrowRight } from 'lucide-react-native';

interface ProgressChartProps {
  data: WeightData[] | WorkoutData[];
  type: 'weight' | 'workouts';
  trend?: 'up' | 'down' | 'stable' | null;
}

const { width } = Dimensions.get('window');
const chartWidth = width - 48; // Accounting for padding

export default function ProgressChart({ data, type, trend }: ProgressChartProps) {
  if (!data || data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No data available</Text>
      </View>
    );
  }

  // For simplicity, we'll just show the last 7 entries
  const displayData = data.slice(-7);
  
  // Find min and max values for scaling
  let minValue = Number.MAX_VALUE;
  let maxValue = Number.MIN_VALUE;
  
  displayData.forEach(entry => {
    const value = 'value' in entry ? entry.value : entry.count;
    if (value < minValue) minValue = value;
    if (value > maxValue) maxValue = value;
  });
  
  // Add some padding to min/max
  minValue = Math.max(0, minValue - (maxValue - minValue) * 0.1);
  maxValue = maxValue + (maxValue - minValue) * 0.1;
  
  // If all values are the same, create some visual range
  if (minValue === maxValue) {
    minValue = minValue * 0.9;
    maxValue = maxValue * 1.1;
  }
  
  const valueRange = maxValue - minValue;
  const barWidth = chartWidth / displayData.length - 8;

  const getTrendIcon = () => {
    if (!trend) return null;
    
    if (trend === 'up') {
      return <ArrowUpRight size={20} color={type === 'weight' ? Colors.error : Colors.success} />;
    } else if (trend === 'down') {
      return <ArrowDownRight size={20} color={type === 'weight' ? Colors.success : Colors.error} />;
    } else {
      return <ArrowRight size={20} color={Colors.text.secondary} />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {type === 'weight' ? 'Weight Progress' : 'Workout Frequency'}
        </Text>
        {getTrendIcon()}
      </View>
      
      <View style={styles.chartContainer}>
        {displayData.map((entry, index) => {
          const value = 'value' in entry ? entry.value : entry.count;
          const normalizedHeight = ((value - minValue) / valueRange) * 150;
          const date = new Date('date' in entry ? entry.date : '');
          const formattedDate = `${date.getMonth() + 1}/${date.getDate()}`;
          
          return (
            <View key={index} style={styles.barContainer}>
              <View style={styles.barLabelContainer}>
                <Text style={styles.barValue}>
                  {type === 'weight' ? `${value} lbs` : value}
                </Text>
              </View>
              <View 
                style={[
                  styles.bar, 
                  { 
                    height: Math.max(normalizedHeight, 5),
                    backgroundColor: type === 'weight' ? Colors.primary : Colors.secondary
                  }
                ]} 
              />
              <Text style={styles.dateLabel}>{formattedDate}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 200,
  },
  barContainer: {
    alignItems: 'center',
  },
  barLabelContainer: {
    marginBottom: 4,
  },
  barValue: {
    fontSize: 10,
    color: Colors.text.secondary,
  },
  bar: {
    width: 20,
    borderRadius: 4,
  },
  dateLabel: {
    marginTop: 8,
    fontSize: 10,
    color: Colors.text.secondary,
  },
  emptyContainer: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  emptyText: {
    color: Colors.text.light,
    fontSize: 16,
  },
});