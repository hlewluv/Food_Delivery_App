import React from 'react'
import { View, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import Header from '@/components/home/Header'
import SearchBar from '@/components/home/SearchBar'
import CouponBanner from '@/components/home/CouponBanner'
import CategoryList from '@/components/home/CategoryList'
import DiscountList from '@/components/home/RestaurantList/DiscountList'
import RecommendedList from '@/components/home/RestaurantList/RecommendedList'
import { useEffect } from 'react';

const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [likedRestaurants, setLikedRestaurants] = React.useState<Record<string, boolean>>({})
  const router = useRouter() 

  const toggleLike = (restaurantId: string) => {
    setLikedRestaurants(prev => ({
      ...prev,
      [restaurantId]: !prev[restaurantId]
    }))
  }

  const token = useRouter();

  // useEffect(() => {
  //   if (token) {
  //     console.log('Received user:', token);
  //   }
  // }, [token]);
  useEffect(() => {
    if (token) {
      console.log('Received user:', token);
      // Xử lý với user ở đây
    }
  }, [token]);

  return (
    <View className='flex-1 bg-white'>
      <Header />

      <ScrollView showsVerticalScrollIndicator={false}>
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <CouponBanner />
        <CategoryList />
        <DiscountList
          likedRestaurants={likedRestaurants}
          toggleLike={toggleLike}
          // onRestaurantPress={onRestaurantPress}
        />
        <RecommendedList
          likedRestaurants={likedRestaurants}
          toggleLike={toggleLike}
        />
      </ScrollView>
    </View>
  )
}

export default HomeScreen


// import React from 'react'
// import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, FlatList } from 'react-native'
// import { icons } from '@/constant/icons'
// import { images } from '@/constant/images'
// import SectionHeader from '@/components/SectionHeader'

// // Dữ liệu mẫu - bạn có thể thay thế bằng dữ liệu thực từ API
// const foodCategories = [
//   { id: '1', name: 'Fast Food', image: images.hutieu },
//   { id: '2', name: 'Drink', image: images.myquang },
//   { id: '3', name: 'Cafe', image: images.pizza },
//   { id: '4', name: 'Beefsteak', image: images.thitnuong },
//   { id: '5', name: 'Pasta', image: images.trungcut },
//   { id: '6', name: 'Pizza', image: images.ruou },
//   { id: '7', name: 'Milk', image: images.banh }
// ]

// const discountRestaurants = [
//   {
//     id: '1',
//     name: "McDonald's",
//     image: images.banh,
//     discount: '50%',
//     rating: 4.5,
//     time: '15-20 min'
//   },
//   {
//     id: '2',
//     name: 'KFC',
//     image: images.myquang,
//     discount: '30%',
//     rating: 4.2,
//     time: '20-25 min'
//   },
//   {
//     id: '3',
//     name: 'KFC',
//     image: images.myquang,
//     discount: '30%',
//     rating: 4.2,
//     time: '20-25 min'
//   },
//   {
//     id: '4',
//     name: 'KFC',
//     image: images.myquang,
//     discount: '30%',
//     rating: 4.2,
//     time: '20-25 min'
//   }
//   // Thêm các nhà hàng khác
// ]

// const recommendedRestaurants = [
//   {
//     id: '5',
//     name: 'The Coffee House',
//     image: images.myquang,
//     rating: 4.8,
//     time: '10-15 min',
//     category: 'Cafe & Trà sữa'
//   },
//   {
//     id: '6',
//     name: 'Pizza Hut',
//     image: images.thitnuong,
//     rating: 4.6,
//     time: '25-30 min',
//     category: 'Pizza & Mỳ Ý'
//   },
//   {
//     id: '7',
//     name: 'Pizza Hut',
//     image: images.trungcut,
//     rating: 4.6,
//     time: '25-30 min',
//     category: 'Pizza & Mỳ Ý'
//   },
//   {
//     id: '8',
//     name: 'Pizza Hut',
//     image: images.yen,
//     rating: 4.6,
//     time: '25-30 min',
//     category: 'Pizza & Mỳ Ý'
//   }
//   // Thêm các nhà hàng khác
// ]

