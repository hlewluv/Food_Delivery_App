import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Dimensions,
  TextInput,
  TouchableWithoutFeedback,
  FlatList,
  Platform,
} from 'react-native';
import { Feather, MaterialIcons, Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { ScrollView } from 'moti';

const Wallet = () => {
  const router = useRouter();
  const [modalType, setModalType] = useState<'week' | 'month' | 'year' | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date('2025-05-25'));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [periodType, setPeriodType] = useState<'week' | 'month' | 'year'>('week');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample invoice data
  const sampleInvoices = [
    { id: '1', invoiceNumber: 'HD001', amount: 500000, date: '2025-05-25', status: 'Completed', customer: 'Nguyen Van A' },
    { id: '2', invoiceNumber: 'HD002', amount: 750000, date: '2025-05-24', status: 'Completed', customer: 'Tran Thi B' },
    { id: '3', invoiceNumber: 'HD003', amount: 300000, date: '2025-05-20', status: 'Pending', customer: 'Le Van C' },
    { id: '4', invoiceNumber: 'HD004', amount: 1000000, date: '2025-04-15', status: 'Completed', customer: 'Pham Thi D' },
    { id: '5', invoiceNumber: 'HD005', amount: 200000, date: '2025-03-10', status: 'Completed', customer: 'Hoang Van E' },
    { id: '6', invoiceNumber: 'HD006', amount: 400000, date: '2025-02-20', status: 'Completed', customer: 'Vo Thi F' },
    { id: '7', invoiceNumber: 'HD007', amount: 600000, date: '2025-01-15', status: 'Completed', customer: 'Dang Van G' },
    { id: '8', invoiceNumber: 'HD008', amount: 150000, date: '2024-12-31', status: 'Completed', customer: 'Bui Thi H' },
  ];

  // Get date ranges based on selected date and period type
  const getDateRange = (date: Date, type: 'week' | 'month' | 'year') => {
    const year = date.getFullYear();
    const month = date.getMonth();
    let startDate = new Date(date);
    let endDate = new Date(date);

    if (type === 'week') {
      startDate.setDate(date.getDate() - date.getDay()); // Sunday
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6); // Saturday
    } else if (type === 'month') {
      startDate = new Date(year, month, 1);
      endDate = new Date(year, month + 1, 0);
    } else {
      startDate = new Date(year, 0, 1);
      endDate = new Date(year, 11, 31);
    }
    return { startDate, endDate };
  };

  // Filter invoices based on selected period and search query
  const { startDate, endDate } = getDateRange(selectedDate, periodType);
  const filteredInvoices = useMemo(() => {
    return sampleInvoices.filter(invoice => {
      const invoiceDate = new Date(invoice.date);
      const matchesDate = invoiceDate >= startDate && invoiceDate <= endDate;
      const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           invoice.customer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesDate && (searchQuery ? matchesSearch : true);
    });
  }, [selectedDate, periodType, searchQuery]);

  // Calculate stats for a period
  const calculateStats = (invoices: typeof sampleInvoices) => {
    const completed = invoices.filter(inv => inv.status === 'Completed');
    const pending = invoices.filter(inv => inv.status === 'Pending');
    const totalAmount = completed.reduce((sum, inv) => sum + inv.amount, 0);
    const avgAmount = completed.length > 0 ? totalAmount / completed.length : 0;
    return { completed: completed.length, pending: pending.length, totalAmount, avgAmount };
  };

  const periodStats = calculateStats(filteredInvoices);
  const yearStats = calculateStats(sampleInvoices.filter(inv => new Date(inv.date).getFullYear() === 2025));

  // Monthly data for chart
  const monthlyData = useMemo(() => {
    return Array(12).fill(0).map((_, index) => {
      const monthInvoices = sampleInvoices.filter(invoice => {
        const invoiceDate = new Date(invoice.date);
        return invoiceDate.getFullYear() === 2025 && invoiceDate.getMonth() === index && invoice.status === 'Completed';
      });
      return monthInvoices.reduce((sum, inv) => sum + inv.amount, 0) / 1000000; // Convert to millions
    });
  }, []);

  // Format money
  const formatMoney = (amount: number) => {
    if (amount >= 1000000) {
      const millions = amount / 1000000;
      return millions % 1 === 0 ? `${millions.toFixed(0)}M` : `${millions.toFixed(1)}M`;
    } else if (amount >= 1000) {
      const thousands = amount / 1000;
      return thousands % 1 === 0 ? `${thousands.toFixed(0)}k` : `${thousands.toFixed(1)}k`;
    }
    return amount.toString();
  };

  // Format date range for display
  const formatDateRange = (start: Date, end: Date) => {
    if (start.getFullYear() !== end.getFullYear()) {
      return `${start.getDate()}/${start.getMonth() + 1}/${start.getFullYear()} - ${end.getDate()}/${end.getMonth() + 1}/${end.getFullYear()}`;
    }
    if (start.getMonth() !== end.getMonth()) {
      return `${start.getDate()}/${start.getMonth() + 1} - ${end.getDate()}/${end.getMonth() + 1}/${end.getFullYear()}`;
    }
    return `${start.getDate()}/${start.getMonth() + 1} - ${end.getDate()}/${end.getMonth() + 1}`;
  };

  // Render invoice item for FlatList
  const renderInvoiceItem = ({ item }) => (
    <View className="bg-gray-100 p-4 mb-2 rounded-lg">
      <View className="flex-row justify-between">
        <Text className="font-medium">#{item.invoiceNumber}</Text>
        <Text className={`font-medium ${item.status === 'Completed' ? 'text-green-600' : 'text-yellow-600'}`}>
          +{formatMoney(item.amount)} VND
        </Text>
      </View>
      <Text className="text-gray-500 text-sm mt-1">Ngày: {item.date}</Text>
      <Text className="text-gray-500 text-sm mt-1">Khách hàng: {item.customer}</Text>
      <Text className="text-gray-500 text-sm mt-1">Trạng thái: {item.status === 'Completed' ? 'Hoàn tất' : 'Đang chờ'}</Text>
    </View>
  );

  // Get invoices based on modal type and sort
  const getModalInvoices = () => {
    let invoices = filteredInvoices;
    if (modalType !== periodType) {
      const { startDate, endDate } = getDateRange(selectedDate, modalType || periodType);
      invoices = sampleInvoices.filter(invoice => {
        const invoiceDate = new Date(invoice.date);
        return invoiceDate >= startDate && invoiceDate <= endDate;
      });
    }
    return [...invoices].sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return b.amount - a.amount;
    });
  };

  // Get modal title
  const getModalTitle = () => {
    const { startDate, endDate } = getDateRange(selectedDate, modalType || periodType);
    if (modalType === 'week') {
      return `Hoá đơn tuần (${formatDateRange(startDate, endDate)})`;
    } else if (modalType === 'month') {
      return `Hoá đơn tháng ${startDate.getMonth() + 1}/${startDate.getFullYear()}`;
    } else {
      return `Hoá đơn năm ${startDate.getFullYear()}`;
    }
  };

  // SVG Bar Chart
  const Chart = () => {
    const width = Dimensions.get('window').width - 40;
    const height = 220;
    const barWidth = width / 12 - 5; // 12 months, 5px spacing
    const maxValue = Math.max(...monthlyData, 1); // Avoid division by zero

    return (
      <Svg width={width} height={height}>
        {monthlyData.map((value, index) => {
          const barHeight = (value / maxValue) * (height - 40); // Leave space for labels
          const x = index * (barWidth + 5);
          const y = height - barHeight - 20; // Adjust for bottom labels
          return (
            <React.Fragment key={index}>
              <Rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill="#3b82f6"
              />
              <SvgText
                x={x + barWidth / 2}
                y={height - 5}
                fontSize="12"
                fill="#000"
                textAnchor="middle"
              >
                {index + 1}
              </SvgText>
              {value > 0 && (
                <SvgText
                  x={x + barWidth / 2}
                  y={y - 5}
                  fontSize="10"
                  fill="#000"
                  textAnchor="middle"
                >
                  {value.toFixed(1)}M
                </SvgText>
              )}
            </React.Fragment>
          );
        })}
      </Svg>
    );
  };

  return (
    <ScrollView className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="flex-row justify-between items-center px-4 py-3 bg-white shadow-md">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-bold">Thống kê thu nhập</Text>
        <TouchableOpacity>
          <Feather name="info" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View className="flex-1 px-4 pt-6">
        {/* Summary Section */}
        <View className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <Text className="text-lg font-bold mb-2">Tổng quan thu nhập (2025)</Text>
          <Text className="text-gray-500">Tổng thu nhập: {formatMoney(yearStats.totalAmount)} VND</Text>
          <Text className="text-gray-500">Tổng cuốc xe hoàn tất: {yearStats.completed}</Text>
          <Text className="text-gray-500">Trung bình mỗi cuốc: {formatMoney(yearStats.avgAmount)} VND</Text>
        </View>

        {/* Period Selector */}
        <View className="flex-row justify-between mb-4">
          <TouchableOpacity
            className={`flex-1 p-2 rounded ${periodType === 'week' ? 'bg-blue-500' : 'bg-gray-200'}`}
            onPress={() => setPeriodType('week')}
          >
            <Text className={`text-center ${periodType === 'week' ? 'text-white' : 'text-black'}`}>Tuần</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 p-2 rounded mx-2 ${periodType === 'month' ? 'bg-blue-500' : 'bg-gray-200'}`}
            onPress={() => setPeriodType('month')}
          >
            <Text className={`text-center ${periodType === 'month' ? 'text-white' : 'text-black'}`}>Tháng</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 p-2 rounded ${periodType === 'year' ? 'bg-blue-500' : 'bg-gray-200'}`}
            onPress={() => setPeriodType('year')}
          >
            <Text className={`text-center ${periodType === 'year' ? 'text-white' : 'text-black'}`}>Năm</Text>
          </TouchableOpacity>
        </View>

        {/* Date Picker Button */}
        <TouchableOpacity
          className="bg-white rounded-lg p-4 mb-4 shadow-sm flex-row justify-between items-center"
          onPress={() => setShowDatePicker(true)}
        >
          <Text className="text-lg font-bold">
            {periodType === 'week'
              ? `Tuần (${formatDateRange(startDate, endDate)})`
              : periodType === 'month'
              ? `Tháng ${startDate.getMonth() + 1}/${startDate.getFullYear()}`
              : `Năm ${startDate.getFullYear()}`}
          </Text>
          <MaterialIcons name="date-range" size={24} color="#000" />
        </TouchableOpacity>

        {/* DateTimePicker */}
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            onChange={(event, date) => {
              setShowDatePicker(Platform.OS === 'ios');
              if (date) setSelectedDate(date);
            }}
          />
        )}
        {Platform.OS === 'ios' && showDatePicker && (
          <TouchableOpacity
            className="bg-gray-200 p-2 rounded mt-2"
            onPress={() => setShowDatePicker(false)}
          >
            <Text className="text-center">Đóng</Text>
          </TouchableOpacity>
        )}

        {/* Period Stats */}
        <TouchableOpacity
          className="bg-white rounded-lg p-6 mb-4 shadow-sm"
          onPress={() => setModalType(periodType)}
        >
          <Text className="text-lg font-bold mb-2">
            {periodType === 'week'
              ? `Thống kê tuần (${formatDateRange(startDate, endDate)})`
              : periodType === 'month'
              ? `Thống kê tháng ${startDate.getMonth() + 1}/${startDate.getFullYear()}`
              : `Thống kê năm ${startDate.getFullYear()}`}
          </Text>
          <Text className="text-gray-500">Hoàn tất: {periodStats.completed} cuốc xe</Text>
          <Text className="text-gray-500">Đang chờ: {periodStats.pending} cuốc xe</Text>
          <Text className="text-green-600 font-medium mt-1">
            Tổng: {formatMoney(periodStats.totalAmount)} VND
          </Text>
          <Text className="text-gray-500 mt-1">Trung bình: {formatMoney(periodStats.avgAmount)} VND/cuốc</Text>
        </TouchableOpacity>

        {/* Monthly Comparison Chart */}
        <View className="bg-white rounded-lg p-6 mb-4 shadow-sm">
          <Text className="text-lg font-bold mb-4">So sánh thu nhập các tháng (2025)</Text>
          <Chart />
        </View>
      </View>

      {/* Invoices Modal */}
      <Modal
        visible={modalType !== null}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setModalType(null)}
      >
        <View className="flex-1 bg-white p-4">
          {/* Modal Header */}
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-xl font-bold">{getModalTitle()}</Text>
            <TouchableOpacity onPress={() => setModalType(null)}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <TextInput
            className="bg-gray-100 p-2 rounded mb-4"
            placeholder="Tìm theo mã hoặc khách hàng"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          {/* Sort Options */}
          <View className="flex-row justify-end mb-4">
            <TouchableOpacity
              className={`px-3 py-1 rounded ${sortBy === 'date' ? 'bg-blue-500' : 'bg-gray-200'}`}
              onPress={() => setSortBy('date')}
            >
              <Text className={sortBy === 'date' ? 'text-white' : 'text-black'}>Sắp xếp theo ngày</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`px-3 py-1 rounded ml-2 ${sortBy === 'amount' ? 'bg-blue-500' : 'bg-gray-200'}`}
              onPress={() => setSortBy('amount')}
            >
              <Text className={sortBy === 'amount' ? 'text-white' : 'text-black'}>Sắp xếp theo số tiền</Text>
            </TouchableOpacity>
          </View>

          {/* Invoice List */}
          <FlatList
            data={getModalInvoices()}
            renderItem={renderInvoiceItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={
              <Text className="text-center text-gray-500">Không có hoá đơn nào</Text>
            }
          />

          {/* Total Summary */}
          <View className="mt-4 pt-4 border-t border-gray-200">
            <Text className="text-lg font-medium text-right">
              Tổng cộng: <Text className="text-green-600">
                {formatMoney(getModalInvoices().reduce((sum, item) => sum + (item.status === 'Completed' ? item.amount : 0), 0))} VND
              </Text>
            </Text>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default Wallet;