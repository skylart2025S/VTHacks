'use client';

import React, { useCallback, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { api, BankAccount } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface PlaidLinkProps {
  onSuccess?: (accounts: BankAccount[]) => void;
  onError?: (error: Error) => void;
}

export function PlaidLink({ onSuccess, onError }: PlaidLinkProps) {
  const { token } = useAuth();
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Create link token
  const createLinkToken = useCallback(async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const response = await api.createLinkToken(token);
      setLinkToken(response.link_token);
    } catch (error) {
      console.error('Error creating link token:', error);
      onError?.(error instanceof Error ? error : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [token, onError]);

  // Handle successful link
  const onPlaidSuccess = useCallback(async (publicToken: string) => {
    if (!token) return;
    
    try {
      setLoading(true);
      const accounts = await api.linkBankAccount(token, publicToken);
      onSuccess?.(accounts);
    } catch (error) {
      console.error('Error linking bank account:', error);
      onError?.(error instanceof Error ? error : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [token, onSuccess, onError]);

  // Handle link errors
  const onPlaidError = useCallback((error: Error) => {
    console.error('Plaid Link error:', error);
    onError?.(error);
  }, [onError]);

  // Configure Plaid Link
  const config = {
    token: linkToken,
    onSuccess: onPlaidSuccess,
    onExit: (err: Error | null) => {
      if (err) {
        onPlaidError(err);
      }
    },
    onEvent: (eventName: string) => {
      console.log('Plaid Link event:', eventName);
    },
  };

  const { open, ready } = usePlaidLink(config);

  const handleClick = () => {
    if (!linkToken) {
      createLinkToken();
    } else {
      open();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading || (!ready && !!linkToken)}
      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
    >
      {loading ? 'Loading...' : 'Link Bank Account'}
    </button>
  );
}
