/**
 * Test script for chatbot system
 * Run with: node test-chatbot.js
 */

require('dotenv').config();
const axios = require('axios');

const API_URL = process.env.BACKEND_URL || 'http://localhost:5000';
const TEST_EMAIL = process.env.TEST_EMAIL || 'test@example.com';
const TEST_PASSWORD = process.env.TEST_PASSWORD || 'testpassword123';

let authToken = null;
let testBotId = null;

async function testChatbotSystem() {
  console.log('🧪 Testing Chatbot System...\n');
  console.log('='.repeat(60));
  
  try {
    // Step 1: Test API Health
    console.log('\n1️⃣  Testing API Health...');
    try {
      const healthResponse = await axios.get(`${API_URL}/health`);
      console.log('   ✅ API is healthy:', healthResponse.data);
    } catch (error) {
      console.log('   ❌ API health check failed:', error.message);
      console.log('   💡 Make sure backend server is running on', API_URL);
      return;
    }
    
    // Step 2: Test Authentication
    console.log('\n2️⃣  Testing Authentication...');
    try {
      const loginResponse = await axios.post(`${API_URL}/api/auth/login`, {
        email: TEST_EMAIL,
        password: TEST_PASSWORD
      });
      
      if (loginResponse.data.token) {
        authToken = loginResponse.data.token;
        console.log('   ✅ Login successful');
      } else {
        console.log('   ⚠️  Login response received but no token');
        console.log('   💡 You may need to create a test user first');
      }
    } catch (error) {
      console.log('   ⚠️  Login failed:', error.response?.data?.message || error.message);
      console.log('   💡 This is okay if you don\'t have a test user. We\'ll test with a bot ID.');
    }
    
    // Step 3: Test Bot List (if authenticated)
    if (authToken) {
      console.log('\n3️⃣  Testing Bot List...');
      try {
        const botsResponse = await axios.get(`${API_URL}/api/bots/list`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        
        if (botsResponse.data.bots && botsResponse.data.bots.length > 0) {
          testBotId = botsResponse.data.bots[0].id;
          console.log(`   ✅ Found ${botsResponse.data.bots.length} bot(s)`);
          console.log(`   📌 Using bot ID: ${testBotId}`);
        } else {
          console.log('   ⚠️  No bots found. Create a bot first to test chat.');
        }
      } catch (error) {
        console.log('   ⚠️  Failed to get bots:', error.response?.data?.message || error.message);
      }
    }
    
    // Step 4: Test Training Data Endpoint (if we have a bot)
    if (testBotId && authToken) {
      console.log('\n4️⃣  Testing Training Data Retrieval...');
      try {
        const trainingDataResponse = await axios.get(`${API_URL}/api/bots/${testBotId}/training-data`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        
        const trainingData = trainingDataResponse.data.trainingData;
        console.log(`   ✅ Training data retrieved:`);
        console.log(`      - Total items: ${trainingData.totalItems}`);
        console.log(`      - Text items: ${trainingData.textTraining.length}`);
        console.log(`      - Documents: ${trainingData.documents.length}`);
        console.log(`      - Total content: ${(trainingData.totalContentLength / 1024).toFixed(2)} KB`);
        
        if (trainingData.totalItems === 0) {
          console.log('   ⚠️  No training data found. Add training data to test context-based responses.');
        }
      } catch (error) {
        console.log('   ⚠️  Failed to get training data:', error.response?.data?.message || error.message);
      }
    }
    
    // Step 5: Test Chat Endpoint (if we have a bot)
    if (testBotId && authToken) {
      console.log('\n5️⃣  Testing Chat Endpoint...');
      try {
        const chatResponse = await axios.post(
          `${API_URL}/api/bots/${testBotId}/chat`,
          {
            message: "Hello, can you help me?",
            sessionId: `test_session_${Date.now()}`
          },
          {
            headers: { Authorization: `Bearer ${authToken}` },
            timeout: 30000
          }
        );
        
        console.log('   ✅ Chat response received:');
        console.log(`      Response: ${chatResponse.data.response?.substring(0, 100)}...`);
        
        if (chatResponse.data.trainingDataUsed) {
          console.log(`      Training Data Used: ${chatResponse.data.trainingDataUsed.hasData ? '✅ Yes' : '❌ No'}`);
          if (chatResponse.data.trainingDataUsed.hasData) {
            console.log(`      Data Source: ${chatResponse.data.trainingDataUsed.dataSource}`);
            console.log(`      Data Length: ${chatResponse.data.trainingDataUsed.dataLength} chars`);
          }
        }
      } catch (error) {
        console.log('   ❌ Chat test failed:', error.response?.data?.message || error.message);
        if (error.response?.status === 401) {
          console.log('   💡 Authentication token may have expired. Try logging in again.');
        }
      }
    }
    
    // Step 6: Test API Keys Configuration
    console.log('\n6️⃣  Testing API Keys Configuration...');
    const hasGeminiKey = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key';
    const hasHFKey = !!process.env.HF_API_KEY && process.env.HF_API_KEY !== 'your_huggingface_api_token';
    
    console.log(`   Gemini API Key: ${hasGeminiKey ? '✅ Set' : '❌ Not set'}`);
    console.log(`   Hugging Face API Key: ${hasHFKey ? '✅ Set' : '❌ Not set'}`);
    
    if (!hasGeminiKey && !hasHFKey) {
      console.log('   ⚠️  No API keys found. Add GEMINI_API_KEY or HF_API_KEY to .env');
    }
    
    // Step 7: Test Environment Variables
    console.log('\n7️⃣  Testing Environment Variables...');
    const requiredVars = ['SUPABASE_URL', 'SUPABASE_SERVICE_KEY', 'JWT_SECRET'];
    const optionalVars = ['GEMINI_API_KEY', 'HF_API_KEY', 'PORT'];
    
    console.log('   Required variables:');
    requiredVars.forEach(varName => {
      const isSet = !!process.env[varName];
      console.log(`      ${varName}: ${isSet ? '✅' : '❌'}`);
    });
    
    console.log('   Optional variables:');
    optionalVars.forEach(varName => {
      const isSet = !!process.env[varName];
      console.log(`      ${varName}: ${isSet ? '✅' : '⚠️  (optional)'}`);
    });
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ Testing complete!\n');
    
    // Summary
    console.log('📊 Summary:');
    console.log(`   - API Health: ✅`);
    console.log(`   - Authentication: ${authToken ? '✅' : '⚠️  (requires test user)'}`);
    console.log(`   - Bot Available: ${testBotId ? '✅' : '⚠️  (create a bot to test chat)'}`);
    console.log(`   - API Keys: ${hasGeminiKey || hasHFKey ? '✅' : '⚠️  (add API keys)'}`);
    // Step 8: Test Gemini API directly
    if (hasGeminiKey) {
      console.log('\n8️⃣  Testing Gemini API Connection...');
      try {
        const testMessage = "Say 'Hello' in one word";
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`;
        const testResponse = await axios.post(
          apiUrl,
          {
            contents: [{
              parts: [{
                text: testMessage
              }]
            }]
          },
          {
            headers: { 'Content-Type': 'application/json' },
            timeout: 10000
          }
        );
        
        if (testResponse.data.candidates && testResponse.data.candidates[0]) {
          const responseText = testResponse.data.candidates[0].content.parts[0].text;
          console.log(`   ✅ Gemini API: Working!`);
          console.log(`      Test response: "${responseText}"`);
        }
      } catch (error) {
        if (error.response?.status === 400) {
          console.log('   ⚠️  Gemini API: Key may be invalid or quota exceeded');
          console.log(`      Error: ${error.response?.data?.error?.message || error.message}`);
        } else if (error.response?.status === 404) {
          console.log('   ⚠️  Gemini API: Endpoint not found (check API key format)');
        } else {
          console.log(`   ⚠️  Gemini API: ${error.message}`);
        }
      }
    }
    
    console.log('\n💡 Next Steps:');
    if (!authToken) {
      console.log('   1. Create a test user or use existing credentials');
    }
    if (!testBotId && authToken) {
      console.log('   1. Create a chatbot with training data');
    }
    if (!hasGeminiKey && !hasHFKey) {
      console.log('   2. Add API keys to .env file');
    }
    if (testBotId && authToken) {
      console.log('   2. Test the chatbot in the UI');
      console.log('   3. Check backend logs for detailed information');
    }
    console.log('\n📖 For detailed testing guide, see: TEST_CHATBOT_GUIDE.md');
    
  } catch (error) {
    console.error('\n❌ Test failed with error:', error.message);
    console.error('   Full error:', error);
  }
}

// Run tests
testChatbotSystem()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

