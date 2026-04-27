import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/ui/Button';

const Home = () => {
  return (
    <div className="flex flex-col gap-16 pb-20 animate-fade-in w-full max-w-none">
      
      {/* Full-bleed Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center text-center -mx-4 sm:-mx-6 lg:-mx-8 mt-[-2rem]">
        {/* Background Image with Heavy Dark Overlay */}
        <div className="absolute inset-0 z-0 bg-background">
          <img 
            src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=2000" 
            alt="Intense Gym Workout" 
            className="w-full h-full object-cover opacity-40 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
        </div>
        
        <div className="relative z-10 px-4 max-w-5xl mx-auto space-y-6">
          <div className="inline-block px-4 py-1.5 bg-primary text-white font-black uppercase tracking-widest text-xs transform -skew-x-12 mb-4">
            No Excuses. Only Results.
          </div>
          
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white uppercase tracking-tighter leading-none italic">
            Dominate <br className="hidden md:block"/> 
            <span className="text-primary">Your Goals</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto font-medium py-6">
            Find the hardest-hitting, best-equipped gyms near you. 
            Real reviews, transparent pricing, zero BS.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link to="/gyms">
              <Button size="lg" className="w-full sm:w-auto shadow-[4px_4px_0px_white] hover:translate-y-1 hover:shadow-[2px_2px_0px_white] transition-all">
                Find Your Gym
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Grid Features Section - High Contrast */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center md:text-left mb-12">
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight italic">Why GymEase?</h2>
          <div className="w-24 h-2 bg-primary mt-4"></div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: 'Discover Gyms',
              desc: 'Search by nearby location or any city and compare options quickly.',
              color: 'bg-surface',
              link: '/gyms'
            },
            {
              title: 'Featured Locations',
              desc: 'Explore prime, most-viewed, and busiest gyms by Lite/Prime/Platinum plans.',
              color: 'bg-surfaceLight',
              link: '/featured-locations'
            },
            {
              title: 'Partner With Us',
              desc: 'Onboard gyms, trainers, and health coaches with custom daily/monthly pricing.',
              color: 'bg-primary text-white',
              link: '/partner'
            }
          ].map((feature, i) => (
            <Link key={i} to={feature.link} className="block">
              <div className={`${feature.color} p-8 border border-white/5 relative overflow-hidden group h-full hover:-translate-y-1 transition-transform`}>
                <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl font-black transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
                  0{i + 1}
                </div>
                <h3 className={`text-2xl font-black uppercase italic mb-4 ${feature.color.includes('bg-primary') ? 'text-white' : 'text-white'}`}>{feature.title}</h3>
                <p className={`font-medium ${feature.color.includes('bg-primary') ? 'text-white/90' : 'text-textMuted'}`}>{feature.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Home;
