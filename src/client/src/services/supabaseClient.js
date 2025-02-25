import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Make sure to set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Get user profile
 * @returns {Promise<Object>} User profile or null
 */
export const getUserProfile = async () => {
  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) throw userError;
    
    if (!user) return null;
    
    // Get the user's profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (profileError && profileError.code !== 'PGRST116') throw profileError; // PGRST116 is "no rows returned", which is fine
    
    return {
      ...profile,
      email: user.email,
    };
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

/**
 * Sign in with email and password
 * @param {string} email Email
 * @param {string} password Password
 * @returns {Promise<{user: Object, error: Error}>} User data and error
 */
export const signIn = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return { user: data?.user || null, error };
  } catch (error) {
    console.error('Error signing in:', error);
    return { user: null, error };
  }
};

/**
 * Sign up with email and password
 * @param {string} email Email
 * @param {string} password Password
 * @param {Object} profileData Additional profile data
 * @returns {Promise<{user: Object, error: Error}>} User data and error
 */
export const signUp = async (email, password, profileData = {}) => {
  try {
    // Sign up the user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) throw error;
    
    if (data?.user) {
      // Create profile entry
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            name: profileData.name || '',
            industry: profileData.industry || '',
            created_at: new Date().toISOString(),
          },
        ]);
      
      if (profileError) throw profileError;
    }
    
    return { user: data?.user || null, error: null };
  } catch (error) {
    console.error('Error signing up:', error);
    return { user: null, error };
  }
};

/**
 * Sign out
 * @returns {Promise<{error: Error}>} Error
 */
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (error) {
    console.error('Error signing out:', error);
    return { error };
  }
};

/**
 * Update user profile
 * @param {string} userId User ID
 * @param {Object} updates Profile updates
 * @returns {Promise<{data: Object, error: Error}>} Updated data and error
 */
export const updateProfile = async (userId, updates) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select();
    
    return { data: data?.[0] || null, error };
  } catch (error) {
    console.error('Error updating profile:', error);
    return { data: null, error };
  }
};

/**
 * Get user settings
 * @param {string} userId User ID
 * @returns {Promise<{data: Object, error: Error}>} Settings data and error
 */
export const getUserSettings = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    return { data: data?.settings || {}, error };
  } catch (error) {
    console.error('Error getting user settings:', error);
    return { data: {}, error };
  }
};

/**
 * Update user settings
 * @param {string} userId User ID
 * @param {Object} settings Settings object
 * @returns {Promise<{data: Object, error: Error}>} Updated settings and error
 */
export const updateUserSettings = async (userId, settings) => {
  try {
    const { data, error } = await supabase
      .from('user_settings')
      .upsert({
        user_id: userId,
        settings,
        updated_at: new Date().toISOString(),
      })
      .select();
    
    return { data: data?.[0] || null, error };
  } catch (error) {
    console.error('Error updating user settings:', error);
    return { data: null, error };
  }
};

export default supabase;
