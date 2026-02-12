-- Migration: Add system_prompt column to bots table
-- Created: 2026-01-16
-- Description: Allows users to define a custom persona/instructions for their chatbot.

ALTER TABLE bots 
ADD COLUMN IF NOT EXISTS system_prompt TEXT DEFAULT 'You are a helpful AI assistant.';

-- Update existing bots to have a default system prompt if needed
UPDATE bots 
SET system_prompt = 'You are a helpful AI assistant.' 
WHERE system_prompt IS NULL;
