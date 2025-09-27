// app/user/[username]/page.tsx
"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

// Type definitions
interface SVGProps {
  className?: string;
}

interface User {
  username: string;
  displayName: string;
  level: number;
  xp: number;
  totalSaved: number;
  rank: number;
  avatar: string;
  joinedDate: string;
  badges: Badge[];
  stats: UserStats;
  recentAchievements: string[];
  weeklyProgress: WeeklyProgress[];
  friends: Friend[];
}

interface Badge {
  name: string;
  icon: string;
  earned: boolean;
  description: string;
}

interface UserStats {
  weeklyScore: number;
  monthlyScore: number;
  totalTransactions: number;
  efficiencyScore: number;
  streak: number;
  challengesCompleted: number;
}

interface WeeklyProgress {
  day: string;
  score: number;
}

interface Friend {
  name: string;
  level: number;
  status: "online" | "away" | "offline";
}

interface UserDashboardProps {
  params: {
    username: string;
  };
}

// SVG Components for the dashboard
const Trophy = ({ className }: SVGProps) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    aria-label="Trophy icon"
  >
    <title>Trophy</title>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M15.75 4.236c-.982.143-1.954.317-2.916.52a6.003 6.003 0 0 0-1.668 1.732 6.003 6.003 0 0 0-1.668-1.732 24.498 24.498 0 0 0-2.916-.52m7.5 0v-.916C15.75 2.253 16.503 1.5 17.438 1.5h1.875C20.247 1.5 21 2.254 21 3.188v.916m-7.5 0H5.625c-.621 0-1.125.504-1.125 1.125v4.125c0 .621.504 1.125 1.125 1.125h2.625m0 0v2.25c0 .621.504 1.125 1.125 1.125h3c.621 0 1.125-.504 1.125-1.125V8.5"
    />
  </svg>
);

const ArrowLeft = ({ className }: SVGProps) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    aria-label="Left arrow icon"
  >
    <title>Left Arrow</title>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
    />
  </svg>
);

interface StarProps extends SVGProps {
  filled?: boolean;
}

const Star = ({ className, filled = false }: StarProps) => (
  <svg
    className={className}
    fill={filled ? "currentColor" : "none"}
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    aria-label="Star icon"
  >
    <title>Star</title>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
    />
  </svg>
);

