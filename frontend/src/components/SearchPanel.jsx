import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import '../styles/components/SearchPanel.scss';

const TrashIcon = () => (
    <svg 
      width="18" 
      height="18" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      <line x1="10" y1="11" x2="10" y2="17"></line>
      <line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>
  );

export default function SearchPanel({ markers, onAddMarker, onRemoveMarker, onSaveTrip }) {
  const [tripName, setTripName] = useState('');
  const geocoderContainer = useRef(null);        // Contenedor donde se monta el widget
  const geocoderRef = useRef(null);              // Instancia única del geocoder

  useEffect(() => {
    const container = geocoderContainer.current;
    if (!container) return;

    // If it already exists, don’t recreate it.
    if (geocoderRef.current) return;

    // Clean up any visual residue that might be left.
    container.innerHTML = '';

    const geocoder = new MapboxGeocoder({
      accessToken: import.meta.env.VITE_MAPBOX_TOKEN,
      mapboxgl,
      marker: false,
      language: 'en',
      placeholder: 'Search for an address…',
    });

    const handleResult = (e) => {
      const { center, place_name } = e.result || {};
      if (!center || center.length < 2) return;
      const [lng, lat] = center;
      onAddMarker?.({ lng, lat, name: place_name });
      // Clear the field after adding.
      setTimeout(() => geocoder.clear(), 100);
    };

    geocoder.addTo(container);
    geocoder.on('result', handleResult);
    geocoderRef.current = geocoder;

    return () => {
      try {
        geocoder.off('result', handleResult);
        geocoder.clear(); // cleans up input and internal events
        // The widget creates a .mapboxgl-ctrl-geocoder div inside the container:
        const geocoderElement = container.querySelector('.mapboxgl-ctrl-geocoder');
        geocoderElement?.remove();
      } catch (_) {
        // prevents breaking the unmount if it’s already been cleaned up
      } finally {
        geocoderRef.current = null;
        // Ensures the container is empty
        if (container) container.innerHTML = '';
      }
    };
  }, []); // only once (in StrictMode it mounts/unmounts twice, but the guard handles it)

  const handleSave = () => {
    if (!tripName.trim()) return alert('Please enter a trip name');
    if (!markers?.length) return alert('Add at least one destination');
    onSaveTrip?.({ name: tripName.trim(), markers });
  };

  return (
    <aside className="search-panel">
      <div className="search-panel__header">
        <h2>Create Your Itinerary</h2>
      </div>

      <div className="search-panel__trip-name">
        <label htmlFor="trip-name">Trip Name</label>
        <input
          id="trip-name"
          type="text"
          placeholder="E.g., European Adventure"
          value={tripName}
          onChange={(e) => setTripName(e.target.value)}
          maxLength={50}
        />
      </div>

      <div className="search-panel__geocoder">
        <label>Search Destination</label>
        <div ref={geocoderContainer} className="geocoder-wrapper" />
      </div>

      <div className="search-panel__markers">
        <h3>
          Destinations ({markers.length})
          {!!markers.length && (
            <button
              className="search-panel__clear-all"
              onClick={() => {
                if (confirm('Remove all destinations?')) {
                  markers.forEach(m => onRemoveMarker?.(m.id));
                }
              }}
            >
              Clear All
            </button>
          )}
        </h3>

        {!markers.length ? (
          <p className="search-panel__empty">
            Click on the map or search for an address to add destinations
          </p>
        ) : (
          <ul className="search-panel__markers-list">
            {markers.map((marker, i) => (
              <li key={marker.id} className="marker-item">
                <span className="marker-item__number">{i + 1}</span>
                <div className="marker-item__content">
                  <p className="marker-item__name">{marker.name || `Point ${i + 1}`}</p>
                  <p className="marker-item__coords">
                    {marker.lat.toFixed(4)}, {marker.lng.toFixed(4)}
                  </p>
                </div>
                <button
                  className="marker-item__delete"
                  onClick={() => onRemoveMarker?.(marker.id)}
                  aria-label="Remove marker"
                >
                  <TrashIcon />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        className="search-panel__save-btn"
        onClick={handleSave}
        disabled={!tripName.trim() || !markers.length}
      >
        Save Trip
      </button>
    </aside>
  );
}
