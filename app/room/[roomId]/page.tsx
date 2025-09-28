"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

// Custom CSS for Clash font
const clashFontStyles = `
  @font-face {
    font-family: 'Clash';
    src: url('/fonts/Clash_Regular.otf') format('opentype');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }
  
  .font-clash {
    font-family: 'Clash', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
`;

// Inject styles
if (typeof document !== "undefined") {
  const styleElement = document.createElement("style");
  styleElement.textContent = clashFontStyles;
  document.head.appendChild(styleElement);
}

// SVG Icon Components
const Trophy = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M15.75 4.236c-.982.143-1.954.317-2.916.52a6.003 6.003 0 0 0-1.668 1.732 6.003 6.003 0 0 0-1.668-1.732 24.498 24.498 0 0 0-2.916-.52m7.5 0v-.916C15.75 2.253 16.503 1.5 17.438 1.5h1.875C20.247 1.5 21 2.254 21 3.188v.916m-7.5 0H5.625c-.621 0-1.125.504-1.125 1.125v4.125c0 .621.504 1.125 1.125 1.125h2.625m0 0v2.25c0 .621.504 1.125 1.125 1.125h3c.621 0 1.125-.504 1.125-1.125V8.5"
    />
  </svg>
);

const Users = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
    />
  </svg>
);

const Copy = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"
    />
  </svg>
);

const Share = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 7.5 7.5 2.25-2.25M7.217 10.907l-2.25 2.25m0 0 7.5 7.5 2.25-2.25m0 0-7.5-7.5m0 0 2.25-2.25"
    />
  </svg>
);

const TrendingUp = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"
    />
  </svg>
);

const Star = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
    />
  </svg>
);

const Plus = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 4.5v15m7.5-7.5h-15"
    />
  </svg>
);

const ArrowLeft = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
    />
  </svg>
);

const Zap = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"
    />
  </svg>
);

const Target = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
    />
  </svg>
);

const Brain = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75-7.478a12.06 12.06 0 0 0 4.5 0m-8.25 0a12.06 12.06 0 0 0-4.5 0m8.25 0V6.108c0-1.389.47-2.717 1.305-3.671C15.225 1.268 16.503.75 18 .75c1.497 0 2.775.518 3.695 1.687.835.954 1.305 2.282 1.305 3.671V12m-6 0a3 3 0 0 0 3 3v0a3 3 0 0 0 3-3m-6 0h6"
    />
  </svg>
);

const Clock = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
    />
  </svg>
);

const ChartBar = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
    />
  </svg>
);

const Bell = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
    />
  </svg>
);

const Calendar = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
    />
  </svg>
);

const Cog = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
    />
  </svg>
);

