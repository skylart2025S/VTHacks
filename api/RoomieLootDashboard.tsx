'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { usePlaidLink } from 'react-plaid-link';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Types for TypeScript (if using TypeScript)
interface User {
  id: number;
  username: string;
  email: string;
  xp: number;
  level: number;
  total_spent: number;
  total_earned: number;
  achievements: Achievement[];
}

interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  xp_reward: number;
  earned_at?: string;
}

interface Transaction {
  transaction_id: string;
  amount: number;
  date: string;
  name: string;
  merchant_name?: string;
  category: string[];
  xp_earned: number;
}

interface Account {
  id: number;
  account_id: string;
  name: string;
  official_name?: string;
  type: string;
  subtype: string;
  current_balance: number;
  available_balance: number;
}

// API Service Class
class RoomieLootAPI {
  private static async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'API request failed');
    }

    return response.json();
  }

  // Authentication
  static async register(username: string, email: string, password: string) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
  }

  static async login(username: string, password: string) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  // Plaid Integration
  static async createLinkToken(userId: number) {
    return this.request('/api/create_link_token', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId }),
    });
  }

  static async exchangePublicToken(publicToken: string, userId: number) {
    return this.request('/api/set_access_token', {
      method: 'POST',
      body: JSON.stringify({ public_token: publicToken, user_id: userId }),
    });
  }

  // Financial Data
  static async getAccounts(userId: number) {
    return this.request(`/api/accounts?user_id=${userId}`);
  }

  static async getTransactions(userId: number, days: number = 30) {
    return this.request(`/api/transactions?user_id=${userId}&days=${days}`);
  }

  static async getBalance(userId: number) {
    return this.request(`/api/balance?user_id=${userId}`);
  }

  // Gamification
  static async getUserProfile(userId: number) {
    return this.request(`/api/user/profile?user_id=${userId}`);
  }

  static async getLeaderboard(limit: number = 10) {
    return this.request(`/api/leaderboard?limit=${limit}`);
  }

  static async getAchievements() {
    return this.request('/api/achievements');
  }

  // Health Check
  static async healthCheck() {
    return this.request('/api/health');
  }
}

