const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
dotenv.config({
  path: process.env.NODE_ENV === 'production' 
    ? '.env.production' 
    : '.env.development'
});

const passport = require('./configs/passport');
const connectDB = require('./configs/db');
const userRoute = require('./routes/user-route');
const personalizeRoute = require('./routes/personalize-route');
const progressRoute = require('./routes/progress-route')

const PORT = process.env.PORT || 5000;

const app = express();
app.set('trust proxy', 1)
app.use(passport.initialize());
// Connect to database
connectDB();


// Simple CORS setup - NO app.options('*')
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));


// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Simple request logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// API routes
app.use('/api/user', userRoute);
app.use('/api/learn', personalizeRoute);
app.use('/api/user/progress',progressRoute)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// 404 handler - use a specific path instead of '*'
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode`);
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 Health check`);
});