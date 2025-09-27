"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RoomSelectionPage() {
  const [roomCode, setRoomCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [action, setAction] = useState<"create" | "join" | null>(null);
  const router = useRouter();

  const handleCreateRoom = async () => {
    setIsLoading(true);
    setAction("create");
    
    // Simulate room creation
    setTimeout(() => {
      setIsLoading(false);
      // Generate a random room code for demo
      const newRoomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      router.push(`/dashboard?room=${newRoomCode}&role=creator`);
    }, 1500);
  };

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomCode.trim()) return;
    
    setIsLoading(true);
    setAction("join");
    
    // Simulate room joining
    setTimeout(() => {
      setIsLoading(false);
      router.push(`/dashboard?room=${roomCode}&role=member`);
    }, 1500);
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
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                className="w-full px-6 py-4 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all text-center text-lg font-mono tracking-wider"
                maxLength={6}
                required
              />
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
