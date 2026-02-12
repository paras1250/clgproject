const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { sanitizeEmail, sanitizeString, sanitizeRequestBody } = require('../utils/sanitize');
const { ErrorResponses } = require('../utils/errors');
const { authLimiter } = require('../middleware/rateLimit');
const authMiddleware = require('../middleware/auth');

// Validate JWT_SECRET at module load
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required. Please set it in your .env file.');
}

// Generate JWT token
const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Register
router.post('/register', authLimiter, async (req, res) => {
  try {
    // Sanitize input
    const sanitizedBody = sanitizeRequestBody(req.body);
    let { email, password, name } = sanitizedBody;

    // Sanitize email specifically
    email = sanitizeEmail(email);
    if (!email) {
      return ErrorResponses.VALIDATION_ERROR(res, 'Invalid email address');
    }

    // Sanitize name
    name = sanitizeString(name);

    // Validation
    if (!email || !password || !name) {
      return ErrorResponses.BAD_REQUEST(res, 'All fields are required');
    }

    if (name.length < 2) {
      return ErrorResponses.VALIDATION_ERROR(res, 'Name must be at least 2 characters long');
    }

    if (password.length < 8) {
      return ErrorResponses.VALIDATION_ERROR(res, 'Password must be at least 8 characters long');
    }

    // Check password strength
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      return ErrorResponses.VALIDATION_ERROR(res, 'Password must contain at least one uppercase letter, one lowercase letter, and one number');
    }

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return ErrorResponses.CONFLICT(res, 'User already exists');
    }

    // Create new user
    const user = await User.create({ email, password, name });

    // Generate token
    const token = generateToken(user.id);

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.message === 'User already exists') {
      return ErrorResponses.CONFLICT(res, 'User already exists');
    }
    return ErrorResponses.INTERNAL_SERVER_ERROR(res);
  }
});

// Login
router.post('/login', authLimiter, async (req, res) => {
  try {
    // Sanitize input
    const sanitizedBody = sanitizeRequestBody(req.body);
    let { email, password } = sanitizedBody;

    // Sanitize email specifically
    email = sanitizeEmail(email);
    if (!email) {
      return ErrorResponses.VALIDATION_ERROR(res, 'Invalid email address');
    }

    // Validation
    if (!email || !password) {
      return ErrorResponses.BAD_REQUEST(res, 'Email and password are required');
    }

    // Find user
    const user = await User.findByEmail(email);
    if (!user) {
      return ErrorResponses.UNAUTHORIZED(res, 'Invalid credentials');
    }

    // Check if user has a password (not an OAuth-only user)
    if (!user.password) {
      return ErrorResponses.UNAUTHORIZED(res, 'This account uses OAuth login. Please sign in with Google or GitHub.');
    }

    // Check password - ensure password is not trimmed (bcrypt needs exact match)
    // Only trim leading/trailing whitespace but preserve actual password
    const trimmedPassword = password.trim();
    const isMatch = await User.comparePassword(trimmedPassword, user.password);
    if (!isMatch) {
      return ErrorResponses.UNAUTHORIZED(res, 'Invalid credentials');
    }

    // Generate token
    const token = generateToken(user.id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return ErrorResponses.INTERNAL_SERVER_ERROR(res);
  }
});

// OAuth: Google redirect
router.get('/google', (req, res) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const redirectUri = `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/google/callback`;
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res.status(500).json({
      error: 'Google OAuth not configured',
      details: !clientId ? 'GOOGLE_CLIENT_ID is missing' : 'GOOGLE_CLIENT_SECRET is missing'
    });
  }

  const scopes = 'email profile';
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scopes)}&access_type=offline&prompt=consent`;

  res.redirect(authUrl);
});

// OAuth: Google callback
router.get('/google/callback', async (req, res) => {
  try {
    const { code } = req.query;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    if (!code) {
      return res.redirect(`${frontendUrl}/login?error=oauth_failed`);
    }

    // Exchange code for token
    const redirectUri = `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/google/callback`;
    const tokenResponse = await require('axios').post('https://oauth2.googleapis.com/token', {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri
    });

    const { access_token } = tokenResponse.data;

    // Get user info from Google
    const userResponse = await require('axios').get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    const { email, name, picture } = userResponse.data;

    // Find or create user
    let user = await User.findByEmail(email);
    if (!user) {
      // Create user without password for OAuth users
      user = await User.createOAuth({ email, name, provider: 'google' });
    }

    // Generate token
    const token = generateToken(user.id);

    // Redirect to frontend with token
    res.redirect(`${frontendUrl}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify({ id: user.id, email: user.email, name: user.name }))}`);
  } catch (error) {
    console.error('Google OAuth error:', error);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/login?error=oauth_failed`);
  }
});

