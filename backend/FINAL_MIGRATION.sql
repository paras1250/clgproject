-- ==========================================
-- FINAL MIGRATION SCRIPT
-- Run this entire script in your Supabase SQL Editor
-- to enable all Chatbot features.
-- ==========================================

-- 1. Add Support for Document Content & Embed Settings
ALTER TABLE bots 
ADD COLUMN IF NOT EXISTS document_contents JSONB DEFAULT '[]';

ALTER TABLE bots 
ADD COLUMN IF NOT EXISTS embed_settings JSONB DEFAULT '{"theme": "default", "position": "bottom-right"}'::jsonb;

-- Allow public chat (no user_id)
ALTER TABLE chat_logs 
ALTER COLUMN user_id DROP NOT NULL;

-- 2. Add System Prompt (Persona)
ALTER TABLE bots 
ADD COLUMN IF NOT EXISTS system_prompt TEXT DEFAULT 'You are a helpful AI assistant.';

UPDATE bots 
SET system_prompt = 'You are a helpful AI assistant.' 
WHERE system_prompt IS NULL;

-- 3. Add Customization (Greeting, Widget, Notifications)
ALTER TABLE bots 
ADD COLUMN IF NOT EXISTS greeting_message TEXT DEFAULT 'Hi! How can I help you today?';

ALTER TABLE bots 
ADD COLUMN IF NOT EXISTS widget_customization JSONB DEFAULT '{
  "width": "380",
  "height": "600",
  "primaryColor": "#8b5cf6",
  "avatar": "🤖",
  "language": "auto"
}'::jsonb;

ALTER TABLE bots 
ADD COLUMN IF NOT EXISTS notification_settings JSONB DEFAULT '{
  "emailNotifications": false,
  "emailAddress": null
}'::jsonb;

-- 4. User Language Preference
ALTER TABLE users
ADD COLUMN IF NOT EXISTS language_preference VARCHAR(10) DEFAULT 'en';

-- Final Check
SELECT 'Migration Complete' as status;
