import React, { useEffect, useRef } from 'react';
import { Platform } from 'react-native';

const MapViewDirections = (props) => {
  const { origin, destination, apikey, strokeWidth, strokeColor, onReady, onError, mode } = props;
  const directionsRef = useRef(null);

  useEffect(() => {
    if (Platform.OS !== 'web' || !window.google || !window.google.maps) {
      return;
    }

    // Initialize Directions Service
    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer({
      polylineOptions: {
        strokeColor: strokeColor || '#0000FF',
        strokeWeight: strokeWidth || 5,
      },
      suppressMarkers: true, // Markers are handled by Marker component
    });

    directionsRef.current = directionsRenderer;

    // Calculate route
    directionsService.route(
      {
        origin: { lat: origin.latitude, lng: origin.longitude },
        destination: { lat: destination.latitude, lng: destination.longitude },
        travelMode: mode === 'DRIVING' ? window.google.maps.TravelMode.DRIVING : window.google.maps.TravelMode.WALKING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          directionsRenderer.setDirections(result);

          // Calculate distance and duration
          const route = result.routes[0].legs[0];
          const distance = route.distance.value / 1000; // Convert meters to kilometers
          const duration = route.duration.value / 60; // Convert seconds to minutes

          // Call onReady with the same format as react-native-maps-directions
          if (onReady) {
            onReady({
              distance,
              duration,
              coordinates: route.steps.flatMap((step) =>
                step.path.map((point) => ({
                  latitude: point.lat(),
                  longitude: point.lng(),
                }))
              ),
            });
          }
        } else {
          if (onError) {
            onError(`Directions request failed: ${status}`);
          }
          console.error('Directions request failed:', status);
        }
      }
    );

    // Clean up
    return () => {
      if (directionsRenderer) {
        directionsRenderer.setMap(null);
      }
    };
  }, [origin, destination, strokeWidth, strokeColor, mode, apikey, onReady, onError]);

  // Set the map for the renderer when the map is available
  useEffect(() => {
    if (directionsRef.current && props.map) {
      directionsRef.current.setMap(props.map);
    }
  }, [props.map]);

  return null; // No UI component, as the renderer handles drawing
};

MapViewDirections.displayName = 'WebMapViewDirections';
export default MapViewDirections;