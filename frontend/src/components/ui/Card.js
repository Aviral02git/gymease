import React from 'react';

const Card = ({ children, className = '', hoverEffect = false, ...props }) => {
  return (
    <div 
      className={`solid-card ${hoverEffect ? 'hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_20px_35px_rgba(0,0,0,0.45)] transition-all duration-300' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
