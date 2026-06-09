# AI Chatbot Builder 🤖

A complete web application for building custom AI chatbots using document uploads and integration with Hugging Face Inference API.

## 🌟 Features

- **User Authentication**: Secure JWT-based login/signup
- **Chatbot Builder**: Upload documents (PDF, TXT, DOCX) to train your chatbot
- **Live Preview**: Test your chatbot in real-time
- **Analytics Dashboard**: Track chats, user feedback, and engagement
- **Embed Script**: Generate embeddable code for any website
- **Modern UI**: Beautiful, responsive design with Tailwind CSS

## 📄 Documentation

For a detailed deep-dive into the architecture, RAG engine, and API integrations, please see the [Technical Documentation](TECHNICAL_DOCUMENTATION.md).

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + MongoDB
- **AI**: Hugging Face Inference API
- **Authentication**: JWT
- **Deployment**: Vercel (frontend) + Render (backend)

## 📦 Installation

### Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account
- Hugging Face account with API token

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your credentials:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A random secret string for JWT
   - `HF_API_KEY`: Your Hugging Face API token
   - `PORT`: 5000 (default)

5. Start the development server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm run dev
```

5. Open http://localhost:3000 in your browser

## 🚀 Deployment

### Backend (Render)

1. Push code to GitHub
2. Create new Web Service on Render
3. Connect your GitHub repository
4. Add environment variables from `.env.example`
5. Deploy

### Frontend (Vercel)

1. Push code to GitHub
2. Import project in Vercel
3. Set environment variable: `NEXT_PUBLIC_API_URL` to your Render backend URL
4. Deploy

## 📁 Project Structure

```
ai-chatbot-builder/
├── backend/
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth middleware
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── server.js        # Express server
│   └── package.json
├── frontend/
│   ├── pages/           # Next.js pages
│   ├── components/      # React components
│   ├── lib/             # Utilities
│   ├── public/          # Static assets
│   └── package.json
└── README.md
```

## 🔐 Security

- All secrets stored in `.env` files
- JWT tokens for authentication
- CORS configured for production
- Input validation and sanitization

## 📝 License

MIT License - feel free to use this project for your own purposes!

