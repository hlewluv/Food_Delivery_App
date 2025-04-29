import { Stack } from 'expo-router'
import './globals.css'

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name='(auth)' options={{ headerShown: false }} />

      <Stack.Screen name='(tabs)' options={{ headerShown: false }} />

      <Stack.Screen name='restaurants/[id]' options={{ headerShown: false }} />

      <Stack.Screen name='foodDetail/[id]' options={{ headerShown: false }} />

      <Stack.Screen name='confirm/index' options={{ headerShown: false }} />
    </Stack>
  )
}
