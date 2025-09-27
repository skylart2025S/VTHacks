// API configuration and utilities
const API_BASE_URL = 'http://localhost:8000';

export interface User {
  id: number;
  firebase_uid: string;
  email: string;
  display_name?: string;
  photo_url?: string;
  created_at: string;
}

export interface BankAccount {
  id: number;
  plaid_item_id: string;
  institution_id?: string;
  institution_name?: string;
  account_id: string;
  account_name?: string;
  account_type?: string;
  account_subtype?: string;
  current_balance?: number;
  available_balance?: number;
  is_active: boolean;
  created_at: string;
}

export interface Transaction {
  id: number;
  plaid_transaction_id: string;
  amount: number;
  merchant_name?: string;
  transaction_name?: string;
  transaction_type?: string;
  category?: string;
  subcategory?: string;
  date: string;
  account_id: string;
  is_pending: boolean;
  created_at: string;
}

// API functions
export const api = {
  // Authentication
  async verifyToken(token: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/api/auth/verify`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Token verification failed');
    }
    
    const data = await response.json();
    return data.user;
  },

  async getCurrentUser(token: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to get user info');
    }
    
    return response.json();
  },

  async createLinkToken(token: string): Promise<{ link_token: string; expiration: string }> {
    const response = await fetch(`${API_BASE_URL}/api/auth/link-token`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create link token: ${response.status} ${errorText}`);
    }
    
    return response.json();
  },

  // Bank Accounts
  async linkBankAccount(token: string, publicToken: string): Promise<BankAccount[]> {
    const response = await fetch(`${API_BASE_URL}/api/bank/link`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ public_token: publicToken }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to link bank account');
    }
    
    const data = await response.json();
    return data.bank_accounts;
  },

  async getBankAccounts(token: string): Promise<BankAccount[]> {
    const response = await fetch(`${API_BASE_URL}/api/bank/accounts`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to get bank accounts');
    }
    
    return response.json();
  },

  // Transactions
  async fetchTransactions(token: string, days: number = 30): Promise<Transaction[]> {
    const response = await fetch(`${API_BASE_URL}/api/transactions/fetch`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ days }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch transactions');
    }
    
    return response.json();
  },

  async getTransactions(token: string, limit: number = 50): Promise<Transaction[]> {
    const response = await fetch(`${API_BASE_URL}/api/transactions/?limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to get transactions');
    }
    
    return response.json();
  },

  async getTransactionSummary(token: string): Promise<Record<string, unknown>> {
    const response = await fetch(`${API_BASE_URL}/api/transactions/summary`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to get transaction summary');
    }
    
    return response.json();
  },
};
