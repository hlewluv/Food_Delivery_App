import React, { useEffect, useState, useRef, useCallback } from 'react';
import { SafeAreaView, Platform, TouchableOpacity, Text, Alert } from 'react-native';
import Header from '@/components/biker/ui/Header';
import ControlPanel from '@/components/biker/ui/ControlPanel';
import ConnectionModal from '@/components/biker/ui/ConnectionModal';
import MapContainer from '@/components/biker/ui/MapContainer';
import OrderConfirmationModal from '@/components/biker/ui/order/OrderConfirmationModal';
import OrderDetailsModal from '@/components/biker/ui/order/OrderDetailsModal';

import {
  Location,
  Restaurant,
  Customer,
  OrderItem,
  Order,
} from '@/components/biker/ui/order/OrderDetailsModal'; // Import types

const mockLocation = {
  requestForegroundPermissionsAsync: async () => ({ status: 'granted' }),
  getCurrentPositionAsync: async () => ({
    coords: {
      latitude: 16.0738,
      longitude: 108.1874,
      accuracy: 10,
      altitude: 0,
      altitudeAccuracy: 0,
      heading: 0,
      speed: 0,
    },
  }),
};

// Renamed Location variable to LocationModule
const LocationModule = Platform.OS === 'web' ? mockLocation : require('expo-location');

// Placeholder for initial order structure (replace with actual structure)
const initialOrder: Order = {
  id: '1',
  restaurant: { name: 'Restaurant Name', address: 'Restaurant Address' },
  customer: { name: 'Customer Name', address: 'Customer Address' },
  items: [],
  total: 0,
  paymentMethod: 'Cash',
  distance: '0 km',
  earnings: 0,
};

// Placeholder locations (replace with actual values)
const restaurantLocation = { latitude: 16.0740, longitude: 108.1498 };
const customerLocation = { latitude: 16.0736, longitude: 108.2250 };

