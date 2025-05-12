import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TextInput,
  Modal,
  TouchableWithoutFeedback
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import Svg, { Circle, Rect, Text as SvgText } from 'react-native-svg'

const MonthlyRevenueChart = ({ data, width, height }) => {
  const months = Object.keys(data).slice(-4)
  const revenues = months.map(month => data[month])
  const maxRevenue = Math.max(...revenues, 1)
  const barWidth = (width - 60) / months.length - 10
  const barSpacing = 10

  const maxRevenueMillions = Math.ceil(maxRevenue / 1000000)
  const yAxisTicks = Array.from({ length: maxRevenueMillions + 1 }, (_, i) => i)

  return (
    <View
      className='bg-white rounded-lg p-4 border border-gray-200 mb-6'
      accessibilityLabel='Biểu đồ doanh thu 4 tháng gần đây'>
      <Text className='text-lg font-semibold text-gray-800 mb-4'>
        Doanh Thu Gần Đây (Triệu VND)
      </Text>
      <View className='flex-row'>
        <Svg width={40} height={height}>
          {yAxisTicks.map((tick, index) => (
            <SvgText
              key={tick}
              x={30}
              y={height - 30 - (index / (yAxisTicks.length - 1)) * (height - 50)}
              fontSize='12'
              fill='#6b7280'
              textAnchor='end'>
              {tick}
            </SvgText>
          ))}
        </Svg>
        <Svg width={width - 40} height={height}>
          {months.map((month, index) => {
            const barHeight = (revenues[index] / (maxRevenueMillions * 1000000)) * (height - 50)
            const x = index * (barWidth + barSpacing)
            const y = height - barHeight - 30

            return (
              <React.Fragment key={month}>
                <Rect x={x} y={y} width={barWidth} height={barHeight} fill='#00b14f' rx={4} />
                <SvgText
                  x={x + barWidth / 2}
                  y={height - 10}
                  fontSize='12'
                  fill='#6b7280'
                  textAnchor='middle'>
                  {month}
                </SvgText>
              </React.Fragment>
            )
          })}
        </Svg>
      </View>
    </View>
  )
}

