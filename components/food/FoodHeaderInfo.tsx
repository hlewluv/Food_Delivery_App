import { View, Text, Image, TouchableOpacity } from 'react-native'
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons'

interface FoodHeaderInfoProps {
  food: Food
  onBack: () => void
}

const FoodHeaderInfo = ({ food, onBack }: FoodHeaderInfoProps) => {
  return (
    <>
      {/* Phần hình ảnh và nút back */}
      <View className="h-56 relative">
        <Image 
          source={food.image} 
          className="w-full h-full" 
          resizeMode="cover" 
        />
        
        <View className="absolute top-12 left-0 right-0 flex-row justify-between">
          <TouchableOpacity
            className="w-10 h-10 rounded-full bg-black/50 justify-center items-center"
            onPress={onBack}
            activeOpacity={0.8}>
            <Feather name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Phần thông tin món ăn */}
      <View className='px-5'>
        <View className="flex-row justify-between items-start mb-4 mt-4">
          <Text className="text-2xl font-bold text-gray-900 flex-1 mr-2">
            {food.name}
          </Text>
          <Text className="text-primary font-bold text-lg">
            {food.price}
          </Text>
        </View>

        <Text className="text-gray-600 text-base mb-6 leading-6">
          {food.description}
        </Text>

        {/* Thời gian chuẩn bị */}
        {food.time && (
          <View className="flex-row items-center mb-6">
            <Ionicons name="time-outline" size={18} color="#6b7280" />
            <Text className="ml-2 text-gray-600">
              Thời gian chuẩn bị: {food.time}
            </Text>
          </View>
        )}

        {/* Khuyến mãi */}
        {food.discount && (
          <View className="mb-6 p-3 bg-green-50 rounded-lg border border-green-100">
            <View className="flex-row items-center">
              <MaterialIcons name="local-offer" size={20} color="#10b981" />
              <Text className="ml-2 text-green-700 font-medium">
                Ưu đãi: {food.discount}
              </Text>
            </View>
          </View>
        )}
      </View>
    </>
  )
}

export default FoodHeaderInfo