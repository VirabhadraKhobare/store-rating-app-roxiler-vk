-- Migration: Create initial tables
-- Run this file to set up the database schema

-- Check if database exists
SELECT 'Database setup starting...' AS status;

-- Create tables
\i '../schema.sql'

-- Verify tables were created
SELECT 'Tables created successfully' AS status;
SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- Show table structures
\d users
\d stores
\d ratings