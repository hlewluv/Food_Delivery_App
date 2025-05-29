import React, { useEffect, useState, useRef } from 'react';
import { SafeAreaView, Platform } from 'react-native';
import Header from '@/components/biker/ui/Header';
import ControlPanel from '@/components/biker/ui/ControlPanel';
import ConnectionModal from '@/components/biker/ui/ConnectionModal';
import FavoritesModal from '@/components/biker/ui/FavoritesModal';
import MapContainer from '@/components/biker/ui/MapContainer';

// Mock Location for web
const mockLocation = {
  requestForegroundPermissionsAsync: async () => ({ status: 'granted' }),
  getCurrentPositionAsync: async () => ({
    coords: {
      latitude: 16.0738, // Approximate center of Đà Nẵng for mock
      longitude: 108.1874,
      accuracy: 10,
      altitude: 0,
      altitudeAccuracy: 0,
      heading: 0,
      speed: 0
    }
  })
};

const Location = Platform.OS === 'web' ? mockLocation : require('expo-location');

const App = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [balance, setBalance] = useState(3000000);
  const [isConnected, setIsConnected] = useState(false);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  const [autoAccept, setAutoAccept] = useState(false);
  const [region, setRegion] = useState({
    latitude: 16.0738, // Center of Đà Nẵng
    longitude: 108.1874,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1
  });
  const [favorites] = useState([
    { id: 1, name: 'Nhà riêng', address: '123 Đường ABC, Quận 1' },
    { id: 2, name: 'Công ty', address: '456 Đường XYZ, Quận 3' },
    { id: 3, name: 'Trung tâm mua sắm', address: '789 Đường LMN, Quận 5' }
  ]);
  const mapRef = useRef(null);

  const formatMoney = amount => {
    if (amount >= 1000000) {
      const millions = amount / 1000000;
      return millions % 1 === 0 ? `${millions.toFixed(0)}M` : `${millions.toFixed(1)}M`;
    } else if (amount >= 1000) {
      const thousands = amount / 1000;
      return thousands % 1 === 0 ? `${thousands.toFixed(0)}k` : `${thousands.toFixed(1)}k`;
    }
    return amount.toString();
  };

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Quyền truy cập vị trí bị từ chối');
          return;
        }

        let loc = await Location.getCurrentPositionAsync({
          accuracy: Platform.OS === 'web' ? null : Location.Accuracy.High
        });

        setLocation(loc.coords);

        // Define all locations
        const locations = [
          { latitude: loc.coords.latitude, longitude: loc.coords.longitude }, // Biker
          { latitude: 16.0740, longitude: 108.1498 }, // Restaurant
          { latitude: 16.0736, longitude: 108.2250 } // Customer
        ];

        // Calculate min/max for latitude and longitude
        const latitudes = locations.map(loc => loc.latitude);
        const longitudes = locations.map(loc => loc.longitude);
        const minLat = Math.min(...latitudes);
        const maxLat = Math.max(...latitudes);
        const minLng = Math.min(...longitudes);
        const maxLng = Math.max(...longitudes);

        // Calculate center and deltas
        const centerLat = (minLat + maxLat) / 2;
        const centerLng = (minLng + maxLng) / 2;
        const latDelta = (maxLat - minLat) * 1.5 || 0.1; // Add padding, fallback to 0.1
        const lngDelta = (maxLng - minLng) * 1.5 || 0.1;

        setRegion({
          latitude: centerLat,
          longitude: centerLng,
          latitudeDelta: latDelta,
          longitudeDelta: lngDelta
        });
      } catch (error) {
        setErrorMsg('Không thể lấy vị trí hiện tại');
        console.error(error);
      }
    })();
  }, []);

  const handleCenterMap = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1
      });
    }
  };

  const toggleConnection = () => {
    setIsConnected(!isConnected);
    if (isConnected) {
      setAutoAccept(false);
    }
    setShowConnectionModal(false);
  };

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <MapContainer
        mapRef={mapRef}
        region={region}
        location={location}
        errorMsg={errorMsg}
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
      <FavoritesModal
        visible={showFavoritesModal}
        onClose={() => setShowFavoritesModal(false)}
        favorites={favorites}
      />
    </SafeAreaView>
  );
};

export default App;