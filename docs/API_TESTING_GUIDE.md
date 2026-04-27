# API Testing Guide

## Smart Recommendations API

### Get Recommendations

**Basic Request:**
```bash
curl "http://localhost:5000/api/recommendations"
```

**With Preferences:**
```bash
curl "http://localhost:5000/api/recommendations?budget=3000&goals=weight%20loss,muscle%20gain&preferredTime=evening&maxDistance=10&city=Bengaluru"
```

**With Location:**
```bash
curl "http://localhost:5000/api/recommendations?budget=3500&goals=general%20fitness&latitude=12.9716&longitude=77.5946&maxDistance=5"
```

**Response Example:**
```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "id": "gym-1",
        "name": "Iron Pulse Fitness",
        "city": "Bengaluru",
        "monthlyPrice": 2999,
        "rating": 4.5,
        "reviews": 120,
        "recommendationScore": 85,
        "scoreBreakdown": {
          "price": 90,
          "facilities": 88,
          "distance": 92,
          "time": 95,
          "popularity": 82
        }
      }
    ],
    "preferences": {
      "budget": 3000,
      "goals": ["weight loss", "muscle gain"],
      "preferredTime": "evening",
      "maxDistance": 10
    },
    "totalGymsAnalyzed": 15,
    "topResult": { /* first recommendation */ }
  },
  "message": "Recommendations fetched successfully"
}
```

### Get Gym Details with Recommendation

```bash
curl "http://localhost:5000/api/recommendations/gym-1?budget=3000&goals=weight%20loss&preferredTime=evening"
```

**Response Example:**
```json
{
  "success": true,
  "data": {
    "gym": {
      "id": "gym-1",
      "name": "Iron Pulse Fitness",
      "description": "Strength and conditioning center",
      "city": "Bengaluru",
      "monthlyPrice": 2999
    },
    "recommendationScore": 85,
    "scoreBreakdown": {
      "price": 90,
      "facilities": 88,
      "distance": 92,
      "time": 95,
      "popularity": 82,
      "distanceKm": "3.45"
    },
    "explanation": {
      "summary": "Iron Pulse Fitness is highly recommended for you",
      "details": [
        "✅ Price match: Great price point for your budget",
        "✅ Facilities: Excellent match for your fitness goals",
        "✅ Distance: Very close to you (3.45 km)",
        "✅ Timing: Opens during your preferred hours",
        "✅ Popularity: Highly rated by members"
      ],
      "overallMatch": 85
    }
  }
}
```

---

## Fitness Tracker API

### Get All Fitness Data

```bash
curl "http://localhost:5000/api/fitness/user123"
```

or with specific days:
```bash
curl "http://localhost:5000/api/fitness/user123?days=60"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "workouts": [ /* array of workouts */ ],
    "weights": [ /* array of weight entries */ ],
    "calories": [ /* array of calorie entries */ ],
    "stats": {
      "totalWorkouts": 25,
      "totalCaloriesBurned": 6250,
      "totalWeightLost": 3.5,
      "averageWeeklyWorkouts": 4
    },
    "streaks": {
      "currentStreak": 5,
      "longestStreak": 12,
      "lastWorkoutDate": "2026-04-27T10:30:00Z"
    }
  }
}
```

---

### Log a Workout

```bash
curl -X POST "http://localhost:5000/api/fitness/user123/workouts" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2026-04-27",
    "type": "cardio",
    "duration": 30,
    "caloriesBurned": 250,
    "intensity": "high",
    "exercises": ["20 mins running", "10 mins stretching"],
    "notes": "Great morning run, felt energetic"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "w-abc123",
    "userId": "user123",
    "date": "2026-04-27T00:00:00Z",
    "type": "cardio",
    "duration": 30,
    "caloriesBurned": 250,
    "intensity": "high",
    "exercises": ["20 mins running", "10 mins stretching"],
    "notes": "Great morning run, felt energetic"
  },
  "message": "Workout logged successfully"
}
```

---

### Get Workouts

```bash
curl "http://localhost:5000/api/fitness/user123/workouts"
```

or specific days:
```bash
curl "http://localhost:5000/api/fitness/user123/workouts?days=7"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "workouts": [
      {
        "id": "w-abc123",
        "userId": "user123",
        "date": "2026-04-27T00:00:00Z",
        "type": "cardio",
        "duration": 30,
        "caloriesBurned": 250,
        "intensity": "high"
      }
    ],
    "count": 1
  }
}
```

---

### Log Weight

```bash
curl -X POST "http://localhost:5000/api/fitness/user123/weights" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2026-04-27",
    "weight": 72.5,
    "unit": "kg",
    "notes": "After morning workout"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "wt-def456",
    "userId": "user123",
    "date": "2026-04-27T00:00:00Z",
    "weight": 72.5,
    "unit": "kg",
    "notes": "After morning workout"
  },
  "message": "Weight logged successfully"
}
```

