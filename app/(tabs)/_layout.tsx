import { Tabs } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#16213e',
          borderTopWidth: 0,
          elevation: 12,
          height: 62,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: '#e94560',
        tabBarInactiveTintColor: '#4a5568',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Geliştiriciler',
          tabBarIcon: () => <Text style={{ fontSize: 22 }}>🪪</Text>,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Başarımlar',
          tabBarIcon: () => <Text style={{ fontSize: 22 }}>🏆</Text>,
        }}
      />
    </Tabs>
  );
}
