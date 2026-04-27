import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from '../common/ui/Button';
import AuthModal from '../common/AuthModal';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const { user, logout, loading } = useAuth();

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const openAuth = (mode) => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      // no-op for now
    }
  };

  const isActive = (path) => {
    return location.pathname === path
      ? 'text-white bg-white/10 border border-white/15'
      : 'text-textMuted hover:text-white border border-transparent';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 pt-3">
      <div className="max-w-7xl mx-auto rounded-2xl border border-white/10 bg-background/70 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
        <div className="flex justify-between items-center h-16 px-4 sm:px-6">
        {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-md bg-primary text-white flex items-center justify-center font-black italic text-xl transform -skew-x-12 shadow-[0_0_18px_rgba(244,63,94,0.45)]">
              G
            </div>
            <span className="text-xl font-black tracking-tighter text-white uppercase italic">GymEase</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-2 font-bold uppercase tracking-wide text-sm">
            <Link to="/" className={`px-3 py-2 rounded-lg transition-colors duration-200 ${isActive('/')}`}>Home</Link>
            <Link to="/gyms" className={`px-3 py-2 rounded-lg transition-colors duration-200 ${isActive('/gyms')}`}>Gyms</Link>
            <Link to="/contact" className={`px-3 py-2 rounded-lg transition-colors duration-200 ${isActive('/contact')}`}>Contact</Link>
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            {!loading && user ? (
              <>
                <span className="text-sm text-textMuted hidden lg:block">
                  Hi, <span className="text-white font-semibold">{user.displayName || user.email?.split('@')[0] || 'Athlete'}</span>
                </span>
                <Button variant="ghost" size="sm" className="font-bold" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" className="font-bold" onClick={() => openAuth('login')}>Login</Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="shadow-[0_0_18px_rgba(244,63,94,0.35)]"
                  onClick={() => openAuth('signup')}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white hover:text-primary focus:outline-none"
            aria-label="Toggle menu"
            aria-expanded={isMobileOpen}
            onClick={() => setIsMobileOpen((prev) => !prev)}
          >
            {isMobileOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${isMobileOpen ? 'max-h-72 border-t border-white/10' : 'max-h-0'}`}>
          <div className="px-4 py-4 space-y-3">
            <Link to="/" className={`block px-3 py-2 rounded-lg text-sm font-bold uppercase tracking-wide ${isActive('/')}`}>Home</Link>
            <Link to="/gyms" className={`block px-3 py-2 rounded-lg text-sm font-bold uppercase tracking-wide ${isActive('/gyms')}`}>Gyms</Link>
            <Link to="/contact" className={`block px-3 py-2 rounded-lg text-sm font-bold uppercase tracking-wide ${isActive('/contact')}`}>Contact</Link>

            <div className="pt-2 grid grid-cols-2 gap-2">
              {!loading && user ? (
                <Button variant="ghost" size="sm" className="w-full col-span-2" onClick={handleLogout}>Logout</Button>
              ) : (
                <>
                  <Button variant="ghost" size="sm" className="w-full" onClick={() => openAuth('login')}>Login</Button>
                  <Button variant="primary" size="sm" className="w-full" onClick={() => openAuth('signup')}>Sign Up</Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={isAuthOpen}
        initialMode={authMode}
        onClose={() => setIsAuthOpen(false)}
      />
    </nav>
  );
};

export default Navbar;
