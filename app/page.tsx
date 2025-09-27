"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = clashFontStyles;
  document.head.appendChild(styleElement);
}

// SVG Icon Components
const ChevronRight = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
  </svg>
);

const Trophy = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M15.75 4.236c-.982.143-1.954.317-2.916.52a6.003 6.003 0 0 0-1.668 1.732 6.003 6.003 0 0 0-1.668-1.732 24.498 24.498 0 0 0-2.916-.52m7.5 0v-.916C15.75 2.253 16.503 1.5 17.438 1.5h1.875C20.247 1.5 21 2.254 21 3.188v.916m-7.5 0H5.625c-.621 0-1.125.504-1.125 1.125v4.125c0 .621.504 1.125 1.125 1.125h2.625m0 0v2.25c0 .621.504 1.125 1.125 1.125h3c.621 0 1.125-.504 1.125-1.125V8.5" />
  </svg>
);

const Target = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
  </svg>
);

const Brain = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75-7.478a12.06 12.06 0 0 0 4.5 0m-8.25 0a12.06 12.06 0 0 0-4.5 0m8.25 0V6.108c0-1.389.47-2.717 1.305-3.671C15.225 1.268 16.503.75 18 .75c1.497 0 2.775.518 3.695 1.687.835.954 1.305 2.282 1.305 3.671V12m-6 0a3 3 0 0 0 3 3v0a3 3 0 0 0 3-3m-6 0h6" />
  </svg>
);

const Users = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
  </svg>
);

const Zap = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
  </svg>
);

const Shield = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.333 9-6.03 9-11.623C21 7.51 20.403 5.228 18.598 6a11.96 11.96 0 0 1-5.598-3.75Z" />
  </svg>
);

const TrendingUp = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
  </svg>
);

const Star = ({ className, ...props }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const Play = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
  </svg>
);

const UserIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

// OAuth Provider Icons
const GoogleIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const GithubIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

const DiscordIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
);

