import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Modal, Alert, ActivityIndicator } from 'react-native';
import { icons } from '@/constant/icons';
import { images } from '@/constant/images';
import { Link, router } from 'expo-router';
import InputField from '@/components/InputField';

import { mockLogin } from '@/apis/authService';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // 👈 Thêm state này

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.username || !formData.password) {
      setErrorMessage('Vui lòng nhập đầy đủ thông tin');
      setShowErrorModal(true);
      return;
    }  

    setIsLoading(true); // 👈 Bắt đầu loading

    try {    
      const user = await mockLogin(formData.username, formData.password);
      console.log('Login successful:', user);
      router.push('/customer/(tabs)/home', user);


    } catch (error: any) {
      setErrorMessage(error.message);
      setShowErrorModal(true);
    } finally {
      setIsLoading(false); // 👈 Kết thúc loading
    }
  };

  return (
    <ScrollView className='flex-1 bg-white px-6'>
      {/* Header */}
      <View className='items-center mb-8 mt-10'>
        <Image source={images.logo} className='max-w-72 h-32' />
      </View>

      {/* Username */}
      <InputField
        icon={icons.human}
        placeholder='Username hoặc Email'
        value={formData.username}
        onChangeText={text => handleChange('username', text)}
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

      {/* Log in Button */}
      <TouchableOpacity
        className='bg-green-500 py-4 rounded-lg items-center mb-6'
        onPress={handleSubmit}
        disabled={isLoading} // 👈 Disable khi loading
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className='text-white font-bold text-lg'>Log in</Text>
        )}
      </TouchableOpacity>

      {/* Login Link */}
      <View className='flex-row justify-center'>
        <Text className='text-gray-600'>Don't have an account? </Text>
        <Link href='/(auth)/signup' className='text-green-500 font-bold'>
          Sign up
        </Link>
      </View>

      <View className='flex-row items-center my-6'>
        <View className='flex-1 h-px bg-gray-300' />
        <Text className='px-4 text-gray-500'>Or Log in with</Text>
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
        animationType="fade"
        transparent={true}
        visible={showErrorModal}
        onRequestClose={() => setShowErrorModal(false)}>
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-lg w-80">
            <Text className="text-lg font-bold mb-4">Lỗi đăng nhập</Text>
            <Text className="mb-6">{errorMessage}</Text>
            <TouchableOpacity
              className="bg-green-500 py-2 rounded-lg items-center"
              onPress={() => setShowErrorModal(false)}>
              <Text className="text-white font-medium">Đã hiểu</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default Login;
