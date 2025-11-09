import mapboxgl from 'mapbox-gl';
import { useEffect, useRef } from 'react';
import '../styles/components/MapCreator.scss';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
if (!mapboxgl.accessToken) throw new Error('VITE_MAPBOX_TOKEN is required');

export default function MapCreator({ markers = [], onMapClick, onMarkerClick }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markerRefs = useRef([]);

  // Initialize map once
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-3.7038, 40.4168],
      zoom: 6,
    });

    const handleClick = (e) => {
      const { lng, lat } = e.lngLat;
      onMapClick?.({ lng, lat });
    };
    map.current.on('click', handleClick);

    return () => {
      map.current?.off('click', handleClick);
      map.current?.remove();
      map.current = null;
    };
  }, [onMapClick]);

  // Draw/update markers
  useEffect(() => {
    if (!map.current) return;

    // Remove old markers
    markerRefs.current.forEach((m) => m.remove());
    markerRefs.current = [];

    // Add new markers
    markers.forEach((marker) => {
      // Create default Mapbox marker (red pin style)
      const markerElement = new mapboxgl.Marker({
        color: '#28a745',
        draggable: false,
      })
        .setLngLat([marker.lng, marker.lat])
        .addTo(map.current);

      // Get the marker DOM element and add click listener
      const markerDom = markerElement.getElement();
      markerDom.style.cursor = 'pointer';
      
      markerDom.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevents map click event
        onMarkerClick?.(marker);
      });

      markerRefs.current.push(markerElement);
    });

    return () => {
      markerRefs.current.forEach((m) => m.remove());
      markerRefs.current = [];
    };
  }, [markers, onMarkerClick]);

  return <div ref={mapContainer} className="map-container" />;
}