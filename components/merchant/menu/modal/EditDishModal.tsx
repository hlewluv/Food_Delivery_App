import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  TextInput,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'

// Define interfaces
interface Option {
  name: string
  price: string
}

interface OptionGroup {
  groupName: string
  options: Option[]
}

interface Dish {
  name: string
  description: string
  price: string
  available: boolean
  image: string
  optionGroups: OptionGroup[]
  category: string
}

interface Category {
  name: string
  count: number
  dishes: Dish[]
}

interface EditDishModalProps {
  showEditModal: boolean
  setShowEditModal: (value: boolean) => void
  selectedDish: { categoryIndex: number; dishIndex: number } | null
  setSelectedDish: (value: { categoryIndex: number; dishIndex: number } | null) => void
  editDishData: Dish
  setEditDishData: (value: Dish) => void
  categories: Category[]
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>
  optionGroups: OptionGroup[]
  isLoading: boolean
  setIsLoading: (value: boolean) => void
  permissionDenied: boolean
  setPermissionDenied: (value: boolean) => void
  setShowLinkModal: (value: boolean) => void
}

const EditDishModal: React.FC<EditDishModalProps> = ({
  showEditModal,
  setShowEditModal,
  selectedDish,
  setSelectedDish,
  editDishData,
  setEditDishData,
  categories,
  setCategories,
  optionGroups,
  isLoading,
  setIsLoading,
  permissionDenied,
  setPermissionDenied,
  setShowLinkModal
}) => {
  const pickImage = async () => {
    setIsLoading(true)
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!permissionResult.granted) {
      setPermissionDenied(true)
      Alert.alert('Quyền bị từ chối', 'Cần quyền truy cập thư viện ảnh!')
      setIsLoading(false)
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
    setIsLoading(false)
  }

  const saveDishChanges = () => {
    if (!selectedDish) return
    const { categoryIndex, dishIndex } = selectedDish
    const updatedCategories = [...categories]
    updatedCategories[categoryIndex].dishes[dishIndex] = { ...editDishData }
    setCategories(updatedCategories)
    setShowEditModal(false)
    setSelectedDish(null)
  }

  const deleteDish = () => {
    if (!selectedDish) return
    const { categoryIndex, dishIndex } = selectedDish
    const updatedCategories = [...categories]
    updatedCategories[categoryIndex].dishes.splice(dishIndex, 1)
    updatedCategories[categoryIndex].count = updatedCategories[categoryIndex].dishes.length
    setCategories(updatedCategories)
    setShowEditModal(false)
    setSelectedDish(null)
  }

  const removeOptionGroupFromDish = (groupName: string) => {
    setEditDishData({
      ...editDishData,
      optionGroups: editDishData.optionGroups.filter(group => group.groupName !== groupName)
    })
  }

  return (
    <Modal
      transparent={true}
      visible={showEditModal}
      animationType='slide'
      onRequestClose={() => setShowEditModal(false)}>
      <TouchableWithoutFeedback onPress={() => setShowEditModal(false)}>
        <View className='flex-1 justify-center items-center bg-black/50'>
          <TouchableWithoutFeedback>
            <View
              className='bg-white rounded-lg overflow-hidden'
              style={{ width: 620, height: 620, maxWidth: '90%', maxHeight: '90%' }}>
              <View className='p-5 border-b border-gray-200'>
                <Text className='text-lg font-semibold text-gray-800'>
                  {selectedDish ? 'Chỉnh sửa món ăn' : 'Thêm món ăn mới'}
                </Text>
              </View>
              <View className='flex-row p-5' style={{ height: 548 }}>
                <View className='flex justify-start pt-10'>
                  <View className='items-center' style={{ marginTop: 20 }}>
                    <View className='relative mb-2'>
                      <Image
                        source={{
                          uri: editDishData.image || 'https://via.placeholder.com/200x160'
                        }}
                        style={{
                          width: 200,
                          height: 160,
                          borderRadius: 8,
                          backgroundColor: '#f3f4f6',
                          marginTop: 10
                        }}
                        resizeMode='cover'
                      />
                      {isLoading && (
                        <View
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.3)',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 8
                          }}>
                          <ActivityIndicator size='small' color='#ffffff' />
                        </View>
                      )}
                    </View>
                    <TouchableOpacity
                      onPress={pickImage}
                      style={{
                        borderWidth: 1,
                        borderColor: '#d1d5db',
                        borderRadius: 8,
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 200,
                        backgroundColor: isLoading || permissionDenied ? '#f3f4f6' : 'white',
                        marginTop: 8
                      }}
                      disabled={isLoading || permissionDenied}>
                      <Ionicons
                        name='cloud-upload-outline'
                        size={16}
                        color={isLoading || permissionDenied ? '#9ca3af' : '#4b5563'}
                        style={{ marginRight: 8 }}
                      />
                      <Text
                        style={{
                          fontSize: 14,
                          color: isLoading || permissionDenied ? '#9ca3af' : '#374151'
                        }}>
                        Đổi ảnh
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <ScrollView
                  className='w-2/3 pl-10'
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: 20, paddingLeft: 20 }}>
                  <View style={{ marginBottom: 16 }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: 4
                      }}>
                      Tên món ăn
                    </Text>
                    <TextInput
                      style={{
                        borderWidth: 1,
                        borderColor: '#d1d5db',
                        borderRadius: 8,
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        fontSize: 14
                      }}
                      placeholder='Nhập tên món ăn'
                      value={editDishData.name}
                      onChangeText={(text: string) =>
                        setEditDishData({ ...editDishData, name: text })
                      }
                    />
                  </View>
                  <View style={{ marginBottom: 16 }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: 4
                      }}>
                      Mô tả
                    </Text>
                    <TextInput
                      style={{
                        borderWidth: 1,
                        borderColor: '#d1d5db',
                        borderRadius: 8,
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        fontSize: 14,
                        height: 80,
                        textAlignVertical: 'top'
                      }}
                      placeholder='Nhập mô tả món ăn'
                      value={editDishData.description}
                      onChangeText={(text: string) =>
                        setEditDishData({ ...editDishData, description: text })
                      }
                      multiline
                    />
                  </View>
                  <View style={{ marginBottom: 16 }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: 4
                      }}>
                      Giá tiền
                    </Text>
                    <TextInput
                      style={{
                        borderWidth: 1,
                        borderColor: '#d1d5db',
                        borderRadius: 8,
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        fontSize: 14
                      }}
                      placeholder='Nhập giá tiền'
                      value={editDishData.price}
                      onChangeText={(text: string) =>
                        setEditDishData({ ...editDishData, price: text })
                      }
                      keyboardType='numeric'
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 16
                    }}>
                    <Text style={{ fontSize: 14, fontWeight: '500', color: '#374151' }}>
                      Trạng thái:
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        setEditDishData({ ...editDishData, available: !editDishData.available })
                      }
                      style={{
                        paddingHorizontal: 16,
                        paddingVertical: 4,
                        borderRadius: 999,
                        backgroundColor: editDishData.available ? '#dcfce7' : '#fee2e2'
                      }}>
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: '500',
                          color: editDishData.available ? '#166534' : '#991b1b'
                        }}>
                        {editDishData.available ? 'CÓ SẴN' : 'HẾT MÓN'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{ marginBottom: 16 }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: 8
                      }}>
                      Nhóm tùy chọn
                    </Text>
                    <View style={{ gap: 8 }}>
                      {editDishData.optionGroups?.length > 0 ? (
                        editDishData.optionGroups.map((group: OptionGroup, index: number) => (
                          <View
                            key={index}
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: 12,
                              backgroundColor: '#f9fafb',
                              borderRadius: 8,
                              borderWidth: 1,
                              borderColor: '#e5e7eb'
                            }}>
                            <Text style={{ fontSize: 14, color: '#374151' }}>
                              {group.groupName} ({group.options.length} tùy chọn)
                            </Text>
                            <TouchableOpacity
                              onPress={() => removeOptionGroupFromDish(group.groupName)}
                              style={{ padding: 4 }}>
                              <Ionicons name='close-circle' size={18} color='#ef4444' />
                            </TouchableOpacity>
                          </View>
                        ))
                      ) : (
                        <Text
                          style={{
                            fontSize: 14,
                            color: '#6b7280',
                            fontStyle: 'italic',
                            paddingVertical: 8,
                            textAlign: 'center'
                          }}>
                          Chưa có nhóm tùy chọn nào
                        </Text>
                      )}
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => setShowLinkModal(true)}
                    style={{
                      borderWidth: 1,
                      borderColor: '#d1d5db',
                      borderRadius: 8,
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#f9fafb',
                      marginBottom: 16
                    }}>
                    <Ionicons name='link' size={16} color='#3b82f6' style={{ marginRight: 8 }} />
                    <Text style={{ fontSize: 14, color: '#374151' }}>Liên kết nhóm tùy chọn</Text>
                  </TouchableOpacity>
                  <View style={{ flexDirection: 'row', gap: 12 }}>
                    <TouchableOpacity
                      onPress={saveDishChanges}
                      style={{
                        flex: 1,
                        backgroundColor: '#16a34a',
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        borderRadius: 8,
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                      <Text style={{ color: 'white', fontWeight: '500', fontSize: 14 }}>
                        Lưu thay đổi
                      </Text>
                    </TouchableOpacity>
                    {selectedDish && (
                      <TouchableOpacity
                        onPress={deleteDish}
                        style={{
                          flex: 1,
                          backgroundColor: '#dc2626',
                          paddingHorizontal: 16,
                          paddingVertical: 12,
                          borderRadius: 8,
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                        <Text style={{ color: 'white', fontWeight: '500', fontSize: 14 }}>
                          Xóa món
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </ScrollView>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

export default EditDishModal
