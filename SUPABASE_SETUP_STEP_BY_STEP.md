# 🚀 Step-by-Step Supabase Setup Guide

Follow these steps carefully to set up Supabase for your AI Chatbot Builder.

---

## 📋 Prerequisites
- ✅ Your backend code is ready (already done!)
- ✅ Hugging Face API key (already configured!)
- ⚠️ Need: Supabase account (we'll create this)

---

## Step 1: Create Supabase Account (2 minutes)

1. **Go to Supabase website**
   - Open: https://supabase.com
   - Click **"Start your project"** or **"Sign Up"**

2. **Sign up**
   - Option A: Sign up with GitHub (recommended)
   - Option B: Sign up with email
   - Fill in your details

3. **Verify email** (if using email)
   - Check your email
   - Click the verification link

---

## Step 2: Create a New Project (3 minutes)

1. **After logging in, you'll see the dashboard**
   - Click **"New Project"** button (green button)

2. **Fill in project details:**
   ```
   Organization: (Select or create one)
   Project Name: ai-chatbot-builder
   Database Password: [Create a STRONG password - SAVE IT!]
   Region: Choose closest to you (e.g., US East, Europe West)
   Pricing Plan: Free
   ```

3. **Click "Create new project"**
   - ⏳ Wait 2-3 minutes for project to be created
   - You'll see: "Setting up your project..."

4. **✅ Project ready!**
   - You'll see: "Your project is ready"
   - Click **"Continue"**

---

## Step 3: Get Your Supabase Credentials (1 minute)

1. **In your Supabase dashboard:**
   - Look at the left sidebar
   - Click **⚙️ Settings** (gear icon at the bottom)

2. **Click "API"** in the settings menu

3. **You'll see two important things:**

   **A. Project URL:**
   ```
   Format: https://xxxxxxxxxxxxx.supabase.co
   ```
   - Copy this URL (we'll use it in Step 5)

   **B. API Keys:**
   - Look for **"service_role"** key section
   - Click **👁️ "Reveal"** or **"Show"** button
   - ⚠️ **IMPORTANT:** This is your **SUPABASE_SERVICE_KEY**
   - Copy this key (long string starting with `eyJ...`)
   - ⚠️ **Keep it secret!** (like a password)

   **Note:** There's also an "anon" key, but we need the **service_role** key for the backend.

---

## Step 4: Create Database Tables (3 minutes)

1. **In Supabase dashboard:**
   - Click **"SQL Editor"** in the left sidebar
   - (Icon looks like a terminal/console)
   - You should see a blank SQL editor screen

2. **You're ready to paste SQL:**
   - The SQL editor is already open and ready
   - Look for the main editor area (large blank space)
   - There should be a green **"Run"** button at the bottom (or you can use Ctrl+J)
   - **Note:** Some interfaces show a **"+ New"** button - if you see it, click it, but it's not always necessary

3. **Open the SQL file:**
   - ✅ **RECOMMENDED:** Open `backend/supabase-schema-safe.sql` (this handles errors better)
   - OR use `backend/supabase-schema.sql` (original version, now updated too)
   - **You only need ONE file** - choose the safe version!
   - Select ALL the content (Ctrl+A / Cmd+A)
   - Copy it (Ctrl+C / Cmd+C)

4. **Paste into Supabase SQL Editor:**
   - Click in the **main editor area** (the large blank space in the center)
   - Paste the SQL code (Ctrl+V / Cmd+V)
   - You should see SQL code for creating tables: users, bots, chat_logs

5. **Run the SQL:**
   - Look for the green **"Run"** button at the bottom of the editor
   - OR press **Ctrl+J** (Windows) or **Cmd+J** (Mac)
   - Wait a few seconds
   - You should see "Success. No rows returned" or a similar success message
   
   **If you get an error about policies already existing:**
   - Use the file `backend/supabase-schema-safe.sql` instead
   - It includes `DROP POLICY IF EXISTS` statements to handle this
   - This version can be run multiple times without errors

6. **Verify tables were created:**
   - Click **"Table Editor"** in left sidebar
   - You should see 3 tables:
     - ✅ **users**
     - ✅ **bots**
     - ✅ **chat_logs**
   - If you see them, tables are created successfully!

---

## Step 5: Update Your Backend .env File (2 minutes)

1. **Open your backend .env file:**
   - Navigate to: `backend/.env`
   - Open it in a text editor (Notepad, VS Code, etc.)

2. **Find these lines:**
   ```env
   SUPABASE_URL=your_supabase_project_url_here
   SUPABASE_SERVICE_KEY=your_supabase_service_role_key_here
   ```

3. **Replace with your actual values:**
   ```env
   SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   SUPABASE_SERVICE_KEY=your-supabase-service-role-key
   ```
   - Paste your Project URL from Step 3
   - Paste your service_role key from Step 3
   - **Keep the quotes if they're there, or don't add quotes**

4. **Verify other values:**
   ```env
   HF_API_KEY=your_huggingface_api_token
   JWT_SECRET=ai_chatbot_builder_jwt_secret_key_2024_change_this_in_production
   PORT=5000
   FRONTEND_URL=http://localhost:3000
   ```
   - ✅ HF_API_KEY is already set
   - JWT_SECRET can stay as is (or change for security)

5. **Save the file** (Ctrl+S / Cmd+S)

---

## Step 6: Install Backend Dependencies (2 minutes)

1. **Open Terminal/Command Prompt**

2. **Navigate to backend folder:**
   ```bash
   cd backend
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```
   - This will install Supabase client and other packages
   - ⏳ Wait 1-2 minutes

4. **✅ Done when you see:**
   ```
   added XX packages
   ```

---

## Step 7: Test Your Setup (1 minute)

1. **Start the backend server:**
   ```bash
   npm run dev
   ```

2. **Look for these messages:**
   ```
   ✅ Supabase connected successfully
   Server running on port 5000
   ```

3. **If you see errors:**
   - ❌ "Missing Supabase environment variables"
     → Check Step 5 - make sure .env file has SUPABASE_URL and SUPABASE_SERVICE_KEY
   
   - ❌ "Invalid API key"
     → Check Step 3 - make sure you copied the service_role key (not anon key)
   
   - ❌ "Table doesn't exist"
     → Check Step 4 - make sure you ran the SQL schema

4. **Test the connection:**
   - Open browser: http://localhost:5000/health
   - Should see: `{"status":"OK","message":"Server is running","database":"Supabase connected"}`

---

## Step 8: Start Your Frontend (Already Running!)

Your frontend should already be running on http://localhost:3000

If not:
```bash
cd frontend
npm run dev
```

---

## ✅ Setup Complete!

### What You Should Have:
- ✅ Supabase account
- ✅ Supabase project created
- ✅ Database tables created (users, bots, chat_logs)
- ✅ Backend .env configured
- ✅ Backend dependencies installed
- ✅ Backend server running on port 5000
- ✅ Frontend running on port 3000

---

## 🧪 Test Your Full Application

1. **Open browser:** http://localhost:3000

2. **Create an account:**
   - Click "Get Started Free"
   - Enter: Name, Email, Password
   - Click "Sign Up"
   - ✅ Should create account in Supabase!

3. **Create a chatbot:**
   - Click "Create Bot"
   - Enter bot name
   - Click "Create & Continue"
   - ✅ Should save to Supabase!

4. **Test chat:**
   - Type a message
   - Get AI response
   - ✅ Should save chat history to Supabase!

---

## 🔍 Verify Data in Supabase

1. **Go to Supabase dashboard**
2. **Click "Table Editor"** in left sidebar
3. **Check tables:**
   - **users** - Should see your registered account
   - **bots** - Should see your created chatbots
   - **chat_logs** - Should see chat conversations

---

## ❌ Troubleshooting

### Problem: "Invalid API key"
**Solution:**
- Go to Supabase → Settings → API
- Make sure you're using **service_role** key (not anon key)
- Copy the full key (starts with `eyJ`)

### Problem: "Table doesn't exist"
**Solution:**
- Go to Supabase → SQL Editor
- Run `backend/supabase-schema.sql` again
- Check Table Editor to see if tables exist

### Problem: "Connection timeout"
**Solution:**
- Check your internet connection
- Verify SUPABASE_URL is correct
- Make sure Supabase project is active (not paused)

### Problem: "CORS error"
**Solution:**
- Make sure FRONTEND_URL in .env is: `http://localhost:3000`
- Restart backend server after changing .env

### Problem: Backend won't start
**Solution:**
```bash
# Delete node_modules and reinstall
cd backend
rmdir /s /q node_modules
del package-lock.json
npm install
npm run dev
```

---

## 📚 Quick Reference

### Important URLs:
- **Supabase Dashboard:** https://app.supabase.com
- **Your Project:** https://app.supabase.com/project/YOUR_PROJECT_ID
- **SQL Editor:** Dashboard → SQL Editor
- **API Settings:** Dashboard → Settings → API

### Important Files:
- **Backend Config:** `backend/.env`
- **SQL Schema:** `backend/supabase-schema.sql`
- **Supabase Client:** `backend/lib/supabase.js`

### Environment Variables Needed:
```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=your-supabase-service-role-key
HF_API_KEY=your_huggingface_api_token
JWT_SECRET=your_secret_here
PORT=5000
FRONTEND_URL=http://localhost:3000
```

---

## 🎉 You're All Set!

Your AI Chatbot Builder is now fully configured with Supabase!

**Next Steps:**
- Test creating bots
- Test chat functionality
- Check analytics dashboard
- Deploy to production when ready

**Need Help?**
- Check: `backend/SUPABASE_SETUP.md`
- Supabase Docs: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com

---

**Setup Time:** ~15 minutes total
**Difficulty:** ⭐⭐☆☆☆ (Easy)

