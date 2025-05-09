import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  StyleSheet
} from 'react-native'
import React, { useState } from 'react'
import { useLocalSearchParams, useRouter, Stack } from 'expo-router'
import { Feather, MaterialIcons, Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import FoodHeaderInfo from '@/components/food/FoodHeaderInfo'
import AdditionalOptions from '@/components/food/AdditionalOptions'
import SpecialRequest from '@/components/food/SpecialRequest'
import ActionBar from '@/components/food/ActionBar'

interface AdditionalOption {
  name: string
  description: string
  price: string
  selected: boolean
}

interface Food {
  id: string
  name: string
  image: any
  time?: string
  price: string
  description: string
  discount?: string
  options?: AdditionalOption[]
  restaurantName?: string
  restaurantImage?: any
}

const FoodDetail = () => {
  const router = useRouter()
  const { food } = useLocalSearchParams<{ food: string }>()
  const [quantity, setQuantity] = useState(1)
  const [specialRequest, setSpecialRequest] = useState('')

  // State for additional options
  const [additionalOptions, setAdditionalOptions] = useState<AdditionalOption[]>([
    {
      name: 'Canh rong biển',
      description: 'bổ dưỡng, thanh mát',
      price: '+17.000',
      selected: false
    },
    {
      name: 'Canh cải ngọt',
      description: 'bổ dưỡng, thanh đạm',
      price: '+17.000',
      selected: false
    },
    {
      name: 'Cơm chiên giòn thêm',
      description: '',
      price: '+15.000',
      selected: false
    },
    {
      name: 'Trứng ốp la',
      description: '',
      price: '+12.000',
      selected: false
    },
    {
      name: 'Nước ép chanh dây',
      description: 'thanh mát, giải nhiệt',
      price: '+25.000',
      selected: false
    },
    {
      name: 'Coca-cola',
      description: '',
      price: '+19.000',
      selected: false
    },
    {
      name: 'Nước khoáng lạt',
      description: '',
      price: '+17.000',
      selected: false
    }
  ])

  // Parse food data with error handling
  let foodData: Food | null = null
  try {
    foodData = food ? JSON.parse(food) : null
  } catch (error) {
    console.error('Error parsing food data:', error)
  }

  if (!foodData) {
    return (
      <SafeAreaView className='flex-1 justify-center items-center bg-gray-50'>
        <Text className='text-gray-500 text-lg mb-4'>Không tìm thấy thông tin món ăn</Text>
        <TouchableOpacity
          className='bg-primary px-6 py-3 rounded-full'
          onPress={() => router.back()}>
          <Text className='text-white font-medium'>Quay lại</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }

  // Toggle selection for additional options
  const toggleAdditionalOption = (index: number) => {
    const newOptions = [...additionalOptions]
    // Check if we can select more (max 7)
    const selectedCount = newOptions.filter(opt => opt.selected).length

    if (!newOptions[index].selected && selectedCount >= 7) {
      // Show alert or feedback to user
      alert('Bạn chỉ có thể chọn tối đa 7 món thêm')
      return
    }

    newOptions[index].selected = !newOptions[index].selected
    setAdditionalOptions(newOptions)
  }

  const handleAddToCart = () => {
    const cartItem = {
      food: foodData,
      quantity,
      specialRequest,
      totalPrice: calculateTotalPrice(),
      selectedOptions: foodData.options?.filter(opt => opt.selected) || [],
      additionalOptions: additionalOptions.filter(opt => opt.selected)
    }

    console.log('Added to cart:', cartItem)
    // In a real app, you would add to cart context/state here
    router.back()
  }

  const calculateTotalPrice = (): number => {
    const basePrice = parseFloat(foodData?.price.replace(/[^0-9.-]+/g, '') || '0')

    // Original options price
    let optionsPrice = 0
    if (foodData?.options) {
      optionsPrice = foodData.options
        .filter(opt => opt.selected && opt.price)
        .reduce((sum, opt) => sum + parseFloat(opt.price?.replace(/[^0-9.-]+/g, '') || 0), 0)
    }

    // Additional options price
    const additionalOptionsPrice = additionalOptions
      .filter(opt => opt.selected)
      .reduce((sum, opt) => sum + parseFloat(opt.price.replace(/[^0-9.-]+/g, '') || 0), 0)

    return (basePrice + optionsPrice + additionalOptionsPrice) * quantity
  }

  const toggleOption = (index: number) => {
    if (!foodData?.options) return

    const newOptions = [...foodData.options]
    newOptions[index].selected = !newOptions[index].selected
    // In a real app, you would update state or context here
  }

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const totalPrice = calculateTotalPrice()
  const selectedAdditionalCount = additionalOptions.filter(opt => opt.selected).length

  return (
    <SafeAreaView className='flex-1 bg-white'>
      {/* Ensure header is hidden */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}>
        <FoodHeaderInfo food={foodData} onBack={() => router.back()} />

        <AdditionalOptions
          options={additionalOptions}
          selectedCount={selectedAdditionalCount}
          onToggleOption={toggleAdditionalOption}
        />

        <SpecialRequest value={specialRequest} onChangeText={setSpecialRequest} />
      </ScrollView>

      {/* Using the ActionBar component */}
      <ActionBar
        quantity={quantity}
        totalPrice={formatPrice(totalPrice)}
        onDecrease={() => setQuantity(prev => Math.max(1, prev - 1))}
        onIncrease={() => setQuantity(prev => prev + 1)}
        onAddToCart={handleAddToCart}
      />
    </SafeAreaView>
  )
}

export default FoodDetail