import mapboxgl from 'mapbox-gl';
import { useEffect, useRef } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../styles/components/MapCreator.scss';


mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
console.log('MAPBOX TOKEN →', import.meta.env.VITE_MAPBOX_TOKEN);


function MapCreator({ markers, onMapClick }) {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (!map.current && mapContainer.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-3.7038, 40.4168],
        zoom: 6,
      });

      map.current.on('click', (e) => {
        const { lng, lat } = e.lngLat;
        onMapClick({ lat, lng });
      });

      // Agregar marcadores
      markers.forEach((marker) => {
        new mapboxgl.Marker()
          .setLngLat([marker.lng, marker.lat])
          .addTo(map.current);
      });
    }
  }, [markers]);

  return <div ref={mapContainer} className="map-container"></div>;
}

export default MapCreator;
