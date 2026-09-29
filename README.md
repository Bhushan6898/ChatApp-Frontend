# Real-Time Chat Application

A real-time chat application built using **React, Node.js, Express.js, Socket.io, and MongoDB**. The application allows registered users to log in, communicate in real time, and view previous chat messages.

## Features

### Authentication

* User registration
* User login
* Username/email-based authentication
* Password validation
* Protected chat access
* Logout functionality

### Chat

* One-to-one real-time messaging
* Send messages instantly
* Receive messages instantly using Socket.io
* Chat history
* Message timestamps
* Messages remain available after page refresh
* Online/offline connection handling
* Responsive chat interface

### Backend

* REST APIs using Express.js
* Socket.io real-time communication
* MongoDB database
* Mongoose ODM
* Error handling
* CORS configuration

### Deployment

* Frontend deployed on Netlify
* Backend deployed on Render
* MongoDB hosted using MongoDB Atlas

---

# Technology Stack

## Frontend

* React
* JavaScript
* Axios
* Socket.io Client
* HTML5
* CSS3
* Bootstrap / Responsive CSS

## Backend

* Node.js
* Express.js
* Socket.io
* MongoDB
* Mongoose
* CORS

---

# Application Flow

```text
User
 │
 ├── Register
 │      ↓
 │   MongoDB
 │
 ├── Login
 │      ↓
 │   Authentication
 │      ↓
 │   Chat Application
 │      ↓
 ├── Fetch Previous Messages
 │
 └── Send Message
        ↓
     Socket.io
        ↓
   Connected User
        ↓
     MongoDB
```

---

# Authentication Flow

## Register

A new user provides the required registration information.

Example:

```text
Username
Email
Password
```

The frontend sends the registration request to the backend.

```http
POST /api/user/register
```

The backend validates the information and creates the user in MongoDB.

Example response:

```json
{
  "success": true,
  "message": "User registered successfully"
}
```

---

# Login

Registered users can log in using their credentials.

```http
POST /api/user/login
```

Example request:

```json
{
  "email": "user@example.com",
  "password": "password"
}
```

After successful authentication, the user is redirected to the chat application.

Example response:

```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "_id": "USER_ID",
    "username": "User"
  }
}
```

---

# Logout

The user can log out from the application.

```http
POST /api/user/logout
```

After logout, the user is returned to the login screen.

---

# Chat APIs

## Health Check

```http
GET /api/health
```

Checks whether the backend and database are available.

## Connection

```http
GET /api/connection
```

Checks the server/database connection.

## Send Message

```http
POST /api/conversations/messages
```

Example:

```json
{
  "senderId": "USER_ID",
  "receiverId": "USER_ID",
  "message": "Hello!"
}
```

## Fetch Chat History

```http
GET /api/conversations/:userId/:receiverId
```

Returns previous messages between two users.

---

# Socket.io Real-Time Communication

Socket.io is used for real-time messaging.

When a user sends a message:

```text
User A
   │
   │ send_message
   ↓
Socket.io Server
   │
   ├── Save message to MongoDB
   │
   └── Broadcast message
          ↓
       User B
```

The receiving user gets the message immediately without refreshing the page.

Example events:

```text
connection
join_room
send_message
receive_message
disconnect
```

---

# Database

MongoDB is used to store users and chat messages.

## User

Example fields:

```text
_id
username
email
password
createdAt
updatedAt
```

## Message

Example fields:

```text
_id
senderId
receiverId
message
createdAt
updatedAt
```

MongoDB timestamps are used to display the message date and time.

---

# Project Structure

```text
chat-application/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── Login/
│   │   │   ├── Register/
│   │   │   └── Chat/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── .env.example
│
├── backend/
│   ├── controllers/
│   ├── models/
│   │   ├── User.js
│   │   └── Message.js
│   ├── routes/
│   │   ├── userRoutes.js
│   │   └── conversationRoutes.js
│   ├── middleware/
│   ├── socket/
│   ├── config/
│   ├── app.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── README.md
└── .gitignore
```

