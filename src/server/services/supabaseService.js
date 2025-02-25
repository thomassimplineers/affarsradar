const { createClient } = require('@supabase/supabase-js');

/**
 * Supabase client for database operations
 */
class SupabaseService {
  constructor() {
    this.supabaseUrl = process.env.SUPABASE_URL;
    this.supabaseKey = process.env.SUPABASE_ANON_KEY;
    this.supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!this.supabaseUrl || !this.supabaseKey) {
      console.warn('Warning: SUPABASE_URL or SUPABASE_ANON_KEY is not set in environment variables');
    }
    
    this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
    
    // Service role client for admin operations (use with caution)
    if (this.supabaseServiceKey) {
      this.adminSupabase = createClient(this.supabaseUrl, this.supabaseServiceKey);
    }
  }
  
  /**
   * Get the Supabase client
   * @returns {Object} - Supabase client
   */
  getClient() {
    return this.supabase;
  }
  
  /**
   * Get the admin Supabase client (with service role key)
   * @returns {Object} - Admin Supabase client
   */
  getAdminClient() {
    if (!this.adminSupabase) {
      console.warn('Admin Supabase client not available: SUPABASE_SERVICE_ROLE_KEY not set');
      return null;
    }
    return this.adminSupabase;
  }

  /**
   * Save insights to database
   * @param {Object} insights - Insights data
   * @param {string} userId - User ID (optional)
   * @returns {Promise<Object>} - Saved insights
   */
  async saveInsights(insights, userId = null) {
    try {
      const { data, error } = await this.supabase
        .from('insights')
        .insert([
          {
            user_id: userId,
            industry_trends: insights.industryTrends,
            market_opportunities: insights.marketOpportunities,
            weekly_challenge: insights.weeklyChallenge,
            created_at: new Date().toISOString()
          }
        ])
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error saving insights to Supabase:', error);
      throw error;
    }
  }

  /**
   * Get insights from database
   * @param {string} userId - User ID (optional)
   * @param {number} limit - Number of insights to return
   * @returns {Promise<Array>} - Insights
   */
  async getInsights(userId = null, limit = 10) {
    try {
      let query = this.supabase
        .from('insights')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
        
      if (userId) {
        query = query.eq('user_id', userId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Transform from database format to application format
      return data.map(item => ({
        id: item.id,
        industryTrends: item.industry_trends,
        marketOpportunities: item.market_opportunities,
        weeklyChallenge: item.weekly_challenge,
        createdAt: item.created_at
      }));
    } catch (error) {
      console.error('Error getting insights from Supabase:', error);
      throw error;
    }
  }

  /**
   * Save recommendations to database
   * @param {Object} recommendations - Recommendations data
   * @param {string} userId - User ID (optional)
   * @returns {Promise<Object>} - Saved recommendations
   */
  async saveRecommendations(recommendations, userId = null) {
    try {
      const { data, error } = await this.supabase
        .from('recommendations')
        .insert([
          {
            user_id: userId,
            contacts: recommendations.contacts,
            actions: recommendations.actions,
            learning_tip: recommendations.learningTip,
            created_at: new Date().toISOString()
          }
        ])
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error saving recommendations to Supabase:', error);
      throw error;
    }
  }

  /**
   * Get recommendations from database
   * @param {string} userId - User ID (optional)
   * @param {number} limit - Number of recommendations to return
   * @returns {Promise<Array>} - Recommendations
   */
  async getRecommendations(userId = null, limit = 10) {
    try {
      let query = this.supabase
        .from('recommendations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
        
      if (userId) {
        query = query.eq('user_id', userId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Transform from database format to application format
      return data.map(item => ({
        id: item.id,
        contacts: item.contacts,
        actions: item.actions,
        learningTip: item.learning_tip,
        createdAt: item.created_at
      }));
    } catch (error) {
      console.error('Error getting recommendations from Supabase:', error);
      throw error;
    }
  }

  /**
   * Save user settings to database
   * @param {string} userId - User ID
   * @param {Object} settings - User settings
   * @returns {Promise<Object>} - Saved settings
   */
  async saveUserSettings(userId, settings) {
    try {
      const { data, error } = await this.supabase
        .from('user_settings')
        .upsert([
          {
            user_id: userId,
            settings: settings,
            updated_at: new Date().toISOString()
          }
        ])
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error saving user settings to Supabase:', error);
      throw error;
    }
  }

  /**
   * Get user settings from database
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - User settings
   */
  async getUserSettings(userId) {
    try {
      const { data, error } = await this.supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned", which is fine
      
      return data?.settings || {};
    } catch (error) {
      console.error('Error getting user settings from Supabase:', error);
      throw error;
    }
  }
}

module.exports = new SupabaseService();
