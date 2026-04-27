# GymEase Enhanced Architecture Overview

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      GYMEASE APPLICATION                         │
└─────────────────────────────────────────────────────────────────┘

                          ┌──────────────┐
                          │  Frontend    │
                          │  (React)     │
                          └──────┬───────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
        ▼                        ▼                        ▼
   ┌─────────────┐         ┌─────────────┐         ┌─────────────┐
   │   Smart     │         │  Fitness    │         │   Existing  │
   │ Recommend   │         │  Tracker    │         │  Features   │
   │  Engine     │         │             │         │             │
   └─────────────┘         └─────────────┘         └─────────────┘
        │                        │                        │
        │ HTTP Request           │ HTTP Request           │ HTTP Request
        ▼                        ▼                        ▼
   ┌─────────────────────────────────────────────────────────────┐
   │              Express Backend (Node.js)                       │
   │                                                              │
   │  ┌─────────────┐  ┌─────────────┐  ┌──────────────────┐   │
   │  │Recommend    │  │Fitness      │  │Existing Routes   │   │
   │  │Routes       │  │Routes       │  │(Gym, Booking...) │   │
   │  └──────┬──────┘  └──────┬──────┘  └──────────────────┘   │
   │         │                │                                  │
   │  ┌──────▼──────┐  ┌──────▼──────┐                         │
   │  │Recommend    │  │Fitness      │                         │
   │  │Controller   │  │Controller   │                         │
   │  └──────┬──────┘  └──────┬──────┘                         │
   │         │                │                                  │
   │  ┌──────▼──────┐  ┌──────▼──────┐                         │
   │  │Recommend    │  │Fitness      │                         │
   │  │Model        │  │Model        │                         │
   │  │(Scoring)    │  │(Tracking)   │                         │
   │  └─────────────┘  └─────────────┘                         │
   │                                                              │
   └─────────────────────────────────────────────────────────────┘
                          │
                          ▼
                  ┌────────────────┐
                  │ In-Memory Data │
                  │   (Ready for   │
                  │   Firebase/DB) │
                  └────────────────┘
```

---

## Feature Flow Diagrams

### Smart Recommendation Flow

```
┌────────────────────────────────┐
│   User Opens Recommendations   │
└──────────────┬─────────────────┘
               │
               ▼
┌────────────────────────────────┐
│  Step 1: Enter Preferences     │
│  • Budget (₹1000-₹10000)       │
│  • Goals (select multiple)     │
│  • Preferred Time              │
│  • Max Distance                │
│  • City (optional)             │
└──────────────┬─────────────────┘
               │
               ▼
    ┌──────────────────────┐
    │ Get Recommendations  │
    │ API Call             │
    └──────────┬───────────┘
               │
               ▼
┌────────────────────────────────────┐
│    Recommendation Algorithm         │
│  Calculates Score For Each Gym:    │
│  ┌──────────────────────────────┐  │
│  │ Price Match        (30%)     │  │
│  │ Facilities Match   (25%)     │  │
│  │ Distance Score     (20%)     │  │
│  │ Time Match         (15%)     │  │
│  │ Popularity         (10%)     │  │
│  └──────────────────────────────┘  │
│         ↓                           │
│  Final Score 0-100                 │
│  Rank Gyms by Score                │
│  Return Top 10                      │
└──────────────┬─────────────────────┘
               │
               ▼
