const { createClient } = require('@supabase/supabase-js');

/**
 * Supabase client for database operations
 */
class SupabaseService {
  constructor() {
    this.supabaseUrl = process.env.SUPABASE_URL;
    this.supabaseKey = process.env.SUPABASE_ANON_KEY;
    this.supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    this.isTestMode = process.env.CLAUDE_API_KEY === 'dummy_api_key_for_testing';
    
    if (!this.supabaseUrl || !this.supabaseKey) {
      console.warn('Warning: SUPABASE_URL or SUPABASE_ANON_KEY is not set in environment variables');
    }
    
    if (!this.isTestMode) {
      this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
      
      // Service role client for admin operations (use with caution)
      if (this.supabaseServiceKey) {
        this.adminSupabase = createClient(this.supabaseUrl, this.supabaseServiceKey);
      }
    } else {
      console.log('Running in test mode with mock Supabase data');
      // Initialize mock data with pre-filled data for testing
      this.mockData = {
        insights: [
          {
            id: 'mock-insight-1',
            user_id: 'test-user-1',
            industry_trends: [
              { 
                title: 'Ökad efterfrågan på hållbara produkter', 
                description: 'Konsumenter visar allt större intresse för miljövänliga alternativ.',
                sentiment: 'positive'
              },
              { 
                title: 'Digitalisering påskyndas inom traditionella branscher', 
                description: 'Företag inom tillverkningsindustrin investerar mer i digital omställning.',
                sentiment: 'neutral'
              }
            ],
            market_opportunities: [
              {
                title: 'Nya regelverk skapar möjligheter inom compliance',
                description: 'Företag söker lösningar för att anpassa sig till nya EU-direktiv.',
                sentiment: 'positive'
              }
            ],
            weekly_challenge: {
              title: 'Kontakta tre potentiella kunder inom en ny målgrupp',
              description: 'Utforska möjligheter att expandera din kundbas genom att rikta in dig på ett nytt marknadssegment.'
            },
            created_at: new Date().toISOString()
          }
        ],
        recommendations: [
          {
            id: 'mock-recommendation-1',
            user_id: 'test-user-1',
            contacts: [
              {
                name: 'Anna Andersson',
                company: 'Tech Innovations AB',
                reason: 'Har inte haft kontakt på 3 månader, visade intresse för er nya produkt.',
                priority: 'high'
              },
              {
                name: 'Erik Svensson',
                company: 'Framtidens Bygg',
                reason: 'Följ upp efter ert senaste möte om potentiellt samarbete.',
                priority: 'medium'
              }
            ],
            actions: [
              {
                title: 'Skicka ut information om den nya tjänsten',
                description: 'Rikta specifikt mot kunder inom tillverkningsindustrin.',
                deadline: '2025-03-01'
              },
              {
                title: 'Boka in demonstrationer',
                description: 'Visa upp den senaste versionen för intresserade kunder.',
                deadline: '2025-03-15'
              }
            ],
            learning_tip: {
              title: 'Förbättra dina förhandlingstekniker',
              resource: 'Kursen "Effektiv Förhandling i B2B-sammanhang" på LinkedIn Learning'
            },
            created_at: new Date().toISOString()
          }
        ],
        userSettings: {},
        users: [
          {
            id: 'test-user-1',
            email: 'test@example.com',
            name: 'Test User',
            industry: 'Technology'
          }
        ]
      };
    }
  }
  
  /**
   * Get the Supabase client
   * @returns {Object} - Supabase client
   */
  getClient() {
    if (this.isTestMode) {
      return {
        auth: {
          signUp: async ({ email, password }) => {
            console.log(`Mock sign up for ${email}`);
            const newUser = {
              id: `user-${Date.now()}`,
              email,
              name: email.split('@')[0],
              industry: 'Not specified'
            };
            this.mockData.users.push(newUser);
            return { data: { user: newUser }, error: null };
          },
          signIn: async ({ email, password }) => {
            console.log(`Mock sign in for ${email}`);
            const user = this.mockData.users.find(u => u.email === email);
            if (user) {
              return { data: { user }, error: null };
            }
            return { data: null, error: { message: 'Invalid login credentials' } };
          },
          signOut: async () => {
            console.log('Mock sign out');
            return { error: null };
          },
          getUser: async () => {
            return { data: { user: this.mockData.users[0] } };
          }
        }
      };
    }
    return this.supabase;
  }
  
