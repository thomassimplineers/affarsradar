require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Import routes
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || true
    : 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '1mb' })); // Limit request size

// Basic security headers
app.use((req, res, next) => {
  // Hjälper till att skydda mot clickjacking-attacker
  res.setHeader('X-Frame-Options', 'DENY');
  // Hjälper till att skydda mot XSS-attacker
  res.setHeader('X-XSS-Protection', '1; mode=block');
  // Hjälper till att skydda mot MIME-sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
});

// API Routes
app.use('/api', apiRoutes);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // I Vercel behöver vi inte hantera statiska filer här, 
  // vercel.json sköter detta genom routing
  app.get('*', (req, res) => {
    res.status(404).json({ message: 'API endpoint not found' });
  });
} else {
  // För lokal utveckling, hantera 404 för API:er
  app.get('*', (req, res) => {
    res.status(404).json({ message: 'API endpoint not found' });
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Start server if not in serverless environment
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// För Vercel serverless deployment
module.exports = app;