const LoadingSpinner = ({ className }) => (
  <svg className={`animate-spin ${className}`} fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default function BudgetBattleHomepage() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [showOAuthModal, setShowOAuthModal] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState('');
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    setIsVisible(true);
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Mock OAuth authentication function
  const authenticateWithProvider = async (provider) => {
    setIsAuthenticating(true);
    setAuthError('');
    
    try {
      // Simulate OAuth flow delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock user data based on provider
      const mockUsers = {
        google: {
          id: 'google_' + Date.now(),
          email: 'user@gmail.com',
          name: 'John Doe',
          avatar: 'https://via.placeholder.com/40',
          provider: 'google'
        },
        github: {
          id: 'github_' + Date.now(),
          email: 'user@github.com',
          name: 'Jane Developer',
          avatar: 'https://via.placeholder.com/40',
          provider: 'github'
        },
        discord: {
          id: 'discord_' + Date.now(),
          email: 'user@discord.com',
          name: 'GamerBudget#1234',
          avatar: 'https://via.placeholder.com/40',
          provider: 'discord'
        }
      };

      const userData = mockUsers[provider];
      
      // Create user profile
      const userProfile = {
        ...userData,
        username: userData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        level: 1,
        xp: 0,
        totalSaved: 0,
        rank: Math.floor(Math.random() * 1000) + 1,
        badges: [],
        joinedAt: new Date().toISOString(),
        stats: {
          weeklyScore: 0,
          monthlyScore: 0,
          totalTransactions: 0,
          efficiencyScore: 85
        }
      };

      setUser(userProfile);
      setShowOAuthModal(false);
      
      // Navigate to user dashboard
      router.push(`/user/${userProfile.username}`);
      
    } catch (error) {
      setAuthError('Authentication failed. Please try again.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleQuickStart = () => {
    // Generate a random demo username for quick access
    const demoUsernames = ['alex-chen', 'sarah-j', 'mike-budget-pro', 'emma-saver', 'budget-ninja'];
    const randomUser = demoUsernames[Math.floor(Math.random() * demoUsernames.length)];
    router.push(`/user/${randomUser}`);
  };

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "Smart spending analysis with personalized tips to optimize your budget"
    },
    {
      icon: Trophy,
      title: "Competitive Rankings",
      description: "Climb the leaderboard and prove you're the ultimate budget master"
    },
    {
      icon: Target,
      title: "Weekly Challenges",
      description: "Complete missions, earn XP, and unlock exclusive badges"
    },
    {
      icon: TrendingUp,
      title: "Real-Time Tracking",
      description: "Live transaction monitoring with instant efficiency scoring"
    }
  ];

  const stats = [
    { number: "10K+", label: "Students Competing" },
    { number: "$2M+", label: "Money Saved" },
    { number: "94%", label: "Budget Improvement" },
    { number: "500+", label: "Badges Earned" }
  ];

  const oauthProviders = [
    {
      name: 'google',
      label: 'Continue with Google',
      icon: GoogleIcon,
      bgColor: 'bg-white hover:bg-gray-50',
      textColor: 'text-gray-900',
      borderColor: 'border-gray-300'
    },
    {
      name: 'github',
      label: 'Continue with GitHub',
      icon: GithubIcon,
      bgColor: 'bg-gray-900 hover:bg-gray-800',
      textColor: 'text-white',
      borderColor: 'border-gray-700'
    },
    {
      name: 'discord',
      label: 'Continue with Discord',
      icon: DiscordIcon,
      bgColor: 'bg-indigo-600 hover:bg-indigo-700',
      textColor: 'text-white',
      borderColor: 'border-indigo-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-green-950 to-slate-900 text-white overflow-hidden font-clash">
      {/* Animated background particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-green-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Dynamic gradient orb following mouse */}
      <div 
        className="fixed w-96 h-96 rounded-full bg-gradient-to-r from-green-500/20 to-blue-500/20 blur-3xl pointer-events-none transition-all duration-300"
        style={{
          left: mousePos.x - 192,
          top: mousePos.y - 192,
        }}
      />

      {/* OAuth Modal */}
      {showOAuthModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-slate-900 to-green-900 border border-green-500/30 rounded-2xl p-8 w-full max-w-md">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Join the Battle</h3>
              <p className="text-gray-400">Choose your preferred sign-in method</p>
            </div>

            {authError && (
              <div className="mb-4 p-3 bg-red-900/30 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {authError}
              </div>
            )}

            <div className="space-y-3 mb-6">
              {oauthProviders.map((provider) => (
                <button
                  key={provider.name}
                  onClick={() => authenticateWithProvider(provider.name)}
                  disabled={isAuthenticating}
                  className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg border transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed ${provider.bgColor} ${provider.textColor} ${provider.borderColor}`}
                >
                  {isAuthenticating ? (
                    <LoadingSpinner className="w-5 h-5" />
                  ) : (
                    <provider.icon className="w-5 h-5" />
                  )}
                  <span>{isAuthenticating ? 'Connecting...' : provider.label}</span>
                </button>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={() => setShowOAuthModal(false)}
                disabled={isAuthenticating}
                className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-700">
              <p className="text-xs text-gray-400 text-center">
                By continuing, you agree to our Terms of Service and Privacy Policy. 
                Your financial data is encrypted and secure.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-6 md:px-12">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Trophy className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Budget Battle Royale
          </span>
        </div>
        <div className="hidden md:flex space-x-8">
          <a href="#features" className="hover:text-green-400 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-green-400 transition-colors">How It Works</a>
          <a href="#leaderboard" className="hover:text-green-400 transition-colors">Leaderboard</a>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleQuickStart}
            className="hidden sm:block bg-slate-700/50 border border-green-500/30 px-4 py-2 rounded-lg font-semibold hover:border-green-400 hover:bg-green-500/10 transition-all"
          >
            Quick Demo
          </button>
          {user ? (
            <div className="flex items-center gap-2 bg-slate-700/50 border border-green-500/30 px-4 py-2 rounded-lg">
              <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full" />
              <span className="font-semibold">{user.name}</span>
            </div>
          ) : (
            <button 
              onClick={() => setShowOAuthModal(true)}
              className="bg-gradient-to-r from-green-500 to-blue-500 px-6 py-2 rounded-lg font-semibold hover:scale-105 transition-transform flex items-center gap-2"
            >
              <UserIcon className="w-4 h-4" />
              Sign In
            </button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 md:px-12 pt-20 pb-32">
        <div className="max-w-6xl mx-auto">
          <div className={`text-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="inline-flex items-center bg-green-900/30 rounded-full px-4 py-2 mb-6 border border-green-500/30">
              <Zap className="w-4 h-4 mr-2 text-yellow-400" />
              <span className="text-sm">Level up your money game</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Turn Budgeting Into
              <br />
              <span className="bg-gradient-to-r from-green-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
                Epic Battles
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Compete with friends, master your spending, and climb the leaderboard. 
              AI-powered insights make budgeting addictive, not stressful.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => setShowOAuthModal(true)}
                className="group bg-gradient-to-r from-green-500 to-blue-500 px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-2xl shadow-green-500/25 flex items-center"
              >
                <Play className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                Start Your Battle
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={handleQuickStart}
                className="px-8 py-4 rounded-xl font-semibold border-2 border-green-400/30 hover:border-green-400 hover:bg-green-400/10 transition-all duration-300"
              >
                Watch Demo
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-gray-400 mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-6 md:px-12 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Game-Changing
              <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent"> Features</span>
            </h2>
            <p className="text-xl text-gray-300">Everything you need to dominate your finances</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="group bg-gradient-to-br from-green-900/20 to-blue-900/20 backdrop-blur-sm border border-green-500/20 rounded-2xl p-6 hover:border-green-400/50 hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform duration-300">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative z-10 px-6 md:px-12 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-16">
            Ready to <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">Level Up?</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Sign In Securely", desc: "Use OAuth to create your battle profile safely", icon: Shield },
              { step: "02", title: "AI Analysis", desc: "Get personalized insights and efficiency scores", icon: Brain },
              { step: "03", title: "Compete & Win", desc: "Battle friends and climb the leaderboard", icon: Trophy }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-gradient-to-br from-green-900/30 to-blue-900/30 backdrop-blur-sm border border-green-500/30 rounded-2xl p-8 hover:scale-105 transition-transform duration-300">
                  <div className="text-6xl font-bold text-green-400/30 mb-4">{item.step}</div>
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-300">{item.desc}</p>
                </div>
                {index < 2 && (
                  <ChevronRight className="hidden md:block absolute top-1/2 -right-4 w-8 h-8 text-green-400" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="relative z-10 px-6 md:px-12 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-slate-900/80 to-green-900/50 backdrop-blur-sm border border-green-500/30 rounded-3xl p-8 md:p-12">
            <div className="text-center mb-8">
              <Shield className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Bank-Level <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">Security</span>
              </h2>
              <p className="text-xl text-gray-300">Your data is protected with enterprise-grade encryption</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="font-bold mb-2">OAuth 2.0</h3>
                <p className="text-sm text-gray-400">Industry-standard authentication</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="font-bold mb-2">256-bit Encryption</h3>
                <p className="text-sm text-gray-400">Military-grade data protection</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="font-bold mb-2">Zero Data Selling</h3>
                <p className="text-sm text-gray-400">Your privacy is our priority</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 md:px-12 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-green-900/50 to-blue-900/50 backdrop-blur-sm border border-green-500/30 rounded-3xl p-12">
            <div className="flex justify-center mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-8 h-8 text-yellow-400 fill-current" />
              ))}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Join the Financial
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"> Revolution</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Thousands of students are already winning at money. Your turn to dominate.
            </p>
            <button 
              onClick={() => setShowOAuthModal(true)}
              className="group bg-gradient-to-r from-green-500 to-blue-500 px-10 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-2xl shadow-green-500/25 flex items-center mx-auto"
            >
              <Users className="w-5 h-5 mr-2" />
              Start Competing Now
              <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 md:px-12 py-12 border-t border-green-500/20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Budget Battle Royale
            </span>
          </div>
          <div className="text-gray-400 text-sm">
            © 2025 Budget Battle Royale. Level up your finances.
          </div>
        </div>
      </footer>
    </div>
  );
}