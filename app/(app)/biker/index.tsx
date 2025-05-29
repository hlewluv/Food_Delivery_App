import React, { useEffect, useState, useRef, useCallback } from 'react';
import { SafeAreaView, Platform, TouchableOpacity, Text, Alert } from 'react-native';
import Header from '@/components/biker/ui/Header';
import ControlPanel from '@/components/biker/ui/ControlPanel';
import ConnectionModal from '@/components/biker/ui/ConnectionModal';
import MapContainer from '@/components/biker/ui/MapContainer';
import OrderConfirmationModal from '@/components/biker/ui/order/OrderConfirmationModal';
import OrderDetailsModal from '@/components/biker/ui/order/OrderDetailsModal';

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

const Location = Platform.OS === 'web' ? mockLocation : require('expo-location');

const initialOrder = {
  id: 'A125',
  restaurant: {
    name: 'Phở 24',
    address: '123 Lê Lợi, Quận 1, Ho Chi Minh City, 700000',
  },
  customer: {
    name: 'Khách B',
    address: '456 Trần Hưng Đạo, Quận 5, Ho Chi Minh City, 700000',
  },
  biker: {
    name: 'Muncher B',
  },
  time: '00:20',
  date: '2025-05-22',
  items: [
    {
      id: 'd31df791-fbe8-4e44-b18d-c2bc0e344e8a',
      food_name: 'Gà Viên',
      food_type: 'Chicken',
      price: 55000,
      image: 'http://res.cloudinary.com/dlxnanybw/image/upload/v1746507726/khriyj80pgpnoggcbnax.png',
      description: '',
      time: '00:00:05',
      option_menu: [],
    },
    {
      id: '773ad024-c9bf-414c-844b-314103f8f594',
      food_name: 'Gà Chiên Xù',
      food_type: 'Chicken',
      price: 45000,
      image: 'http://res.cloudinary.com/dlxnanybw/image/upload/v1746507714/ea2rybpeyybnyrocvgze.webp',
      description: '',
      time: '00:00:05',
      option_menu: [],
    },
    {
      id: 'ec79fe39-ac15-41f1-bdc1-fbc878249a4c',
      food_name: 'Soda',
      food_type: 'Drink',
      price: 30000,
      image: 'http://res.cloudinary.com/dlxnanybw/image/upload/v1746946439/fyfikmlvr7adh8mqzlh6.jpg',
      description: 'Coca Cola very good',
      time: '00:00:10',
      option_menu: [['Đá', 'Không đá'], ['Lớn', 'Nhỏ']],
    },
  ],
  total: 130000,
  status: 'Chờ nhận',
  paymentMethod: 'Tiền mặt',
  distance: '0.5 km',
  earnings: 24500,
};

const App = () => {
  // State management
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [balance, setBalance] = useState(3000000);
  const [isConnected, setIsConnected] = useState(true);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [autoAccept, setAutoAccept] = useState(false);
  const [region, setRegion] = useState({
    latitude: 16.0738,
    longitude: 108.1874,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const [destination, setDestination] = useState(null);
  const [routeInfo, setRouteInfo] = useState({ distance: null, duration: null });
  const mapRef = useRef(null);

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
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Quyền truy cập vị trí bị từ chối');
        return null;
      }

      return await Location.getCurrentPositionAsync({
        accuracy: Platform.OS === 'web' ? null : Location.Accuracy.High,
      });
    } catch (error) {
      setErrorMsg('Không thể lấy vị trí hiện tại');
      console.error(error);
      return null;
    }
  }, []);

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
    if (location && mapRef.current) {
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
      setCurrentOrder(null);
      setShowFloatingButton(false);
      setDestination(null);
    } else if (!currentOrder) {
      setCurrentOrder(initialOrder);
      setShowOrderModal(true);
    }
    setShowConnectionModal(false);
  }, [isConnected, currentOrder]);

  // Start order handler
  const handleStartOrder = useCallback(() => {
    setShowOrderModal(false);
    setShowDetailsModal(true);
    setShowFloatingButton(false);
    setDestination(MapContainer.restaurantLocation);
  }, []);

  // Close order details
  const handleCloseDetails = useCallback(() => {
    setShowDetailsModal(false);
    setCurrentOrder(null);
    setShowFloatingButton(true);
    setDestination(null);
  }, []);

  // Open order details
  const handleOpenDetailsModal = useCallback(() => {
    setShowFloatingButton(false);
    setShowDetailsModal(true);
  }, []);

  // Set route destination
  const handleSetRouteDestination = useCallback((dest) => {
    if (!dest) return;
    
    setDestination(dest);
    
    // Auto-center map to show the route
    if (location && mapRef.current) {
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
  const handleRouteInfo = useCallback((info) => {
    setRouteInfo(info);
    // Update order distance if needed
    if (currentOrder && info.distance) {
      setCurrentOrder(prev => ({
        ...prev,
        distance: `${info.distance.toFixed(1)} km`
      }));
    }
  }, [currentOrder]);

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <MapContainer
        mapRef={mapRef}
        region={region}
        location={location}
        errorMsg={errorMsg}
        onSetRouteDestination={handleSetRouteDestination}
        destination={destination}
        onRouteInfo={handleRouteInfo}
      />
      
      <Header balance={balance} formatMoney={formatMoney} />
      
      <ControlPanel
        isConnected={isConnected}
        toggleConnection={() => setShowConnectionModal(true)}
        handleCenterMap={handleCenterMap}
        requestNewOrder={requestNewOrder}
      />
      
      <ConnectionModal
        visible={showConnectionModal}
        onClose={() => setShowConnectionModal(false)}
        autoAccept={autoAccept}
        setAutoAccept={setAutoAccept}
        isConnected={isConnected}
        toggleConnection={toggleConnection}
      />
      
      <OrderConfirmationModal
        visible={showOrderModal}
        onStart={handleStartOrder}
        order={currentOrder}
      />
      
      <OrderDetailsModal
        visible={showDetailsModal}
        onClose={handleCloseDetails}
        order={currentOrder}
        setShowFloatingButton={setShowFloatingButton}
        restaurantLocation={MapContainer.restaurantLocation}
        customerLocation={MapContainer.customerLocation}
        setRouteDestination={handleSetRouteDestination}
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