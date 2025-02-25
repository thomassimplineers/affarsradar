const supabaseService = require('../services/supabaseService');

// Get current user info
const getCurrentUser = async (req, res) => {
  try {
    // In a real application, this would be extracted from a JWT token
    // For now, we'll just use a query parameter for testing
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized - User ID required' });
    }
    
    // Get user from Supabase
    const supabase = supabaseService.getClient();
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      
      if (!data) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      return res.status(200).json({
        id: data.id,
        name: data.name,
        email: data.email || 'user@example.com', // Fallback for testing
        industry: data.industry,
        createdAt: data.created_at
      });
    } catch (dbError) {
      console.warn('Error getting user from database:', dbError);
      
      // Return mock user data for testing
      return res.status(200).json({
        id: userId,
        name: 'Test User',
        email: 'user@example.com',
        industry: 'Technology',
        createdAt: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user settings
const getUserSettings = async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized - User ID required' });
    }
    
    // Get user settings from database
    try {
      const settings = await supabaseService.getUserSettings(userId);
      return res.status(200).json(settings);
    } catch (dbError) {
      console.warn('Error getting user settings from database:', dbError);
      
      // Return default settings
      return res.status(200).json({
        notifications: true,
        weeklyDigest: true,
        theme: 'light',
        language: 'sv-SE'
      });
    }
  } catch (error) {
    console.error('Error in getUserSettings:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update user settings
const updateUserSettings = async (req, res) => {
  try {
    const { userId } = req.query;
    const settings = req.body;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized - User ID required' });
    }
    
    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({ message: 'Settings object required' });
    }
    
    // Save settings to database
    try {
      const updatedSettings = await supabaseService.saveUserSettings(userId, settings);
      return res.status(200).json(updatedSettings);
    } catch (dbError) {
      console.warn('Error saving user settings to database:', dbError);
      
      // Return mock response
      return res.status(200).json({
        id: Date.now().toString(),
        user_id: userId,
        settings,
        updated_at: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Error in updateUserSettings:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getCurrentUser,
  getUserSettings,
  updateUserSettings
};
