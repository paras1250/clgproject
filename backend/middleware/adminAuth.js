const { ErrorResponses } = require('../utils/errors');

const adminMiddleware = async (req, res, next) => {
  try {
    // The auth middleware should have already populated req.user
    if (!req.user) {
      return ErrorResponses.UNAUTHORIZED(res, 'Authentication required');
    }

    if (req.user.role !== 'admin') {
      return ErrorResponses.FORBIDDEN(res, 'Admin access required');
    }

    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    ErrorResponses.INTERNAL_SERVER_ERROR(res);
  }
};

module.exports = adminMiddleware;
