import React from 'react';
import { StyleSheet } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

const NativeMapView = React.forwardRef((props, ref) => {
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

  return (
    <MapView
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
    </MapView>
  );
});

NativeMapView.displayName = 'NativeMapView';
export default NativeMapView;