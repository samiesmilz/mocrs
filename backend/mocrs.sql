\echo 'Delete and recreate mocrs db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE mocrs;
CREATE DATABASE mocrs;
\connect mocrs

\i mocrs-schema.sql
\i mocrs-seed.sql

\echo 'Delete and recreate mocrs_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE mocrs_test;
CREATE DATABASE mocrs_test;
\connect mocrs_test

\i mocrs-schema.sql
