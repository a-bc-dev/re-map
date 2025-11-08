import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/pages/CreateItinerary.scss';
import MapCreator from '../components/MapCreator';
import { useState } from 'react';


function CreateItinerary() {
  const [markers, setMarkers] = useState([]);

  const handleMapClick = ({ lng, lat }) => {
    setMarkers((prev) => [...prev, { id: Date.now(), lng, lat }]);
  };
  return (
    <div className="create-itinerary">
      <Header />
      <div className="create-itinerary__wrapper">
        <aside className="create-itinerary__panel">
          <h2>Search Address</h2>
          <p>Marcadores: {markers.length}</p>
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

  