# 🚀 **RUN MIGRATION NOW - Step by Step**

## ✅ **You're seeing this error because the database needs the migration!**

---

## 📋 **Step-by-Step Instructions:**

### **Step 1: Open Supabase** (30 seconds)

1. Go to: **https://app.supabase.com**
2. **Sign in** to your account
3. **Click on your project** (the one you're using for this app)

---

### **Step 2: Open SQL Editor** (10 seconds)

1. Look at the **left sidebar**
2. Find **"SQL Editor"** (has a SQL icon 📝)
3. **Click on it**

---

### **Step 3: Run Migration SQL** (1 minute)

1. **Copy this ENTIRE SQL code** (select all and Ctrl+C):

```sql
-- Add document_contents column (JSONB) to store processed document content
ALTER TABLE bots 
ADD COLUMN IF NOT EXISTS document_contents JSONB DEFAULT '[]';

-- Add embed_settings column (JSONB) to store embed widget settings
ALTER TABLE bots 
ADD COLUMN IF NOT EXISTS embed_settings JSONB DEFAULT '{"theme": "default", "position": "bottom-right"}'::jsonb;

-- Update chat_logs to allow null user_id for embedded bots
ALTER TABLE chat_logs 
ALTER COLUMN user_id DROP NOT NULL;
```

2. **Paste it** into the SQL Editor text box
3. **Click the "RUN" button** (green button, usually at bottom right)
4. **Wait for result** - Should see: ✅ "Success. No rows returned"

---

### **Step 4: Verify Migration Worked** (Optional - 30 seconds)

To confirm the columns were added, run this in SQL Editor:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'bots' 
AND column_name IN ('document_contents', 'embed_settings');
```

**Expected result:** Should show 2 rows with `document_contents` and `embed_settings`

---

### **Step 5: Try Creating Chatbot Again** (30 seconds)

1. Go back to your app
2. Try creating a chatbot again
3. ✅ **Should work now!**

---

## 🎯 **What This Migration Does:**

- ✅ Adds `document_contents` column - Stores training text you enter
- ✅ Adds `embed_settings` column - Stores widget customization
- ✅ Updates `chat_logs` table - Allows embedded bots without user_id

---

## ❌ **If You See an Error:**

- **"relation 'bots' does not exist"** → Run `backend/supabase-schema.sql` first
- **"syntax error"** → Make sure you copied ALL 3 SQL statements
- **"permission denied"** → You need admin access to your Supabase project

---

## ✅ **After Migration:**

- Backend will auto-detect the columns
- Chatbot creation will work immediately
- No restart needed (but you can restart if you want)

---

**That's it! The migration should take less than 2 minutes total.** 🚀

