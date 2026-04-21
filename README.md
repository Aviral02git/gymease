# GymEase 🏋️‍♂️

GymEase is a full-stack gym discovery platform (MVP) designed to help users find local gyms, view comprehensive profiles, and explore reviews. The platform is tailored for fitness enthusiasts, beginners, and anyone looking to join a gym with ease.

## 🚀 Features

*   **Gym Discovery**: Easily search for gyms by name or city.
*   **Gym Listing**: View a curated list of gyms with their basic details like address and summary.
*   **Detailed Profiles**: Dive deep into a gym's profile, including its full address and a dedicated reviews section.
*   **User Reviews**: Read feedback and ratings from other users to make an informed decision.
*   **Responsive UI**: A modern, energetic user interface built with React.

## 🛠️ Tech Stack

### Frontend
*   React 18
*   React Router v6
*   Axios for API requests
*   Custom CSS (Modern energetic aesthetics)

### Backend
*   Node.js & Express
*   REST APIs
*   In-memory data models (Currently, prepared for Firebase Firestore)

## 📁 Project Structure

```text
gymease/
├── frontend/       # React client application
├── backend/        # Express API and server logic
├── database/       # Firestore rules and database config
└── docs/           # Technical documentation and PRDs
```

## ⚙️ Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

*   Node.js (v14 or higher)
*   npm (Node Package Manager)

### Installation

1.  **Install Backend Dependencies**
    ```bash
    cd backend
    npm install
    ```
2.  **Install Frontend Dependencies**
    ```bash
    cd frontend
    npm install
    ```

### Configuration

Setup your environment variables. Create a `.env` file at the root of the project (if not present) and configure your Firebase and API endpoints.

### Running the Application

You will need two terminal windows to run both the frontend and backend servers simultaneously.

**Terminal 1: Start the Backend Server**
```bash
cd backend
npm run dev
```

**Terminal 2: Start the Frontend Application**
```bash
cd frontend
npm start
```

*The frontend usually runs on `http://localhost:3000` and the backend on a specified port (e.g., `http://localhost:5000`)*.

## 📡 API Endpoints (Current Version)

The backend provides the following REST API endpoints:

*   `GET /health` - Health check
*   `GET /api/gyms?q=search` - Retrieve a list of gyms, optionally filtered by name or city (`q`)
*   `GET /api/gyms/:gymId` - Retrieve detailed information for a specific gym (includes reviews)
*   `POST /api/gyms` - Add a new gym
*   `GET /api/reviews/:gymId` - Retrieve reviews for a specific gym
*   `POST /api/reviews` - Submit a new review

## 🗺️ Roadmap & Future Enhancements

The current data models are in-memory to facilitate quick local development. The following features are planned for upcoming sprints:

*   [ ] Wire up Firebase **Firestore** for scalable data persistence.
*   [ ] Implement a frontend UI for adding reviews.
*   [ ] Expand gym schema to include pricing, facility lists, aggregate ratings, and gallery images.
*   [ ] Develop a "Compare Gyms" feature for side-by-side analysis.
*   [ ] Enforce backend authentication utilizing JWT/Firebase Auth tokens.
