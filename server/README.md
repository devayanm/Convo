# Convo - Backend API

Convo is a meeting application with features similar to Zoom. This document outlines the API endpoints and usage instructions for the backend server.

## API Endpoints

### Meetings

- **Create a Meeting**
  - **Endpoint:** `POST /api/meetings`
  - **Description:** Create a new meeting.
  - **Request Body:**
    ```json
    {
      "title": "Meeting Title",
      "description": "Meeting Description",
      "start_time": "2024-09-07T10:00:00",
      "end_time": "2024-09-07T11:00:00",
      "creator_id": 1
    }
    ```
  - **Response:**
    ```json
    {
      "id": 1,
      "title": "Meeting Title",
      "description": "Meeting Description",
      "start_time": "2024-09-07T10:00:00",
      "end_time": "2024-09-07T11:00:00",
      "creator_id": 1
    }
    ```

- **Get a Meeting by ID**
  - **Endpoint:** `GET /api/meetings/{id}`
  - **Description:** Retrieve details of a specific meeting.
  - **Response:**
    ```json
    {
      "id": 1,
      "title": "Meeting Title",
      "description": "Meeting Description",
      "start_time": "2024-09-07T10:00:00",
      "end_time": "2024-09-07T11:00:00",
      "creator_id": 1
    }
    ```

### Messages

- **Create a Message**
  - **Endpoint:** `POST /api/messages`
  - **Description:** Send a new message to a meeting.
  - **Request Body:**
    ```json
    {
      "content": "Hello, this is a message!",
      "sender_id": 1,
      "meeting_id": 1
    }
    ```
  - **Response:**
    ```json
    {
      "id": 1,
      "content": "Hello, this is a message!",
      "sender_id": 1,
      "meeting_id": 1,
      "timestamp": "2024-09-07T10:15:00"
    }
    ```

- **Get Messages for a Meeting**
  - **Endpoint:** `GET /api/messages/{meeting_id}`
  - **Description:** Retrieve all messages for a specific meeting.
  - **Response:**
    ```json
    [
      {
        "id": 1,
        "content": "Hello, this is a message!",
        "sender_id": 1,
        "meeting_id": 1,
        "timestamp": "2024-09-07T10:15:00"
      }
    ]
    ```

### Authentication

- **Register a User**
  - **Endpoint:** `POST /api/register`
  - **Description:** Register a new user.
  - **Request Body:**
    ```json
    {
      "name": "User Name",
      "email": "user@example.com",
      "password": "password123"
    }
    ```
  - **Response:**
    ```json
    {
      "id": 1,
      "name": "User Name",
      "email": "user@example.com",
      "password": "hashed_password"
    }
    ```

- **Login a User**
  - **Endpoint:** `POST /api/login`
  - **Description:** Authenticate a user and return a JWT token.
  - **Request Body:**
    ```json
    {
      "email": "user@example.com",
      "password": "password123"
    }
    ```
  - **Response:**
    ```json
    {
      "token": "jwt_token"
    }
    ```

### WebSocket

- **WebSocket Connection**
  - **Endpoint:** `GET /ws/`
  - **Description:** Establish a WebSocket connection for real-time communication.

## Usage

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/convo.git
   cd convo/server
