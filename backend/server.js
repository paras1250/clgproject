// Force restart - timestamp: 2026-02-06 01:43
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const connectDB = require('./db/connect');

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = {
  JWT_SECRET: process.env.JWT_SECRET,
};

const missingVars = [];
for (const [key, value] of Object.entries(requiredEnvVars)) {
  if (!value) {
    missingVars.push(key);
  }
}

if (missingVars.length > 0) {
  console.error('❌ ERROR: Missing required environment variables:');
  missingVars.forEach(varName => {
    console.error(`   - ${varName}`);
  });
  console.error('\nPlease set these variables in your .env file.');
  process.exit(1);
}

// Optional environment variables (warnings only)
const optionalEnvVars = {
  HF_API_KEY: 'Hugging Face API key (required for chat functionality)',
  FRONTEND_URL: 'Frontend URL (defaults to http://localhost:3000)',
  BACKEND_URL: 'Backend URL (defaults to http://localhost:5000)',
  PORT: 'Server port (defaults to 5000)',
};

console.log('✅ Required environment variables are set');
for (const [key, description] of Object.entries(optionalEnvVars)) {
  if (!process.env[key]) {
    console.warn(`⚠️  ${key} is not set. ${description}`);
  }
}

const app = express();

// Security middleware - must be first
// Note: Helmet settings are relaxed for embed endpoints which set their own headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"], // Allow inline scripts for widget
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https:", "http:"], // Allow API calls from widget
    },
  },
  crossOriginEmbedderPolicy: false, // Allow embedding for chatbot widget
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow cross-origin resource loading
  frameguard: false, // Disable X-Frame-Options globally - embed endpoints set their own
}));

// Middleware
// Allow multiple origins for development (localhost:3000, localhost:3003, etc.)
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'http://localhost:3000',
  'http://localhost:3003',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3003',
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Allow any localhost origin in development
    if (process.env.NODE_ENV !== 'production') {
      if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
        return callback(null, true);
      }
    }

    // Allow ANY origin for embed-related requests (widget and embed.js)
    // These are public endpoints that need to work from any client website
    // The routes themselves handle security appropriately

    // Check allowed origins for other requests
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // In production, still allow CORS for non-sensitive public endpoints
      // The actual endpoint handlers will determine if auth is needed
      callback(null, true); // Allow all origins, endpoints handle their own auth
    }
  },
  credentials: true
}));
// Increase body size limits for large training text
app.use(express.json({ limit: '50mb' })); // Increased for large training text
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Root endpoint - API information
app.get('/', (req, res) => {
  res.json({
    message: 'AI Chatbot Builder API Server',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/health',
      auth: {
        login: 'POST /api/auth/login',
        register: 'POST /api/auth/register',
        profile: 'GET /api/auth/profile',
        logout: 'POST /api/auth/logout'
      },
      bots: {
        list: 'GET /api/bots/list',
        create: 'POST /api/bots/create',
        get: 'GET /api/bots/:id',
        chat: 'POST /api/bots/chat'
      },
      analytics: {
        dashboard: 'GET /api/analytics/dashboard',
        botAnalytics: 'GET /api/analytics/bot/:botId'
      }
    },
    docs: 'Visit http://localhost:3000 for the frontend application',
    note: 'This is the API server. Use the frontend at http://localhost:3000 to interact with the application.'
  });
});

// Serve avatar images publicly (needed for embed widgets on external sites)
const path = require('path');
app.use('/avatars', express.static(path.join(__dirname, '../frontend/public/avatars')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/bots', require('./routes/chatbot'));
app.use('/api/analytics', require('./routes/analytics'));

// Health check endpoint
// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Server is running',
    database: 'MongoDB',
    timestamp: new Date().toISOString()
  });
});

// Connect to MongoDB
const startServer = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    const uri = process.env.MONGODB_URI;
    if (!uri) console.warn('⚠️  MONGODB_URI is not set in environment!');
    else console.log(`Target: ${uri.replace(/:([^:@]+)@/, ':****@')}`); // Log masked URI

    await connectDB(process.env.MONGODB_URI);

    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on port ${PORT}`);
      console.log(`📡 Backend URL: ${BACKEND_URL}`);
      console.log(`🔗 API Health: ${BACKEND_URL}/health`);
      console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

const PORT = process.env.PORT || 5000;
const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${PORT}`;



module.exports = app;

