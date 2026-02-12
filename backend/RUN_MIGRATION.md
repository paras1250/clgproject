# 🔧 Database Migration Required

## ⚠️ **Issue: Internal Server Error When Creating Chatbot**

If you're getting "Internal server error" when creating a chatbot, the database might be missing the `document_contents` column.

---

## ✅ **Quick Fix: Run Migration**

### **Step 1: Open Supabase Dashboard**
1. Go to https://supabase.com
2. Sign in and select your project
3. Go to **SQL Editor** (left sidebar)

### **Step 2: Run Migration Script**
1. Open `backend/add-columns-migration.sql` file
2. Copy the entire content
3. Paste it into Supabase SQL Editor
4. Click **Run**

---

## 📋 **Migration SQL**

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

## ✅ **After Running Migration**

1. Restart your backend server
2. Try creating a chatbot again
3. Should work now! ✅

---

## 🔍 **Verify Migration**

After running, you can verify the columns exist:
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'bots' 
AND column_name IN ('document_contents', 'embed_settings');
```

Should return 2 rows.

---

## 📝 **What This Adds**

- **`document_contents`**: Stores training text and processed document content
- **`embed_settings`**: Stores widget customization settings

---

**After migration, chatbot creation should work!** 🚀

