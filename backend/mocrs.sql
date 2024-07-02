\echo 'Delete and recreate mocrs db?'
\prompt 'Return for yes or control-C to cancel > ' foo

-- Drop mocrs database if it exists
DROP DATABASE IF EXISTS mocrs;
-- Create mocrs database
CREATE DATABASE mocrs;
-- Connect to mocrs database
\connect mocrs;

-- Execute schema and seed scripts for mocrs database
\i mocrs-schema.sql
\i mocrs-seed.sql

\echo 'Delete and recreate mocrs_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

-- Drop mocrs_test database if it exists
DROP DATABASE IF EXISTS mocrs_test;
-- Create mocrs_test database
CREATE DATABASE mocrs_test;
-- Connect to mocrs_test database
\connect mocrs_test;

-- Execute schema script for mocrs_test database
\i mocrs-schema.sql

