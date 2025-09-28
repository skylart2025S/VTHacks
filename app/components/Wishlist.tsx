"use client";

import React, { useState, useEffect } from 'react';

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

const Dollar = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

const Trash = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
  </svg>
);

const Users = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
  </svg>
);

interface WishlistItem {
  id: string;
  roomId: string;
  userId: string;
  username: string;
  itemName: string;
  description?: string;
  estimatedCost: number;
  priority: 'low' | 'medium' | 'high';
  category: string;
  createdAt: Date;
  status: 'pending' | 'approved' | 'purchased' | 'cancelled';
  contributors: string[];
  contributionAmounts: { [username: string]: number };
}

interface WishlistProps {
  roomId: string;
  currentUser: string;
}

export default function Wishlist({ roomId, currentUser }: WishlistProps) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState({
    itemName: '',
    description: '',
    estimatedCost: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    category: 'other'
  });

  // Fetch wishlist items
  useEffect(() => {
    fetchWishlistItems();
  }, [roomId]);

  const fetchWishlistItems = async () => {
    try {
      const response = await fetch(`/api/rooms/wishlist?roomId=${roomId}`);
      const data = await response.json();
      if (response.ok) {
        setWishlistItems(data.wishlistItems || []);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const addWishlistItem = async () => {
    try {
      const response = await fetch('/api/rooms/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId,
          ...newItem,
          estimatedCost: parseFloat(newItem.estimatedCost)
        })
      });

      if (response.ok) {
        setNewItem({
          itemName: '',
          description: '',
          estimatedCost: '',
          priority: 'medium',
          category: 'other'
        });
        setShowAddModal(false);
        fetchWishlistItems();
      }
    } catch (error) {
      console.error('Error adding wishlist item:', error);
    }
  };

  const contributeToItem = async (itemId: string, amount: number) => {
    try {
      const response = await fetch('/api/rooms/wishlist', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId,
          action: 'contribute',
          contributionAmount: amount
        })
      });

      if (response.ok) {
        fetchWishlistItems();
      }
    } catch (error) {
      console.error('Error contributing to item:', error);
    }
  };

  const removeContribution = async (itemId: string) => {
    try {
      const response = await fetch('/api/rooms/wishlist', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId,
          action: 'uncontribute'
        })
      });

      if (response.ok) {
        fetchWishlistItems();
      }
    } catch (error) {
      console.error('Error removing contribution:', error);
    }
  };

  const deleteItem = async (itemId: string) => {
    try {
      const response = await fetch(`/api/rooms/wishlist?itemId=${itemId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchWishlistItems();
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-900/30 border-red-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-900/30 border-yellow-500/30';
      case 'low': return 'text-green-400 bg-green-900/30 border-green-500/30';
      default: return 'text-gray-400 bg-gray-900/30 border-gray-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-400 bg-green-900/30 border-green-500/30';
      case 'purchased': return 'text-blue-400 bg-blue-900/30 border-blue-500/30';
      case 'cancelled': return 'text-gray-400 bg-gray-900/30 border-gray-500/30';
      default: return 'text-yellow-400 bg-yellow-900/30 border-yellow-500/30';
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-slate-900/80 to-purple-900/50 backdrop-blur-sm border border-purple-500/30 rounded-3xl p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-20 bg-gray-700 rounded"></div>
            <div className="h-20 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-900/80 to-purple-900/50 backdrop-blur-sm border border-purple-500/30 rounded-3xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Heart className="w-5 h-5 text-purple-400" />
          Room Wishlist
        </h3>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </button>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {wishlistItems.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Heart className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No wishlist items yet. Add something your roommates want to buy together!</p>
          </div>
        ) : (
          wishlistItems.map((item) => {
            const totalContributed = Object.values(item.contributionAmounts).reduce((sum, amount) => sum + amount, 0);
            const isContributing = item.contributors.includes(currentUser);
            const userContribution = item.contributionAmounts[currentUser] || 0;

            return (
              <div
                key={item.id}
                className="bg-gradient-to-r from-slate-800/50 to-gray-800/50 border border-slate-600/30 rounded-xl p-4 hover:border-purple-500/50 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-white">{item.itemName}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(item.priority)}`}>
                        {item.priority}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                    {item.description && (
                      <p className="text-sm text-gray-400 mb-2">{item.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Dollar className="w-4 h-4" />
                        ${item.estimatedCost}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {item.contributors.length} contributors
                      </span>
                      <span>by {item.username}</span>
                    </div>
                  </div>
                  {item.username === currentUser && (
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-lg transition-colors"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Progress bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>${totalContributed} / ${item.estimatedCost}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((totalContributed / item.estimatedCost) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Contributors */}
                {item.contributors.length > 0 && (
                  <div className="mb-3">
                    <div className="text-xs text-gray-400 mb-2">Contributors:</div>
                    <div className="flex flex-wrap gap-2">
                      {item.contributors.map((contributor) => (
                        <span
                          key={contributor}
                          className="px-2 py-1 bg-purple-900/30 border border-purple-500/30 rounded-full text-xs"
                        >
                          {contributor}: ${item.contributionAmounts[contributor] || 0}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contribution buttons */}
                <div className="flex gap-2">
                  {!isContributing ? (
                    <button
                      onClick={() => {
                        const amount = prompt(`How much would you like to contribute to "${item.itemName}"?`);
                        if (amount && !isNaN(parseFloat(amount))) {
                          contributeToItem(item.id, parseFloat(amount));
                        }
                      }}
                      className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 text-sm"
                    >
                      Contribute
                    </button>
                  ) : (
                    <button
                      onClick={() => removeContribution(item.id)}
                      className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 text-sm"
                    >
                      Remove Contribution (${userContribution})
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-slate-900 to-purple-900 border border-purple-500/30 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Add Wishlist Item</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Item Name</label>
                <input
                  type="text"
                  value={newItem.itemName}
                  onChange={(e) => setNewItem({ ...newItem, itemName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                  placeholder="e.g., New Coffee Machine"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description (Optional)</label>
                <textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                  placeholder="Why do you want this item?"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Estimated Cost ($)</label>
                <input
                  type="number"
                  value={newItem.estimatedCost}
                  onChange={(e) => setNewItem({ ...newItem, estimatedCost: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                  placeholder="150.00"
                  step="0.01"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Priority</label>
                  <select
                    value={newItem.priority}
                    onChange={(e) => setNewItem({ ...newItem, priority: e.target.value as 'low' | 'medium' | 'high' })}
                    className="w-full px-3 py-2 bg-slate-800 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                  >
                    <option value="furniture">Furniture</option>
                    <option value="electronics">Electronics</option>
                    <option value="appliances">Appliances</option>
                    <option value="decor">Decor</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addWishlistItem}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
              >
                Add Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
