import { Tabs } from 'expo-router';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons
import React from 'react';

const TabIcon = ({ focused, icon, title }: { focused: boolean; icon: string; title: string }) => {
  return (
    <View className="flex-1 items-center justify-center">
      <Ionicons
        name={icon}
        size={20} // Increased size for better visibility
        color={focused ? '#00b14f' : '#9CA3AF'}
      />
      <Text
        className={`text-[10px] mt-1 ${focused ? 'text-primary font-medium' : 'text-gray-400'}`}
        numberOfLines={1} // Ensure single line
        style={{ textAlign: 'center', minWidth: 100 }} // Ensure enough space for text
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
        tabBarItemStyle: { paddingVertical: 5, paddingHorizontal: 12, minWidth: 110 },
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#F3F4F6',
          height: 80,
          paddingBottom: 5,
          width: '100%',
        },
      }}
    >
      <Tabs.Screen
        name="income"
        options={{
          title: 'Thu nhập',
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="cash" title="Thu nhập" />,
        }}
      />
      <Tabs.Screen
        name="bonus"
        options={{
          title: 'Tiền thưởng',
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="gift" title="Tiền thưởng" />,
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: 'Ví',
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="wallet" title="Ví" />,
        }}
      />
    </Tabs>
  );
}