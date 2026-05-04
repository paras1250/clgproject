/**
 * Interactive Chatbot Test Script
 * Tests chatbot with questions and shows training data being used
 * Run with: node test-chatbot-interactive.js [embedCode]
 */

require('dotenv').config();
const axios = require('axios');

const API_URL = process.env.BACKEND_URL || 'http://localhost:5000';

// Test questions to ask the chatbot
const testQuestions = [
  {
    name: "General Greeting",
    question: "Hello, how are you?",
    expectTrainingData: false
  },
  {
    name: "Question About Training Data",
    question: "What information do you have?",
    expectTrainingData: true
  },
  {
    name: "Specific Information Query",
    question: "Tell me about your knowledge base",
    expectTrainingData: true
  },
  {
    name: "Out of Context Question",
    question: "What is the weather today?",
    expectTrainingData: true,
    shouldReject: true // Should say "I don't have that information"
  },
  {
    name: "Direct Question",
    question: "What can you help me with?",
    expectTrainingData: true
  }
];

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  red: '\x1b[31m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function checkServerHealth() {
  try {
    const response = await axios.get(`${API_URL}/health`, { timeout: 5000 });
    log('✅ Backend server is running', 'green');
    log(`   Status: ${response.data.status}`, 'cyan');
    log(`   Database: ${response.data.database || 'Unknown'}`, 'cyan');
    return true;
  } catch (error) {
    log('❌ Backend server is not running', 'red');
    log(`   Error: ${error.message}`, 'yellow');
    log(`   💡 Make sure backend is running on ${API_URL}`, 'yellow');
    return false;
  }
}

async function findBotsWithEmbedCode() {
  // Try to query database directly for embed codes
  // Note: This requires direct Supabase access or authentication
  log('\n📋 Note: To test, you need either:', 'yellow');
  log('   1. An embed code from an existing bot', 'yellow');
  log('   2. Or create a bot first and note its embed code', 'yellow');
  return null;
}

