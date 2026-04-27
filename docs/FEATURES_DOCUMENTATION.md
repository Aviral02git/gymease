# GymEase Features: Smart Recommendations & Fitness Tracker

## Overview

This document outlines the two major features added to GymEase:

1. **Smart Recommendation Engine** - "Find the Best Gym for Me"
2. **Fitness Progress Tracker** - Track workouts, weight, and calories

---

## 1. Smart Recommendation Engine 🧠

### What It Does
The Smart Recommendation Engine analyzes user preferences and intelligently ranks gyms based on multiple scoring factors. It's like Zomato + AI for gyms!

### Features

#### User Inputs
- **Budget**: Monthly gym subscription budget (₹1,000 - ₹10,000+)
- **Fitness Goals**: Multiple selections from:
  - ⚖️ Weight Loss
  - 💪 Muscle Gain
  - 🧘 Flexibility
  - 🏃 Endurance
  - 🏋️ General Fitness
- **Preferred Time**: Morning, Afternoon, Evening, or Night
- **Max Distance**: Acceptable distance from user location (1-50 km)
- **City**: Optional city filter

#### Scoring Algorithm

The recommendation score (0-100) is calculated using a weighted formula:

```
Final Score = 
  (Price Match × 0.30) +
  (Facilities Match × 0.25) +
  (Distance Score × 0.20) +
  (Time Score × 0.15) +
  (Popularity Score × 0.10)
```

**Score Breakdown:**

1. **Price Match (30%)** - How well gym price aligns with user budget
   - Perfect match (100%)
   - Within 50% of budget range (50-100%)
   - Outside acceptable range (0%)

2. **Facilities Match (25%)** - How well facilities align with goals
   - Weight Loss: Prefers cardio, elliptical, treadmill
   - Muscle Gain: Prefers free weights, dumbbells, cable machines
   - Flexibility: Prefers yoga studio, stretching area
   - Endurance: Prefers cycling, swimming pool
   - General Fitness: All facilities valued equally

3. **Distance Score (20%)** - Closer gyms get higher scores
   - 0 km = 100 points
   - At max distance = 0 points
   - Scores inversely from user's max distance preference

4. **Time Score (15%)** - Whether gym is open during preferred hours
   - Matches preferred time: 100%
   - Limited availability: 30%

5. **Popularity Score (10%)** - Based on gym rating and reviews
   - Higher ratings (⭐) and more reviews = higher score

#### Result Display

Users see:
- **Top 10 Recommendations** - Ranked by overall score
- **Visual Score Cards** - Each gym shows:
  - Overall match percentage
  - Ranking position
  - Price and rating
  - Quick score breakdown with icons
- **Detailed View** - Click any gym to see:
  - Detailed score breakdown (graph visualization)
  - Human-readable explanation of why recommended
  - Specific matching factors explained

### Backend Routes

```
GET /api/recommendations
  Query Parameters:
    - budget: number (default: 3000)
    - goals: comma-separated string (default: 'general fitness')
    - preferredTime: 'morning'|'afternoon'|'evening'|'night' (default: 'evening')
    - maxDistance: number in km (default: 10)
    - latitude: number (optional)
    - longitude: number (optional)
    - city: string (optional)
  
  Response: Array of gyms ranked by recommendation score

GET /api/recommendations/:gymId
  Query Parameters: Same as above
  Response: Detailed gym info with score breakdown
```

### Frontend Components

- **SmartRecommendation.js** - Main page component
- **recommendationService.js** - API service layer
- **SmartRecommendation.css** - Styling with gradient effects

### Key Files

**Backend:**
- `/backend/models/recommendationModel.js` - Scoring logic
- `/backend/controllers/recommendationController.js` - Request handling
- `/backend/routes/recommendationRoutes.js` - Route definitions
- `/backend/utils/helpers.js` - Distance calculation

**Frontend:**
- `/frontend/src/pages/SmartRecommendation.js` - Main page
- `/frontend/src/services/recommendationService.js` - API calls
- `/frontend/src/pages/SmartRecommendation.css` - Styles

---

## 2. Fitness Progress Tracker 💪

### What It Does
A comprehensive fitness tracking system where users can log workouts, track weight changes, monitor calorie intake/burn, and visualize progress with charts and streaks.

### Features

#### Core Tracking

1. **Workout Logging** 🏋️
   - Workout type (cardio, strength, yoga, sports, flexibility, swimming, cycling, HIIT)
   - Duration (minutes)
   - Calories burned
   - Intensity level (low, medium, high)
   - Exercise list (e.g., "10 pushups", "20 squats")
   - Notes for observations
   - Auto-timestamp

