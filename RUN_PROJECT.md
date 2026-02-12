# 🚀 Running Your Project

## ✅ **Servers Started!**

Both servers are now running in the background:

---

## 📡 **Server URLs**

### **Backend API**
```
http://localhost:5000
```

### **Frontend Application**
```
http://localhost:3000
```

---

## 🎯 **Quick Access**

### **Main Application**
👉 **http://localhost:3000**

### **Login Page**
👉 **http://localhost:3000/login**

---

## 🔐 **Test User Credentials**

Use these to login and test the application:

```
Email:    test@example.com
Password: Test1234
```

**Password Requirements:**
- ✅ At least 8 characters
- ✅ Contains uppercase (T)
- ✅ Contains lowercase (est)
- ✅ Contains number (1234)

---

## 🧪 **Testing Flow**

1. **Open:** http://localhost:3000
2. **Click:** "Login" or go to `/login`
3. **Enter Credentials:**
   - Email: `test@example.com`
   - Password: `Test1234`
4. **Explore Features:**
   - ✅ Dashboard
   - ✅ Create Chatbots
   - ✅ Text Training
   - ✅ File Uploads
   - ✅ Edit Bots
   - ✅ Premium UI

---

## 📋 **Available Features**

### **Dashboard**
- View all your chatbots
- Analytics overview
- Quick actions

### **Bot Builder**
- Create new chatbots
- Text training input
- File uploads (PDF, DOC, DOCX, TXT)
- 4-step wizard

### **Edit Bot**
- Update bot settings
- Edit training text
- Upload/remove documents
- Customize widget
- Live preview

---

## ⚙️ **Managing Servers**

### **Stop Servers**
Press `Ctrl+C` in the terminal windows running the servers

### **Restart Backend**
```bash
cd backend
npm run dev
```

### **Restart Frontend**
```bash
cd frontend
npm run dev
```

---

## 🐛 **Troubleshooting**

### **Port Already in Use**
If you see port errors:
- Backend (5000): Change `PORT` in `backend/.env`
- Frontend (3000): Use `npm run dev -- -p 3001`

### **Database Connection**
Make sure your `backend/.env` has:
```
SUPABASE_URL=your-url
SUPABASE_SERVICE_KEY=your-key
```

### **Modules Not Found**
Run installation:
```bash
cd backend && npm install
cd ../frontend && npm install
```

---

## 🎊 **Status**

✅ **Backend:** Running  
✅ **Frontend:** Running  
✅ **Database:** Connected  
✅ **Test User:** Ready  

**Your app is LIVE and ready to use!** 🚀

---

**Access Now:** http://localhost:3000

