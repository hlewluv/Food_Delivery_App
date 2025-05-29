import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

const GOONG_API_KEY = 'JvtUliVy2MWCKYpI89KrJ9QDLRfES4JYkKcw0srO';

// Stitching pattern for routes
const createStitchedCoordinates = (coordinates) => {
  const stitchedCoordinates = [];
  for (let i = 0; i < coordinates.length - 1; i++) {
    const start = coordinates[i];
    const end = coordinates[i + 1];
    const distance = Math.sqrt(
      Math.pow(end.latitude - start.latitude, 2) +
      Math.pow(end.longitude - start.longitude, 2)
    );
    const segments = Math.max(2, Math.floor(distance * 1000)); // Adjust segment density
    
    for (let j = 0; j < segments; j++) {
      const fraction = j / segments;
      stitchedCoordinates.push({
        latitude: start.latitude + (end.latitude - start.latitude) * fraction,
        longitude: start.longitude + (end.longitude - start.longitude) * fraction,
      });
    }
  }
  return stitchedCoordinates;
};

const MapContainer = ({ mapRef, region, location, errorMsg }) => {
  const [isMapReady, setIsMapReady] = useState(false);
  const [mapError, setMapError] = useState(null);

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

  // State to store route information for both segments
  const [routeInfo, setRouteInfo] = useState({
    toRestaurant: { distance: null, duration: null },
    toCustomer: { distance: null, duration: null }
  });
  const [routeCoordinates, setRouteCoordinates] = useState({
    toRestaurant: [],
    toCustomer: []
  });

  useEffect(() => {
    if (location) {
      // Calculate route from current location to restaurant
      const fetchToRestaurantRoute = async () => {
        try {
          const response = await fetch(
            `https://rsapi.goong.io/Direction?origin=${location.latitude},${location.longitude}&destination=${restaurantLocation.latitude},${restaurantLocation.longitude}&vehicle=car&api_key=${GOONG_API_KEY}`
          );
          const data = await response.json();
          
          if (data.routes && data.routes[0]) {
            const route = data.routes[0];
            const coordinates = route.legs[0].steps.map(step => ({
              latitude: step.start_location.lat,
              longitude: step.start_location.lng
            }));
            coordinates.push({
              latitude: route.legs[0].steps[route.legs[0].steps.length - 1].end_location.lat,
              longitude: route.legs[0].steps[route.legs[0].steps.length - 1].end_location.lng
            });
            
            const stitchedCoordinates = createStitchedCoordinates(coordinates);
            setRouteCoordinates(prev => ({
              ...prev,
              toRestaurant: stitchedCoordinates
            }));
            setRouteInfo(prev => ({
              ...prev,
              toRestaurant: {
                distance: route.distance / 1000,
                duration: Math.ceil(route.duration / 60),
              }
            }));
          }
        } catch (error) {
          console.error('Error fetching route to restaurant:', error);
          setMapError('Không thể tải thông tin tuyến đường đến nhà hàng');
        }
      };

      // Calculate route from restaurant to customer
      const fetchToCustomerRoute = async () => {
        try {
          const response = await fetch(
            `https://rsapi.goong.io/Direction?origin=${restaurantLocation.latitude},${restaurantLocation.longitude}&destination=${customerLocation.latitude},${customerLocation.longitude}&vehicle=car&api_key=${GOONG_API_KEY}`
          );
          const data = await response.json();
          
          if (data.routes && data.routes[0]) {
            const route = data.routes[0];
            const coordinates = route.legs[0].steps.map(step => ({
              latitude: step.start_location.lat,
              longitude: step.start_location.lng
            }));
            coordinates.push({
              latitude: route.legs[0].steps[route.legs[0].steps.length - 1].end_location.lat,
              longitude: route.legs[0].steps[route.legs[0].steps.length - 1].end_location.lng
            });
            
            const stitchedCoordinates = createStitchedCoordinates(coordinates);
            setRouteCoordinates(prev => ({
              ...prev,
              toCustomer: stitchedCoordinates
            }));
            setRouteInfo(prev => ({
              ...prev,
              toCustomer: {
                distance: route.distance / 1000,
                duration: Math.ceil(route.duration / 60),
              }
            }));
          }
        } catch (error) {
          console.error('Error fetching route to customer:', error);
          setMapError('Không thể tải thông tin tuyến đường đến khách hàng');
        }
      };

      fetchToRestaurantRoute();
      fetchToCustomerRoute();
    }
  }, [location]);

  const handleMapReady = () => {
    setIsMapReady(true);
    setMapError(null);
  };

  const handleMapError = (error) => {
    console.error('Map error:', error);
    setMapError('Không thể tải bản đồ');
    setIsMapReady(false);
  };

  // Custom marker component with stitching effect
  const StitchedMarker = ({ coordinate, title, description, icon, color }) => (
    <Marker coordinate={coordinate} title={title} description={description}>
      <View style={styles.markerContainer}>
        <View style={[styles.markerBackground, { borderColor: color }]}>
          <View style={styles.markerStitch}>
            <Ionicons name={icon} size={20} color={color} />
          </View>
        </View>
      </View>
    </Marker>
  );

  return (
    <>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        initialRegion={region}
        showsUserLocation={false}
        onMapReady={handleMapReady}
        onError={handleMapError}
      >
        {/* Route to Restaurant */}
        {isMapReady && routeCoordinates.toRestaurant.length > 0 && (
          <Polyline
            coordinates={routeCoordinates.toRestaurant}
            strokeColor="#FF0000"
            strokeWidth={4}
            lineDashPattern={[1, 2]}
            lineCap="round"
            lineJoin="round"
          />
        )}

        {/* Route to Customer */}
        {isMapReady && routeCoordinates.toCustomer.length > 0 && (
          <Polyline
            coordinates={routeCoordinates.toCustomer}
            strokeColor="#0000FF"
            strokeWidth={4}
            lineDashPattern={[1, 2]}
            lineCap="round"
            lineJoin="round"
          />
        )}

        {/* Biker Marker */}
        {isMapReady && location && (
          <StitchedMarker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="Vị trí của bạn"
            description="Tài xế"
            icon="bicycle-outline"
            color="#0000FF"
          />
        )}

        {/* Restaurant Marker */}
        {isMapReady && (
          <StitchedMarker
            coordinate={{
              latitude: restaurantLocation.latitude,
              longitude: restaurantLocation.longitude,
            }}
            title={restaurantLocation.title}
            description={restaurantLocation.description}
            icon="restaurant-outline"
            color="#FF0000"
          />
        )}

        {/* Customer Marker */}
        {isMapReady && (
          <StitchedMarker
            coordinate={{
              latitude: customerLocation.latitude,
              longitude: customerLocation.longitude,
            }}
            title={customerLocation.title}
            description={customerLocation.description}
            icon="person-outline"
            color="#00FF00"
          />
        )}
      </MapView>

      {/* Route Information Overlay */}
      {isMapReady && routeInfo.toRestaurant.distance && routeInfo.toCustomer.distance && (
        <View style={styles.routeInfoContainer}>
          <View style={styles.routeInfoSection}>
            <Text style={[styles.routeInfoTitle, { color: '#FF0000' }]}>
              Đến nhà hàng:
            </Text>
            <Text style={styles.routeInfoText}>
              Khoảng cách: {routeInfo.toRestaurant.distance.toFixed(2)} km
            </Text>
            <Text style={styles.routeInfoText}>
              Thời gian: {routeInfo.toRestaurant.duration} phút
            </Text>
          </View>

          <View style={styles.routeInfoDivider} />

          <View style={styles.routeInfoSection}>
            <Text style={[styles.routeInfoTitle, { color: '#0000FF' }]}>
              Đến khách hàng:
            </Text>
            <Text style={styles.routeInfoText}>
              Khoảng cách: {routeInfo.toCustomer.distance.toFixed(2)} km
            </Text>
            <Text style={styles.routeInfoText}>
              Thời gian: {routeInfo.toCustomer.duration} phút
            </Text>
          </View>
        </View>
      )}

      {(!isMapReady || mapError || !location) && (
        <View style={styles.loadingContainer}>
          <View style={styles.loadingContent}>
            <Ionicons name="location-outline" size={48} color="#888" style={styles.loadingIcon} />
            <Text style={styles.loadingText}>
              {mapError || errorMsg || 'Đang tải bản đồ...'}
            </Text>
            {!mapError && !errorMsg && (
              <Text style={styles.loadingSubtext}>Vui lòng chờ trong giây lát</Text>
            )}
          </View>
        </View>
      )}
    </>
  );
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