async function testChatWithEmbedCode(embedCode) {
  log('\n' + '='.repeat(70), 'bright');
  log('🤖 TESTING CHATBOT WITH QUESTIONS', 'bright');
  log('='.repeat(70) + '\n', 'bright');
  
  log(`📌 Using Embed Code: ${embedCode}`, 'cyan');
  log(`🌐 API URL: ${API_URL}\n`, 'cyan');
  
  let sessionId = `test_session_${Date.now()}`;
  
  for (let i = 0; i < testQuestions.length; i++) {
    const testCase = testQuestions[i];
    log(`\n${'─'.repeat(70)}`, 'blue');
    log(`Test ${i + 1}/${testQuestions.length}: ${testCase.name}`, 'bright');
    log('─'.repeat(70), 'blue');
    log(`❓ Question: "${testCase.question}"`, 'yellow');
    
    try {
      const startTime = Date.now();
      
      const response = await axios.post(
        `${API_URL}/api/bots/embed/${embedCode}/chat`,
        {
          message: testCase.question,
          sessionId: sessionId
        },
        {
          timeout: 60000,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      const responseTime = Date.now() - startTime;
      
      // Display response
      log(`\n✅ Response received (${responseTime}ms):`, 'green');
      log(`\n"${response.data.response}"`, 'cyan');
      
      // Display training data information
      if (response.data.trainingDataUsed) {
        const tdu = response.data.trainingDataUsed;
        log(`\n📊 Training Data Information:`, 'magenta');
        log(`   Has Training Data: ${tdu.hasData ? '✅ YES' : '❌ NO'}`, tdu.hasData ? 'green' : 'red');
        
        if (tdu.hasData) {
          log(`   Data Source: ${tdu.dataSource || 'unknown'}`, 'cyan');
          log(`   Data Length: ${tdu.dataLength || 0} characters`, 'cyan');
          log(`   Approx. Size: ${((tdu.dataLength || 0) / 1024).toFixed(2)} KB`, 'cyan');
        } else {
          log(`   Message: ${tdu.message || 'No training data available'}`, 'yellow');
        }
      }
      
      // Validate response quality
      const responseText = (response.data.response || '').toLowerCase();
      const hasRejectionPhrase = responseText.includes("i'm sorry") || 
                                  responseText.includes("i don't have") ||
                                  responseText.includes("not enough information");
      
      if (testCase.shouldReject && hasRejectionPhrase) {
        log(`\n✅ Expected Behavior: Correctly rejected question not in training data`, 'green');
      } else if (testCase.shouldReject && !hasRejectionPhrase) {
        log(`\n⚠️  Warning: Should have rejected but provided an answer`, 'yellow');
      } else if (!testCase.shouldReject && hasRejectionPhrase) {
        log(`\n⚠️  Warning: Response indicates missing information, but question should be answerable`, 'yellow');
      } else {
        log(`\n✅ Response quality: Good`, 'green');
      }
      
      // Session ID
      if (response.data.sessionId) {
        sessionId = response.data.sessionId;
      }
      
    } catch (error) {
      log(`\n❌ Request failed:`, 'red');
      if (error.response) {
        log(`   Status: ${error.response.status}`, 'red');
        log(`   Message: ${error.response.data?.error || error.response.data?.message || 'Unknown error'}`, 'red');
        
        if (error.response.status === 404) {
          log(`   💡 Bot not found. Check if embed code is correct and bot is active.`, 'yellow');
        } else if (error.response.status === 401) {
          log(`   💡 Authentication error (shouldn't happen with embed endpoint)`, 'yellow');
        }
      } else {
        log(`   Error: ${error.message}`, 'red');
        if (error.code === 'ECONNREFUSED') {
          log(`   💡 Cannot connect to server. Is it running on ${API_URL}?`, 'yellow');
        } else if (error.code === 'ETIMEDOUT') {
          log(`   💡 Request timed out. Check server logs.`, 'yellow');
        }
      }
    }
  }
  
  log(`\n${'='.repeat(70)}`, 'bright');
  log('✅ Testing Complete!', 'bright');
  log('='.repeat(70) + '\n', 'bright');
}

async function getBotInfo(embedCode) {
  try {
    // Try to get bot info by making a test chat request
    // The embed endpoint will validate the bot exists
    log(`\n🔍 Checking bot information...`, 'cyan');
    
    const response = await axios.post(
      `${API_URL}/api/bots/embed/${embedCode}/chat`,
      {
        message: "test",
        sessionId: `info_check_${Date.now()}`
      },
      {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    log(`✅ Bot is active and responding`, 'green');
    if (response.data.trainingDataUsed) {
      const tdu = response.data.trainingDataUsed;
      log(`   Training Data: ${tdu.hasData ? 'Available ✅' : 'Not Available ❌'}`, tdu.hasData ? 'green' : 'yellow');
      if (tdu.hasData) {
        log(`   Data Size: ${((tdu.dataLength || 0) / 1024).toFixed(2)} KB`, 'cyan');
      }
    }
    return true;
  } catch (error) {
    if (error.response?.status === 404) {
      log(`❌ Bot not found or inactive`, 'red');
      log(`   Make sure the embed code is correct and the bot is active.`, 'yellow');
    } else {
      log(`⚠️  Could not verify bot: ${error.message}`, 'yellow');
    }
    return false;
  }
}

async function main() {
  log('\n' + '='.repeat(70), 'bright');
  log('🧪 INTERACTIVE CHATBOT TEST SCRIPT', 'bright');
  log('='.repeat(70) + '\n', 'bright');
  
  // Step 1: Check server health
  const isHealthy = await checkServerHealth();
  if (!isHealthy) {
    log('\n💡 Please start the backend server first:', 'yellow');
    log('   cd backend && npm start', 'cyan');
    process.exit(1);
  }
  
  // Step 2: Get embed code
  const args = process.argv.slice(2);
  let embedCode = args[0];
  
  if (!embedCode) {
    log('\n❌ Error: Embed code is required', 'red');
    log('\nUsage:', 'yellow');
    log('   node test-chatbot-interactive.js <embedCode>', 'cyan');
    log('\nExample:', 'yellow');
    log('   node test-chatbot-interactive.js bot_1234567890_abc', 'cyan');
    log('\n💡 To get an embed code:', 'yellow');
    log('   1. Create a bot via the UI or API', 'cyan');
    log('   2. Check the bot details to find the embed_code', 'cyan');
    log('   3. Or query database: SELECT embed_code FROM bots WHERE is_active = true LIMIT 1;', 'cyan');
    process.exit(1);
  }
  
  // Step 3: Verify bot exists
  await getBotInfo(embedCode);
  
  // Step 4: Run tests
  await testChatWithEmbedCode(embedCode);
  
  log('\n📝 Summary:', 'bright');
  log('   - All test questions were sent to the chatbot', 'cyan');
  log('   - Training data information is shown for each response', 'cyan');
  log('   - Check responses above to verify chatbot behavior', 'cyan');
  log('   - Watch backend console for detailed logs about data being sent', 'cyan');
  log('\n');
}

// Run main function
main()
  .then(() => process.exit(0))
  .catch(err => {
    log(`\n❌ Fatal error: ${err.message}`, 'red');
    console.error(err);
    process.exit(1);
  });
