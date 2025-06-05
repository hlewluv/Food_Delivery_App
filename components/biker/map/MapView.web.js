import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

// Goong Maps style URL
const GOONG_STYLE_URL = 'https://tiles.goong.io/assets/goong_map_web.json';

const WebMapView = React.forwardRef((props, ref) => {
  const {
    children,
    style,
    region,
    showsUserLocation = false,
    ...rest
  } = props;

  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: GOONG_STYLE_URL,
      center: [region.longitude, region.latitude],
      zoom: 15
    });

    // Cleanup on unmount
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update map center when region changes
  useEffect(() => {
    if (map.current) {
      map.current.flyTo({
        center: [region.longitude, region.latitude],
        essential: true
      });
    }
  }, [region]);

  // Expose map instance through ref
  React.useImperativeHandle(ref, () => ({
    current: map.current
  }));

  return (
    <div ref={mapContainer} style={style}>
      {children}
    </div>
  );
});

WebMapView.displayName = 'WebMapView';
export default WebMapView;