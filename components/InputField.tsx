import React from 'react'
import { View, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native'

interface InputFieldProps {
  icon?: any
  placeholder: string
  value: string
  onChangeText: (text: string) => void
  secureTextEntry?: boolean
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad'
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters'
  rightIcon?: any
  onRightIconPress?: () => void
  containerStyle?: object
}

const InputField: React.FC<InputFieldProps> = ({
  icon,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  rightIcon,
  onRightIconPress,
  containerStyle = {}
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {icon && <Image source={icon} style={styles.icon} tintColor='#6B7280' />}
      <TextInput
        className='flex-1 text-gray-800 py-1'
        placeholder={placeholder}
        placeholderTextColor='#9CA3AF'
        value={value}
        onChangeText={onChangeText}
        returnKeyType='search'
        autoCorrect={false}
        clearButtonMode='while-editing' // Hiện nút xóa trên iOS,
        secureTextEntry={secureTextEntry} // ✅ Thêm dòng này
      />

      {rightIcon && (
        <TouchableOpacity onPress={onRightIconPress}>
          <Image source={rightIcon} style={styles.rightIcon} tintColor='#6B7280' />
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    marginBottom: 16
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 8,
    tintColor: '#6B7280'
  },
  input: {
    flex: 1,
    color: '#374151',
    fontSize: 14,
    paddingVertical: 4,
    paddingHorizontal: 8,
    height: 32
  },
  rightIcon: {
    width: 20,
    height: 20,
    marginLeft: 8,
    tintColor: '#6B7280'
  }
})

export default InputField
