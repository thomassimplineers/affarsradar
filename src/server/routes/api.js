const express = require('express');
const router = express.Router();

// Import controllers
const insightsController = require('../controllers/insightsController');
const recommendationsController = require('../controllers/recommendationsController');

// Insights routes
router.get('/insights', insightsController.getInsights);
router.post('/insights', insightsController.createInsight);

// Recommendations routes
router.get('/recommendations', recommendationsController.getRecommendations);
router.post('/recommendations', recommendationsController.createRecommendation);

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

module.exports = router;
