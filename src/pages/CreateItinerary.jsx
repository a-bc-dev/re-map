import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MapCreator from '../components/MapCreator';
import '../styles/pages/CreateItinerary.scss';

function CreateItinerary() {
  const [markers, setMarkers] = useState([]);

  const handleMapClick = (latlng) => {
    const newMarker = {
      id: Date.now(),
      lat: latlng.lat,
      lng: latlng.lng,
      name: 'Marker from click',
    };
    setMarkers((prev) => [...prev, newMarker]);
  };
  return (
    <div className="create-itinerary">
      <Header />
      <div className="create-itinerary__wrapper">
        <aside className="create-itinerary__panel">
          <h2>Search Address</h2>
        </aside>
        <main className="create-itinerary__map">
        <MapCreator markers={markers} onMapClick={handleMapClick} />
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default CreateItinerary;

  