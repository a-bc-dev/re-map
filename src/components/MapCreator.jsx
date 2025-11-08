import mapboxgl from 'mapbox-gl';
import { useEffect, useRef } from 'react';
import '../styles/components/MapCreator.scss';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
if (!mapboxgl.accessToken) throw new Error('VITE_MAPBOX_TOKEN is required');

export default function MapCreator({ markers = [], onMapClick }) {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const markerRefs = useRef([]);

    // Inicializa el mapa una sola vez
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-3.7038, 40.4168], // Madrid
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
  }, []);

  // Dibuja/actualiza marcadores
  useEffect(() => {
    if (!map.current) return;

    markerRefs.current.forEach((m) => m.remove());
    markerRefs.current = [];

    markers.forEach(({ lng, lat }) => {
      const m = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map.current);
      markerRefs.current.push(m);
    });

    return () => {
      markerRefs.current.forEach((m) => m.remove());
      markerRefs.current = [];
    };
  }, [markers]);

  return <div ref={mapContainer} className="map-container" />;
}