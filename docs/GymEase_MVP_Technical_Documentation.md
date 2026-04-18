# GymEase MVP – Technical Documentation (Implementation Based)

## 1. Project Overview

GymEase ek fitness discovery platform ka MVP hai jisme user gyms browse kar sakta hai, gym detail page dekh sakta hai, aur reviews read kar sakta hai.

Current implementation focus:
- Gym listing + search (name/city)
- Gym detail page with embedded reviews
- Basic review APIs
- Simple responsive UI with React

## 2. Implemented MVP Objectives

- Local gyms ko quickly discover karna
- Gym details ek jagah show karna
- Basic review visibility dena

> Note: Gym comparison UI, location auto-detection, booking/payment abhi implemented nahi hai.

## 3. Target Users

### Primary
- College students
- Beginners joining gym
- Fitness enthusiasts
- People shifting to new cities

### Secondary
- Gym owners (future listing workflows ke liye)

## 4. Feature Status (As Implemented)

### 4.1 Gym Discovery ✅
User `Find Gyms` page par search kar sakta hai.

Search behavior:
- Query param `q`
- Backend filter: `gym.name` ya `gym.city` contains `q` (case-insensitive)

### 4.2 Gym Listing Page ✅
Listing page me cards show hote hain:
- Gym name
- Formatted address (`address, city, state`)
- Description
- `View Profile` CTA

### 4.3 Gym Profile Page ✅
Gym profile route: `/gyms/:gymId`

Profile page me:
- Gym name
- City + state
- Description
- Gym-specific reviews list

### 4.4 Basic Reviews ✅
Reviews display fields:
- `userName`
- `rating`
- `comment`

### 4.5 Auth / Firebase Status ⚠️
- Frontend `AuthContext` present (local state only)
- Firebase config files present
- Backend Firebase config present
- **But runtime persistence currently in-memory model arrays par hai**

## 5. System Architecture (Current)

**Frontend (React + React Router + Axios)**  
↓  
**Backend API (Node.js + Express)**  
↓  
**In-memory data layer (JS arrays in models)**

### Planned architecture (next step)
Firestore integration available in structure/config, but fully wired persistence pending.

## 6. Tech Stack (Actual)

### Frontend
- React 18
- React Router DOM 6
- Axios
- Custom CSS (`src/styles/global.css`)

Responsibilities:
- Routes rendering (`/`, `/gyms`, `/gyms/:gymId`, `/contact`)
- API consumption via service layer
- Loading/error state handling

### Backend
- Node.js
- Express
- CORS
- dotenv
- uuid

Responsibilities:
- REST API endpoints expose karna
- Request validation
- In-memory model operations
- Standard response envelope (`success`, `message`, `data`)

### Data Layer
- Current: In-memory arrays in model files
- Prepared: Firebase Admin config + Firestore rules file

## 7. Folder Structure (Implemented)

### Frontend
- `src/components`: `Navbar`, `Footer`, `GymCard`, `SearchBar`, `ReviewCard`
- `src/pages`: `Home`, `FindGyms`, `GymProfile`, `Contact`
- `src/services`: API client + gym service
- `src/hooks`: `useFetchGyms`
- `src/context`: `AuthContext`
- `src/firebase`: Firebase app init config
- `src/utils`: helpers

### Backend
- `controllers`: `gymController`, `reviewController`
- `routes`: `gymRoutes`, `reviewRoutes`
- `models`: `gymModel`, `reviewModel`
- `utils`: `responseHandler`
- `config`: Firebase admin setup
- `middleware`: auth middleware stub

## 8. Data Schema (Current Runtime Models)

### 8.1 Gym Object

```json
{
  "id": "gym-1",
  "name": "Iron Pulse Fitness",
  "description": "Strength and conditioning center with expert trainers.",
  "address": "21 Park Street",
  "city": "Bengaluru",
  "state": "KA"
}
```

### 8.2 Review Object

```json
{
  "id": "review-1",
  "gymId": "gym-1",
  "userName": "Aviral",
  "rating": 5,
  "comment": "Great trainers and excellent equipment."
}
```

## 9. API Contract (Implemented)

Base path: `/api`

All success responses envelope format:

```json
{
  "success": true,
  "message": "...",
  "data": {}
}
```

### 9.1 Health Check
`GET /health`

### 9.2 Get All Gyms
`GET /api/gyms`

Optional query:
- `q`: search by gym name or city

### 9.3 Get Gym Details
`GET /api/gyms/:gymId`

Returns gym object + `reviews` array merged in `data`.

### 9.4 Create Gym
`POST /api/gyms`

Required:
- `name`

Optional:
- `description`, `address`, `city`, `state`

### 9.5 Get Reviews by Gym
`GET /api/reviews/:gymId`

### 9.6 Add Review
`POST /api/reviews`

Required body fields:
- `gymId`
- `rating`
- `comment`

Optional:
- `userName` (default: `Anonymous`)

## 10. Frontend User Flow (Current)

Home (`/`)  
↓  
Find Gyms (`/gyms`)  
↓  
Gym Profile (`/gyms/:gymId`)  
↓  
Read Reviews

## 11. Current Limitations

- Data persistence restart ke baad reset ho jata hai (in-memory)
- No authentication enforcement in API routes
- No review submission UI in frontend yet
- No gym comparison module yet
- No geo-location based nearby ranking yet
- No pricing/facility/rating fields in gym model currently

## 12. Recommended Next Sprint

1. Firestore persistence wire-up (`gymModel`/`reviewModel` migration)
2. Frontend “Add Review” form
3. Gym schema expand with `price`, `facilities`, `rating`, `images`
4. Gym compare screen (`selected gyms` side-by-side)
5. Auth token verification in middleware

## 13. Success Metrics (MVP)

- Number of gyms created/listed
- Search-to-profile click-through
- Reviews per gym
- Returning sessions
