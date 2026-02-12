# 🔑 Gemini API Setup Guide

## ✅ Gemini API Support Added!

Your chatbot now supports **Google Gemini** models in addition to Hugging Face models!

---

## 🚀 Quick Setup

### Step 1: Get Your Gemini API Key

1. Go to **https://aistudio.google.com/app/apikey**
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy your API key (starts with `AIza...`)

### Step 2: Add to .env File

Open `backend/.env` and add:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

**Note:** You can use **either** Hugging Face or Gemini API (or both). The system will automatically detect which one to use based on the selected model.

---

## 🤖 Available Gemini Models

### 1. **Gemini Pro** (Recommended for most cases)
- Model name: `gemini-pro`
- Best for: General conversations, Q&A
- Good balance of quality and speed

### 2. **Gemini 1.5 Pro** (Best quality)
- Model name: `gemini-1.5-pro`
- Best for: Complex questions, detailed responses
- Higher quality, slightly slower

### 3. **Gemini 1.5 Flash** (Fastest)
- Model name: `gemini-1.5-flash`
- Best for: Quick responses, simple queries
- Fastest option

---

## 📋 How It Works

### Automatic Model Detection:
- If you select a **Gemini model** → Uses Gemini API
- If you select a **Hugging Face model** → Uses Hugging Face API

### Model Selection:
1. Go to **Builder** or **Edit Bot** page
2. Find **"AI Model"** dropdown
3. Select from:
   - **Google Gemini** section (requires GEMINI_API_KEY)
   - **Hugging Face Models** section (requires HF_API_KEY)

---

## 🔧 Configuration

### Backend (.env file):

```env
# AI Model APIs (At least one is required)
# Hugging Face API (for Hugging Face models)
HF_API_KEY=your_huggingface_api_token

# Google Gemini API (for Gemini models)  
GEMINI_API_KEY=your_gemini_api_key
```

### Both APIs are Optional:
- ✅ Use **only Gemini** → Set `GEMINI_API_KEY`, select Gemini models
- ✅ Use **only Hugging Face** → Set `HF_API_KEY`, select Hugging Face models  
- ✅ Use **both** → Set both keys, can switch between models

---

## 💡 Benefits of Gemini

1. **Better Quality Responses**
   - More natural language
   - Better understanding of context
   - Improved training data utilization

2. **Faster Responses**
   - Gemini Flash is very fast
   - Lower latency than some Hugging Face models

3. **More Reliable**
   - Google's infrastructure
   - Better error handling
   - Higher uptime

---

## 🧪 Testing

### Test Gemini:
1. Add `GEMINI_API_KEY` to `.env`
2. Restart backend server
3. Create/edit a bot
4. Select **"Gemini Pro"** from model dropdown
5. Add training data
6. Test the chatbot - should use Gemini API!

### Check Logs:
In development mode, you'll see:
```
🤖 Sending to Gemini API: {
  model: 'gemini-pro',
  messageLength: 1234,
  ...
}
📝 Gemini Response received: {
  hasResponse: true,
  responseLength: 567,
  ...
}
```

---

## ⚠️ Important Notes

1. **API Key Security:**
   - Never commit `.env` file to Git
   - Keep your API key secret
   - Don't share it publicly

2. **Rate Limits:**
   - Gemini has rate limits (check Google's documentation)
   - Free tier: 60 requests/minute
   - Paid tier: Higher limits

3. **Costs:**
   - Gemini Pro: Free tier available
   - Check Google's pricing for production use

4. **Model Selection:**
   - Gemini models work best with training data
   - Select based on your needs:
     - **Quick responses** → Gemini 1.5 Flash
     - **Best quality** → Gemini 1.5 Pro
     - **Balanced** → Gemini Pro

---

## 🐛 Troubleshooting

### Error: "Gemini API key is not configured"
- **Fix:** Add `GEMINI_API_KEY` to your `.env` file
- **Check:** Make sure the key starts with `AIza...`

### Error: "Authentication error"
- **Fix:** Check if your API key is valid
- **Check:** Regenerate key if needed

### Error: "Too many requests"
- **Fix:** You've hit the rate limit
- **Fix:** Wait a minute and try again
- **Fix:** Consider upgrading to paid tier

### Model not working:
- **Check:** Make sure you selected a Gemini model (not Hugging Face)
- **Check:** Backend logs will show which API is being called

---

## 📚 Resources

- **Gemini API Docs:** https://ai.google.dev/docs
- **Get API Key:** https://aistudio.google.com/app/apikey
- **Pricing:** https://ai.google.dev/pricing

---

**Enjoy using Gemini models with your chatbot!** 🎉

