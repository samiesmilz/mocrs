# MOCRs - A Collaborative Learning & Connecting Playground

## 1. Introduction

### 1.1 Project Overview

MOCRs (Massive Open Curiosity Rooms) is an innovative online platform designed to revolutionize learning through collaboration and curiosity. This dynamic platform allows users to engage in MOCRs, where they can explore various topics through real-time discussions facilitated by both human participants and virtual AI talking avatars. MOCRs aim to create a vibrant learning environment by incorporating interactive elements such as whiteboards, shared resources, and gamified features like badges and quests. The ultimate goal is to foster collaboration, promote easy discussion, encourage the discovery of new ideas, and enhance learning through shared resources and AI-assisted interactions.

### 1.2 Objectives

- To create a user-friendly web application that facilitates collaborative learning.
- To promote curiosity and lifelong learning among users of all ages and interests.
- To provide a platform where users can easily create, join, and participate in virtual learning rooms.
- To enhance learning experiences through the integration of AI assistants and gamified elements.

## 2. Target Audience

MOCRs are designed for lifelong learners and enthusiasts of all ages, including:

- Students seeking collaborative study environments.
- Hobbyists exploring new interests.
- History buffs, science enthusiasts, and other knowledge seekers.
- Anyone passionate about exploring new topics and engaging in meaningful discussions.

## 3. Features and Functionality

### 3.1 Massive Open Curiosity Rooms (MOCRs)

- **Real-time Discussions**: Users can engage in live discussions on various topics with other participants and AI avatars.
- **AI Assistants**: Virtual AI talking avatars facilitate discussions, provide information, and assist with resource management.
- **Interactive Whiteboards**: Shared whiteboards for brainstorming, note-taking, and collaborative problem-solving.
- **Resource Sharing**: Users can upload and share resources like documents, videos, and links within the rooms.
- **Gamified Elements**: Features like badges, quests, and leaderboards to motivate and reward active participation and knowledge sharing.

### 3.2 User Interaction

- **Room Browsing**: Users can browse live virtual rooms by topic or intention, such as “learn how to use AI,” “silent study together group,” or “meditation group.”
- **Room Creation**: Users can create their own rooms, either private (with controlled access) or public (open to anyone).
- **Customization**: Room creators can customize the room’s features, such as setting discussion rules, enabling/disabling certain tools, and more.

## 4. Minimum Viable Product (MVP)

### 4.1 Core Features

- **Web Application**: A functional web platform accessible via browsers.
- **Live Virtual Rooms**: Users can browse, join, and create virtual rooms.
- **Real-time Interaction**: Live chat and discussion tools within the rooms.
- **Resource Sharing**: Basic functionality for uploading and sharing resources.
- **Gamified Elements**: Initial set of badges and quests to encourage participation.

## 5. Technologies Used

### 5.1 Frontend

- **Framework**: React
- **Routing**: React Router
- **Real-time Communication**: Jitsi SDK
- **HTTP Client**: Axios
- **Package Manager**: Vite

### 5.2 Backend

- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JSON Web Tokens (JWT)
- **Environment Management**: dotenv
- **Miscellaneous**: bcrypt, morgan, cors

## 6. SDKs Used

- **Jitsi React SDK**: For real-time video and audio communication.

## 7. Setup Instructions

### 7.1 Prerequisites

- Node.js
- npm or yarn
- PostgreSQL

### 7.2 Installation

#### Clone the Repository

```bash
git clone https://github.com/yourusername/mocrs.git
cd mocrs
```

#### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory and add the necessary environment variables:

   ```env
   DATABASE_URL=your_database_url
   JWT_SECRET=your_jwt_secret
   FRONTEND_URL=http://localhost:5173
   ```

4. Run the backend server:
   ```bash
   npm start
   ```

#### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory and add the necessary environment variables:

   ```env
   VITE_BACKEND_URL=http://localhost:5001/api
   ```

4. Run the frontend development server:
   ```bash
   npm run dev
   ```

## 8. Usage

### 8.1 Running the Application

- Ensure the backend server is running:
  ```bash
  cd backend
  npm start
  ```
- Ensure the frontend server is running:
  ```bash
  cd frontend
  npm run dev
  ```

### 8.2 Accessing the Application

- Open your browser and navigate to `http://localhost:5173`.

### 8.3 Navigating the Application

- **Home Page**: Browse available rooms or create a new one.
- **Spaces**: Join live spaces by clicking on the space card.
- **Profile**: Manage your user profile and settings.
- **Login/Signup**: Authenticate to access additional features like creating rooms.

## 9. Major Code Files

### 9.1 Frontend

- **AllRoutes.jsx**: Defines the routing for the application.
- **SpaceList.jsx**: Component to list and manage spaces.
- **LiveSpace.jsx**: Component for live space interaction using Jitsi.
- **api.js**: Handles API requests.

### 9.2 Backend

