import { Stack } from 'expo-router';

export default function CustomerLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="restaurants/[id]" />
      <Stack.Screen name="foodDetail/[id]" />
      <Stack.Screen name="confirm/index" />
      <Stack.Screen name="cart/index" />
    </Stack>
  );
}