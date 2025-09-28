// test-rooms.js
// Simple test script to verify room creation and joining functionality
// Run with: node test-rooms.js

const BASE_URL = 'http://localhost:3000/api/rooms';

async function testRoomCreation() {
  console.log('Testing room creation...');
  
  try {
    const response = await fetch(`${BASE_URL}/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        roomName: 'Test Room',
        createdBy: 'testuser'
      })
    });

    const data = await response.json();
    console.log('Room creation response:', data);
    
    if (response.ok) {
      console.log('✅ Room created successfully!');
      return data.room.id;
    } else {
      console.log('❌ Room creation failed:', data.message);
      return null;
    }
  } catch (error) {
    console.error('❌ Error creating room:', error);
    return null;
  }
}

async function testRoomJoining(roomId) {
  console.log(`\nTesting room joining with ID: ${roomId}...`);
  
  try {
    const response = await fetch(`${BASE_URL}/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        roomId: roomId,
        username: 'newuser'
      })
    });

    const data = await response.json();
    console.log('Room join response:', data);
    
    if (response.ok) {
      console.log('✅ Successfully joined room!');
    } else {
      console.log('❌ Failed to join room:', data.message);
    }
  } catch (error) {
    console.error('❌ Error joining room:', error);
  }
}

async function testInvalidRoomJoin() {
  console.log('\nTesting joining non-existent room...');
  
  try {
    const response = await fetch(`${BASE_URL}/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        roomId: 'INVALID',
        username: 'testuser'
      })
    });

    const data = await response.json();
    console.log('Invalid room join response:', data);
    
    if (response.status === 404) {
      console.log('✅ Correctly rejected invalid room ID!');
    } else {
      console.log('❌ Should have rejected invalid room ID');
    }
  } catch (error) {
    console.error('❌ Error testing invalid room join:', error);
  }
}

async function runTests() {
  console.log('Starting room API tests...\n');
  
  // Test room creation
  const roomId = await testRoomCreation();
  
  if (roomId) {
    // Test joining the created room
    await testRoomJoining(roomId);
    
    // Test joining the same room again (should fail)
    console.log('\nTesting joining same room again...');
    await testRoomJoining(roomId);
  }
  
  // Test joining non-existent room
  await testInvalidRoomJoin();
  
  console.log('\nTests completed!');
}

// Run tests if this script is executed directly
if (require.main === module) {
  runTests();
}

module.exports = { testRoomCreation, testRoomJoining, testInvalidRoomJoin };
