// src/components/CategoryList.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, ListRenderItem } from 'react-native';
import { useRouter } from 'expo-router';
import { getCategories } from '@/apis/category/categoryList';
import SectionHeader from '@/components/SectionHeader';

interface CategoryItem {
  id: string;
  category: string;
  image: string;
}

const CategoryList = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryPress = (category: CategoryItem) => {
    router.push({
      pathname: '../customer/(tabs)/restaurants',
      params: { 
        categoryId: category.id, 
        categoryName: category.category,
        filterType: 'category'
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
          source={{ uri: item.image }}
          className='w-16 h-16 rounded-full'
          style={{ borderRadius: 9999 }}
        />
      </View>
      <Text className='mt-2 text-xs text-gray-700'>{item.category}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View className='mt-2'>
        <SectionHeader title='Danh mục' />
        <Text>Loading categories...</Text>
      </View>
    );
  }

  return (
    <View className='mt-2'>
      <SectionHeader title='Danh mục' />
      <FlatList
        data={categories}
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