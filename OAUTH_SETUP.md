# OAuth Setup Guide

This guide will help you set up Google and GitHub OAuth authentication for your AI Chatbot Builder application.

## Prerequisites

- Google Cloud Console account (for Google OAuth)
- GitHub account (for GitHub OAuth)

## Step 1: Update Database Schema

First, you need to update your Supabase database to support OAuth users. Run this SQL in your Supabase SQL Editor:

```sql
-- Add provider column if it doesn't exist
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS provider VARCHAR(50) DEFAULT 'email';

-- Make password nullable for OAuth users
ALTER TABLE users 
ALTER COLUMN password DROP NOT NULL;
```

## Step 2: Google OAuth Setup

### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Configure the OAuth consent screen first if prompted:
   - Choose **External** user type
   - Fill in required fields (App name, User support email, Developer contact)
6. Create OAuth client ID:
   - Application type: **Web application**
   - Name: AI Chatbot Builder
   - Authorized redirect URIs:
     - `http://localhost:5000/api/auth/google/callback` (for development)
     - `https://your-backend-url.com/api/auth/google/callback` (for production)
7. Copy the **Client ID** and **Client Secret**

### 2. Add to Backend .env

Add these to your `backend/.env` file:

```env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
BACKEND_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000
```

## Step 3: GitHub OAuth Setup

### 1. Create GitHub OAuth App

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Click **New OAuth App**
3. Fill in the form:
   - **Application name**: AI Chatbot Builder
   - **Homepage URL**: `http://localhost:3000` (or your production URL)
   - **Authorization callback URL**:
     - `http://localhost:5000/api/auth/github/callback` (for development)
     - `https://your-backend-url.com/api/auth/github/callback` (for production)
4. Click **Register application**
5. Copy the **Client ID**
6. Click **Generate a new client secret** and copy it

### 2. Add to Backend .env

Add these to your `backend/.env` file:

```env
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here
```

## Step 4: Update Environment Variables for Production

When deploying to production, update:

- `BACKEND_URL`: Your production backend URL (e.g., `https://your-app.onrender.com`)
- `FRONTEND_URL`: Your production frontend URL (e.g., `https://your-app.vercel.app`)
- Update authorized redirect URIs in Google Cloud Console and GitHub OAuth App settings

## Step 5: Test OAuth

1. Restart your backend server to load new environment variables
2. Go to `http://localhost:3000/login`
3. Click "Continue with Google" or "Continue with GitHub"
4. You should be redirected to the OAuth provider
5. After authorization, you'll be redirected back and logged in

## Troubleshooting

### OAuth buttons not working
- Check that environment variables are set correctly
- Verify redirect URIs match exactly in OAuth app settings
- Check backend server logs for errors

### "OAuth not configured" error
- Ensure `GOOGLE_CLIENT_ID` and `GITHUB_CLIENT_ID` are set in `.env`
- Restart the backend server after adding environment variables

### Database errors
- Make sure you've run the SQL migration to add `provider` column and make `password` nullable
- Verify your Supabase connection is working

### Redirect URI mismatch
- The redirect URI in your OAuth app settings must exactly match the one in the code
- Include the full path: `http://localhost:5000/api/auth/google/callback`

## Security Notes

- Never commit `.env` files to version control
- Use environment variables in production
- Keep your OAuth client secrets secure
- Regularly rotate OAuth credentials