// const HomeScreen = () => {
//   const [searchQuery, setSearchQuery] = React.useState('')
//   const [likedRestaurants, setLikedRestaurants] = React.useState({});

//   const toggleLike = (restaurantId) => {
//     setLikedRestaurants(prev => ({
//       ...prev,
//       [restaurantId]: !prev[restaurantId]
//     }));
//   };

//   const renderCategoryItem = ({ item }) => (
//     <TouchableOpacity className='items-center mx-3'>
//       <View className='bg-gray-100 p-1 rounded-full'>
//         {' '}
//         {/* Giảm padding nếu cần */}
//         <Image
//           source={item.image}
//           className='w-16 h-16 rounded-full' // Thêm rounded-full và điều chỉnh kích thước
//           style={{ borderRadius: 9999 }} // Đảm bảo hình tròn hoàn hảo
//         />
//       </View>
//       <Text className='mt-2 text-xs text-gray-700'>{item.name}</Text>
//     </TouchableOpacity>
//   )

//   const renderDiscountRestaurant = ({ item }) => (
//     <TouchableOpacity className='mr-4 w-48'>
//       <View className='relative'>
//         <Image source={item.image} className='w-full h-32 rounded-xl' />
//         <View className='absolute top-2 left-2 bg-red-500/80 px-2 py-1 rounded-xl'>
//           <Text className='text-white text-xs font-bold'>{item.discount} OFF</Text>
//         </View>
//         <TouchableOpacity
//           className='absolute top-2 right-2'
//           onPress={() => toggleLike(item.id)}
//         >
//           <Image
//             source={likedRestaurants[item.id] ? icons.heart1 : icons.heart}
//             className='w-6 h-6'
//             style={{ tintColor: likedRestaurants[item.id] ? '#00b14f' : 'white' }}
//           />
//         </TouchableOpacity>
//       </View>
//       <Text className='mt-2 font-medium text-gray-900'>{item.name}</Text>
//       <View className='flex-row items-center mt-1'>
//         <Image source={icons.star} className='w-4 h-4 mr-1' style={{ tintColor: '#FFFF00' }} />
//         <Text className='text-gray-700 text-sm'>{item.rating}</Text>
//         <Text className='text-gray-500 text-sm mx-1'>•</Text>
//         <Image source={icons.clock} className='w-4 h-4 mr-1' style={{ tintColor: '#000000' }} />
//         <Text className='text-gray-700 text-sm'>{item.time}</Text>
//       </View>
//     </TouchableOpacity>
//   );

//   const renderRecommendedRestaurant = ({ item }) => (
//     <View className='flex-row items-center my-4 mx-6'>
//       <Image source={item.image} className='w-20 h-20 rounded-xl' />
//       <View className='ml-3 flex-1'>
//         <Text className='font-semibold text-gray-900'>{item.name}</Text>
//         <View className='flex-row items-center mt-1'>
//           <Image source={icons.star} className='w-5 h-5 mr-1' style={{ tintColor: '#FFFF00' }} />
//           <Text className='text-gray-700 text-sm'>{item.rating}</Text>
//           <Text className='text-gray-500 text-sm mx-1'>•</Text>
//           <Image source={icons.clock} className='w-4 h-4 mr-1' style={{ tintColor: '#000000' }} />
//           <Text className='text-gray-700 text-sm'>{item.time}</Text>
//         </View>
//         <Text className='text-gray-500 text-sm mt-1'>{item.category}</Text>
//       </View>
//       <TouchableOpacity onPress={() => toggleLike(item.id)}>
//         <Image
//           source={likedRestaurants[item.id] ? icons.heart1 : icons.heart}
//           className='w-6 h-6'
//           style={{ tintColor: likedRestaurants[item.id] ? '#00b14f' : '#9CA3AF' }}
//         />
//       </TouchableOpacity>
//     </View>
//   );

