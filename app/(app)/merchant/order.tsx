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
}

// Define the Order interface with customer and biker details and items array
interface Order {
  id: string
  customerName: string
  bikerName: string
  bikerAvatar: string
  time: string
  status: string
  items: { item: MenuItem; quantity: number }[]
}

const Order = () => {
  // List of tabs in order
  const tabs = ['Đang chuẩn bị', 'Sẵn sàng', 'Sắp tới', 'Lịch sử']

  // State to manage the active tab
  const [activeTab, setActiveTab] = useState('Đang chuẩn bị')

  // State to manage which order's details are being viewed
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  // State to manage orders
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'GF-001',
      customerName: 'Hatta',
      bikerName: 'Rizki Medan',
      bikerAvatar:
        'https://vcdn1-giaitri.vnecdn.net/2025/03/19/jisoo-1-1742349532-1742349698-5135-1742349805.jpg?w=1200&h=0&q=100&dpr=1&fit=crop&s=hGqSXJnPiHy3r6XbGozF2Q',
      time: '10 phút',
      status: 'Đang chuẩn bị',
      items: [
        {
          item: {
            id: '1-1-1',
            name: 'Big Mac',
            price: '49.000đ',
            restaurant: "McDonald's",
            description: 'Bánh burger với 2 miếng thịt bò, sốt đặc biệt, rau sống tươi ngon',
            image: 29
          },
          quantity: 1
        },
        {
          item: {
            id: '1-1-2',
            name: 'Cheeseburger',
            price: '29.000đ',
            restaurant: "McDonald's",
            description: 'Bánh burger phô mai cổ điển',
            image: 29
          },
          quantity: 1
        }
      ]
    },
    {
      id: 'GF-002',
      customerName: 'Hatta',
      bikerName: 'Rizki Medan',
      bikerAvatar:
        'https://vcdn1-giaitri.vnecdn.net/2025/03/19/jisoo-1-1742349532-1742349698-5135-1742349805.jpg?w=1200&h=0&q=100&dpr=1&fit=crop&s=hGqSXJnPiHy3r6XbGozF2Q',
      time: '10 phút',
      status: 'Sẵn sàng',
      items: [
        {
          item: {
            id: '1-1-1',
            name: 'Big Mac',
            price: '49.000đ',
            restaurant: "McDonald's",
            description: 'Bánh burger với 2 miếng thịt bò, sốt đặc biệt, rau sống tươi ngon',
            image: 29
          },
          quantity: 1
        },
        {
          item: {
            id: '1-1-2',
            name: 'Cheeseburger',
            price: '29.000đ',
            restaurant: "McDonald's",
            description: 'Bánh burger phô mai cổ điển',
            image: 29
          },
          quantity: 1
        }
      ]
    },
    {
      id: 'GF-003',
      customerName: 'Hatta',
      bikerName: 'Rizki Medan',
      bikerAvatar:
        'https://vcdn1-giaitri.vnecdn.net/2025/03/19/jisoo-1-1742349532-1742349698-5135-1742349805.jpg?w=1200&h=0&q=100&dpr=1&fit=crop&s=hGqSXJnPiHy3r6XbGozF2Q',
      time: '10 phút',
      status: 'Sắp tới',
      items: [
        {
          item: {
            id: '1-1-1',
            name: 'Big Mac',
            price: '49.000đ',
            restaurant: "McDonald's",
            description: 'Bánh burger với 2 miếng thịt bò, sốt đặc biệt, rau sống tươi ngon',
            image: 29
          },
          quantity: 1
        },
        {
          item: {
            id: '1-1-2',
            name: 'Cheeseburger',
            price: '29.000đ',
            restaurant: "McDonald's",
            description: 'Bánh burger phô mai cổ điển',
            image: 29
          },
          quantity: 1
        }
      ]
    },
    {
      id: 'GF-004',
      customerName: 'Hatta',
      bikerName: 'Rizki Medan',
      bikerAvatar:
        'https://vcdn1-giaitri.vnecdn.net/2025/03/19/jisoo-1-1742349532-1742349698-5135-1742349805.jpg?w=1200&h=0&q=100&dpr=1&fit=crop&s=hGqSXJnPiHy3r6XbGozF2Q',
      time: '10 phút',
      status: 'Lịch sử',
      items: [
        {
          item: {
            id: '1-1-1',
            name: 'Big Mac',
            price: '49.000đ',
            restaurant: "McDonald's",
            description: 'Bánh burger với 2 miếng thịt bò, sốt đặc biệt, rau sống tươi ngon',
            image: 29
          },
          quantity: 1
        },
        {
          item: {
            id: '1-1-2',
            name: 'Cheeseburger',
            price: '29.000đ',
            restaurant: "McDonald's",
            description: 'Bánh burger phô mai cổ điển',
            image: 29
          },
          quantity: 1
        }
      ]
    }
  ])

  // Function to move an order to the next tab
  const moveToNextTab = (orderId: string) => {
    setOrders(prevOrders => {
      return prevOrders.map(order => {
        if (order.id === orderId) {
          const currentTabIndex = tabs.indexOf(order.status)
          const nextTabIndex = (currentTabIndex + 1) % tabs.length // Loop back to first tab if at the end
          return { ...order, status: tabs[nextTabIndex] }
        }
        return order
      })
    })
  }

  // Filter orders based on the active tab
  const filteredOrders = orders.filter(order => order.status === activeTab)

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
    if (activeTab !== 'Lịch sử') {
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
        <View className='bg-white px-3 pt-5 pb-3'>
          <View className='flex-row justify-between items-center'>
            <TouchableOpacity onPress={() => router.back()} className='mr-4'>
              <Ionicons name='arrow-back' size={28} color='gray' />
            </TouchableOpacity>
            <Text className='text-xl font-bold'>Đơn hàng</Text>
            <View className='flex-row items-center'>
              <TouchableOpacity className='mr-2'>
                <Feather name='filter' size={20} color='#6b7280' />
              </TouchableOpacity>
              <TouchableOpacity>
                <Feather name='search' size={20} color='#6b7280' />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className='bg-white px-3 py-2 border-b border-gray-200'>
          <View className='flex-row space-x-2'>
            {tabs.map(tab => (
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
            filteredOrders.map(order => (
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
                  <View className='bg-gray-100 rounded-lg p-2 flex-col items-end mt-4 h-12 w-28 justify-center items-center'>
                    <TouchableOpacity
                      onPress={e => {
                        e.stopPropagation() // Prevent parent TouchableOpacity from triggering
                        handleStatusPress(order)
                      }}
                      className='flex-row items-center'>
                      <Feather
                        name='check'
                        size={18}
                        color={
                          order.status === 'Đang chuẩn bị'
                            ? '#3b82f6' // Blue for "Đang chuẩn bị"
                            : order.status === 'Sẵn sàng'
                            ? '#22c55e' // Green for "Sẵn sàng"
                            : order.status === 'Sắp tới'
                            ? '#f59e0b' // Yellow for "Sắp tới"
                            : '#6b7280' // Gray for "Lịch sử"
                        }
                      />
                      <Text
                        className={`ml-1 text-sm font-medium ${
                          order.status === 'Đang chuẩn bị'
                            ? 'text-blue-500'
                            : order.status === 'Sẵn sàng'
                            ? 'text-green-500'
                            : order.status === 'Sắp tới'
                            ? 'text-yellow-500'
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
