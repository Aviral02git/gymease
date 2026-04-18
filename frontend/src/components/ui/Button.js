import React from 'react';

const Button = ({ children, variant = 'primary', className = '', uppercase = true, ...props }) => {
  const textTransform = uppercase ? 'uppercase tracking-wider' : '';
  const baseStyles = `inline-flex items-center justify-center rounded-xl font-black transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/35 disabled:cursor-not-allowed disabled:opacity-60 ${textTransform}`;
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary to-primaryDark text-white shadow-[0_8px_25px_rgba(244,63,94,0.35)] hover:brightness-110 active:scale-95',
    secondary: 'bg-surfaceLight text-white hover:bg-gray-800 active:scale-95 border border-white/10',
    outline: 'border border-primary text-primary hover:bg-primary hover:text-white',
    ghost: 'text-textMuted hover:text-white hover:bg-white/5 border border-transparent',
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  const sizeClass = props.size ? sizes[props.size] : sizes.md;

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizeClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
