# ⚙️ Backend Environment Setup

## ❌ **Issue Found: Missing .env File!**

Your backend cannot start without a `.env` file containing required configuration.

---

## 🔧 **Quick Fix**

### **Step 1: Create .env File**

In the `backend` folder, create a file named `.env` (no extension)

### **Step 2: Add Required Variables**

Copy this template and fill in your values:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
JWT_SECRET=your-random-secret-key-minimum-32-chars
HF_API_KEY=your_huggingface_api_token
PORT=5000
FRONTEND_URL=http://localhost:3000
```

---

## 📋 **How to Get Your Values**

### **1. Supabase Credentials**

1. Go to https://supabase.com
2. Sign in to your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `SUPABASE_URL`
   - **service_role key** (under Project API keys) → `SUPABASE_SERVICE_KEY`

### **2. JWT Secret**

Generate a random string (at least 32 characters). You can use:
- An online generator: https://randomkeygen.com
- Or use this command: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### **3. Hugging Face API Key**

- Already provided in template: `your_huggingface_api_token`
- Or get your own at: https://huggingface.co/settings/tokens

---

## ✅ **After Creating .env**

1. Save the `.env` file in the `backend` folder
2. Restart the backend server:
   ```bash
   cd backend
   npm run dev
   ```

---

## 🔒 **Security Note**

⚠️ **Never commit .env to Git!**

The `.env` file should be in `.gitignore` (it should be already).

---

## 🎯 **Example .env File**

```env
SUPABASE_URL=https://abcdefghijklmnop.supabase.co
SUPABASE_SERVICE_KEY=your-supabase-service-role-key
JWT_SECRET=my-super-secret-jwt-key-for-ai-chatbot-builder-app-2024
HF_API_KEY=your_huggingface_api_token
PORT=5000
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

---

## 🚀 **Once .env is Ready**

Run the project:
```bash
# Terminal 1
cd backend
npm run dev

# Terminal 2  
cd frontend
npm run dev
```

Or use the PowerShell script:
```powershell
.\start-servers.ps1
```

---

**Need help?** Check your Supabase dashboard for the correct credentials!

