// app/api/auth/users.ts
// Shared user storage for both register and signin routes
// In production, replace this with actual database operations

export interface User {
  username: string;
  passwordHash: string;
}

// In-memory storage (replace with actual database in production)
// For production, use PostgreSQL, MongoDB, or another database
export const users: User[] = [];
