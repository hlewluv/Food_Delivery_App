import React, { useState, useMemo } from 'react'
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Dimensions,
  TextInput,
  TouchableWithoutFeedback,
  FlatList,
  Platform
} from 'react-native'
import { Feather, MaterialIcons, Ionicons } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker'
import Svg, { Circle, Rect, Text as SvgText } from 'react-native-svg'

interface Transaction {
  id: string
  date: string | Date
  time: string
  customer: string
  items: { price: number }[]
  status: string
}

interface StatisticsSectionProps {
  transactions: Transaction[]
  monthlyGoal: number
  setMonthlyGoal: (goal: number) => void
  selectedDate: Date
  setSelectedDate: (date: Date) => void
  filter: string
  setFilter: (filter: string) => void
  currentPage: number
  setCurrentPage: (page: number) => void
  selectedMonth: number
  setSelectedMonth: (month: number) => void
  selectedYear: number
  setSelectedYear: (year: number) => void
  formatCurrency: (amount: number | string) => string
}

const parseDate = (dateInput: string | Date) => {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
  if (!date || isNaN(date.getTime())) {
    return null
  }
  const vietnamDate = new Date(date.getTime() + 7 * 60 * 60 * 1000)
  return vietnamDate
}

const useTransactionData = (
  transactionsRaw: Transaction[],
  selectedMonth: number,
  selectedYear: number,
  filter: string,
  currentPage: number,
  selectedDate: Date,
  dateFilterMode: 'month' | 'day'
) => {
  const transactions = useMemo(() => {
    return transactionsRaw
      .map(t => {
        const date = parseDate(t.date)
        if (!date || isNaN(date.getTime())) {
          console.warn(`Invalid date for transaction ${t.id}: ${JSON.stringify(t.date)}`)
          return null
        }
        return {
          ...t,
          date,
          items: t.items || [],
          itemCount: t.items.length,
          total: t.items.reduce((sum, item) => sum + (item.price || 0), 0),
          status:
            t.status === 'Hoàn tất'
              ? 'Đã thanh toán'
              : t.status === 'Chưa trả'
              ? 'Đang xử lý'
              : 'Đã hủy'
        }
      })
      .filter((t): t is NonNullable<typeof t> => t !== null)
  }, [transactionsRaw])

  const today = new Date()
  const vietnamToday = new Date(today.getTime() + 7 * 60 * 60 * 1000)
  const todayString = vietnamToday.toISOString().split('T')[0]
  const currentMonth = vietnamToday.getMonth()
  const currentYear = vietnamToday.getFullYear()
  const yesterday = new Date(vietnamToday)
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayString = yesterday.toISOString().split('T')[0]

  const yesterdayTransactions = transactions.filter(
    t => t.date.toISOString().split('T')[0] === yesterdayString
  )
  const yesterdayRevenue = yesterdayTransactions.reduce((sum, t) => sum + t.total, 0)

  const todayTransactions = transactions.filter(
    t => t.date.toISOString().split('T')[0] === todayString
  )
  const todayRevenue = todayTransactions.reduce((sum, t) => sum + t.total, 0)
  const todayItemsSold = todayTransactions.reduce((sum, t) => sum + t.itemCount, 0)
  const todayCustomers = new Set(todayTransactions.map(t => t.customer)).size

  console.log('Vietnam Today:', vietnamToday)
  console.log('Today String:', todayString)
  console.log('Today Transactions:', todayTransactions)
  console.log('Today Revenue:', todayRevenue)
  console.log('Yesterday String:', yesterdayString)
  console.log('Yesterday Transactions:', yesterdayTransactions)
  console.log('Yesterday Revenue:', yesterdayRevenue)
  console.log('Selected Date:', selectedDate)
  console.log('Date Filter Mode:', dateFilterMode)
  console.log('Selected Month:', selectedMonth, 'Selected Year:', selectedYear)

  const mayRevenue = transactions
    .filter(
      t =>
        t.date.getMonth() === currentMonth &&
        t.date.getFullYear() === currentYear &&
        t.status === 'Đã thanh toán'
    )
    .reduce((sum, t) => sum + t.total, 0)

  const monthlyRevenue = transactions.reduce(
    (acc, t) => {
      const month = `Th${t.date.getMonth() + 1}`
      acc[month] = (acc[month] || 0) + (t.status === 'Đã thanh toán' ? t.total : 0)
      return acc
    },
    {
      Th1: 0,
      Th2: 0,
      Th3: 0,
      Th4: 0,
      Th5: 0,
      Th6: 0,
      Th7: 0,
      Th8: 0,
      Th9: 0,
      Th10: 0,
      Th11: 0,
      Th12: 0
    } as Record<string, number>
  )

  const filteredTransactions = useMemo(() => {
    let filtered = transactions
    if (dateFilterMode === 'day') {
      const selectedDateString = selectedDate.toISOString().split('T')[0]
      filtered = transactions.filter(t => t.date.toISOString().split('T')[0] === selectedDateString)
    } else {
      filtered = transactions.filter(
        t => t.date.getMonth() === selectedMonth && t.date.getFullYear() === selectedYear
      )
    }
    if (filter !== 'All') {
      filtered = filtered.filter(t => t.status.toLowerCase() === filter.toLowerCase())
    }
    console.log('Filtered Transactions:', filtered)
    return filtered
  }, [transactions, selectedMonth, selectedYear, filter, selectedDate, dateFilterMode])

  const transactionsPerPage = 5
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * transactionsPerPage
    return filteredTransactions.slice(startIndex, startIndex + transactionsPerPage)
  }, [filteredTransactions, currentPage])

  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage)

  const availableMonths = useMemo(() => {
    const months: Record<string, { month: number; year: number; label: string }> = {}
    transactions.forEach(t => {
      const month = t.date.getMonth()
      const year = t.date.getFullYear()
      const key = `${year}-${month}`
      if (!months[key]) {
        months[key] = { month, year, label: `Tháng ${month + 1}/${year}` }
      }
    })
    const sortedMonths = Object.values(months).sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year
      return b.month - a.month
    })
    console.log('Available Months:', sortedMonths)
    return sortedMonths
  }, [transactions])

  const availableYears = useMemo(() => {
    const years = new Set(transactions.map(t => t.date.getFullYear()))
    const sortedYears = Array.from(years).sort((a, b) => b - a)
    console.log('Available Years:', sortedYears)
    return sortedYears
  }, [transactions])

  return {
    todayRevenue,
    yesterdayRevenue,
    todayItemsSold,
    todayCustomers,
    mayRevenue,
    monthlyRevenue,
    filteredTransactions,
    paginatedTransactions,
    totalPages,
    availableMonths,
    availableYears
  }
}