2. **Weight Tracking** ⚖️
   - Record weight with unit selection (kg/lbs)
   - Track changes over time
   - Personal notes
   - Automatic weight loss calculation

3. **Calorie Tracking** 🍎
   - Log consumed calories (meals: breakfast, lunch, dinner, snack, drinks)
   - Log burned calories (from workouts)
   - Compare consumed vs burned
   - Personal notes

#### Statistics & Analytics

**Overall Stats:**
- Total workouts completed
- Total calories burned
- Total weight lost
- Average weekly workouts

**Weekly Summary:**
- Workouts this week
- Total calories burned
- Breakdown by workout type
- Average workout duration

**Monthly Progress:**
- Starting vs current weight
- Weight change tracking
- Total calories burned
- Trend analysis

**Streak System** 🔥
- Current streak (consecutive days with workouts)
- Longest streak (personal record)
- Automatic streak calculation
- Streak reset on missed days

#### Data Visualization

**Charts Available:**

1. **Weekly Workout Bar Chart**
   - Shows workouts per day (Mon-Sun)
   - Interactive hover effects
   - Color-coded bars

2. **Calorie Balance Chart**
   - Consumed vs Burned comparison
   - Visual balance indicator
   - Real-time totals

3. **Weight Trend**
   - Starting weight
   - Current weight
   - Total weight lost
   - Progress visualization

4. **Achievement Badges**
   - Current streak display
   - Longest streak
   - Weekly average

5. **Goal Progress Bars**
   - Total workouts (target: 50)
   - Weekly calories (target: 2000)
   - Weight loss (target: 10 kg)

#### User Interface

**Tabs:**
- 📊 Overview - Dashboard with all charts
- 🏋️ Workouts - List of logged workouts
- ⚖️ Weight - Weight history
- 🍎 Calories - Calorie entries

**Quick Actions:**
- + Log Workout button
- + Log Weight button
- + Log Calories button

**Modal Forms:**
- WorkoutLogger.js - Workout form
- WeightTracker.js - Weight form
- CalorieTracker.js - Calorie form

### Backend Routes

```
GET /api/fitness/:userId
  Query: days=30 (default)
  Response: All fitness data for user

POST /api/fitness/:userId/workouts
  Body: { date, type, duration, caloriesBurned, notes, intensity, exercises }
  Response: Created workout object

GET /api/fitness/:userId/workouts?days=30
  Response: Workout history

POST /api/fitness/:userId/weights
  Body: { date, weight, unit, notes }
  Response: Created weight entry

GET /api/fitness/:userId/weights?days=30
  Response: Weight history

POST /api/fitness/:userId/calories
  Body: { date, calories, type, meal, notes }
  Response: Created calorie entry

GET /api/fitness/:userId/calories?days=30
  Response: Calorie history

GET /api/fitness/:userId/weekly-summary
  Response: { workoutCount, caloriesBurned, workoutsByType, averageDuration }

GET /api/fitness/:userId/monthly-progress
  Response: { workoutCount, totalCaloriesBurned, weightChange, weightLoss }
```

### State Management

**FitnessContext** provides:
- Global fitness data state
- Loading/error states
- Methods:
  - `loadFitnessData()` - Fetch all data
  - `logWorkout()` - Record workout
  - `logWeight()` - Record weight
  - `logCalorie()` - Record calorie
  - `loadWeeklySummary()` - Get weekly stats
  - `loadMonthlyProgress()` - Get monthly stats

### Frontend Components

**Pages:**
- `/frontend/src/pages/FitnessTracker.js` - Main tracker page
- `/frontend/src/pages/FitnessTracker.css` - Styling

**Components:**
- `WorkoutLogger.js` - Workout form
- `WeightTracker.js` - Weight form
- `CalorieTracker.js` - Calorie form
- `ProgressCharts.js` - Data visualization
- `TrackerForms.css` - Form styling
- `WorkoutLogger.css` - Workout form styling
- `ProgressCharts.css` - Chart styling

**Context:**
- `/frontend/src/context/FitnessContext.js` - State management

**Services:**
- `/frontend/src/services/fitnessService.js` - API layer

### Key Files

**Backend:**
- `/backend/models/fitnessTrackerModel.js` - Data logic and calculations
- `/backend/controllers/fitnessTrackerController.js` - Request handling
- `/backend/routes/fitnessTrackerRoutes.js` - Route definitions

