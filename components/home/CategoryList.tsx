// src/components/CategoryList.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, ListRenderItem } from 'react-native';
import { images } from '@/constant/images';
import SectionHeader from '@/components/SectionHeader';
import { useRouter } from 'expo-router';

interface CategoryItem {
  id: string;
  name: string;
  image: any;
}

const foodCategories: CategoryItem[] = [
  { id: '1', name: 'Fast Food', image: images.hutieu },
  { id: '2', name: 'Drink', image: images.myquang },
  { id: '3', name: 'Cafe', image: images.pizza },
  { id: '4', name: 'Beefsteak', image: images.thitnuong },
  { id: '5', name: 'Pasta', image: images.trungcut },
  { id: '6', name: 'Pizza', image: images.ruou },
  { id: '7', name: 'Milk', image: images.banh }
];

const CategoryList = () => {
  const router = useRouter();

  const handleCategoryPress = (category: CategoryItem) => {
    // Navigate to restaurants tab with category parameters
    router.push({
      pathname: '/(tabs)/restaurants',
      params: { 
        categoryId: category.id, 
        categoryName: category.name,
        filterType: 'category' // Add filter type to distinguish between different filters
      }
    });
  };

  const renderCategoryItem: ListRenderItem<CategoryItem> = ({ item }) => (
    <TouchableOpacity 
      className='items-center mx-3'
      onPress={() => handleCategoryPress(item)}
    >
      <View className='bg-gray-100 p-1 rounded-full'>
        <Image
          source={item.image}
          className='w-16 h-16 rounded-full'
          style={{ borderRadius: 9999 }}
        />
      </View>
      <Text className='mt-2 text-xs text-gray-700'>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View className='mt-2'>
      <SectionHeader title='Danh mục' />
      <FlatList
        data={foodCategories}
        renderItem={renderCategoryItem}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 10 }}
      />
    </View>
  );
};

export default CategoryList;