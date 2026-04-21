# GymEase MVP - Technical Documentation

## 1) Executive Summary

GymEase is a full-stack MVP for fitness discovery and trial booking.

Current implementation supports:
- Gym discovery and filtering
- Gym profile exploration
- Trial booking workflow with checkout placeholder
- AI fitness coach chat (fitness-domain constrained)
- Map-based place discovery from OpenStreetMap services
- Partner onboarding forms for gyms and trainers (frontend-local persistence)

The product is implementation-first: key runtime entities are currently stored in memory on the backend, while selected frontend onboarding data is stored in browser `localStorage`.

---

## 2) Product Scope (Current vs Planned)

### Implemented in MVP
- Gym listing, filtering, and search UI
- Gym profile page with facilities, pricing, trial slot selection, and local review posting UI
- Trial booking API with duplicate-prevention per gym+email
- AI coach API with:
  - local domain guardrails
  - Groq chat completion integration
- Discovery API using:
  - Nominatim geocoding
  - Overpass nearby place query
- Supabase Auth context integration in frontend

### Not yet fully production-ready
- Persistent DB integration for gyms/reviews/bookings
- Payment gateway integration (checkout is intentionally mocked)
- Backend auth enforcement on business routes
- End-to-end review persistence from frontend review form to backend datastore
- Production observability (structured logging, tracing, monitoring)

---

## 3) High-Level Architecture

Frontend (React SPA)  
$\downarrow$ HTTP/JSON (Axios)  
Backend (Node.js + Express REST API)  
$\downarrow$  
In-memory model layer (gyms, reviews, bookings)

Supporting integrations:
- Groq API (LLM coach responses)
- OpenStreetMap Nominatim + Overpass (discovery)
- Supabase Auth client (frontend authentication state)
- Firebase Admin config scaffold + Firestore rules (future persistence)

---

## 4) Technology Stack

## Frontend
- React 18
- React Router DOM 6
- Axios
- TailwindCSS + PostCSS + Autoprefixer
- Supabase JS SDK (auth)
- Firebase Web SDK config scaffold

## Backend
- Node.js
- Express 4
- CORS
- dotenv
- uuid
- Firebase Admin SDK scaffold

## External APIs
- Groq Chat Completions API
- OpenStreetMap Nominatim
- Overpass API

---

## 5) Monorepo Layout

```text
gymease/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── data/
│   │   ├── firebase/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── supabase/
│   │   └── utils/
├── database/
│   └── firestore_rules.txt
└── docs/
    └── GymEase_MVP_Technical_Documentation.md
```

---

## 6) Backend Technical Specification

## 6.1 Server Configuration
- Entry point: `backend/server.js`
- Default port: `5000` (`PORT` env override)
- Middleware:
  - `cors()`
  - `express.json()`
- Health check: `GET /health`
- Mounted route groups:
  - `/api/gyms`
  - `/api/reviews`
  - `/api/bookings`
  - `/api/coach`
  - `/api/discovery`
- Global handlers:
  - route-not-found handler
  - centralized error handler

## 6.2 Response Envelope Standard

Success response:
```json
{
  "success": true,
  "message": "...",
  "data": {}
}
```

Error response:
```json
{
  "success": false,
  "message": "...",
  "details": null
}
```

## 6.3 API Endpoints

### System
- `GET /health`

### Gyms
- `GET /api/gyms?q=<string>`
  - Query filter: case-insensitive match on `name` or `city`
- `GET /api/gyms/:gymId`
  - Returns gym object merged with gym-specific `reviews`
- `POST /api/gyms`
  - Required: `name`
  - Optional: `description`, `address`, `city`, `state`, `trialFee`, `availableTrialSlots`

### Reviews
- `GET /api/reviews/:gymId`
- `POST /api/reviews`
  - Required: `gymId`, `rating`, `comment`
  - Optional: `userName` (defaults to `Anonymous`)

### Bookings
- `GET /api/bookings/gym/:gymId`
- `POST /api/bookings/trial`
  - Required: `gymId`, `userEmail`, `slot`
  - Optional: `userName`, `visitDate`
  - Validations:
    - gym must exist
    - slot must be one of gym `availableTrialSlots`
    - one trial booking per `gymId + normalized userEmail`

