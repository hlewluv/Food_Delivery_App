import React from 'react';
import { Marker as RNMarker } from 'react-native-maps';

const NativeMarker = (props) => {
  return <RNMarker {...props} />;
};

NativeMarker.displayName = 'NativeMarker';
export default NativeMarker;