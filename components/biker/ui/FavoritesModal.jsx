import React from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FavoritesModal = ({ visible, onClose, favorites }) => (
  <Modal
    animationType='slide'
    transparent={true}
    visible={visible}
    onRequestClose={onClose}>
    <View className='flex-1 justify-end bg-black/50'>
      <View className='bg-white rounded-t-3xl p-6 h-1/2'>
        <View className='flex-row justify-between items-center mb-4'>
          <Text className='text-lg font-bold'>Địa điểm yêu thích</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name='close' size={24} color='#00b14f' />
          </TouchableOpacity>
        </View>

        <FlatList
          data={favorites}
          renderItem={({ item }) => (
            <TouchableOpacity className='py-3 border-b border-gray-100'>
              <Text className='font-medium'>{item.name}</Text>
              <Text className='text-gray-500 text-sm'>{item.address}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id.toString()}
          className='flex-1'
        />

        <TouchableOpacity
          className='bg-[#00b14f] rounded-full py-3 items-center mt-4 flex-row justify-center'
          onPress={() => {}}>
          <Ionicons name='add' size={20} color='white' />
          <Text className='text-white font-bold ml-2'>Thêm địa điểm</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

export default FavoritesModal;