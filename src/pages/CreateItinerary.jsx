// src/pages/CreateItinerary.jsx
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MapCreator from '../components/MapCreator';
import SearchPanel from '../components/SearchPanel';
import '../styles/pages/CreateItinerary.scss';

function CreateItinerary() {
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const navigate = useNavigate();

  // Wrap in useCallback to prevent recreation
  const handleMapClick = useCallback(({ lng, lat }) => {
    setMarkers((prev) => {
      const newMarker = {
        id: Date.now(),
        lng,
        lat,
        name: `Point ${prev.length + 1}`,
      };
      return [...prev, newMarker];
    });
  }, []);

  // Wrap in useCallback
  const handleAddMarker = useCallback(({ lng, lat, name }) => {
    const newMarker = {
      id: Date.now(),
      lng,
      lat,
      name,
    };
    setMarkers((prev) => [...prev, newMarker]);
  }, []);

  // Wrap in useCallback
  const handleRemoveMarker = useCallback((id) => {
    setMarkers((prev) => prev.filter((m) => m.id !== id));
    setSelectedMarker((current) => (current?.id === id ? null : current));
  }, []);

  // Wrap in useCallback
  const handleMarkerClick = useCallback((marker) => {
    setSelectedMarker(marker);
    console.log('Marker clicked:', marker);
    alert(`${marker.name}\n\n This will open the marker's folder!`);
  }, []);

  const handleSaveTrip = ({ name, markers }) => {
    const trip = {
      id: Date.now(),
      name,
      markers,
      createdAt: new Date().toISOString(),
    };

    const trips = JSON.parse(localStorage.getItem('trips') || '[]');
    trips.push(trip);
    localStorage.setItem('trips', JSON.stringify(trips));

    alert(`Trip "${name}" saved!`);
    setMarkers([]);
    setSelectedMarker(null);
  };

  return (
    <div className="create-itinerary">
      <Header />
      <div className="create-itinerary__wrapper">
        <SearchPanel
          markers={markers}
          onAddMarker={handleAddMarker}
          onRemoveMarker={handleRemoveMarker}
          onSaveTrip={handleSaveTrip}
          selectedMarker={selectedMarker}
        />
        <main className="create-itinerary__map">
          <MapCreator 
            markers={markers} 
            onMapClick={handleMapClick}
            onMarkerClick={handleMarkerClick}
          />
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default CreateItinerary;