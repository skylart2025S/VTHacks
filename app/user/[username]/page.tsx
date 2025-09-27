// app/user/[username]/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// Custom CSS for Clash font (same as homepage)
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
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = clashFontStyles;
  document.head.appendChild(styleElement);
}

// SVG Icons
const Trophy = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M15.75 4.236c-.982.143-1.954.317-2.916.52a6.003 6.003 0 0 0-1.668 1.732 6.003 6.003 0 0 0-1.668-1.732 24.498 24.498 0 0 0-2.916-.52m7.5 0v-.916C15.75 2.253 16.503 1.5 17.438 1.5h1.875C20.247 1.5 21 2.254 21 3.188v.916m-7.5 0H5.625c-.621 0-1.125.504-1.125 1.125v4.125c0 .621.504 1.125 1.125 1.125h2.625m0 0v2.25c0 .621.504 1.125 1.125 1.125h3c.621 0 1.125-.504 1.125-1.125V8.5" />
  </svg>
);

const Zap = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
  </svg>
);

const TrendingUp = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
  </svg>
);

const DollarSign = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12s-1.536-.219-2.121-.659c-1.172-.879-1.172-2.303 0-3.182C11.051 7.28 12.949 7.28 14.121 8.159L15 8.818" />
  </svg>
);

const Star = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const Brain = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75-7.478a12.06 12.06 0 0 0 4.5 0m-8.25 0a12.06 12.06 0 0 0-4.5 0m8.25 0V6.108c0-1.389.47-2.717 1.305-3.671C15.225 1.268 16.503.75 18 .75c1.497 0 2.775.518 3.695 1.687.835.954 1.305 2.282 1.305 3.671V12m-6 0a3 3 0 0 0 3 3v0a3 3 0 0 0 3-3m-6 0h6" />
  </svg>
);

const Home = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
  </svg>
);

export default function UserPage() {
  const params = useParams();
  const username = params.username as string;
  const [isLoading, setIsLoading] = useState(true);
  const [userStats, setUserStats] = useState({
    level: 12,
    xp: 2850,
    rank: 47,
    budgetScore: 87,
    moneySaved: 1250
  });

  useEffect(() => {
    // Simulate loading user data
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const formatUsername = (username: string) => {
    return username.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const achievements = [
    { name: "Savings Streak", icon: Zap, color: "text-yellow-400", achieved: true },
    { name: "Budget Master", icon: Trophy, color: "text-green-400", achieved: true },
    { name: "Expense Detective", icon: Brain, color: "text-blue-400", achieved: true },
    { name: "Money Ninja", icon: Star, color: "text-purple-400", achieved: false }
  ];

  const recentTransactions = [
    { id: 1, description: "Coffee Shop", amount: -4.50, category: "Food", efficiency: 85 },
    { id: 2, description: "Textbook Purchase", amount: -89.99, category: "Education", efficiency: 92 },
    { id: 3, description: "Part-time Job", amount: 150.00, category: "Income", efficiency: 100 },
    { id: 4, description: "Netflix Subscription", amount: -15.99, category: "Entertainment", efficiency: 78 }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-green-950 to-slate-900 text-white font-clash flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl">Loading your battle stats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-green-950 to-slate-900 text-white font-clash">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 md:px-12 border-b border-green-500/20">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Trophy className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Budget Battle Royale
          </span>
        </div>
        <Link href="/" className="flex items-center gap-2 px-4 py-2 border border-green-500/30 rounded-lg hover:border-green-400 hover:bg-green-500/10 transition-all">
          <Home className="w-4 h-4" />
          Home
        </Link>
      </nav>

      {/* Header */}
      <div className="px-6 md:px-12 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                Welcome back, <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">{formatUsername(username)}</span>
              </h1>
              <p className="text-gray-300 text-xl">Ready to dominate your finances today?</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">Level {userStats.level}</div>
                <div className="text-sm text-gray-400">Rank #{userStats.rank}</div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-green-900/30 to-blue-900/30 backdrop-blur-sm border border-green-500/30 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <Zap className="w-8 h-8 text-yellow-400" />
                <span className="text-sm text-gray-400">XP</span>
              </div>
              <div className="text-3xl font-bold text-white">{userStats.xp.toLocaleString()}</div>
              <div className="text-sm text-green-400">+120 today</div>
            </div>

            <div className="bg-gradient-to-br from-green-900/30 to-blue-900/30 backdrop-blur-sm border border-green-500/30 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-8 h-8 text-green-400" />
                <span className="text-sm text-gray-400">Score</span>
              </div>
              <div className="text-3xl font-bold text-white">{userStats.budgetScore}/100</div>
              <div className="text-sm text-green-400">Excellent!</div>
            </div>

            <div className="bg-gradient-to-br from-green-900/30 to-blue-900/30 backdrop-blur-sm border border-green-500/30 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="w-8 h-8 text-blue-400" />
                <span className="text-sm text-gray-400">Saved</span>
              </div>
              <div className="text-3xl font-bold text-white">${userStats.moneySaved}</div>
              <div className="text-sm text-green-400">This month</div>
            </div>

            <div className="bg-gradient-to-br from-green-900/30 to-blue-900/30 backdrop-blur-sm border border-green-500/30 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <Trophy className="w-8 h-8 text-purple-400" />
                <span className="text-sm text-gray-400">Rank</span>
              </div>
              <div className="text-3xl font-bold text-white">#{userStats.rank}</div>
              <div className="text-sm text-green-400">↑ 3 spots</div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Achievements */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-green-900/30 to-blue-900/30 backdrop-blur-sm border border-green-500/30 rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  Achievements
                </h3>
                <div className="space-y-3">
                  {achievements.map((achievement, index) => (
                    <div key={index} className={`flex items-center gap-3 p-3 rounded-lg ${achievement.achieved ? 'bg-green-900/30' : 'bg-gray-900/30'}`}>
                      <achievement.icon className={`w-6 h-6 ${achievement.color} ${!achievement.achieved && 'opacity-50'}`} />
                      <span className={achievement.achieved ? 'text-white' : 'text-gray-400'}>
                        {achievement.name}
                      </span>
                      {achievement.achieved && <Star className="w-4 h-4 text-yellow-400 ml-auto" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-green-900/30 to-blue-900/30 backdrop-blur-sm border border-green-500/30 rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  Recent Transactions
                </h3>
                <div className="space-y-3">
                  {recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                      <div>
                        <div className="font-semibold">{transaction.description}</div>
                        <div className="text-sm text-gray-400">{transaction.category}</div>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold ${transaction.amount > 0 ? 'text-green-400' : 'text-white'}`}>
                          ${Math.abs(transaction.amount).toFixed(2)}
                        </div>
                        <div className="text-sm">
                          <span className={`px-2 py-1 rounded text-xs ${
                            transaction.efficiency >= 90 ? 'bg-green-900/50 text-green-400' :
                            transaction.efficiency >= 80 ? 'bg-yellow-900/50 text-yellow-400' :
                            'bg-red-900/50 text-red-400'
                          }`}>
                            {transaction.efficiency}% efficient
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* AI Insights */}
          <div className="mt-8">
            <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-400" />
                AI Insights
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-purple-900/20 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-300 mb-2">💡 Smart Tip</h4>
                  <p className="text-sm text-gray-300">You're spending 15% more on coffee than similar users. Consider brewing at home to save $47/month!</p>
                </div>
                <div className="bg-green-900/20 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-300 mb-2">🎯 Goal Progress</h4>
                  <p className="text-sm text-gray-300">Great job! You're 78% toward your monthly savings goal of $200. Keep it up!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}