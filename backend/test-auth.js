const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

// Test data
const testUser = {
  name: 'Test User John Smith Wilson',
  email: 'testuser@example.com',
  password: 'TestPass123!',
  address: '123 Test Street, Test City, TC 12345'
};

const loginData = {
  email: 'testuser@example.com',
  password: 'TestPass123!'
};

// Test functions
const testRegistration = async () => {
  try {
    console.log('🧪 Testing user registration...');
    const response = await axios.post(`${API_BASE_URL}/auth/register`, testUser);
    console.log('✅ Registration successful:', response.data);
    return response.data.data.token;
  } catch (error) {
    console.error('❌ Registration failed:', error.response?.data || error.message);
    return null;
  }
};

const testLogin = async () => {
  try {
    console.log('\n🧪 Testing user login...');
    const response = await axios.post(`${API_BASE_URL}/auth/login`, loginData);
    console.log('✅ Login successful:', response.data);
    return response.data.data.token;
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data || error.message);
    return null;
  }
};

const testProfile = async (token) => {
  try {
    console.log('\n🧪 Testing get profile...');
    const response = await axios.get(`${API_BASE_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Profile retrieved:', response.data);
  } catch (error) {
    console.error('❌ Profile retrieval failed:', error.response?.data || error.message);
  }
};

const testPasswordUpdate = async (token) => {
  try {
    console.log('\n🧪 Testing password update...');
    const passwordData = {
      currentPassword: 'TestPass123!',
      newPassword: 'NewPass456@',
      confirmPassword: 'NewPass456@'
    };
    
    const response = await axios.put(`${API_BASE_URL}/auth/password`, passwordData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Password updated:', response.data);
  } catch (error) {
    console.error('❌ Password update failed:', error.response?.data || error.message);
  }
};

const testTokenVerification = async (token) => {
  try {
    console.log('\n🧪 Testing token verification...');
    const response = await axios.get(`${API_BASE_URL}/auth/verify`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Token verified:', response.data);
  } catch (error) {
    console.error('❌ Token verification failed:', error.response?.data || error.message);
  }
};

const testLogout = async (token) => {
  try {
    console.log('\n🧪 Testing logout...');
    const response = await axios.post(`${API_BASE_URL}/auth/logout`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Logout successful:', response.data);
  } catch (error) {
    console.error('❌ Logout failed:', error.response?.data || error.message);
  }
};

// Run all tests
const runAllTests = async () => {
  console.log('🚀 Starting authentication API tests...\n');
  
  // Test registration
  let token = await testRegistration();
  
  if (!token) {
    // If registration fails (user might already exist), try login
    token = await testLogin();
  }
  
  if (token) {
    // Test other endpoints with the token
    await testProfile(token);
    await testTokenVerification(token);
    await testPasswordUpdate(token);
    await testLogout(token);
  }
  
  console.log('\n🏁 All tests completed!');
};

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  testRegistration,
  testLogin,
  testProfile,
  testPasswordUpdate,
  testTokenVerification,
  testLogout
};