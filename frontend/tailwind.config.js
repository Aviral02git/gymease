/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#000000',     // Pure black background
        surface: '#111111',        // Dark graphite for cards
        surfaceLight: '#1A1A1A',   // Slightly lighter for borders/inputs
        primary: '#F43F5E',        // Neon Rose/Red accent (Cult.fit vibe)
        primaryDark: '#BE123C',
        textMain: '#FFFFFF',
        textMuted: '#9CA3AF',      // Cool gray for secondary text
        accent: '#FBBF24',         // Yellow for ratings
      },
      fontFamily: {
        // Using Inter but we will rely heavily on font-black/bold in the components
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
