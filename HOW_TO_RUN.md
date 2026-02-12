# 🚀 How to Run Your Project

## **Quick Start (Recommended)**

### **Option 1: Use the PowerShell Script**
```powershell
.\start-servers.ps1
```

This will open two separate PowerShell windows, one for each server.

---

### **Option 2: Manual Start (Two Terminals)**

#### **Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

#### **Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

---

## ⚠️ **Important: Check Backend Configuration**

The backend requires a `.env` file. Make sure `backend/.env` exists with:

```env
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_KEY=your-service-key
JWT_SECRET=your-random-secret-key
HF_API_KEY=your-huggingface-key
PORT=5000
FRONTEND_URL=http://localhost:3000
```

---

## 🐛 **Troubleshooting**

### **Backend Not Starting?**

1. **Check if .env exists:**
   ```bash
   ls backend/.env
   ```

2. **Check terminal output** for errors like:
   - "Missing required environment variables"
   - "Port already in use"
   - "Cannot connect to Supabase"

3. **Verify Supabase connection:**
   - Make sure your Supabase URL and keys are correct
   - Check if your Supabase project is active

4. **Check if port 5000 is free:**
   ```powershell
   netstat -ano | findstr :5000
   ```

### **Frontend Not Starting?**

1. **Check if port 3000 is free:**
   ```powershell
   netstat -ano | findstr :3000
   ```

2. **Try different port:**
   ```bash
   cd frontend
   npm run dev -- -p 3001
   ```

---

## ✅ **Verify Servers Are Running**

### **Backend Health Check:**
Open: http://localhost:5000

You should see JSON with API information.

### **Frontend:**
Open: http://localhost:3000

You should see the homepage.

---

## 📋 **After Starting**

1. Wait 10-15 seconds for both servers to fully start
2. Open http://localhost:3000 in your browser
3. Login with:
   - **Email:** `test@example.com`
   - **Password:** `Test1234`

---

## 🛑 **Stop Servers**

Press `Ctrl+C` in each terminal window running the servers.

---

**Need help?** Check the terminal output for specific error messages!

