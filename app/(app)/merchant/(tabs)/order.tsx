import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Image, Modal } from 'react-native'
import { Feather, Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'

// Define the MenuItem interface based on the Cart Items example
interface MenuItem {
  id: string
  name: string
  price: string
  restaurant?: string
  image?: any
  description?: string
  time?: string
  option_menu?: string[][]
}

interface Order {
  id: string
  customerName: string
  bikerName: string
  bikerAvatar: string
  time: string
  status: string
  items: { item: MenuItem; quantity: number }[]
}

// Import transactionData
import transactionData from '@/data/transactions' // Đảm bảo đường dẫn đúng đến file transactionData.js

const Order = () => {
  const tabs = ['Chờ xác nhận', 'Đang chuẩn bị', 'Sẵn sàng', 'Lịch sử']

  // State to manage the active tab
  const [activeTab, setActiveTab] = useState('Chờ xác nhận')

  // State to manage which order's details are being viewed
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  // Transform transactionData to match Order interface
  const transformTransactionData = (data) => {
    return data.map((transaction) => ({
      id: transaction.id,
      customerName: transaction.customer.name,
      bikerName: transaction.biker.name,
      bikerAvatar: 'https://suckhoedoisong.qltns.mediacdn.vn/324455921873985536/2023/7/5/6-tip-cua-jennie-blackpink-de-co-lan-da-trang-min-khong-ty-vet-1688575737474377581537.jpg', // Placeholder avatar
      time: transaction.time,
      status: transaction.status === 'Hoàn tất' ? 'Lịch sử' : transaction.status === 'Đang giao' ? 'Sẵn sàng' : transaction.status,
      items: transaction.items.map((item) => ({
        item: {
          id: item.id,
          name: item.food_name,
          price: `${item.price.toLocaleString('vi-VN')}đ`,
          restaurant: transaction.restaurant.name,
          image: item.image,
          description: item.description,
          time: item.time,
          option_menu: item.option_menu
        },
        quantity: 1 // Default quantity, adjust if needed
      }))
    }))
  }

  // State to manage orders
  const [orders, setOrders] = useState<Order[]>(transformTransactionData(transactionData))

  // Function to move an order to the next tab
  const moveToNextTab = (orderId: string) => {
    setOrders((prevOrders) => {
      return prevOrders.map((order) => {
        if (order.id === orderId && order.status !== 'Lịch sử') {
          const currentTabIndex = tabs.indexOf(order.status)
          const nextTabIndex = currentTabIndex + 1 // Move to next tab
          return { ...order, status: tabs[nextTabIndex] }
        }
        return order
      })
    })
  }

  // Filter orders based on the active tab
  const filteredOrders = orders.filter((order) => order.status === activeTab)

  // Calculate total items for display
  const getTotalItems = (items: { item: MenuItem; quantity: number }[]) => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  // Calculate total price for an order
  const getTotalPrice = (items: { item: MenuItem; quantity: number }[]) => {
    return (
      items
        .reduce((total, { item, quantity }) => {
          const price = parseFloat(item.price.replace('đ', '').replace('.', '')) / 1000
          return total + price * quantity
        }, 0)
        .toFixed(3) + 'đ'
    )
  }

  // Handle order press to show details
  const handleOrderPress = (order: Order) => {
    setSelectedOrder(order)
  }

  // Handle status button press
  const handleStatusPress = (order: Order) => {
    if (order.status !== 'Lịch sử') {
      moveToNextTab(order.id)
    }
  }

  // Render detailed order form in a modal
  const renderOrderDetails = (order: Order) => (
    <View className='bg-white p-6 rounded-2xl shadow-lg m-4'>
      <View className='flex-row justify-between items-center mb-4'>
        <Text className='text-2xl font-bold text-gray-800'>Hoá đơn #{order.id}</Text>
        <TouchableOpacity onPress={() => setSelectedOrder(null)}>
          <Feather name='x' size={24} color='#6b7280' />
        </TouchableOpacity>
      </View>
      <View className='bg-gray-50 p-4 rounded-lg mb-4'>
        <Text className='text-lg font-semibold text-gray-700 mb-3'>Thông tin đơn hàng</Text>
        <View className='flex-row items-center mb-2'>
          <View className='pl-2 w-30 flex-row items-center mb-2'>
            <Feather name='user' size={20} color='#6b7280' />
            <Text className='ml-2 text-base text-gray-600 font-medium'>Khách hàng: </Text>
          </View>
          <Text className='flex-1 text-base text-gray-600 mb-2'>{order.customerName}</Text>
        </View>
        <View className='flex-row items-center'>
          <View className='w-24 flex-row items-center'>
            <Image source={{ uri: order.bikerAvatar }} className='w-8 h-8 rounded-full mr-2' />
            <Text className='text-base text-gray-600 font-medium'>Tài xế:</Text>
          </View>
          <Text className='flex-1 text-base text-gray-600'>{order.bikerName}</Text>
        </View>
      </View>
      <View className='bg-gray-50 p-4 rounded-lg mb-4'>
        <Text className='text-lg font-semibold text-gray-700 mb-2'>Món ăn đã đặt</Text>
        {order.items.map(({ item, quantity }, index) => (
          <View key={index} className='flex-row justify-between py-2 border-b border-gray-200'>
            <Text className='text-base text-gray-600 flex-1'>
              {item.name} x{quantity}
              {item.option_menu && item.option_menu.length > 0 && (
                <Text className='text-sm text-gray-500'>
                  {' '}
                  ({item.option_menu.map((options) => options.join('/')).join(', ')})
                </Text>
              )}
            </Text>
            <Text className='text-base text-gray-600 font-medium'>{item.price}</Text>
          </View>
        ))}
      </View>
      <View className='flex-row justify-between items-center bg-blue-50 p-4 rounded-lg'>
        <Text className='text-lg font-semibold text-gray-700'>Tổng tiền:</Text>
        <Text className='text-xl font-bold text-blue-600'>{getTotalPrice(order.items)}</Text>
      </View>
    </View>
  )

  return (
    <>
      <ScrollView className='bg-white flex-1 px-4'>
        {/* Header */}
              <View className='flex-row items-center p-4 bg-white '>
                <Text className='flex-1 text-center text-4xl font-bold text-gray-900'>
                  Đơn hàng
                </Text>
              </View>

        {/* Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className='bg-white px-3 py-[6] border-b border-gray-200'>
          <View className='flex-row space-x-2'>
            {tabs.map((tab) => (
              <View className='p-1' key={tab}>
                <TouchableOpacity
                  onPress={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-full ${
                    activeTab === tab ? 'bg-blue-500' : 'bg-gray-100'
                  }`}>
                  <Text
                    className={`text-sm font-medium ${
                      activeTab === tab ? 'text-white' : 'text-gray-700'
                    } text-center`}>
                    {tab}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Order List */}
        <View className='bg-white px-3 py-4'>
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <TouchableOpacity
                key={order.id}
                onPress={() => handleOrderPress(order)}
                className='flex-row justify-between items-start py-3 border-b border-gray-200'>
                <View className='flex-col flex-1 items-start'>
                  <View className='flex-row items-center'>
                    <Image
                      source={{ uri: order.bikerAvatar }}
                      className='w-12 h-12 rounded-full mr-3'
                    />
                    <Text className='text-base font-medium'>{order.bikerName}</Text>
                  </View>
                  <Text className='text-xl font-bold mt-1'>{order.id}</Text>
                  <Text className='text-base text-gray-500 mt-1'>
                    {getTotalItems(order.items)} sản phẩm dành cho {order.customerName}
                  </Text>
                </View>
                <View className='flex-col items-end'>
                  <Text className='text-base text-gray-500 mb-2'>{order.time}</Text>
                  <View className='bg-gray-100 rounded-lg p-2 flex-col mt-4 h-12 w-36 justify-center items-center'>
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation() // Prevent parent TouchableOpacity from triggering
                        handleStatusPress(order)
                      }}
                      className='flex-row items-center'
                      disabled={order.status === 'Lịch sử'}>
                      <Feather
                        name='check'
                        size={18}
                        color={
                          order.status === 'Chờ xác nhận'
                            ? '#f97316' // Orange for "Chờ xác nhận"
                            : order.status === 'Đang chuẩn bị'
                            ? '#3b82f6' // Blue for "Đang chuẩn bị"
                            : order.status === 'Sẵn sàng'
                            ? '#22c55e' // Green for "Sẵn sàng"
                            : '#6b7280' // Gray for "Lịch sử"
                        }
                      />
                      <Text
                        className={`ml-1 text-sm font-medium ${
                          order.status === 'Chờ xác nhận'
                            ? 'text-orange-500'
                            : order.status === 'Đang chuẩn bị'
                            ? 'text-blue-500'
                            : order.status === 'Sẵn sàng'
                            ? 'text-green-500'
                            : 'text-gray-500'
                        }`}>
                        {order.status}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View className='py-4'>
              <Text className='text-center text-gray-500'>
                Không có đơn hàng trong danh mục này
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Modal for Order Details */}
      <Modal
        visible={!!selectedOrder}
        transparent={true}
        animationType='slide'
        onRequestClose={() => setSelectedOrder(null)}>
        <View className='flex-1 bg-black/50 justify-center'>
          {selectedOrder && renderOrderDetails(selectedOrder)}
        </View>
      </Modal>
    </>
  )
}

export default Order