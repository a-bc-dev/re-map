import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import CreateItinerary from './pages/CreateItinerary'
import ItineraryDetail from './pages/ItineraryDetail'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/create" element={<CreateItinerary />} />
      <Route path="/detail" element={<ItineraryDetail />} />
    </Routes>
  )
}

export default App
