const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { ErrorResponses } = require('../utils/errors');

// Validate JWT_SECRET at module load
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required. Please set it in your .env file.');
}

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return ErrorResponses.UNAUTHORIZED(res, 'No token provided');
    }

    if (!process.env.JWT_SECRET) {
      return ErrorResponses.INTERNAL_SERVER_ERROR(res, 'Server configuration error: JWT_SECRET not set');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return ErrorResponses.UNAUTHORIZED(res, 'User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    // Provide more detailed error messages for debugging
    if (error.name === 'JsonWebTokenError') {
      return ErrorResponses.UNAUTHORIZED(res, 'Invalid token format');
    } else if (error.name === 'TokenExpiredError') {
      return ErrorResponses.UNAUTHORIZED(res, 'Token has expired');
    } else if (error.name === 'NotBeforeError') {
      return ErrorResponses.UNAUTHORIZED(res, 'Token not active yet');
    }
    return ErrorResponses.UNAUTHORIZED(res, 'Invalid token');
  }
};

module.exports = authMiddleware;
