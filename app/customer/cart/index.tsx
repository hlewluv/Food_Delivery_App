import React, { useState } from 'react'
import { View, Text, Image, TouchableOpacity, ScrollView, TextInput } from 'react-native'
import { router, useLocalSearchParams, useRouter } from 'expo-router'
import {
  Feather,
  MaterialIcons,
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome
} from '@expo/vector-icons'
import CartItem from '@/components/cart/CartItem'
import PaymentMethod from '@/components/cart/PaymentMethod'
import DeliveryAddress from '@/components/cart/DeliveryAddress'
import OrderSummary from '@/components/cart/OrderSummary'


const CartScreen = () => {
  const [deliveryInstructions, setDeliveryInstructions] = useState('')
  const [address, setAddress] = useState({
    street: '79 Nguyễn Giản Thanh',
    ward: 'P.An Khê',
    district: 'Q.Thanh Khê',
    city: 'Đà Nẵng'
  })
  const [isEditingAddress, setIsEditingAddress] = useState(false)

  const params = useLocalSearchParams()

  // Sample data with 3 items
  const cartItems = [
    {
      additionalOptions: [],
      food: {
        description: 'Bánh burger với 2 miếng thịt bò, sốt đặc biệt, rau sống tươi ngon',
        id: '1-1-1',
        image: 'https://static.tnex.com.vn/uploads/2023/06/word-image-15111-1.jpeg',
        name: 'Big Mac',
        price: '49.000đ',
        restaurant: "McDonald's",
        restaurantImage: 'https://example.com/mcdonalds.jpg',
        restaurantName: "McDonald's"
      },
      quantity: 1,
      selectedOptions: [],
      specialRequest: '',
      totalPrice: 49
    },
    {
      additionalOptions: [],
      food: {
        description: 'Gà rán giòn cay, ăn kèm khoai tây chiên',
        id: '1-1-2',
        image: 'https://static.tnex.com.vn/uploads/2023/06/word-image-15111-2.jpeg',
        name: 'Spicy Chicken',
        price: '45.000đ',
        restaurant: "McDonald's",
        restaurantImage: 'https://example.com/mcdonalds.jpg',
        restaurantName: "McDonald's"
      },
      quantity: 2,
      selectedOptions: [],
      specialRequest: 'Không làm quá cay',
      totalPrice: 90
    },
    {
      additionalOptions: [],
      food: {
        description: 'Khoai tây chiên giòn, ăn kèm sốt cà chua',
        id: '1-1-3',
        image: 'https://static.tnex.com.vn/uploads/2023/06/word-image-15111-3.jpeg',
        name: 'French Fries',
        price: '25.000đ',
        restaurant: "McDonald's",
        restaurantImage: 'https://example.com/mcdonalds.jpg',
        restaurantName: "McDonald's"
      },
      quantity: 1,
      selectedOptions: [],
      specialRequest: 'Thêm sốt mayonnaise',
      totalPrice: 25
    }
  ]
  // const [cartItems, setCartItems] = useState(
  //   params.cartItems ? JSON.parse(params.cartItems) : []
  // )
  
  // const [restaurant, setRestaurant] = useState(
  //   params.restaurantData ? JSON.parse(params.restaurantData) : null
  // )

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0)
  const shippingFee = 15
  const discount = 5
  const total = subtotal + shippingFee - discount

  //Payment
  const [paymentMethod, setPaymentMethod] = useState('zalopay')

  //Confirm

  const router = useRouter()

  const handleConfirmOrder = () => {
    const orderData = {
      items: cartItems,
      address,
      deliveryInstructions,
      paymentMethod,
      subtotal,
      shippingFee,
      discount,
      total
    }
    
    router.push({
      pathname: '/confirm',
      params: { orderData: JSON.stringify(orderData) }
    })
  }


  return (
    <ScrollView className='flex-1 bg-gray-100'>
      {/* Header */}
      <View className='bg-white px-5 py-4'>
        <Text className='text-[20px] font-bold'>Tóm tắt đơn hàng</Text>
      </View>

      {/* Danh sách món ăn */}
      {cartItems.map((item, index) => (
        <CartItem key={index} item={item} />
      ))}

      {/* Tóm tắt đơn hàng */}
      <OrderSummary
        subtotal={subtotal}
        shippingFee={shippingFee}
        discount={discount}
        total={total}
      />
      {/* Địa chỉ giao hàng */}
      <DeliveryAddress
        initialAddress={address}
        onAddressChange={(newAddress: React.SetStateAction<{ street: string; ward: string; district: string; city: string }>) => setAddress(newAddress)}
        onDeliveryInstructionsChange={(instructions: React.SetStateAction<string>) => setDeliveryInstructions(instructions)}
      />

      {/* Thông tin thanh toán */}
      <PaymentMethod
        onPaymentMethodChange={(method: React.SetStateAction<string>) => setPaymentMethod(method)}
        appliedOffersCount={2}
      />

      {/* Floating Order Button */}
      <View className='flex-1 bg-white'>
        {/* Phần nội dung chính - cần có padding bottom đủ lớn */}
        <ScrollView className='flex-1 pb-12'>
          {/* Các phần nội dung khác của bạn ở đây */}
          <View className='px-4 py-4'>{/* ... các component khác ... */}</View>
        </ScrollView>

        {/* Nút trôi nổi - nằm phía trên padding bottom */}
        <View className='absolute bottom-4 left-0 right-0 px-4'>
        <TouchableOpacity
          className='bg-[#00b14f] py-4 rounded-lg items-center shadow-lg'
          activeOpacity={0.8}
          onPress={handleConfirmOrder}>
          <Text className='text-white text-lg font-bold'>
            ĐẶT ĐƠN - {total.toLocaleString('vi-VN')}.000đ
          </Text>
        </TouchableOpacity>
      </View>
      </View>
    </ScrollView>
  )
}

export default CartScreen
