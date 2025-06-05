import React, { useState, useEffect } from 'react'
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  Modal,
  ActivityIndicator,
  TextInput
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import MenuList from '@/components/merchant/menu/MenuList'
import OptionGroupsList from '@/components/merchant/menu/OptionGroupsList'
import Modals from '@/components/merchant/menu/Modals'
import * as ApiService from '@/components/merchant/menu/ApiService'

const MenuScreen = () => {
  const [selectedTab, setSelectedTab] = useState('Có sẵn')
  const [categories, setCategories] = useState([])
  const [optionGroups, setOptionGroups] = useState([])
  const [expandedCategories, setExpandedCategories] = useState([])
  const [expandedOptionGroups, setExpandedOptionGroups] = useState([])
  const [showEditModal, setShowEditModal] = useState(false)
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false)
  const [showEditOptionGroupModal, setShowEditOptionGroupModal] = useState(false)
  const [showAddDishModal, setShowAddDishModal] = useState(false)
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false)
  const [showAddOptionGroupModal, setShowAddOptionGroupModal] = useState(false)
  const [selectedDish, setSelectedDish] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedOptionGroup, setSelectedOptionGroup] = useState(null)
  const [editCategoryName, setEditCategoryName] = useState('')
  const [editDishData, setEditDishData] = useState({
    name: '',
    description: '',
    price: '',
    available: true,
    image: 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png?20210521171500',
    optionGroups: []
  })
  const [editOptionGroupData, setEditOptionGroupData] = useState({
    groupName: '',
    options: []
  })
  const [addDishData, setAddDishData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png?20210521171500',
    optionGroups: []
  })
  const [addCategoryName, setAddCategoryName] = useState('')
  const [addOptionGroupData, setAddOptionGroupData] = useState({
    groupName: '',
    options: [{ name: '', price: '' }]
  })
  const [isLoading, setIsLoading] = useState(false)
  const [permissionDenied, setPermissionDenied] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const fetchedCategories = await ApiService.fetchCategories()
        const fetchedOptionGroups = await ApiService.fetchOptionGroups()
        setCategories(fetchedCategories)
        setOptionGroups(fetchedOptionGroups)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const toggleCategory = categoryName => {
    setExpandedCategories(prev =>
      prev.includes(categoryName)
        ? prev.filter(name => name !== categoryName)
        : [...prev, categoryName]
    )
  }

  const toggleOptionGroup = groupName => {
    setExpandedOptionGroups(prev =>
      prev.includes(groupName) ? prev.filter(name => name !== groupName) : [...prev, groupName]
    )
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

  const handleEditOptionGroup = groupIndex => {
    setSelectedOptionGroup(groupIndex)
    setEditOptionGroupData({ ...optionGroups[groupIndex] })
    setShowEditOptionGroupModal(true)
  }

  const handleAddOptionGroup = async () => {
    if (
      !addOptionGroupData.groupName ||
      addOptionGroupData.options.some(opt => !opt.name || !opt.price)
    ) {
      alert('Vui lòng điền đầy đủ tên nhóm và ít nhất một tùy chọn hợp lệ')
      return
    }
    setIsLoading(true)
    try {
      const result = await ApiService.addOptionGroup(addOptionGroupData)
      setOptionGroups(result.optionGroups)
      setAddOptionGroupData({ groupName: '', options: [{ name: '', price: '' }] })
      setShowAddOptionGroupModal(false)
    } catch (error) {
      alert('Không thể thêm nhóm tùy chọn')
    } finally {
      setIsLoading(false)
    }
  }

  const addOptionField = () => {
    setAddOptionGroupData({
      ...addOptionGroupData,
      options: [...addOptionGroupData.options, { name: '', price: '' }]
    })
  }

  const updateOptionField = (index, field, value) => {
    const newOptions = [...addOptionGroupData.options]
    newOptions[index] = { ...newOptions[index], [field]: value }
    setAddOptionGroupData({ ...addOptionGroupData, options: newOptions })
  }

  return (
    <View className='flex-1 bg-white'>
      {/* Header */}
      <View className='flex-row items-center p-4 bg-white'>
        <Text className='flex-1 text-center text-4xl font-bold text-gray-900'>Thực đơn</Text>
      </View>
      {/* Tabs */}
      <View className='flex-row border-b border-gray-200'>
        {['Có sẵn', 'Tuỳ chọn nhóm'].map(tab => (
          <TouchableOpacity
            key={tab}
            className={`flex-1 p-3 pb-3 ${
              selectedTab === tab ? 'border-b-2 border-green-600' : ''
            }`}
            onPress={() => setSelectedTab(tab)}>
            <Text
              className={`text-center font-medium text-xl ${
                selectedTab === tab ? 'text-green-600' : 'text-gray-800'
              }`}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView className='flex-1 pt-5'>
        {selectedTab === 'Có sẵn' && (
          <View className='flex-row justify-end items-center px-4 mb-2'>
            <TouchableOpacity
              onPress={() => setShowAddDishModal(true)}
              className='bg-green-600 p-3 rounded-lg'>
              <Ionicons name='add' size={24} color='white' />
            </TouchableOpacity>
          </View>
        )}
        {selectedTab === 'Có sẵn' && (
          <MenuList
            categories={categories}
            expandedCategories={expandedCategories}
            toggleCategory={toggleCategory}
            handleDishPress={handleDishPress}
            handleEditCategoryPress={handleEditCategoryPress}
            setCategories={setCategories}
          />
        )}
        {selectedTab === 'Tuỳ chọn nhóm' && (
          <View className='flex-row justify-end items-center px-4 mb-2'>
            <TouchableOpacity
              onPress={() => setShowAddOptionGroupModal(true)}
              className='bg-green-600 p-3 rounded-lg'>
              <Ionicons name='add' size={24} color='white' />
            </TouchableOpacity>
          </View>
        )}
        {selectedTab === 'Tuỳ chọn nhóm' && (
          <OptionGroupsList
            optionGroups={optionGroups}
            expandedOptionGroups={expandedOptionGroups}
            toggleOptionGroup={toggleOptionGroup}
            handleEditOptionGroup={handleEditOptionGroup}
            setOptionGroups={setOptionGroups}
            setCategories={setCategories}
          />
        )}
      </ScrollView>
      {/* Modals */}
      <Modals
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        showEditCategoryModal={showEditCategoryModal}
        setShowEditCategoryModal={setShowEditCategoryModal}
        showEditOptionGroupModal={showEditOptionGroupModal}
        setShowEditOptionGroupModal={setShowEditOptionGroupModal}
        showAddDishModal={showAddDishModal}
        setShowAddDishModal={setShowAddDishModal}
        showAddCategoryModal={showAddCategoryModal}
        setShowAddCategoryModal={setShowAddCategoryModal}
        selectedDish={selectedDish}
        setSelectedDish={setSelectedDish}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedOptionGroup={selectedOptionGroup}
        setSelectedOptionGroup={setSelectedOptionGroup}
        editDishData={editDishData}
        setEditDishData={setEditDishData}
        editCategoryName={editCategoryName}
        setEditCategoryName={setEditCategoryName}
        editOptionGroupData={editOptionGroupData}
        setEditOptionGroupData={setEditOptionGroupData}
        addDishData={addDishData}
        setAddDishData={setAddDishData}
        addCategoryName={addCategoryName}
        setAddCategoryName={setAddCategoryName}
        categories={categories}
        setCategories={setCategories}
        optionGroups={optionGroups}
        setOptionGroups={setOptionGroups}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        permissionDenied={permissionDenied}
        setPermissionDenied={setPermissionDenied}
      />
      {/* Add Option Group Modal */}
      <Modal visible={showAddOptionGroupModal} animationType='slide' transparent>
        <View className='flex-1 justify-center items-center bg-black/50'>
          <View className='bg-white rounded-lg p-6 w-11/12 max-w-md'>
            <Text className='text-xl font-semibold mb-4'>Thêm nhóm tùy chọn mới</Text>
            <TextInput
              className='border border-gray-300 rounded-lg p-2 mb-3'
              placeholder='Tên nhóm tùy chọn'
              value={addOptionGroupData.groupName}
              onChangeText={text =>
                setAddOptionGroupData({ ...addOptionGroupData, groupName: text })
              }
            />
            {addOptionGroupData.options.map((option, index) => (
              <View key={index} className='mb-3'>
                <TextInput
                  className='border border-gray-300 rounded-lg p-2 mb-1'
                  placeholder='Tên tùy chọn'
                  value={option.name}
                  onChangeText={text => updateOptionField(index, 'name', text)}
                />
                <TextInput
                  className='border border-gray-300 rounded-lg p-2'
                  placeholder='Giá (VD: 10000)'
                  value={option.price}
                  keyboardType='numeric'
                  onChangeText={text => updateOptionField(index, 'price', text)}
                />
              </View>
            ))}
            <TouchableOpacity onPress={addOptionField} className='bg-gray-200 p-2 rounded-lg mb-3'>
              <Text className='text-center text-gray-800'>+ Thêm tùy chọn</Text>
            </TouchableOpacity>
            <View className='flex-row justify-end mt-4'>
              <TouchableOpacity
                onPress={() => setShowAddOptionGroupModal(false)}
                className='px-4 py-2 mr-2'>
                <Text className='text-gray-600'>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAddOptionGroup}
                className='bg-green-600 px-4 py-2 rounded-lg'>
                {isLoading ? (
                  <ActivityIndicator color='white' />
                ) : (
                  <Text className='text-white'>Thêm</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default MenuScreen