const App = () => {
  // State management
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [balance, setBalance] = useState(3000000);
  const [isConnected, setIsConnected] = useState(true);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [autoAccept, setAutoAccept] = useState(false);
  const [activeRoute, setActiveRoute] = useState<'restaurant' | 'customer' | null>(null);
  const [region, setRegion] = useState({
    latitude: 16.0738,
    longitude: 108.1498,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null); // Typed currentOrder state
  const [showFloatingButton, setShowFloatingButton] = useState(true);
  const [destination, setDestination] = useState<{ latitude: number; longitude: number } | null>(null); // Typed destination state
  const [routeInfo, setRouteInfo] = useState<{ distance: number | null; duration: number | null } | null>(null);
  const [showCustomerRoute, setShowCustomerRoute] = useState(false);
  const mapRef = useRef<any>(null); // Typed mapRef
  const [showFavoritesModal, setShowFavoritesModal] = useState(false); // Added state for Favorites Modal

  // Format money utility
  const formatMoney = useCallback((amount: number) => {
    if (amount >= 1000000) {
      const millions = amount / 1000000;
      return millions % 1 === 0 ? `${millions.toFixed(0)}M` : `${millions.toFixed(1)}M`;
    } else if (amount >= 1000) {
      const thousands = amount / 1000;
      return thousands % 1 === 0 ? `${thousands.toFixed(0)}k` : `${thousands.toFixed(1)}k`;
    }
    return amount.toString();
  }, []);

  // Get current location
  const getCurrentLocation = useCallback(async () => {
    try {
      let { status } = await LocationModule.requestForegroundPermissionsAsync(); // Use LocationModule
      if (status !== 'granted') {
        setErrorMsg('Quyền truy cập vị trí bị từ chối');
        return null;
      }

      return await LocationModule.getCurrentPositionAsync({ // Use LocationModule
        accuracy: Platform.OS === 'web' ? null : LocationModule.Accuracy.High, // Use LocationModule
      });
    } catch (error) {
      setErrorMsg('Không thể lấy vị trí hiện tại');
      console.error(error);
      return null;
    }
  }, []);

  const handleSetActiveRoute = useCallback((route: 'restaurant' | 'customer' | null) => {
    setActiveRoute(route);

    // Update destination based on the active route
    if (route === 'restaurant') {
      setDestination(restaurantLocation);
    } else if (route === 'customer') {
      setDestination(customerLocation);
    } else {
      setDestination(null);
    }
  }, [restaurantLocation, customerLocation]);

  // Initialize map and location
  useEffect(() => {
    const init = async () => {
      const loc = await getCurrentLocation();
      if (!loc) return;

      setLocation(loc.coords);

      const locations = [
        { latitude: loc.coords.latitude, longitude: loc.coords.longitude },
        { latitude: 16.0740, longitude: 108.1498 },
        { latitude: 16.0736, longitude: 108.2250 },
      ];

      const latitudes = locations.map(loc => loc.latitude);
      const longitudes = locations.map(loc => loc.longitude);
      const minLat = Math.min(...latitudes);
      const maxLat = Math.max(...latitudes);
      const minLng = Math.min(...longitudes);
      const maxLng = Math.max(...longitudes);

      setRegion({
        latitude: (minLat + maxLat) / 2,
        longitude: (minLng + maxLng) / 2,
        latitudeDelta: (maxLat - minLat) * 1.5 || 0.1,
        longitudeDelta: (maxLng - minLng) * 1.5 || 0.1,
      });

      if (isConnected && !currentOrder) {
        setCurrentOrder(initialOrder);
        setShowOrderModal(true);
      }
    };

    init();
  }, [isConnected, currentOrder, getCurrentLocation]);

  // Request new order
  const requestNewOrder = useCallback(() => {
    if (isConnected && !currentOrder) {
      setCurrentOrder(initialOrder);
      setShowOrderModal(true);
    }
  }, [isConnected, currentOrder]);

  // Center map to current location
  const handleCenterMap = useCallback(() => {
    if (location && mapRef.current && mapRef.current.animateToRegion) { // Added null check for animateToRegion
      mapRef.current.animateToRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      });
    }
  }, [location]);

  // Toggle connection status
  const toggleConnection = useCallback(() => {
    const newStatus = !isConnected;
    setIsConnected(newStatus);

    if (!newStatus) {
      setAutoAccept(false);
      setShowOrderModal(false);
      setShowDetailsModal(false);
      setCurrentOrder(null); // Corrected to null
      setShowFloatingButton(false);
      setDestination(null);
      handleSetActiveRoute(null); // Also clear active route
    } else if (newStatus && !currentOrder) { // Corrected condition here
      setCurrentOrder(initialOrder);
      setShowOrderModal(true);
    }
    setShowConnectionModal(false);
  }, [isConnected, currentOrder, handleSetActiveRoute]);

  // Start order handler
  const handleStartOrder = useCallback(() => {
    setShowOrderModal(false);
    setShowDetailsModal(true);
    setShowFloatingButton(false);
    handleSetActiveRoute('restaurant'); // Set initial route to restaurant
    setShowCustomerRoute(false);
  }, [handleSetActiveRoute]);

  // Close order details
  const handleCloseDetails = useCallback(() => {
    setShowDetailsModal(false);
    setCurrentOrder(null); // Corrected to null
    setShowFloatingButton(true);
    handleSetActiveRoute(null); // Clear the active route
    setShowCustomerRoute(false);
  }, [handleSetActiveRoute]);

  // Open order details
  const handleOpenDetailsModal = useCallback(() => {
    setShowFloatingButton(false);
    setShowDetailsModal(true);
  }, []);

  // Set route destination
  const handleSetRouteDestination = useCallback((dest: { latitude: number; longitude: number } | null) => {
    if (!dest) return;

    setDestination(dest);

    // Auto-center map to show the route
    if (location && mapRef.current && mapRef.current.fitToCoordinates) { // Added null check for fitToCoordinates
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
  }, [location]);

  // Handle route info update
  const handleRouteInfo = useCallback((info: { distance: number | null; duration: number | null } | null) => { // Added type annotation
    setRouteInfo(info);
    // Update order distance if needed
    if (currentOrder && info && info.distance != null) { // Refined null check
      setCurrentOrder((prev: Order | null) => { // Explicitly type prev
        if (!prev) return null; // Return null if prev is null
        return {
          ...prev,
          distance: info.distance ? `${info.distance.toFixed(1)} km` : '0.0 km'
        };
      });
    }
  }, [currentOrder]);

  // Handle arrived at restaurant
  const handleArrived = useCallback(() => {
    setShowCustomerRoute(true);
    setDestination(customerLocation); // Using the defined constant
  }, [customerLocation]);

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <MapContainer
        mapRef={mapRef}
        region={region}
        location={location}
        errorMsg={errorMsg}
        destination={destination}
        onRouteInfo={handleRouteInfo}
        restaurantLocation={restaurantLocation}
        customerLocation={customerLocation}
        activeRoute={activeRoute}
      />
      
      <Header balance={balance} formatMoney={formatMoney} />
      
      <ControlPanel
        isConnected={isConnected}
        toggleConnection={() => setShowConnectionModal(true)}
        handleCenterMap={handleCenterMap}
      />
      
      <ConnectionModal
        visible={showConnectionModal}
        onClose={() => setShowConnectionModal(false)}
        autoAccept={autoAccept}
        setAutoAccept={setAutoAccept}
        isConnected={isConnected}
        toggleConnection={toggleConnection}
        setShowFavoritesModal={setShowFavoritesModal}
      />
      
      <OrderConfirmationModal
        visible={showOrderModal}
        onStart={handleStartOrder}
      />
      
      <OrderDetailsModal
        visible={showDetailsModal}
        onClose={handleCloseDetails}
        order={currentOrder}
        setShowFloatingButton={setShowFloatingButton}
        restaurantLocation={restaurantLocation} // Using the defined constant
        customerLocation={customerLocation} // Using the defined constant
        setActiveRoute={handleSetActiveRoute}
        onArrived={() => handleSetActiveRoute('customer')} // Updated to use handleSetActiveRoute
      />
      
      {showFloatingButton && currentOrder && (
        <TouchableOpacity
          className='absolute bottom-10 right-10 bg-[#00b14f] w-16 h-16 rounded-full items-center justify-center shadow-lg shadow-green-700/20'
          onPress={handleOpenDetailsModal}>
          <Text className='text-2xl text-white'>↖</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default App;