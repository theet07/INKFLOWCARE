import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider, useAuth } from '@/context/auth';

export const unstable_settings = {
  initialRouteName: 'login',
};

function Guard() {
  const { logado } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    setPronto(true);
  }, []);

  useEffect(() => {
    if (!pronto) return;
    const emTabs = segments[0] === '(tabs)';
    if (!logado && emTabs) router.replace('/login');
    if (logado && !emTabs) router.replace('/(tabs)');
  }, [logado, segments, pronto]);

  return null;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Guard />
        <Stack initialRouteName="login">
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="nova-tatuagem" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}
