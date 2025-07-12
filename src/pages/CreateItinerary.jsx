import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/pages/CreateItinerary.scss';

function CreateItinerary() {
  return (
    <div className="create-itinerary">
      <Header />
      <div className="create-itinerary__wrapper">
        <aside className="create-itinerary__panel">
          <h2>Search Address</h2>
          <p>Here will go AddressSearch and MarkerForm.</p>
        </aside>
        <main className="create-itinerary__map">
          <p>Map placeholder</p>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default CreateItinerary;

  