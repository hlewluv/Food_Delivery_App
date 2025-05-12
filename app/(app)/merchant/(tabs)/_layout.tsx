import { Tabs } from 'expo-router';
import { Image, Text, View } from 'react-native';
import { icons } from '@/constant/icons';
import React from 'react';

const TabIcon = ({ focused, icon, title }: { focused: boolean; icon: any; title: string }) => {
  return (
    <View className="flex-1 items-center justify-center">
      <Image
        source={icon}
        tintColor={focused ? '#00b14f' : '#9CA3AF'}
        className="w-6 h-6"
        resizeMode="contain"
      />
      <Text
        className={`text-xs mt-1 ${focused ? 'text-primary font-medium' : 'text-gray-400'}`}
        numberOfLines={1}
        style={{ maxWidth: 200, textAlign: 'center' }}
      >
        {title}
      </Text>
    </View>
  );
};

export default function MerchantTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#00b14f',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarItemStyle: { paddingVertical: 5 },
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#F3F4F6',
          height: 50,
          paddingBottom: 0,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={icons.home} title="Home" />,
        }}
      />
      <Tabs.Screen
        name="payments"
        options={{
          title: 'Payments',
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={icons.pay} title="Payments" />,
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={icons.mail} title="Messages" />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={icons.human} title="Account" />,
        }}
      />
    </Tabs>
  );
}