// Main Dashboard Component
export default function RoomieLootDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [linkToken, setLinkToken] = useState<string | null>(null);

  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // Login/Register forms
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ username: '', email: '', password: '' });

  // Initialize app
  useEffect(() => {
    checkHealth();
    loadLeaderboard();
    loadAchievements();
  }, []);

  const checkHealth = async () => {
    try {
      const health = await RoomieLootAPI.healthCheck();
      console.log('✅ Backend is healthy:', health);
    } catch (err) {
      console.error('❌ Backend health check failed:', err);
      setError('Backend is not available. Please make sure the Flask server is running.');
    }
  };

  const loadLeaderboard = async () => {
    try {
      const data = await RoomieLootAPI.getLeaderboard();
      setLeaderboard(data.leaderboard);
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
    }
  };

  const loadAchievements = async () => {
    try {
      const data = await RoomieLootAPI.getAchievements();
      setAchievements(data.achievements);
    } catch (err) {
      console.error('Failed to load achievements:', err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await RoomieLootAPI.login(loginForm.username, loginForm.password);
      setUser(response.user);
      setIsLoggedIn(true);
      setShowLogin(false);
      
      // Initialize Plaid Link
      await initializePlaidLink(response.user.id);
      
      // Load user data
      await loadUserData(response.user.id);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await RoomieLootAPI.register(
        registerForm.username,
        registerForm.email,
        registerForm.password
      );
      setUser(response.user);
      setIsLoggedIn(true);
      setShowRegister(false);
      
      // Initialize Plaid Link
      await initializePlaidLink(response.user.id);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const initializePlaidLink = async (userId: number) => {
    try {
      const response = await RoomieLootAPI.createLinkToken(userId);
      setLinkToken(response.link_token);
    } catch (err) {
      console.error('Failed to create link token:', err);
      setError('Failed to initialize bank connection');
    }
  };

  const loadUserData = async (userId: number) => {
    try {
      const [accountsData, transactionsData, profileData] = await Promise.all([
        RoomieLootAPI.getAccounts(userId),
        RoomieLootAPI.getTransactions(userId),
        RoomieLootAPI.getUserProfile(userId)
      ]);

      setAccounts(accountsData.accounts);
      setTransactions(transactionsData.transactions);
      setUser(profileData);
    } catch (err) {
      console.error('Failed to load user data:', err);
    }
  };

  const onPlaidSuccess = useCallback(async (publicToken: string, metadata: any) => {
    if (!user) return;

    setLoading(true);
    try {
      await RoomieLootAPI.exchangePublicToken(publicToken, user.id);
      
      // Reload user data to get new accounts and transactions
      await loadUserData(user.id);
      
      // Show success message
      setError(null);
      console.log('✅ Bank account connected successfully!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const onPlaidExit = useCallback((err: any, metadata: any) => {
    if (err) {
      setError(`Plaid Link error: ${err.error_message}`);
    }
  }, []);

  const config = {
    token: linkToken,
    onSuccess: onPlaidSuccess,
    onExit: onPlaidExit,
  };

  const { open, ready } = usePlaidLink(config);

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setTransactions([]);
    setAccounts([]);
    setLinkToken(null);
  };

  // Render login form
  if (!isLoggedIn && showLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6">Login to RoomieLoot</h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="text-center mt-4">
            Don't have an account?{' '}
            <button
              onClick={() => setShowRegister(true)}
              className="text-blue-500 hover:text-blue-700 font-bold"
            >
              Register
            </button>
          </p>
        </div>
      </div>
    );
  }

  // Render register form
  if (!isLoggedIn && showRegister) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6">Join RoomieLoot</h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
              <input
                type="text"
                value={registerForm.username}
                onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
              <input
                type="email"
                value={registerForm.email}
                onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
              <input
                type="password"
                value={registerForm.password}
                onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center mt-4">
            Already have an account?{' '}
            <button
              onClick={() => setShowLogin(true)}
              className="text-blue-500 hover:text-blue-700 font-bold"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    );
  }

  // Render main dashboard
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">🏆 RoomieLoot</h1>
          <p className="text-gray-600 mb-6">Gamify your personal finance journey!</p>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={() => setShowLogin(true)}
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
            >
              Login
            </button>
            <button
              onClick={() => setShowRegister(true)}
              className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main dashboard
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">🏆 RoomieLoot</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                <p className="text-sm text-gray-500">Level {user?.level} • {user?.xp} XP</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Profile & Stats */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Your Stats</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Level:</span>
                  <span className="font-bold">{user?.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">XP:</span>
                  <span className="font-bold">{user?.xp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Spent:</span>
                  <span className="font-bold">${user?.total_spent?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Earned:</span>
                  <span className="font-bold">${user?.total_earned?.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Connect Bank Account */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Connect Bank Account</h2>
              <button
                onClick={() => open()}
                disabled={!ready}
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
              >
                {ready ? 'Connect Bank Account' : 'Loading...'}
              </button>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Achievements</h2>
              <div className="space-y-2">
                {user?.achievements?.map((achievement) => (
                  <div key={achievement.id} className="flex items-center space-x-2">
                    <span className="text-lg">{achievement.icon}</span>
                    <div>
                      <p className="font-medium">{achievement.name}</p>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Accounts */}
            {accounts.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Your Accounts</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {accounts.map((account) => (
                    <div key={account.id} className="border rounded-lg p-4">
                      <h3 className="font-bold">{account.name}</h3>
                      <p className="text-gray-600">{account.official_name}</p>
                      <p className="text-lg font-bold text-green-600">
                        ${account.current_balance?.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Transactions */}
            {transactions.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
                <div className="space-y-3">
                  {transactions.slice(0, 10).map((transaction) => (
                    <div key={transaction.transaction_id} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <p className="font-medium">{transaction.name}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${transaction.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                          ${Math.abs(transaction.amount).toFixed(2)}
                        </p>
                        <p className="text-sm text-blue-600">+{transaction.xp_earned} XP</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Leaderboard */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Leaderboard</h2>
              <div className="space-y-2">
                {leaderboard.map((user, index) => (
                  <div key={user.user_id} className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg font-bold">#{user.rank}</span>
                      <span className="font-medium">{user.username}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{user.xp} XP</p>
                      <p className="text-sm text-gray-600">Level {user.level}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