export default function RoomPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const isHost = searchParams.get('host') === 'true';
  // Initialize room name lazily to avoid reading params during SSR
  const [roomName, setRoomName] = useState(() => `Room ${params.roomId}`);

  interface RoomMember {
    id: string;
    username: string;
    points: number;
    balance?: number;  // Financial data balance
    avatar?: string;
    isOnline: boolean;
    lastActive: string;
  }

  // Members are loaded from the DB via the /api/rooms/members endpoint
  const [members, setMembers] = useState<RoomMember[]>([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [copied, setCopied] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [roomExists, setRoomExists] = useState<boolean | null>(null);
  const [roomData, setRoomData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Members are loaded from the DB via the /api/rooms/members endpoint

  const roomStats = {
    // keep defaults but we show the real count from `members.length` where appropriate
    totalMembers: 0,
    totalExpenses: 12450,
    averageEfficiency: 86,
    weeklySavings: 320,
  };

  // Dynamic data should come from the backend. Use empty defaults here
  // to avoid showing any hard-coded sample names.
  const recentActivities: Array<any> = [];
  const notifications: Array<any> = [];
  const upcomingEvents: Array<any> = [];

  // Check if room exists when component mounts
  useEffect(() => {
    const checkRoomExists = async () => {
      try {
<<<<<<< HEAD
        // Get current user from session
        const userResponse = await fetch('/api/auth/session');
        const userData = await userResponse.json();
        if (userData.username) {
          setCurrentUser(userData.username);
        }

=======
>>>>>>> parent of 5c11c201 (leaderboard)
        const response = await fetch(`/api/rooms/join?roomId=${params.roomId}`);
        const data = await response.json();
        
        if (data.exists) {
          setRoomExists(true);
          setRoomData(data.room);
          setRoomName(data.room.name);
          // Load members for this room from DB
          try {
            const membersRes = await fetch(`/api/rooms/members?roomId=${params.roomId}`);
            if (membersRes.ok) {
              const membersJson = await membersRes.json();
              const raw = Array.isArray(membersJson.users) ? membersJson.users : (membersJson.users || []);
              
              // First map the basic user data
              const initialMembers = raw.map((u: any) => ({
                id: u.id ?? u._id ?? u.username,
                username: (u.username || '').toString(),
                points: 0,
                isOnline: false,
                lastActive: 'unknown',
                balance: 0
              } as RoomMember));
              
              // Set initial members
              setMembers(initialMembers);
              
              // Then fetch financial data for each member
              const membersWithFinancial = await Promise.all(
                initialMembers.map(async (member: RoomMember) => {
                  try {
                    // Fetch financial data for this member
                    const financialRes = await fetch(`/api/users/${member.id}/financial-data`);
                    if (financialRes.ok) {
                      const financialData = await financialRes.json();
                      // Extract balance from financial data
                      if (financialData && financialData.current_balance) {
                        return {
                          ...member,
                          balance: financialData.current_balance,
                          // Use balance for points as well for now
                          points: Math.floor(financialData.current_balance)
                        };
                      }
                    }
                    return member;
                  } catch (error) {
                    console.warn(`Error fetching financial data for ${member.username}:`, error);
                    return member;
                  }
                })
              );
              
              // Sort members by balance (highest first)
              const sortedMembers = membersWithFinancial.sort((a, b) => 
                (b.balance || 0) - (a.balance || 0)
              );
              
              // Update members state with sorted financial data
              setMembers(sortedMembers);
            } else {
              console.warn('Failed to load room members, status:', membersRes.status);
              setMembers([]);
            }
          } catch (err) {
            console.warn('Error fetching room members:', err);
            setMembers([]);
          }
        } else {
          setRoomExists(false);
        }
      } catch (error) {
        console.error('Error checking room:', error);
        setRoomExists(false);
      } finally {
        setLoading(false);
      }
    };

    checkRoomExists();
  }, [params.roomId]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const copyInviteLink = () => {
    const inviteLink = `${window.location.origin}/room/${params.roomId}`;
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareInviteLink = () => {
    const inviteLink = `${window.location.origin}/room/${params.roomId}`;
    if (navigator.share) {
      navigator.share({
        title: `Join ${roomName}`,
        text: `Join my room on RoomieLoot!`,
        url: inviteLink,
      });
    } else {
      copyInviteLink();
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white flex items-center justify-center font-clash">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Trophy className="w-8 h-8" />
          </div>
          <div className="text-xl font-bold mb-2">Loading Room...</div>
          <div className="text-gray-400">Checking if room exists</div>
        </div>
      </div>
    );
  }

  // Show error if room doesn't exist
  if (roomExists === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white flex items-center justify-center font-clash">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
            No Room Available
          </h1>
          <p className="text-gray-400 mb-6">
            The room code <span className="font-bold text-white">{params.roomId}</span> does not exist. 
            Please check the room code and try again.
          </p>
          <div className="space-y-4">
            <button
              onClick={() => router.push('/rooms')}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
            >
              Browse Available Rooms
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white overflow-hidden relative font-clash">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[800px] h-[800px] rounded-full opacity-20 blur-3xl animate-pulse"
          style={{
            background: "radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, rgba(236, 72, 153, 0.3) 50%, rgba(34, 197, 94, 0.2) 100%)",
            left: `${50 + Math.sin(scrollY * 0.001) * 20}%`,
            top: `${30 + Math.cos(scrollY * 0.0008) * 15}%`,
            transform: `translate(-50%, -50%) scale(${1 + Math.sin(scrollY * 0.002) * 0.2})`,
            transition: "all 0.1s ease-out",
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6 md:px-12 backdrop-blur-sm bg-black/10 border-b border-white/10">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push('/')}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg shadow-purple-500/25">
              <Trophy className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              RoomieLoot
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm text-gray-400">Room Code</div>
            <div className="text-lg font-bold text-purple-400">{params.roomId}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">Room Name</div>
            <div className="text-lg font-bold text-pink-400">{roomName}</div>
          </div>
          
          {/* Notification Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              {notifications.filter(n => !n.read).length > 0 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">
                    {notifications.filter(n => !n.read).length}
                  </span>
                </div>
              )}
            </button>
            
            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 bg-gradient-to-br from-slate-900 to-purple-900 border border-purple-500/30 rounded-2xl p-4 shadow-2xl z-50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Notifications</h3>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    ×
                  </button>
                </div>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg transition-colors ${
                        notification.read 
                          ? 'bg-slate-800/50' 
                          : 'bg-purple-900/30 border border-purple-500/30'
                      }`}
                    >
                      <div className="text-sm">{notification.message}</div>
                      <div className="text-xs text-gray-400 mt-1">{notification.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Settings Button */}
          <button
            onClick={() => setShowSettingsModal(true)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Cog className="w-5 h-5" />
          </button>

          {isHost && (
            <button
              onClick={() => setShowInviteModal(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2"
            >
              <Share className="w-4 h-4" />
              Invite
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-6 md:px-12 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Room Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <Users className="w-8 h-8 text-purple-400" />
                <span className="text-2xl font-bold text-purple-400">{roomStats.totalMembers}</span>
              </div>
              <div className="text-sm text-gray-400">Active Members</div>
            </div>
            
            <div className="bg-gradient-to-br from-green-900/20 to-blue-900/20 backdrop-blur-sm border border-green-500/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-8 h-8 text-green-400" />
                <span className="text-2xl font-bold text-green-400">${roomStats.totalExpenses}</span>
              </div>
              <div className="text-sm text-gray-400">Total Expenses</div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <Target className="w-8 h-8 text-blue-400" />
                <span className="text-2xl font-bold text-blue-400">{roomStats.averageEfficiency}%</span>
              </div>
              <div className="text-sm text-gray-400">Avg Efficiency</div>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 backdrop-blur-sm border border-yellow-500/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <Zap className="w-8 h-8 text-yellow-400" />
                <span className="text-2xl font-bold text-yellow-400">${roomStats.weeklySavings}</span>
              </div>
              <div className="text-sm text-gray-400">Weekly Savings</div>
            </div>
          </div>

<<<<<<< HEAD
          {/* Leaderboard and Quick Actions - Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Leaderboard */}
                <div className="lg:col-span-2">
                  <div className="bg-gradient-to-br from-slate-900/80 to-purple-900/50 backdrop-blur-sm border border-purple-500/30 rounded-3xl p-8 h-full">
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Financial Leaderboard
                      </h2>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Clock className="w-4 h-4" />
                        Updated 2 min ago
                      </div>
                    </div>

                    <div className="space-y-4">
                      {members.map((member, index) => (
                        <div
                          key={member.id}
                          className={`flex items-center justify-between p-4 rounded-lg transition-all duration-300 hover:scale-105 ${
                            index === 0
                              ? "bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-500/30"
                              : index === 1
                              ? "bg-gradient-to-r from-gray-900/30 to-slate-900/30 border border-gray-500/30"
                              : index === 2
                              ? "bg-gradient-to-r from-orange-900/30 to-red-900/30 border border-orange-500/30"
                              : "bg-gradient-to-r from-slate-800/30 to-gray-800/30 border border-slate-600/30"
                          }`}
                        >
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 font-bold text-white text-sm">
                              {index === 0 ? <Trophy className="w-6 h-6" /> : index + 1}
                            </div>
                            <div>
                              <div className="font-semibold text-base">{member.username}</div>
                              <div className="text-sm text-gray-400">{member.isOnline ? 'Online' : `Last seen ${member.lastActive}`}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-purple-400">${(member.balance || 0).toLocaleString()}</div>
                            <div className="text-sm text-gray-400">balance</div>
                          </div>
                        </div>
                      ))}
                      {members.length === 0 && (
                        <div className="text-center text-gray-400">No members found for this room.</div>
                      )}
                    </div>
                  </div>
=======
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Leaderboard */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-slate-900/80 to-purple-900/50 backdrop-blur-sm border border-purple-500/30 rounded-3xl p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Leaderboard
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Clock className="w-4 h-4" />
                    Updated 2 min ago
                  </div>
                </div>

                <div className="space-y-4">
                  {leaderboard.map((player, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 hover:scale-105 ${
                        player.rank === 1
                          ? "bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-500/30"
                          : player.rank === 2
                          ? "bg-gradient-to-r from-gray-900/30 to-slate-900/30 border border-gray-500/30"
                          : player.rank === 3
                          ? "bg-gradient-to-r from-orange-900/30 to-red-900/30 border border-orange-500/30"
                          : "bg-gradient-to-r from-slate-800/30 to-gray-800/30 border border-slate-600/30"
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 font-bold text-white">
                          {player.rank === 1 ? <Trophy className="w-6 h-6" /> : player.rank}
                        </div>
                        <div>
                          <div className="font-semibold">{player.name}</div>
                          <div className="text-sm text-gray-400">{player.efficiency}% efficiency</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-purple-400">{player.score}</div>
                        <div className="text-sm text-gray-400">points</div>
                      </div>
                    </div>
                  ))}
>>>>>>> parent of 5c11c201 (leaderboard)
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Room Members */}
              <div className="bg-gradient-to-br from-slate-900/80 to-blue-900/50 backdrop-blur-sm border border-blue-500/30 rounded-3xl p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  Room Members
                </h3>
                <div className="space-y-3">
                  {leaderboard.map((member, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold">
                        {member.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{member.name}</div>
                        <div className="text-xs text-gray-400">{member.efficiency}% efficiency</div>
                      </div>
                      <div className="text-sm font-bold text-blue-400">{member.score}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-gradient-to-br from-slate-900/80 to-green-900/50 backdrop-blur-sm border border-green-500/30 rounded-3xl p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-green-400" />
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === 'expense' ? 'bg-red-400' :
                        activity.type === 'payment' ? 'bg-green-400' :
                        'bg-yellow-400'
                      }`}></div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{activity.user}</div>
                        <div className="text-xs text-gray-400">{activity.description}</div>
                        <div className="text-xs text-gray-500">{activity.time}</div>
                      </div>
                      {activity.amount > 0 && (
                        <div className="text-sm font-bold text-green-400">${activity.amount}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Events */}
              <div className="bg-gradient-to-br from-slate-900/80 to-orange-900/50 backdrop-blur-sm border border-orange-500/30 rounded-3xl p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-orange-400" />
                  Upcoming Events
                </h3>
                <div className="space-y-3">
                  {upcomingEvents.map((event, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg">
                      <div className="text-center">
                        <div className="text-xs text-orange-400 font-bold">{event.date}</div>
                        <div className="text-xs text-gray-400">{event.time}</div>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{event.event}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gradient-to-br from-slate-900/80 to-pink-900/50 backdrop-blur-sm border border-pink-500/30 rounded-3xl p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-pink-400" />
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Expense
                  </button>
                  <button className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2">
                    <ChartBar className="w-4 h-4" />
                    View Analytics
                  </button>
                  <button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2">
                    <Target className="w-4 h-4" />
                    Set Goals
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-slate-900 to-purple-900 border border-purple-500/30 rounded-2xl p-8 w-full max-w-md">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Share className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Invite Friends</h3>
              <p className="text-gray-400">
                Share this room code with your roommates
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-slate-800 border border-gray-600 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-2">Room Code</div>
                <div className="text-2xl font-bold text-purple-400">{params.roomId}</div>
              </div>
              
              <div className="bg-slate-800 border border-gray-600 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-2">Invite Link</div>
                <div className="text-sm text-white break-all">
                  {typeof window !== 'undefined' ? `${window.location.origin}/room/${params.roomId}` : ''}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={copyInviteLink}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
                <button
                  onClick={shareInviteLink}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Share className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-slate-900 to-blue-900 border border-blue-500/30 rounded-2xl p-8 w-full max-w-md">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Cog className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Room Settings</h3>
              <p className="text-gray-400">
                Customize your room experience
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Room Name</label>
                <input
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Budget Goal (Monthly)</label>
                <input
                  type="number"
                  placeholder="5000"
                  className="w-full px-4 py-3 bg-slate-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Notifications</span>
                <button className="w-12 h-6 bg-blue-500 rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Public Room</span>
                <button className="w-12 h-6 bg-gray-600 rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5"></div>
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
