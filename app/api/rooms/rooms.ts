// app/api/rooms/rooms.ts
// Shared room storage for both create and join routes
// In production, replace this with actual database operations

export interface Room {
  id: string;
  name: string;
  createdAt: Date;
  createdBy: string;
  members: string[]; // Array of usernames
}

// In-memory storage (replace with actual database in production)
// For production, use PostgreSQL, MongoDB, or another database
export const rooms: Room[] = [];

// Generate a unique room ID
export function generateRoomId(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  
  // Keep generating until we find a unique ID
  do {
    result = '';
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
  } while (rooms.some(room => room.id === result));
  
  return result;
}

// Check if a room exists by ID
export function roomExists(roomId: string): boolean {
  return rooms.some(room => room.id === roomId);
}

// Get room by ID
export function getRoomById(roomId: string): Room | undefined {
  return rooms.find(room => room.id === roomId);
}
