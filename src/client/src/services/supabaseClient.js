import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const isTestMode = !supabaseUrl || !supabaseAnonKey; // Aktivera testläge endast när miljövariabler saknas

// Mock data för testläge
const mockData = {
  users: [
    {
      id: 'test-user-1',
      email: 'test@example.com',
      name: 'Test User',
      industry: 'Technology'
    }
  ],
  profiles: [
    {
      id: 'test-user-1',
      name: 'Test User',
      industry: 'Technology',
      created_at: '2025-02-25T10:00:00Z'
    }
  ],
  userSettings: {
    'test-user-1': {
      theme: 'light',
      notifications: true,
      language: 'sv'
    }
  }
};

// Skapa en mock Supabase-klient för testläge
const createMockClient = () => {
  console.log('Creating mock Supabase client for testing');
  
  return {
    auth: {
      getUser: async () => {
        console.log('Mock getUser');
        return { data: { user: mockData.users[0] }, error: null };
      },
      getSession: async () => {
        console.log('Mock getSession');
        return { 
          data: { 
            session: {
              access_token: 'mock-test-token-123456',
              user: mockData.users[0]
            } 
          }, 
          error: null 
        };
      },
      signInWithPassword: async ({ email, password }) => {
        console.log(`Mock sign in with ${email}`);
        const user = mockData.users.find(u => u.email === email);
        if (user) {
          return { data: { user }, error: null };
        }
        return { data: null, error: { message: 'Invalid login credentials' } };
      },
      signUp: async ({ email, password }) => {
        console.log(`Mock sign up for ${email}`);
        const newUser = {
          id: `user-${Date.now()}`,
          email,
          name: email.split('@')[0],
          industry: 'Not specified'
        };
        mockData.users.push(newUser);
        return { data: { user: newUser }, error: null };
      },
      signOut: async () => {
        console.log('Mock sign out');
        return { error: null };
      },
      onAuthStateChange: (callback) => {
        console.log('Mock onAuthStateChange registered');
        // Simulera en initial callback med nuvarande användare
        setTimeout(() => {
          callback('SIGNED_IN', { user: mockData.users[0] });
        }, 0);
        
        // Returnera en unsubscribe-funktion
        return {
          data: {
            subscription: {
              unsubscribe: () => {
                console.log('Mock auth subscription unsubscribed');
              }
            }
          }
        };
      }
    },
    from: (table) => {
      return {
        select: (columns) => {
          return {
            eq: (column, value) => {
              return {
                single: async () => {
                  console.log(`Mock select from ${table} where ${column} = ${value}`);
                  if (table === 'profiles') {
                    const profile = mockData.profiles.find(p => p[column] === value);
                    return { data: profile || null, error: null };
                  } else if (table === 'user_settings') {
                    const settings = mockData.userSettings[value];
                    return { data: settings ? { settings } : null, error: null };
                  }
                  return { data: null, error: null };
                }
              };
            }
          };
        },
        insert: (data) => {
          return {
            select: async () => {
              console.log(`Mock insert into ${table}`, data);
              if (table === 'profiles') {
                mockData.profiles.push(data[0]);
                return { data, error: null };
              }
              return { data, error: null };
            }
          };
        },
        update: (updates) => {
          return {
            eq: (column, value) => {
              return {
                select: async () => {
                  console.log(`Mock update ${table} where ${column} = ${value}`, updates);
                  if (table === 'profiles') {
                    const profileIndex = mockData.profiles.findIndex(p => p[column] === value);
                    if (profileIndex !== -1) {
                      mockData.profiles[profileIndex] = { ...mockData.profiles[profileIndex], ...updates };
                      return { data: [mockData.profiles[profileIndex]], error: null };
                    }
                  }
                  return { data: [], error: null };
                }
              };
            }
          };
        },
        upsert: (data) => {
          return {
            select: async () => {
              console.log(`Mock upsert into ${table}`, data);
              if (table === 'user_settings') {
                mockData.userSettings[data.user_id] = data.settings;
                return { data: [data], error: null };
              }
              return { data: [data], error: null };
            }
          };
        }
      };
    }
  };
};

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Make sure to set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in .env file.');
}

// Använd mock-klienten i testläge, annars den riktiga Supabase-klienten
let supabaseClient;
if (isTestMode) {
  console.log('🧪 Running in TEST MODE with mock data - login and registration will not connect to real database');
  supabaseClient = createMockClient();
} else {
  console.log('🚀 Running in PRODUCTION MODE with real Supabase connection');
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = supabaseClient;

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
      // Create profile via backend API to bypass RLS
      try {
        const response = await fetch('/api/create-profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: data.user.id,
            profileData,
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Profile creation error:', errorData);
          throw new Error(errorData.message || 'Failed to create profile');
        }
      } catch (profileError) {
        console.error('Error creating profile:', profileError);
        // Continue anyway, we don't want to block sign up if profile creation fails
      }
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
