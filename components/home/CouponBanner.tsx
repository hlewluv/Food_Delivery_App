import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
  FlatList,
  StyleSheet,
} from 'react-native';
import { images } from '@/constant/images';
import SectionHeader from '@/components/SectionHeader';
import { useRouter } from 'expo-router';

const { width: screenWidth } = Dimensions.get('window');
const horizontalPadding = 32; // px-8
const itemWidth = screenWidth - horizontalPadding * 2;

const couponData = [
  {
    id: '1',
    image: images.coupon,
    targetScreen: '/(coupons)/discount1',
  },
  {
    id: '2',
    image: images.coupon,
    targetScreen: '/(coupons)/discount2',
  },
  {
    id: '3',
    image: images.coupon,
    targetScreen: '/(coupons)/discount3',
  },
];

const CouponBanner = () => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);

  // Auto scroll sau mỗi 5 giây
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % couponData.length;
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
      setCurrentIndex(nextIndex);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const handlePress = (targetScreen: string) => {
    router.push(targetScreen);
  };

  const renderItem = ({ item }) => (
    <View style={{ width: screenWidth, alignItems: 'center' }}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => handlePress(item.targetScreen)}
        style={{ width: itemWidth }}
      >
        <Image
          source={item.image}
          resizeMode="cover"
          style={styles.bannerImage}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <SectionHeader title="Ưu đãi hôm nay" />
      
      <View style={styles.bannerWrapper}>
        <Animated.FlatList
          ref={flatListRef}
          data={couponData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToInterval={screenWidth} // Snap theo chiều rộng màn hình
          decelerationRate="fast"
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
            setCurrentIndex(index);
          }}
        />
      </View>

      {/* Indicator */}
      <View style={styles.indicatorContainer}>
        {couponData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              currentIndex === index ? styles.activeIndicator : styles.inactiveIndicator,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    marginBottom: 24,
  },
  bannerWrapper: {
    marginTop: 16,
    height: 192, // Chiều cao cố định cho banner
    overflow: 'hidden', // Ẩn các phần thừa
  },
  bannerImage: {
    width: '100%',
    height: 192,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activeIndicator: {
    width: 24,
    backgroundColor: '#00b14f', // primary-500
  },
  inactiveIndicator: {
    backgroundColor: '#E5E7EB', // gray-300
  },
});

export default CouponBanner;