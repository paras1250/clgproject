# 🚀 Quick Test Instructions

## ✅ System Status
Your system is configured and ready! Here's how to test:

---

## 📋 Step-by-Step Testing

### 1. **Make Sure Backend is Running**
```bash
cd backend
npm run dev
```

You should see:
```
✅ Required environment variables are set
🚀 Server running on port 5000
✅ Supabase connected successfully
```

---

### 2. **Test in UI (Easiest Method)**

1. **Open frontend** (if not running):
   ```bash
   cd frontend
   npm run dev
   ```

2. **Login** to your account

3. **Create or Edit a Bot:**
   - Go to Dashboard
   - Click "Create Bot" or "Edit" on existing bot
   - **Select "Gemini Pro"** from AI Model dropdown
   - **Add Training Data:**
     - Either paste training text
     - OR upload a document (PDF/TXT/DOCX)

4. **Test Chat:**
   - Click "Test" or use the chatbot widget
   - Ask a question FROM your training data
   - Ask a question NOT in your training data

---

### 3. **What to Expect**

#### ✅ **Question IN Training Data:**
**Training Data:** "Check-in: 3 PM. Pool: 6 AM - 10 PM"

**Question:** "What is check-in time?"

**Expected:** Should answer "3 PM" or mention check-in is at 3 PM

---

#### ❌ **Question NOT IN Training Data:**
**Question:** "Who owns the hotel?"

**Expected:** Should say "I'm sorry, I don't have enough information to answer that."

---

### 4. **Check Backend Logs**

While testing, watch backend console for:

```
🤖 Chat request for bot:
  hasDocumentContents: true
  documentContentsLength: 1

📊 Training data being used:
  hasTrainingData: true
  hasSystemInstruction: true  ← Should be TRUE

🤖 Sending to Gemini API:
  hasSystemInstruction: true  ← Should be TRUE
  model: gemini-pro

📝 Gemini Response received:
  hasResponse: true
  responseLength: 123
```

---

## 🔧 If Something's Not Working

### Issue: "I don't have enough information" for everything
- **Check:** Training data actually exists (use Training Data Viewer)
- **Check:** Logs show `hasTrainingData: true`
- **Check:** Selected Gemini model (not Hugging Face)

### Issue: Generic responses, not using training data
- **Check:** Logs show `hasSystemInstruction: true`
- **Check:** Training data content is in database
- **Check:** Selected Gemini Pro (best for context-based)

### Issue: API errors
- **Check:** Gemini API key is correct
- **Check:** Backend logs for specific error
- **Check:** Internet connection

---

## 📊 Test Results

After testing, you should see:
- ✅ Questions in training data → Specific answers
- ✅ Questions not in training data → "I don't have enough information"
- ✅ Backend logs show system instruction being used
- ✅ No generic/hallucinated responses

---

**Your chatbot is ready to test!** 🎉

Go to the UI and start testing with your training data!

