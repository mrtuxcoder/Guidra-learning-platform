const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
dotenv.config({});

const passport = require('./configs/passport');
const connectDB = require('./configs/db');
const userRoute = require('./routes/user-route');
const teachRoute = require('./routes/teach-route');
const progressRoute = require('./routes/progress-route')
const passwordRoutes = require('./routes/password-routes');

const PORT = process.env.PORT || 5000;

const app = express();

app.use(passport.initialize());
// Connect to database
connectDB();


// Simple CORS setup - NO app.options('*')
// Fix your CORS configuration:
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.CLIENT_URL,
      'http://localhost:5173', // Vite default
      'http://localhost:5174'
    ];
    
    // Allow requests with no origin (like mobile apps, Postman, or server requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // Allow any Vercel preview deployment
      if (origin.includes('.vercel.app')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With']
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
app.use('/api/learn', teachRoute);
app.use('/api/user/progress',progressRoute)
app.use('/api/user/password', passwordRoutes);
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