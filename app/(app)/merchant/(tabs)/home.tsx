import React, { useState } from 'react'
import { ScrollView, View, Text, TouchableOpacity, Image } from 'react-native'
import { Feather } from '@expo/vector-icons'
import Header from '@/components/merchant/home/Header'
import StatisticsSection from '@/components/merchant/home/StatisticsSection'
import transactionData from '@/data/transactions'


const Home = () => {
  const [monthlyGoal, setMonthlyGoal] = useState(1000000)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [filter, setFilter] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  const formatCurrency = (amount: number | string) => {
    const numericAmount =
      typeof amount === 'string' ? parseFloat(amount.replace(/[^0-9.-]+/g, '')) : amount
    if (isNaN(numericAmount)) return '0 ₫'
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
      numericAmount
    )
  }

  return (
    <ScrollView className='bg-white flex-1'>
      <Header />
      <StatisticsSection
        transactions={transactionData}
        monthlyGoal={monthlyGoal}
        setMonthlyGoal={setMonthlyGoal}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        filter={filter}
        setFilter={setFilter}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        formatCurrency={formatCurrency}
      />
    </ScrollView>
  )
}

export default Home