### AI Coach
- `POST /api/coach/chat`
  - Required: `message`
  - Optional: `context` with `gyms`, `userProfile`
  - Domain guard:
    - blocks non-fitness queries before model call
  - On success returns: `reply`, `model`, `inScope`

### Discovery
- `GET /api/discovery/places?city=<city>&radius=<m>&limit=<n>`
- `GET /api/discovery/places?lat=<num>&lon=<num>&radius=<m>&limit=<n>`
  - Must provide either `city` or `lat/lon`
  - Defaults: `radius=12000`, `limit=40`

## 6.4 Domain Logic by Module

### Gym model
- In-memory `gyms[]`
- Creates UUID for new gyms
- Applies default trial fee and default trial slots if omitted

### Review model
- In-memory `reviews[]`
- Creates UUID for new reviews
- Casts `rating` to number

### Booking model
- In-memory `bookings[]`
- Email normalization (`trim + lowercase`)
- Duplicate guard per gym-email pair
- Slot validation against source gym slots
- Stores booking status and ISO timestamp

### Discovery provider
- Geocodes city via Nominatim when coordinates are not provided
- Queries Overpass fitness-related tags (`fitness_centre`, `gym`, `sport=fitness`, etc.)
- Normalizes heterogeneous OSM elements into product schema
- Adds inferred attributes:
  - tier (`Lite`, `Prime`, `Platinum`)
  - monthly price
  - rating
  - tags

### Coach controller
- Local lexical and regex-based fitness-domain detection
- Prompted “GymEase Coach” role behavior
- Uses `GROQ_MODEL` fallback: `llama-3.3-70b-versatile`

---

## 7) Frontend Technical Specification

## 7.1 Routing (React Router)
- `/` - Home
- `/gyms` - Find Gyms
- `/featured-locations` - Featured locations page
- `/partner` - Partner onboarding
- `/gyms/:gymId` - Gym profile
- `/gyms/:gymId/trial-checkout` - Trial checkout
- `/contact` - Contact

## 7.2 Service Layer
- `api.js`: Axios instance with base URL from `REACT_APP_API_BASE_URL` (fallback `http://localhost:5000/api`)
- `gymService`: list + single gym fetch
- `bookingService`: create trial booking + gym bookings fetch
- `coachService`: send chat message
- `discoveryService`: discover places by city or coordinates

## 7.3 Key Frontend Feature Modules

### Find Gyms page
- Combines local seed data and map-discovered external places
- Filters by:
  - text search
  - location query
  - tier
  - max monthly price
  - optional nearby distance using browser geolocation

### Gym Profile page
- Current implementation uses local in-file `GYM_DATA` placeholder
- Supports:
  - gallery and facility UI
  - local review posting (client state)
  - trial slot/date selection
  - navigation to checkout

### Trial Checkout page
- Mock payment flow (simulated delay)
- On confirmation calls `POST /api/bookings/trial`
- Handles and renders booking errors/success messages

### Featured Locations page
- Loads discovery data for Mumbai, Bengaluru, and Delhi in parallel
- Deduplicates by place ID
- Displays grouped views:
  - prime locations
  - most viewed
  - busy hotspots

### AI Coach widget
- Floating chat interface
- Quick prompts
- Sends gym context and user profile context to backend coach API

### Partner Onboarding page
- Separate forms for gym and trainer onboarding
- Persists submissions in browser `localStorage`
- Displays recent onboarding submissions

### Auth context
- Supabase-based auth wrapper
- Supports:
  - signup
  - email/password login
  - Google OAuth login
  - logout
- Provides normalized human-readable auth error messages

## 7.4 UI/Theming
- Tailwind custom theme includes:
  - dark background palette
  - neon rose primary accent
  - animation utilities (`fade-in`, `slide-up`)

---

## 8) Data Contracts

## 8.1 Gym entity (backend model)
```json
{
  "id": "uuid",
  "name": "string",
  "description": "string",
  "address": "string",
  "city": "string",
  "state": "string",
  "trialFee": 99,
  "availableTrialSlots": ["6:00 AM - 7:00 AM"]
}
```

## 8.2 Review entity (backend model)
```json
{
  "id": "uuid",
  "gymId": "string",
  "userName": "string",
  "rating": 5,
  "comment": "string"
}
```

