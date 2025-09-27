'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PlaidLink } from '@/components/PlaidLink';
import { api, BankAccount, Transaction } from '@/lib/api';

export default function Home() {
  const { user, loading, signInWithGoogle, logout, token } = useAuth();
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<Record<string, unknown> | null>(null);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load bank accounts when user is authenticated
  useEffect(() => {
    if (token) {
      loadBankAccounts();
    }
  }, [token]);

  const loadBankAccounts = async () => {
    try {
      setLoadingAccounts(true);
      setError(null);
      const accounts = await api.getBankAccounts(token!);
      setBankAccounts(accounts);
    } catch (err) {
      setError('Failed to load bank accounts');
      console.error('Error loading bank accounts:', err);
    } finally {
      setLoadingAccounts(false);
    }
  };

  const loadTransactions = async () => {
    try {
      setLoadingTransactions(true);
      setError(null);
      const fetchedTransactions = await api.getTransactions(token!);
      setTransactions(fetchedTransactions);
    } catch (err) {
      setError('Failed to load transactions');
      console.error('Error loading transactions:', err);
    } finally {
      setLoadingTransactions(false);
    }
  };

  const fetchNewTransactions = async () => {
    try {
      setLoadingTransactions(true);
      setError(null);
      const fetchedTransactions = await api.fetchTransactions(token!, 30);
      setTransactions(fetchedTransactions);
    } catch (err) {
      setError('Failed to fetch new transactions');
      console.error('Error fetching transactions:', err);
    } finally {
      setLoadingTransactions(false);
    }
  };

  const loadSummary = async () => {
    try {
      const summaryData = await api.getTransactionSummary(token!);
      setSummary(summaryData);
    } catch (err) {
      console.error('Error loading summary:', err);
    }
  };

  const handleBankAccountLinked = (accounts: BankAccount[]) => {
    setBankAccounts(accounts);
    setError(null);
  };

  const handleBankAccountError = (error: Error) => {
    setError(`Bank linking failed: ${error.message || 'Unknown error'}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">RoomieLoot</h1>
            <p className="text-gray-600 mb-8">Test Frontend for Backend Functionality</p>
            
            <button
              onClick={signInWithGoogle}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">RoomieLoot</h1>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                Test Frontend
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.display_name || user.email}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Bank Account Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Bank Accounts</h2>
            <PlaidLink onSuccess={handleBankAccountLinked} onError={handleBankAccountError} />
          </div>
          
          {loadingAccounts ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading bank accounts...</p>
            </div>
          ) : bankAccounts.length > 0 ? (
            <div className="space-y-4">
              {bankAccounts.map((account) => (
                <div key={account.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{account.account_name}</h3>
                      <p className="text-sm text-gray-600">{account.institution_name}</p>
                      <p className="text-xs text-gray-500">{account.account_type} • {account.account_subtype}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        ${account.current_balance?.toFixed(2) || '0.00'}
                      </p>
                      <p className="text-xs text-gray-500">Current Balance</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <p className="mt-2">No bank accounts linked yet</p>
              <p className="text-sm">Click &quot;Link Bank Account&quot; to get started</p>
            </div>
          )}
        </div>

        {/* Transactions Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Transactions</h2>
            <div className="flex gap-2">
              <button
                onClick={loadTransactions}
                disabled={loadingTransactions}
                className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors"
              >
                {loadingTransactions ? 'Loading...' : 'Load Transactions'}
              </button>
              <button
                onClick={fetchNewTransactions}
                disabled={loadingTransactions}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors"
              >
                {loadingTransactions ? 'Fetching...' : 'Fetch New'}
              </button>
            </div>
          </div>

          {loadingTransactions ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading transactions...</p>
            </div>
          ) : transactions.length > 0 ? (
            <div className="space-y-3">
              {transactions.slice(0, 20).map((transaction) => (
                <div key={transaction.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-900">
                          {transaction.merchant_name || transaction.transaction_name || 'Unknown'}
                        </h3>
                        {transaction.category && (
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                            {transaction.category}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                      {transaction.subcategory && (
                        <p className="text-xs text-gray-500">{transaction.subcategory}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${
                        transaction.amount < 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {transaction.amount < 0 ? '-' : '+'}${Math.abs(transaction.amount).toFixed(2)}
                      </p>
                      {transaction.is_pending && (
                        <p className="text-xs text-yellow-600">Pending</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {transactions.length > 20 && (
                <p className="text-center text-gray-500 text-sm py-4">
                  Showing first 20 transactions. Total: {transactions.length}
                </p>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="mt-2">No transactions found</p>
              <p className="text-sm">Link a bank account and fetch transactions to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}