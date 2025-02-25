const express = require('express');
const router = express.Router();

// Import middleware
const { requireAuth } = require('../middleware/auth');

// Import controllers
const insightsController = require('../controllers/insightsController');
const recommendationsController = require('../controllers/recommendationsController');
const userController = require('../controllers/userController');

// Import services
const supabaseService = require('../services/supabaseService');

// Public routes
// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Profile creation route (används vid registrering)
router.post('/create-profile', async (req, res) => {
  try {
    const { userId, profileData } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    // Validera profileData för att undvika ogiltig data
    if (profileData && typeof profileData !== 'object') {
      return res.status(400).json({ message: 'Profile data must be an object' });
    }
    
    // Säkerställ att endast tillåtna fält finns i profileData
    const allowedFields = ['name', 'industry', 'email', 'company'];
    const sanitizedProfileData = {};
    
    if (profileData) {
      Object.keys(profileData).forEach(key => {
        if (allowedFields.includes(key)) {
          sanitizedProfileData[key] = profileData[key];
        }
      });
    }
    
    const supabase = supabaseService.getClient();
    // Verify user exists in auth (except in test mode)
    if (!supabaseService.isTestMode) {
      try {
        // Använder getAdminClient för att få tillgång till admin-funktionalitet
        const adminClient = supabaseService.getAdminClient();
        if (adminClient) {
          // Använder en mer pålitlig metod för att verifiera användaren
          const { data, error } = await adminClient.auth.admin.getUserById(userId);
          if (error || !data.user) {
            return res.status(404).json({ message: 'User not found in auth' });
          }
        } else {
          console.warn('No admin client available, skipping user verification');
          // Fortsätt utan verifiering eftersom vi inte har admin-rättigheter
        }
      } catch (error) {
        console.warn('Unable to verify user in auth:', error);
        // Continue anyway, as this might be due to missing admin rights
      }
    }
    
    // Create profile using the service
    const profile = await supabaseService.createProfile(userId, sanitizedProfileData);
    
    res.status(201).json(profile);
  } catch (error) {
    console.error('Error creating profile:', error);
    res.status(500).json({ message: error.message });
  }
});

// Protected routes - require authentication
// Apply requireAuth middleware to all protected routes

// Insights routes
router.get('/insights', requireAuth, insightsController.getInsights);
router.post('/insights', requireAuth, insightsController.createInsight);
router.post('/insights/generate', requireAuth, insightsController.generateInsights);

// Recommendations routes
router.get('/recommendations', requireAuth, recommendationsController.getRecommendations);
router.post('/recommendations', requireAuth, recommendationsController.createRecommendation);
router.post('/recommendations/generate', requireAuth, recommendationsController.generateRecommendations);

// User routes
router.get('/user', requireAuth, userController.getCurrentUser);
router.get('/user/settings', requireAuth, userController.getUserSettings);
router.put('/user/settings', requireAuth, userController.updateUserSettings);

module.exports = router;
