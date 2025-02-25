import axios from 'axios';
import { supabase } from './supabaseClient';

// Skapa en axios-instans med bas-URL
const API_URL = process.env.NODE_ENV === 'production'
  ? '/api' // Vid produktion, använd relativ väg
  : 'http://localhost:5001/api'; // Vid utveckling, använd faktisk URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor för att lägga till auth-token för alla anrop
api.interceptors.request.use(async (config) => {
  try {
    // Hämta session från Supabase
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) throw error;
    
    // Om vi har en giltig session, använd access_token som Bearer token
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    } else {
      console.warn('No valid session found when making API request');
    }
    
    return config;
  } catch (error) {
    console.error('Error adding auth token to request:', error);
    return config;
  }
}, error => {
  console.error('Request interceptor error:', error);
  return Promise.reject(error);
});

// Response interceptor för att standardisera felhantering
api.interceptors.response.use(response => {
  return response;
}, error => {
  // Standardisera felmeddelanden
  const customError = {
    message: error.response?.data?.message || error.message || 'Ett okänt fel inträffade',
    status: error.response?.status,
    data: error.response?.data
  };
  
  // Logga felet för debugging
  console.error('API Error:', customError);
  
  // Session timeouts eller auth-fel
  if (customError.status === 401) {
    console.warn('Authentication error - might need to re-login');
    // Här kan vi lägga till logik för att redirecta till login om nödvändigt
  }
  
  return Promise.reject(customError);
});

/**
 * Service for making API calls to the backend
 * Automatically adds authentication token to requests
 */
class ApiService {
  constructor() {
    this.api = api;
  }
  
  /**
   * Get insights from the backend
   * @returns {Promise} Promise with insights data
   */
  async getInsights() {
    try {
      const response = await this.api.get('/insights');
      return response.data;
    } catch (error) {
      console.error('Error fetching insights:', error);
      throw error;
    }
  }
  
  /**
   * Generate new insights based on industry
   * @param {string} industry - The industry to generate insights for
   * @returns {Promise} Promise with generated insights
   */
  async generateInsights(industry) {
    try {
      const response = await this.api.post('/insights/generate', { industry });
      return response.data;
    } catch (error) {
      console.error('Error generating insights:', error);
      throw error;
    }
  }
  
  /**
   * Get recommendations from the backend
   * @returns {Promise} Promise with recommendations data
   */
  async getRecommendations() {
    try {
      const response = await this.api.get('/recommendations');
      return response.data;
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      throw error;
    }
  }
  
  /**
   * Generate new recommendations based on contacts and interactions
   * @param {Array} contacts - List of contacts
   * @param {Array} interactions - List of previous interactions
   * @returns {Promise} Promise with generated recommendations
   */
  async generateRecommendations(contacts, interactions) {
    try {
      const response = await this.api.post('/recommendations/generate', {
        contacts,
        interactions
      });
      return response.data;
    } catch (error) {
      console.error('Error generating recommendations:', error);
      throw error;
    }
  }
  
  /**
   * Get current user information
   * @returns {Promise} Promise with user data
   */
  async getCurrentUser() {
    try {
      const response = await this.api.get('/user');
      return response.data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  }
  
  /**
   * Get user settings
   * @returns {Promise} Promise with user settings
   */
  async getUserSettings() {
    try {
      const response = await this.api.get('/user/settings');
      return response.data;
    } catch (error) {
      console.error('Error fetching user settings:', error);
      throw error;
    }
  }
  
  /**
   * Update user settings
   * @param {Object} settings - User settings to update
   * @returns {Promise} Promise with updated settings
   */
  async updateUserSettings(settings) {
    try {
      const response = await this.api.put('/user/settings', settings);
      return response.data;
    } catch (error) {
      console.error('Error updating user settings:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export default new ApiService(); 