  /**
   * Get the admin Supabase client (with service role key)
   * @returns {Object} - Admin Supabase client
   */
  getAdminClient() {
    if (this.isTestMode) {
      console.log('Using mock admin client in test mode');
      return null;
    }
    
    if (!this.adminSupabase) {
      if (!this.supabaseServiceKey) {
        console.warn('Cannot create admin client: SUPABASE_SERVICE_ROLE_KEY not set in environment');
        return null;
      }
      
      try {
        this.adminSupabase = createClient(this.supabaseUrl, this.supabaseServiceKey);
        console.log('Supabase admin client created successfully');
      } catch (error) {
        console.error('Error creating Supabase admin client:', error);
        return null;
      }
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
      if (this.isTestMode) {
        console.log('Saving mock insights');
        const newInsight = {
          id: `insight-${Date.now()}`,
          user_id: userId,
          industry_trends: insights.industryTrends,
          market_opportunities: insights.marketOpportunities,
          weekly_challenge: insights.weeklyChallenge,
          created_at: new Date().toISOString()
        };
        this.mockData.insights.push(newInsight);
        return newInsight;
      }
      
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
      if (this.isTestMode) {
        console.log('Getting mock insights, mockData.insights=', this.mockData.insights.length);
        let filteredInsights = this.mockData.insights;
        
        if (userId) {
          filteredInsights = filteredInsights.filter(insight => insight.user_id === userId);
        }
        
        // Sort by created_at in descending order
        filteredInsights.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
        // Limit the number of results
        filteredInsights = filteredInsights.slice(0, limit);
        
        // Transform to application format
        return filteredInsights.map(item => ({
          id: item.id,
          industryTrends: item.industry_trends,
          marketOpportunities: item.market_opportunities,
          weeklyChallenge: item.weekly_challenge,
          createdAt: item.created_at
        }));
      }
      
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
      if (this.isTestMode) {
        console.log('Saving mock recommendations');
        const newRecommendation = {
          id: `recommendation-${Date.now()}`,
          user_id: userId,
          contacts: recommendations.contacts,
          actions: recommendations.actions,
          learning_tip: recommendations.learningTip,
          created_at: new Date().toISOString()
        };
        this.mockData.recommendations.push(newRecommendation);
        return newRecommendation;
      }
      
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
      if (this.isTestMode) {
        console.log('Getting mock recommendations, mockData.recommendations=', this.mockData.recommendations.length);
        let filteredRecommendations = this.mockData.recommendations;
        
        if (userId) {
          filteredRecommendations = filteredRecommendations.filter(rec => rec.user_id === userId);
        }
        
        // Sort by created_at in descending order
        filteredRecommendations.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
        // Limit the number of results
        filteredRecommendations = filteredRecommendations.slice(0, limit);
        
        // Transform to application format
        return filteredRecommendations.map(item => ({
          id: item.id,
          contacts: item.contacts,
          actions: item.actions,
          learningTip: item.learning_tip,
          createdAt: item.created_at
        }));
      }
      
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
      if (this.isTestMode) {
        console.log('Saving mock user settings');
        this.mockData.userSettings[userId] = {
          user_id: userId,
          settings: settings,
          updated_at: new Date().toISOString()
        };
        return this.mockData.userSettings[userId];
      }
      
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
      if (this.isTestMode) {
        console.log('Getting mock user settings');
        return this.mockData.userSettings[userId]?.settings || {};
      }
      
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

  /**
   * Create or update a user profile
   * Uses admin rights to bypass RLS (Row Level Security)
   * @param {string} userId - The user ID
   * @param {Object} profileData - Profile data
   * @returns {Promise<Object>} - Created profile
   */
  async createProfile(userId, profileData = {}) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }
      
      if (this.isTestMode) {
        console.log('Creating mock profile for userId:', userId);
        const mockProfile = {
          id: userId,
          name: profileData.name || userId.substring(0, 8),
          industry: profileData.industry || 'Not specified',
          created_at: new Date().toISOString()
        };
        
        // Return mock profile
        return mockProfile;
      }
      
      // Use admin client to bypass RLS
      const client = this.getAdminClient() || this.getClient();
      
      // Check if profile already exists
      const { data: existingProfile } = await client
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (existingProfile) {
        // Update existing profile
        console.log('Updating existing profile for userId:', userId);
        const { data, error } = await client
          .from('profiles')
          .update({
            name: profileData.name || existingProfile.name,
            industry: profileData.industry || existingProfile.industry,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId)
          .select();
        
        if (error) throw error;
        return data[0];
      } else {
        // Create new profile
        console.log('Creating new profile for userId:', userId);
        const { data, error } = await client
          .from('profiles')
          .insert([
            {
              id: userId,
              name: profileData.name || '',
              industry: profileData.industry || '',
              created_at: new Date().toISOString()
            }
          ])
          .select();
        
        if (error) throw error;
        return data[0];
      }
    } catch (error) {
      console.error('Error creating/updating profile:', error);
      throw error;
    }
  }
}

module.exports = new SupabaseService();
