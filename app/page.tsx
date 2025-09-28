"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSignIn, setIsSignIn] = useState(false);
  const [registrationData, setRegistrationData] = useState<{
    userId: string;
    itemId: string;
    accountsCount: number;
    transactionsCount: number;
  } | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;
    
    setIsLoading(true);
    setError("");
    
    try {
      const endpoint = isSignIn ? '/api/auth/signin' : '/api/auth/register';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store registration data for display
        if (!isSignIn && data.financialDataGenerated) {
          setRegistrationData({
            userId: data.userId,
            itemId: data.financialData?.metadata?.item_id,
            accountsCount: data.financialData?.accounts?.length || 0,
            transactionsCount: data.financialData?.transactions?.length || 0
          });
          
          // Show success message briefly before redirecting
          setTimeout(() => {
            router.push("/rooms");
          }, 2000);
        } else {
          // Success - redirect to rooms
          router.push("/rooms");
        }
      } else {
        // Handle error - username exists or other error
        setError(data.message || "An error occurred");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-green-950 to-slate-900 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        {/* App Title */}
        <div className="mb-12">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            RoomieLoot
          </h1>
          <p className="text-gray-400 text-lg">
            Split your finances, not your friendships
          </p>
        </div>

        {/* Auth Mode Toggle */}
        <div className="mb-8">
          <div className="bg-slate-800/30 rounded-lg p-1 flex">
            <button
              type="button"
              onClick={() => setIsSignIn(false)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                !isSignIn
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
            <button
              type="button"
              onClick={() => setIsSignIn(true)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                isSignIn
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
          </div>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-6 py-4 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all"
              required
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-4 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all"
              required
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm bg-red-950/30 border border-red-800 rounded-lg px-4 py-2">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={isLoading || !username.trim() || !password.trim()}
            className={`w-full py-4 rounded-lg font-semibold text-white hover:scale-105 transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
              isSignIn 
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:shadow-blue-500/30' 
                : 'bg-gradient-to-r from-green-500 to-blue-500 hover:shadow-green-500/30'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                {isSignIn ? 'Signing In...' : 'Creating Account...'}
              </div>
            ) : (
              isSignIn ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>
        
        {/* Success Message for Account Creation */}
        {registrationData && (
          <div className="mt-6 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-semibold">Account Created Successfully!</span>
            </div>
            <div className="text-sm text-gray-300 space-y-1">
              <div>✅ Financial data generated</div>
              <div>📊 Accounts: {registrationData.accountsCount}</div>
              <div>💳 Transactions: {registrationData.transactionsCount}</div>
              <div className="text-xs text-gray-400">
                User ID: {registrationData.userId?.substring(0, 12)}...
              </div>
              <div className="text-xs text-gray-400">
                Item ID: {registrationData.itemId?.substring(0, 12)}...
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}