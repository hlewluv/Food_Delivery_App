import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import MapView from '@/components/biker/map/MapView';
import Marker from '@/components/biker/map/Marker';
import MapViewDirections from '@/components/biker/map/MapViewDirections'; // Updated import
import { Ionicons } from '@expo/vector-icons';

const GOOGLE_MAPS_APIKEY = 'YOUR_GOOGLE_MAPS_API_KEY'; // Replace with your actual API key

const MapContainer = ({ mapRef, region, location, errorMsg }) => {
  // Hardcoded coordinates for restaurant and customer
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

  // State to store route information
  const [routeInfo, setRouteInfo] = useState({ distance: null, duration: null });

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        provider={Platform.OS === 'android' ? 'PROVIDER_GOOGLE' : undefined}
        region={region}
        showsUserLocation={false}
        showsMyLocationButton={false}
        followsUserLocation={false}
      >
        {/* Biker Marker */}
        {isMapReady && location && (
          <StitchedMarker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="Vị trí của bạn"
            description="Tài xế"
          >
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'white',
                borderRadius: 20,
                borderWidth: 2,
                borderColor: 'blue',
                padding: 4,
              }}
            >
              <Ionicons name="bicycle-outline" size={20} color="blue" />
            </View>
          </Marker>
        )}

        {/* Restaurant Marker */}
        <Marker
          coordinate={{
            latitude: restaurantLocation.latitude,
            longitude: restaurantLocation.longitude,
          }}
          title={restaurantLocation.title}
          description={restaurantLocation.description}
        >
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'white',
              borderRadius: 20,
              borderWidth: 2,
              borderColor: 'red',
              padding: 4,
            }}
          >
            <Ionicons name="restaurant-outline" size={20} color="red" />
          </View>
        </Marker>
        {/* Customer Marker */}
        <Marker
          coordinate={{
            latitude: customerLocation.latitude,
            longitude: customerLocation.longitude,
          }}
          title={customerLocation.title}
          description={customerLocation.description}
        >
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'white',
              borderRadius: 20,
              borderWidth: 2,
              borderColor: 'green',
              padding: 4,
            }}
          >
            <Ionicons name="person-outline" size={20} color="green" />
          </View>
        </Marker>
        {/* Route from Biker to Restaurant */}
        {location && (
          <MapViewDirections
            origin={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            destination={{
              latitude: restaurantLocation.latitude,
              longitude: restaurantLocation.longitude,
            }}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={5}
            strokeColor="#0000FF"
            mode="DRIVING"
            map={mapRef.current} // Pass the map instance for web
            onReady={(result) => {
              setRouteInfo({
                distance: result.distance,
                duration: result.duration,
              });
              // Fit map to show the route
              mapRef.current.fitToCoordinates?.(result.coordinates, {
                edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
              });
            }}
            onError={(errorMessage) => {
              console.log('Directions error:', errorMessage);
            }}
          />
        )}
      </MapView>

      {/* Route Information Overlay */}
      {routeInfo.distance && routeInfo.duration && (
        <View
          style={{
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
          }}
        >
          <Text style={{ fontSize: 8, fontWeight: 'bold' }}>
            Khoảng cách: {routeInfo.distance.toFixed(2)} km
          </Text>
          <Text style={{ fontSize: 8, fontWeight: 'bold' }}>
            Thời gian: {Math.ceil(routeInfo.duration)} phút
          </Text>
        </View>
      )}

      {!location && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
          <View style={{ backgroundColor: 'white', padding: 24, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, alignItems: 'center' }}>
            <Ionicons name="location-outline" size={48} color="#888" style={{ marginBottom: 16 }} />
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#333' }}>
              {errorMsg || 'Đang tải bản đồ...'}
            </Text>
            {!errorMsg && <Text style={{ color: '#666', marginTop: 8 }}>Vui lòng chờ trong giây lát</Text>}
          </View>
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

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerBackground: {
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 2,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  markerStitch: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  routeInfoContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    minWidth: 200,
  },
  routeInfoSection: {
    marginBottom: 8,
  },
  routeInfoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  routeInfoText: {
    fontSize: 12,
    color: '#333',
    marginBottom: 2,
  },
  routeInfoDivider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 8,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  loadingContent: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    alignItems: 'center',
  },
  loadingIcon: {
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  loadingSubtext: {
    color: '#666',
    marginTop: 8,
  },
});

export default MapContainer;