# 🔧 Troubleshooting Login Error

## ✅ **Backend Status: Running!**

Your backend is accessible at `http://localhost:5000`

---

## 🔍 **Common Issues & Fixes**

### **1. Generic Error Message**

**Issue:** "An error occurred. Please try again."

**Solution:**
- Check browser console (F12 → Console tab) for detailed error
- Check backend terminal for any error messages
- Verify the backend is running on port 5000

---

### **2. Network/Connection Error**

**Issue:** "Cannot connect to backend server"

**Solution:**
```bash
# Make sure backend is running:
cd backend
npm run dev

# You should see:
# ✅ Server running on port 5000
```

---

### **3. CORS Error**

**Issue:** Browser console shows CORS errors

**Solution:**
Backend CORS is configured for `http://localhost:3000`. Make sure:
- Frontend is running on port 3000
- Backend `.env` has: `FRONTEND_URL=http://localhost:3000`

---

### **4. Invalid Credentials**

**Issue:** "Invalid credentials"

**Solution:**
- Make sure you're using the test user:
  - Email: `test@example.com`
  - Password: `Test1234`

**Or create a new user:**
1. Click "Sign Up" on login page
2. Create new account
3. Then login

---

### **5. Check Browser Console**

**Steps:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Try logging in
4. Look for error messages

**Common errors:**
- `ECONNREFUSED` → Backend not running
- `Network Error` → Backend not accessible
- `401 Unauthorized` → Wrong credentials
- `500 Internal Server Error` → Backend issue

---

## 🧪 **Test Backend Manually**

### **Test 1: Check if Backend is Running**
Open in browser: `http://localhost:5000`

Should show JSON with API information.

### **Test 2: Test Login API**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234"}'
```

Should return token and user data.

---

## ✅ **Improved Error Messages**

I've updated the login page to show better error messages:
- ✅ Network errors → Shows connection help
- ✅ Backend errors → Shows specific error message
- ✅ Invalid credentials → Shows helpful message

---

## 🔄 **Quick Fixes**

### **Restart Backend:**
```bash
cd backend
npm run dev
```

### **Restart Frontend:**
```bash
cd frontend
npm run dev
```

### **Clear Browser Cache:**
- Press `Ctrl+Shift+Delete`
- Clear cache and cookies
- Reload page

---

## 📋 **Checklist**

Before reporting issues, check:
- [ ] Backend is running (`http://localhost:5000` works)
- [ ] Frontend is running (`http://localhost:3000` works)
- [ ] Using correct credentials (`test@example.com` / `Test1234`)
- [ ] Checked browser console for errors
- [ ] Checked backend terminal for errors
- [ ] No CORS errors in console

---

**Need more help?** Check the browser console (F12) for detailed error messages!

