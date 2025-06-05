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
import { signup } from '@/apis/auth/authService'
import { SignupPayload } from '@/apis/auth/types'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Signup = () => {
  const [formData, setFormData] = useState<SignupPayload>({
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
  
  // // State cho OTP
  // const [otp, setOtp] = useState('')
  // const [showOTPModal, setShowOTPModal] = useState(false)
  // const [otpError, setOtpError] = useState('')
  // const [isVerifying, setIsVerifying] = useState(false)

  const handleChange = (name: keyof SignupPayload, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async () => {
    // Kiểm tra các trường bắt buộc
    const requiredFields: Array<keyof SignupPayload> = [
      'username',
      'email',
      'first_name',
      'last_name',
      'password',
      'password_confirmation'
    ]
    const emptyFields = requiredFields.filter(field => !formData[field])

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

    // Kiểm tra password match
    if (formData.password !== formData.password_confirmation) {
      setErrorMessage('Mật khẩu xác nhận không khớp')
      setShowErrorModal(true)
      return
    }

    setIsLoading(true)

    try {
      // Gọi API signup
      await signup(formData)
      
      // // Gửi OTP sau khi đăng ký thành công
      // await sendOTP(formData.email)
      // setShowOTPModal(true)
       router.replace('/(app)/customer/(tabs)/home');
    } catch (error: any) {
      setErrorMessage(error.message || 'Đăng ký thất bại. Vui lòng thử lại')
      setShowErrorModal(true)
    } finally {
      setIsLoading(false)
    }
  }

  // const handleVerifyOTP = async () => {
  //   if (otp.length !== 4) {
  //     setOtpError('Mã OTP phải có 4 chữ số')
  //     return
  //   }

  //   setIsVerifying(true)
  //   try {
  //     await verifyOTP(formData.email, otp)
      
  //     // OTP hợp lệ, đóng modal và chuyển đến màn hình login
  //     setShowOTPModal(false)
  //     Alert.alert('Thành công', 'Xác thực email thành công! Bạn có thể đăng nhập ngay bây giờ.', [
  //       { text: 'OK', onPress: () => router.push('/(auth)/login') }
  //     ])
  //   } catch (error: any) {
  //     setOtpError(error.message || 'Mã OTP không chính xác')
  //   } finally {
  //     setIsVerifying(false)
  //   }
  // }

  // const handleResendOTP = async () => {
  //   setIsLoading(true)
  //   try {
  //     await sendOTP(formData.email)
  //     setOtp('')
  //     setOtpError('')
  //     Alert.alert('Thành công', 'Mã OTP mới đã được gửi đến email của bạn')
  //   } catch (error: any) {
  //     setErrorMessage(error.message || 'Không thể gửi lại OTP. Vui lòng thử lại sau.')
  //     setShowErrorModal(true)
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

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
            icon={icons.human}
            placeholder='First Name'
            value={formData.first_name}
            onChangeText={text => handleChange('first_name', text)}
          />
        </View>
        <View className='flex-1 ml-2'>
          <InputField
            icon={icons.human}
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

      {/* Social Login Section (giữ nguyên như trước) */}
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
      {/* ... */}

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
      {/* <Modal
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
      </Modal> */}
    </ScrollView>
  )
}

export default Signup