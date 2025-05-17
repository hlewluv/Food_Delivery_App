import React from 'react'
import { View, Image, ImageBackground, Text, TouchableOpacity } from 'react-native'
import { images } from '@/constant/images'
import Button from '@/components/Button'
import { Redirect, router } from 'expo-router'
import { MotiView } from 'moti'

export default function Index() {
  return <Redirect href="/(app)/merchant/(tabs)/home" />; // Mở thẳng vào tab home
  //return <Redirect href="/(app)/customer/(tabs)/home" />; // Mở thẳng vào tab home
  // return <Redirect href="/login" />
  //return <Redirect href="/(app)/biker"/>;
}
