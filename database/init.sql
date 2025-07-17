-- Create database and user if they don't exist
CREATE DATABASE IF NOT EXISTS cyber_agent;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create indexes for better performance
-- These will be created automatically by SQLAlchemy, but you can add custom ones here

-- Example: Index for frequently queried fields
-- CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
-- CREATE INDEX IF NOT EXISTS idx_test_runs_agent_type ON test_runs(agent_type);
-- CREATE INDEX IF NOT EXISTS idx_test_results_severity ON test_results(severity);