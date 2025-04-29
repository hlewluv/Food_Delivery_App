import React from 'react';
import { FlatList, View } from 'react-native';
import SectionHeader from '@/components/SectionHeader';
import DiscountCard from '@/components/home/RestaurantCard/DiscountCard';
import { images } from '@/constant/images';



interface DiscountListProps {
  likedRestaurants: Record<string, boolean>;
  toggleLike: (id: string) => void;
}

const DiscountList = ({ likedRestaurants, toggleLike }: DiscountListProps) => {
  return (
    <View className='mt-4'>
      <SectionHeader title='Siêu Deal Quán Đỉnh' />
      <FlatList
        data={discountRestaurants}
        renderItem={({ item }) => (
          <DiscountCard 
            item={item} 
            isLiked={likedRestaurants[item.id]} 
            onToggleLike={() => toggleLike(item.id)} 
          />
        )}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 28, paddingRight: 40, paddingVertical: 10 }}
      />
    </View>
  );
};

export default DiscountList;