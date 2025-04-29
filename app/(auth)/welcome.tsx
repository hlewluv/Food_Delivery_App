import React from 'react'
import { View, Image, ImageBackground, Text, TouchableOpacity } from 'react-native'
import { images } from '@/constant/images'
import Button from '@/components/Button'
import { router } from 'expo-router'
import { MotiView } from 'moti'

const Welcome = () => {
  return (
    <ImageBackground
      source={images.background}
      resizeMode='cover'
      className='flex-1 justify-center items-center'>

      {/* Hero 2 */}
      <MotiView
        from={{ translateY: -6 }}
        animate={{ translateY: 6 }}
        transition={{
          type: 'timing',
          duration: 3000,
          loop: true,
          repeatReverse: true,
        }}
        style={{ position: 'absolute', top: 56, left: 20 }}
      >
        <Image
          source={images.hero2}
          className='w-28 h-28 rounded-2xl'
          style={{ transform: [{ rotate: '-6deg' }] }}
        />
      </MotiView>

      {/* Hero 4 */}
      <MotiView
        from={{ translateY: -8 }}
        animate={{ translateY: 8 }}
        transition={{
          type: 'timing',
          duration: 3500,
          loop: true,
          repeatReverse: true,
          delay: 400,
        }}
        style={{ position: 'absolute', top: 40, left: 192 }}
      >
        <Image
          source={images.hero4}
          className='w-28 h-28 rounded-2xl'
          style={{ transform: [{ rotate: '5deg' }, { scale: 1.1 }] }}
        />
      </MotiView>

      {/* Hero 1 */}
      <MotiView
        from={{ translateY: -5 }}
        animate={{ translateY: 5 }}
        transition={{
          type: 'timing',
          duration: 3200,
          loop: true,
          repeatReverse: true,
          delay: 200,
        }}
        style={{ position: 'absolute', top: 240, left: 20 }}
      >
        <Image
          source={images.hero1}
          className='w-28 h-28 rounded-2xl'
          style={{ transform: [{ rotate: '20deg' }] }}
        />
      </MotiView>

      {/* Hero 3 */}
      <MotiView
        from={{ translateY: -10 }}
        animate={{ translateY: 10 }}
        transition={{
          type: 'timing',
          duration: 4000,
          loop: true,
          repeatReverse: true,
          delay: 600,
        }}
        style={{ position: 'absolute', top: 256, left: '55%' }}
      >
        <Image
          source={images.hero3}
          className='w-28 h-28 rounded-2xl'
          style={{ transform: [{ rotate: '-20deg' }, { scale: 2 }] }}
        />
      </MotiView>

      {/* Text Content */}
      <View className='absolute bottom-[8%] w-full px-10'>
        <Text className='text-[45px] font-semibold text-white mb-2'>Let's get</Text>
        <Text className='text-[36px] font-semibold text-white mb-4'>Started with Munch</Text>
        <Text className='text-base font-semibold text-white'>
          Indulge in your favorite dishes, freshly prepared
        </Text>
        <Text className='text-base font-semibold text-white'>
          and delivered straight to your doorstep
        </Text>

        <Button
          title='Join Now'
          onPress={() => router.push('/signup')}
          variant='primary'
          size='large'
          style={{ marginBottom: 25, marginTop: 20 }}
        />

        <View className="flex-row justify-center">
          <Text className='text-base font-semibold text-white'>
            Already have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text className='text-base font-[800] text-primary'>
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  )
}

export default Welcome
