import { Stack } from 'expo-router'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React from 'react'
import { images } from '@/constant/images'

const SidebarItem = ({
  focused,
  icon,
  title,
  onPress
}: {
  focused: boolean
  icon: React.ReactNode
  title: string
  onPress: () => void
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center p-4 mx-2 rounded-lg ${focused ? 'bg-primary/10' : ''}`}>
      {icon}
      <Text
        className={`ml-3 text-base ${focused ? 'text-primary font-semibold' : 'text-gray-600'}`}>
        {title}
      </Text>
    </TouchableOpacity>
  )
}

export default function MerchantSidebarLayout() {
  const router = useRouter()
  const [activeTab, setActiveTab] = React.useState('home')

  const tabs = [
    {
      name: 'home',
      icon: <Ionicons name='home' size={22} color={activeTab === 'home' ? '#00b14f' : '#6b7280'} />,
      title: 'Trang chủ'
    },
    {
      name: 'order',
      icon: (
        <MaterialIcons
          name='restaurant'
          size={22}
          color={activeTab === 'order' ? '#00b14f' : '#6b7280'}
        />
      ),
      title: 'Đơn hàng'
    },
    {
      name: 'menu',
      icon: (
        <MaterialIcons
          name='menu-book'
          size={22}
          color={activeTab === 'menu' ? '#00b14f' : '#6b7280'}
        />
      ),
      title: 'Thực đơn'
    },
    {
      name: 'voucher',
      icon: (
        <MaterialIcons
          name='local-offer'
          size={22}
          color={activeTab === 'voucher' ? '#00b14f' : '#6b7280'}
        />
      ),
      title: 'Khuyến mãi'
    },
    {
      name: 'staff',
      icon: (
        <Ionicons name='people' size={22} color={activeTab === 'staff' ? '#00b14f' : '#6b7280'} />
      ),
      title: 'Nhân viên'
    },
    {
      name: 'messages',
      icon: (
        <Ionicons
          name='chatbubbles'
          size={20}
          color={activeTab === 'messages' ? '#00b14f' : '#6b7280'}
        />
      ),
      title: 'Tin nhắn'
    },
    {
      name: 'account',
      icon: (
        <MaterialIcons
          name='account-circle'
          size={22}
          color={activeTab === 'account' ? '#00b14f' : '#6b7280'}
        />
      ),
      title: 'Tài khoản'
    }
  ]

  return (
    <View className='flex-1 flex-row bg-gray-50'>
      {/* Sidebar */}
      <View className='w-72 border-r border-gray-200 bg-white'>
        {/* Logo */}
        <View className='h-32 overflow-hidden items-center border-b border-gray-200'>
          <Image source={images.logo} style={{ width: 300, height: 150 }} resizeMode='contain' />
        </View>

        {/* Menu items */}
        <View className='mt-4'>
          {tabs.map(tab => (
            <SidebarItem
              key={tab.name}
              focused={activeTab === tab.name}
              icon={tab.icon}
              title={tab.title}
              onPress={() => {
                setActiveTab(tab.name)
                router.push(`/merchant/${tab.name}`)
              }}
            />
          ))}
        </View>
      </View>

      {/* Main Content */}
      <View className='flex-1'>
        <Stack
          screenOptions={{
            headerShown: false
          }}>
          <Stack.Screen name='home' />
          <Stack.Screen name='order' />
          <Stack.Screen name='menu' />
          <Stack.Screen name='voucher' />
          <Stack.Screen name='staff' />
          <Stack.Screen name='messages' />
          <Stack.Screen name='account' />
        </Stack>
      </View>
    </View>
  )
}
