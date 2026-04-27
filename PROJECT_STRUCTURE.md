# GymEase Project Structure

Modern, scalable project structure with clear separation of concerns.

## 📦 Root Level
```
gymease/
├── README.md                    # Project overview
├── .env                         # Environment variables
├── .gitignore
├── backend/                     # Node.js/Express API
├── frontend/                    # React application
├── database/                    # Database configurations
└── docs/                        # Documentation
```

## 🔧 Backend Structure

```
backend/
├── server.js                    # Entry point
├── package.json
├── .env
└── src/
    ├── index.js                 # Express app initialization
    ├── config/                  # Configuration files
    │   └── firebase.js
    ├── controllers/             # Request handlers
    │   ├── bookingController.js
    │   ├── coachController.js
    │   ├── discoveryController.js
    │   ├── fitnessTrackerController.js
    │   ├── gymController.js
    │   ├── recommendationController.js
    │   └── reviewController.js
    ├── models/                  # Data models & business logic
    │   ├── bookingModel.js
    │   ├── fitnessTrackerModel.js
    │   ├── gymModel.js
    │   ├── recommendationModel.js
    │   └── reviewModel.js
    ├── routes/                  # API route definitions
    │   ├── bookingRoutes.js
    │   ├── coachRoutes.js
    │   ├── discoveryRoutes.js
    │   ├── fitnessTrackerRoutes.js
    │   ├── gymRoutes.js
    │   ├── recommendationRoutes.js
    │   └── reviewRoutes.js
    ├── middleware/              # Express middleware
    │   └── authMiddleware.js
    ├── utils/                   # Utility functions
    │   ├── discoveryProvider.js
    │   ├── helpers.js
    │   └── responseHandler.js
    └── services/                # Business logic services
```

### Backend Architecture
- **Controllers**: Handle HTTP requests/responses
- **Models**: Data persistence and core business logic
- **Routes**: API endpoint definitions
- **Middleware**: Authentication, logging, error handling
- **Utils**: Helper functions and shared utilities
- **Config**: External service configurations (Firebase, etc.)

## 🎨 Frontend Structure

```
frontend/
├── src/
│   ├── index.js                 # React DOM entry point
│   ├── App.js                   # Main app component
│   ├── components/              # Reusable components
│   │   ├── common/              # Shared components
│   │   │   ├── ui/              # Base UI components
│   │   │   │   ├── Button.js
│   │   │   │   ├── Card.js
│   │   │   │   └── Input.js
│   │   │   ├── AuthModal.js
│   │   │   ├── GymCard.js
│   │   │   ├── HealthCoachBot.js
│   │   │   ├── ReviewCard.js
│   │   │   └── SearchBar.js
│   │   ├── layout/              # Layout components
│   │   │   ├── Navbar.js
│   │   │   └── Footer.js
│   │   └── features/            # Feature-specific components
│   │       ├── CalorieTracker.js
│   │       ├── ProgressCharts.js
│   │       ├── ProgressCharts.css
│   │       ├── TrackerForms.css
│   │       ├── WeightTracker.js
│   │       ├── WorkoutLogger.js
│   │       └── WorkoutLogger.css
│   ├── pages/                   # Page components
│   │   ├── Auth/
│   │   │   └── PartnerOnboarding.js
│   │   ├── Discovery/           # Gym discovery features
│   │   │   ├── FeaturedLocations.js
│   │   │   ├── FindGyms.js
│   │   │   ├── GymProfile.js
│   │   │   └── Home.js
│   │   └── Features/            # Application features
│   │       ├── Contact.js
│   │       ├── FitnessTracker.js
│   │       ├── SmartRecommendation.js
│   │       └── TrialCheckout.js
│   ├── context/                 # React Context state management
│   │   ├── AuthContext.js
│   │   └── FitnessContext.js
│   ├── services/                # API service layer
│   │   ├── api.js
│   │   ├── bookingService.js
│   │   ├── coachService.js
│   │   ├── discoveryService.js
│   │   ├── fitnessService.js
│   │   ├── gymService.js
│   │   └── recommendationService.js
│   ├── utils/                   # Utility functions
│   │   ├── constants/           # App constants
│   │   ├── helpers.js
│   │   └── validators/          # Validation functions
│   ├── hooks/                   # Custom React hooks
│   │   └── useFetchGyms.js
│   ├── styles/                  # Global styles
│   │   └── global.css
│   ├── assets/                  # Static assets
│   │   ├── icons/
│   │   └── images/
│   ├── firebase/                # Firebase configuration
│   │   └── firebaseConfig.js
│   ├── supabase/                # Supabase configuration
│   │   └── supabaseClient.js
│   └── data/                    # Static data
│       └── gymsData.js
└── public/
    └── index.html
```

