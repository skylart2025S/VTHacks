# Room API Documentation

This document describes the room creation and joining functionality for the RoomieLoot application.

## API Endpoints

### 1. Create Room
**POST** `/api/rooms/create`

Creates a new room with a unique 6-character ID.

**Request Body:**
```json
{
  "roomName": "My Awesome Room",
  "createdBy": "username"
}
```

**Response (Success - 201):**
```json
{
  "message": "Room created successfully",
  "room": {
    "id": "ABC123",
    "name": "My Awesome Room",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "createdBy": "username",
    "memberCount": 1
  }
}
```

**Response (Error - 400):**
```json
{
  "message": "Room name and creator username are required"
}
```

### 2. Join Room
**POST** `/api/rooms/join`

Joins an existing room by room ID.

**Request Body:**
```json
{
  "roomId": "ABC123",
  "username": "newuser"
}
```

**Response (Success - 200):**
```json
{
  "message": "Successfully joined room",
  "room": {
    "id": "ABC123",
    "name": "My Awesome Room",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "createdBy": "username",
    "memberCount": 2,
    "members": ["username", "newuser"]
  }
}
```

**Response (Error - 404):**
```json
{
  "message": "Room not found. Please check the room ID and try again."
}
```

**Response (Error - 409):**
```json
{
  "message": "You are already a member of this room"
}
```

### 3. Check Room Exists
**GET** `/api/rooms/join?roomId=ABC123`

Checks if a room exists without joining it.

**Response:**
```json
{
  "exists": true,
  "room": {
    "id": "ABC123",
    "name": "My Awesome Room",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "createdBy": "username",
    "memberCount": 2
  }
}
```

### 4. List All Rooms
**GET** `/api/rooms/create`

Lists all existing rooms (useful for debugging).

## Features

- **Unique Room IDs**: Each room gets a unique 6-character alphanumeric ID
- **Duplicate Prevention**: No two rooms can have the same ID
- **Member Management**: Tracks room members and prevents duplicate memberships
- **Validation**: Comprehensive input validation and error handling
- **Real-time Checks**: GET endpoints for checking room existence

## Testing

Run the test script to verify functionality:
```bash
node test-rooms.js
```

Make sure the development server is running (`npm run dev`) before running tests.

## Data Structure

```typescript
interface Room {
  id: string;           // Unique 6-character ID
  name: string;         // Room display name
  createdAt: Date;      // Creation timestamp
  createdBy: string;    // Username of creator
  members: string[];     // Array of member usernames
}
```