---

# Environment Variables

## Backend

Create a `.env` file inside the backend folder:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
FRONTEND_ORIGIN=https://livechatapplications.netlify.app
```

## Frontend

Create a `.env` file:

```env
VITE_API_URL=https://chatapp-backend-6zgm.onrender.com
VITE_SOCKET_URL=https://chatapp-backend-6zgm.onrender.com
```

Do not commit the actual `.env` file to GitHub.

Use `.env.example` files for documentation.

---

# Local Setup

## Clone Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd chat-application
```

---

# Backend Setup

```bash
cd backend
npm install
```

Create the `.env` file and add the required environment variables.

Run the backend:

```bash
npm run dev
```

Backend:

```text
http://localhost:5000
```

---

# Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Run the frontend:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# User Flow

```text
1. Open Application
        ↓
2. Register New Account
        ↓
3. Login
        ↓
4. Open Chat
        ↓
5. Select User
        ↓
6. Fetch Previous Messages
        ↓
7. Send Message
        ↓
8. Socket.io Delivers Message
        ↓
9. Receiver Gets Message Instantly
        ↓
10. Message Saved in MongoDB
```

---

# Design Decisions

### React

React was selected for building a reusable and responsive user interface.

### Node.js + Express

Node.js and Express provide the REST API layer and handle authentication, users, and chat operations.

### Socket.io

Socket.io was selected because real-time communication is a mandatory requirement of this project.

### MongoDB

MongoDB is used to persist user accounts and chat messages so that messages remain available after refreshing the application.

### REST + Socket.io

REST APIs are used for authentication and retrieving historical data, while Socket.io is used for real-time message delivery.

---

# Error Handling

The application handles:

* Invalid login credentials
* Registration validation errors
* API errors
* Database connection errors
* Socket connection errors
* User disconnections
* Invalid requests
* CORS configuration

---

# Deployment

## Frontend

```text
https://livechatapplications.netlify.app
```

## Backend

```text
https://chatapp-backend-6zgm.onrender.com
```

## API Connection

```text
https://chatapp-backend-6zgm.onrender.com/api/connection
```

---

# Testing

The application was tested using multiple browser sessions.

### Authentication

* Register a new user
* Login with registered credentials
* Logout
* Login again

### Real-Time Messaging

* Login as User A
* Login as User B
* Send a message from User A
* Verify that User B receives the message instantly
* Reply from User B
* Verify that User A receives the reply

### Persistence

* Send messages
* Refresh the application
* Verify previous messages are displayed

### Connection

* Disconnect a browser
* Reconnect
* Verify Socket.io connection is restored

---

# Bonus Features

The application may include the following additional features:

* Username-based login
* Online/offline status
* Typing indicator
* Message read/delivered status
* MongoDB persistence
* Responsive design
* Deployed frontend
* Deployed backend

Only mark a bonus feature as implemented if it is working in the submitted application.

---

# Submission

## GitHub Repository

```text
YOUR_GITHUB_REPOSITORY_URL
```

## Live Application

```text
https://livechatapplications.netlify.app
```

## Backend API

```text
https://chatapp-backend-6zgm.onrender.com
```

## Screen Recording

```text
YOUR_GOOGLE_DRIVE_SCREEN_RECORDING_LINK
```

## APK

Not applicable because this submission uses the React web frontend.

---

# Assumptions

* Users must register before accessing the chat.
* Login credentials are required to access protected chat functionality.
* MongoDB is used for persistent storage.
* Socket.io handles real-time communication.
* REST APIs handle authentication and chat history.
* The application is designed primarily for one-to-one messaging.
* Internet connectivity is required for real-time communication.

---

# Author

**Bhushan Patil**

Real-Time Chat Application
React | Node.js | Express.js | Socket.io | MongoDB
