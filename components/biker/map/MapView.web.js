import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const WebMapView = React.forwardRef((props, ref) => {
  const { region, style, children } = props;
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = React.useRef(null);

  React.useImperativeHandle(ref, () => ({
    animateToRegion: (region) => {
      if (mapRef.current && window.google && window.google.maps) {
        const map = mapRef.current;
        map.panTo({ lat: region.latitude, lng: region.longitude });
        map.setZoom(Math.log2(360 / region.longitudeDelta) - 2);
      }
    },
  }));

  useEffect(() => {
    if (!window.googleMapsInitialized) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        window.googleMapsInitialized = true;
        setMapLoaded(true);
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
            fullscreenControl: false,
          });
          mapRef.current = map;
        }
      };
      document.head.appendChild(script);
    }
  }, []);

  useEffect(() => {
    if (mapRef.current && window.google && window.google.maps && typeof mapRef.current.panTo === 'function') {
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
          overflow: 'hidden',
        }}
      />
      {!mapLoaded && (
        <View style={styles.loadingOverlay}>
          <Text style={styles.webText}>Loading map...</Text>
        </View>
      )}
      {React.Children.map(children, (child) => {
        if (child && child.type && child.type.displayName === 'WebMarker') {
          return React.cloneElement(child, { map: mapRef.current });
        }
        return null;
      })}
    </View>
  );
});

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
  },
});

WebMapView.displayName = 'WebMapView';
export default WebMapView;