const TrendingUp = ({ className }: SVGProps) => (
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

const Target = ({ className }: SVGProps) => (
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
      d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
    />
  </svg>
);

const Zap = ({ className }: SVGProps) => (
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

const Fire = ({ className }: SVGProps) => (
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
      d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z"
    />
  </svg>
);

const DollarSign = ({ className }: SVGProps) => (
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
      d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const Users = ({ className }: SVGProps) => (
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

const Calendar = ({ className }: SVGProps) => (
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
      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5"
    />
  </svg>
);

export default function UserDashboard({ params }: UserDashboardProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const username = params.username;

  useEffect(() => {
    // Generate unique user data based on username
    const userProfiles: Record<string, Omit<User, "username">> = {
      "alex-chen": {
        displayName: "Alex Chen",
        level: 12,
        xp: 2847,
        totalSaved: 1250,
        rank: 3,
        avatar:
          "https://api.dicebear.com/7.x/avataaars/svg?seed=alex-chen&backgroundColor=gradient&hairColor=black&skinColor=light",
        joinedDate: "March 15, 2024",
        badges: [
          {
            name: "Welcome",
            icon: "👋",
            earned: true,
            description: "Joined Budget Battle Royale",
          },
          {
            name: "Saver",
            icon: "💰",
            earned: true,
            description: "Saved $1000+ total",
          },
          {
            name: "Streak Master",
            icon: "🔥",
            earned: true,
            description: "30+ day streak",
          },
          {
            name: "Challenge King",
            icon: "👑",
            earned: true,
            description: "Won 10+ challenges",
          },
          {
            name: "Efficiency Expert",
            icon: "⚡",
            earned: false,
            description: "95%+ efficiency score",
          },
        ],
        stats: {
          weeklyScore: 342,
          monthlyScore: 1284,
          totalTransactions: 156,
          efficiencyScore: 87,
          streak: 34,
          challengesCompleted: 12,
        },
        recentAchievements: [
          'Completed "No Spend Weekend" challenge!',
          "Achieved 30-day savings streak",
          "Reached Level 12 - Budget Warrior!",
          "Saved $200 this week - Personal best!",
        ],
        weeklyProgress: [
          { day: "Mon", score: 45 },
          { day: "Tue", score: 67 },
          { day: "Wed", score: 23 },
          { day: "Thu", score: 89 },
          { day: "Fri", score: 56 },
          { day: "Sat", score: 34 },
          { day: "Sun", score: 28 },
        ],
        friends: [
          { name: "Sarah Kim", level: 15, status: "online" },
          { name: "Mike Johnson", level: 8, status: "away" },
          { name: "Emma Davis", level: 11, status: "offline" },
        ],
      },
      "sarah-kim": {
        displayName: "Sarah Kim",
        level: 15,
        xp: 4200,
        totalSaved: 2100,
        rank: 1,
        avatar:
          "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah-kim&backgroundColor=gradient&hairColor=brown&skinColor=light",
        joinedDate: "February 3, 2024",
        badges: [
          {
            name: "Welcome",
            icon: "👋",
            earned: true,
            description: "Joined Budget Battle Royale",
          },
          {
            name: "Saver",
            icon: "💰",
            earned: true,
            description: "Saved $1000+ total",
          },
          {
            name: "Streak Master",
            icon: "🔥",
            earned: true,
            description: "30+ day streak",
          },
          {
            name: "Challenge King",
            icon: "👑",
            earned: true,
            description: "Won 10+ challenges",
          },
          {
            name: "Efficiency Expert",
            icon: "⚡",
            earned: true,
            description: "95%+ efficiency score",
          },
          {
            name: "Legend",
            icon: "🏆",
            earned: true,
            description: "Top 1% player",
          },
        ],
        stats: {
          weeklyScore: 567,
          monthlyScore: 2100,
          totalTransactions: 234,
          efficiencyScore: 96,
          streak: 67,
          challengesCompleted: 28,
        },
        recentAchievements: [
          "Reached #1 Global Rank!",
          'Completed "Extreme Frugal" challenge',
          "Achieved 60-day savings streak",
          "Unlocked Legend badge!",
        ],
        weeklyProgress: [
          { day: "Mon", score: 78 },
          { day: "Tue", score: 92 },
          { day: "Wed", score: 85 },
          { day: "Thu", score: 95 },
          { day: "Fri", score: 88 },
          { day: "Sat", score: 67 },
          { day: "Sun", score: 62 },
        ],
        friends: [
          { name: "Alex Chen", level: 12, status: "online" },
          { name: "David Park", level: 9, status: "online" },
          { name: "Lisa Wang", level: 13, status: "away" },
        ],
      },
      "mike-johnson": {
        displayName: "Mike Johnson",
        level: 8,
        xp: 1456,
        totalSaved: 680,
        rank: 15,
        avatar:
          "https://api.dicebear.com/7.x/avataaars/svg?seed=mike-johnson&backgroundColor=gradient&hairColor=blonde&skinColor=light",
        joinedDate: "April 22, 2024",
        badges: [
          {
            name: "Welcome",
            icon: "👋",
            earned: true,
            description: "Joined Budget Battle Royale",
          },
          {
            name: "Saver",
            icon: "💰",
            earned: true,
            description: "Saved $1000+ total",
          },
          {
            name: "Streak Master",
            icon: "🔥",
            earned: false,
            description: "30+ day streak",
          },
          {
            name: "Challenge King",
            icon: "👑",
            earned: false,
            description: "Won 10+ challenges",
          },
          {
            name: "Efficiency Expert",
            icon: "⚡",
            earned: false,
            description: "95%+ efficiency score",
          },
        ],
        stats: {
          weeklyScore: 198,
          monthlyScore: 756,
          totalTransactions: 89,
          efficiencyScore: 72,
          streak: 12,
          challengesCompleted: 4,
        },
        recentAchievements: [
          "Completed first weekly challenge!",
          "Reached Level 8 - Budget Novice",
          "Saved $100 this month",
          "Connected bank account successfully",
        ],
        weeklyProgress: [
          { day: "Mon", score: 23 },
          { day: "Tue", score: 45 },
          { day: "Wed", score: 12 },
          { day: "Thu", score: 67 },
          { day: "Fri", score: 34 },
          { day: "Sat", score: 18 },
          { day: "Sun", score: 5 },
        ],
        friends: [
          { name: "Alex Chen", level: 12, status: "away" },
          { name: "Tom Wilson", level: 6, status: "online" },
        ],
      },
      "emma-davis": {
        displayName: "Emma Davis",
        level: 11,
        xp: 2234,
        totalSaved: 980,
        rank: 7,
        avatar:
          "https://api.dicebear.com/7.x/avataaars/svg?seed=emma-davis&backgroundColor=gradient&hairColor=red&skinColor=light",
        joinedDate: "March 8, 2024",
        badges: [
          {
            name: "Welcome",
            icon: "👋",
            earned: true,
            description: "Joined Budget Battle Royale",
          },
          {
            name: "Saver",
            icon: "💰",
            earned: true,
            description: "Saved $1000+ total",
          },
          {
            name: "Streak Master",
            icon: "🔥",
            earned: true,
            description: "30+ day streak",
          },
          {
            name: "Challenge King",
            icon: "👑",
            earned: false,
            description: "Won 10+ challenges",
          },
          {
            name: "Efficiency Expert",
            icon: "⚡",
            earned: false,
            description: "95%+ efficiency score",
          },
        ],
        stats: {
          weeklyScore: 289,
          monthlyScore: 1123,
          totalTransactions: 134,
          efficiencyScore: 81,
          streak: 28,
          challengesCompleted: 7,
        },
        recentAchievements: [
          'Completed "Budget Tracking" challenge!',
          "Achieved 25-day savings streak",
          "Reached Level 11 - Budget Pro",
          "Saved $150 this week",
        ],
        weeklyProgress: [
          { day: "Mon", score: 34 },
          { day: "Tue", score: 56 },
          { day: "Wed", score: 78 },
          { day: "Thu", score: 45 },
          { day: "Fri", score: 67 },
          { day: "Sat", score: 23 },
          { day: "Sun", score: 34 },
        ],
        friends: [
          { name: "Sarah Kim", level: 15, status: "away" },
          { name: "Jessica Lee", level: 9, status: "online" },
          { name: "Ryan Murphy", level: 5, status: "offline" },
        ],
      },
    };

    // Get user data or create default
    const userData = userProfiles[username] || {
      displayName: username.includes("-")
        ? username
            .split("-")
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
        : username.charAt(0).toUpperCase() + username.slice(1),
      level: Math.floor(Math.random() * 10) + 1,
      xp: Math.floor(Math.random() * 2000) + 500,
      totalSaved: Math.floor(Math.random() * 1000) + 200,
      rank: Math.floor(Math.random() * 20) + 1,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}&backgroundColor=gradient`,
      joinedDate: new Date(
        Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000,
      ).toLocaleDateString(),
      badges: [
        {
          name: "Welcome",
          icon: "👋",
          earned: true,
          description: "Joined Budget Battle Royale",
        },
        {
          name: "Saver",
          icon: "💰",
          earned: Math.random() > 0.3,
          description: "Saved $1000+ total",
        },
        {
          name: "Streak Master",
          icon: "🔥",
          earned: Math.random() > 0.5,
          description: "30+ day streak",
        },
        {
          name: "Challenge King",
          icon: "👑",
          earned: Math.random() > 0.6,
          description: "Won 10+ challenges",
        },
        {
          name: "Efficiency Expert",
          icon: "⚡",
          earned: Math.random() > 0.7,
          description: "95%+ efficiency score",
        },
      ],
      stats: {
        weeklyScore: Math.floor(Math.random() * 500) + 100,
        monthlyScore: Math.floor(Math.random() * 1500) + 500,
        totalTransactions: Math.floor(Math.random() * 200) + 50,
        efficiencyScore: Math.floor(Math.random() * 40) + 60,
        streak: Math.floor(Math.random() * 50) + 5,
        challengesCompleted: Math.floor(Math.random() * 15) + 2,
      },
      recentAchievements: [
        "Completed your first challenge!",
        "Reached a new level milestone",
        "Saved money this week",
        "Connected your financial accounts",
      ],
      weeklyProgress: Array.from({ length: 7 }, () => ({
        day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][
          Math.floor(Math.random() * 7)
        ],
        score: Math.floor(Math.random() * 100) + 10,
      })),
    };

    const simpleUser = {
      username: username,
      ...userData,
      friends: userData.friends || [],
    };

    // Quick loading with animation
    setTimeout(() => {
      setUser(simpleUser);
      setIsLoading(false);
    }, 800);
  }, [username]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white font-clash relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-green-950 to-slate-900">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.1),transparent_50%)] animate-pulse"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-bounce"></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-bounce"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="text-center relative z-10">
          <div className="relative mb-8">
            {/* Multi-layer loading animation */}
            <div className="w-24 h-24 border-4 border-green-400/20 rounded-full animate-spin mx-auto"></div>
            <div
              className="w-24 h-24 border-4 border-green-400/40 border-t-transparent rounded-full animate-spin absolute top-0 left-1/2 transform -translate-x-1/2"
              style={{ animationDuration: "1.5s" }}
            ></div>
            <div
              className="w-24 h-24 border-4 border-blue-400/60 border-r-transparent rounded-full animate-spin absolute top-0 left-1/2 transform -translate-x-1/2"
              style={{ animationDuration: "2s", animationDirection: "reverse" }}
            ></div>

            {/* Center trophy icon */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Trophy className="w-8 h-8 text-green-400 animate-pulse" />
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
              Loading Battle Stats...
            </h1>
            <p className="text-gray-400 text-lg">
              Calculating your financial power level
            </p>

            {/* Progress dots */}
            <div className="flex justify-center space-x-2 mt-6">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.2}s` }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white font-clash">
        <div className="text-center">
          <Trophy className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">Battle Warrior Not Found</h1>
          <p className="text-gray-400 mb-8">
            This budget champion doesn't exist in our arena.
          </p>
          <Link
            href="/"
            className="bg-gradient-to-r from-green-500 to-blue-500 px-8 py-3 rounded-xl font-semibold hover:scale-105 transition-transform"
          >
            Return to Battle Arena
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      {/* Enhanced background with animations */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-green-950 to-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(34,197,94,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,rgba(168,85,247,0.05),transparent_50%)]"></div>

        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-green-400/30 rounded-full animate-ping"></div>
        <div
          className="absolute top-3/4 right-1/4 w-1 h-1 bg-blue-400/40 rounded-full animate-ping"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-purple-400/30 rounded-full animate-ping"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative z-10 p-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="flex items-center text-green-400 hover:text-green-300 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Arena
          </Link>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Trophy className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Budget Battle Royale
            </span>
          </div>
        </div>

        {/* User Profile Header */}
        <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 backdrop-blur-sm border border-green-500/30 rounded-2xl p-8 mb-8 hover:border-green-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/20 group">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
            <div className="relative group/avatar">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-400 rounded-full blur-lg opacity-30 group-hover/avatar:opacity-50 transition-opacity duration-300"></div>
              <img
                src={user.avatar}
                alt={user.displayName}
                className="relative w-32 h-32 rounded-full border-4 border-green-400 shadow-2xl group-hover/avatar:scale-105 transition-transform duration-300"
              />
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full p-2 shadow-lg group-hover/avatar:scale-110 transition-transform duration-300">
                <span className="text-white font-bold text-sm">
                  Lv.{user.level}
                </span>
              </div>

              {/* XP Progress Ring */}
              <div
                className="absolute inset-0 rounded-full border-4 border-transparent"
                style={{
                  background: `conic-gradient(from 0deg, #10b981 ${(user.xp % 1000) / 10}%, transparent ${(user.xp % 1000) / 10}%)`,
                }}
              ></div>
            </div>

            <div className="text-center lg:text-left flex-1">
              <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-white to-green-300 bg-clip-text text-transparent">
                {user.displayName}
              </h1>
              <p className="text-green-400 text-xl mb-4">@{user.username}</p>
              <p className="text-gray-400 mb-6">
                Battle Veteran since {user.joinedDate}
              </p>

              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 px-6 py-3 rounded-xl">
                  <div className="text-green-400 font-bold text-lg">
                    #{user.rank}
                  </div>
                  <div className="text-green-300 text-sm">Global Rank</div>
                </div>
                <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 px-6 py-3 rounded-xl">
                  <div className="text-blue-400 font-bold text-lg">
                    ${user.totalSaved}
                  </div>
                  <div className="text-blue-300 text-sm">Total Saved</div>
                </div>
                <div className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-500/30 px-6 py-3 rounded-xl">
                  <div className="text-purple-400 font-bold text-lg">
                    {user.stats.streak}
                  </div>
                  <div className="text-purple-300 text-sm">Day Streak</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button className="bg-gradient-to-r from-green-500 to-blue-500 px-6 py-2 rounded-lg font-semibold hover:scale-105 transition-transform">
                Challenge Friend
              </button>
              <button className="border border-green-500/50 px-6 py-2 rounded-lg font-semibold hover:bg-green-500/10 transition-colors">
                View Profile
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="group bg-gradient-to-br from-green-900/20 to-green-700/20 border border-green-500/30 rounded-xl p-6 hover:border-green-400/70 hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition-colors">
                  <TrendingUp className="w-8 h-8 text-green-400 group-hover:rotate-12 transition-transform duration-300" />
                </div>
                <span className="text-3xl font-bold text-green-400 group-hover:scale-110 transition-transform duration-300">
                  {user.stats.efficiencyScore}%
                </span>
              </div>
              <h3 className="font-bold text-lg mb-1">Efficiency Score</h3>
              <p className="text-sm text-gray-400">This month's performance</p>
              <div className="mt-3 w-full bg-green-900/30 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${user.stats.efficiencyScore}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="group bg-gradient-to-br from-blue-900/20 to-blue-700/20 border border-blue-500/30 rounded-xl p-6 hover:border-blue-400/70 hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                  <Star
                    className="w-8 h-8 text-blue-400 group-hover:rotate-12 transition-transform duration-300"
                    filled
                  />
                </div>
                <span className="text-3xl font-bold text-blue-400 group-hover:scale-110 transition-transform duration-300">
                  {user.xp.toLocaleString()}
                </span>
              </div>
              <h3 className="font-bold text-lg mb-1">Experience Points</h3>
              <p className="text-sm text-gray-400">Battle XP earned</p>
              <div className="mt-3 flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-3 h-3 text-blue-400 group-hover:scale-110 transition-transform duration-300"
                    filled={i < user.level % 5}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="group bg-gradient-to-br from-purple-900/20 to-purple-700/20 border border-purple-500/30 rounded-xl p-6 hover:border-purple-400/70 hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                  <Fire className="w-8 h-8 text-purple-400 group-hover:rotate-12 transition-transform duration-300" />
                </div>
                <span className="text-3xl font-bold text-purple-400 group-hover:scale-110 transition-transform duration-300">
                  {user.stats.weeklyScore}
                </span>
              </div>
              <h3 className="font-bold text-lg mb-1">Weekly Score</h3>
              <p className="text-sm text-gray-400">This week's points</p>
              <div className="mt-3 text-xs text-purple-300 group-hover:text-purple-200 transition-colors">
                +{Math.floor(Math.random() * 50 + 10)} from yesterday
              </div>
            </div>
          </div>

          <div className="group bg-gradient-to-br from-yellow-900/20 to-yellow-700/20 border border-yellow-500/30 rounded-xl p-6 hover:border-yellow-400/70 hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-yellow-500/20 rounded-lg group-hover:bg-yellow-500/30 transition-colors">
                  <Trophy className="w-8 h-8 text-yellow-400 group-hover:rotate-12 transition-transform duration-300" />
                </div>
                <span className="text-3xl font-bold text-yellow-400 group-hover:scale-110 transition-transform duration-300">
                  {user.badges.filter((b: Badge) => b.earned).length}
                </span>
              </div>
              <h3 className="font-bold text-lg mb-1">Badges Earned</h3>
              <p className="text-sm text-gray-400">Total achievements</p>
              <div className="mt-3 text-xs text-yellow-300 group-hover:text-yellow-200 transition-colors">
                {user.badges.length -
                  user.badges.filter((b: Badge) => b.earned).length}{" "}
                more to unlock
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8 animate-slide-in-left">
            {/* Weekly Progress Chart */}
            <div className="bg-gradient-to-br from-slate-900/50 to-green-900/30 border border-green-500/30 rounded-2xl p-8 hover:border-green-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/20 group">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 group-hover:text-green-300 transition-colors">
                <div className="p-2 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition-colors">
                  <Calendar className="w-6 h-6 text-green-400 group-hover:rotate-12 transition-transform duration-300" />
                </div>
                Weekly Performance
              </h2>
              <div className="flex items-end justify-between h-32 gap-2">
                {user.weeklyProgress.map(
                  (day: WeeklyProgress, index: number) => (
                    <div
                      key={index}
                      className="flex flex-col items-center flex-1 group/bar"
                    >
                      <div
                        className="w-full bg-gradient-to-t from-green-500 to-green-300 rounded-t-lg transition-all duration-1000 ease-out hover:from-green-400 hover:to-green-200 group-hover/bar:scale-105 group-hover/bar:shadow-lg group-hover/bar:shadow-green-500/30"
                        style={{
                          height: `${day.score}%`,
                          animationDelay: `${index * 100}ms`,
                        }}
                      ></div>
                      <span className="text-xs text-gray-400 mt-2 group-hover/bar:text-green-300 transition-colors">
                        {day.day}
                      </span>
                      <div className="text-xs text-green-400 opacity-0 group-hover/bar:opacity-100 transition-opacity duration-300 mt-1">
                        {day.score}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* Recent Achievements */}
            <div className="bg-gradient-to-br from-slate-900/50 to-blue-900/30 border border-blue-500/30 rounded-2xl p-8 hover:border-blue-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 group">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 group-hover:text-blue-300 transition-colors">
                <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                  <Zap className="w-6 h-6 text-blue-400 group-hover:rotate-12 transition-transform duration-300" />
                </div>
                Recent Achievements
              </h2>
              <div className="space-y-4">
                {user.recentAchievements.map(
                  (achievement: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 bg-blue-500/10 rounded-lg hover:bg-blue-500/20 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20 group/achievement"
                    >
                      <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse group-hover/achievement:animate-bounce"></div>
                      <span className="flex-1 group-hover/achievement:text-blue-200 transition-colors">
                        {achievement}
                      </span>
                      <span className="text-xs text-gray-400 group-hover/achievement:text-blue-300 transition-colors">
                        {Math.floor(Math.random() * 24 + 1)}h ago
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8 animate-slide-in-right">
            {/* Battle Badges */}
            <div className="bg-gradient-to-br from-slate-900/50 to-purple-900/30 border border-purple-500/30 rounded-2xl p-8 hover:border-purple-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 group">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 group-hover:text-purple-300 transition-colors">
                <div className="p-2 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                  <Trophy className="w-6 h-6 text-purple-400 group-hover:rotate-12 transition-transform duration-300" />
                </div>
                Battle Badges
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {user.badges.map((badge: Badge, index: number) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 text-center transition-all duration-300 hover:scale-110 cursor-pointer group/badge ${
                      badge.earned
                        ? "border-green-500/50 bg-green-500/10 hover:bg-green-500/20 hover:shadow-lg hover:shadow-green-500/30"
                        : "border-gray-600/50 bg-gray-800/20 opacity-50 hover:opacity-70 hover:shadow-lg hover:shadow-gray-500/20"
                    }`}
                    title={badge.description}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="text-2xl mb-2 group-hover/badge:scale-125 transition-transform duration-300">
                      {badge.icon}
                    </div>
                    <h3 className="font-semibold text-xs group-hover/badge:text-white transition-colors">
                      {badge.name}
                    </h3>
                    {badge.earned && (
                      <div className="mt-1 group-hover/badge:animate-bounce">
                        <Star
                          className="w-3 h-3 text-yellow-400 mx-auto"
                          filled
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Battle Friends */}
            <div className="bg-gradient-to-br from-slate-900/50 to-green-900/30 border border-green-500/30 rounded-2xl p-8 hover:border-green-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/20 group">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 group-hover:text-green-300 transition-colors">
                <div className="p-2 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition-colors">
                  <Users className="w-6 h-6 text-green-400 group-hover:rotate-12 transition-transform duration-300" />
                </div>
                Battle Squad
              </h2>
              <div className="space-y-3">
                {user.friends.map((friend: Friend, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg hover:bg-green-500/20 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/20 group/friend"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative group/avatar">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center text-xs font-bold group-hover/avatar:scale-110 transition-transform duration-300">
                          {friend.name.charAt(0)}
                        </div>
                        <div
                          className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border border-slate-900 animate-pulse ${
                            friend.status === "online"
                              ? "bg-green-400"
                              : friend.status === "away"
                                ? "bg-yellow-400"
                                : "bg-gray-400"
                          }`}
                        ></div>
                      </div>
                      <div>
                        <div className="font-semibold text-sm group-hover/friend:text-green-200 transition-colors">
                          {friend.name}
                        </div>
                        <div className="text-xs text-gray-400 group-hover/friend:text-green-300 transition-colors">
                          Level {friend.level}
                        </div>
                      </div>
                    </div>
                    <button className="text-xs bg-green-500/20 px-2 py-1 rounded hover:bg-green-500/30 transition-all duration-300 hover:scale-110 group-hover/friend:animate-glow">
                      Challenge
                    </button>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-2 border border-green-500/50 rounded-lg text-green-400 hover:bg-green-500/10 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/20">
                Find More Warriors
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-slate-900/50 to-blue-900/30 border border-blue-500/30 rounded-2xl p-6 hover:border-blue-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 group">
              <h3 className="font-bold mb-4 text-center group-hover:text-blue-300 transition-colors">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-green-500 to-green-600 py-3 rounded-lg font-semibold hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/30 group/btn">
                  <span className="group-hover/btn:animate-pulse">
                    Add Transaction
                  </span>
                </button>
                <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 py-3 rounded-lg font-semibold hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 group/btn">
                  <span className="group-hover/btn:animate-pulse">
                    View Challenges
                  </span>
                </button>
                <button className="w-full border border-purple-500/50 py-3 rounded-lg font-semibold hover:bg-purple-500/10 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 group/btn">
                  <span className="group-hover/btn:text-purple-300 transition-colors">
                    Share Victory
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stats Row */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-green-900/30 to-green-800/30 border border-green-500/30 rounded-xl p-6 text-center hover:border-green-400/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-green-500/20 group">
            <div className="p-3 bg-green-500/20 rounded-lg mx-auto mb-3 w-fit group-hover:bg-green-500/30 transition-colors">
              <DollarSign className="w-8 h-8 text-green-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <div className="text-2xl font-bold text-green-400 group-hover:scale-110 transition-transform duration-300">
              {user.stats.totalTransactions}
            </div>
            <div className="text-sm text-gray-400 group-hover:text-green-300 transition-colors">
              Total Transactions
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-900/30 to-blue-800/30 border border-blue-500/30 rounded-xl p-6 text-center hover:border-blue-400/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20 group">
            <div className="p-3 bg-blue-500/20 rounded-lg mx-auto mb-3 w-fit group-hover:bg-blue-500/30 transition-colors">
              <Target className="w-8 h-8 text-blue-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <div className="text-2xl font-bold text-blue-400 group-hover:scale-110 transition-transform duration-300">
              {user.stats.challengesCompleted}
            </div>
            <div className="text-sm text-gray-400 group-hover:text-blue-300 transition-colors">
              Challenges Won
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-900/30 to-purple-800/30 border border-purple-500/30 rounded-xl p-6 text-center hover:border-purple-400/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20 group">
            <div className="p-3 bg-purple-500/20 rounded-lg mx-auto mb-3 w-fit group-hover:bg-purple-500/30 transition-colors">
              <Fire className="w-8 h-8 text-purple-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <div className="text-2xl font-bold text-purple-400 group-hover:scale-110 transition-transform duration-300">
              {user.stats.monthlyScore}
            </div>
            <div className="text-sm text-gray-400 group-hover:text-purple-300 transition-colors">
              Monthly Score
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-12 bg-gradient-to-r from-green-900/50 to-blue-900/50 border border-green-500/30 rounded-2xl p-8 text-center hover:border-green-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/20 group animate-fade-in">
          <h2 className="text-3xl font-bold mb-4 group-hover:scale-105 transition-transform duration-300">
            Ready for Your Next
            <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
              {" "}
              Challenge?
            </span>
          </h2>
          <p className="text-gray-300 mb-6 group-hover:text-green-200 transition-colors">
            Keep climbing the leaderboard and unlock exclusive rewards!
          </p>
          <div className="flex gap-4 justify-center">
            <button className="bg-gradient-to-r from-green-500 to-blue-500 px-8 py-3 rounded-xl font-bold hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/30 group/btn">
              <span className="group-hover/btn:animate-pulse">
                Start New Challenge
              </span>
            </button>
            <button className="border border-green-500/50 px-8 py-3 rounded-xl font-semibold hover:bg-green-500/10 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-green-500/20 group/btn">
              <span className="group-hover/btn:text-green-300 transition-colors">
                View Leaderboard
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