---

### Get Weights

```bash
curl "http://localhost:5000/api/fitness/user123/weights"
```

---

### Log Calories

```bash
curl -X POST "http://localhost:5000/api/fitness/user123/calories" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2026-04-27",
    "calories": 450,
    "type": "consumed",
    "meal": "lunch",
    "notes": "Grilled chicken with salad"
  }'
```

**Alternative (burned):**
```bash
curl -X POST "http://localhost:5000/api/fitness/user123/calories" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2026-04-27",
    "calories": 250,
    "type": "burned",
    "notes": "30 min run at gym"
  }'
```

---

### Get Calories

```bash
curl "http://localhost:5000/api/fitness/user123/calories"
```

---

### Get Weekly Summary

```bash
curl "http://localhost:5000/api/fitness/user123/weekly-summary"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "week": {
      "start": "2026-04-20T00:00:00Z",
      "end": "2026-04-27T00:00:00Z"
    },
    "workoutCount": 5,
    "caloriesBurned": 1250,
    "workoutsByType": {
      "cardio": 3,
      "strength": 2
    },
    "averageDuration": 28
  }
}
```

---

### Get Monthly Progress

```bash
curl "http://localhost:5000/api/fitness/user123/monthly-progress"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "month": "April 2026",
    "workoutCount": 18,
    "totalCaloriesBurned": 4500,
    "startWeight": 75.0,
    "currentWeight": 72.5,
    "weightChange": 2.5,
    "weightLoss": true
  }
}
```

---

## Example Frontend Usage

### Using RecommendationService

```javascript
import { recommendationService } from './services/recommendationService';

// Get recommendations
const response = await recommendationService.getRecommendations({
  budget: 3000,
  goals: ['weight loss', 'muscle gain'],
  preferredTime: 'evening',
  maxDistance: 10,
  latitude: 12.9716,
  longitude: 77.5946,
  city: 'Bengaluru'
});

const recommendations = response.data.data.recommendations;
```

### Using FitnessService

```javascript
import fitnessService from './services/fitnessService';

// Log workout
const workout = await fitnessService.logWorkout('user123', {
  date: '2026-04-27',
  type: 'cardio',
  duration: 30,
  caloriesBurned: 250,
  intensity: 'high'
});

// Get all data
const data = await fitnessService.getUserFitnessData('user123', 30);

// Get weekly summary
const summary = await fitnessService.getWeeklySummary('user123');
```

### Using FitnessContext

```javascript
import { useFitness } from './context/FitnessContext';

function MyComponent() {
  const { fitnessData, logWorkout, loadFitnessData } = useFitness();

  const handleLogWorkout = async () => {
    await logWorkout('user123', {
      type: 'cardio',
      duration: 30,
      caloriesBurned: 250
    });
    await loadFitnessData('user123');
  };

  return (
    <div>
      <h3>Total Workouts: {fitnessData.stats.totalWorkouts}</h3>
      <button onClick={handleLogWorkout}>Log Workout</button>
    </div>
  );
}
```

---

## Error Handling

### Common Error Responses

**Missing Required Field:**
```json
{
  "success": false,
  "message": "Workout type and duration are required",
  "statusCode": 400
}
```

**User Not Found:**
```json
{
  "success": false,
  "message": "User ID is required",
  "statusCode": 400
}
```

**Server Error:**
```json
{
  "success": false,
  "message": "Internal server error",
  "statusCode": 500
}
```

---

## Testing Checklist

- [ ] Test recommendations with various budgets
- [ ] Test recommendations with multiple goals
- [ ] Test location-based recommendations
- [ ] Test without location
- [ ] Log workouts and verify streak
- [ ] Log weight and check weight loss calculation
- [ ] Log calories consumed and burned
- [ ] Get weekly summary
- [ ] Get monthly progress
- [ ] Test with 0 data points
- [ ] Test error handling with invalid inputs
- [ ] Test response times for large datasets

---

## Performance Tips

1. **Caching:** Cache recommendations for 5-10 minutes
2. **Pagination:** Implement pagination for large datasets
3. **Batch Operations:** Allow logging multiple items at once
4. **Indexing:** Index userId and date fields for fast queries

---

## Future Enhancement Ideas

- [ ] Add export to CSV/PDF
- [ ] Add comparison with other users (anonymized)
- [ ] Add goal-based workout recommendations
- [ ] Add nutrition database integration
- [ ] Add wearable device integration
- [ ] Add push notifications for streaks
- [ ] Add social sharing
- [ ] Add detailed analytics dashboard
