import React from 'react'
import { View, Image, TouchableOpacity, Text } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import AvatarHeader from '@/components/profile/AvatarHeader'
import StatsRow from '@/components/profile/StatsRow'
import DualButtons from '@/components/profile/DualButtons'
import SectionList from '@/components/profile/SectionList'
import { ScrollView } from 'moti'

interface User {
  id: string
  name: string
  avatar?: any
  coverImage?: any
  membership?: {
    type: 'basic' | 'vip'
    points: number
  }
}

interface ProfileProps {
  onBackPress?: () => void
  onSettingsPress?: () => void
}

const Profile: React.FC<ProfileProps> = ({ onBackPress, onSettingsPress }) => {
  const router = useRouter()

  const user: User = {
    id: '1',
    name: 'taQuan',
    avatar: require('@/assets/images/hero1.jpg'),
    coverImage: require('@/assets/images/hero1.jpg'),
    membership: {
      type: 'vip',
      points: 150
    }
  }

  const promotionItems = [
    {
      id: 'rewards',
      title: 'GrabRewards',
      rightContent: <Text className='text-sm text-gray-500 mr-1'>0 Điểm</Text>,
      onPress: () => router.push('/rewards')
    },
    {
      id: 'membership',
      title: 'Gói Hội Viên',
      rightContent: (
        <Text className='text-xs font-medium bg-blue-50 text-blue-500 px-2 py-1 rounded-full'>
          Mới
        </Text>
      ),
      onPress: () => router.push('/membership')
    },
    {
      id: 'challenges',
      title: 'Thử thách',
      onPress: () => router.push('/challenges')
    }
  ]

  const generalItems = [
    {
      id: 'favorites',
      title: 'Yêu thích',
      rightContent: (
        <Text className='text-xs font-medium bg-blue-50 text-blue-500 px-2 py-1 rounded-full'>
          Mới
        </Text>
      ),
      onPress: () => router.push('/favorites')
    },
    {
      id: 'payment-methods',
      title: 'Phương thức thanh toán',
      onPress: () => router.push('/payment-methods')
    }
  ]

  return (
    <ScrollView className='flex-1 bg-gray-50'>
      {/* Cover Image */}
      <View className='h-48 relative'>
        <Image
          source={user.coverImage}
          className='w-full h-full'
          resizeMode='cover'
          blurRadius={2}
        />

        {/* Header Buttons */}
        <View className='absolute top-12 left-0 right-0 flex-row justify-between px-5'>
          <TouchableOpacity
            className='w-10 h-10 rounded-full bg-black/50 justify-center items-center'
            onPress={onBackPress || (() => router.back())}>
            <Feather name='arrow-left' size={24} color='white' />
          </TouchableOpacity>
          <TouchableOpacity
            className='w-10 h-10 rounded-full bg-black/50 justify-center items-center'
            onPress={onSettingsPress || (() => router.push('/settings'))}>
            <Feather name='settings' size={20} color='white' />
          </TouchableOpacity>
        </View>
      </View>

      {/* Profile Card */}
      <View className='mx-5 -mt-16 relative z-20'>
        <View className='bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden'>
          <View className='pt-3'>
            <AvatarHeader user={user} onProfilePress={() => router.push('/profile/edit')} />
          </View>

          <StatsRow
            onDiscountPress={() => router.push('/discounts')}
            onVipPress={() => router.push('/vip-benefits')}
            onFavoritesPress={() => router.push('/favorites')}
          />
        </View>
      </View>

      {/* Dual Buttons Section */}
      <View className='px-4 py-3'>
        <DualButtons
          onBecomeMuncherPress={() => router.push('/become-muncher')}
          onBusinessPress={() => router.push('/business')}
        />
      </View>

      <SectionList title='Ưu đãi và tiết kiệm' items={promotionItems} />

      <SectionList title='Tổng quát' items={generalItems} />
    </ScrollView>
  )
}

export default Profile
