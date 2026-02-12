# 🔑 How to Get Your Supabase Credentials

## Step-by-Step Guide to Find SUPABASE_URL and SUPABASE_SERVICE_KEY

---

## 📍 Step 1: Go to Your Supabase Project

1. **Open Supabase Dashboard**
   - Go to: https://app.supabase.com
   - Login to your account

2. **Select Your Project**
   - Click on your project: **"ai-chatbot-builder"**
   - (Or whatever you named it)

---

## 📍 Step 2: Go to Settings

1. **Look at the Left Sidebar**
   - Scroll down to the bottom
   - Find the **⚙️ Settings** icon (gear icon)
   - Click on it

2. **You'll see a menu:**
   ```
   Settings
   ├── General
   ├── API        ← CLICK THIS ONE!
   ├── Database
   ├── Auth
   └── ...
   ```

3. **Click "API"**

---

## 📍 Step 3: Find Your Credentials

You'll see a page with **"Project API keys"** section.

### A. SUPABASE_URL (Project URL)

**Look for:**
- Section: **"Project URL"** or **"Project configuration"**
- You'll see something like:
  ```
  https://xxxxxxxxxxxxx.supabase.co
  ```

**How to copy:**
- Click the **copy icon** (📋) next to the URL
- OR select the text and copy it

**Example:**
```
https://abcdefghijklmnop.supabase.co
```

---

### B. SUPABASE_SERVICE_KEY (Secret Key)

**You have TWO options depending on your Supabase interface:**

#### Option 1: New Interface (Recommended)
**Look for:**
- Section: **"Secret keys"** (or "API Keys" tab)
- Find the **"default"** secret key
- It will be masked: `sb_secret_hhl7n••••••••••••`

**How to copy:**
1. Click the **👁️ eye icon** to reveal the key
2. Copy the full key (starts with `sb_secret_...`)
3. This is your `SUPABASE_SERVICE_KEY`

#### Option 2: Legacy Interface (Old Style)
**Look for:**
- Section: **"Project API keys"**
- Find: **"service_role"** (with "secret" tag in orange)
- ⚠️ **IMPORTANT:** Not the "anon" key! Use "service_role"

**How to copy:**
1. You'll see the key masked: `**** **** **** ****`
2. Click **"Reveal"** button
3. Copy the full key (starts with `eyJ...`)
4. This is your `SUPABASE_SERVICE_KEY`

**Example formats:**
```
New: sb_secret_hhl7nxxxxxxxxxxxxxxxxxxxxxx
Old: your_service_role_key_here
```

⚠️ **Keep this secret!** Never share it publicly or commit to git.

**Which one to use?**
- If you see "Secret keys" section → Use the secret key (default)
- If you see "service_role" → Use that one
- **NOT the publishable key** (that's for frontend)
- **NOT the anon key** (that's public, not for backend)

---

## 📍 Step 4: Update Your .env File

1. **Open:** `backend/.env`

2. **Find these lines:**
   ```env
   SUPABASE_URL=your_supabase_project_url_here
   SUPABASE_SERVICE_KEY=your_supabase_service_role_key_here
   ```

3. **Replace with your actual values:**
   ```env
   SUPABASE_URL=https://abcdefghijklmnop.supabase.co
   SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

4. **Save the file** (Ctrl+S)

---

## 🖼️ Visual Guide (What You'll See)

### In Supabase Dashboard:

```
┌─────────────────────────────────────────┐
│  Supabase Dashboard                    │
├─────────────────────────────────────────┤
│                                         │
│  Left Sidebar:                         │
│  ├── Table Editor                      │
│  ├── SQL Editor                        │
│  ├── Database                          │
│  └── ⚙️ Settings  ← Click this         │
│                                         │
│  Settings Menu:                        │
│  ├── General                           │
│  ├── 🔑 API  ← Click this             │
│  ├── Database                          │
│  └── ...                               │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  API Settings Page                     │
├─────────────────────────────────────────┤
│                                         │
│  Project URL:                           │
│  ┌───────────────────────────────────┐ │
│  │ https://xxxxx.supabase.co  [📋]  │ │ ← Copy this
│  └───────────────────────────────────┘ │
│                                         │
│  Project API keys:                      │
│                                         │
│  anon key:                              │
│  ┌───────────────────────────────────┐ │
│  │ eyJ...xxx  [👁️ Reveal]  [📋]    │ │ ← NOT this one
│  └───────────────────────────────────┘ │
│                                         │
│  service_role key:                      │
│  ┌───────────────────────────────────┐ │
│  │ eyJ...xxx  [👁️ Reveal]  [📋]    │ │ ← THIS ONE!
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## ✅ Quick Checklist

Before moving to next step, make sure you have:

- [ ] **SUPABASE_URL** - Starts with `https://` and ends with `.supabase.co`
- [ ] **SUPABASE_SERVICE_KEY** - Long string starting with `eyJ`
- [ ] Both are copied and pasted in `backend/.env`
- [ ] No spaces or extra characters
- [ ] Saved the `.env` file

---

## 🔍 Where Exactly?

**Path in Supabase:**
```
Dashboard → Your Project → Settings (⚙️ bottom left) → API
```

**Then you'll see:**
1. **Project URL** - at the top
2. **Project API keys** section - below that
   - Find **"service_role"** key (not "anon")

---

## ❓ Still Can't Find It?

### Alternative Way:

1. **Check the top of your Supabase dashboard**
   - Your URL might be shown in the project header
   - Look for: `https://app.supabase.com/project/xxxxx`
   - The `xxxxx` part is your project reference ID

2. **Or in the URL bar:**
   - When you're in Supabase dashboard
   - URL might show: `https://app.supabase.com/project/abcdefghijklmnop`
   - Your SUPABASE_URL is: `https://abcdefghijklmnop.supabase.co`

---

## 💡 Pro Tip

After copying:
- Paste them into a temporary notepad first
- Check they look correct
- Then paste into `.env` file
- This prevents mistakes!

---

## 🎯 Summary

**SUPABASE_URL:**
- Location: Settings → API → "Project URL"
- Format: `https://xxxxx.supabase.co`

**SUPABASE_SERVICE_KEY:**
- Location: Settings → API → "service_role" key
- Click "Reveal" to see it
- Copy the full key

Both go into: `backend/.env`

That's it! ✅

