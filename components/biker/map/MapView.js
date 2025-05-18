// MapView.js
import React, { useEffect, useState } from 'react';
import { Platform, View, Text, StyleSheet } from 'react-native';

// Marker.js will be imported after MapView definition
// to avoid circular dependencies

// Web-friendly Google Maps component
const WebMapView = React.forwardRef((props, ref) => {
  const { region, style, children } = props;
  const [mapLoaded, setMapLoaded] = useState(false);
  
  // Create a ref to hold the map instance
  const mapRef = React.useRef(null);
  
  // Expose the map ref to parent components
  React.useImperativeHandle(ref, () => ({
    animateToRegion: (region) => {
      if (mapRef.current && window.google && window.google.maps) {
        const map = mapRef.current;
        map.panTo({ lat: region.latitude, lng: region.longitude });
        map.setZoom(Math.log2(360 / region.longitudeDelta) - 2);
      }
    }
  }));
  
  useEffect(() => {
    // Initialize Google Maps when component mounts
    if (Platform.OS === 'web' && !window.googleMapsInitialized) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        window.googleMapsInitialized = true;
        setMapLoaded(true);
        
        // Initialize the map
        if (mapRef.current) {
          const map = new window.google.maps.Map(mapRef.current, {
            center: { lat: region.latitude, lng: region.longitude },
            zoom: Math.log2(360 / region.longitudeDelta) - 2,
            mapTypeId: window.google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: true,
            zoomControl: true,
            mapTypeControl: false,
            scaleControl: true,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: false
          });
          
          // Store the map instance for later use
          mapRef.current = map;
        }
      };
      
      document.head.appendChild(script);
    }
  }, []);
  
  useEffect(() => {
    // Update map when region changes
    if (Platform.OS === 'web' && mapRef.current && window.google && window.google.maps && typeof mapRef.current.panTo === 'function') {
      mapRef.current.panTo({ lat: region.latitude, lng: region.longitude });
    }
  }, [region]);

  return (
    <View style={[styles.webContainer, style]}>
      <div 
        ref={mapRef} 
        style={{ 
          width: '100%', 
          height: '100%', 
          borderRadius: '8px',
          overflow: 'hidden' 
        }}
      />
      {!mapLoaded && (
        <View style={styles.loadingOverlay}>
          <Text style={styles.webText}>Loading map...</Text>
        </View>
      )}
      {React.Children.map(children, child => {
        // Render only children that are compatible with web
        if (child && child.type && child.type.displayName === 'WebMarker') {
          return React.cloneElement(child, { map: mapRef.current });
        }
        return null;
      })}
    </View>
  );
});

// Main MapView component with platform-specific implementation
const MapView = React.forwardRef((props, ref) => {
  const {
    children,
    style,
    region,
    showsUserLocation = false,
    showsMyLocationButton = false,
    followsUserLocation = false,
    provider,
    ...rest
  } = props;

  // For web platform
  if (Platform.OS === 'web') {
    return (
      <WebMapView
        ref={ref}
        region={region}
        style={style}
        {...rest}
      >
        {children}
      </WebMapView>
    );
  }

  // For native platforms - dynamically import react-native-maps
  try {
    // Use dynamic import to avoid the "required cyclically" error
    const RNMapView = require('react-native-maps').default;
    const PROVIDER_GOOGLE = require('react-native-maps').PROVIDER_GOOGLE;

    return (
      <RNMapView
        ref={ref}
        style={style}
        region={region}
        provider={provider === 'PROVIDER_GOOGLE' ? PROVIDER_GOOGLE : undefined}
        showsUserLocation={showsUserLocation}
        showsMyLocationButton={showsMyLocationButton}
        followsUserLocation={followsUserLocation}
        {...rest}
      >
        {children}
      </RNMapView>
    );
  } catch (error) {
    console.error('Error loading react-native-maps:', error);
    return (
      <View style={[styles.webContainer, style]}>
        <Text style={styles.webText}>Không thể tải bản đồ. Vui lòng thử lại sau.</Text>
      </View>
    );
  }
});

// StyleSheet for the component
const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    overflow: 'hidden',
  },
  webText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 245, 245, 0.8)',
  }
});

MapView.displayName = 'MapView';
export default MapView;