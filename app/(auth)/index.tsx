import React from 'react'
import { View, Image, ImageBackground, Text, TouchableOpacity } from 'react-native'
import { images } from '@/constant/images'
import Button from '@/components/Button'
import { Redirect, router } from 'expo-router'
import { MotiView } from 'moti'

export default function Index() {
  return <Redirect href="/merchant/menu/addDish" />; // Mở thẳng vào tab home
}
