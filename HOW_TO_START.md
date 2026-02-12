# How to Start the Project 🚀

## Quick Start (Easiest Method)

### Option 1: Use the Startup Scripts

**For Windows (PowerShell):**
```powershell
.\start-dev.ps1
```

**For Windows (Command Prompt):**
```batch
start-dev.bat
```

These scripts will automatically start both backend and frontend servers in separate windows.

---

## Manual Start Method

### Step 1: Start Backend Server

Open a terminal/command prompt and run:

```bash
cd backend
npm start
```

The backend will start on **http://localhost:5000**

### Step 2: Start Frontend Server

Open a **NEW** terminal/command prompt and run:

```bash
cd frontend
npm run dev
```

The frontend will start on **http://localhost:3000**

---

## Verify Everything is Running

1. **Check Backend**: Open http://localhost:5000/health
   - Should show: `{"status":"OK","message":"Server is running",...}`

2. **Check Frontend**: Open http://localhost:3000
   - Should show the landing page

---

## Troubleshooting

### If Backend Won't Start:
- Make sure port 5000 is not already in use
- Check that `.env` file exists in `backend/` directory
- Verify Supabase credentials in `.env` file

### If Frontend Won't Start:
- Make sure port 3000 is not already in use
- Try: `npm install` in the `frontend/` directory
- Check browser console for errors

### If Frontend Can't Connect to Backend:
- Ensure backend is running first (port 5000)
- Check browser console network tab for API errors
- Verify `NEXT_PUBLIC_API_URL` in frontend `.env.local` (if exists) points to `http://localhost:5000`

---

## Ports Used

- **Backend**: 5000
- **Frontend**: 3000

Make sure these ports are free before starting!

