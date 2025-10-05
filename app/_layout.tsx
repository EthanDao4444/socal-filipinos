import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import 'react-native-reanimated'

import { SplashScreenController } from '@/components/SplashScreenController'

import { useAuthContext } from '@/hooks/use-auth-context'
import { useColorScheme } from '@/hooks/use-color-scheme'
import AuthProvider from '@/providers/auth-provider'

// import all fonts
import { useFonts, Actor_400Regular } from '@expo-google-fonts/actor';
import { ADLaMDisplay_400Regular } from '@expo-google-fonts/adlam-display';
import { Archivo_500Medium } from '@expo-google-fonts/archivo';
import { Inter_400Regular, Inter_700Bold, Inter_900Black } from "@expo-google-fonts/inter";
import { Poppins_400Regular } from "@expo-google-fonts/poppins";
import { Roboto_400Regular, Roboto_500Medium, Roboto_700Bold, Roboto_900Black } from "@expo-google-fonts/roboto";
import { useEffect } from 'react';

// Separate RootNavigator so we can access the AuthContext
function RootNavigator() {
  const { isLoggedIn } = useAuthContext()

    const [fontsLoaded] = useFonts({
    Actor_400Regular,
    ADLaMDisplay_400Regular,
    Archivo_500Medium,
    Inter_400Regular, Inter_700Bold, Inter_900Black,
    Poppins_400Regular,
    Roboto_400Regular, Roboto_500Medium, Roboto_700Bold, Roboto_900Black
  });

  useEffect(() => {
    if (fontsLoaded) {
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;
  
  return (
    <Stack>
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Screen name="+not-found" />
    </Stack>
  )
}

export default function RootLayout() {
  const colorScheme = useColorScheme()

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        {/* <SplashScreenController /> */}
        <RootNavigator />
        <StatusBar style="auto" />
      </AuthProvider>
    </ThemeProvider>
  )
}