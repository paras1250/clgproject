# Quick Start Guide

Get up and running with AI Chatbot Builder in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (free tier works)
- Hugging Face account (free API access)

## Step 1: Clone and Install

```bash
# Clone the repository (or use your own)
git clone https://github.com/yourusername/ai-chatbot-builder.git
cd ai-chatbot-builder

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

## Step 2: Set Up Environment Variables

### Backend

Create `backend/.env`:

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```env
# Get from MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-chatbot-builder?retryWrites=true&w=majority

# Generate a random secret
JWT_SECRET=your_super_secret_jwt_key_here_use_random_string

# Get from Hugging Face
HF_API_KEY=your_huggingface_api_token_here

# Default values
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Step 3: Create Required Folder

```bash
# Back in project root
mkdir -p backend/uploads
```

## Step 4: Start the Services

### Terminal 1 - Backend

```bash
cd backend
npm run dev
```

Backend should start on http://localhost:5000

### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
```

Frontend should start on http://localhost:3000

## Step 5: Test It Out!

1. Open http://localhost:3000 in your browser
2. Click "Get Started Free"
3. Create an account
4. Build your first chatbot!

## Getting API Keys

### MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster (choose free M0 tier)
4. Create a database user
5. Whitelist IP (use 0.0.0.0/0 for development)
6. Get connection string
7. Replace <password> with your user password

### Hugging Face

1. Go to https://huggingface.co
2. Create a free account
3. Go to Settings > Access Tokens
4. Create a new token with "Read" permissions
5. Copy the token

## Troubleshooting

### "Cannot connect to MongoDB"

- Verify your MongoDB connection string is correct
- Check that you've whitelisted your IP (0.0.0.0/0)
- Ensure you've replaced <password> in connection string

### "HF_API_KEY error"

- Verify your Hugging Face token is correct
- Check it has "Read" permissions
- Try regenerating the token

### "Port already in use"

Backend:
```bash
# Kill process on port 5000
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill
```

Frontend:
```bash
# Kill process on port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill
```

### "Module not found"

Delete node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

- Read [DEPLOYMENT.md](./DEPLOYMENT.md) to deploy to production
- Check [API.md](./API.md) for API documentation
- See [CONTRIBUTING.md](./CONTRIBUTING.md) to contribute

## Features to Try

1. ✨ Create multiple chatbots
2. 📄 Upload documents (PDF, DOC, TXT)
3. 💬 Test your chatbot in preview
4. 📊 View analytics dashboard
5. 🔗 Get embed code for your website

## Common Issues

### Uploads folder missing

```bash
mkdir backend/uploads
```

### CORS errors

Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL.

### Token expired

Clear browser cookies and login again.

## Need Help?

- Check the main [README.md](./README.md)
- See [DEPLOYMENT.md](./DEPLOYMENT.md) for production setup
- Read [API.md](./API.md) for detailed API docs
- Open an issue on GitHub

Happy building! 🚀

