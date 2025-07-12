import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/pages/LandingPage.scss';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <Header />
      <main className="landing-page__content">
        <h1>Re Map</h1>
        <p>Create and share your itineraries.</p>
        <Link to="/create">
          <button className="landing-page__button">Create Itinerary</button>
        </Link>
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