- **app.js**: Main application setup with middleware and routes.
- **routes/roomRoutes.js**: Routes for room-related operations.
- **controllers/roomController.js**: Controllers for room-related logic.
- **middleware/auth.js**: Middleware for authentication.
- **middleware/rateLimiter.js**: Middleware for rate limiting.

## 10. API Documentation

### 10.1 Room Endpoints

- `GET /api/rooms`: Fetch all rooms.
- `POST /api/rooms`: Create a new room.
- `GET /api/rooms/:id`: Fetch a specific room by ID.
- `POST /api/rooms/:id/join`: Join a room.
- `POST /api/rooms/:id/leave`: Leave a room.

### 10.2 User Endpoints

- `POST /api/auth/login`: Authenticate a user.
- `POST /api/auth/register`: Register a new user.
- `GET /api/users/:username`: Fetch user details by username.
- `PATCH /api/users/:username`: Update user details.

### 10.3 Jitsi Token Endpoint

- `POST /api/auth/jtoken`: Create a Jitsi token for a user to join a room.

Sure, here is the structured model in Markdown format:

````markdown
# Database Structure Model

## Enable UUID Extension

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```
````

## Users Table

**Table Name:** users

| Column Name | Data Type   | Constraints            | Description                                     |
| ----------- | ----------- | ---------------------- | ----------------------------------------------- |
| id          | SERIAL      | PRIMARY KEY            | Unique identifier for each user                 |
| username    | VARCHAR(25) | UNIQUE NOT NULL        | Unique username for each user                   |
| password    | TEXT        | NOT NULL               | Encrypted password for user authentication      |
| first_name  | TEXT        | NOT NULL               | First name of the user                          |
| last_name   | TEXT        | NOT NULL               | Last name of the user                           |
| email       | TEXT        | NOT NULL UNIQUE        | User's email address                            |
|             |             | CHECK EMAIL            | Validates email format                          |
| is_admin    | BOOLEAN     | NOT NULL DEFAULT FALSE | Indicates if the user has administrative rights |

## Rooms Table

**Table Name:** rooms

| Column Name  | Data Type    | Constraints                                     | Description                                |
| ------------ | ------------ | ----------------------------------------------- | ------------------------------------------ |
| id           | SERIAL       | PRIMARY KEY                                     | Unique identifier for each room            |
| uuid         | UUID         | DEFAULT uuid_generate_v4() NOT NULL UNIQUE      | Universally unique identifier for the room |
| name         | VARCHAR(255) | NOT NULL                                        | Name of the room                           |
| description  | TEXT         | CHECK (LENGTH(description) <= 250)              | Description of the room                    |
| room_type    | VARCHAR(20)  | CHECK (room_type IN ('meeting', 'study',..))    | Type of the room (e.g., meeting, study)    |
| is_private   | BOOLEAN      | DEFAULT FALSE                                   | Indicates if the room is private           |
| creator_id   | INTEGER      | NOT NULL REFERENCES users(id) ON DELETE CASCADE | ID of the user who created the room        |
| created_at   | TIMESTAMP    | NOT NULL DEFAULT CURRENT_TIMESTAMP              | Timestamp when the room was created        |
| participants | INTEGER      | DEFAULT 0                                       | Number of participants in the room         |

## Indexes

**Table:** rooms

| Index Name           | Column(s)  | Description                            |
| -------------------- | ---------- | -------------------------------------- |
| idx_rooms_creator_id | creator_id | Index on creator_id for faster lookups |
| idx_rooms_uuid       | uuid       | Index on uuid for faster lookups       |

## Relationships

- **One-to-Many Relationship**: A user (from `users` table) can create multiple rooms (in `rooms` table), but each room has only one creator.
  - **Foreign Key**: `rooms.creator_id` references `users.id`.

## ERD (Entity-Relationship Diagram) Description

1. **Users Entity**:

   - Attributes: id, username, password, first_name, last_name, email, is_admin
   - Primary Key: id
   - Unique Constraints: username, email

2. **Rooms Entity**:
   - Attributes: id, uuid, name, description, room_type, is_private, creator_id, created_at, participants
   - Primary Key: id
   - Foreign Key: creator_id (references `users.id`)
   - Unique Constraints: uuid

## Additional Notes

- The `uuid_generate_v4()` function is used to generate a unique identifier for each room, ensuring each room has a globally unique identifier.
- The `email` column in the `users` table uses a regular expression to validate email format.
- The `room_type` column in the `rooms` table restricts values to predefined types ('meeting', 'study', 'focus', 'chat') to ensure data integrity.
- Indexes on `rooms.creator_id` and `rooms.uuid` are added to enhance query performance.

## 11. Why This Project

MOCRs was created to address the need for more interactive, engaging, and collaborative online learning environments. By integrating real-time discussions, AI assistance, and gamified elements, MOCRs aims to make learning more dynamic and enjoyable, fostering a community of curious minds eager to explore and learn together.

## 12. Contact Information

For support or contributions, please contact:

- **Email**: samie@mocrs.com
- **GitHub**: [MOCRs Repository](https://github.com/samiesmilz/mocrs)
