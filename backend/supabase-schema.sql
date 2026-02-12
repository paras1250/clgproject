-- AI Chatbot Builder - Supabase Database Schema
-- Run this SQL in your Supabase SQL Editor to create the tables

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bots table
CREATE TABLE IF NOT EXISTS bots (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    documents JSONB DEFAULT '[]',
    model_name VARCHAR(255) DEFAULT 'google/flan-t5-large',
    is_active BOOLEAN DEFAULT TRUE,
    embed_code VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat_logs table
CREATE TABLE IF NOT EXISTS chat_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    bot_id UUID NOT NULL REFERENCES bots(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    messages JSONB DEFAULT '[]',
    session_id VARCHAR(255) UNIQUE NOT NULL,
    feedback JSONB,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bots_user_id ON bots(user_id);
CREATE INDEX IF NOT EXISTS idx_bots_embed_code ON bots(embed_code);
CREATE INDEX IF NOT EXISTS idx_chat_logs_bot_id ON chat_logs(bot_id);
CREATE INDEX IF NOT EXISTS idx_chat_logs_user_id ON chat_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_logs_session_id ON chat_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_logs_started_at ON chat_logs(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Enable Row Level Security (RLS) - Optional but recommended for production
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bots ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_logs ENABLE ROW LEVEL SECURITY;

-- Create policies (users can only access their own data)
-- These policies allow service role to access everything (for backend API)
-- For more security, adjust these policies based on your needs

-- Drop policies if they exist (to avoid errors if running multiple times)
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can insert own data" ON users;
DROP POLICY IF EXISTS "Bots are viewable by owner" ON bots;
DROP POLICY IF EXISTS "Bots are insertable by owner" ON bots;
DROP POLICY IF EXISTS "Chat logs are viewable by owner" ON chat_logs;
DROP POLICY IF EXISTS "Chat logs are insertable by owner" ON chat_logs;

-- Create the policies
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid()::text = id::text OR auth.role() = 'service_role');

CREATE POLICY "Users can insert own data" ON users
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Bots are viewable by owner" ON bots
    FOR SELECT USING (auth.role() = 'service_role' OR user_id::text = auth.uid()::text);

CREATE POLICY "Bots are insertable by owner" ON bots
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Chat logs are viewable by owner" ON chat_logs
    FOR SELECT USING (auth.role() = 'service_role' OR user_id::text = auth.uid()::text);

CREATE POLICY "Chat logs are insertable by owner" ON chat_logs
    FOR INSERT WITH CHECK (true);

