import { View, Text, TextInput } from 'react-native'

interface SpecialRequestProps {
  value: string
  onChangeText: (text: string) => void
}

const SpecialRequest = ({ value, onChangeText }: SpecialRequestProps) => {
  return (
    <View className='px-5'>
      <Text className='text-lg font-semibold mb-3 text-gray-900'>Yêu cầu đặc biệt</Text>
      <TextInput
        className='bg-white border border-gray-200 rounded-lg p-4 h-24 text-gray-700'
        placeholder='Ví dụ: Không hành, ít cay...'
        placeholderTextColor='#9ca3af'
        multiline
        textAlignVertical='top'
        value={value}
        onChangeText={onChangeText}
      />
      <Text className='text-gray-400 text-xs mt-2'>
        Việc thực hiện yêu cầu tùy thuộc vào khả năng của quán
      </Text>
    </View>
  )
}

export default SpecialRequest