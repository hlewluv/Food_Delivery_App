import React, { useEffect } from 'react';
import { StyleSheet, Platform } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

// Goong Maps style URL
const GOONG_STYLE_URL = 'https://tiles.goong.io/assets/goong_map_web.json';

const NativeMapView = React.forwardRef((props, ref) => {
  const {
    children,
    style,
    region,
    showsUserLocation = false,
    showsMyLocationButton = false,
    followsUserLocation = false,
    ...rest
  } = props;

  return (
    <MapView
      ref={ref}
      style={style}
      provider={PROVIDER_GOOGLE}
      initialRegion={region}
      showsUserLocation={showsUserLocation}
      showsMyLocationButton={showsMyLocationButton}
      followsUserLocation={followsUserLocation}
      customMapStyle={[
        {
          "featureType": "all",
          "elementType": "labels.text.fill",
          "stylers": [{"color": "#7c93a3"},{"lightness": "-10"}]
        },
        {
          "featureType": "administrative.country",
          "elementType": "geometry",
          "stylers": [{"visibility": "on"}]
        },
        {
          "featureType": "administrative.country",
          "elementType": "geometry.stroke",
          "stylers": [{"color": "#a0a0a0"}]
        },
        {
          "featureType": "administrative.province",
          "elementType": "geometry.stroke",
          "stylers": [{"color": "#a0a0a0"}]
        },
        {
          "featureType": "landscape",
          "elementType": "geometry.fill",
          "stylers": [{"color": "#f5f5f5"}]
        },
        {
          "featureType": "road",
          "elementType": "geometry.fill",
          "stylers": [{"color": "#ffffff"}]
        },
        {
          "featureType": "road",
          "elementType": "geometry.stroke",
          "stylers": [{"color": "#e0e0e0"}]
        },
        {
          "featureType": "water",
          "elementType": "geometry.fill",
          "stylers": [{"color": "#e0e0e0"}]
        }
      ]}
      {...rest}
    >
      {children}
    </MapView>
  );
});

NativeMapView.displayName = 'NativeMapView';
export default NativeMapView;