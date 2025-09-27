// Frontend Integration Example for RoomieLoot
// This shows how to integrate the Flask backend with your Next.js frontend

const API_BASE_URL = 'http://localhost:8000';

// Plaid Link Integration
export class PlaidService {
  static async createLinkToken(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/create_link_token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create link token');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating link token:', error);
      throw error;
    }
  }

  static async exchangePublicToken(publicToken, userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/set_access_token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          public_token: publicToken,
          user_id: userId,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to exchange public token');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error exchanging public token:', error);
      throw error;
    }
  }

  static async getTransactions(userId, itemId, days = 30) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/transactions?user_id=${userId}&item_id=${itemId}&days=${days}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to get transactions');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting transactions:', error);
      throw error;
    }
  }

  static async getAccounts(userId, itemId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/accounts?user_id=${userId}&item_id=${itemId}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to get accounts');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting accounts:', error);
      throw error;
    }
  }

  static async getBalance(userId, itemId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/balance?user_id=${userId}&item_id=${itemId}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to get balance');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting balance:', error);
      throw error;
    }
  }
}

// Gamification Service
export class GamificationService {
  static async getUserProfile(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/profile?user_id=${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to get user profile');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }

  static async getLeaderboard(limit = 10) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/leaderboard?limit=${limit}`);
      
      if (!response.ok) {
        throw new Error('Failed to get leaderboard');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      throw error;
    }
  }

  static async getAchievements() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/achievements`);
      
      if (!response.ok) {
        throw new Error('Failed to get achievements');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting achievements:', error);
      throw error;
    }
  }
}

// Example React Component Usage
export const PlaidIntegrationExample = () => {
  const [userId] = useState('user123');
  const [linkToken, setLinkToken] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // Initialize link token
    const initializePlaid = async () => {
      try {
        const tokenData = await PlaidService.createLinkToken(userId);
        setLinkToken(tokenData.link_token);
      } catch (error) {
        console.error('Failed to initialize Plaid:', error);
      }
    };

    // Load user profile
    const loadUserProfile = async () => {
      try {
        const profile = await GamificationService.getUserProfile(userId);
        setUserProfile(profile);
      } catch (error) {
        console.error('Failed to load user profile:', error);
      }
    };

    initializePlaid();
    loadUserProfile();
  }, [userId]);

  const handlePlaidSuccess = async (publicToken, metadata) => {
    try {
      // Exchange public token for access token
      const exchangeData = await PlaidService.exchangePublicToken(publicToken, userId);
      
      // Get transactions with XP calculation
      const transactionData = await PlaidService.getTransactions(
        userId, 
        exchangeData.item_id
      );
      
      setTransactions(transactionData.transactions);
      
      // Update user profile
      const updatedProfile = await GamificationService.getUserProfile(userId);
      setUserProfile(updatedProfile);
      
      console.log('Plaid integration successful!');
      console.log('XP earned from transactions:', transactionData.total_xp_earned);
    } catch (error) {
      console.error('Plaid integration failed:', error);
    }
  };

  return (
    <div>
      <h1>RoomieLoot Dashboard</h1>
      
      {userProfile && (
        <div className="user-profile">
          <h2>Your Profile</h2>
          <p>Level: {userProfile.level}</p>
          <p>XP: {userProfile.xp}</p>
          <p>Achievements: {userProfile.achievements.length}</p>
        </div>
      )}

      {linkToken && (
        <PlaidLink
          token={linkToken}
          onSuccess={handlePlaidSuccess}
          onExit={(err, metadata) => {
            console.log('Plaid Link exited:', err, metadata);
          }}
        >
          Connect Bank Account
        </PlaidLink>
      )}

      {transactions.length > 0 && (
        <div className="transactions">
          <h2>Recent Transactions</h2>
          {transactions.map((transaction, index) => (
            <div key={index} className="transaction">
              <p>{transaction.name}</p>
              <p>${transaction.amount}</p>
              <p>XP: {transaction.xp_earned}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Example usage in your Next.js pages
export default function Dashboard() {
  return (
    <div>
      <PlaidIntegrationExample />
    </div>
  );
}
