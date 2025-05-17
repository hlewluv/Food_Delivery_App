import { View, Text, TouchableOpacity, Image, Modal, FlatList } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const Income = () => {
  const router = useRouter();
  const [showInvoices, setShowInvoices] = useState(false);

  // Sample invoice data
  const sampleInvoices = [
    { id: '1', invoiceNumber: 'HD001', amount: 500000, date: '2025-05-10' },
    { id: '2', invoiceNumber: 'HD002', amount: 750000, date: '2025-05-11' },
    { id: '3', invoiceNumber: 'HD003', amount: 300000, date: '2025-05-12' },
  ];

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
    <View className="bg-gray-100 p-4 mb-2 rounded-lg">
      <View className="flex-row justify-between">
        <Text className="font-medium">#{item.invoiceNumber}</Text>
        <Text className="text-green-600 font-medium">+{formatMoney(item.amount)} VND</Text>
      </View>
      <Text className="text-gray-500 text-sm mt-1">Ngày: {item.date}</Text>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="flex-row justify-between items-center px-4 py-3 bg-white shadow-md">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-bold">Thu nhập</Text>
        <TouchableOpacity>
          <Ionicons name="information-circle-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View className="flex-1 px-4 pt-6">
        {/* Income Section */}
        <View className="bg-white rounded-lg p-6 mb-6 shadow-sm flex-row justify-between items-center">
          <View className="flex-1">
            <Text className="text-lg font-bold mb-2">Thu nhập</Text>
            <Text className="text-gray-700">
              Bắt đầu nhận cuốc xe để có thêm thu nhập!
            </Text>
          </View>
          <Image
            source={{ uri: 'https://media.istockphoto.com/id/1472998891/vi/vec-to/shipper-conception-v%E1%BA%BD-ng%C6%B0%E1%BB%9Di-giao-h%C3%A0ng-bi%E1%BB%83u-t%C6%B0%E1%BB%A3ng-nh%C3%A2n-v%E1%BA%ADt-ho%E1%BA%A1t-h%C3%ACnh.jpg?s=1024x1024&w=is&k=20&c=W0V3_59CZWfGCxTGOZ2bktJ7mDxE9TPBMw7wV0WyQoY=' }}
            className="w-24 h-28"
            resizeMode="contain"
          />
        </View>

        {/* Divider */}
        <View className="h-px bg-gray-200 mb-6" />

        {/* Completed Rides Section */}
        <TouchableOpacity 
          className="bg-white rounded-lg p-6 shadow-sm flex-row justify-between items-center"
          onPress={() => setShowInvoices(true)}
        >
          <View>
            <Text className="text-lg font-bold mb-2">Cuốc xe đã hoàn tất</Text>
            <Text className="text-gray-500">{sampleInvoices.length} cuốc xe</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Invoices Modal */}
      <Modal
        visible={showInvoices}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowInvoices(false)}
      >
        <View className="flex-1 bg-white p-4">
          {/* Modal Header */}
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-xl font-bold">Danh sách hoá đơn</Text>
            <TouchableOpacity onPress={() => setShowInvoices(false)}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Invoice List */}
          <FlatList
            data={sampleInvoices}
            renderItem={renderInvoiceItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 20 }}
          />

          {/* Total Summary */}
          <View className="mt-4 pt-4 border-t border-gray-200">
            <Text className="text-lg font-medium text-right">
              Tổng cộng: <Text className="text-green-600">
                {formatMoney(sampleInvoices.reduce((sum, item) => sum + item.amount, 0))} VND
              </Text>
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Income;