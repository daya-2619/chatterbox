// Simple test script for backend API endpoints
// Run with: node test-backend.js

const BASE_URL = 'http://localhost:9002';

async function testBackend() {
  console.log('🧪 Testing Chatterbox Backend...\n');

  try {
    // Test 1: Register a new user
    console.log('1. Testing user registration...');
    const registerResponse = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        password: 'testpass123'
      })
    });
    
    if (registerResponse.ok) {
      const userData = await registerResponse.json();
      console.log('✅ Registration successful:', userData.message);
      console.log('   User details:', {
        fullName: userData.user.fullName,
        username: userData.user.username,
        email: userData.user.email
      });
      const userId = userData.user._id;
      
      // Test 2: Login
      console.log('\n2. Testing user login...');
      const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'testpass123'
        })
      });
      
      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        console.log('✅ Login successful:', loginData.message);
        
        // Test 3: Search users
        console.log('\n3. Testing user search...');
        const searchResponse = await fetch(`${BASE_URL}/api/users/search?q=test&currentUserId=${userId}`);
        if (searchResponse.ok) {
          const searchData = await searchResponse.json();
          console.log('✅ User search successful, found users:', searchData.users.length);
        }
        
        // Test 4: Get conversations (should be empty initially)
        console.log('\n4. Testing conversations...');
        const convResponse = await fetch(`${BASE_URL}/api/conversations?userId=${userId}`);
        if (convResponse.ok) {
          const convData = await convResponse.json();
          console.log('✅ Conversations loaded, count:', convData.conversations.length);
        }
        
      } else {
        const errorData = await loginResponse.json();
        console.log('❌ Login failed:', errorData.error);
      }
      
    } else {
      const errorData = await registerResponse.json();
      console.log('❌ Registration failed:', errorData.error);
    }
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
  
  console.log('\n🎉 Backend testing completed!');
}

// Run the test
testBackend();
