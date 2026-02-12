# 🚀 Quick Start Guide

## ✅ Your Project is Running!

### 🌐 Access Your Application:

**Frontend (Main App):**
👉 **http://localhost:3000**

**Backend API:**
👉 **http://localhost:5000**
- Health Check: http://localhost:5000/health
- API Info: http://localhost:5000/

---

## 🎯 Quick Test Steps

### 1. **Visit the Landing Page**
- Open: http://localhost:3000
- You should see the purple-themed landing page

### 2. **Sign Up (New User)**
- Click "Get Started" or "Sign Up"
- The login page now **defaults to Sign Up mode** ✨
- Fill in:
  - Name: Your name
  - Email: your@email.com
  - Password: your password
- Submit → Redirects to Dashboard

### 3. **Test Dashboard**
- After login, you'll see:
  - Analytics cards (Total Bots, Active Bots, Total Chats)
  - Your Chatbots section
  - Create New Bot button

### 4. **Test Bot Builder**
- Click "Create New Bot"
- Fill in bot details
- Upload documents
- Create your first chatbot!

---

## 🔍 Verify Everything Works

### ✅ Server Status
Both servers should be running in separate PowerShell windows:
- **Backend Window**: Shows "Server running on port 5000"
- **Frontend Window**: Shows "ready - started server on 0.0.0.0:3000"

### ✅ Database Connection
- Backend health check shows: "Supabase connected successfully"

### ✅ Authentication
- New users default to Sign Up form
- Login redirects properly
- Protected pages require authentication

---

## 📋 Common Commands

### Stop Servers
- Press `Ctrl+C` in each server window

### Restart Servers
```powershell
# Stop both, then:
cd backend
npm start

# In new window:
cd frontend
npm run dev
```

### Check Server Status
```powershell
netstat -ano | findstr ":3000 :5000"
```

---

## 🐛 Troubleshooting

### Frontend not loading?
- Check if port 3000 is available
- Check frontend terminal for errors
- Try: `cd frontend && npm run dev`

### Backend not responding?
- Check if port 5000 is available
- Check backend terminal for errors
- Verify Supabase connection in .env

### Can't login?
- Make sure you sign up first (default mode)
- Check browser console for errors
- Verify backend is running

---

## 🎉 You're All Set!

Your AI Chatbot Builder is running and ready to use!

**Next Steps:**
1. Sign up for an account
2. Create your first chatbot
3. Start building! 🚀

---

**Need Help?**
- Check `TEST_PROJECT.md` for detailed testing guide
- Check `AUTHENTICATION_SECURITY_FIXES.md` for auth details
- Check backend terminal for any errors

