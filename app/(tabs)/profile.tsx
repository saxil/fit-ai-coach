import React from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Alert } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';
import { useUserStore } from '@/store/userStore';
import { router } from 'expo-router';
import { Settings, Bell, HelpCircle, LogOut, ChevronRight } from 'lucide-react-native';

export default function ProfileScreen() {
  const profile = useUserStore((state) => state.profile);
  const setOnboarded = useUserStore((state) => state.setOnboarded);
  
  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Log Out", 
          style: "destructive",
          onPress: () => {
            setOnboarded(false);
            router.replace('/');
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Profile</Text>
        
        <View style={styles.profileCard}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop' }}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{profile?.name || 'User'}</Text>
            <Text style={styles.profileDetails}>
              {profile?.age ? `${profile.age} years` : ''} 
              {profile?.weight ? ` • ${profile.weight} lbs` : ''}
            </Text>
            <View style={styles.goalBadge}>
              <Text style={styles.goalText}>{profile?.goal || 'Set a goal'}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.menuSection}>
          <Text style={styles.menuTitle}>Account</Text>
          
          <Pressable style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Settings size={20} color={Colors.primary} />
            </View>
            <Text style={styles.menuText}>Settings</Text>
            <ChevronRight size={20} color={Colors.text.light} />
          </Pressable>
          
          <Pressable style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Bell size={20} color={Colors.primary} />
            </View>
            <Text style={styles.menuText}>Notifications</Text>
            <ChevronRight size={20} color={Colors.text.light} />
          </Pressable>
        </View>
        
        <View style={styles.menuSection}>
          <Text style={styles.menuTitle}>Support</Text>
          
          <Pressable style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <HelpCircle size={20} color={Colors.primary} />
            </View>
            <Text style={styles.menuText}>Help & Support</Text>
            <ChevronRight size={20} color={Colors.text.light} />
          </Pressable>
        </View>
        
        <Pressable 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <LogOut size={20} color={Colors.error} />
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>
        
        <Text style={styles.versionText}>FitAI Coach v1.0.0</Text>
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
  profileCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  profileDetails: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  goalBadge: {
    backgroundColor: `${Colors.primary}20`,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  goalText: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 12,
  },
  menuSection: {
    marginBottom: 24,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  menuItem: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${Colors.primary}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: Colors.text.primary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginBottom: 24,
  },
  logoutText: {
    color: Colors.error,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  versionText: {
    textAlign: 'center',
    color: Colors.text.light,
    fontSize: 14,
  },
});