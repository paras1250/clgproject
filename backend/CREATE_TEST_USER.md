# 🧪 Create Default Test User

## Quick Start

### **Option 1: Run the Script (Recommended)**
```bash
cd backend
node create-test-user.js
```

This will create a test user with:
- **Email:** `test@example.com`
- **Password:** `Test1234`
- **Name:** `Test User`

---

## 📋 **Test User Credentials**

After running the script, you can login with:

```
Email:    test@example.com
Password: Test1234
```

**Password Requirements Met:**
- ✅ At least 8 characters
- ✅ Contains uppercase letter (T)
- ✅ Contains lowercase letter (est)
- ✅ Contains number (1234)

---

## 🔄 **If User Already Exists**

If you run the script again, it will:
- ✅ Detect existing user
- ✅ Show you the credentials
- ✅ Not create a duplicate

---

## 🛠️ **Custom Test User**

Want to create a different test user? Edit `create-test-user.js`:

```javascript
const testUser = {
  email: 'your-email@example.com',
  password: 'YourPassword123',
  name: 'Your Name'
};
```

Then run:
```bash
node create-test-user.js
```

---

## ✅ **After Creation**

1. Start your servers:
   ```bash
   # Backend
   cd backend
   npm run dev

   # Frontend (new terminal)
   cd frontend
   npm run dev
   ```

2. Login at: `http://localhost:3000/login`

3. Use credentials:
   - Email: `test@example.com`
   - Password: `Test1234`

---

## 🎯 **What This Creates**

- ✅ A user account in your Supabase database
- ✅ Properly hashed password (bcrypt)
- ✅ All fields validated
- ✅ Ready to use immediately

---

## 🚨 **Security Note**

**This is for DEVELOPMENT/TESTING only!**

⚠️ **Do NOT use in production!**
- Default credentials are public
- Not secure for real users
- For testing purposes only

---

## 🎊 **Quick Test Flow**

1. Run script: `node create-test-user.js`
2. See credentials printed
3. Open: `http://localhost:3000/login`
4. Login with test credentials
5. Start creating chatbots! 🚀

---

**Status:** ✅ Ready to use!  
**Purpose:** Development & Testing  
**Security:** Development only

