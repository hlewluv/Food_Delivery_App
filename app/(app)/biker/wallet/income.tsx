import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const Income = () => {
  const router = useRouter();
  const [showInvoiceList, setShowInvoiceList] = useState(false);

  // Sample invoice data
  const sampleInvoices = [
    { id: '1', invoiceNumber: 'HD001', amount: 500000, date: '2025-05-25' },
    { id: '2', invoiceNumber: 'HD002', amount: 750000, date: '2025-05-25' },
    { id: '3', invoiceNumber: 'HD003', amount: 300000, date: '2025-05-24' },
  ];

  // Get current date in YYYY-MM-DD format
  const currentDate = new Date('2025-05-25').toISOString().split('T')[0];

  // Filter invoices for the current day
  const todayInvoices = sampleInvoices.filter(invoice => invoice.date === currentDate);

  // Calculate total daily income
  const totalDailyIncome = todayInvoices.reduce((sum, item) => sum + item.amount, 0);

  // Format money (e.g., 500000 -> 500k)
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

  const renderInvoiceItem = ({ item }) => (
    <View className="bg-white p-4 mb-3 mx-5 rounded-xl shadow-sm border border-gray-200">
      <View className="flex-row justify-between items-center">
        <Text className="text-base font-semibold text-gray-800">#{item.invoiceNumber}</Text>
        <Text className="text-base font-semibold text-green-600">+{formatMoney(item.amount)} VND</Text>
      </View>
      <Text className="text-sm text-gray-500 mt-1">Ngày: {item.date}</Text>
    </View>
  );

  const renderHeader = () => (
    <>
      {/* Header */}
      <View className="flex-row justify-between items-center px-5 py-4 bg-white shadow-lg">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#1f2937" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800">Thu nhập hôm nay</Text>
        <TouchableOpacity>
          <Ionicons name="information-circle-outline" size={28} color="#1f2937" />
        </TouchableOpacity>
      </View>

      {/* Income Section */}
      <View className="bg-white rounded-2xl p-6 mx-5 mt-6 shadow-md flex-row justify-between items-center">
        <View className="flex-1 pr-4">
          <Text className="text-xl font-bold text-gray-800 mb-2">Thu nhập hôm nay</Text>
          <Text className="text-base text-gray-600 leading-5">
            Bắt đầu nhận cuốc xe để có thêm thu nhập!
          </Text>
        </View>
        <View className="bg-gray-100 rounded-xl p-2">
          <Image
            source={{ uri: 'https://media.istockphoto.com/id/1472998891/vi/vec-to/shipper-conception-v%E1%BA%BD-ng%C6%B0%E1%BB%9Di-giao-h%C3%A0ng-bi%E1%BB%83u-t%C6%B0%E1%BB%A3ng-nh%C3%A2n-v%E1%BA%ADt-ho%E1%BA%A1t-h%C3%ACnh.jpg?s=1024x1024&w=is&k=20&c=W0V3_59CZWfGCxTGOZ2bktJ7mDxE9TPBMw7wV0WyQoY=' }}
            className="w-20 h-24"
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Divider */}
      <View className="h-px bg-gray-300 mx-5 my-6" />

      {/* Completed Rides Section */}
      <TouchableOpacity 
        className="bg-white rounded-2xl p-6 mx-5 shadow-md flex-row justify-between items-center"
        onPress={() => setShowInvoiceList(!showInvoiceList)}
      >
        <View>
          <Text className="text-xl font-bold text-gray-800 mb-2">Cuốc xe hôm nay</Text>
          <Text className="text-base text-gray-600">{todayInvoices.length} cuốc xe</Text>
          <Text className="text-lg font-semibold text-green-600 mt-1">
            Tổng: {formatMoney(totalDailyIncome)} VND
          </Text>
        </View>
        <Ionicons 
          name={showInvoiceList ? "chevron-up" : "chevron-forward"} 
          size={28} 
          color="#1f2937" 
          style={{ transform: [{ rotate: showInvoiceList ? '180deg' : '0deg' }] }}
        />
      </TouchableOpacity>

      {/* Spacer before invoice list */}
      {showInvoiceList && <View className="mt-4" />}
    </>
  );

  return (
    <View className="flex-1 bg-gradient-to-b from-gray-100 to-gray-200">
      <FlatList
        data={showInvoiceList ? todayInvoices : []}
        renderItem={renderInvoiceItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          showInvoiceList ? (
            <Text className="text-center text-gray-500 text-base">
              Không có hoá đơn nào hôm nay
            </Text>
          ) : null
        }
      />
    </View>
  );
};

export default Income;