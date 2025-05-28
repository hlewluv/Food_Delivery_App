import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import MapView from '@/components/biker/map/MapView';
import Marker from '@/components/biker/map/Marker';
import MapViewDirections from '@/components/biker/map/MapViewDirections';
import { Ionicons } from '@expo/vector-icons';

// Sử dụng biến môi trường cho API key (nên thay thế trong production)
const GOOGLE_MAPS_APIKEY = process.env.GOOGLE_MAPS_API_KEY || 'AIzaSyDG7TVVWYdKGDtGhxlmbzlT2Db9qUXZLho';

const MapContainer = ({ 
  mapRef, 
  region, 
  location, 
  errorMsg, 
  onSetRouteDestination, 
  destination,
  onRouteInfo // Thêm prop mới để gửi thông tin tuyến đường lên parent
}) => {
  // Định nghĩa các vị trí cố định
  const restaurantLocation = {
    latitude: 16.0740,
    longitude: 108.1498,
    title: 'Nhà hàng - ĐH Bách Khoa',
    description: '54 Nguyễn Lương Bằng, Hòa Khánh, Liên Chiểu, Đà Nẵng',
  };

  const customerLocation = {
    latitude: 16.0736,
    longitude: 108.2250,
    title: 'Khách hàng',
    description: '22 Bạch Đằng, Đà Nẵng',
  };

  // State quản lý trạng thái
  const [routeInfo, setRouteInfo] = useState({ 
    distance: null, 
    duration: null,
    loading: false,
    error: null
  });

  // Hàm thiết lập điểm đến với xử lý lỗi
  const setRouteDestination = useCallback((dest) => {
    if (!dest) return;
    
    if (onSetRouteDestination) {
      onSetRouteDestination(dest);
    }
    
    if (!location) {
      setRouteInfo(prev => ({ ...prev, error: 'Không thể xác định vị trí hiện tại' }));
      return;
    }

    setRouteInfo(prev => ({ ...prev, loading: true, error: null }));

    if (mapRef.current) {
      mapRef.current.fitToCoordinates(
        [
          { latitude: location.latitude, longitude: location.longitude },
          dest,
        ],
        {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        }
      );
    }
  }, [location, onSetRouteDestination]);

  // Xử lý khi có thông tin tuyến đường
  const handleDirectionsReady = useCallback((result) => {
    const newRouteInfo = {
      distance: result.distance,
      duration: result.duration,
      loading: false,
      error: null
    };
    
    setRouteInfo(newRouteInfo);
    
    // Gửi thông tin lên component cha nếu cần
    if (onRouteInfo) {
      onRouteInfo(newRouteInfo);
    }

    if (mapRef.current) {
      mapRef.current.fitToCoordinates(result.coordinates, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  }, [onRouteInfo]);

  // Xử lý lỗi khi tìm đường đi
  const handleDirectionsError = useCallback((errorMessage) => {
    console.error('Directions error:', errorMessage);
    setRouteInfo(prev => ({
      ...prev,
      loading: false,
      error: 'Không thể tìm đường đi. Vui lòng thử lại.'
    }));
  }, []);


  // Styles
  const styles = StyleSheet.create({
    container: StyleSheet.absoluteFillObject,
    markerBiker: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
      borderRadius: 20,
      borderWidth: 2,
      borderColor: 'blue',
      padding: 4,
    },
    markerRestaurant: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
      borderRadius: 20,
      borderWidth: 2,
      borderColor: 'red',
      padding: 4,
    },
    markerCustomer: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
      borderRadius: 20,
      borderWidth: 2,
      borderColor: 'green',
      padding: 4,
    },
    routeInfoContainer: {
      position: 'absolute',
      top: 10,
      left: 10,
      backgroundColor: 'white',
      padding: 10,
      borderRadius: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5,
      minWidth: 150,
    },
    loadingContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
    },
    errorContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      padding: 16,
      backgroundColor: 'rgba(255, 0, 0, 0.2)',
      alignItems: 'center',
    },
    errorText: {
      color: 'red',
      fontWeight: 'bold',
    },
  });

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.container}
        provider={Platform.OS === 'android' ? 'google' : undefined}
        initialRegion={region}
        showsUserLocation={true}
        showsMyLocationButton={false}
        followsUserLocation={false}
        loadingEnabled={true}
        loadingIndicatorColor="#666666"
        loadingBackgroundColor="#eeeeee"
      >
        {/* Biker Marker */}
        {location && (
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="Vị trí của bạn"
            description="Tài xế"
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View style={styles.markerBiker}>
              <Ionicons name="bicycle-outline" size={20} color="blue" />
            </View>
          </Marker>
        )}

        {/* Restaurant Marker */}
        <Marker
          coordinate={restaurantLocation}
          title={restaurantLocation.title}
          description={restaurantLocation.description}
          anchor={{ x: 0.5, y: 0.5 }}
        >
          <View style={styles.markerRestaurant}>
            <Ionicons name="restaurant-outline" size={20} color="red" />
          </View>
        </Marker>

        {/* Customer Marker */}
        <Marker
          coordinate={customerLocation}
          title={customerLocation.title}
          description={customerLocation.description}
          anchor={{ x: 0.5, y: 0.5 }}
        >
          <View style={styles.markerCustomer}>
            <Ionicons name="person-outline" size={20} color="green" />
          </View>
        </Marker>

        {/* Dynamic Route */}
        {location && destination && (
          <MapViewDirections
            origin={location}
            destination={destination}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={4}
            strokeColor="#00b14f"
            mode="DRIVING"
            precision="high"
            timePrecision="now"
            onStart={() => setRouteInfo(prev => ({ ...prev, loading: true }))}
            onReady={handleDirectionsReady}
            onError={handleDirectionsError}
          />
        )}
      </MapView>

      {/* Route Information Overlay */}
      {routeInfo.distance && routeInfo.duration && (
        <View style={styles.routeInfoContainer}>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
            Khoảng cách: {routeInfo.distance.toFixed(1)} km
          </Text>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
            Thời gian: {Math.ceil(routeInfo.duration)} phút
          </Text>
        </View>
      )}

      {/* Loading Indicator */}
      {routeInfo.loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00b14f" />
          <Text style={{ marginTop: 10 }}>Đang tìm đường đi...</Text>
        </View>
      )}

      {/* Error Message */}
      {routeInfo.error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{routeInfo.error}</Text>
        </View>
      )}

      {/* Location Error/Initial Loading */}
      {!location && (
        <View style={styles.loadingContainer}>
          <Ionicons
            name="location-outline"
            size={48}
            color="#888"
            style={{ marginBottom: 16 }}
          />
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#333' }}>
            {errorMsg || 'Đang tải bản đồ...'}
          </Text>
          {!errorMsg && (
            <Text style={{ color: '#666', marginTop: 8 }}>
              Vui lòng chờ trong giây lát
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

// Export locations để sử dụng trong App
MapContainer.restaurantLocation = {
  latitude: 16.0740,
  longitude: 108.1498,
  title: 'Nhà hàng - ĐH Bách Khoa',
  description: '54 Nguyễn Lương Bằng, Hòa Khánh, Liên Chiểu, Đà Nẵng',
};

MapContainer.customerLocation = {
  latitude: 16.0736,
  longitude: 108.2250,
  title: 'Khách hàng',
  description: '22 Bạch Đằng, Đà Nẵng',
};

export default MapContainer;