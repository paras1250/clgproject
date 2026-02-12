# Supabase Setup Guide

This project now uses Supabase (PostgreSQL) instead of MongoDB.

## Quick Setup Steps

### 1. Create Supabase Account
1. Go to https://supabase.com
2. Sign up for free account
3. Create a new project
4. Wait for project to be ready (~2 minutes)

### 2. Get Your Supabase Credentials
1. Go to your project dashboard
2. Click **Settings** (gear icon) → **API**
3. Copy:
   - **Project URL** (under "Project URL")
   - **service_role key** (under "Project API keys" → "service_role" key)
   - ⚠️ **Keep the service_role key secret!**

### 3. Create Database Tables
1. Go to **SQL Editor** in your Supabase dashboard
2. Open the file: `backend/supabase-schema.sql`
3. Copy the entire SQL content
4. Paste it into the SQL Editor
5. Click **Run** to execute
6. ✅ Tables created!

### 4. Update Environment Variables
Edit `backend/.env` and add:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key-here
HF_API_KEY=your_huggingface_api_token
JWT_SECRET=your-random-secret-key
```

### 5. Install Dependencies
```bash
cd backend
npm install
```

### 6. Start the Server
```bash
npm run dev
```

✅ Done! Your backend is now using Supabase.

## What Changed?

- ✅ **Database**: MongoDB → Supabase (PostgreSQL)
- ✅ **Models**: Mongoose → Supabase Client
- ✅ **Queries**: MongoDB queries → Supabase queries
- ✅ **Schema**: JSON documents → SQL tables with relationships

## Tables Created

1. **users** - User accounts
2. **bots** - Chatbot configurations
3. **chat_logs** - Chat conversation history

## Security Notes

- The `service_role` key has admin access - keep it secret!
- Row Level Security (RLS) is enabled but permissive for service role
- For production, consider tightening RLS policies

## Troubleshooting

### "Table doesn't exist"
- Run the SQL schema file in Supabase SQL Editor

### "Invalid API key"
- Verify SUPABASE_URL and SUPABASE_SERVICE_KEY in .env
- Make sure you're using the **service_role** key (not anon key)

### "Connection error"
- Check your Supabase project is active
- Verify network access isn't blocked
- Check the URL format: `https://xxxxx.supabase.co`

## Supabase Dashboard

You can view and manage your data in the Supabase dashboard:
- **Table Editor**: View/edit data
- **SQL Editor**: Run custom queries
- **Database**: View table structure

## Migration from MongoDB

If you had data in MongoDB, you'll need to:
1. Export data from MongoDB
2. Transform to match Supabase schema
3. Import using Supabase dashboard or API

---

**Questions?** Check Supabase docs: https://supabase.com/docs

