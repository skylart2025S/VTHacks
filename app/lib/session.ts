// app/lib/session.ts
// Simple session management for storing current user
// In production, use proper session management like NextAuth or JWT

export interface Session {
  username: string;
  isAuthenticated: boolean;
}

// Simple in-memory session storage
// In production, use secure session storage
let currentSession: Session | null = null;

export function setSession(username: string): void {
  currentSession = {
    username: username.toLowerCase(),
    isAuthenticated: true
  };
}

export function getSession(): Session | null {
  return currentSession;
}

export function clearSession(): void {
  currentSession = null;
}

export function isAuthenticated(): boolean {
  return currentSession?.isAuthenticated || false;
}

export function getCurrentUsername(): string | null {
  return currentSession?.username || null;
}