//   return (
//     <View className='flex-1 bg-white'>
//       {/* Header */}
//       <View className='flex-row items-center justify-between px-6 py-3 bg-white mx-2'>
//         <View className='flex-row items-center flex-1'>
//           <Image source={images.hero1} className='w-12 h-12 rounded-full' resizeMode='contain' />
//           <View className='ml-3'>
//             <View className='flex-row items-center'>
//               <Text className='font-[300] text-gray-800' numberOfLines={1}>
//                 Delivery to
//               </Text>
//               <Image
//                 source={icons.down}
//                 className='w-6 h-6'
//                 resizeMode='contain'
//                 style={{ tintColor: '#00b14f' }}
//               />
//             </View>
//             <Text
//               className='font-medium text-gray-800 mt-1 w-[130px]'
//               numberOfLines={1}
//               ellipsizeMode='tail'>
//               123 Đường ABC, Quận 1, TP.HCM
//             </Text>
//           </View>
//         </View>
//         <View className='flex-row ml-4'>
//           <TouchableOpacity className='mx-3'>
//             <View className='rounded-full border border-gray-300 bg-white p-3'>
//               <Image
//                 source={icons.bag}
//                 className='w-6 h-6'
//                 resizeMode='contain'
//                 style={{ tintColor: '#4B5563' }}
//               />
//             </View>
//           </TouchableOpacity>

//           <TouchableOpacity className='mx-2'>
//             <View className='rounded-full border border-gray-300 bg-white p-3'>
//               <Image
//                 source={icons.mail}
//                 className='w-6 h-6'
//                 resizeMode='contain'
//                 style={{ tintColor: '#4B5563' }}
//               />
//             </View>
//           </TouchableOpacity>
//         </View>
//       </View>

//       <ScrollView showsVerticalScrollIndicator={false}>
//         {/* Search Input */}
//         <View className='flex-row items-center bg-gray-100 rounded-xl px-4 py-3 mx-10 my-4'>
//           <Image source={icons.search} className='w-5 h-5 mr-2' tintColor='#6B7280' />
//           <TextInput
//             className='flex-1 text-gray-700 text-sm py-1'
//             placeholder='Tìm nhà hàng hoặc món ăn...'
//             placeholderTextColor='#9CA3AF'
//             value={searchQuery}
//             onChangeText={setSearchQuery}
//             returnKeyType='search'
//           />
//         </View>

//         {/*Coupons*/}
//         <View className='mt-2 mb-4'>
//           <SectionHeader title='Ưu đãi hôm nay' />
//           <View className='px-8'>
//             {' '}
//             {/* Thêm px-5 cho View bao hình ảnh */}
//             <TouchableOpacity activeOpacity={0.8}>
//               <Image
//                 source={images.coupon}
//                 className='w-full h-48 rounded-xl mt-4'
//                 resizeMode='cover'
//               />
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Food Categories */}
//         <View className='mt-2'>
//           <SectionHeader title='Danh mục' />
//           <FlatList
//             data={foodCategories}
//             renderItem={renderCategoryItem}
//             keyExtractor={item => item.id}
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 10 }}
//           />
//         </View>

//         {/* Discount Restaurants */}
//         <View className='mt-4'>
//           <SectionHeader title='Siêu Deal Quán Đỉnh' />
//           <FlatList
//             data={discountRestaurants}
//             renderItem={renderDiscountRestaurant}
//             keyExtractor={item => item.id}
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={{ paddingLeft: 28, paddingRight: 40, paddingVertical: 10 }}
//           />
//         </View>

//         {/* Recommended Restaurants */}
//         <View className='mt-4'>
//           <SectionHeader title='Nhà hàng đề xuất' />
//           <FlatList
//             data={recommendedRestaurants}
//             renderItem={renderRecommendedRestaurant}
//             keyExtractor={item => item.id}
//             scrollEnabled={false}
//           />
//         </View>
//       </ScrollView>
//     </View>
//   )
// }

// export default HomeScreen
