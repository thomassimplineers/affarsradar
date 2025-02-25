const express = require('express');
const router = express.Router();

// Import controllers
const insightsController = require('../controllers/insightsController');
const recommendationsController = require('../controllers/recommendationsController');
const userController = require('../controllers/userController');

// Insights routes
router.get('/insights', insightsController.getInsights);
router.post('/insights', insightsController.createInsight);
router.post('/insights/generate', insightsController.generateInsights);

// Recommendations routes
router.get('/recommendations', recommendationsController.getRecommendations);
router.post('/recommendations', recommendationsController.createRecommendation);
router.post('/recommendations/generate', recommendationsController.generateRecommendations);

// User routes - will implement userController next
router.get('/user', userController.getCurrentUser);
router.get('/user/settings', userController.getUserSettings);
router.put('/user/settings', userController.updateUserSettings);

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

module.exports = router;
