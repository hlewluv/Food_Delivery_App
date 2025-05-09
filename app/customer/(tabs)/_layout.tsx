import React from 'react'
import { Tabs } from 'expo-router'
import { Image, Text, View } from 'react-native'
import { icons } from '@/constant/icons'

const TabIcon = ({ focused, icon, title }: any) => {
  return (
    <View className='flex-1 items-center justify-center'>
      <Image
        source={icon}
        tintColor={focused ? '#00b14f' : '#9CA3AF'}
        className='w-6 h-6'
        resizeMode='contain'
      />
      <Text
        className={`text-xs mt-1 ${focused ? 'text-primary font-medium' : 'text-gray-400'}`}
        numberOfLines={1}
        style={{
          maxWidth: 200, // Tuỳ chỉnh theo nhu cầu
          textAlign: 'center' // Đảm bảo căn giữa
        }}>
        {title}
      </Text>
    </View>
  )
}

const _layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarItemStyle: {
          paddingVertical: 5
        },
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#F3F4F6',
          height: 50,
          paddingBottom: 0
        }
      }}>
      <Tabs.Screen
        name='home'
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={icons.home} title='Home' />
        }}
      />
      <Tabs.Screen
        name='restaurants'
        options={{
          title: 'Cart',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.cookie} title='Yum' />
          )
        }}
      />
      <Tabs.Screen
        name='saved'
        options={{
          title: 'Saved',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.heart} title='Saved' />
          )
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.human} title='Profile' />
          )
        }}
      />
    </Tabs>
  )
}

export default _layout
