"use client";

import React, { useState } from 'react';

// SVG Icons
const Brain = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75-7.478a12.06 12.06 0 0 0 4.5 0m-8.25 0a12.06 12.06 0 0 0-4.5 0m8.25 0V6.108c0-1.389.47-2.717 1.305-3.671C15.225 1.268 16.503.75 18 .75c1.497 0 2.775.518 3.695 1.687.835.954 1.305 2.282 1.305 3.671V12m-6 0a3 3 0 0 0 3 3v0a3 3 0 0 0 3-3m-6 0h6" />
  </svg>
);

const Lightbulb = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75-7.478a12.06 12.06 0 0 0 4.5 0m-8.25 0a12.06 12.06 0 0 0-4.5 0m8.25 0V6.108c0-1.389.47-2.717 1.305-3.671C15.225 1.268 16.503.75 18 .75c1.497 0 2.775.518 3.695 1.687.835.954 1.305 2.282 1.305 3.671V12m-6 0a3 3 0 0 0 3 3v0a3 3 0 0 0 3-3m-6 0h6" />
  </svg>
);

const TrendingUp = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
  </svg>
);

const Dollar = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

const ChatBubble = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
  </svg>
);

interface FinancialTip {
  id: string;
  title: string;
  description: string;
  category: 'saving' | 'budgeting' | 'investment' | 'debt';
  priority: 'high' | 'medium' | 'low';
}

export default function FinancialAdvisor() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatMessage, setChatMessage] = useState('');

  // Sample financial tips
  const financialTips: FinancialTip[] = [
    {
      id: '1',
      title: 'Emergency Fund Priority',
      description: 'Build an emergency fund covering 3-6 months of expenses before investing.',
      category: 'saving',
      priority: 'high'
    },
    {
      id: '2',
      title: '50/30/20 Budget Rule',
      description: 'Allocate 50% to needs, 30% to wants, and 20% to savings and debt repayment.',
      category: 'budgeting',
      priority: 'high'
    },
    {
      id: '3',
      title: 'Roommate Expense Tracking',
      description: 'Use apps to track shared expenses and avoid financial conflicts.',
      category: 'budgeting',
      priority: 'medium'
    },
    {
      id: '4',
      title: 'Start Investing Early',
      description: 'Even small amounts invested early can grow significantly due to compound interest.',
      category: 'investment',
      priority: 'medium'
    },
    {
      id: '5',
      title: 'High-Interest Debt First',
      description: 'Pay off high-interest debt before focusing on investments.',
      category: 'debt',
      priority: 'high'
    },
    {
      id: '6',
      title: 'Automate Savings',
      description: 'Set up automatic transfers to savings accounts to build wealth consistently.',
      category: 'saving',
      priority: 'medium'
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'saving': return 'bg-green-100 text-green-800 border-green-200';
      case 'budgeting': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'investment': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'debt': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const filteredTips = selectedCategory === 'all' 
    ? financialTips 
    : financialTips.filter(tip => tip.category === selectedCategory);

  const sendMessage = () => {
    if (chatMessage.trim()) {
      // Here you would typically send the message to a backend API
      console.log('Sending message:', chatMessage);
      setChatMessage('');
      setShowChatModal(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900/80 to-emerald-900/50 backdrop-blur-sm border border-emerald-500/30 rounded-3xl p-6 h-full flex flex-col justify-center">
      <div className="text-center text-gray-400">
        <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <h3 className="text-xl font-bold text-white mb-2">Financial Advisor</h3>
        <p className="text-sm">Coming Soon</p>
      </div>
    </div>
  );
}