**Frontend:**
- `/frontend/src/pages/FitnessTracker.js` - Main page
- `/frontend/src/context/FitnessContext.js` - State management
- `/frontend/src/services/fitnessService.js` - API calls
- `/frontend/src/components/WorkoutLogger.js` - Workout form
- `/frontend/src/components/WeightTracker.js` - Weight form
- `/frontend/src/components/CalorieTracker.js` - Calorie form
- `/frontend/src/components/ProgressCharts.js` - Charts and visualizations

---

## Integration Guide

### Adding to App.js

```jsx
import { FitnessProvider } from './context/FitnessContext';
import SmartRecommendation from './pages/SmartRecommendation';
import FitnessTracker from './pages/FitnessTracker';

function App() {
  return (
    <FitnessProvider>
      {/* Other components */}
      <Routes>
        <Route path="/smart-recommendation" element={<SmartRecommendation />} />
        <Route path="/fitness-tracker" element={<FitnessTracker />} />
      </Routes>
    </FitnessProvider>
  );
}
```

### Navbar Links

Add to navigation:
```jsx
<Link to="/smart-recommendation">🧠 Smart Recommendations</Link>
<Link to="/fitness-tracker">💪 Fitness Tracker</Link>
```

---

## Technology Stack

### Backend
- Node.js + Express
- In-memory storage (ready for Firebase/PostgreSQL)
- UUID for unique IDs
- Haversine formula for distance calculation

### Frontend
- React with Context API
- CSS3 with gradients and animations
- Responsive design (mobile-first)
- Chart visualization (custom bars/circles)

---

## Data Models

### Recommendation Model
```javascript
{
  id,
  name,
  city,
  monthlyPrice,
  rating,
  reviews,
  latitude,
  longitude,
  recommendationScore,
  scoreBreakdown: {
    price,
    facilities,
    distance,
    time,
    popularity
  }
}
```

### Workout Model
```javascript
{
  id,
  userId,
  date,
  type,
  duration,
  caloriesBurned,
  notes,
  intensity,
  exercises: []
}
```

### Weight Model
```javascript
{
  id,
  userId,
  date,
  weight,
  unit,
  notes
}
```

### Calorie Model
```javascript
{
  id,
  userId,
  date,
  calories,
  type: 'consumed' | 'burned',
  meal,
  notes
}
```

---

## Future Enhancements

### Smart Recommendations
- [ ] Integration with real database (Firebase/PostgreSQL)
- [ ] AI-powered learning based on user selections
- [ ] Comparison view for multiple gyms
- [ ] Save favorite gyms
- [ ] Price history and trends
- [ ] Community reviews integration

### Fitness Tracker
- [ ] Wearable device integration (Apple Watch, Fitbit)
- [ ] Nutrition database integration
- [ ] AI-powered workout recommendations
- [ ] Social sharing of achievements
- [ ] Push notifications for streaks
- [ ] Export data (PDF/CSV)
- [ ] Goal-based workout plans
- [ ] Integration with gym bookings

---

## Testing

### Test Recommendations
```bash
# Get recommendations
curl "http://localhost:5000/api/recommendations?budget=3000&goals=weight%20loss,muscle%20gain&preferredTime=evening&maxDistance=10"

# Get gym details
curl "http://localhost:5000/api/recommendations/gym-1?budget=3000"
```

### Test Fitness Tracker
```bash
# Log workout
curl -X POST "http://localhost:5000/api/fitness/user123/workouts" \
  -H "Content-Type: application/json" \
  -d '{"type":"cardio","duration":30,"caloriesBurned":250,"intensity":"high"}'

# Get fitness data
curl "http://localhost:5000/api/fitness/user123"

# Get weekly summary
curl "http://localhost:5000/api/fitness/user123/weekly-summary"
```

---

## Performance Considerations

- **Recommendations**: O(n) complexity for gym ranking - suitable for up to 1000s of gyms
- **Fitness Tracker**: O(n) for filtering by date - suitable for years of data
- **Charts**: Rendered on client-side for performance
- **Caching**: Implement Redis for frequently accessed recommendations

---

## Security Notes

- User fitness data should be protected (add auth middleware)
- Validate all inputs on backend
- Rate limit API endpoints
- Use HTTPS in production
- Hash sensitive data if using persistent storage

---

## Deployment Notes

1. Update `.env` with production API URLs
2. Enable CORS for frontend domain
3. Set up database (Firebase or PostgreSQL)
4. Configure authentication middleware
5. Add logging and monitoring
6. Set up CI/CD pipeline

---

## Support

For issues or questions about these features, please refer to:
- Backend: `/backend` directory
- Frontend: `/frontend/src` directory
- Documentation: This file

---

**Last Updated:** April 2026
**Features Added By:** GitHub Copilot
**Status:** ✅ Ready for Development & Testing
