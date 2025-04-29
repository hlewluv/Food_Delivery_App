import React from 'react'
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

interface Review {
  id: string
  username: string
  rating: number
  comment: string
  date?: string
  reply?: string
}

const ReviewItem = ({ review }: { review: Review }) => {
  return (
    <View className="bg-white rounded-xl shadow-sm px-4 py-3 mr-3" style={{ width: Dimensions.get('window').width * 0.8 }}>
      {/* Nội dung đánh giá (rút gọn 1 dòng) */}
      <Text
        numberOfLines={2}
        ellipsizeMode="tail"
        className="text-gray-800 text-sm mb-2"
      >
        {review.comment}
      </Text>

      {/* Rating (số) + icon sao + tên người dùng */}
      <View className="flex-row items-center">
        <View className="flex-row items-center mr-2">
          <Text className="text-yellow-500 font-bold mr-1">{review.rating}</Text>
          <Ionicons name="star" size={14} color="#FFD700" />
        </View>
        <Text className="text-gray-600 text-xs font-medium">{review.username}</Text>
      </View>
    </View>
  )
}

const ReviewSection = () => {
  const reviews: Review[] = [
    {
      id: '1',
      username: 'Ái Linh',
      rating: 5,
      comment: 'ăn ngon, được, hơi béo nhưng bánh tráng hỏi ít, mua phân lòng có sẵn 1 bánh tráng. mình...',
    },
    {
      id: '2',
      username: 'Nguyễn Văn A',
      rating: 4,
      comment: 'Lần đây: nguồn',
      reply: 'Cảm ơn bạn đã đánh giá, chúng tôi sẽ cải thiện'
    },
    {
      id: '3',
      username: 'Người dùng 3',
      rating: 3,
      comment: 'Trải nghiệm tạm ổn, giá cả hợp lý'
    },
    {
      id: '4',
      username: 'Người dùng 4',
      rating: 5,
      comment: 'Rất hài lòng với chất lượng dịch vụ'
    }
  ]

  return (
    <View className="bg-gray-50 p-4">
      {/* Tiêu đề + icon mũi tên */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-base font-semibold text-gray-800">Mọi người nhận xét</Text>
        <Ionicons name="arrow-forward" size={18} color="#4B5563" />
      </View>
      
      {/* ScrollView ngang cho các review */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 16 }}
      >
        {reviews.map(review => (
          <ReviewItem key={review.id} review={review} />
        ))}
      </ScrollView>
    </View>
  )
}

export default ReviewSection