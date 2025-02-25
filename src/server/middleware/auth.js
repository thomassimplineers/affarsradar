const supabaseService = require('../services/supabaseService');

/**
 * Middleware for verifying JWT tokens from Supabase Auth
 * This ensures API endpoints can only be accessed by authenticated users
 */
const requireAuth = async (req, res, next) => {
  try {
    // In test mode, skip authentication completely
    if (supabaseService.isTestMode) {
      console.log('Test mode detected in auth middleware - skipping token verification');
      req.user = { id: 'test-user-1', email: 'test@example.com' };
      return next();
    }
    
    // Get the authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        message: 'Åtkomst nekad: Ingen autentiseringstoken tillhandahållen' 
      });
    }
    
    // Extract the token
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        message: 'Åtkomst nekad: Ogiltig token' 
      });
    }
    
    // Verify the token with Supabase
    const supabase = supabaseService.getClient();
    const { data, error } = await supabase.auth.getUser(token);
    
    if (error || !data.user) {
      return res.status(401).json({ 
        message: 'Åtkomst nekad: Ogiltig eller utgången token',
        error: error?.message 
      });
    }
    
    // Attach the user to the request
    req.user = data.user;
    
    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ 
      message: 'Serverfel vid autentisering',
      error: error.message 
    });
  }
};

module.exports = { requireAuth }; 