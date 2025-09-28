"use client";

import React, { useState } from 'react';

// SVG Icons
const Plus = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

const Heart = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
  </svg>
);

const Crown = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
  </svg>
);

const Dollar = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

const ChartBar = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
  </svg>
);

interface WishlistItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  priority: 'low' | 'medium' | 'high';
  category: string;
  contributors: number;
  progress: number;
  addedBy: string;
}

interface Roommate {
  id: string;
  name: string;
  avatar: string;
  totalContributed: number;
  rank: number;
  isTopContributor: boolean;
}

export default function RoomWishlistAndSpectrum() {
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showAddContributionModal, setShowAddContributionModal] = useState(false);

  // Placeholder data for 5 wishlist items
  const wishlistItems: WishlistItem[] = [
    {
      id: '1',
      name: 'Coffee Maker',
      description: 'High-quality espresso machine for morning coffee',
      cost: 299.99,
      priority: 'high',
      category: 'Appliances',
      contributors: 3,
      progress: 75,
      addedBy: 'Alex'
    },
    {
      id: '2',
      name: 'Smart Lamp',
      description: 'RGB smart lamp for ambient lighting',
      cost: 89.99,
      priority: 'medium',
      category: 'Electronics',
      contributors: 2,
      progress: 45,
      addedBy: 'Sarah'
    },
    {
      id: '3',
      name: 'Blender',
      description: 'High-speed blender for smoothies and cooking',
      cost: 149.99,
      priority: 'medium',
      category: 'Appliances',
      contributors: 4,
      progress: 90,
      addedBy: 'Mike'
    },
    {
      id: '4',
      name: 'Board Games Set',
      description: 'Collection of popular board games for game nights',
      cost: 199.99,
      priority: 'low',
      category: 'Entertainment',
      contributors: 2,
      progress: 30,
      addedBy: 'Emma'
    },
    {
      id: '5',
      name: 'Air Purifier',
      description: 'HEPA air purifier for better indoor air quality',
      cost: 179.99,
      priority: 'high',
      category: 'Appliances',
      contributors: 3,
      progress: 60,
      addedBy: 'Alex'
    }
  ];

  // Placeholder data for 4 roommates
  const roommates: Roommate[] = [
    {
      id: '1',
      name: 'Alex Chen',
      avatar: 'AC',
      totalContributed: 450.00,
      rank: 1,
      isTopContributor: true
    },
    {
      id: '2',
      name: 'Sarah Kim',
      avatar: 'SK',
      totalContributed: 320.00,
      rank: 2,
      isTopContributor: false
    },
    {
      id: '3',
      name: 'Mike Johnson',
      avatar: 'MJ',
      totalContributed: 280.00,
      rank: 3,
      isTopContributor: false
    },
    {
      id: '4',
      name: 'Emma Davis',
      avatar: 'ED',
      totalContributed: 195.00,
      rank: 4,
      isTopContributor: false
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 2: return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
      case 3: return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white';
      default: return 'bg-gradient-to-r from-blue-400 to-blue-600 text-white';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-8">
      {/* Room Wishlist Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Room Wishlist</h2>
          </div>
          <button
            onClick={() => setShowAddItemModal(true)}
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg">No wishlist items yet. Add something your roommates want to buy together!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => (
              <div
                key={item.id}
                className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">{item.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(item.priority)}`}>
                        {item.priority}
                      </span>
                      <span className="text-xs text-gray-500">{item.category}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Progress</span>
                    <span className="text-sm font-semibold text-gray-900">${item.cost}</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${item.progress}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{item.contributors} contributors</span>
                    <span>by {item.addedBy}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Contribution Spectrum Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
              <ChartBar className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Contribution Spectrum</h2>
          </div>
          <button
            onClick={() => setShowAddContributionModal(true)}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            <Dollar className="w-4 h-4" />
            Add Contribution
          </button>
        </div>

        <div className="space-y-4">
          {roommates.map((roommate, index) => (
            <div
              key={roommate.id}
              className={`p-4 rounded-xl border transition-all duration-300 hover:scale-105 ${
                roommate.isTopContributor
                  ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 shadow-md'
                  : 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${getRankColor(roommate.rank)}`}>
                      {roommate.avatar}
                    </div>
                    {roommate.isTopContributor && (
                      <div className="absolute -top-2 -right-2">
                        <Crown className="w-6 h-6 text-yellow-500" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{roommate.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Rank #{roommate.rank}</span>
                      {roommate.isTopContributor && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                          Top Contributor
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-gray-900">${roommate.totalContributed.toFixed(2)}</div>
                  <div className="text-sm text-gray-600">Total Contributed</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                ${roommates.reduce((sum, r) => sum + r.totalContributed, 0).toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Total Contributions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{roommates.length}</div>
              <div className="text-sm text-gray-600">Active Contributors</div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Item Modal */}
      {showAddItemModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Add Wishlist Item</h3>
              <button
                onClick={() => setShowAddItemModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="e.g., Coffee Maker"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  rows={3}
                  placeholder="Why do you want this item?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Cost ($)</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="150.00"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddItemModal(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300">
                Add Item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Contribution Modal */}
      {showAddContributionModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Add Contribution</h3>
              <button
                onClick={() => setShowAddContributionModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount ($)</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="50.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="groceries">Groceries</option>
                  <option value="utilities">Utilities</option>
                  <option value="rent">Rent</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="What was this expense for?"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddContributionModal(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300">
                Add Contribution
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}