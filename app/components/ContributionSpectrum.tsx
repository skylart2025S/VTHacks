"use client";

import React, { useState, useEffect } from 'react';

// SVG Icons
const ChartBar = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
  </svg>
);

const Users = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
  </svg>
);

const Dollar = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

interface ContributionData {
  roomId: string;
  userId: string;
  username: string;
  totalContributed: number;
  totalExpenses: number;
  contributionPercentage: number;
  lastUpdated: Date;
  monthlyContributions: { [month: string]: number };
  categories: {
    groceries: number;
    utilities: number;
    rent: number;
    entertainment: number;
    other: number;
  };
}

interface ContributionSpectrumProps {
  roomId: string;
  currentUser: string;
}

export default function ContributionSpectrum({ roomId, currentUser }: ContributionSpectrumProps) {
  const [contributions, setContributions] = useState<ContributionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddContribution, setShowAddContribution] = useState(false);
  const [newContribution, setNewContribution] = useState({
    amount: '',
    category: 'other',
    description: ''
  });

  // Fetch contribution data
  useEffect(() => {
    fetchContributions();
  }, [roomId]);

  const fetchContributions = async () => {
    try {
      const response = await fetch(`/api/rooms/contributions?roomId=${roomId}`);
      const data = await response.json();
      if (response.ok) {
        setContributions(data.contributions || []);
      }
    } catch (error) {
      console.error('Error fetching contributions:', error);
    } finally {
      setLoading(false);
    }
  };

  const addContribution = async () => {
    try {
      const response = await fetch('/api/rooms/contributions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId,
          amount: parseFloat(newContribution.amount),
          category: newContribution.category,
          description: newContribution.description
        })
      });

      if (response.ok) {
        setNewContribution({
          amount: '',
          category: 'other',
          description: ''
        });
        setShowAddContribution(false);
        fetchContributions();
      }
    } catch (error) {
      console.error('Error adding contribution:', error);
    }
  };

  const getContributionColor = (percentage: number) => {
    if (percentage >= 30) return 'from-green-500 to-emerald-500';
    if (percentage >= 20) return 'from-blue-500 to-cyan-500';
    if (percentage >= 10) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  const getContributionLabel = (percentage: number) => {
    if (percentage >= 30) return 'High Contributor';
    if (percentage >= 20) return 'Good Contributor';
    if (percentage >= 10) return 'Moderate Contributor';
    return 'Low Contributor';
  };

  const totalRoomContribution = contributions.reduce((sum, c) => sum + c.totalContributed, 0);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-slate-900/80 to-blue-900/50 backdrop-blur-sm border border-blue-500/30 rounded-3xl p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-16 bg-gray-700 rounded"></div>
            <div className="h-16 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-900/80 to-blue-900/50 backdrop-blur-sm border border-blue-500/30 rounded-3xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <ChartBar className="w-5 h-5 text-blue-400" />
          Contribution Spectrum
        </h3>
        <button
          onClick={() => setShowAddContribution(true)}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 flex items-center gap-2"
        >
          <Dollar className="w-4 h-4" />
          Add Contribution
        </button>
      </div>

      {/* Total Room Contribution */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-400">Total Room Contributions</div>
            <div className="text-2xl font-bold text-blue-400">${totalRoomContribution.toFixed(2)}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">Active Contributors</div>
            <div className="text-lg font-bold text-purple-400">{contributions.length}</div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {contributions.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No contribution data yet. Start tracking room expenses!</p>
          </div>
        ) : (
          contributions
            .sort((a, b) => b.contributionPercentage - a.contributionPercentage)
            .map((contrib, index) => {
              const isCurrentUser = contrib.username === currentUser;
              const colorClass = getContributionColor(contrib.contributionPercentage);
              const label = getContributionLabel(contrib.contributionPercentage);

              return (
                <div
                  key={contrib.username}
                  className={`p-4 rounded-xl border transition-all duration-300 hover:scale-105 ${
                    isCurrentUser
                      ? 'bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-purple-500/50'
                      : 'bg-gradient-to-r from-slate-800/50 to-gray-800/50 border-slate-600/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${colorClass} flex items-center justify-center font-bold text-white`}>
                        {contrib.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-white flex items-center gap-2">
                          {contrib.username}
                          {isCurrentUser && (
                            <span className="px-2 py-1 bg-purple-500/30 border border-purple-500/50 rounded-full text-xs">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-400">{label}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-400">
                        {contrib.contributionPercentage.toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-400">
                        ${contrib.totalContributed.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mb-3">
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full bg-gradient-to-r ${colorClass} transition-all duration-500`}
                        style={{ width: `${Math.min(contrib.contributionPercentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Category breakdown */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Groceries:</span>
                      <span className="text-green-400">${contrib.categories.groceries.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Utilities:</span>
                      <span className="text-blue-400">${contrib.categories.utilities.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Rent:</span>
                      <span className="text-purple-400">${contrib.categories.rent.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Entertainment:</span>
                      <span className="text-pink-400">${contrib.categories.entertainment.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              );
            })
        )}
      </div>

      {/* Add Contribution Modal */}
      {showAddContribution && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-slate-900 to-blue-900 border border-blue-500/30 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Add Contribution</h3>
              <button
                onClick={() => setShowAddContribution(false)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Amount ($)</label>
                <input
                  type="number"
                  value={newContribution.amount}
                  onChange={(e) => setNewContribution({ ...newContribution, amount: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                  placeholder="50.00"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={newContribution.category}
                  onChange={(e) => setNewContribution({ ...newContribution, category: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="groceries">Groceries</option>
                  <option value="utilities">Utilities</option>
                  <option value="rent">Rent</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description (Optional)</label>
                <input
                  type="text"
                  value={newContribution.description}
                  onChange={(e) => setNewContribution({ ...newContribution, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                  placeholder="What was this expense for?"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddContribution(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addContribution}
                className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
              >
                Add Contribution
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
