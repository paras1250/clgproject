const rateLimit = require('express-rate-limit');

/**
 * Rate limiting middleware for authentication endpoints
 * Prevents brute force attacks on login/register
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Increased for testing
  message: {
    error: 'Too many authentication attempts from this IP, please try again after 15 minutes'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // Skip successful requests
  skipSuccessfulRequests: true,
  skip: (req, res) => {
    // Skip rate limiting in development
    return true;
  }
});

/**
 * Rate limiting for bot creation
 * Prevents spam and abuse
 * Increased limits for better user experience
 */
const botCreationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // Limit each IP to 100 bot creations per hour (increased for better UX)
  message: {
    error: 'Too many bots created from this IP, please try again after an hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req, res) => {
    // Skip rate limiting in development mode
    if (process.env.NODE_ENV === 'development') {
      return true; // Skip rate limiting in development
    }
    return false;
  }
});

/**
 * Rate limiting for chat endpoints
 * Prevents excessive API usage
 */
const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 100 messages per minute
  message: {
    error: 'Too many messages sent, please slow down'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * General API rate limiting
 * Applies to all endpoints not covered by specific limiters
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per 15 minutes
  message: {
    error: 'Too many requests from this IP, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiting for file uploads
 * Prevents storage abuse
 * Increased limits for better user experience
 */
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 200, // Limit each IP to 200 uploads per hour (increased for better UX)
  message: {
    error: 'Too many file uploads, please try again after an hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req, res) => {
    // Skip rate limiting in development mode
    if (process.env.NODE_ENV === 'development') {
      return true; // Skip rate limiting in development
    }
    return false;
  }
});

module.exports = {
  authLimiter,
  botCreationLimiter,
  chatLimiter,
  generalLimiter,
  uploadLimiter
};

