require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const apiRoutes = require('./routes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
// const allowedOrigins = (process.env.FRONTEND_URL || '')
//   .split(',')
//   .map(url => url.trim())
//   .filter(Boolean);

// app.use(cors({
//   origin:true, // Allow all origins for development; change in production
//   credentials: true
// }));

// const allowedOrigins = [
//   "http://localhost:5173",
//   "https://marking-client.vercel.app/"
//    // change this to your actual frontend URL
// ];

// // ✅ Enable CORS before routes
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       // Allow requests with no origin (like mobile apps or curl)
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//   })
// );

app.use(cors())

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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
//   console.log(`📊 College Marking System API is ready!`);
//   console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL}`);
// });

module.exports = app; // ✅ Required for Vercel