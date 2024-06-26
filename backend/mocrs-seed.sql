-- Clear existing data
TRUNCATE users, rooms RESTART IDENTITY CASCADE;

-- Seed users
INSERT INTO users (username, password, first_name, last_name, email, is_admin) VALUES
('test', 'tester', 'test', 'test', 'test@mocrs.com', false);

-- Seed rooms
INSERT INTO rooms (name, description, room_type, is_private, creator_id) VALUES
('General Meeting', 'Room for general meetings', 'meeting', false, 1),
('Quiet Study', 'Silent room for focused study', 'study', false, 1),
('Brainstorm Central', 'Creative space for idea generation', 'focus', false, 1),
('Private Chat', 'Confidential discussion room', 'chat', true, 1),
('Team Huddle', 'Quick team sync-up space', 'meeting', false, 1),
('Fun Zone', 'Relaxation and casual chat area', 'social', false, 1);

-- Display the seeded rooms with their auto-generated UUIDs
SELECT id, uuid, name, room_type, creator_id FROM rooms;