-- Enhanced Migration: Add customization and notification features
-- Run this in Supabase SQL Editor after add-columns-migration.sql

-- Add custom greeting message
ALTER TABLE bots 
ADD COLUMN IF NOT EXISTS greeting_message TEXT DEFAULT 'Hi! How can I help you today?';

-- Add widget customization settings (size, colors, avatar)
ALTER TABLE bots 
ADD COLUMN IF NOT EXISTS widget_customization JSONB DEFAULT '{
  "width": "380",
  "height": "600",
  "primaryColor": "#8b5cf6",
  "avatar": "🤖",
  "language": "auto"
}'::jsonb;

-- Add notification settings
ALTER TABLE bots 
ADD COLUMN IF NOT EXISTS notification_settings JSONB DEFAULT '{
  "emailNotifications": false,
  "emailAddress": null
}'::jsonb;

-- Add language preference to users (for multi-language support)
ALTER TABLE users
ADD COLUMN IF NOT EXISTS language_preference VARCHAR(10) DEFAULT 'en';

