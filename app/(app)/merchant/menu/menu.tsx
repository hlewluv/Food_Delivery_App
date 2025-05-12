import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  TouchableWithoutFeedback,
  TextInput,
  Alert,
  ActivityIndicator
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import { router } from 'expo-router'

const MenuScreen = () => {
  const [selectedTab, setSelectedTab] = useState('Có sẵn')
  const [selectedSubTab, setSelectedSubTab] = useState('7 ngày qua')
  const [expandedCategories, setExpandedCategories] = useState([])
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedDish, setSelectedDish] = useState(null)
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [editCategoryName, setEditCategoryName] = useState('')
  const [editDishData, setEditDishData] = useState({
    name: '',
    description: '',
    price: '',
    available: true,
    image:
      'https://cdn.tgdd.vn/2021/06/CookProduct/com-la-gi-cach-bao-quan-com-tuoi-mua-com-lang-vong-o-dau-ngon-thumb-chu-nhat-1200x676.jpg'
  })

  const [categories, setCategories] = useState([
    {
      name: 'Đặc sản/Món khó',
      count: 1,
      dishes: [
        {
          name: 'LẬP XƯỞNG TƯƠI',
          description: 'Chính sự mới mẻ',
          price: '115,000đ',
          available: true,
          image:
            'https://cdn.tgdd.vn/2021/06/CookProduct/com-la-gi-cach-bao-quan-com-tuoi-mua-com-lang-vong-o-dau-ngon-thumb-chu-nhat-1200x676.jpg'
        }
      ]
    },
    {
      name: 'Ăn Vặt',
      count: 1,
      dishes: [
        {
          name: 'KHOAI TÂY CHIÊN',
          description: 'Giòn rụm',
          price: '25,000đ',
          available: true,
          image:
            'https://cdn.tgdd.vn/2021/06/CookProduct/com-la-gi-cach-bao-quan-com-tuoi-mua-com-lang-vong-o-dau-ngon-thumb-chu-nhat-1200x676.jpg'
        }
      ]
    }
  ])

  // Simulated data for different sub-tabs
  const dataBySubTab = {
    '7 ngày qua': [
      { rank: 1, name: 'Thịt Cuộn Mực Sấy Te - 300gr', weight: '300gr', revenue: '1,255,000đ' },
      { rank: 2, name: 'Đùi Phồng Tỏi Ớt - 500gr', weight: '500gr', revenue: '750,000đ' },
      { rank: 3, name: 'Cơm cháy siêu cha bông - 250gr', weight: '250gr', revenue: '650,000đ' },
      { rank: 4, name: 'Lạp Xưởng Trứng Muối - 500gr', weight: '500gr', revenue: '485,000đ' },
      { rank: 5, name: 'Lạp Xưởng Tươi', weight: '', revenue: '325,000đ' },
      { rank: 6, name: 'Lạp Xưởng Tôm', weight: '', revenue: '200,000đ' }
    ],
    'Bán chạy': [
      { rank: 1, name: 'Lạp Xưởng Tươi', weight: '', revenue: '2,500,000đ' },
      { rank: 2, name: 'Thịt Cuộn Mực Sấy Te - 300gr', weight: '300gr', revenue: '1,800,000đ' },
      { rank: 3, name: 'Đùi Phồng Tỏi Ớt - 500gr', weight: '500gr', revenue: '1,200,000đ' },
      { rank: 4, name: 'KHOAI TÂY CHIÊN', weight: '', revenue: '900,000đ' }
    ]
  }

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!permissionResult.granted) {
      Alert.alert('Quyền bị từ chối', 'Cần quyền truy cập thư viện ảnh!')
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    })

    if (!result.canceled) {
      setEditDishData({ ...editDishData, image: result.assets[0].uri })
    }
  }

  const handleSetupMenuPress = () => {
    router.push('/(app)/merchant/menu/addDish')
  }

  const toggleCategory = categoryName => {
    if (expandedCategories.includes(categoryName)) {
      setExpandedCategories(expandedCategories.filter(name => name !== categoryName))
    } else {
      setExpandedCategories([...expandedCategories, categoryName])
    }
  }

  const handleDishPress = (categoryIndex, dishIndex) => {
    const dish = categories[categoryIndex].dishes[dishIndex]
    setSelectedDish({ categoryIndex, dishIndex })
    setEditDishData({ ...dish })
    setShowEditModal(true)
  }

  const handleEditCategoryPress = categoryIndex => {
    setSelectedCategory(categoryIndex)
    setEditCategoryName(categories[categoryIndex].name)
    setShowEditCategoryModal(true)
  }

  const saveDishChanges = () => {
    const { categoryIndex, dishIndex } = selectedDish
    const updatedCategories = [...categories]
    updatedCategories[categoryIndex].dishes[dishIndex] = { ...editDishData }
    setCategories(updatedCategories)
    setShowEditModal(false)
    setSelectedDish(null)
  }

  const deleteDish = () => {
    const { categoryIndex, dishIndex } = selectedDish
    const updatedCategories = [...categories]
    updatedCategories[categoryIndex].dishes.splice(dishIndex, 1)
    updatedCategories[categoryIndex].count = updatedCategories[categoryIndex].dishes.length
    setCategories(updatedCategories)
    setShowEditModal(false)
    setSelectedDish(null)
  }

  const saveCategoryChanges = () => {
    if (!editCategoryName.trim()) {
      Alert.alert('Lỗi', 'Tên danh mục không được để trống!')
      return
    }
    const updatedCategories = [...categories]
    updatedCategories[selectedCategory].name = editCategoryName.trim()
    setCategories(updatedCategories)
    setShowEditCategoryModal(false)
    setSelectedCategory(null)
    setEditCategoryName('')
  }

  const deleteCategory = () => {
    if (categories[selectedCategory].count > 0) {
      Alert.alert('Lỗi', 'Chỉ có thể xóa danh mục khi không còn món ăn nào!')
      return
    }
    const updatedCategories = categories.filter((_, index) => index !== selectedCategory)
    setCategories(updatedCategories)
    setShowEditCategoryModal(false)
    setSelectedCategory(null)
    setEditCategoryName('')
  }

  const [isLoading, setIsLoading] = useState(false)
  const [permissionDenied, setPermissionDenied] = useState(false)

  return (
    <View className='flex-1 bg-white'>
      <View className='flex-row items-center p-5 bg-white border-b border-gray-200'>
        <TouchableOpacity onPress={() => router.back()} className='mr-4'>
          <Ionicons name='arrow-back' size={28} color='gray' />
        </TouchableOpacity>
        <Text className='flex-1 text-center text-2xl font-semibold text-gray-800'>Thực đơn</Text>
      </View>

      <View className='flex-row border-b border-gray-200'>
        <TouchableOpacity
          className={`flex-1 p-3 pb-3 ${
            selectedTab === 'Có sẵn' ? 'border-b-2 border-green-600' : ''
          }`}
          onPress={() => setSelectedTab('Có sẵn')}>
          <Text
            className={`text-center font-medium text-xl ${
              selectedTab === 'Có sẵn' ? 'text-green-600' : 'text-gray-800'
            }`}>
            Có sẵn
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 p-3 pb-3 ${
            selectedTab === 'Số liệu' ? 'border-b-2 border-green-600' : ''
          }`}
          onPress={() => setSelectedTab('Số liệu')}>
          <Text
            className={`text-center font-medium text-xl ${
              selectedTab === 'Số liệu' ? 'text-green-600' : 'text-gray-800'
            }`}>
            Số liệu
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView className='flex-1'>
        {selectedTab === 'Có sẵn' && (
          <TouchableOpacity
            onPress={handleSetupMenuPress}
            className='flex-row items-center p-5 mx-4 my-2 bg-white rounded-lg shadow-sm border border-gray-100'>
            <Image
              source={{
                uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROn0ZCB0AvToYOVfoun4eG5ItZxXuLO6SHWIFCQOZa8GtocASVAbWTmUxrEd0X9DZOKfM&usqp=CAU'
              }}
              className='w-12 h-12 rounded-full mr-3'
            />
            <View className='flex-1'>
              <Text className='text-xl text-gray-800'>Thiết lập thực đơn</Text>
              <Text className='text-gray-500'>Thêm món ăn hoặc danh mục mới</Text>
            </View>
            <Ionicons name='chevron-forward' size={28} color='gray' />
          </TouchableOpacity>
        )}

        {selectedTab === 'Có sẵn' && (
          <View className='px-4 pb-20'>
            <View className='flex-row justify-between items-center mb-4 mt-2'>
              <Text className='text-2xl font-semibold text-gray-800'>Menu chính</Text>
            </View>

            {categories.map((category, categoryIndex) => (
              <View
                key={categoryIndex}
                className='mb-4 bg-white rounded-lg shadow-sm border border-gray-100'>
                <TouchableOpacity
                  onPress={() => toggleCategory(category.name)}
                  className='flex-row justify-between items-center p-5'
                  activeOpacity={0.8}>
                  <View className='flex-row items-center'>
                    <Ionicons
                      name={
                        expandedCategories.includes(category.name)
                          ? 'chevron-down'
                          : 'chevron-forward'
                      }
                      size={20}
                      color='gray'
                      className='mr-3'
                    />
                    <Text className='text-lg font-medium text-gray-800'>{category.name}</Text>
                  </View>
                  <View className='flex-row items-center'>
                    <Text className='text-gray-600 mr-3'>{category.count} món</Text>
                    <TouchableOpacity
                      onPress={() => handleEditCategoryPress(categoryIndex)}
                      className='p-1'>
                      <Ionicons name='pencil' size={20} color='gray' />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>

                {expandedCategories.includes(category.name) && (
                  <View className='px-5 pb-3'>
                    {category.dishes.map((dish, dishIndex) => (
                      <TouchableOpacity
                        key={dishIndex}
                        onPress={() => handleDishPress(categoryIndex, dishIndex)}
                        className='p-3 mb-3 border-t border-gray-100'
                        activeOpacity={0.8}>
                        <View className='flex-row'>
                          <Image
                            source={{ uri: dish.image }}
                            className='w-20 h-20 rounded-md mr-3'
                          />
                          <View className='flex-1'>
                            <View className='flex-row justify-between items-start'>
                              <Text className='text-lg font-semibold text-gray-800 flex-1'>
                                {dish.name}
                              </Text>
                              <Text className='text-green-600 font-medium'>{dish.price}</Text>
                            </View>
                            <Text className='text-gray-500 text-sm mt-1'>{dish.description}</Text>
                            <View className='mt-2'>
                              <Text
                                className={`text-xs px-2 py-1 rounded-full self-start ${
                                  dish.available
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                {dish.available ? 'CÓ SẴN' : 'HẾT MÓN'}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Số liệu Tab with Sub-tabs */}
        {selectedTab === 'Số liệu' && (
          <View className='px-4 pb-20'>
            <View className='flex-row justify-between mb-4 mt-2'>
              <TouchableOpacity
                className={`flex-1 p-2 m-1 border border-gray-300 rounded-lg ${
                  selectedSubTab === '7 ngày qua' ? 'border-b-2 border-green-600' : ''
                }`}
                onPress={() => setSelectedSubTab('7 ngày qua')}>
                <Text
                  className={`text-center font-medium ${
                    selectedSubTab === '7 ngày qua' ? 'text-green-600' : 'text-gray-800'
                  }`}>
                  7 ngày qua
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 p-2 m-1 border border-gray-300 rounded-lg ${
                  selectedSubTab === 'Bán chạy' ? 'border-b-2 border-green-600' : ''
                }`}
                onPress={() => setSelectedSubTab('Bán chạy')}>
                <Text
                  className={`text-center font-medium ${
                    selectedSubTab === 'Bán chạy' ? 'text-green-600' : 'text-gray-800'
                  }`}>
                  Bán chạy
                </Text>
              </TouchableOpacity>
            </View>

            <View>
              {dataBySubTab[selectedSubTab].map(dish => (
                <View
                  key={dish.rank}
                  className='flex-row items-center p-4 mb-2 bg-white rounded-lg shadow-sm border border-gray-100'>
                  <Text className='text-lg font-medium text-gray-800 w-8'>{dish.rank}.</Text>
                  <View className='flex-1'>
                    <Text className='text-lg font-medium text-gray-800'>{dish.name}</Text>
                    {dish.weight ? (
                      <Text className='text-gray-500 text-sm'>{dish.weight}</Text>
                    ) : null}
                  </View>
                  <Text className='text-green-600 font-medium'>{dish.revenue}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Edit Dish Modal */}
      <Modal
        transparent={true}
        visible={showEditModal}
        animationType='slide'
        onRequestClose={() => setShowEditModal(false)}>
        <TouchableWithoutFeedback onPress={() => setShowEditModal(false)}>
          <View
            className='flex-1 justify-center items-center'
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <TouchableWithoutFeedback>
              <View className='bg-white p-6 rounded-lg w-11/12 max-h-[90%]'>
                <ScrollView>
                  <Text className='text-xl font-semibold text-gray-800 mb-4'>
                    {selectedDish ? 'Chỉnh sửa món ăn' : 'Thêm món ăn mới'}
                  </Text>

                  <Image
                    source={{ uri: editDishData.image }}
                    className='w-full h-40 rounded-md mb-3'
                    resizeMode='cover'
                  />

                  <TouchableOpacity
                    onPress={pickImage}
                    className='border border-gray-300 rounded-lg px-3 py-1.5 flex-row items-center justify-center'
                    disabled={isLoading || permissionDenied}>
                    {isLoading ? (
                      <ActivityIndicator size='small' color='#000000' />
                    ) : (
                      <>
                        <Ionicons
                          name='cloud-upload-outline'
                          size={18}
                          color='gray'
                          className='mr-1'
                        />
                        <Text className='text-gray-800 text-sm'>Thêm ảnh</Text>
                      </>
                    )}
                  </TouchableOpacity>

                  <Text className='text-gray-800 my-1'>Tên món ăn</Text>
                  <TextInput
                    className='border border-gray-300 p-3 rounded-lg mb-4'
                    placeholder='Nhập tên món ăn'
                    value={editDishData.name}
                    onChangeText={text => setEditDishData({ ...editDishData, name: text })}
                  />

                  <Text className='text-gray-800 mb-1'>Mô tả</Text>
                  <TextInput
                    className='border border-gray-300 p-3 rounded-lg mb-4'
                    placeholder='Nhập mô tả món ăn'
                    value={editDishData.description}
                    onChangeText={text => setEditDishData({ ...editDishData, description: text })}
                    multiline
                  />

                  <Text className='text-gray-800 mb-1'>Giá tiền</Text>
                  <TextInput
                    className='border border-gray-300 p-3 rounded-lg mb-4'
                    placeholder='Nhập giá tiền'
                    value={editDishData.price}
                    onChangeText={text => setEditDishData({ ...editDishData, price: text })}
                    keyboardType='numeric'
                  />

                  <View className='flex-row items-center justify-between mb-6'>
                    <Text className='text-gray-800'>Trạng thái:</Text>
                    <TouchableOpacity
                      onPress={() =>
                        setEditDishData({ ...editDishData, available: !editDishData.available })
                      }
                      className={`px-4 py-2 rounded-full ${
                        editDishData.available ? 'bg-green-600' : 'bg-red-600'
                      }`}>
                      <Text className='text-white text-sm'>
                        {editDishData.available ? 'CÓ SẴN' : 'HẾT MÓN'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View className='flex-row justify-between'>
                    <TouchableOpacity
                      onPress={saveDishChanges}
                      className='bg-green-600 px-5 py-3 rounded-full flex-1 mr-2'>
                      <Text className='text-white font-medium text-center'>Lưu</Text>
                    </TouchableOpacity>

                    {selectedDish && (
                      <TouchableOpacity
                        onPress={deleteDish}
                        className='bg-red-600 px-5 py-3 rounded-full flex-1 ml-2'>
                        <Text className='text-white font-medium text-center'>Xóa</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Edit Category Modal */}
      <Modal
        transparent={true}
        visible={showEditCategoryModal}
        animationType='slide'
        onRequestClose={() => setShowEditCategoryModal(false)}>
        <TouchableWithoutFeedback onPress={() => setShowEditCategoryModal(false)}>
          <View
            className='flex-1 justify-center items-center'
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <TouchableWithoutFeedback>
              <View className='bg-white p-6 rounded-lg w-11/12'>
                <Text className='text-xl font-semibold text-gray-800 mb-4'>Chỉnh sửa danh mục</Text>

                <Text className='text-gray-800 mb-1'>Tên danh mục</Text>
                <TextInput
                  className='border border-gray-300 p-3 rounded-lg mb-4'
                  placeholder='Nhập tên danh mục'
                  value={editCategoryName}
                  onChangeText={setEditCategoryName}
                />

                <View className='flex-row justify-between'>
                  <TouchableOpacity
                    onPress={saveCategoryChanges}
                    className='bg-green-600 px-5 py-3 rounded-full flex-1 mr-2'>
                    <Text className='text-white font-medium text-center'>Lưu</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={deleteCategory}
                    className={`px-5 py-3 rounded-full flex-1 ml-2 ${
                      categories[selectedCategory]?.count === 0 ? 'bg-red-600' : 'bg-gray-300'
                    }`}
                    disabled={categories[selectedCategory]?.count > 0}>
                    <Text
                      className={`font-medium text-center ${
                        categories[selectedCategory]?.count === 0 ? 'text-white' : 'text-gray-600'
                      }`}>
                      Xóa
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  )
}

export default MenuScreen
