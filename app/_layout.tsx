import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { AppState } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider } from '@/context/auth';
import { CustomAlertProvider } from '@/context/AlertContext';

export const unstable_settings = {
  initialRouteName: 'animacao-entrada',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      // 'active' vindo de 'inactive' ou cold start = abriu do zero, rodar
      // 'active' vindo de 'background' = segundo plano, não rodar
      if (appState.current === 'inactive' && nextAppState === 'active') {
        router.replace('/animacao-entrada');
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <AuthProvider>
      <CustomAlertProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack initialRouteName="animacao-entrada">
            <Stack.Screen name="animacao-entrada" options={{ headerShown: false, animation: 'fade' }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="nova-tatuagem" options={{ headerShown: false }} />
            <Stack.Screen name="cadastro" options={{ headerShown: false }} />
            <Stack.Screen name="verificacao" options={{ headerShown: false }} />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </CustomAlertProvider>
    </AuthProvider>
  );
}

