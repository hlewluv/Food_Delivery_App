import { Stack } from 'expo-router';
import React from 'react';

export default function MerchantLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="menu/addDish" />
    </Stack>
  );
}