┌────────────────────────────────────┐
│  Step 2: View Ranked Results       │
│  • Gym name, price, rating         │
│  • Overall match score             │
│  • Quick score breakdown           │
│  • Ranking badge (#1, #2, etc)    │
└──────────────┬─────────────────────┘
               │
               ▼
    ┌──────────────────────┐
    │ Click for Details    │
    │ (Optional)           │
    └──────────┬───────────┘
               │
               ▼
┌────────────────────────────────────┐
│  Step 3: View Detailed Score       │
│  • Score breakdown (graph)         │
│  • Explanation of match            │
│  • Why recommended?                │
│  • Gym facilities, hours, etc      │
└────────────────────────────────────┘
```

### Fitness Tracker Flow

```
┌────────────────────────────────┐
│   User Opens Fitness Tracker   │
└──────────────┬─────────────────┘
               │
               ▼
┌────────────────────────────────────┐
│   Dashboard View                   │
│  • Total Workouts (stat card)      │
│  • Calories Burned (stat card)     │
│  • Weight Lost (stat card)         │
│  • Current Streak 🔥 (stat card)   │
│  • [+ Log Workout] buttons         │
│  • [+ Log Weight] buttons          │
│  • [+ Log Calories] buttons        │
└──────────────┬─────────────────────┘
               │
      ┌────────┴────────┬─────────────┐
      │                 │             │
      ▼                 ▼             ▼
┌──────────┐      ┌──────────┐  ┌──────────┐
│   Log    │      │   Log    │  │   Log    │
│ Workout  │      │ Weight   │  │ Calories │
└────┬─────┘      └────┬─────┘  └────┬─────┘
     │                 │             │
     ▼                 ▼             ▼
┌─────────────────────────────────────────┐
│   Modal Form Opens                      │
│   • Date picker                         │
│   • Type/Input fields                   │
│   • Notes                               │
│   • Submit Button                       │
└─────────────┬───────────────────────────┘
              │
              ▼
    ┌──────────────────────┐
    │ Save to Backend      │
    │ POST Request         │
    └──────────┬───────────┘
               │
               ▼
┌────────────────────────────────────┐
│  Stats Updated                     │
│  • Total workouts +1               │
│  • Streak updated                  │
│  • Data persisted                  │
└──────────────┬─────────────────────┘
               │
               ▼
┌────────────────────────────────────┐
│  Tab Navigation                    │
│  • Overview (dashboard)            │
│  • Workouts (history list)         │
│  • Weight (trend display)          │
│  • Calories (consumed vs burned)   │
└────────────────────────────────────┘
```

---

## Data Flow Diagram

### Recommendation Engine Data Flow

```
Frontend                    Backend                    Data
────────                    ───────                    ────

User Input ─────────────────→ API Endpoint
(Budget,                       /recommendations
Goals,
Time,
Distance)
                              │
                              ▼
                         Controller
                         Get request
                         Parse params
                              │
                              ▼
                         Recommendation
                         Model
                         ├─ Get all gyms
                         ├─ For each gym:
                         │  ├─ Calculate price score
                         │  ├─ Calculate facilities score
                         │  ├─ Calculate distance score
                         │  ├─ Calculate time score
                         │  ├─ Calculate popularity score
                         │  └─ Combine into final score
                         ├─ Sort by score
                         └─ Return top 10
                              │
                              ▼
                         Response JSON
                         Ranked gyms
                              │
Response ←───────────────────┤
JSON array                     │
of ranked               API Response
gyms with              ←──────┘
scores
```

### Fitness Tracker Data Flow

```
Frontend                    Backend                    Data
────────                    ───────                    ────

User Input ─────────────────→ API Endpoint
(Workout,                      POST /fitness/
Weight,                         :userId/workouts
Calories)
                              │
                              ▼
                         Controller
                         Parse body
                         Validate input
                              │
                              ▼
                         Fitness Model
                         ├─ Create entry
                         ├─ Add to array
                         ├─ Calculate stats
                         └─ Update streaks
                              │
                              ▼
                         Return created entry
                              │
Response ←───────────────────┤
Confirm                       │
created                API Response
                       ←──────┘

Later:
GET Request ──────────→ API Endpoint
(Get fitness data)       GET /fitness/:userId
                              │
                              ▼
                         Fetch from model
                         ├─ All workouts
                         ├─ All weights
                         ├─ All calories
                         ├─ Stats
                         └─ Streaks
                              │
                              ▼
                         Response JSON
                              │
← ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘

Display on            State update
Frontend              (FitnessContext)
├─ Charts
├─ Stats
└─ Lists
```

---

## Component Hierarchy

### Smart Recommendation Component Tree

```
SmartRecommendation
├── Step 1: Preferences Form
│   ├── Budget Input (slider + number)
│   ├── Goals Selection (multi-select buttons)
│   ├── Time Preference (4 buttons)
│   ├── Distance Input (slider + number)
│   ├── City Input (text input)
│   └── Get Recommendations Button
│
└── Step 2: Results View
    ├── Results Header
    ├── Recommendations Grid
    │   ├── GymCard #1
    │   │   ├── Rank Badge
    │   │   ├── Score Badge
    │   │   ├── Gym Info
    │   │   ├── Quick Scores (4 metrics)
    │   │   └── View Details Button
    │   ├── GymCard #2
    │   └── ... more cards
    │
    └── Detailed View (on card click)
        ├── Back Button
        ├── Gym Header (name + score circle)
        ├── Gym Info (address, price, rating)
        ├── Score Breakdown (5 bars)
        ├── Explanation Text
        └── Action Buttons (Trial, Profile)
```

### Fitness Tracker Component Tree

```
FitnessTracker (with FitnessContext)
├── Header
├── Stats Grid
│   ├── Stat Card (Total Workouts)
│   ├── Stat Card (Calories Burned)
│   ├── Stat Card (Weight Lost)
│   └── Stat Card (Current Streak)
├── Quick Log Buttons
│   ├── [+ Log Workout]
│   ├── [+ Log Weight]
│   └── [+ Log Calories]
├── Tab Navigation
│   ├── Overview Tab
│   ├── Workouts Tab
│   ├── Weight Tab
│   └── Calories Tab
├── Tab Content
│   ├── [Overview]
│   │   └── ProgressCharts
│   │       ├── Weekly Workout Bar Chart
│   │       ├── Calorie Balance
│   │       ├── Weight Trend
│   │       ├── Achievement Badges
│   │       ├── Goal Progress Bars
│   │       └── (All custom visualizations)
│   ├── [Workouts]
│   │   └── Workouts List
│   │       ├── Workout Item #1
│   │       ├── Workout Item #2
│   │       └── ... more items
│   ├── [Weight]
│   │   └── Weight List
│   │       ├── Weight Entry #1
│   │       └── ... more entries
│   └── [Calories]
│       └── Calories List
│           ├── Calorie Entry #1
│           └── ... more entries
│
└── Modal Form (on log button click)
    ├── [WorkoutLogger]
    │   ├── Date picker
    │   ├── Type selector
    │   ├── Duration input
    │   ├── Intensity selector
    │   ├── Calories burned input
    │   ├── Exercises list
    │   └── Notes textarea
    ├── [WeightTracker]
    │   ├── Date picker
    │   ├── Weight input
    │   ├── Unit selector
    │   └── Notes textarea
    └── [CalorieTracker]
        ├── Date picker
        ├── Type selector (consumed/burned)
        ├── Calories input
        ├── Meal selector
        └── Notes textarea
```

---

## API Endpoint Map

```
REQUEST: GET /api/recommendations
├── Query Params: budget, goals, preferredTime, maxDistance, latitude, longitude, city
├── Processing: Score each gym, sort by score
└── Response: Array of ranked gyms with scores

REQUEST: GET /api/recommendations/:gymId
├── Query Params: budget, goals, preferredTime, maxDistance, latitude, longitude
├── Processing: Calculate detailed scores for one gym
└── Response: Gym details + detailed score breakdown

REQUEST: POST /api/fitness/:userId/workouts
├── Body: { date, type, duration, caloriesBurned, notes, intensity, exercises }
├── Processing: Create workout, update stats, update streak
└── Response: Created workout object

REQUEST: GET /api/fitness/:userId/workouts
├── Query: days
├── Processing: Filter workouts by date range
└── Response: Array of workouts

REQUEST: POST /api/fitness/:userId/weights
├── Body: { date, weight, unit, notes }
├── Processing: Create weight entry, calculate weight loss
└── Response: Created weight object

REQUEST: GET /api/fitness/:userId/weights
├── Query: days
├── Processing: Filter weights by date range
└── Response: Array of weight entries

REQUEST: POST /api/fitness/:userId/calories
├── Body: { date, calories, type, meal, notes }
├── Processing: Create calorie entry
└── Response: Created calorie object

REQUEST: GET /api/fitness/:userId/calories
├── Query: days
├── Processing: Filter calories by date range
└── Response: Array of calorie entries

REQUEST: GET /api/fitness/:userId/weekly-summary
├── Processing: Aggregate weekly workout data
└── Response: Weekly stats object

REQUEST: GET /api/fitness/:userId/monthly-progress
├── Processing: Aggregate monthly data, calculate weight change
└── Response: Monthly progress object
```

---

## State Management Structure

### FitnessContext State

```
FitnessContext
│
├── State
│   ├── fitnessData
│   │   ├── workouts: Workout[]
│   │   ├── weights: Weight[]
│   │   ├── calories: Calorie[]
│   │   ├── stats
│   │   │   ├── totalWorkouts: number
│   │   │   ├── totalCaloriesBurned: number
│   │   │   ├── totalWeightLost: number
│   │   │   └── averageWeeklyWorkouts: number
│   │   └── streaks
│   │       ├── currentStreak: number
│   │       ├── longestStreak: number
│   │       └── lastWorkoutDate: Date
│   │
│   ├── weeklySummary
│   │   ├── week: { start, end }
│   │   ├── workoutCount: number
│   │   ├── caloriesBurned: number
│   │   ├── workoutsByType: object
│   │   └── averageDuration: number
│   │
│   ├── monthlyProgress
│   │   ├── month: string
│   │   ├── workoutCount: number
│   │   ├── totalCaloriesBurned: number
│   │   ├── startWeight: number
│   │   ├── currentWeight: number
│   │   ├── weightChange: number
│   │   └── weightLoss: boolean
│   │
│   ├── loading: boolean
│   └── error: string | null
│
└── Methods
    ├── loadFitnessData(userId, days)
    ├── logWorkout(userId, workoutData)
    ├── logWeight(userId, weightData)
    ├── logCalorie(userId, calorieData)
    ├── loadWeeklySummary(userId)
    └── loadMonthlyProgress(userId)
```

---

## Database Ready Structure

When upgrading from in-memory to database, these collections/tables needed:

```
RECOMMENDATIONS:
├── Gyms
│   ├── id (primary)
│   ├── name
│   ├── city
│   ├── monthlyPrice
│   ├── rating
│   ├── reviews
│   ├── latitude
│   ├── longitude
│   └── facilities[]

FITNESS_TRACKER:
├── Users
│   ├── id (primary)
│   ├── email
│   └── name
│
├── Workouts
│   ├── id (primary)
│   ├── userId (foreign key)
│   ├── date
│   ├── type
│   ├── duration
│   ├── caloriesBurned
│   ├── intensity
│   ├── exercises[]
│   └── notes
│
├── Weights
│   ├── id (primary)
│   ├── userId (foreign key)
│   ├── date
│   ├── weight
│   ├── unit
│   └── notes
│
└── Calories
    ├── id (primary)
    ├── userId (foreign key)
    ├── date
    ├── calories
    ├── type (consumed/burned)
    ├── meal
    └── notes
```

---

## Performance Optimization Strategy

```
Frontend
├── Lazy Load Pages
│   ├── SmartRecommendation (on demand)
│   └── FitnessTracker (on demand)
├── Memoization
│   ├── useMemo for chart data
│   └── useCallback for handlers
└── Code Splitting (via React.lazy)

Backend
├── Caching
│   ├── Cache recommendations (5-10 min)
│   ├── Cache gym list (24 hours)
│   └── Cache user stats (1 hour)
├── Indexing
│   ├── Index userId for fitness data
│   └── Index date for filtering
└── Pagination
    ├── Limit results per request
    └── Add offset parameter
```

---

**Architecture Version:** 1.0
**Date:** April 27, 2026
**Status:** Production Ready ✅
