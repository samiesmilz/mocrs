

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(25) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE
    CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z]{2,}$'),
  is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

-- Create rooms table with UUID column
CREATE TABLE rooms (
  id SERIAL PRIMARY KEY,
  uuid UUID DEFAULT uuid_generate_v4() NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  description TEXT CHECK (LENGTH(description) <= 250),
  room_type VARCHAR(20) CHECK (room_type IN ('meeting', 'study', 'focus', 'chat')),
  is_private BOOLEAN DEFAULT FALSE,
  creator_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  participants INTEGER DEFAULT 0
);

-- Create index on creator_id in rooms table
CREATE INDEX idx_rooms_creator_id ON rooms(creator_id);

-- Create index on uuid in rooms table for faster lookups
CREATE INDEX idx_rooms_uuid ON rooms(uuid);