const RevenueScreen = () => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [monthlyGoal, setMonthlyGoal] = useState(1000000) // Default goal: 1,000,000 VND
  const [showGoalModal, setShowGoalModal] = useState(false)
  const [goalInput, setGoalInput] = useState('')

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatCurrency = amount => {
    const numericAmount =
      typeof amount === 'string' ? parseFloat(amount.replace(/[^0-9.-]+/g, '')) : amount
    if (isNaN(numericAmount)) {
      console.warn('Invalid amount for formatting:', amount)
      return '0 ₫'
    }
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(numericAmount)
  }

  const formatTime = date => {
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const invoices = [
    {
      id: 1,
      items: 3,
      totalPrice: 150000,
      customer: 'Khách A',
      date: '2025-05-10',
      status: 'Đã thanh toán'
    },
    {
      id: 2,
      items: 5,
      totalPrice: 250000,
      customer: 'Khách B',
      date: '2025-05-10',
      status: 'Đã thanh toán'
    },
    {
      id: 3,
      items: 2,
      totalPrice: 1000000,
      customer: 'Khách A',
      date: '2025-05-10',
      status: 'Đã thanh toán'
    },
    {
      id: 4,
      items: 4,
      totalPrice: 200000,
      customer: 'Khách C',
      date: '2025-05-10',
      status: 'Đã thanh toán'
    },
    {
      id: 5,
      items: 1,
      totalPrice: 50000,
      customer: 'Khách D',
      date: '2025-05-09',
      status: 'Đã thanh toán'
    },
    {
      id: 6,
      items: 6,
      totalPrice: 300000,
      customer: 'Khách E',
      date: '2025-04-15',
      status: 'Đã thanh toán'
    },
    {
      id: 7,
      items: 3,
      totalPrice: 150000,
      customer: 'Khách F',
      date: '2025-04-10',
      status: 'Đã hủy'
    },
    {
      id: 8,
      items: 5,
      totalPrice: 1500000,
      customer: 'Khách G',
      date: '2025-03-20',
      status: 'Đã thanh toán'
    },
    {
      id: 9,
      items: 2,
      totalPrice: 100000,
      customer: 'Khách H',
      date: '2025-03-15',
      status: 'Đã thanh toán'
    },
    {
      id: 10,
      items: 4,
      totalPrice: 2000000,
      customer: 'Khách I',
      date: '2025-02-25',
      status: 'Đã thanh toán'
    },
    {
      id: 11,
      items: 4,
      totalPrice: 200000,
      customer: 'Khách I',
      date: '2025-01-25',
      status: 'Đã thanh toán'
    }
  ]

  // Calculate today's metrics (hardcoded date: 2025-05-10)
  const todayInvoices = invoices.filter(invoice => invoice.date === '2025-05-10')
  const todayRevenue = todayInvoices.reduce((sum, invoice) => sum + invoice.totalPrice, 0)
  const todayItemsSold = todayInvoices.reduce((sum, invoice) => sum + invoice.items, 0)
  const todayCustomers = new Set(todayInvoices.map(invoice => invoice.customer)).size

  // Calculate monthly revenue for May (Th5)
  const mayRevenue = invoices
    .filter(invoice => invoice.date.startsWith('2025-05') && invoice.status === 'Đã thanh toán')
    .reduce((sum, invoice) => sum + invoice.totalPrice, 0) // 150000 + 250000 + 100000 + 200000 + 50000 = 750000

  // Calculate progress
  const actualProgress = monthlyGoal > 0 ? (mayRevenue / monthlyGoal) * 100 : 0
  const displayProgress = Math.min(actualProgress, 100) // Cap at 100%
  const progressColor =
    actualProgress >= 100 ? '#00b14f' : actualProgress < 60 ? '#ef4444' : '#facc15'

  // Calculate monthly revenue for chart
  const monthlyRevenue = invoices.reduce(
    (acc, invoice) => {
      const month = `Th${new Date(invoice.date).getMonth() + 1}`
      acc[month] = (acc[month] || 0) + (invoice.status === 'Đã thanh toán' ? invoice.totalPrice : 0)
      return acc
    },
    {
      Th1: 0,
      Th2: 0,
      Th3: 0,
      Th4: 0,
      Th5: 0
    }
  )

  const revenueData = {
    todayRevenue,
    todayItemsSold,
    todayCustomers,
    orders: [
      {
        type: 'Đã thanh toán',
        amount: todayInvoices
          .filter(i => i.status === 'Đã thanh toán')
          .reduce((sum, i) => sum + i.totalPrice, 0)
      },
      {
        type: 'Đang xử lý',
        amount: todayInvoices
          .filter(i => i.status === 'Đang xử lý')
          .reduce((sum, i) => sum + i.totalPrice, 0)
      },
      {
        type: 'Đã hủy',
        amount: todayInvoices
          .filter(i => i.status === 'Đã hủy')
          .reduce((sum, i) => sum + i.totalPrice, 0)
      }
    ],
    monthlyRevenue
  }

  const radius = 30
  const strokeWidth = 4
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (displayProgress / 100) * circumference

  const screenWidth = Dimensions.get('window').width
  const chartWidth = screenWidth - 40
  const chartHeight = 200

  const handleSetGoal = () => {
    const goal = parseFloat(goalInput)
    if (isNaN(goal) || goal <= 0) {
      alert('Vui lòng nhập một số tiền hợp lệ lớn hơn 0.')
      return
    }
    setMonthlyGoal(goal)
    setGoalInput('')
    setShowGoalModal(false)
  }

  return (
    <ScrollView className='flex-1 bg-white'>
      {/* Header */}
      <View className='flex-row items-center p-5 bg-[#00b14f] border-b border-gray-200'>
        <TouchableOpacity
          onPress={() => router.back()}
          className='mr-4'
          accessibilityLabel='Quay lại'>
          <Ionicons name='arrow-back' size={28} color='white' />
        </TouchableOpacity>
        <View className='flex-1 items-center'>
          <Text className='text-white text-2xl font-semibold'>Tổng quan</Text>
        </View>
        <TouchableOpacity className='ml-4' accessibilityLabel='Thông báo'>
          <Ionicons name='notifications-outline' size={24} color='white' />
        </TouchableOpacity>
      </View>

      {/* Location and Time */}
      <View className='flex-row items-center justify-between px-5 py-3 bg-gray-100'>
        <View>
          <Text className='text-gray-600 text-sm'>Hôm nay - {formatTime(currentTime)}</Text>
        </View>
        <View className='flex-row items-center'>
          <Ionicons name='location-outline' size={16} color='gray' />
          <Text className='text-gray-600 text-sm ml-1'>Chi nhánh Cầu...</Text>
          <TouchableOpacity className='ml-2' accessibilityLabel='Chọn chi nhánh'>
            <Ionicons name='chevron-down' size={16} color='gray' />
          </TouchableOpacity>
        </View>
      </View>

      {/* Revenue Section */}
      <View className='p-5'>
        <View className='bg-white rounded-lg p-4 mb-6 border border-gray-200'>
          <Text className='text-lg font-semibold text-gray-800 mb-4'>THỐNG KÊ HÔM NAY</Text>
          <View className='flex-row justify-between'>
            <View className='items-center'>
              <Text className='text-gray-600 text-sm'>Tiền thu</Text>
              <Text className='text-xl font-bold text-[#00b14f]'>
                {formatCurrency(revenueData.todayRevenue)}
              </Text>
            </View>
            <View className='items-center'>
              <Text className='text-gray-600 text-sm'>Món bán ra</Text>
              <Text className='text-xl font-bold text-[#00b14f]'>{revenueData.todayItemsSold}</Text>
            </View>
            <View className='items-center'>
              <Text className='text-gray-600 text-sm'>Khách hàng</Text>
              <Text className='text-xl font-bold text-[#00b14f]'>{revenueData.todayCustomers}</Text>
            </View>
          </View>
        </View>

        {/* Customer Section */}
        <View className='bg-white rounded-lg p-4 mb-6 border border-gray-200'>
          <Text className='text-lg font-semibold text-gray-800 mb-2'>TIẾN ĐỘ DOANH THU THÁNG</Text>
          <View className='flex-row items-center justify-between'>
            <Text className='text-2xl font-bold text-gray-800'>{formatCurrency(mayRevenue)}</Text>
            <View className='flex-row items-center'>
              <Text className='mr-2 text-lg font-semibold' style={{ color: progressColor }}>
                {actualProgress.toFixed(1)}%
              </Text>
              <Svg width='64' height='64' viewBox='0 0 64 64'>
                <Circle
                  cx='32'
                  cy='32'
                  r={radius}
                  fill='none'
                  stroke='#e5e7eb'
                  strokeWidth={strokeWidth}
                />
                <Circle
                  cx='32'
                  cy='32'
                  r={radius}
                  fill='none'
                  stroke={progressColor}
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap='round'
                  transform='rotate(-90 32 32)'
                />
              </Svg>
            </View>
          </View>
          <Text className='text-gray-600 text-sm mt-2'>
            Mục tiêu: {formatCurrency(monthlyGoal)}
          </Text>
          <TouchableOpacity
            onPress={() => setShowGoalModal(true)}
            className='bg-[#00b14f] px-4 py-2 rounded-full mt-4 self-center'
            accessibilityLabel='Thiết lập mục tiêu doanh thu tháng'>
            <Text className='text-white font-semibold'>Thiết lập mục tiêu</Text>
          </TouchableOpacity>
        </View>

        {/* Order Section
        <View className='bg-white rounded-lg p-4 mb-6 border border-gray-200'>
          <Text className='text-lg font-semibold text-gray-800 mb-2'>ĐƠN HÀNG</Text>
          {revenueData.orders.map((order, index) => (
            <View
              key={index}
              className='flex-row items-center justify-between py-2 border-b border-gray-200 last:border-b-0'>
              <Text className={order.amount === 0 ? 'text-red-500' : 'text-gray-600'}>
                {order.type}
              </Text>
              <Text className={order.amount === 0 ? 'text-red-500' : 'text-gray-800 font-medium'}>
                {order.amount === 0 ? '0 ₫' : formatCurrency(order.amount)}
              </Text>
            </View>
          ))}
        </View> */}

        {/* Monthly Revenue Chart */}
        <MonthlyRevenueChart
          data={revenueData.monthlyRevenue}
          width={chartWidth}
          height={chartHeight}
        />
      </View>

      {/* Goal Setting Modal */}
      <Modal
        transparent={true}
        visible={showGoalModal}
        animationType='fade'
        onRequestClose={() => setShowGoalModal(false)}>
        <TouchableWithoutFeedback onPress={() => setShowGoalModal(false)}>
          <View className='flex-1 justify-center items-center bg-black/50'>
            <TouchableWithoutFeedback>
              <View className='bg-white p-6 rounded-2xl w-11/12'>
                <Text className='text-2xl font-bold text-gray-900 mb-4'>
                  Thiết lập mục tiêu tháng
                </Text>
                <Text className='text-gray-600 mb-2'>Nhập số tiền mục tiêu (VND):</Text>
                <TextInput
                  className='border border-gray-300 p-3 rounded-lg mb-4 bg-white'
                  placeholder='VD: 1000000'
                  value={goalInput}
                  onChangeText={setGoalInput}
                  keyboardType='numeric'
                  accessibilityLabel='Mục tiêu doanh thu tháng'
                />
                <View className='flex-row justify-between'>
                  <TouchableOpacity
                    onPress={handleSetGoal}
                    className='bg-[#00b14f] px-6 py-3 rounded-full flex-1 mr-2'
                    accessibilityLabel='Lưu mục tiêu'>
                    <Text className='text-white font-semibold text-center'>Lưu</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setShowGoalModal(false)}
                    className='bg-gray-500 px-6 py-3 rounded-full flex-1 ml-2'
                    accessibilityLabel='Hủy thiết lập mục tiêu'>
                    <Text className='text-white font-semibold text-center'>Hủy</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ScrollView>
  )
}

export default RevenueScreen
