import { Stack } from 'expo-router';
import './globals.css';


export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="customer/(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="customer/restaurants/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="customer/foodDetail/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="customer/confirm/index" options={{ headerShown: false }} />
      <Stack.Screen name="customer/cart/index" options={{ headerShown: false }} />
    </Stack>
  );
}
