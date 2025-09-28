"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

interface RoomMember {
  id: string;
  username: string;
  points: number;
  avatar?: string;
  isOnline: boolean;
  lastActive: string;
}

function DashboardContent() {
  const [members, setMembers] = useState<RoomMember[]>([]);
  const [userPoints, setUserPoints] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [roomCode, setRoomCode] = useState("");
  const [userRole, setUserRole] = useState<"creator" | "member">("member");
  
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const room = searchParams.get("room");
    const role = searchParams.get("role") as "creator" | "member";
    
    if (!room) {
      router.push("/rooms");
      return;
    }

    setRoomCode(room);
    setUserRole(role || "member");

    // simple hash helper (same approach used elsewhere)
    function hashStringToNumber(s: string) {
      let h = 0;
      for (let i = 0; i < s.length; i++) {
        h = (h << 5) - h + s.charCodeAt(i);
        h |= 0;
      }
      return Math.abs(h);
    }

    // Fetch real users from our API
    async function loadMembers() {
      try {
        setIsLoading (true);
        // 1) Get room info (members) from rooms API
            const roomId = room as string;
            const roomRes = await fetch(`/api/rooms/join?roomId=${encodeURIComponent(roomId)}`);
        if (!roomRes.ok) throw new Error('Failed to load room info');
        const roomJson = await roomRes.json();
        if (!roomJson.exists || !roomJson.room) {
          // No such room — redirect back to rooms
          router.push('/rooms');
          return;
        }

  // roomJson.room.members exists on the room object, but we query the DB for users by roomId

        // Fetch user documents for this room from our new endpoint
        let fetched: RoomMember[] = [];
        try {
          const membersRes = await fetch(`/api/rooms/members?roomId=${encodeURIComponent(roomId)}`);
            if (membersRes.ok) {
              const membersJson = await membersRes.json();
              const raw = Array.isArray(membersJson.users) ? membersJson.users : (membersJson.users || []);
              // Map to RoomMember but only use username (from DB). Points/online will be zero/false.
              fetched = raw.map((u: any) => ({
                id: u.id ?? u._id ?? u.username,
                username: u.username ?? (u.id ?? '').toString(),
                points: 0,
                isOnline: false,
                lastActive: 'unknown'
              } as RoomMember));
          } else {
            console.warn('Failed to load room members from DB, status:', membersRes.status);
            // Fallback: use raw member usernames
            // If DB call failed, fall back to empty list (do not synthesize sample data)
            fetched = [];
          }
        } catch (err) {
          console.warn('Error fetching room members:', err);
          // On error, fall back to empty list rather than synthesizing example data
          fetched = [];
        }

        // Mark current session user if present
  const sessionRes = await fetch('/api/auth/session');
  const sessionJson = sessionRes.ok ? await sessionRes.json() : { username: null };

  const currentUsername = sessionJson.username;
        let currentUser: RoomMember | null = null;
        if (currentUsername) {
          const curLower = currentUsername.toString().toLowerCase();
          const found = fetched.find(f => f.username.toString().toLowerCase() === curLower);
          if (found) currentUser = { ...found, id: 'current' };
        }

        const finalMembers = currentUser ? [currentUser, ...fetched.filter(m => m.username.toString().toLowerCase() !== currentUser.username.toLowerCase())] : fetched;

        setMembers(finalMembers);
        setUserPoints(currentUser ? currentUser.points : (finalMembers[0]?.points || 0));
      } catch (e) {
        console.error('Error loading members for dashboard', e);
      } finally {
        setIsLoading(false);
      }
    }

    loadMembers();
  }, [searchParams, router]);

  const addPoints = (points: number) => {
    setUserPoints(prev => prev + points);
    setMembers(prev => 
      prev.map(member => 
        member.id === "current" 
          ? { ...member, points: member.points + points }
          : member
      )
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-green-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-400/20 rounded-full animate-spin mx-auto mb-6">
            <div className="w-12 h-12 border-4 border-green-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Loading Room...</h2>
          <p className="text-gray-400">Setting up your dashboard</p>
        </div>
      </div>
    );
  }

  // Sort members by points (descending)
  const sortedMembers = [...members].sort((a, b) => b.points - a.points);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-green-950 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Room Dashboard</h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-400">Room Code:</span>
              <span className="bg-green-900/50 text-green-400 px-3 py-1 rounded-lg font-mono text-lg">
                {roomCode}
              </span>
              {userRole === "creator" && (
                <span className="bg-blue-900/50 text-blue-400 px-3 py-1 rounded-lg text-sm">
                  Creator
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => router.push("/rooms")}
            className="text-gray-400 hover:text-white transition-colors"
          >
            Leave Room
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Your Points Display */}
            <div className="bg-gradient-to-br from-slate-900/50 to-green-900/30 border border-green-500/30 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Your Points</h2>
              <div className="text-center">
                <div className="text-6xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-4">
                  {userPoints.toLocaleString()}
                </div>
                <p className="text-gray-400 mb-6">Total Points Earned</p>
                
                {/* Quick Actions */}
                <div className="grid grid-cols-3 gap-4">
                  <button
                    onClick={() => addPoints(50)}
                    className="bg-gradient-to-r from-green-500 to-green-600 py-3 rounded-lg font-semibold hover:scale-105 transition-all duration-300"
                  >
                    +50 pts
                  </button>
                  <button
                    onClick={() => addPoints(100)}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 py-3 rounded-lg font-semibold hover:scale-105 transition-all duration-300"
                  >
                    +100 pts
                  </button>
                  <button
                    onClick={() => addPoints(200)}
                    className="bg-gradient-to-r from-purple-500 to-purple-600 py-3 rounded-lg font-semibold hover:scale-105 transition-all duration-300"
                  >
                    +200 pts
                  </button>
                </div>
              </div>
            </div>

            {/* Room Members Leaderboard */}
            <div className="bg-gradient-to-br from-slate-900/50 to-blue-900/30 border border-blue-500/30 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Room Leaderboard</h2>
              <div className="space-y-4">
                {sortedMembers.map((member, index) => {
                  const rankClass = (() => {
                    if (index === 0) return "bg-yellow-500 text-yellow-900";
                    if (index === 1) return "bg-gray-400 text-gray-900";
                    if (index === 2) return "bg-orange-500 text-orange-900";
                    return "bg-slate-600 text-white";
                  })();

                  return (
                  <div
                    key={member.id}
                    className={`flex items-center justify-between p-4 rounded-lg transition-all duration-300 ${
                      member.id === "current"
                        ? "bg-gradient-to-r from-green-900/30 to-blue-900/30 border border-green-500/30"
                        : "bg-slate-800/30 hover:bg-slate-700/30"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Rank */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${rankClass}`}>
                        {index + 1}
                      </div>
                      
                      {/* User Info */}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold ${
                            member.id === "current" ? "text-green-400" : "text-white"
                          }`}>
                            {member.username}
                          </span>
                          {member.isOnline && (
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          )}
                        </div>
                        <span className="text-gray-400 text-sm">
                          {member.isOnline ? "Online" : `Last seen ${member.lastActive}`}
                        </span>
                      </div>
                    </div>
                    
                    {/* Points */}
                    <div className="text-right">
                      <div className="text-xl font-bold text-white">
                        {member.points.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-400">points</div>
                    </div>
                  </div>
                );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Room Stats */}
            <div className="bg-gradient-to-br from-slate-900/50 to-purple-900/30 border border-purple-500/30 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Room Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Members:</span>
                  <span className="text-white font-semibold">{members.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Online Now:</span>
                  <span className="text-green-400 font-semibold">
                    {members.filter(m => m.isOnline).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Points:</span>
                  <span className="text-white font-semibold">
                    {members.reduce((sum, m) => sum + m.points, 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-slate-900/50 to-orange-900/30 border border-orange-500/30 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-green-500 to-green-600 py-2 rounded-lg font-semibold hover:scale-105 transition-all duration-300">
                  Add Expense
                </button>
                <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 py-2 rounded-lg font-semibold hover:scale-105 transition-all duration-300">
                  View Transactions
                </button>
                <button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 py-2 rounded-lg font-semibold hover:scale-105 transition-all duration-300">
                  Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UserDashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-green-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-400/20 rounded-full animate-spin mx-auto mb-6">
            <div className="w-12 h-12 border-4 border-green-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Loading...</h2>
          <p className="text-gray-400">Setting up your dashboard</p>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
