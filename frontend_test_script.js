// Frontend Test Script - Run this in your browser console
// Copy and paste this entire script into your browser's Developer Tools Console

async function testCreateAccountFinancialData() {
  console.log("🧪 Testing Create Account Financial Data Generation");
  console.log("=" * 50);
  
  const baseUrl = "http://localhost:3000";
  const testUsers = [];
  
  // Test creating multiple accounts
  for (let i = 1; i <= 3; i++) {
    const username = `testuser_${i}_${Date.now()}`;
    const password = "testpass123";
    
    console.log(`\n🔄 Creating account ${i}: ${username}`);
    
    try {
      const response = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log(`✅ Account created successfully`);
        console.log(`   User ID: ${data.userId}`);
        console.log(`   Financial data generated: ${data.financialDataGenerated}`);
        
        if (data.financialDataGenerated && data.financialData) {
          const metadata = data.financialData.metadata || {};
          const accounts = data.financialData.accounts || [];
          const transactions = data.financialData.transactions || [];
          
          console.log(`   Plaid Item ID: ${metadata.item_id}`);
          console.log(`   Accounts: ${accounts.length}`);
          console.log(`   Transactions: ${transactions.length}`);
          
          if (accounts.length > 0) {
            const totalBalance = accounts.reduce((sum, acc) => 
              sum + (acc.balances?.current || 0), 0);
            console.log(`   Total Balance: $${totalBalance.toFixed(2)}`);
          }
          
          testUsers.push({
            username,
            userId: data.userId,
            itemId: metadata.item_id,
            accounts: accounts,
            transactions: transactions,
            totalBalance: accounts.reduce((sum, acc) => 
              sum + (acc.balances?.current || 0), 0)
          });
        }
      } else {
        console.log(`❌ Failed to create account: ${data.message}`);
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Analyze results
  console.log("\n📊 Analysis Results:");
  console.log("=" * 30);
  
  if (testUsers.length >= 2) {
    const uniqueItemIds = new Set(testUsers.map(u => u.itemId)).size;
    const uniqueUserIds = new Set(testUsers.map(u => u.userId)).size;
    
    console.log(`Total accounts created: ${testUsers.length}`);
    console.log(`Unique user IDs: ${uniqueUserIds}`);
    console.log(`Unique Plaid item IDs: ${uniqueItemIds}`);
    
    // Check for duplicate balances
    const balances = testUsers.map(u => u.totalBalance);
    const uniqueBalances = new Set(balances.map(b => b.toFixed(2))).size;
    console.log(`Unique total balances: ${uniqueBalances}`);
    
    // Detailed comparison
    console.log("\n🔍 Detailed Comparison:");
    testUsers.forEach((user, index) => {
      console.log(`\nUser ${index + 1}: ${user.username}`);
      console.log(`  User ID: ${user.userId}`);
      console.log(`  Item ID: ${user.itemId}`);
      console.log(`  Total Balance: $${user.totalBalance.toFixed(2)}`);
      console.log(`  Accounts: ${user.accounts.length}`);
      console.log(`  Transactions: ${user.transactions.length}`);
    });
    
    // Determine if test passed
    const allUnique = uniqueItemIds === testUsers.length && 
                     uniqueUserIds === testUsers.length &&
                     uniqueBalances === testUsers.length;
    
    console.log(`\n🎯 Test Result: ${allUnique ? '✅ PASSED' : '❌ FAILED'}`);
    
    if (allUnique) {
      console.log("🎉 SUCCESS: Each Create Account click generated unique financial data!");
    } else {
      console.log("⚠️ WARNING: Some accounts may have received duplicate data");
    }
    
  } else {
    console.log("❌ Not enough successful account creations to analyze");
  }
  
  return testUsers;
}

// Run the test
testCreateAccountFinancialData().then(results => {
  console.log("\n💾 Test completed. Results saved to 'testResults' variable.");
  window.testResults = results;
});
