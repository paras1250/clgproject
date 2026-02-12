# API Documentation

Complete API reference for the AI Chatbot Builder backend.

## Base URL

- Development: `http://localhost:5000`
- Production: Your Render URL

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### POST /api/auth/register

Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "token": "your-jwt-token-here",
  "user": {
    "id": "60a7c1c9e4b0a1d9c8e4f1a2",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### POST /api/auth/login

Login with existing credentials.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "your-jwt-token-here",
  "user": {
    "id": "60a7c1c9e4b0a1d9c8e4f1a2",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### Chatbots

#### POST /api/bots/create

Create a new chatbot.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:**
- `name` (string, required): Bot name
- `description` (string, optional): Bot description
- `modelName` (string, optional): AI model name (default: google/flan-t5-large)
- `documents` (file[], optional): Upload files (PDF, DOC, DOCX, TXT, max 5 files)

**Response:**
```json
{
  "message": "Chatbot created successfully",
  "bot": {
    "id": "60a7c1c9e4b0a1d9c8e4f1a3",
    "name": "My Chatbot",
    "embedCode": "bot_1234567890_abc123",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### GET /api/bots/list

Get all chatbots for the authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "bots": [
    {
      "id": "60a7c1c9e4b0a1d9c8e4f1a3",
      "name": "My Chatbot",
      "description": "A helpful bot",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "isActive": true
    }
  ]
}
```

#### GET /api/bots/:id

Get details of a specific chatbot.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "bot": {
    "id": "60a7c1c9e4b0a1d9c8e4f1a3",
    "name": "My Chatbot",
    "description": "A helpful bot",
    "userId": "60a7c1c9e4b0a1d9c8e4f1a2",
    "documents": [],
    "modelName": "google/flan-t5-large",
    "isActive": true,
    "embedCode": "bot_1234567890_abc123",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### POST /api/bots/chat

Send a message to a chatbot.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "botId": "60a7c1c9e4b0a1d9c8e4f1a3",
  "message": "Hello, how are you?",
  "sessionId": "optional-session-id"
}
```

**Response:**
```json
{
  "response": "I'm doing well, thank you for asking!",
  "sessionId": "abc123session456"
}
```

### Analytics

#### GET /api/analytics/bot/:botId

Get analytics for a specific bot.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "bot": {
    "name": "My Chatbot",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "statistics": {
    "totalChats": 42,
    "totalMessages": 158,
    "recentChats": [...],
    "feedback": {
      "total": 10,
      "averageRating": 4.5,
      "ratings": {
        "1": 0,
        "2": 1,
        "3": 2,
        "4": 3,
        "5": 4
      }
    }
  }
}
```

#### GET /api/analytics/dashboard

Get dashboard analytics for all user's bots.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "overview": {
    "totalBots": 5,
    "totalChats": 150,
    "activeBots": 4
  },
  "recentActivity": [...],
  "bots": [
    {
      "id": "60a7c1c9e4b0a1d9c8e4f1a3",
      "name": "My Chatbot",
      "isActive": true
    }
  ]
}
```

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error message here"
}
```

### Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

## Example Usage

### Using cURL

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# Create bot (with auth token)
curl -X POST http://localhost:5000/api/bots/create \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "name=My Bot" \
  -F "description=A helpful bot" \
  -F "documents=@file.pdf"

# Chat
curl -X POST http://localhost:5000/api/bots/chat \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"botId":"BOT_ID","message":"Hello"}'
```

### Using JavaScript (Fetch)

```javascript
// Login
const loginRes = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@example.com', password: 'password' })
});
const { token } = await loginRes.json();

// Create bot
const formData = new FormData();
formData.append('name', 'My Bot');
formData.append('documents', file);

const botRes = await fetch('http://localhost:5000/api/bots/create', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: formData
});
const { bot } = await botRes.json();

// Chat
const chatRes = await fetch('http://localhost:5000/api/bots/chat', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ botId: bot.id, message: 'Hello' })
});
const { response } = await chatRes.json();
console.log(response);
```

## Rate Limits

Currently, there are no rate limits implemented. Consider adding rate limiting for production use.

## Supported Models

- `google/flan-t5-large` (default, recommended)
- `gpt2`
- `EleutherAI/gpt-neo-1.3B`

## File Upload Limits

- Max file size: 10MB per file
- Max files per bot: 5 files
- Supported formats: PDF, DOC, DOCX, TXT

## Webhooks

Webhooks are not currently implemented but could be added for:
- Chat completion
- New bot created
- Analytics updates

