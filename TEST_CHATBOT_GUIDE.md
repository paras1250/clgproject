# 🧪 Chatbot System Testing Guide

## ✅ System Status

Based on automated tests:

- ✅ **API Server**: Running and healthy
- ✅ **Database**: Supabase connected
- ✅ **API Keys**: Gemini and Hugging Face keys configured
- ✅ **Environment**: All required variables set

---

## 🧪 Testing Methods

### Method 1: UI Testing (Recommended)

1. **Start the frontend** (if not running):
   ```bash
   cd frontend
   npm run dev
   ```

2. **Login** to your account

3. **Create or select a bot** with training data

4. **Test chat**:
   - Ask questions FROM your training data → Should answer correctly
   - Ask questions NOT in training data → Should say "I'm sorry, I don't have enough information to answer that."

---

### Method 2: API Testing (Using test scripts)

#### Step 1: Test System Health
```bash
cd backend
node test-chatbot.js
```

#### Step 2: Test Chat Endpoint
You need either:
- A bot ID (for authenticated endpoint)
- An embed code (for public endpoint)

**To get a bot ID:**
1. Go to Dashboard in UI
2. Note the bot ID from URL or bot details
3. Or check database: `SELECT id, name, embed_code FROM bots LIMIT 1;`

**Test with embed code:**
```bash
node test-chat-endpoint.js --embed YOUR_EMBED_CODE
```

**Test with bot ID (requires auth token):**
```bash
# First, get auth token by logging in via API
node test-chat-endpoint.js YOUR_BOT_ID
```

---

### Method 3: Manual API Testing

#### Test Health:
```bash
curl http://localhost:5000/health
```

#### Test Chat (with embed code):
```bash
curl -X POST http://localhost:5000/api/bots/embed/YOUR_EMBED_CODE/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, what information do you have?"}'
```

#### Test Chat (authenticated):
```bash
# First login to get token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "your@email.com", "password": "yourpassword"}'

# Then use token
curl -X POST http://localhost:5000/api/bots/YOUR_BOT_ID/chat \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello"}'
```

---

## 📋 Test Cases

### ✅ Test Case 1: Question IN Training Data

**Setup:**
- Training Data: "Check-in time is 3:00 PM. Pool available from 6 AM to 10 PM."
- Bot Model: Gemini Pro

**Question:** "What is the check-in time?"

**Expected Result:**
- ✅ Answers with "3:00 PM" or similar
- ✅ Response based on training data
- ✅ `trainingDataUsed.hasData: true`

---

### ❌ Test Case 2: Question NOT IN Training Data

**Setup:**
- Same training data as above

**Question:** "Who owns the hotel?"

**Expected Result:**
- ✅ Returns: "I'm sorry, I don't have enough information to answer that."
- ✅ Does NOT make up information
- ✅ `trainingDataUsed.hasData: true` (shows it checked the data)

---

### 🔄 Test Case 3: Partial Match

**Setup:**
- Training Data: "Room service available 24/7. Breakfast served 7 AM to 10 AM."

**Question:** "Do you deliver food?"

**Expected Result:**
- ✅ Should reference room service OR say doesn't know
- ✅ Should NOT make up delivery service if not mentioned

---

## 🔍 Debugging Tips

### Check Backend Logs

When testing, watch backend console for:

```
🤖 Chat request for bot:
  hasDocumentContents: true
  documentContentsLength: 1
  
📊 Training data being used:
  hasTrainingData: true
  hasSystemInstruction: true  ← Should be TRUE
  contextLength: 1234

🤖 Sending to Gemini API:
  hasSystemInstruction: true  ← Should be TRUE
  model: gemini-pro

📝 Gemini Response received:
  hasResponse: true
  responseLength: 567
```

### Common Issues

1. **No training data being used:**
   - Check: `hasTrainingData: false` in logs
   - Fix: Upload documents or add training text

2. **System instruction not being sent:**
   - Check: `hasSystemInstruction: false` in logs
   - Fix: Make sure you're using Gemini model (not Hugging Face)

3. **Generic responses:**
   - Check: Response doesn't match training data
   - Fix: Verify training data is properly saved (check Training Data Viewer)

---

## 🎯 Quick Test Checklist

- [ ] Backend server running on port 5000
- [ ] Frontend running on port 3000 (or configured port)
- [ ] Logged into UI
- [ ] Created a bot with training data
- [ ] Selected Gemini model (Gemini Pro recommended)
- [ ] Test question FROM training data → Should answer correctly
- [ ] Test question NOT in training data → Should say "I don't have enough information"
- [ ] Check backend logs show `hasSystemInstruction: true`
- [ ] Check Training Data Viewer shows your data

---

**Ready to test!** 🚀

