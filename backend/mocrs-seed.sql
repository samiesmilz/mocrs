-- Clear existing data
TRUNCATE users, rooms RESTART IDENTITY CASCADE;

-- Seed users
INSERT INTO users (username, password, first_name, last_name, email, is_admin) VALUES
('admin', 'hashed_password_admin', 'Admin', 'User', 'admin@mocrs.com', true),
('jim_roe', 'hashed_password_1', 'Jim', 'Roe', 'jim@mocrs.com', false),
('jane_smith', 'hashed_password_2', 'Jane', 'Smith', 'jane@mocrs.com', false);

-- Seed rooms
INSERT INTO rooms (name, description, room_type, is_private, creator_id) VALUES
('General Meeting', 'Room for general meetings', 'meeting', false, 1),
('Quiet Study', 'Silent room for focused study', 'study', false, 2),
('Brainstorm Central', 'Creative space for idea generation', 'focus', false, 1),
('Private Chat', 'Confidential discussion room', 'chat', true, 3),
('Team Huddle', 'Quick team sync-up space', 'meeting', false, 2),
('Fun Zone', 'Relaxation and casual chat area', 'social', false, 1);

-- Display the seeded rooms with their auto-generated UUIDs
SELECT id, uuid, name, room_type, creator_id FROM rooms;