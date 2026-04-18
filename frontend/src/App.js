import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import FindGyms from './pages/FindGyms';
import GymProfile from './pages/GymProfile';
import Contact from './pages/Contact';
import TrialCheckout from './pages/TrialCheckout';
import FeaturedLocations from './pages/FeaturedLocations';
import PartnerOnboarding from './pages/PartnerOnboarding';
import HealthCoachBot from './components/HealthCoachBot';

function App() {
  return (
    <div className="app-shell bg-background min-h-screen text-textMain selection:bg-primary/30">
      <Navbar />
      <main className="container-main flex-grow pt-24 pb-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gyms" element={<FindGyms />} />
          <Route path="/featured-locations" element={<FeaturedLocations />} />
          <Route path="/partner" element={<PartnerOnboarding />} />
          <Route path="/gyms/:gymId" element={<GymProfile />} />
          <Route path="/gyms/:gymId/trial-checkout" element={<TrialCheckout />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
      <HealthCoachBot />
    </div>
  );
}

export default App;
