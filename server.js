const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Database connection
const authRoutes = require('./routes/auth'); // Authentication routes
const exerciseRoutes = require('./routes/exercises'); // Exercise routes

// Load environment variables
dotenv.config();

// Initialize the app
const app = express();

// Middleware
app.use(cors('*')); // Enable CORS
app.use(express.json()); // Parse incoming JSON data

// Connect to database
connectDB();

// Routes
app.use('/api/auth', authRoutes); // Auth routes
app.use('/api/exercises', exerciseRoutes); // Exercise routes

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error', error: err.message });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
