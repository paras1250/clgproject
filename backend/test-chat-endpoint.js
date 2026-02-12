/**
 * Comprehensive Chat Endpoint Test
 * Tests the chat functionality with real API calls
 * Run with: node test-chat-endpoint.js [botId] [embedCode]
 */

require('dotenv').config();
const axios = require('axios');

const API_URL = process.env.BACKEND_URL || 'http://localhost:5000';

// Test cases
const testCases = [
  {
    name: "Simple greeting",
    message: "Hello",
    expectsContextBased: false
  },
  {
    name: "Question that should use training data",
    message: "What information do you have?",
    expectsContextBased: true
  }
];

async function testChatEndpoint(botId, embedCode = null, authToken = null) {
  console.log('🧪 Testing Chat Endpoint...\n');
  console.log('='.repeat(70));
  
  if (!botId && !embedCode) {
    console.log('❌ Error: Please provide either botId or embedCode');
    console.log('Usage: node test-chat-endpoint.js <botId> [embedCode]');
    console.log('Or: node test-chat-endpoint.js --embed <embedCode>');
    return;
  }
  
  console.log(`\n📌 Testing with: ${botId ? `Bot ID: ${botId}` : `Embed Code: ${embedCode}`}\n`);
  
  for (const testCase of testCases) {
    console.log(`\n🔹 Test: ${testCase.name}`);
    console.log(`   Question: "${testCase.message}"`);
    
    try {
      let response;
      
      if (embedCode) {
        // Test embed endpoint
        response = await axios.post(
          `${API_URL}/api/bots/embed/${embedCode}/chat`,
          {
            message: testCase.message,
            sessionId: `test_${Date.now()}`
          },
          {
            timeout: 60000,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
      } else if (botId && authToken) {
        // Test authenticated endpoint
        response = await axios.post(
          `${API_URL}/api/bots/${botId}/chat`,
          {
            message: testCase.message,
            sessionId: `test_${Date.now()}`
          },
          {
            timeout: 60000,
            headers: {
              'Authorization': `Bearer ${authToken}`,
              'Content-Type': 'application/json'
            }
          }
        );
      } else {
        console.log('   ⚠️  Skipped: Need auth token for bot ID test');
        continue;
      }
      
      console.log(`   ✅ Response received`);
      console.log(`   Response: "${response.data.response?.substring(0, 150)}${response.data.response?.length > 150 ? '...' : ''}"`);
      
      if (response.data.trainingDataUsed) {
        const tdu = response.data.trainingDataUsed;
        console.log(`   📊 Training Data Usage:`);
        console.log(`      - Has Data: ${tdu.hasData ? '✅' : '❌'}`);
        if (tdu.hasData) {
          console.log(`      - Source: ${tdu.dataSource}`);
          console.log(`      - Length: ${tdu.dataLength} chars`);
        } else {
          console.log(`      - Message: ${tdu.message}`);
        }
      }
      
      // Validate response quality
      const responseText = response.data.response?.toLowerCase() || '';
      if (responseText.includes("i'm sorry") || responseText.includes("i don't have")) {
        console.log(`   ℹ️  Response indicates: Information not in training data`);
      } else if (responseText.trim().length > 10) {
        console.log(`   ✅ Response contains actual content`);
      }
      
    } catch (error) {
      console.log(`   ❌ Test failed: ${error.response?.data?.message || error.message}`);
      if (error.response?.status === 404) {
        console.log(`   💡 Bot not found. Make sure the bot ID or embed code is correct.`);
      } else if (error.response?.status === 401) {
        console.log(`   💡 Authentication failed. Need valid auth token.`);
      }
    }
  }
  
  console.log('\n' + '='.repeat(70));
  console.log('✅ Chat endpoint testing complete!\n');
}

// Get arguments
const args = process.argv.slice(2);
let botId = null;
let embedCode = null;

if (args.length > 0) {
  if (args[0] === '--embed' && args[1]) {
    embedCode = args[1];
  } else {
    botId = args[0];
    if (args[1] && !args[1].startsWith('--')) {
      embedCode = args[1];
    }
  }
}

// Run test
if (!botId && !embedCode) {
  console.log('📋 Chat Endpoint Test');
  console.log('\nUsage:');
  console.log('  node test-chat-endpoint.js <botId>              # Test with bot ID (needs auth)');
  console.log('  node test-chat-endpoint.js --embed <embedCode>  # Test with embed code');
  console.log('\nExample:');
  console.log('  node test-chat-endpoint.js bot_1234567890_abc');
  console.log('  node test-chat-endpoint.js --embed bot_1234567890_abc');
  process.exit(0);
}

testChatEndpoint(botId, embedCode)
  .then(() => process.exit(0))
  .catch(err => {
    console.error('\n❌ Test suite failed:', err);
    process.exit(1);
  });