### Frontend Component Organization
- **UI Components** (`common/ui/`): Base, reusable UI building blocks
- **Common Components** (`common/`): Shared components used across features
- **Layout Components** (`layout/`): Page layout components (header, footer)
- **Feature Components** (`features/`): Feature-specific components
- **Pages** (`pages/`): Page-level components organized by domain

## 📊 API Endpoints

### Base URL: `/api`

```
GET     /health                          # Health check
GET     /gyms                            # List all gyms
GET     /gyms/:gymId                     # Get gym details
POST    /gyms                            # Create gym
GET     /reviews/:gymId                  # Get reviews for gym
POST    /reviews                         # Create review
GET     /bookings/gym/:gymId             # Get gym bookings
POST    /bookings/trial                  # Create trial booking
POST    /coach/chat                      # Chat with health coach
GET     /discovery/places                # Discover places (OSM)
GET     /recommendations                 # Get gym recommendations
GET     /fitness/workouts                # Get workouts
POST    /fitness/workouts                # Log workout
GET     /fitness/weights                 # Get weight logs
POST    /fitness/weights                 # Log weight
GET     /fitness/calories                # Get calorie logs
POST    /fitness/calories                # Log calories
```

## 🔄 Data Flow

### Frontend → Backend
1. Component dispatches action/makes API call
2. Service layer (`services/`) prepares request
3. API call sent to backend via axios
4. Response handled in component or Context

### Backend Processing
1. Request received at route
2. Middleware processes request
3. Controller extracts data
4. Model processes business logic
5. Response formatted and returned

## 🎯 Naming Conventions

### Files
- Components: PascalCase (e.g., `GymCard.js`)
- Utilities: camelCase (e.g., `helpers.js`)
- CSS: Match component name (e.g., `GymCard.css`)

### Folders
- Feature folders: camelCase (e.g., `components/features/`)
- Type folders: lowercase (e.g., `routes/`, `models/`)

## 🚀 Development Workflow

### Starting Development

Backend:
```bash
cd backend
npm install
npm run dev
```

Frontend:
```bash
cd frontend
npm install
npm start
```

### Adding New Features

1. **Backend**:
   - Create model in `src/models/`
   - Create controller in `src/controllers/`
   - Create routes in `src/routes/`
   - Mount routes in `src/index.js`

2. **Frontend**:
   - Create component in `src/components/features/`
   - Create service in `src/services/`
   - Create page in `src/pages/Features/` if needed
   - Add route in `App.js`

## 📝 Documentation Files

```
docs/
├── GymEase_MVP_Technical_Documentation.md
├── API_TESTING_GUIDE.md
├── ARCHITECTURE_OVERVIEW.md
├── COMPLETION_SUMMARY.md
├── FEATURES_DOCUMENTATION.md
├── IMPLEMENTATION_SUMMARY.md
└── QUICK_REFERENCE.md
```

## 🔐 Environment Variables

### Backend (.env)
```
PORT=5001
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY=...
```

### Frontend (.env)
```
REACT_APP_API_BASE_URL=http://localhost:5001/api
REACT_APP_SUPABASE_URL=...
REACT_APP_SUPABASE_KEY=...
```

---

**Last Updated**: April 2026
**Project**: GymEase MVP
