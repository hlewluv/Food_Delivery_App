import React from 'react';
import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Dish {
  name: string;
  description: string;
  price: string;
  available: boolean;
  image: string;
  optionGroups: { name: string; options: any[] }[];
}

interface Category {
  name: string;
  count: number;
  dishes: Dish[];
}

interface MenuListProps {
  categories: Category[];
  expandedCategories: string[];
  toggleCategory: (categoryName: string) => void;
  handleDishPress: (categoryIndex: number, dishIndex: number) => void;
  handleEditCategoryPress: (categoryIndex: number) => void;
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
}

const DishItem: React.FC<{
  item: Dish;
  index: number;
  categoryIndex: number;
  onPress: (categoryIndex: number, dishIndex: number) => void;
}> = ({ item, index, categoryIndex, onPress }) => (
  <TouchableOpacity
    onPress={() => onPress(categoryIndex, index)}
    style={{ width: 200, height: 320, marginRight: 40, marginBottom: 20 }}
    activeOpacity={0.8}>
    <View className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex-1">
      <Image
        source={{ uri: item.image }}
        style={{ width: 200, height: 160 }}
        className="rounded-t-lg"
        resizeMode="cover"
      />
      <View className="p-3 flex-1 justify-between">
        <View>
          <Text className="text-lg font-semibold text-gray-800" numberOfLines={1}>
            {item.name}
          </Text>
          <Text className="text-gray-500 text-sm mt-1" numberOfLines={2}>
            {item.description}
          </Text>
          <Text className="text-green-600 font-medium mt-1">{item.price}</Text>
          {item.optionGroups.length > 0 && (
            <Text className="text-gray-600 text-xs mt-1" numberOfLines={1}>
              Nhóm tùy chọn: {item.optionGroups[0].name} ({item.optionGroups[0].options.length} tùy chọn)
            </Text>
          )}
        </View>
        <View className="mt-2">
          <Text
            className={`text-xs px-2 py-1 rounded-full self-start ${
              item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
            {item.available ? 'CÓ SẴN' : 'HẾT MÓN'}
          </Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

const MenuList: React.FC<MenuListProps> = ({
  categories,
  expandedCategories,
  toggleCategory,
  handleDishPress,
  handleEditCategoryPress,
  setCategories,
}) => {
  return (
    <View className="px-4 pb-20 bg-gray-50">
      <View className="flex-row justify-between items-center mb-4 mt-4">
        <Text className="text-2xl font-semibold text-gray-800">Menu chính</Text>
      </View>
      {categories.map((category, categoryIndex) => (
        <View
          key={categoryIndex}
          className="mb-6 bg-white rounded-lg shadow-sm border border-gray-100">
          <TouchableOpacity
            onPress={() => toggleCategory(category.name)}
            className="flex-row justify-between items-center p-5"
            activeOpacity={0.8}>
            <View className="flex-row items-center">
              <Ionicons
                name={expandedCategories.includes(category.name) ? 'chevron-down' : 'chevron-forward'}
                size={20}
                color="gray"
                className="mr-3"
              />
              <Text className="text-lg font-medium text-gray-800">{category.name}</Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-gray-600 mr-3">{category.count} món</Text>
              <TouchableOpacity
                onPress={() => handleEditCategoryPress(categoryIndex)}
                className="p-1">
                <Ionicons name="pencil" size={20} color="gray" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
          {expandedCategories.includes(category.name) && (
            <View className="px-5 pb-4">
              <FlatList
                data={category.dishes}
                renderItem={({ item, index }) => (
                  <DishItem
                    item={item}
                    index={index}
                    categoryIndex={categoryIndex}
                    onPress={handleDishPress}
                  />
                )}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingLeft: 4, paddingRight: 20, paddingBottom: 20 }}
              />
            </View>
          )}
        </View>
      ))}
    </View>
  );
};

export default MenuList;