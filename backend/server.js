const result = require('dotenv').config();

if (result.error) {
    console.error('Error loading .env file:', result.error);
} else {
    console.log('Loaded .env file:', result.parsed);
}

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const prakritiRoutes = require('./routes/prakriti');

const app = express();

// Parse JSON bodies FIRST
app.use(express.json());

console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('JWT_SECRET:', process.env.JWT_SECRET);

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/defaultDatabaseName';

mongoose.connect(mongoUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// API routes BEFORE static files (IMPORTANT!)
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/prakriti', prakritiRoutes);

// Static files - serve the frontend folder from project root
// backend is inside ./backend so go up one level and into frontend
app.use(express.static(path.join(__dirname, '../frontend')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
