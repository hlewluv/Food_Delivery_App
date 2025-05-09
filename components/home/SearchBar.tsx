import React from 'react';
import { View, TextInput, Image } from 'react-native';
import { icons } from '@/constant/icons';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (text: string) => void;
}

const SearchBar = ({ searchQuery, setSearchQuery }: SearchBarProps) => {
  return (
    <View className='flex-row items-center bg-gray-100 rounded-xl px-4 py-3 mx-10 my-4'>
      <Image source={icons.search} className='w-5 h-5 mr-2' tintColor='#6B7280' />
      <TextInput
        className='flex-1 text-gray-700 text-sm py-1'
        placeholder='Tìm nhà hàng hoặc món ăn...'
        placeholderTextColor='#9CA3AF'
        value={searchQuery}
        onChangeText={setSearchQuery}
        returnKeyType='search'
      />
    </View>
  );
};

export default SearchBar;