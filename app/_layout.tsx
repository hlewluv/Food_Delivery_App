import { Stack } from 'expo-router';
import './globals.css';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{ headerShown: false }}
      linking={{
        prefixes: ['myapp://', 'https://myapp.com'],
        config: {
          screens: {
            '(auth)': {
              path: 'auth',
              screens: {
                index: '',
                login: 'login',
                signup: 'signup',
              },
            },
            '(app)': {
              path: 'app',
              screens: {
                customer: {
                  path: 'customer',
                  screens: {
                    '(tabs)': {
                      path: '',
                      screens: {
                        home: 'home',
                        restaurants: 'restaurants',
                        saved: 'saved',
                        profile: 'profile',
                      },
                    },
                    'restaurants/[id]': 'restaurants/:id',
                    'foodDetail/[id]': 'foodDetail/:id',
                    'confirm/index': 'confirm',
                    'cart/index': 'cart',
                    'payment/index': 'payment'
                  },
                },
                merchant: {
                  path: 'merchant',
                  screens: {
                    '(tabs)': {
                      path: '',
                      screens: {
                        menu: 'menu',
                        orders: 'orders',
                        profile: 'profile',
                      },
                    },
                    'menu/addDish': 'menu/addDish',
                  },
                },
              },
            },
          },
        },
      }}
    >
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(app)" />
    </Stack>
  );
}