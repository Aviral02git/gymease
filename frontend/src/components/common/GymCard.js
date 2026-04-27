import React from 'react';
import { Link } from 'react-router-dom';
import Card from './ui/Card';
import { formatINR } from '../../utils/helpers';

const GymCard = ({ id, name, location, monthlyPrice, tier, rating, reviews, image, tags = [], onCompare }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <Card hoverEffect className="overflow-hidden group flex flex-col h-full !rounded-none border-b-4 border-b-transparent hover:border-b-primary transition-all" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden bg-surfaceLight">
        <img 
          src={image || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800'} 
          alt={name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent"></div>
        
        {/* Rating Badge */}
        <div className="absolute top-4 right-4 z-20 bg-black text-white px-3 py-1 font-bold text-sm flex items-center gap-1 border border-white/10">
          <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          {rating}
        </div>

        {tier && (
          <div className="absolute top-4 left-4 z-20 bg-primary/90 text-white px-3 py-1 text-[10px] font-black uppercase tracking-wider">
            {tier}
          </div>
        )}

        {/* Compare Button Overlay */}
        {onCompare && isHovered && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onCompare({ id, name, location, monthlyPrice, tier, rating, reviews, image, tags });
            }}
            className="absolute top-4 right-16 z-30 bg-accent hover:bg-accent/90 text-black px-3 py-1 text-xs font-black uppercase tracking-wider transition-all duration-200 rounded"
          >
            ⚖️ Compare
          </button>
        )}
        
        {/* Title overlayed on image for Cult style */}
        <div className="absolute bottom-4 left-4 right-4 z-20">
          <h3 className="text-2xl font-black text-white uppercase italic tracking-tight leading-none mb-1">{name}</h3>
          <div className="flex items-center text-gray-300 text-xs font-bold uppercase tracking-wide">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            <span className="truncate">{location}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-grow flex flex-col bg-surface">
        
        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map((tag, idx) => (
            <span key={idx} className="text-xs font-bold uppercase tracking-wider px-2 py-1 bg-surfaceLight text-textMuted border border-white/5">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between gap-3">
          <span className="text-lg font-black text-white">{formatINR(monthlyPrice)} <span className="text-xs text-textMuted font-bold uppercase tracking-widest">/mo</span></span>
          <Link to={`/gyms/${id || 1}`} className="text-primary font-black uppercase text-xs tracking-widest hover:text-white transition-colors flex items-center gap-1 whitespace-nowrap">
            Explore 
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </Link>
        </div>
        <p className="text-xs text-textMuted mt-2">{reviews} reviews</p>
      </div>
    </Card>
  );
};

export default GymCard;