// OAuth: GitHub redirect
router.get('/github', (req, res) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const redirectUri = `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/github/callback`;
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res.status(500).json({
      error: 'GitHub OAuth not configured',
      details: !clientId ? 'GITHUB_CLIENT_ID is missing' : 'GITHUB_CLIENT_SECRET is missing'
    });
  }

  const scopes = 'user:email';
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}`;

  res.redirect(authUrl);
});

// OAuth: GitHub callback
router.get('/github/callback', async (req, res) => {
  try {
    const { code } = req.query;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    if (!code) {
      return res.redirect(`${frontendUrl}/login?error=oauth_failed`);
    }

    // Exchange code for token
    const redirectUri = `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/github/callback`;
    const tokenResponse = await require('axios').post('https://github.com/login/oauth/access_token', {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: redirectUri
    }, {
      headers: { Accept: 'application/json' }
    });

    const { access_token } = tokenResponse.data;

    // Get user info from GitHub
    const userResponse = await require('axios').get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    // Get email from GitHub (might be private)
    const emailsResponse = await require('axios').get('https://api.github.com/user/emails', {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    const primaryEmail = emailsResponse.data.find(e => e.primary)?.email || emailsResponse.data[0]?.email;
    const name = userResponse.data.name || userResponse.data.login;
    const email = primaryEmail || `${userResponse.data.login}@users.noreply.github.com`;

    // Find or create user
    let user = await User.findByEmail(email);
    if (!user) {
      user = await User.createOAuth({ email, name, provider: 'github' });
    }

    // Generate token
    const token = generateToken(user.id);

    // Redirect to frontend with token
    res.redirect(`${frontendUrl}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify({ id: user.id, email: user.email, name: user.name }))}`);
  } catch (error) {
    console.error('GitHub OAuth error:', error);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/login?error=oauth_failed`);
  }
});

// Get current user profile
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return ErrorResponses.NOT_FOUND(res, 'User not found');
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        provider: user.provider
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    ErrorResponses.INTERNAL_SERVER_ERROR(res);
  }
});

// Update profile details
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name } = sanitizeRequestBody(req.body);

    if (!name || name.trim().length < 2) {
      return ErrorResponses.VALIDATION_ERROR(res, 'Name must be at least 2 characters long');
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return ErrorResponses.NOT_FOUND(res, 'User not found');
    }

    user.name = name.trim();
    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    ErrorResponses.INTERNAL_SERVER_ERROR(res);
  }
});

// Change password
router.put('/password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = sanitizeRequestBody(req.body);

    if (!currentPassword || !newPassword) {
      return ErrorResponses.BAD_REQUEST(res, 'Current and new passwords are required');
    }

    if (newPassword.length < 8) {
      return ErrorResponses.VALIDATION_ERROR(res, 'New password must be at least 8 characters long');
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return ErrorResponses.NOT_FOUND(res, 'User not found');
    }

    if (!user.password) {
      return ErrorResponses.BAD_REQUEST(res, 'This account uses OAuth. Please set a password specifically if you wish to use email login.');
    }

    // Verify current password
    const isMatch = await User.comparePassword(currentPassword, user.password);
    if (!isMatch) {
      return ErrorResponses.UNAUTHORIZED(res, 'Invalid current password');
    }

    // Check password strength for new password
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);

    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      return ErrorResponses.VALIDATION_ERROR(res, 'Password must contain at least one uppercase letter, one lowercase letter, and one number');
    }

    // Update password (hashing handled by pre-save hook)
    user.password = newPassword;
    await user.save();

    res.json({
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    ErrorResponses.INTERNAL_SERVER_ERROR(res);
  }
});

module.exports = router;
