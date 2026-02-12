# 🧪 How to Test Your Backend

## Quick Test Steps

### 1. Start the Backend

Open a **new terminal/command prompt** and run:

```bash
cd C:\Users\paras\ai-chatbot-builder\backend
npm run dev
```

### 2. What You Should See

If everything works, you'll see:
```
Supabase connected successfully
Server running on port 5000
```

If there are errors, you'll see them here.

---

## ✅ Test the Connection

### Option A: Browser Test
1. Open your browser
2. Go to: http://localhost:5000/health
3. You should see:
   ```json
   {
     "status": "OK",
     "message": "Server is running",
     "database": "Supabase connected"
   }
   ```

### Option B: Terminal Test (PowerShell)
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/health"
```

---

## ❌ Common Issues & Fixes

### Error: "Missing Supabase environment variables"
**Fix:**
- Check `backend/.env` file exists
- Verify SUPABASE_URL and SUPABASE_SERVICE_KEY are set
- No quotes around the values
- No extra spaces

### Error: "Invalid API key" or "401 Unauthorized"
**Fix:**
- Verify SUPABASE_SERVICE_KEY is correct
- Make sure you're using the **secret key** (not publishable key)
- Key should start with `sb_secret_...`

### Error: "Connection timeout"
**Fix:**
- Check your internet connection
- Verify SUPABASE_URL is correct
- Make sure Supabase project is active

### Error: "Table doesn't exist"
**Fix:**
- Go to Supabase → SQL Editor
- Run `backend/supabase-schema-safe.sql`
- Verify tables exist in Table Editor

### Port 5000 already in use
**Fix:**
```bash
# Find what's using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual number)
taskkill /PID <PID_NUMBER> /F
```

---

## 🔍 Verify Your Configuration

Check your `.env` file has:
```env
SUPABASE_URL=https://mpudpcztgjrllpwzuvhj.supabase.co
SUPABASE_SERVICE_KEY=sb_secret_hhl7ngPHehMTPSIis68HLg_M2e6iMem
HF_API_KEY=your_huggingface_api_token
JWT_SECRET=ai_chatbot_builder_jwt_secret_key_2024_change_this_in_production
PORT=5000
FRONTEND_URL=http://localhost:3000
```

---

## ✅ Success Checklist

- [ ] Backend starts without errors
- [ ] See "Supabase connected successfully"
- [ ] http://localhost:5000/health returns OK
- [ ] No error messages in terminal

---

## 🎯 Next Steps After Backend Works

1. **Keep backend running** (terminal 1)
2. **Start frontend** (terminal 2):
   ```bash
   cd frontend
   npm run dev
   ```
3. **Test full app:**
   - Open: http://localhost:3000
   - Create account
   - Create chatbot
   - Test chat

---

## 💡 Need Help?

Check the backend terminal output - it will show you exactly what's wrong!

