# GymEase

GymEase is a full-stack web application to discover gyms, view gym profiles, and read or add reviews.

## Project Structure

- frontend: React client
- backend: Express API
- database: Firestore rules

## Setup

### 1) Install dependencies

In one terminal:
- cd backend
- npm install

In another terminal:
- cd frontend
- npm install

### 2) Configure environment variables

Update values in `.env` at the project root for Firebase and API endpoints.

### 3) Run the apps

Backend:
- cd backend
- npm run dev

Frontend:
- cd frontend
- npm start

## API Endpoints

- GET `/health`
- GET `/api/gyms?q=search`
- GET `/api/gyms/:gymId`
- POST `/api/gyms`
- GET `/api/reviews/:gymId`
- POST `/api/reviews`

## Notes

Current data models are in-memory for quick local development. Replace model layer with Firestore for persistence.
