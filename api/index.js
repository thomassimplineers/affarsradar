// Minimal serverless function för Vercel
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Enkel middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/test', (req, res) => {
  res.status(200).json({ message: 'API is working!' });
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Catch-all route
app.use('*', (req, res) => {
  res.status(200).json({ 
    message: 'AffärsRadar API',
    endpoint: req.baseUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// För Vercel serverless deployment
module.exports = app; 