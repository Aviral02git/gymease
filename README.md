# GymEase

GymEase is a full-stack fitness discovery MVP that helps users discover gyms, evaluate plans, view gym profiles, book trial slots, chat with an AI fitness coach, **get smart gym recommendations**, and **track their fitness progress**.

## Overview

GymEase includes:

- A React frontend with pages for gym discovery, featured locations, trial checkout, partner onboarding, **smart gym recommendations**, and **fitness progress tracking**.
- A Node.js + Express backend with REST APIs for gyms, reviews, trial bookings, AI coach chat, map-based place discovery, **smart recommendations**, and **fitness tracking**.
- Firebase config scaffolding (frontend + backend), with current runtime data primarily in-memory for MVP speed.

## Core Features

- Gym search and filtering by text, city, tier, price, and nearby distance.
- Map-imported places discovery (OpenStreetMap/Nominatim + Overpass API).
- Gym profile with pricing, facilities, trial slot selection, and local review posting UI.
- Trial booking flow with checkout placeholder and backend booking persistence (in-memory).
- AI Health Coach (domain-guarded fitness chat powered by Groq API).
- Partner onboarding forms for gyms and trainers/coaches (stored in browser localStorage).
- **🧠 Smart Recommendation Engine** - AI-powered gym recommendations based on budget, goals, time, and distance.
- **💪 Fitness Progress Tracker** - Log workouts, track weight, monitor calories, view progress charts, and maintain streaks.

## Tech Stack

### Frontend
- React 18
- React Router v6
- Axios
- TailwindCSS + PostCSS + Autoprefixer
- Firebase Web SDK (Auth scaffolding)
- Supabase client dependency included (future-ready)

### Backend
- Node.js + Express
- CORS + dotenv
- uuid
- Firebase Admin SDK (server-side scaffolding)

### External Services
- Groq Chat Completions API (AI coach)
- OpenStreetMap Nominatim (city geocoding)
- Overpass API (fitness place discovery)

## Monorepo Structure

```text
gymease/
├── backend/                 # Express APIs and business logic
│   ├── config/              # Firebase admin bootstrap
│   ├── controllers/         # Route handlers
│   ├── middleware/          # Auth middleware scaffold
│   ├── models/              # In-memory data models
│   ├── routes/              # API routes
│   └── utils/               # Response + discovery helpers
├── frontend/                # React application
│   ├── src/components/      # UI and shared components
│   ├── src/pages/           # Route pages
│   ├── src/services/        # API service layer
│   ├── src/context/         # Auth context
│   ├── src/data/            # Local seed gym datasets
│   └── src/firebase/        # Firebase web config
├── database/                # Firestore rules
├── docs/                    # Technical docs
└── README.md
```

## Environment Requirements

- Node.js 18+ (recommended; backend uses `fetch`)
- npm 9+

## Quick Start

### 1) Clone and install

```bash
git clone <your-repo-url>
cd gymease

cd backend && npm install
cd ../frontend && npm install
```

### 2) Configure environment files

Create `backend/.env`:

```env
PORT=5000

# Groq AI Coach
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile

# Firebase Admin (optional in current MVP runtime)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

Create `frontend/.env`:

```env
REACT_APP_API_BASE_URL=http://localhost:5000/api

# Firebase Web (optional for local MVP if not using auth yet)
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### 3) Run backend and frontend

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm start
```

Default local URLs:

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## NPM Scripts

### Backend
- `npm run dev` — run with nodemon
- `npm start` — run with node

### Frontend
- `npm start` — start React dev server
- `npm run build` — production build
- `npm test` — run tests

## API Reference

Base URL: `http://localhost:5000`

### Health
- `GET /health`

### Gyms
- `GET /api/gyms?q=<search>`
- `GET /api/gyms/:gymId`
- `POST /api/gyms`

Sample create gym body:

```json
{
    "name": "PowerGrid Fitness",
    "description": "Strength-focused gym",
    "address": "221B Training Street",
    "city": "Mumbai",
    "state": "MH",
    "trialFee": 149,
    "availableTrialSlots": ["6:00 AM - 7:00 AM", "7:00 PM - 8:00 PM"]
}
```

### Reviews
- `GET /api/reviews/:gymId`
- `POST /api/reviews`

Sample create review body:

```json
{
    "gymId": "gym-1",
    "userName": "Aviral",
    "rating": 5,
    "comment": "Great equipment and coaching support."
}
```

### Trial Bookings
- `GET /api/bookings/gym/:gymId`
- `POST /api/bookings/trial`

Sample trial booking body:

```json
{
    "gymId": "gym-1",
    "userEmail": "user@example.com",
    "userName": "Demo User",
    "slot": "6:00 AM - 7:00 AM",
    "visitDate": "2026-04-25"
}
```

### AI Coach
- `POST /api/coach/chat`

Sample chat body:

```json
{
    "message": "Create a 5-day beginner workout split",
    "context": {
        "gyms": [],
        "userProfile": {
            "locale": "India"
        }
    }
}
```

### Discovery
- `GET /api/discovery/places?city=Mumbai&radius=12000&limit=40`
- `GET /api/discovery/places?lat=19.0760&lon=72.8777&radius=12000&limit=40`

## Current MVP Notes

- Core backend entities (`gyms`, `reviews`, `bookings`) are in-memory and reset on server restart.
- Frontend has both static dataset usage and backend service integration depending on page flow.
- Payment in trial checkout is intentionally mocked.
- AI coach blocks out-of-domain prompts and focuses on fitness/health topics.

## Known Gaps / Next Iteration

- Persist all runtime entities in Firestore or a SQL DB.
- Enforce authentication and route-level authorization.
- Add complete backend integration for all profile/review UI states.
- Add real payments (Razorpay/Stripe) and booking reconciliation.
- Add observability: logging, metrics, request tracing.

## Documentation

- Detailed implementation notes: `docs/GymEase_MVP_Technical_Documentation.md`

## Contributing

1. Create a feature branch.
2. Commit with clear messages.
3. Open a pull request with test notes and screenshots (if UI changes).

## License

This project is currently unlicensed. Add a LICENSE file before public distribution.
