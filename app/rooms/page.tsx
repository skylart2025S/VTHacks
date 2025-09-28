"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RoomSelectionPage() {
  const [roomCode, setRoomCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [action, setAction] = useState<"create" | "join" | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleCreateRoom = async () => {
    setIsLoading(true);
    setAction("create");
    setError("");
    
    try {
      const response = await fetch('/api/rooms/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomName: 'My Room'
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Successfully created room, navigate to room page
        router.push(`/room/${data.room.id}?host=true`);
      } else {
        setError(data.message || "Failed to create room");
      }
    } catch (error) {
      console.error('Error creating room:', error);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomCode.trim()) return;
    
    setIsLoading(true);
    setAction("join");
    setError("");
    
    try {
      // First check if room exists
      const checkResponse = await fetch(`/api/rooms/join?roomId=${roomCode}`);
      const checkData = await checkResponse.json();
      
      if (!checkData.exists) {
        setError("Room not found. Please check the room code and try again.");
        setIsLoading(false);
        return;
      }
      
      // Room exists, now try to join it
      const joinResponse = await fetch('/api/rooms/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomId: roomCode
        })
      });
      
      const joinData = await joinResponse.json();
      
      if (joinResponse.ok) {
        // Successfully joined room, navigate to room page
        router.push(`/room/${roomCode}`);
      } else {
        setError(joinData.message || "Failed to join room");
      }
    } catch (error) {
      console.error('Error joining room:', error);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-green-950 to-slate-900 flex items-center justify-center">
      <div className="text-center max-w-lg mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Choose Your Room
          </h1>
          <p className="text-gray-400 text-lg">
            Create a new room or join an existing one
          </p>
        </div>

        {/* Room Options */}
        <div className="space-y-6">
          {/* Create Room Button */}
          <button
            onClick={handleCreateRoom}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 py-6 rounded-lg font-semibold text-white hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group"
          >
            {isLoading && action === "create" ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Creating Room...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3">
                <svg className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create New Room
              </div>
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-600"></div>
            <span className="text-gray-500 text-sm">OR</span>
            <div className="flex-1 h-px bg-gray-600"></div>
          </div>

          {/* Join Room Form */}
          <form onSubmit={handleJoinRoom} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Enter room code (e.g., ABC123)"
                value={roomCode}
                onChange={(e) => {
                  setRoomCode(e.target.value.toUpperCase());
                  setError(""); // Clear error when user types
                }}
                className={`w-full px-6 py-4 bg-slate-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all text-center text-lg font-mono tracking-wider ${
                  error ? 'border-red-500 focus:border-red-400 focus:ring-red-400/20' : 'border-slate-600 focus:border-blue-400 focus:ring-blue-400/20'
                }`}
                maxLength={6}
                required
              />
              {error && (
                <div className="mt-2 text-red-400 text-sm text-center">
                  {error}
                </div>
              )}
            </div>
            
            <button
              type="submit"
              disabled={isLoading || !roomCode.trim()}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 py-6 rounded-lg font-semibold text-white hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group"
            >
              {isLoading && action === "join" ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Joining Room...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  Join Room
                </div>
              )}
            </button>
          </form>
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <button
            onClick={() => router.back()}
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            ← Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
