-- Initialize PrintVerse Database
-- This file runs when the PostgreSQL container starts for the first time

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Set timezone
SET timezone = 'UTC';

-- Create additional indexes for better performance
-- (These will be created by Prisma, but we can add custom ones here if needed)

-- Grant necessary permissions
GRANT ALL PRIVILEGES ON DATABASE printverse TO printverse_user;
GRANT ALL PRIVILEGES ON SCHEMA public TO printverse_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO printverse_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO printverse_user;

-- Set default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO printverse_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO printverse_user; 