# Deployment Guide

This guide will help you deploy the AI Chatbot Builder application to production.

## Prerequisites

- GitHub account
- Render account (for backend)
- Vercel account (for frontend)
- MongoDB Atlas account
- Hugging Face account with API token

## Step 1: Prepare Your Code

1. Push your code to a GitHub repository:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

## Step 2: Deploy Backend to Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: ai-chatbot-backend
   - **Region**: Choose closest to your users
   - **Branch**: main
   - **Root Directory**: backend
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free tier is fine to start

5. Add Environment Variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A strong random string (use a generator)
   - `HF_API_KEY`: Your Hugging Face API token
   - `PORT`: 5000
   - `FRONTEND_URL`: Will be your Vercel URL (update after deploying frontend)
   - `NODE_ENV`: production

6. Click "Create Web Service"
7. Wait for deployment to complete
8. Copy your backend URL (e.g., `https://ai-chatbot-backend.onrender.com`)

## Step 3: Deploy Frontend to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Import Project"
3. Connect your GitHub repository
4. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: frontend
   - **Build Command**: `npm run build`
   - **Output Directory**: .next

5. Add Environment Variables:
   - `NEXT_PUBLIC_API_URL`: Your Render backend URL (e.g., `https://ai-chatbot-backend.onrender.com`)

6. Click "Deploy"
7. Wait for deployment to complete
8. Copy your frontend URL (e.g., `https://ai-chatbot-builder.vercel.app`)

## Step 4: Update Backend CORS

1. Go back to Render dashboard
2. Edit your backend service
3. Update `FRONTEND_URL` environment variable to your Vercel URL
4. Save changes
5. Render will automatically redeploy

## Step 5: Test Your Deployment

1. Visit your Vercel URL
2. Create an account
3. Try creating a chatbot
4. Test the chat functionality
5. Check analytics

## Step 6: MongoDB Atlas Setup

1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a database user
3. Whitelist Render's IP addresses (or use 0.0.0.0/0 for development)
4. Get your connection string
5. Update the `MONGODB_URI` in Render

## Step 7: Hugging Face API Setup

1. Create a free account on [Hugging Face](https://huggingface.co)
2. Go to Settings > Access Tokens
3. Create a new token with "Read" permissions
4. Copy the token
5. Update the `HF_API_KEY` in Render

## Troubleshooting

### Backend Issues

- **500 Internal Server Error**: Check Render logs for errors
- **MongoDB connection issues**: Verify connection string and IP whitelist
- **Hugging Face errors**: Check API token is valid and has read permissions

### Frontend Issues

- **API calls failing**: Verify `NEXT_PUBLIC_API_URL` is set correctly
- **Build errors**: Check Node version compatibility
- **Authentication issues**: Ensure backend is running and accessible

### CORS Issues

- Make sure `FRONTEND_URL` in backend matches your Vercel URL exactly
- Check that credentials are being sent with requests

## Monitoring

### Render
- Monitor logs in Render dashboard
- Set up alerts for crashes
- Use "Auto-Deploy" for automatic deployments on git push

### Vercel
- Check deployment logs
- Monitor analytics
- Set up custom domains (optional)

## Scaling

When you need to scale:

1. **Backend**: Upgrade Render instance plan
2. **Database**: Upgrade MongoDB Atlas plan
3. **Frontend**: Vercel handles scaling automatically
4. **CDN**: Use CloudFlare for additional caching

## Security Checklist

- [ ] Use strong JWT_SECRET
- [ ] Keep API keys secure
- [ ] Enable MongoDB authentication
- [ ] Use HTTPS (automatic with Render/Vercel)
- [ ] Implement rate limiting (consider adding)
- [ ] Set up error monitoring (Sentry, etc.)

## Cost Estimation (Free Tier)

- **Render**: Free tier available (sleeps after 15min inactivity)
- **Vercel**: Free tier with generous limits
- **MongoDB Atlas**: Free tier (512MB storage)
- **Hugging Face**: Free API access with rate limits

## Going Production

To go fully production:

1. Upgrade Render to paid plan for always-on backend
2. Upgrade MongoDB Atlas for better performance
3. Add monitoring (Sentry, LogRocket)
4. Implement backup strategy
5. Set up CI/CD pipelines
6. Add email verification
7. Implement user payment (if applicable)

