import { Route, Routes } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Discovery/Home';
import FindGyms from './pages/Discovery/FindGyms';
import GymProfile from './pages/Discovery/GymProfile';
import Contact from './pages/Features/Contact';
import TrialCheckout from './pages/Features/TrialCheckout';
import GymComparison from './pages/Features/GymComparison';
import FeaturedLocations from './pages/Discovery/FeaturedLocations';
import PartnerOnboarding from './pages/Auth/PartnerOnboarding';
import HealthCoachBot from './components/common/HealthCoachBot';

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
          <Route path="/compare-gyms" element={<GymComparison />} />
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
