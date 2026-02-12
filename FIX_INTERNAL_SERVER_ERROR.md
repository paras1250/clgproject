# 🔧 Fix: Internal Server Error When Creating Chatbot

## 🎯 **Problem**

Getting "Internal server error" when creating a chatbot with training text.

---

## ✅ **Solution: Run Database Migration**

The database is missing the `document_contents` column needed for training text.

### **Quick Steps:**

1. **Open Supabase Dashboard**
   - Go to https://supabase.com
   - Sign in → Select your project
   - Click **SQL Editor** (left sidebar)

2. **Run Migration**
   - Open file: `backend/add-columns-migration.sql`
   - Copy ALL the SQL code
   - Paste into Supabase SQL Editor
   - Click **Run** button

3. **Verify**
   - Should see "Success. No rows returned"
   - Columns are now added

4. **Restart Backend**
   - Type `rs` in backend terminal (or restart)
   - Try creating chatbot again

---

## 📋 **Migration SQL to Copy:**

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

---

## 🔍 **How to Verify Migration Worked:**

In Supabase SQL Editor, run:
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'bots' 
AND column_name IN ('document_contents', 'embed_settings');
```

Should return 2 rows with the column names.

---

## ✅ **After Migration**

1. ✅ Backend will auto-restart (nodemon)
2. ✅ Try creating chatbot again
3. ✅ Should work without errors!

---

## 📝 **Better Error Messages**

I've also improved error handling:
- ✅ Shows specific error in development mode
- ✅ Shows migration instructions if column missing
- ✅ More helpful error messages

---

**After running migration, chatbot creation will work!** 🚀

