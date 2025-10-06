require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const apiRoutes = require('./routes');

const app = express();

// Connect to MongoDB
connectDB();

// ✅ CORS configuration
const allowedOrigins = [
  'http://localhost:5173',                // Local frontend
  'https://marking-client.vercel.app'     // Deployed frontend
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', apiRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: '🏫 College Competition Marking & Leaderboard System API',
    version: '1.0.0',
    status: 'Running',
    developer: 'K Rabindra Nath Senapaty'
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ❌ No app.listen() here for Vercel
module.exports = app;
