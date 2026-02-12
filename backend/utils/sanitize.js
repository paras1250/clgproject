/**
 * Input sanitization utilities
 * Protects against XSS and injection attacks
 */

/**
 * Sanitize string input - removes potentially dangerous characters
 * @param {string} input - The input string to sanitize
 * @returns {string} - Sanitized string
 */
function sanitizeString(input) {
  if (typeof input !== 'string') {
    return input;
  }
  
  // Remove null bytes
  let sanitized = input.replace(/\0/g, '');
  
  // Remove script tags and event handlers (basic XSS protection)
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  sanitized = sanitized.replace(/on\w+\s*=/gi, '');
  
  // Trim whitespace
  sanitized = sanitized.trim();
  
  return sanitized;
}

/**
 * Sanitize email - validates and sanitizes email addresses
 * @param {string} email - The email to sanitize
 * @returns {string|null} - Sanitized email or null if invalid
 */
function sanitizeEmail(email) {
  if (typeof email !== 'string') {
    return null;
  }
  
  const sanitized = sanitizeString(email.toLowerCase().trim());
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(sanitized)) {
    return null;
  }
  
  return sanitized;
}

/**
 * Sanitize object - recursively sanitizes string values in an object
 * @param {any} obj - The object to sanitize
 * @param {string[]} excludeKeys - Keys to exclude from sanitization
 * @returns {any} - Sanitized object
 */
function sanitizeObject(obj, excludeKeys = []) {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item, excludeKeys));
  }
  
  if (typeof obj === 'object') {
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      if (excludeKeys.includes(key)) {
        // Don't sanitize excluded keys (e.g., passwords will be hashed)
        sanitized[key] = value;
      } else {
        sanitized[key] = sanitizeObject(value, excludeKeys);
      }
    }
    return sanitized;
  }
  
  return obj;
}

/**
 * Validate and sanitize request body
 * @param {object} body - Request body to sanitize
 * @param {string[]} excludeKeys - Keys to exclude from sanitization
 * @returns {object} - Sanitized body
 */
function sanitizeRequestBody(body, excludeKeys = ['password', 'token', 'documents']) {
  return sanitizeObject(body, excludeKeys);
}

module.exports = {
  sanitizeString,
  sanitizeEmail,
  sanitizeObject,
  sanitizeRequestBody
};

