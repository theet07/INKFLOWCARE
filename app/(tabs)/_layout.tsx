import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '@/context/auth';

export default function TabLayout() {
  const { logado, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!logado) {
      router.replace('/login');
    }
  }, [logado, loading]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0e0e0e' }}>
        <ActivityIndicator size="large" color="#ff8d8c" />
      </View>
    );
  }

  if (!logado) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0e0e0e' }}>
        <ActivityIndicator size="large" color="#ff8d8c" style={{ flex: 1 }} />
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#111',
          borderTopColor: '#222',
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 20,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#FF4757',
        tabBarInactiveTintColor: '#adaaaa',
        tabBarShowLabel: false,
        tabBarIconStyle: { marginTop: 0 },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              backgroundColor: focused ? 'rgba(255,71,87,0.15)' : 'transparent',
              borderRadius: 8,
              width: 48,
              height: 48,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Ionicons name={focused ? 'grid' : 'grid-outline'} size={24} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="caminho"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              backgroundColor: focused ? 'rgba(255,71,87,0.15)' : 'transparent',
              borderRadius: 8,
              width: 48,
              height: 48,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Ionicons name={focused ? 'bandage' : 'bandage-outline'} size={24} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              backgroundColor: focused ? 'rgba(255,71,87,0.15)' : 'transparent',
              borderRadius: 8,
              width: 48,
              height: 48,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Ionicons name={focused ? 'document-text' : 'document-text-outline'} size={24} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              backgroundColor: focused ? 'rgba(255,71,87,0.15)' : 'transparent',
              borderRadius: 8,
              width: 48,
              height: 48,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
