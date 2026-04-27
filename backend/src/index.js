const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const gymRoutes = require('./routes/gymRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const coachRoutes = require('./routes/coachRoutes');
const discoveryRoutes = require('./routes/discoveryRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const fitnessTrackerRoutes = require('./routes/fitnessTrackerRoutes');
const comparisonRoutes = require('./routes/comparisonRoutes');
const { notFoundHandler, errorHandler } = require('./utils/responseHandler');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'gymease-backend' });
});

app.use('/api/gyms', gymRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/coach', coachRoutes);
app.use('/api/discovery', discoveryRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/fitness', fitnessTrackerRoutes);
app.use('/api/comparison', comparisonRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 GymEase backend running on port ${PORT}`);
});

module.exports = app;
