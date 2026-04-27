import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribeMessage, setSubscribeMessage] = useState('');

  const handleSubscribe = (event) => {
    event.preventDefault();
    setSubscribeMessage('');

    const normalized = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalized)) {
      setSubscribeMessage('Please enter a valid email address.');
      return;
    }

    const storageKey = 'gymease_subscribers';
    const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');

    if (existing.includes(normalized)) {
      setSubscribeMessage('You are already subscribed.');
      return;
    }

    localStorage.setItem(storageKey, JSON.stringify([...existing, normalized]));
    setEmail('');
    setSubscribeMessage('Subscribed successfully. You will receive updates soon.');
  };

  return (
    <footer className="bg-surface border-t border-white/5 pt-16 pb-8 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        
        {/* Brand */}
        <div className="col-span-1 md:col-span-1">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-primaryDark flex items-center justify-center">
              <svg className="w-4 h-4 text-background" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <span className="text-xl font-bold text-white">GymEase</span>
          </Link>
          <p className="text-textMuted text-sm line-clamp-3">
            Your premium platform to discover, compare, and connect with the best fitness facilities near you. Join the fitness revolution.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Platform</h3>
          <ul className="space-y-3">
            <li><Link to="/gyms" className="text-textMuted hover:text-primary transition-colors text-sm">Discover Gyms</Link></li>
            <li><Link to="/featured-locations" className="text-textMuted hover:text-primary transition-colors text-sm">Featured Locations</Link></li>
            <li><Link to="/partner" className="text-textMuted hover:text-primary transition-colors text-sm">Partner with us</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-white font-semibold mb-4">Support</h3>
          <ul className="space-y-3">
            <li><Link to="/contact" className="text-textMuted hover:text-primary transition-colors text-sm">Help Center</Link></li>
            <li><Link to="/contact" className="text-textMuted hover:text-primary transition-colors text-sm">Contact Us</Link></li>
            <li><span className="text-textMuted hover:text-primary transition-colors text-sm cursor-pointer">Privacy Policy</span></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-white font-semibold mb-4">Stay Updated</h3>
          <p className="text-textMuted text-sm mb-4">Subscribe for the latest fitness trends and new gym alerts.</p>
          <form className="flex gap-2" onSubmit={handleSubscribe}>
            <input 
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surfaceLight border border-white/10 rounded-lg px-3 py-2 text-sm text-textMain focus:outline-none focus:border-primary"
            />
            <button 
              type="submit"
              className="bg-primary text-background px-4 py-2 rounded-lg text-sm font-medium hover:bg-primaryDark transition-colors"
            >
              Subscribe
            </button>
          </form>
          {subscribeMessage && <p className="text-xs mt-2 text-primary">{subscribeMessage}</p>}
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-textMuted">
        <p>&copy; {new Date().getFullYear()} GymEase. All rights reserved.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <span className="cursor-pointer hover:text-primary">Twitter</span>
          <span className="cursor-pointer hover:text-primary">Instagram</span>
          <span className="cursor-pointer hover:text-primary">LinkedIn</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
