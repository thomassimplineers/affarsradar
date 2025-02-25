import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase, getUserProfile } from '../services/supabaseClient';

// Create context
const AuthContext = createContext(null);

// Context provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for user session on mount
  useEffect(() => {
    const checkUser = async () => {
      try {
        setLoading(true);

        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Get full user profile
          const profile = await getUserProfile();
          setUser(profile || session.user);
        } else {
          setUser(null);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error checking authentication:', err);
        setError(err.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // Get full user profile
        const profile = await getUserProfile();
        setUser(profile || session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    // Clean up subscription
    return () => {
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Sign in
  const signIn = async (email, password) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Get full user profile
      if (data?.user) {
        const profile = await getUserProfile();
        setUser(profile || data.user);
      }
      
      return { success: true };
    } catch (err) {
      console.error('Error signing in:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Sign up
  const signUp = async (email, password, profileData = {}) => {
    try {
      setLoading(true);
      
      // Register user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Create profile using the backend API to bypass RLS
      if (data?.user) {
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
            console.warn('Profile creation error:', errorData);
            // Continue anyway, we'll still set user data
          }
        } catch (profileError) {
          console.warn('Error creating profile via API:', profileError);
          // Profile creation failure shouldn't block sign up
        }
        
        // Set user with profile data
        setUser({
          ...data.user,
          ...profileData,
        });
      }
      
      return { success: true };
    } catch (err) {
      console.error('Error signing up:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      setUser(null);
      return { success: true };
    } catch (err) {
      console.error('Error signing out:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      return { success: true };
    } catch (err) {
      console.error('Error resetting password:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (updates) => {
    try {
      setLoading(true);
      
      if (!user?.id) {
        throw new Error('User not authenticated');
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select();
      
      if (error) throw error;
      
      // Update local user state
      setUser({
        ...user,
        ...updates,
      });
      
      return { success: true, data: data?.[0] };
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const value = {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