## 8.3 Booking entity (backend model)
```json
{
  "id": "uuid",
  "gymId": "string",
  "gymName": "string",
  "userEmail": "string",
  "userName": "string",
  "slot": "string",
  "visitDate": "YYYY-MM-DD",
  "feeAmount": 99,
  "status": "confirmed",
  "createdAt": "ISO-8601"
}
```

## 8.4 Discovery place entity (normalized)
```json
{
  "id": "osm-<type>-<id>",
  "name": "string",
  "location": "string",
  "city": "string",
  "state": "string",
  "latitude": 0,
  "longitude": 0,
  "monthlyPrice": 2999,
  "tier": "Prime",
  "rating": 4.6,
  "reviews": 120,
  "viewsPerMonth": 5400,
  "peakOccupancy": 82,
  "isPrimeLocation": true,
  "tags": ["Gym", "Paid"],
  "image": "url",
  "source": "openstreetmap"
}
```

---

## 9) Environment Variables

## Backend (`backend/.env`)
- `PORT` (optional, default `5000`)
- `GROQ_API_KEY` (required for AI coach responses)
- `GROQ_MODEL` (optional)
- `FIREBASE_PROJECT_ID` (optional scaffold)
- `FIREBASE_CLIENT_EMAIL` (optional scaffold)
- `FIREBASE_PRIVATE_KEY` (optional scaffold; newline escaped)

## Frontend (`frontend/.env`)
- `REACT_APP_API_BASE_URL` (optional; default localhost backend API)
- Firebase web config keys:
  - `REACT_APP_FIREBASE_API_KEY`
  - `REACT_APP_FIREBASE_AUTH_DOMAIN`
  - `REACT_APP_FIREBASE_PROJECT_ID`
  - `REACT_APP_FIREBASE_STORAGE_BUCKET`
  - `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
  - `REACT_APP_FIREBASE_APP_ID`
- Supabase config keys:
  - `REACT_APP_SUPABASE_URL`
  - `REACT_APP_SUPABASE_ANON_KEY`
- Optional site URL for OAuth redirect logic:
  - `REACT_APP_SITE_URL`

---

## 10) Security and Guardrails

- API-level validation exists for required request fields in all write routes.
- Booking endpoint enforces slot validity and duplicate booking prevention.
- Coach endpoint includes out-of-domain blocking before LLM invocation.
- Firestore rules file exists with authenticated write restrictions (future DB usage).

Current gaps:
- No backend JWT/session enforcement on most business APIs.
- No rate limiting or abuse controls yet.
- No server-side schema validation library (e.g., Zod/Joi) yet.

---

## 11) Operational Characteristics

- Backend and frontend are independently runnable apps.
- In-memory backend data resets on server restart.
- External API dependencies may fail or rate-limit; UI degrades gracefully in key discovery screens.
- Node 18+ is recommended (backend uses global `fetch`).

---

## 12) Known Limitations

1. Persistent storage is not yet wired for gyms/reviews/bookings.
2. Gym profile page currently uses local dummy data instead of backend fetch for full detail.
3. Checkout is a mock payment flow.
4. Partner onboarding is frontend-local (`localStorage`) and not server-persisted.
5. End-to-end authorization is incomplete.

---

## 13) Recommended Next Milestones

1. **Persistence migration**
   - Move `gymModel`, `reviewModel`, and `bookingModel` to Firestore or SQL.
2. **Auth hardening**
   - Enforce token verification middleware for write operations.
3. **Payments**
   - Integrate Razorpay/Stripe and add payment state reconciliation.
4. **Data validation**
   - Introduce request schema validation and typed contracts.
5. **Observability**
   - Add structured logs, error monitoring, and request metrics.
6. **Frontend data consistency**
   - Remove local gym profile dummy data and source from backend services.

---

## 14) MVP Success Metrics

- Discovery funnel:
  - search-to-profile click-through rate
  - map import usage rate
- Engagement:
  - coach chat sessions per user
  - gym profile dwell time
- Conversion:
  - trial booking completion rate
  - booking error rate by category
- Supply growth:
  - onboarding submissions (gyms/trainers)

---

## 15) Versioning Note

This document reflects the implementation currently present in the repository as of April 2026 and is intentionally aligned with code behavior, not aspirational architecture.
