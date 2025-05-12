import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, FlatList, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';

const PaymentScreen = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [filter, setFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const transactionsPerPage = 5;

  const transactions = [
    // Tháng 5/2025
    {
      id: 'A123',
      time: '10:00',
      total: 100000,
      status: 'Hoàn tất',
      paymentMethod: 'Tiền mặt',
      date: new Date('2025-05-10'),
    },
    {
      id: 'A124',
      time: '11:00',
      total: 150000,
      status: 'Chưa trả',
      paymentMethod: 'Thẻ tín dụng',
      date: new Date('2025-05-11'),
    },
    {
      id: 'A125',
      time: '12:00',
      total: 200000,
      status: 'Hủy đơn',
      paymentMethod: 'Ứng dụng di động',
      date: new Date('2025-05-11'),
    },
    {
      id: 'A126',
      time: '10:00',
      total: 100000,
      status: 'Hoàn tất',
      paymentMethod: 'Tiền mặt',
      date: new Date('2025-05-10'),
    },
    {
      id: 'A127',
      time: '11:00',
      total: 150000,
      status: 'Chưa trả',
      paymentMethod: 'Thẻ tín dụng',
      date: new Date('2025-05-11'),
    },
    {
      id: 'A128',
      time: '12:00',
      total: 200000,
      status: 'Hủy đơn',
      paymentMethod: 'Ứng dụng di động',
      date: new Date('2025-05-11'),
    },
    {
      id: 'A129',
      time: '14:00',
      total: 180000,
      status: 'Hoàn tất',
      paymentMethod: 'Thẻ tín dụng',
      date: new Date('2025-05-12'),
    },
    {
      id: 'A130',
      time: '15:00',
      total: 220000,
      status: 'Hoàn tất',
      paymentMethod: 'Ứng dụng di động',
      date: new Date('2025-05-12'),
    },
    // Tháng 4/2025
    {
      id: 'A101',
      time: '09:00',
      total: 80000,
      status: 'Hoàn tất',
      paymentMethod: 'Tiền mặt',
      date: new Date('2025-04-05'),
    },
    {
      id: 'A102',
      time: '10:30',
      total: 120000,
      status: 'Hủy đơn',
      paymentMethod: 'Thẻ tín dụng',
      date: new Date('2025-04-10'),
    },
    // Tháng 3/2025
    {
      id: 'A091',
      time: '11:15',
      total: 90000,
      status: 'Hoàn tất',
      paymentMethod: 'Tiền mặt',
      date: new Date('2025-03-15'),
    },
  ];

  // Lấy danh sách các tháng có giao dịch
  const availableMonths = useMemo(() => {
    const months = {};
    transactions.forEach((transaction) => {
      const month = transaction.date.getMonth();
      const year = transaction.date.getFullYear();
      const key = `${year}-${month}`;
      if (!months[key]) {
        months[key] = {
          month,
          year,
          label: `Tháng ${month + 1}/${year}`,
        };
      }
    });
    return Object.values(months).sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });
  }, [transactions]);

  // Lọc giao dịch theo tháng được chọn và trạng thái
  const filteredTransactions = useMemo(() => {
    let filtered = transactions.filter(
      (transaction) =>
        transaction.date.getMonth() === selectedMonth &&
        transaction.date.getFullYear() === selectedYear
    );

    if (filter !== 'All') {
      filtered = filtered.filter(
        (transaction) => transaction.status.toLowerCase() === filter.toLowerCase()
      );
    }

    return filtered;
  }, [transactions, selectedMonth, selectedYear, filter]);

  // Phân trang giao dịch
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * transactionsPerPage;
    return filteredTransactions.slice(startIndex, startIndex + transactionsPerPage);
  }, [filteredTransactions, currentPage]);

  // Tính tổng số trang
  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);

  // Tính tổng doanh thu theo ngày được chọn, chỉ tính giao dịch 'Hoàn tất'
  const calculateDailyRevenue = useMemo(() => {
    const dailyTransactions = transactions.filter(
      (transaction) =>
        transaction.date.toDateString() === selectedDate.toDateString() &&
        transaction.status === 'Hoàn tất'
    );
    const total = dailyTransactions.reduce((sum, transaction) => sum + transaction.total, 0);
    return total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  }, [selectedDate, transactions]);

  // Tính tóm tắt phương thức thanh toán, chỉ tính giao dịch 'Hoàn tất' trong ngày được chọn
  const calculatePaymentMethodsSummary = useMemo(() => {
    const paymentMethods = {};
    const completedTransactions = transactions.filter(
      (t) =>
        t.status === 'Hoàn tất' &&
        t.date.toDateString() === selectedDate.toDateString()
    );
    completedTransactions.forEach((transaction) => {
      const method = transaction.paymentMethod;
      if (!paymentMethods[method]) {
        paymentMethods[method] = { amount: 0, count: 0 };
      }
      paymentMethods[method].amount += transaction.total;
      paymentMethods[method].count += 1;
    });

    const totalAmount = completedTransactions.reduce((sum, t) => sum + t.total, 0);
    return Object.entries(paymentMethods).map(([method, data]) => ({
      method,
      amount: data.amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
      percentage: totalAmount ? ((data.amount / totalAmount) * 100).toFixed(0) + '%' : '0%',
    }));
  }, [selectedDate, transactions]);

  const paymentMethodsSummary = calculatePaymentMethodsSummary;

  // Tính số lượng đơn hoàn tất và đơn đang xử lý động dựa trên transactions theo ngày được chọn
  const stats = useMemo(() => {
    const dailyTransactions = transactions.filter(
      (transaction) => transaction.date.toDateString() === selectedDate.toDateString()
    );
    return [
      {
        title: 'Đơn hoàn tất',
        value: dailyTransactions.filter((t) => t.status === 'Hoàn tất').length.toString(),
        icon: 'checkmark-circle',
      },
      {
        title: 'Đơn đang xử lý',
        value: dailyTransactions.filter((t) => t.status === 'Chưa trả').length.toString(),
        icon: 'time',
      },
    ];
  }, [selectedDate, transactions]);

  const renderTransactionItem = ({ item }) => (
    <View className="flex-row py-3 px-4 border-b border-gray-100 items-center">
      <View className="w-20">
        <Text className="text-sm font-medium text-gray-900">{item.id}</Text>
        <Text className="text-xs text-gray-500">{item.time}</Text>
      </View>
      <View className="flex-1 flex-row justify-between items-center">
        <Text className="text-sm text-gray-700 w-24">{item.date.toLocaleDateString('vi-VN', { day: 'numeric', month: 'numeric', year: 'numeric' })}</Text>
        <Text className="text-sm text-gray-700 w-16 text-right">{item.total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</Text>
        <View className={`px-2 py-1 rounded-full ${
          item.status === 'Chưa trả' ? 'bg-yellow-100' : 
          item.status === 'Hủy đơn' ? 'bg-red-100' : 'bg-green-100'
        }`}>
          <Text className={`text-xs text-center ${
            item.status === 'Chưa trả' ? 'text-yellow-800' : 
            item.status === 'Hủy đơn' ? 'text-red-800' : 'text-green-800'
        }`}>
            {item.status}
          </Text>
        </View>
      </View>
    </View>
  );

  const onDateChange = (event, selected) => {
    const currentDate = selected || selectedDate;
    setShowDatePicker(false);
    setSelectedDate(currentDate);
  };

  const handleMonthChange = (month, year) => {
    setSelectedMonth(month);
    setSelectedYear(year);
    setCurrentPage(1); // Reset về trang đầu tiên khi chuyển tháng
    setShowMonthPicker(false); // Đóng modal khi đã chọn tháng
  };

  const renderPagination = () => {
    if (filteredTransactions.length <= transactionsPerPage) return null;

    return (
      <View className="flex-row justify-center items-center my-4">
        <TouchableOpacity
          onPress={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className={`p-2 mx-1 ${currentPage === 1 ? 'opacity-50' : ''}`}
        >
          <Ionicons name="chevron-back" size={20} color={currentPage === 1 ? "#9ca3af" : "#00b14f"} />
        </TouchableOpacity>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <TouchableOpacity
            key={page}
            onPress={() => setCurrentPage(page)}
            className={`w-8 h-8 rounded-full mx-1 flex items-center justify-center ${
              currentPage === page ? 'bg-green-600' : 'bg-gray-100'
            }`}
          >
            <Text className={`text-sm ${currentPage === page ? 'text-white' : 'text-gray-700'}`}>
              {page}
            </Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          onPress={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
          className={`p-2 mx-1 ${currentPage === totalPages ? 'opacity-50' : ''}`}
        >
          <Ionicons name="chevron-forward" size={20} color={currentPage === totalPages ? "#9ca3af" : "#00b14f"} />
        </TouchableOpacity>
      </View>
    );
  };

  // Generate a list of all months for the year
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
  ];

  // Generate a list of available years from the transaction data
  const availableYears = useMemo(() => {
    const years = new Set();
    transactions.forEach(transaction => {
      years.add(transaction.date.getFullYear());
    });
    return Array.from(years).sort((a, b) => b - a); // Sort in descending order
  }, [transactions]);

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center justify-between p-4 bg-white shadow-sm">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Ionicons name="arrow-back" size={24} color="#00b14f" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800">Quản lý thanh toán</Text>
        <View className="w-8" />
      </View>

      {/* Main Content */}
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Date Picker */}
        <View className="mx-4 mt-4">
          <Text className="text-sm font-medium text-gray-700 mb-1">Chọn ngày</Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            className="flex-row items-center justify-between bg-white p-3 rounded-lg border border-gray-200"
          >
            <Text className="text-base text-gray-800">
              {selectedDate.toLocaleDateString('vi-VN', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </Text>
            <Ionicons name="calendar" size={20} color="#6b7280" />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              maximumDate={new Date()}
              onChange={onDateChange}
            />
          )}
        </View>

        {/* Revenue Summary Card */}
        <View className="mx-4 mt-4 bg-white p-5 rounded-xl shadow-sm">
          <View className="items-center mb-4">
            <Text className="text-3xl font-bold text-green-600">{calculateDailyRevenue}</Text>
            <Text className="text-gray-500">Tổng doanh thu</Text>
          </View>
          
          <View className="flex-row flex-wrap justify-between">
            {stats.map((stat, index) => (
              <View key={index} className="w-[48%] mb-3">
                <View className="bg-gray-50 p-3 rounded-lg flex-row items-center">
                  <Ionicons name={stat.icon} size={20} color="#00b14f" className="mr-2" />
                  <View>
                    <Text className="text-lg font-bold">{stat.value}</Text>
                    <Text className="text-xs text-gray-500">{stat.title}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Payment Methods Card */}
        <View className="mx-4 mt-4 bg-white p-5 rounded-xl shadow-sm">
          <Text className="text-lg font-semibold mb-3">Phương thức thanh toán</Text>
          {paymentMethodsSummary.length > 0 ? (
            paymentMethodsSummary.map((method, index) => (
              <View key={index} className="flex-row justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                <View className="flex-row items-center">
                  <View className="w-3 h-3 rounded-full bg-green-500 mr-2" />
                  <Text className="text-sm text-gray-700">{method.method}</Text>
                </View>
                <View className="items-end">
                  <Text className="text-sm font-medium">{method.amount}</Text>
                  <Text className="text-xs text-gray-500">{method.percentage}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text className="text-sm text-gray-500 text-center">Không có giao dịch hoàn tất</Text>
          )}
        </View>

        {/* Transaction Filters */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          className="mt-4 px-4"
          contentContainerStyle={{ paddingHorizontal: 8 }}
        >
          {['All', 'Hoàn tất', 'Chưa trả', 'Hủy đơn'].map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => {
                setFilter(type);
                setCurrentPage(1); // Reset về trang đầu tiên khi thay đổi filter
              }}
              className={`px-4 py-2 rounded-full mx-1 ${filter === type ? 'bg-green-600' : 'bg-gray-200'}`}
            >
              <Text className={`text-sm ${filter === type ? 'text-white' : 'text-gray-700'}`}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Transaction List Card */}
        <View className="mx-4 mt-4 bg-white rounded-xl shadow-sm overflow-hidden">
          <View className="flex-row items-center justify-between p-4 border-b border-gray-100">
            <Text className="text-lg font-semibold">Lịch sử giao dịch</Text>
            
            {/* Month Selector Button */}
            <TouchableOpacity
              onPress={() => setShowMonthPicker(true)}
              className="flex-row items-center bg-green-50 py-1.5 px-3 rounded-lg border border-green-200"
            >
              <Text className="text-sm font-medium text-green-700 mr-1">
                Tháng {selectedMonth + 1}/{selectedYear}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#00b14f" />
            </TouchableOpacity>
          </View>
          
          <Text className="text-sm text-gray-500 px-4 pt-2 pb-3">
            Tổng cộng: {filteredTransactions.length} giao dịch
          </Text>
          
          {/* Table Header */}
          <View className="flex-row bg-gray-50 px-4 py-3">
            <Text className="text-xs font-medium text-gray-500 w-20">Mã đơn</Text>
            <View className="flex-1 flex-row justify-between">
              <Text className="text-xs font-medium text-gray-500 w-24">Ngày</Text>
              <Text className="text-xs font-medium text-gray-500 w-16 text-right">Tổng tiền</Text>
              <Text className="text-xs font-medium text-gray-500 w-16">Trạng thái</Text>
            </View>
          </View>
          
          {/* Transaction Items */}
          <FlatList
            data={paginatedTransactions}
            renderItem={renderTransactionItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ListEmptyComponent={
              <View className="p-8 items-center">
                <Ionicons name="receipt-outline" size={40} color="#d1d5db" />
                <Text className="text-gray-500 mt-2">Không có giao dịch nào</Text>
              </View>
            }
          />
          
          {/* Pagination */}
          {renderPagination()}
        </View>
      </ScrollView>

      {/* Month Picker Modal */}
      <Modal
        visible={showMonthPicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMonthPicker(false)}
      >
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}
          activeOpacity={1}
          onPress={() => setShowMonthPicker(false)}
        >
          <View
            className="bg-white rounded-xl w-3/4 max-h-96 mx-auto my-auto p-4"
            onStartShouldSetResponder={() => true}
          >
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold text-gray-800">Chọn tháng</Text>
              <TouchableOpacity onPress={() => setShowMonthPicker(false)}>
                <Ionicons name="close" size={22} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {/* Year Tabs */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mb-2"
            >
              {availableYears.map((year) => (
                <TouchableOpacity
                  key={year}
                  onPress={() => setSelectedYear(year)}
                  className={`px-4 py-2 mx-1 rounded-lg ${
                    selectedYear === year ? 'bg-green-600' : 'bg-gray-100'
                  }`}
                >
                  <Text
                    className={`font-medium ${
                      selectedYear === year ? 'text-white' : 'text-gray-700'
                    }`}
                  >
                    {year}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Month Grid */}
            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="flex-row flex-wrap justify-between">
                {allMonths.map((item) => {
                  // Check if there are transactions for this month/year
                  const hasTransactions = transactions.some(
                    (t) => t.date.getMonth() === item.month && t.date.getFullYear() === selectedYear
                  );
                  
                  return (
                    <TouchableOpacity
                      key={item.month}
                      onPress={() => handleMonthChange(item.month, selectedYear)}
                      disabled={!hasTransactions}
                      className={`w-[30%] my-2 p-3 rounded-lg ${
                        selectedMonth === item.month && selectedYear === selectedYear
                          ? 'bg-green-600'
                          : hasTransactions
                          ? 'bg-white border border-gray-200'
                          : 'bg-gray-100'
                      }`}
                    >
                      <Text
                        className={`text-center ${
                          selectedMonth === item.month && selectedYear === selectedYear
                            ? 'text-white font-medium'
                            : hasTransactions
                            ? 'text-gray-800'
                            : 'text-gray-400'
                        }`}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default PaymentScreen;