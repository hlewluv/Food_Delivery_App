import React, { useState } from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons'

const FoodItemSmall = ({ item, onPress, onAddToCart, quantity = 0 }) => {
  const [showQuantityControls, setShowQuantityControls] = useState(quantity > 0)

  const handleAddPress = e => {
    e.stopPropagation()
    onAddToCart(1)
    setShowQuantityControls(true)
  }

  const handleIncrement = e => {
    e.stopPropagation()
    onAddToCart(1)
  }

  const handleDecrement = e => {
    e.stopPropagation()
    if (quantity > 1) {
      onAddToCart(-1)
    } else {
      onAddToCart(-1)
      setShowQuantityControls(false)
    }
  }

  React.useEffect(() => {
    setShowQuantityControls(quantity > 0)
  }, [quantity])

  return (
    <TouchableOpacity className='mr-4 w-48' onPress={onPress} activeOpacity={0.9}>
      <View style={{ position: 'relative' }}>
        <Image
          source={item.image}
          style={{ width: '100%', height: 128, borderRadius: 12 }}
          resizeMode='cover'
        />

        {showQuantityControls ? (
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              onPress={handleDecrement}
              activeOpacity={0.7}
              style={styles.quantityButton}>
              <Feather name='minus' size={16} color='#6b7280' />
            </TouchableOpacity>

            <View style={styles.quantityValue}>
              <Text style={styles.quantityText}>{quantity}</Text>
            </View>

            <TouchableOpacity
              onPress={handleIncrement}
              activeOpacity={0.7}
              style={styles.quantityButton}>
              <Feather name='plus' size={16} color='#6b7280' />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.addButton} activeOpacity={0.9} onPress={handleAddPress}>
            <Feather name='plus' size={14} color='white' />
          </TouchableOpacity>
        )}
      </View>

      <Text className='mt-2 font-medium text-gray-900' numberOfLines={1}>
        {item.name}
      </Text>
      <View className='flex-row justify-between items-center mt-1'>
        <Text className='text-gray-900 font-bold'>{item.price}</Text>
        {item.rating && (
          <View className='flex-row items-center'>
            <MaterialIcons name='star' size={16} color='#FFD700' style={{ marginRight: 4 }} />
            <Text className='text-gray-700 text-sm'>{item.rating}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  addButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 34,
    height: 34,
    backgroundColor: '#00b14f',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3
  },
  quantityContainer: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
    height: 34,
    minWidth: 100,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3
  },
  quantityButton: {
    width: 34,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center'
  },
  quantityValue: {
    minWidth: 32,
    justifyContent: 'center',
    alignItems: 'center'
  },
  quantityText: {
    color: '#1f2937',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500'
  }
})

export default FoodItemSmall
