import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useUserStore } from "@/store/userStore";

export const unstable_settings = {
  initialRouteName: "index",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const isOnboarded = useUserStore((state) => state.isOnboarded);

  return (
    <Stack
      screenOptions={{
        headerBackTitle: "Back",
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerShadowVisible: false,
      }}
    >
      {!isOnboarded ? (
        <Stack.Screen 
          name="index" 
          options={{ 
            headerShown: false,
          }} 
        />
      ) : (
        <Stack.Screen 
          name="(tabs)" 
          options={{ 
            headerShown: false,
          }} 
        />
      )}
      <Stack.Screen 
        name="onboarding" 
        options={{ 
          headerShown: false,
          presentation: 'fullScreenModal',
        }} 
      />
      <Stack.Screen 
        name="workout/[id]" 
        options={{ 
          title: "Workout Details",
        }} 
      />
      <Stack.Screen 
        name="custom-workout/[id]" 
        options={{ 
          title: "Custom Workout",
        }} 
      />
      <Stack.Screen 
        name="meal/[id]" 
        options={{ 
          title: "Meal Details",
        }} 
      />
    </Stack>
  );
}