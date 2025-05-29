import React, { useEffect, useRef } from 'react';

const WebMarker = (props) => {
  const { coordinate, title, map } = props;
  const markerRef = useRef(null);

  useEffect(() => {
    if (map && window.google && window.google.maps && !markerRef.current) {
      markerRef.current = new window.google.maps.Marker({
        position: { lat: coordinate.latitude, lng: coordinate.longitude },
        map: map,
        title: title || '',
        animation: window.google.maps.Animation.DROP,
      });
    }

    if (markerRef.current && coordinate) {
      markerRef.current.setPosition({
        lat: coordinate.latitude,
        lng: coordinate.longitude,
      });
    }

    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
    };
  }, [map, coordinate, title]);

  return null;
};

WebMarker.displayName = 'WebMarker';
export default WebMarker;