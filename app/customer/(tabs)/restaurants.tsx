import React from 'react'
import { View, ScrollView, Text, FlatList, RefreshControl, ActivityIndicator } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import Header from '@/components/home/Header'
import SearchBar from '@/components/home/SearchBar'
import RecommendedCard from '@/components/home/RestaurantCard/RecommendedCard'
import { restaurantsData, Restaurant, getRestaurantsByCategoryId } from '@/data/restaurants'

type RestaurantParams = {
  foodId?: string
  foodName?: string
  categoryId?: string
  categoryName?: string
  filterType?: string
}


const Restaurants = () => {
  const params = useLocalSearchParams<RestaurantParams>()
  const { foodId, foodName, categoryId, categoryName, filterType } = params

  const [searchQuery, setSearchQuery] = React.useState('')
  const [likedRestaurants, setLikedRestaurants] = React.useState<Record<string, boolean>>({})
  const [restaurants, setRestaurants] = React.useState<Restaurant[]>([])
  const [loading, setLoading] = React.useState(true)
  const [refreshing, setRefreshing] = React.useState(false)

  // Load restaurants based on parameters
  React.useEffect(() => {
    const loadRestaurants = async () => {
      setLoading(true)
      try {
        let loadedRestaurants: Restaurant[] = []
        
        if (foodId) {
          // Filter by food item
          loadedRestaurants = restaurantsData.filter(restaurant => 
            restaurant.menuItems?.some(menuCategory => 
              menuCategory.items.some(item => item.id === foodId)
            )
          )
        } else if (filterType === 'category' && categoryId) {
          // Filter by category
          loadedRestaurants = getRestaurantsByCategoryId(categoryId)
        } else {
          // Show all restaurants
          loadedRestaurants = [...restaurantsData]
        }
        
        setRestaurants(loadedRestaurants)
      } catch (error) {
        console.error('Error loading restaurants:', error)
      } finally {
        setLoading(false)
      }
    }

    loadRestaurants()
  }, [foodId, categoryId, filterType])

  const handleRefresh = async () => {
    setRefreshing(true)
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 1000))
    setRefreshing(false)
  }

  const toggleLike = (restaurantId: string) => {
    setLikedRestaurants(prev => ({
      ...prev,
      [restaurantId]: !prev[restaurantId]
    }))
  }

  // Filter restaurants by search query
  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         restaurant.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         restaurant.description?.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesSearch
  })

  const getHeaderDescription = () => {
    if (foodName) return `Nhà hàng phục vụ món ${foodName}`
    if (categoryName) return `Danh mục: ${categoryName}`
    return 'Nhà hàng chất lượng được đề xuất'
  }

  const getHeaderTitle = () => {
    if (foodName) return `Món ${foodName}`
    if (categoryName) return categoryName
    return 'Nhà hàng'
  }

  const renderEmptyState = () => (
    <View className='items-center justify-center mt-10 px-6'>
      <Text className='text-lg font-medium text-center text-gray-700'>
        {searchQuery ? 
          'Không tìm thấy nhà hàng phù hợp' : 
          foodName ?
          `Không có nhà hàng nào phục vụ món ${foodName}` :
          categoryName ?
          `Không có nhà hàng nào trong danh mục ${categoryName}` :
          'Hiện không có nhà hàng nào'}
      </Text>
      <Text className='text-center text-gray-500 mt-2'>
        {searchQuery ? 
          'Hãy thử từ khóa khác' : 
          'Vui lòng thử lại sau hoặc tìm kiếm nhà hàng khác'}
      </Text>
    </View>
  )

  const renderRestaurantItem = ({ item }: { item: Restaurant }) => (
    <RecommendedCard
      item={item}
      isLiked={!!likedRestaurants[item.id]}
      onToggleLike={() => toggleLike(item.id)}
      highlightFoodId={foodId}
    />
  )

  if (loading) {
    return (
      <View className='flex-1 bg-white justify-center items-center'>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className='mt-4 text-gray-600'>Đang tải nhà hàng...</Text>
      </View>
    )
  }

  return (
    <View className='flex-1 bg-gray-50'>
      <Header 
        title={getHeaderTitle()} 
        showBackButton={!!foodName || !!categoryName} 
      />
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 10 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#FF0000', '#00FF00']}
            tintColor="#0000ff"
          />
        }
      >
        <View className='px-4'>
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            placeholder={
              foodName ? `Tìm nhà hàng có ${foodName}...` : 
              categoryName ? `Tìm trong ${categoryName}...` :
              'Tìm nhà hàng hoặc món ăn...'
            }
          />
        </View>

        <View className='px-6 mt-2 mb-2'>
          <Text className='text-2xl font-bold text-gray-900'>{getHeaderTitle()}</Text>
          <Text className='text-gray-500 mt-1'>
            {getHeaderDescription()}
          </Text>
        </View>

        {filteredRestaurants.length > 0 ? (
          <View className=' px-1'>
            <FlatList
              data={filteredRestaurants}
              renderItem={renderRestaurantItem}
              keyExtractor={item => item.id}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View className='' />}
              ListFooterComponent={() => <View className='' />}
            />
          </View>
        ) : (
          renderEmptyState()
        )}
      </ScrollView>
    </View>
  )
}

export default Restaurants