const StatisticsSection: React.FC<StatisticsSectionProps> = ({
  transactions,
  monthlyGoal,
  setMonthlyGoal,
  selectedDate,
  setSelectedDate,
  filter,
  setFilter,
  currentPage,
  setCurrentPage,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
  formatCurrency
}) => {
  const [showGoalModal, setShowGoalModal] = useState(false)
  const [goalInput, setGoalInput] = useState('')
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showMonthPicker, setShowMonthPicker] = useState(false)
  const [dateFilterMode, setDateFilterMode] = useState<'month' | 'day'>('month')

  const {
    todayRevenue,
    yesterdayRevenue,
    todayItemsSold,
    todayCustomers,
    mayRevenue,
    monthlyRevenue,
    filteredTransactions,
    paginatedTransactions,
    totalPages,
    availableMonths,
    availableYears
  } = useTransactionData(
    transactions,
    selectedMonth,
    selectedYear,
    filter,
    currentPage,
    selectedDate,
    dateFilterMode
  )

  const defaultFormatCurrency = (amount: number | string) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount
    return num.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
  }
  const formatCurrencyFn = formatCurrency || defaultFormatCurrency

  const screenWidth = Dimensions.get('window').width
  const chartWidth = screenWidth - 40
  const chartHeight = 200

  const actualProgress = monthlyGoal > 0 ? (mayRevenue / monthlyGoal) * 100 : 0
  const displayProgress = Math.min(actualProgress, 100)
  const progressColor =
    actualProgress >= 100 ? '#00b14f' : actualProgress < 60 ? '#ef4444' : '#facc15'
  const radius = 30
  const strokeWidth = 4
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (displayProgress / 100) * circumference

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

  const onDateChange = (event: any, selected: Date | undefined) => {
    const currentDate = selected || selectedDate
    setShowDatePicker(false)
    setSelectedDate(currentDate)
    setDateFilterMode('day')
    console.log('Date Selected:', currentDate)
  }

  const onWebDateChange = (event: any) => {
    const date = new Date(event.target.value)
    if (!isNaN(date.getTime())) {
      setSelectedDate(date)
      setDateFilterMode('day')
      console.log('Web Date Selected:', date)
    }
  }

  const handleMonthChange = (month: number, year: number) => {
    console.log('Month Selected:', { month, year })
    setSelectedMonth(month)
    setSelectedYear(year)
    setCurrentPage(1)
    setShowMonthPicker(false)
    setDateFilterMode('month')
  }

  const renderPagination = () => {
    if (filteredTransactions.length <= 5) return null
    return (
      <View className='flex-row justify-center items-center my-4'>
        <TouchableOpacity
          onPress={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className={`p-2 mx-1 ${currentPage === 1 ? 'opacity-50' : ''}`}>
          <Ionicons
            name='chevron-back'
            size={20}
            color={currentPage === 1 ? '#9ca3af' : '#00b14f'}
          />
        </TouchableOpacity>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <TouchableOpacity
            key={page}
            onPress={() => setCurrentPage(page)}
            className={`w-8 h-8 rounded-full mx-1 flex items-center justify-center ${
              currentPage === page ? 'bg-green-600' : 'bg-gray-100'
            }`}>
            <Text className={`text-sm ${currentPage === page ? 'text-white' : 'text-gray-700'}`}>
              {page}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          onPress={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
          className={`p-2 mx-1 ${currentPage === totalPages ? 'opacity-50' : ''}`}>
          <Ionicons
            name='chevron-forward'
            size={20}
            color={currentPage === totalPages ? '#9ca3af' : '#00b14f'}
          />
        </TouchableOpacity>
      </View>
    )
  }

  const renderTransactionItem = ({ item }: { item: any }) => (
    <View className='flex-row py-3 px-4 border-b border-gray-100 items-center'>
      <View className='w-20'>
        <Text className='text-sm font-medium text-gray-900'>{item.id}</Text>
        <Text className='text-xs text-gray-500'>{item.time}</Text>
      </View>
      <View className='flex-1 flex-row justify-between items-center'>
        <Text className='text-sm text-gray-700 w-24'>
          {item.date.toLocaleDateString('vi-VN', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric'
          })}
        </Text>
        <Text className='text-sm text-gray-700 w-16 text-right'>
          {formatCurrencyFn(item.total)}
        </Text>
        <View
          className={`px-2 py-1 rounded-full ${
            item.status === 'Đang xử lý'
              ? 'bg-yellow-100'
              : item.status === 'Đã hủy'
              ? 'bg-red-100'
              : 'bg-green-100'
          }`}>
          <Text
            className={`text-xs text-center ${
              item.status === 'Đang xử lý'
                ? 'text-yellow-800'
                : item.status === 'Đã hủy'
                ? 'text-red-800'
                : 'text-green-800'
            }`}>
            {item.status}
          </Text>
        </View>
      </View>
    </View>
  )

  const allMonths = [
    { month: 0, label: 'Tháng 1' },
    { month: 1, label: 'Tháng 2' },
    { month: 2, label: 'Tháng 3' },
    { month: 3, label: 'Tháng 4' },
    { month: 4, label: 'Tháng 5' },
    { month: 5, label: 'Tháng 6' },
    { month: 6, label: 'Tháng 7' },
    { month: 7, label: 'Tháng 8' },
    { month: 8, label: 'Tháng 9' },
    { month: 9, label: 'Tháng 10' },
    { month: 10, label: 'Tháng 11' },
    { month: 11, label: 'Tháng 12' }
  ]

  const renderYearItem = ({ item }: { item: number }) => (
    <TouchableOpacity
      onPress={() => {
        console.log('Year Selected:', item)
        setSelectedYear(item)
      }}
      className={`px-4 py-2 mx-1 rounded-lg ${
        selectedYear === item ? 'bg-green-600' : 'bg-gray-100'
      }`}>
      <Text className={`font-medium ${selectedYear === item ? 'text-white' : 'text-gray-700'}`}>
        {item}
      </Text>
    </TouchableOpacity>
  )

  const renderMonthItem = ({ item }: { item: { month: number; label: string } }) => {
    const hasTransactions = availableMonths.some(
      m => m.month === item.month && m.year === selectedYear
    )

    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedMonth(item.month)
          setShowMonthPicker(false)
          setCurrentPage(1)
          setDateFilterMode('month')
        }}
        disabled={!hasTransactions}
        className={`w-[30%] my-2 p-3 rounded-lg ${
          selectedMonth === item.month
            ? 'bg-green-600'
            : hasTransactions
            ? 'bg-white border border-gray-200'
            : 'bg-gray-100'
        }`}>
        <Text
          className={`text-center ${
            selectedMonth === item.month
              ? 'text-white font-medium'
              : hasTransactions
              ? 'text-gray-800'
              : 'text-gray-400'
          }`}>
          {item.label}
        </Text>
      </TouchableOpacity>
    )
  }

  return (
    <>
      <View className='bg-[#00b14f] rounded-xl p-4 mt-4 mx-3 shadow-md'>
        <View className='flex-row justify-between items-center'>
          <View>
            <Text className='text-white text-sm'>Doanh thu hôm nay</Text>
            <Text className='text-white text-3xl font-bold mt-1'>
              {formatCurrencyFn(todayRevenue)}
            </Text>
          </View>
          <View>
            <Text className='text-white text-sm'>Doanh thu hôm qua</Text>
            <Text className='text-white text-base mt-1'>{formatCurrencyFn(yesterdayRevenue)}</Text>
          </View>
        </View>
        <View className='flex-row justify-between items-center mt-4 pt-3 border-t border-white/30'>
          <View className='flex-row items-center'>
            <Feather name='shopping-bag' size={18} color='white' />
            <Text className='text-white text-sm ml-2'>{todayItemsSold} đơn hàng</Text>
          </View>
          <View className='flex-row items-center'>
            <MaterialIcons name='qr-code' size={18} color='white' />
            <Text className='text-white text-sm ml-2'>{todayCustomers} thanh toán QR</Text>
          </View>
        </View>
      </View>

      <View className='px-3 py-4'>
        <View className='flex-row justify-between mb-6'>
          <View className='bg-white rounded-lg p-4 flex-1 mr-2 border border-gray-200'>
            <Text className='text-lg font-semibold text-gray-800 mb-4'>THỐNG KÊ HÔM NAY</Text>
            <View className='flex-row justify-between'>
              <View className='items-center'>
                <Text className='text-gray-600 text-sm'>Tiền thu</Text>
                <Text className='text-xl font-bold text-[#00b14f]'>
                  {formatCurrencyFn(todayRevenue)}
                </Text>
              </View>
              <View className='items-center'>
                <Text className='text-gray-600 text-sm'>Món bán ra</Text>
                <Text className='text-xl font-bold text-[#00b14f]'>{todayItemsSold}</Text>
              </View>
              <View className='items-center'>
                <Text className='text-gray-600 text-sm'>Khách hàng</Text>
                <Text className='text-xl font-bold text-[#00b14f]'>{todayCustomers}</Text>
              </View>
            </View>
          </View>
          <View className='bg-white rounded-lg p-4 flex-1 ml-2 border border-gray-200'>
            <Text className='text-lg font-semibold text-gray-800 mb-2'>
              TIẾN ĐỘ DOANH THU THÁNG
            </Text>
            <View className='flex-row items-center justify-between'>
              <Text className='text-2xl font-bold text-gray-800'>
                {formatCurrencyFn(mayRevenue)}
              </Text>
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
              Mục tiêu: {formatCurrencyFn(monthlyGoal)}
            </Text>
            <TouchableOpacity
              onPress={() => setShowGoalModal(true)}
              className='bg-[#00b14f] px-4 py-2 rounded-full mt-4 self-center'>
              <Text className='text-white font-semibold'>Thiết lập mục tiêu</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className='bg-white rounded-lg p-4 border border-gray-200 mb-6'>
          <Text className='text-lg font-semibold text-gray-800 mb-4'>
            Doanh Thu Gần Đây (Triệu VND)
          </Text>
          <View className='flex-row'>
            <Svg width={40} height={chartHeight}>
              {Array.from(
                { length: Math.ceil(Math.max(...Object.values(monthlyRevenue)) / 1000000) + 1 },
                (_, i) => i
              ).map((tick, index) => (
                <SvgText
                  key={tick}
                  x={30}
                  y={
                    chartHeight -
                    30 -
                    (index / Math.ceil(Math.max(...Object.values(monthlyRevenue)) / 1000000)) *
                      (chartHeight - 50)
                  }
                  fontSize='12'
                  fill='#6b7280'
                  textAnchor='end'>
                  {tick}
                </SvgText>
              ))}
            </Svg>
            <Svg width={chartWidth - 40} height={chartHeight}>
              {[
                'Th1',
                'Th2',
                'Th3',
                'Th4',
                'Th5',
                'Th6',
                'Th7',
                'Th8',
                'Th9',
                'Th10',
                'Th11',
                'Th12'
              ].map((month, index) => {
                const barHeight =
                  (monthlyRevenue[month] /
                    ((Math.ceil(Math.max(...Object.values(monthlyRevenue)) / 1000000) + 1) *
                      1000000)) *
                  (chartHeight - 50)
                const barWidth = (chartWidth - 60) / 12 - 48
                const x = index * (barWidth + 20)
                const y = chartHeight - barHeight - 30
                return (
                  <React.Fragment key={month}>
                    <Rect x={x} y={y} width={barWidth} height={barHeight} fill='#00b14f' rx={4} />
                    <SvgText
                      x={x + barWidth / 2}
                      y={chartHeight - 10}
                      fontSize='10'
                      fill='#6b7280'
                      textAnchor='middle'>
                      {month.replace('Th', '')}
                    </SvgText>
                  </React.Fragment>
                )
              })}
            </Svg>
          </View>
        </View>
      </View>

      <View className='px-3'>
        <Text className='text-lg font-semibold mb-4'>Lịch Sử Giao Dịch</Text>
        <View className='mx-1 mt-1'>
          <Text className='text-sm font-medium text-gray-700 mb-1'>Chọn ngày</Text>
          <View className='flex-row items-center space-x-2'>
            {Platform.OS === 'web' ? (
              <input
                type='date'
                value={selectedDate.toISOString().split('T')[0]}
                onChange={onWebDateChange}
                max={new Date().toISOString().split('T')[0]}
                className='bg-white p-3 rounded-lg border border-gray-200 text-base text-gray-800'
                style={{ width: 150 }}
              />
            ) : (
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                className='flex-row items-center justify-between bg-white p-3 rounded-lg border border-gray-200 flex-1'>
                <Text className='text-base text-gray-800'>
                  {selectedDate.toLocaleDateString('vi-VN', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </Text>
                <Ionicons name='calendar' size={20} color='#6b7280' />
              </TouchableOpacity>
            )}
          </View>
          {showDatePicker && Platform.OS !== 'web' && (
            <DateTimePicker
              value={selectedDate}
              mode='date'
              display='default'
              maximumDate={new Date()}
              onChange={onDateChange}
            />
          )}
          {dateFilterMode === 'day' && (
            <TouchableOpacity
              onPress={() => setDateFilterMode('month')}
              className='mt-2 bg-gray-200 px-4 py-2 rounded-lg'>
              <Text className='text-sm text-gray-700'>Quay lại lọc theo tháng</Text>
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          data={['All', 'Đã thanh toán', 'Đang xử lý', 'Đã hủy']}
          horizontal
          showsHorizontalScrollIndicator={false}
          className='mt-4 px-1'
          contentContainerStyle={{ paddingHorizontal: 8 }}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                setFilter(item)
                setCurrentPage(1)
              }}
              className={`px-4 py-2 rounded-full mx-1 ${
                filter === item ? 'bg-green-600' : 'bg-gray-200'
              }`}>
              <Text className={`text-sm ${filter === item ? 'text-white' : 'text-gray-700'}`}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />

        <View className='mx-1 mt-4 bg-white rounded-xl shadow-sm overflow-hidden'>
          <View className='flex-row items-center justify-between p-4 border-b border-gray-100'>
            <Text className='text-lg font-semibold'>Lịch sử giao dịch</Text>
            <TouchableOpacity
              onPress={() => setShowMonthPicker(true)}
              className='flex-row items-center bg-green-50 py-1.5 px-3 rounded-lg border border-green-200'>
              <Text className='text-sm font-medium text-green-700 mr-1'>
                Tháng {selectedMonth + 1}/{selectedYear}
              </Text>
              <Ionicons name='chevron-down' size={16} color='#00b14f' />
            </TouchableOpacity>
          </View>
          <Text className='text-sm text-gray-500 px-4 pt-2 pb-3'>
            Tổng cộng: {filteredTransactions.length} giao dịch
          </Text>
          <View className='flex-row bg-gray-50 px-4 py-3'>
            <Text className='text-xs font-medium text-gray-500 w-20'>Mã đơn</Text>
            <View className='flex-1 flex-row justify-between'>
              <Text className='text-xs font-medium text-gray-500 w-24'>Ngày</Text>
              <Text className='text-xs font-medium text-gray-500 w-16 text-right'>Tổng tiền</Text>
              <Text className='text-xs font-medium text-gray-500 w-16'>Trạng thái</Text>
            </View>
          </View>
          <FlatList
            data={paginatedTransactions}
            renderItem={renderTransactionItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            ListEmptyComponent={
              <View className='p-8 items-center'>
                <Ionicons name='receipt-outline' size={40} color='#d1d5db' />
                <Text className='text-gray-500 mt-2'>Không có giao dịch nào</Text>
              </View>
            }
          />
          {renderPagination()}
        </View>
      </View>

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
                />
                <View className='flex-row justify-between'>
                  <TouchableOpacity
                    onPress={handleSetGoal}
                    className='bg-[#00b14f] px-6 py-3 rounded-full flex-1 mr-2'>
                    <Text className='text-white font-semibold text-center'>Lưu</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setShowGoalModal(false)}
                    className='bg-gray-500 px-6 py-3 rounded-full flex-1 ml-2'>
                    <Text className='text-white font-semibold text-center'>Hủy</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        visible={showMonthPicker}
        transparent={true}
        animationType='fade'
        onRequestClose={() => setShowMonthPicker(false)}>
        <TouchableWithoutFeedback onPress={() => setShowMonthPicker(false)}>
          <View className='flex-1 justify-center items-center bg-black/50'>
            <View
              className='bg-white rounded-xl w-11/12 max-w-md p-4'
              onStartShouldSetResponder={() => true}>
              <View className='flex-row justify-between items-center mb-4'>
                <Text className='text-lg font-bold text-gray-800'>Chọn tháng</Text>
                <TouchableOpacity onPress={() => setShowMonthPicker(false)}>
                  <Ionicons name='close' size={22} color='#6b7280' />
                </TouchableOpacity>
              </View>

              {availableYears.length === 0 ? (
                <Text className='text-gray-500 text-center py-4'>Không có dữ liệu tháng nào</Text>
              ) : (
                <>
                  {/* Năm */}
                  <View className='mb-4'>
                    <FlatList
                      data={availableYears}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      keyExtractor={item => item.toString()}
                      renderItem={renderYearItem}
                      contentContainerStyle={{ gap: 8 }}
                    />
                  </View>

                  {/* Các tháng */}
                  <View className='mb-2'>
                    <Text className='text-sm text-gray-500 mb-2'>Tháng:</Text>
                    <View className='flex-row flex-wrap justify-between'>
                      {allMonths.map(item => {
                        const hasTransactions = availableMonths.some(
                          m => m.month === item.month && m.year === selectedYear
                        )

                        return (
                          <TouchableOpacity
                            key={item.month}
                            onPress={() => {
                              setSelectedMonth(item.month)
                              setShowMonthPicker(false)
                            }}
                            disabled={!hasTransactions}
                            className={`w-[30%] mb-3 p-3 rounded-lg ${
                              selectedMonth === item.month
                                ? 'bg-green-600'
                                : hasTransactions
                                ? 'bg-white border border-gray-200'
                                : 'bg-gray-100'
                            }`}
                            style={{ marginHorizontal: '1.5%' }} // Căn đều các tháng
                          >
                            <Text
                              className={`text-center ${
                                selectedMonth === item.month
                                  ? 'text-white font-medium'
                                  : hasTransactions
                                  ? 'text-gray-800'
                                  : 'text-gray-400'
                              }`}>
                              {item.label}
                            </Text>
                          </TouchableOpacity>
                        )
                      })}
                    </View>
                  </View>
                </>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  )
}

export default StatisticsSection
