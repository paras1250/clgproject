/**
 * Standardized error response utilities
 * Ensures consistent error format across all API endpoints
 */

/**
 * Standard error response format
 * @param {object} options - Error options
 * @param {string} options.message - Error message
 * @param {string} [options.details] - Additional error details
 * @param {number} [options.statusCode=500] - HTTP status code
 * @returns {object} - Standardized error response
 */
function createErrorResponse({ message, details, statusCode = 500 }) {
  const response = {
    error: message
  };
  
  if (details) {
    response.details = details;
  }
  
  return {
    statusCode,
    body: response
  };
}

/**
 * Send standardized error response
 * @param {object} res - Express response object
 * @param {string} message - Error message
 * @param {number} [statusCode=500] - HTTP status code
 * @param {string} [details] - Additional error details
 */
function sendError(res, message, statusCode = 500, details = null) {
  const errorResponse = createErrorResponse({ message, details, statusCode });
  return res.status(errorResponse.statusCode).json(errorResponse.body);
}

/**
 * Common error responses
 */
const ErrorResponses = {
  // 400 - Bad Request
  BAD_REQUEST: (res, message = 'Bad request', details = null) => 
    sendError(res, message, 400, details),
  
  // 401 - Unauthorized
  UNAUTHORIZED: (res, message = 'Unauthorized', details = null) => 
    sendError(res, message, 401, details),
  
  // 403 - Forbidden
  FORBIDDEN: (res, message = 'Forbidden', details = null) => 
    sendError(res, message, 403, details),
  
  // 404 - Not Found
  NOT_FOUND: (res, message = 'Resource not found', details = null) => 
    sendError(res, message, 404, details),
  
  // 409 - Conflict
  CONFLICT: (res, message = 'Resource conflict', details = null) => 
    sendError(res, message, 409, details),
  
  // 422 - Unprocessable Entity
  VALIDATION_ERROR: (res, message = 'Validation error', details = null) => 
    sendError(res, message, 422, details),
  
  // 500 - Internal Server Error
  INTERNAL_SERVER_ERROR: (res, message = 'Internal server error', details = null) => 
    sendError(res, message, 500, details),
  
  // 503 - Service Unavailable
  SERVICE_UNAVAILABLE: (res, message = 'Service unavailable', details = null) => 
    sendError(res, message, 503, details)
};

module.exports = {
  createErrorResponse,
  sendError,
  ErrorResponses
};

