import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  ActivityIndicator,
  Alert,
  TextInput
} from 'react-native'
import { icons } from '@/constant/icons'
import { images } from '@/constant/images'
import { Link, router } from 'expo-router'
import InputField from '@/components/InputField'

// Mock data và hàm giả lập API
const mockUsers = [
  {
    id: 1,
    username: 'user1',
    email: 'user1@example.com',
    first_name: 'John',
    last_name: 'Doe',
    password: 'password123'
  },
  {
    id: 2,
    username: 'user2',
    email: 'user2@example.com',
    first_name: 'Jane',
    last_name: 'Smith',
    password: 'password123'
  }
]

// Hàm giả lập gửi OTP
const mockSendOTP = async (email: string) => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  // Trả về mã OTP giả (trong thực tế sẽ gửi email thật)
  return '1234' // Mã OTP cố định cho demo
}

// Hàm giả lập xác thực OTP
const mockVerifyOTP = async (email: string, otp: string, correctOtp: string) => {
  await new Promise(resolve => setTimeout(resolve, 500))
  return otp === correctOtp
}

const mockSignup = async (userData: any) => {
  // Giả lập delay API
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Kiểm tra username hoặc email đã tồn tại
  const existingUser = mockUsers.find(
    user => user.username === userData.username || user.email === userData.email
  )

  if (existingUser) {
    throw new Error(
      existingUser.username === userData.username ? 'Username đã tồn tại' : 'Email đã được đăng ký'
    )
  }

  // Kiểm tra password match
  if (userData.password !== userData.password_confirmation) {
    throw new Error('Mật khẩu xác nhận không khớp')
  }

  // Nếu mọi thứ ok, trả về user giả
  const newUser = {
    id: mockUsers.length + 1,
    ...userData
  }

  return newUser
}

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    password_confirmation: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  // State cho OTP
  const [otp, setOtp] = useState('')
  const [showOTPModal, setShowOTPModal] = useState(false)
  const [generatedOTP, setGeneratedOTP] = useState('')
  const [otpError, setOtpError] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async () => {
    // Kiểm tra các trường bắt buộc
    const requiredFields = [
      'username',
      'email',
      'first_name',
      'last_name',
      'password',
      'password_confirmation'
    ]
    const emptyFields = requiredFields.filter(field => !formData[field as keyof typeof formData])

    if (emptyFields.length > 0) {
      setErrorMessage('Vui lòng điền đầy đủ tất cả các thông tin')
      setShowErrorModal(true)
      return
    }

    // Kiểm tra email hợp lệ
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setErrorMessage('Email không hợp lệ')
      setShowErrorModal(true)
      return
    }

    // Kiểm tra password length
    if (formData.password.length < 6) {
      setErrorMessage('Mật khẩu phải có ít nhất 6 ký tự')
      setShowErrorModal(true)
      return
    }

    setIsLoading(true)

    try {
      // Giả lập đăng ký
      const newUser = await mockSignup(formData)
      console.log('Signup successful:', newUser)
      
      // Giả lập gửi OTP
      const otpCode = await mockSendOTP(formData.email)
      setGeneratedOTP(otpCode) // Lưu mã OTP để kiểm tra
      setShowOTPModal(true) // Hiển thị modal nhập OTP
      
    } catch (error: any) {
      setErrorMessage(error.message)
      setShowErrorModal(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async () => {
    if (otp.length !== 4) {
      setOtpError('Mã OTP phải có 4 chữ số')
      return
    }

    setIsVerifying(true)
    try {
      const isValid = await mockVerifyOTP(formData.email, otp, generatedOTP)
      
      if (isValid) {
        // OTP hợp lệ, đóng modal và chuyển đến màn hình login
        setShowOTPModal(false)
        Alert.alert('Thành công', 'Xác thực email thành công! Bạn có thể đăng nhập ngay bây giờ.', [
          { text: 'OK', onPress: () => router.push('/(auth)/login') }
        ])
      } else {
        setOtpError('Mã OTP không chính xác')
      }
    } catch (error) {
      setOtpError('Có lỗi xảy ra khi xác thực')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResendOTP = async () => {
    setIsLoading(true)
    try {
      const newOtp = await mockSendOTP(formData.email)
      setGeneratedOTP(newOtp)
      setOtp('')
      setOtpError('')
      Alert.alert('Thành công', 'Mã OTP mới đã được gửi đến email của bạn')
    } catch (error) {
      setErrorMessage('Không thể gửi lại OTP. Vui lòng thử lại sau.')
      setShowErrorModal(true)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ScrollView className='flex-1 bg-white px-6'>
      {/* Header */}
      <View className='items-center mb-8 mt-10'>
        <Image source={images.logo} className='max-w-72 h-32' />
      </View>

      {/* Name Row */}
      <View className='flex-row mb-1'>
        <View className='flex-1 mr-2'>
          <InputField
            icon={icons}
            placeholder='First Name'
            value={formData.first_name}
            onChangeText={text => handleChange('first_name', text)}
          />
        </View>
        <View className='flex-1 ml-2'>
          <InputField
            icon={icons}
            placeholder='Last Name'
            value={formData.last_name}
            onChangeText={text => handleChange('last_name', text)}
          />
        </View>
      </View>

      {/* Username */}
      <InputField
        icon={icons.human}
        placeholder='Username'
        value={formData.username}
        onChangeText={text => handleChange('username', text)}
        autoCapitalize='none'
      />

      {/* Email */}
      <InputField
        icon={icons.mail}
        placeholder='Email'
        value={formData.email}
        onChangeText={text => handleChange('email', text)}
        keyboardType='email-address'
        autoCapitalize='none'
      />

      {/* Password */}
      <InputField
        icon={icons.password}
        placeholder='Password'
        value={formData.password}
        onChangeText={text => handleChange('password', text)}
        secureTextEntry={!showPassword}
        rightIcon={showPassword ? icons.hide : icons.show}
        onRightIconPress={() => setShowPassword(!showPassword)}
      />

      {/* Confirm Password */}
      <InputField
        icon={icons.password}
        placeholder='Confirm Password'
        value={formData.password_confirmation}
        onChangeText={text => handleChange('password_confirmation', text)}
        secureTextEntry={!showConfirmPassword}
        rightIcon={showConfirmPassword ? icons.hide : icons.show}
        onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
      />

      {/* Sign Up Button */}
      <TouchableOpacity
        className='bg-green-500 py-4 rounded-lg items-center mb-6'
        onPress={handleSubmit}
        disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator color='#fff' />
        ) : (
          <Text className='text-white font-bold text-lg'>Sign Up</Text>
        )}
      </TouchableOpacity>

      {/* Login Link */}
      <View className='flex-row justify-center'>
        <Text className='text-gray-600'>Already have an account? </Text>
        <Link href='/(auth)/login' className='text-green-500 font-bold'>
          Login
        </Link>
      </View>

      <View className='flex-row items-center my-6'>
        <View className='flex-1 h-px bg-gray-300' />
        <Text className='px-4 text-gray-500'>Or Sign up with</Text>
        <View className='flex-1 h-px bg-gray-300' />
      </View>

      {/* Social Login Buttons */}
      <View className='flex-row justify-center mb-6'>
        {/* Google Button */}
        <TouchableOpacity
          className='flex-row items-center bg-white border border-gray-200 px-6 py-3 rounded-lg mr-4 shadow-sm'
          onPress={() => Alert.alert('Google Login', 'Chức năng đăng nhập bằng Google sẽ được thêm sau')}
          activeOpacity={0.7}>
          <Image source={images.google} className='w-5 h-5' resizeMode='contain' />
          <Text className='ml-3 text-gray-700 font-medium'>Google</Text>
        </TouchableOpacity>

        {/* Facebook Button */}
        <TouchableOpacity
          className='flex-row items-center bg-white border border-gray-200 px-6 py-3 rounded-lg shadow-sm'
          onPress={() => Alert.alert('Facebook Login', 'Chức năng đăng nhập bằng Facebook sẽ được thêm sau')}
          activeOpacity={0.7}>
          <Image source={images.fb} className='w-5 h-5' resizeMode='contain' />
          <Text className='ml-3 text-gray-700 font-medium'>Facebook</Text>
        </TouchableOpacity>
      </View>

      {/* Error Modal */}
      <Modal
        animationType='fade'
        transparent={true}
        visible={showErrorModal}
        onRequestClose={() => setShowErrorModal(false)}>
        <View className='flex-1 justify-center items-center bg-black/50'>
          <View className='bg-white p-6 rounded-lg w-80'>
            <Text className='text-lg font-bold mb-4'>Lỗi đăng ký</Text>
            <Text className='mb-6'>{errorMessage}</Text>
            <TouchableOpacity
              className='bg-green-500 py-2 rounded-lg items-center'
              onPress={() => setShowErrorModal(false)}>
              <Text className='text-white font-medium'>Đã hiểu</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* OTP Verification Modal */}
      <Modal
        animationType='fade'
        transparent={true}
        visible={showOTPModal}
        onRequestClose={() => setShowOTPModal(false)}>
        <View className='flex-1 justify-center items-center bg-black/50'>
          <View className='bg-white p-6 rounded-lg w-80'>
            <Text className='text-lg font-bold mb-2'>Xác thực Email</Text>
            <Text className='mb-4'>Nhập mã OTP 4 chữ số đã được gửi đến {formData.email}</Text>
            
            <View className='flex-row justify-between mb-2'>
              {[0, 1, 2, 3].map((index) => (
                <View 
                  key={index} 
                  className={`w-14 h-14 border-2 rounded-lg items-center justify-center ${
                    otpError ? 'border-red-500' : 'border-gray-300'
                  }`}>
                  <Text className='text-xl'>{otp[index] || ''}</Text>
                </View>
              ))}
            </View>
            
            {/* Hidden text input for OTP */}
            <TextInput
              value={otp}
              onChangeText={(text) => {
                if (text.length <= 4) {
                  setOtp(text)
                  setOtpError('')
                }
              }}
              keyboardType='number-pad'
              maxLength={4}
              className='absolute opacity-0 w-0 h-0'
              autoFocus
            />
            
            {otpError ? (
              <Text className='text-red-500 text-sm mb-4'>{otpError}</Text>
            ) : null}
            
            <TouchableOpacity
              className='bg-green-500 py-3 rounded-lg items-center mb-3'
              onPress={handleVerifyOTP}
              disabled={isVerifying || otp.length !== 4}>
              {isVerifying ? (
                <ActivityIndicator color='#fff' />
              ) : (
                <Text className='text-white font-medium'>Xác thực</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handleResendOTP} disabled={isLoading}>
              <Text className='text-green-500 text-center'>
                {isLoading ? 'Đang gửi lại...' : 'Gửi lại mã OTP'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  )
}

export default Signup