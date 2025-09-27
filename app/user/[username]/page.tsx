// app/user/[username]/page.js
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// SVG Components for the dashboard
const Trophy = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M15.75 4.236c-.982.143-1.954.317-2.916.52a6.003 6.003 0 0 0-1.668 1.732 6.003 6.003 0 0 0-1.668-1.732 24.498 24.498 0 0 0-2.916-.52m7.5 0v-.916C15.75 2.253 16.503 1.5 17.438 1.5h1.875C20.247 1.5 21 2.254 21 3.188v.916m-7.5 0H5.625c-.621 0-1.125.504-1.125 1.125v4.125c0 .621.504 1.125 1.125 1.125h2.625m0 0v2.25c0 .621.504 1.125 1.125 1.125h3c.621 0 1.125-.504 1.125-1.125V8.5" />
  </svg>
);

const ArrowLeft = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
  </svg>
);

const Star = ({ className, filled = false }) => (
  <svg className={className} fill={filled ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const TrendingUp = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
  </svg>
);

const Target = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
);

const Zap = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
  </svg>
);

const Fire = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
  </svg>
);

const DollarSign = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const Users = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
  </svg>
);

const Calendar = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5" />
  </svg>
);

export default function UserDashboard({ params }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const username = params.username;

  useEffect(() => {
    // Simple user data setup
    const displayName = username.includes('-') ? 
      username.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') :
      username.charAt(0).toUpperCase() + username.slice(1);
    
    const simpleUser = {
      username: username,
      displayName: displayName,
      level: 1,
      xp: 0,
      totalSaved: 0,
      rank: 1,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}&backgroundColor=gradient`,
      joinedDate: new Date().toLocaleDateString(),
      badges: [
        { name: 'Welcome', icon: '👋', earned: true, description: 'Joined Budget Battle Royale' }
      ],
      stats: {
        weeklyScore: 0,
        monthlyScore: 0,
        totalTransactions: 0,
        efficiencyScore: 0,
        streak: 0,
        challengesCompleted: 0
      },
      recentAchievements: [
        'Welcome to Budget Battle Royale!',
        'Complete your first transaction to start earning points',
        'Connect your bank account to unlock AI insights'
      ],
      weeklyProgress: [
        { day: 'Mon', score: 0 },
        { day: 'Tue', score: 0 },
        { day: 'Wed', score: 0 },
        { day: 'Thu', score: 0 },
        { day: 'Fri', score: 0 },
        { day: 'Sat', score: 0 },
        { day: 'Sun', score: 0 }
      ],
      friends: []
    };

    // Quick loading
    setTimeout(() => {
      setUser(simpleUser);
      setIsLoading(false);
    }, 500);
  }, [username]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white font-clash">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-green-400/30 rounded-full animate-spin mx-auto mb-6"></div>
            <div className="w-20 h-20 border-4 border-green-400 border-t-transparent rounded-full animate-spin absolute top-0 left-1/2 transform -translate-x-1/2"></div>
          </div>
          <p className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Loading Battle Stats...
          </p>
          <p className="text-gray-400 mt-2">Calculating your financial power level</p>
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
          <p className="text-gray-400 mb-8">This budget champion doesn't exist in our arena.</p>
          <Link href="/" className="bg-gradient-to-r from-green-500 to-blue-500 px-8 py-3 rounded-xl font-semibold hover:scale-105 transition-transform">
            Return to Battle Arena
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-green-950 to-slate-900"></div>

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center text-green-400 hover:text-green-300 transition-colors group">
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
        <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 backdrop-blur-sm border border-green-500/30 rounded-2xl p-8 mb-8 hover:border-green-400/50 transition-colors">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
            <div className="relative">
              <img 
                src={user.avatar} 
                alt={user.displayName}
                className="w-32 h-32 rounded-full border-4 border-green-400 shadow-2xl"
              />
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full p-2">
                <span className="text-white font-bold text-sm">Lv.{user.level}</span>
              </div>
            </div>
            
            <div className="text-center lg:text-left flex-1">
              <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-white to-green-300 bg-clip-text text-transparent">
                {user.displayName}
              </h1>
              <p className="text-green-400 text-xl mb-4">@{user.username}</p>
              <p className="text-gray-400 mb-6">Battle Veteran since {user.joinedDate}</p>
              
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 px-6 py-3 rounded-xl">
                  <div className="text-green-400 font-bold text-lg">#{user.rank}</div>
                  <div className="text-green-300 text-sm">Global Rank</div>
                </div>
                <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 px-6 py-3 rounded-xl">
                  <div className="text-blue-400 font-bold text-lg">${user.totalSaved}</div>
                  <div className="text-blue-300 text-sm">Total Saved</div>
                </div>
                <div className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-500/30 px-6 py-3 rounded-xl">
                  <div className="text-purple-400 font-bold text-lg">{user.stats.streak}</div>
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
          <div className="group bg-gradient-to-br from-green-900/20 to-green-700/20 border border-green-500/30 rounded-xl p-6 hover:border-green-400/70 hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-10 h-10 text-green-400 group-hover:rotate-12 transition-transform" />
              <span className="text-3xl font-bold text-green-400">{user.stats.efficiencyScore}%</span>
            </div>
            <h3 className="font-bold text-lg mb-1">Efficiency Score</h3>
            <p className="text-sm text-gray-400">This month's performance</p>
            <div className="mt-3 w-full bg-green-900/30 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${user.stats.efficiencyScore}%` }}
              ></div>
            </div>
          </div>

          <div className="group bg-gradient-to-br from-blue-900/20 to-blue-700/20 border border-blue-500/30 rounded-xl p-6 hover:border-blue-400/70 hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <Star className="w-10 h-10 text-blue-400 group-hover:rotate-12 transition-transform" filled />
              <span className="text-3xl font-bold text-blue-400">{user.xp.toLocaleString()}</span>
            </div>
            <h3 className="font-bold text-lg mb-1">Experience Points</h3>
            <p className="text-sm text-gray-400">Battle XP earned</p>
            <div className="mt-3 flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 text-blue-400" filled={i < (user.level % 5)} />
              ))}
            </div>
          </div>

          <div className="group bg-gradient-to-br from-purple-900/20 to-purple-700/20 border border-purple-500/30 rounded-xl p-6 hover:border-purple-400/70 hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <Fire className="w-10 h-10 text-purple-400 group-hover:rotate-12 transition-transform" />
              <span className="text-3xl font-bold text-purple-400">{user.stats.weeklyScore}</span>
            </div>
            <h3 className="font-bold text-lg mb-1">Weekly Score</h3>
            <p className="text-sm text-gray-400">This week's points</p>
            <div className="mt-3 text-xs text-purple-300">
              +{Math.floor(Math.random() * 50 + 10)} from yesterday
            </div>
          </div>

          <div className="group bg-gradient-to-br from-yellow-900/20 to-yellow-700/20 border border-yellow-500/30 rounded-xl p-6 hover:border-yellow-400/70 hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <Trophy className="w-10 h-10 text-yellow-400 group-hover:rotate-12 transition-transform" />
              <span className="text-3xl font-bold text-yellow-400">{user.badges.filter(b => b.earned).length}</span>
            </div>
            <h3 className="font-bold text-lg mb-1">Badges Earned</h3>
            <p className="text-sm text-gray-400">Total achievements</p>
            <div className="mt-3 text-xs text-yellow-300">
              {user.badges.length - user.badges.filter(b => b.earned).length} more to unlock
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Weekly Progress Chart */}
            <div className="bg-gradient-to-br from-slate-900/50 to-green-900/30 border border-green-500/30 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Calendar className="w-6 h-6 text-green-400" />
                Weekly Performance
              </h2>
              <div className="flex items-end justify-between h-32 gap-2">
                {user.weeklyProgress.map((day, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div 
                      className="w-full bg-gradient-to-t from-green-500 to-green-300 rounded-t-lg transition-all duration-1000"
                      style={{ height: `${day.score}%` }}
                    ></div>
                    <span className="text-xs text-gray-400 mt-2">{day.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Achievements */}
            <div className="bg-gradient-to-br from-slate-900/50 to-blue-900/30 border border-blue-500/30 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Zap className="w-6 h-6 text-blue-400" />
                Recent Achievements
              </h2>
              <div className="space-y-4">
                {user.recentAchievements.map((achievement, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-blue-500/10 rounded-lg hover:bg-blue-500/20 transition-colors">
                    <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                    <span className="flex-1">{achievement}</span>
                    <span className="text-xs text-gray-400">{Math.floor(Math.random() * 24 + 1)}h ago</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Battle Badges */}
            <div className="bg-gradient-to-br from-slate-900/50 to-purple-900/30 border border-purple-500/30 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Trophy className="w-6 h-6 text-purple-400" />
                Battle Badges
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {user.badges.map((badge, index) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-lg border-2 text-center transition-all hover:scale-105 cursor-pointer ${
                      badge.earned 
                        ? 'border-green-500/50 bg-green-500/10 hover:bg-green-500/20' 
                        : 'border-gray-600/50 bg-gray-800/20 opacity-50 hover:opacity-70'
                    }`}
                    title={badge.description}
                  >
                    <div className="text-2xl mb-2">{badge.icon}</div>
                    <h3 className="font-semibold text-xs">{badge.name}</h3>
                    {badge.earned && (
                      <div className="mt-1">
                        <Star className="w-3 h-3 text-yellow-400 mx-auto" filled />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Battle Friends */}
            <div className="bg-gradient-to-br from-slate-900/50 to-green-900/30 border border-green-500/30 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Users className="w-6 h-6 text-green-400" />
                Battle Squad
              </h2>
              <div className="space-y-3">
                {user.friends.map((friend, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg hover:bg-green-500/20 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center text-xs font-bold">
                          {friend.name.charAt(0)}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border border-slate-900 ${
                          friend.status === 'online' ? 'bg-green-400' : 
                          friend.status === 'away' ? 'bg-yellow-400' : 'bg-gray-400'
                        }`}></div>
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{friend.name}</div>
                        <div className="text-xs text-gray-400">Level {friend.level}</div>
                      </div>
                    </div>
                    <button className="text-xs bg-green-500/20 px-2 py-1 rounded hover:bg-green-500/30 transition-colors">
                      Challenge
                    </button>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-2 border border-green-500/50 rounded-lg text-green-400 hover:bg-green-500/10 transition-colors">
                Find More Warriors
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-slate-900/50 to-blue-900/30 border border-blue-500/30 rounded-2xl p-6">
              <h3 className="font-bold mb-4 text-center">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-green-500 to-green-600 py-3 rounded-lg font-semibold hover:scale-105 transition-transform">
                  Add Transaction
                </button>
                <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 py-3 rounded-lg font-semibold hover:scale-105 transition-transform">
                  View Challenges
                </button>
                <button className="w-full border border-purple-500/50 py-3 rounded-lg font-semibold hover:bg-purple-500/10 transition-colors">
                  Share Victory
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stats Row */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-green-900/30 to-green-800/30 border border-green-500/30 rounded-xl p-6 text-center">
            <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-green-400">{user.stats.totalTransactions}</div>
            <div className="text-sm text-gray-400">Total Transactions</div>
          </div>
          <div className="bg-gradient-to-r from-blue-900/30 to-blue-800/30 border border-blue-500/30 rounded-xl p-6 text-center">
            <Target className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-blue-400">{user.stats.challengesCompleted}</div>
            <div className="text-sm text-gray-400">Challenges Won</div>
          </div>
          <div className="bg-gradient-to-r from-purple-900/30 to-purple-800/30 border border-purple-500/30 rounded-xl p-6 text-center">
            <Fire className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-purple-400">{user.stats.monthlyScore}</div>
            <div className="text-sm text-gray-400">Monthly Score</div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-12 bg-gradient-to-r from-green-900/50 to-blue-900/50 border border-green-500/30 rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready for Your Next
            <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent"> Challenge?</span>
          </h2>
          <p className="text-gray-300 mb-6">Keep climbing the leaderboard and unlock exclusive rewards!</p>
          <div className="flex gap-4 justify-center">
            <button className="bg-gradient-to-r from-green-500 to-blue-500 px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform">
              Start New Challenge
            </button>
            <button className="border border-green-500/50 px-8 py-3 rounded-xl font-semibold hover:bg-green-500/10 transition-colors">
              View Leaderboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}