-- Migration: Add document_contents and embed_settings columns to bots table
-- Run this in Supabase SQL Editor

-- Add document_contents column (JSONB) to store processed document content
ALTER TABLE bots 
ADD COLUMN IF NOT EXISTS document_contents JSONB DEFAULT '[]';

-- Add embed_settings column (JSONB) to store embed widget settings
ALTER TABLE bots 
ADD COLUMN IF NOT EXISTS embed_settings JSONB DEFAULT '{"theme": "default", "position": "bottom-right"}'::jsonb;

-- Update chat_logs to allow null user_id for embedded bots
ALTER TABLE chat_logs 
ALTER COLUMN user_id DROP NOT NULL;

