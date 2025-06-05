import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

const GOONG_API_KEY = 'JvtUliVy2MWCKYpI89KrJ9QDLRfES4JYkKcw0srO';

type Location = {
  latitude: number;
  longitude: number;
};

type Region = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

type RouteInfo = {
  distance: number | null;
  duration: number | null;
};

type MapContainerProps = {
  mapRef: React.RefObject<MapView>;
  region: Region;
  location: Location | null;
  errorMsg: string | null;
  activeRoute?: 'restaurant' | 'customer' | null;
  onRouteInfo?: (info: RouteInfo) => void;
  restaurantLocation?: Location;
  customerLocation?: Location;
  destination?: Location | null;
};

const MapContainer: React.FC<MapContainerProps> = ({
  mapRef,
  region,
  location,
  errorMsg,
  activeRoute = null,
  onRouteInfo,
  restaurantLocation = {
    latitude: 16.0740,
    longitude: 108.1498,
  },
  customerLocation = {
    latitude: 16.0736,
    longitude: 108.2250,
  },
  destination = null,
}) => {
  const [isMapReady, setIsMapReady] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [routeInfo, setRouteInfo] = useState<{
    toRestaurant: RouteInfo;
    toCustomer: RouteInfo;
  }>({
    toRestaurant: { distance: null, duration: null },
    toCustomer: { distance: null, duration: null }
  });
  const [routeCoordinates, setRouteCoordinates] = useState<{
    toRestaurant: Location[];
    toCustomer: Location[];
  }>({
    toRestaurant: [],
    toCustomer: []
  });

  useEffect(() => {
    if (location && activeRoute) {
      const destination = activeRoute === 'restaurant' ? restaurantLocation : customerLocation;
      const routeType = activeRoute === 'restaurant' ? 'toRestaurant' : 'toCustomer';
      
      fetchRoute(location, destination, routeType);
    } else {
      // Clear routes when no active route
      setRouteCoordinates({
        toRestaurant: [],
        toCustomer: []
      });
      setRouteInfo({
        toRestaurant: { distance: null, duration: null },
        toCustomer: { distance: null, duration: null }
      });
    }
  }, [location, activeRoute]);

  const fetchRoute = async (origin: Location, destination: Location, routeType: 'toRestaurant' | 'toCustomer') => {
    try {
      const response = await fetch(
        `https://rsapi.goong.io/Direction?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&vehicle=car&api_key=${GOONG_API_KEY}`
      );
      const data = await response.json();
      
      if (data.routes && data.routes[0]) {
        const route = data.routes[0];
        const coordinates = route.legs[0].steps.flatMap((step: any) => [
          {
            latitude: step.start_location.lat,
            longitude: step.start_location.lng
          },
          {
            latitude: step.end_location.lat,
            longitude: step.end_location.lng
          }
        ]);
        
        // Remove duplicate coordinates
        const uniqueCoordinates = coordinates.filter(
          (coord: Location, index: number, self: Location[]) =>
            index === self.findIndex((c) => (
              c.latitude === coord.latitude && c.longitude === coord.longitude
            ))
        );
        
        setRouteCoordinates(prev => ({
          ...prev,
          [routeType]: uniqueCoordinates,
          [routeType === 'toRestaurant' ? 'toCustomer' : 'toRestaurant']: []
        }));
        
        const newRouteInfo = {
          distance: route.distance / 1000, // Convert to km
          duration: Math.ceil(route.duration / 60), // Convert to minutes
        };
        
        setRouteInfo(prev => ({
          ...prev,
          [routeType]: newRouteInfo,
          [routeType === 'toRestaurant' ? 'toCustomer' : 'toRestaurant']: { distance: null, duration: null }
        }));
        
        if (onRouteInfo) {
          onRouteInfo(newRouteInfo);
        }
      }
    } catch (error) {
      console.error(`Error fetching route to ${routeType}:`, error);
      setMapError(`Không thể tải thông tin tuyến đường đến ${routeType === 'toRestaurant' ? 'nhà hàng' : 'khách hàng'}`);
    }
  };

  const handleMapReady = () => {
    setIsMapReady(true);
    setMapError(null);
  };

  const handleMapError = (error: Error) => {
    console.error('Map error:', error);
    setMapError('Không thể tải bản đồ');
    setIsMapReady(false);
  };

  return (
    <>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        initialRegion={region}
        showsUserLocation={false}
        onMapReady={handleMapReady}
      >
        {/* Route to Restaurant */}
        {isMapReady && activeRoute === 'restaurant' && routeCoordinates.toRestaurant.length > 0 && (
          <Polyline
            coordinates={routeCoordinates.toRestaurant}
            strokeColor="#FF0000"
            strokeWidth={5}
          />
        )}

        {/* Route to Customer */}
        {isMapReady && activeRoute === 'customer' && routeCoordinates.toCustomer.length > 0 && (
          <Polyline
            coordinates={routeCoordinates.toCustomer}
            strokeColor="#0000FF"
            strokeWidth={5}
          />
        )}

        {/* Biker Marker */}
        {isMapReady && location && (
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="Vị trí của bạn"
            description="Tài xế"
          >
            <View style={styles.markerBike}>
              <Ionicons name="bicycle-outline" size={20} color="blue" />
            </View>
          </Marker>
        )}

        {/* Restaurant Marker */}
        {isMapReady && (
          <Marker
            coordinate={restaurantLocation}
            title="Nhà hàng - ĐH Bách Khoa"
            description="54 Nguyễn Lương Bằng, Hòa Khánh, Liên Chiểu, Đà Nẵng"
          >
            <View style={styles.markerRestaurant}>
              <Ionicons name="restaurant-outline" size={20} color="red" />
            </View>
          </Marker>
        )}

        {/* Customer Marker */}
        {isMapReady && (
          <Marker
            coordinate={customerLocation}
            title="Khách hàng"
            description="22 Bạch Đằng, Đà Nẵng"
          >
            <View style={styles.markerCustomer}>
              <Ionicons name="person-outline" size={20} color="green" />
            </View>
          </Marker>
        )}
      </MapView>

      {/* Route Information Overlay */}
      {isMapReady && activeRoute && (
        <View style={styles.routeInfoContainer}>
          <Text style={[styles.routeTitle, activeRoute === 'restaurant' ? styles.restaurantTitle : styles.customerTitle]}>
            {activeRoute === 'restaurant' ? 'Đến nhà hàng' : 'Đến khách hàng'}
          </Text>
          {routeInfo[activeRoute === 'restaurant' ? 'toRestaurant' : 'toCustomer'].distance && (
            <>
              <Text style={styles.routeText}>
                Khoảng cách: {routeInfo[activeRoute === 'restaurant' ? 'toRestaurant' : 'toCustomer'].distance?.toFixed(2)} km
              </Text>
              <Text style={styles.routeText}>
                Thời gian: {routeInfo[activeRoute === 'restaurant' ? 'toRestaurant' : 'toCustomer'].duration} phút
              </Text>
            </>
          )}
        </View>
      )}

      {(!isMapReady || mapError || !location) && (
        <View style={styles.loadingContainer}>
          <View style={styles.loadingContent}>
            <Ionicons name="location-outline" size={48} color="#888" style={styles.loadingIcon} />
            <Text style={styles.loadingText}>
              {mapError || errorMsg || 'Đang tải bản đồ...'}
            </Text>
            {!mapError && !errorMsg && <Text style={styles.loadingSubtext}>Vui lòng chờ trong giây lát</Text>}
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  markerBike: {
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
  },
  routeTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  restaurantTitle: {
    color: '#FF0000',
  },
  customerTitle: {
    color: '#0000FF',
  },
  routeText: {
    fontSize: 10,
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