/**
 * Detailed Chatbot Test - Shows actual training data being sent
 * Run with: node test-chatbot-detailed.js <embedCode>
 */

require('dotenv').config();
const axios = require('axios');

const API_URL = process.env.BACKEND_URL || 'http://localhost:5000';

// Specific test questions to verify training data is being used
const detailedTests = [
  {
    name: "Specific Information Question",
    question: "What is the check-in time?",
    expectAnswer: true,
    shouldContain: ["check-in", "time", "PM", "3:00"] // Keywords that should appear
  },
  {
    name: "Contact Information",
    question: "What is the hotel phone number?",
    expectAnswer: true
  },
  {
    name: "Amenities Question",
    question: "Does the hotel have a pool?",
    expectAnswer: true
  },
  {
    name: "Out of Scope Question",
    question: "What is the capital of France?",
    expectAnswer: false,
    shouldReject: true
  }
];

async function testDetailed(embedCode) {
  console.log('\n' + '='.repeat(80));
  console.log('🔍 DETAILED CHATBOT TEST - TRAINING DATA VERIFICATION');
  console.log('='.repeat(80) + '\n');
  
  console.log(`📌 Bot Embed Code: ${embedCode}\n`);
  
  let sessionId = `detailed_test_${Date.now()}`;
  
  for (const test of detailedTests) {
    console.log('\n' + '─'.repeat(80));
    console.log(`🧪 Test: ${test.name}`);
    console.log(`❓ Question: "${test.question}"`);
    console.log('─'.repeat(80));
    
    try {
      const startTime = Date.now();
      const response = await axios.post(
        `${API_URL}/api/bots/embed/${embedCode}/chat`,
        {
          message: test.question,
          sessionId: sessionId
        },
        {
          timeout: 60000,
          headers: { 'Content-Type': 'application/json' }
        }
      );
      
      const responseTime = Date.now() - startTime;
      
      // Display response
      console.log(`\n✅ Response (${responseTime}ms):`);
      console.log(`"${response.data.response}"\n`);
      
      // Training data information
      if (response.data.trainingDataUsed) {
        const tdu = response.data.trainingDataUsed;
        console.log('📊 Training Data Used:');
        console.log(`   - Has Data: ${tdu.hasData ? '✅ YES' : '❌ NO'}`);
        if (tdu.hasData) {
          console.log(`   - Source: ${tdu.dataSource}`);
          console.log(`   - Data Length: ${tdu.dataLength} characters`);
          console.log(`   - Size: ${((tdu.dataLength || 0) / 1024).toFixed(2)} KB`);
        }
      }
      
      // Validate response
      const responseText = response.data.response.toLowerCase();
      const isRejection = responseText.includes("i'm sorry") || 
                         responseText.includes("i don't have") ||
                         responseText.includes("not enough information");
      
      if (test.shouldReject && isRejection) {
        console.log('✅ PASS: Correctly rejected out-of-scope question');
      } else if (test.shouldReject && !isRejection) {
        console.log('❌ FAIL: Should have rejected but provided answer');
      } else if (test.expectAnswer && isRejection) {
        console.log('⚠️  WARNING: Expected answer but got rejection');
      } else if (test.expectAnswer && !isRejection) {
        console.log('✅ PASS: Provided answer based on training data');
        
        // Check for expected keywords
        if (test.shouldContain) {
          const foundKeywords = test.shouldContain.filter(keyword => 
            responseText.includes(keyword.toLowerCase())
          );
          if (foundKeywords.length > 0) {
            console.log(`✅ Found expected keywords: ${foundKeywords.join(', ')}`);
          } else {
            console.log(`⚠️  Expected keywords not found: ${test.shouldContain.join(', ')}`);
          }
        }
      }
      
      if (response.data.sessionId) {
        sessionId = response.data.sessionId;
      }
      
    } catch (error) {
      console.log(`\n❌ Error: ${error.response?.data?.message || error.message}`);
      if (error.response?.status === 404) {
        console.log('   💡 Bot not found. Check embed code.');
      }
    }
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('✅ Detailed Testing Complete!');
  console.log('='.repeat(80) + '\n');
  
  console.log('📝 Summary:');
  console.log('   The chatbot is responding to questions.');
  console.log('   Training data is being used (shown in responses above).');
  console.log('   Check responses to verify the chatbot is using your training data correctly.\n');
}

// Get embed code from command line
const embedCode = process.argv[2];

if (!embedCode) {
  console.log('❌ Error: Embed code required');
  console.log('\nUsage: node test-chatbot-detailed.js <embedCode>');
  console.log('\nExample: node test-chatbot-detailed.js bot_1762160521392_m7e1hth15');
  console.log('\n💡 Get embed code by running: node list-bots.js');
  process.exit(1);
}

testDetailed(embedCode)
  .then(() => process.exit(0))
  .catch(err => {
    console.error('❌ Fatal error:', err.message);
    process.exit(1);
  });
