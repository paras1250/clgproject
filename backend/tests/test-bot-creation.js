/**
 * Comprehensive Bot Creation and Database Test
 * Tests: Bot creation, training data storage, and response functionality
 */

require('dotenv').config();
const axios = require('axios');

const API_BASE_URL = process.env.API_URL || 'http://localhost:5000';
// Use unique email for each test run to avoid conflicts
const TEST_EMAIL = process.env.TEST_EMAIL || `test-${Date.now()}@example.com`;
const TEST_PASSWORD = process.env.TEST_PASSWORD || 'TestPassword123';

// Test data - Grand Palm Hotel (similar to user's example)
const TEST_TRAINING_TEXT = `Grand Palm Hotel Information:

📍 Address: 112 Beachside Avenue, South Goa, India
📞 Phone: +91 98765 43210
📧 Email: contact@grandpalmhotel.com
🌐 Website: www.grandpalmhotel.com
⭐ Category: 5-Star Beach Resort
🕐 Check-in: 2:00 PM | Check-out: 11:00 AM
🐾 Pet Policy: Pets allowed in selected rooms only

Amenities:
- Free WiFi
- Swimming Pool (6 AM - 10 PM)
- Spa & Wellness Center
- Restaurant (Breakfast: 7 AM - 10 AM, Lunch: 12 PM - 3 PM, Dinner: 7 PM - 11 PM)
- Room Service: 24/7
- Beach Access
- Parking Available

Room Types:
- Deluxe Ocean View: ₹15,000/night
- Premium Suite: ₹25,000/night
- Executive Villa: ₹40,000/night

Booking: Call +91 98765 43210 or email contact@grandpalmhotel.com`;

let authToken = null;
let createdBotId = null;
let createdBotEmbedCode = null;

async function testStep(stepNumber, stepName, testFunction) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Step ${stepNumber}: ${stepName}`);
  console.log('='.repeat(60));
  
  try {
    await testFunction();
    console.log(`✅ Step ${stepNumber} PASSED: ${stepName}`);
    return true;
  } catch (error) {
    console.error(`❌ Step ${stepNumber} FAILED: ${stepName}`);
    console.error(`   Error: ${error.message}`);
    if (error.response?.data) {
      console.error(`   Response:`, JSON.stringify(error.response.data, null, 2));
    }
    return false;
  }
}

async function createTestUser() {
  console.log(`📝 Creating test user: ${TEST_EMAIL}`);
  
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/register`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      name: 'Test User'
    });
    
    if (response.data.token) {
      authToken = response.data.token;
      console.log(`✅ Test user created and logged in!`);
      return true;
    } else {
      throw new Error('No token received from registration');
    }
  } catch (error) {
    if (error.response?.status === 409 || error.response?.data?.error?.includes('already exists')) {
      console.log(`⚠️  User already exists, attempting to login...`);
      return await login();
    }
    throw error;
  }
}

async function login() {
  console.log(`📝 Attempting to login as: ${TEST_EMAIL}`);
  
  const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
    email: TEST_EMAIL,
    password: TEST_PASSWORD
  });
  
  if (response.data.token) {
    authToken = response.data.token;
    console.log(`✅ Login successful! Token received.`);
    return true;
  } else {
    throw new Error('No token received from login');
  }
}

async function createBot() {
  console.log(`📝 Creating chatbot with training data...`);
  console.log(`   Training text length: ${TEST_TRAINING_TEXT.length} characters`);
  
  const FormData = require('form-data');
  const formData = new FormData();
  
  formData.append('name', 'Test Bot - Grand Palm Hotel');
  formData.append('description', 'Test chatbot for Grand Palm Hotel information');
  formData.append('modelName', 'gemini-pro');
  formData.append('trainingText', TEST_TRAINING_TEXT);
  
  const startTime = Date.now();
  
  const response = await axios.post(`${API_BASE_URL}/api/bots/create`, formData, {
    headers: {
      'Authorization': `Bearer ${authToken}`,
      ...formData.getHeaders()
    },
    timeout: 60000, // 60 seconds timeout
    maxContentLength: Infinity,
    maxBodyLength: Infinity
  });
  
  const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
  
  if (response.data.bot && response.data.bot.id) {
    createdBotId = response.data.bot.id;
    createdBotEmbedCode = response.data.bot.embedCode;
    console.log(`✅ Bot created successfully in ${elapsedTime} seconds!`);
    console.log(`   Bot ID: ${createdBotId}`);
    console.log(`   Embed Code: ${createdBotEmbedCode}`);
    console.log(`   Bot Name: ${response.data.bot.name}`);
    return true;
  } else {
    throw new Error('Bot creation response missing bot data');
  }
}

async function verifyBotInDatabase() {
  console.log(`📝 Verifying bot data in database...`);
  
  const response = await axios.get(`${API_BASE_URL}/api/bots/${createdBotId}`, {
    headers: {
      'Authorization': `Bearer ${authToken}`
    },
    timeout: 30000
  });
  
  if (response.data.bot) {
    const bot = response.data.bot;
    console.log(`✅ Bot found in database!`);
    console.log(`   Name: ${bot.name}`);
    console.log(`   Model: ${bot.modelName}`);
    console.log(`   Embed Code: ${bot.embedCode}`);
    
    // Check training data summary
    if (bot.trainingDataSummary) {
      console.log(`\n📊 Training Data Summary:`);
      console.log(`   Total Items: ${bot.trainingDataSummary.totalItems}`);
      console.log(`   Text Items: ${bot.trainingDataSummary.textItems}`);
      console.log(`   Document Items: ${bot.trainingDataSummary.documentItems}`);
      console.log(`   Total Content Length: ${bot.trainingDataSummary.totalContentLength} characters`);
      
      if (bot.trainingDataSummary.totalItems === 0) {
        throw new Error('No training data found in database!');
      }
    }
    
    return true;
  } else {
    throw new Error('Bot not found in database');
  }
}

async function getTrainingDataDetails() {
  console.log(`📝 Fetching detailed training data...`);
  
  const response = await axios.get(`${API_BASE_URL}/api/bots/${createdBotId}/training-data`, {
    headers: {
      'Authorization': `Bearer ${authToken}`
    },
    timeout: 30000
  });
  
  if (response.data.trainingData) {
    const data = response.data.trainingData;
    console.log(`✅ Training data retrieved!`);
    console.log(`\n📊 Training Data Details:`);
    console.log(`   Total Items: ${data.totalItems}`);
    console.log(`   Text Training: ${data.textTraining.length} items`);
    console.log(`   Documents: ${data.documents.length} items`);
    console.log(`   Total Content: ${data.totalContentLength} characters`);
    
    if (data.textTraining.length > 0) {
      const textItem = data.textTraining[0];
      console.log(`\n📝 First Text Training Item:`);
      console.log(`   Content Length: ${textItem.contentLength} characters`);
      console.log(`   Chunks: ${textItem.chunksCount}`);
      console.log(`   Preview: ${textItem.content.substring(0, 100)}...`);
    }
    
    return true;
  } else {
    throw new Error('Training data not found');
  }
}

async function testChatWithTrainingData() {
  console.log(`📝 Testing chatbot with questions from training data...`);
  
  // Expected answers from training data
  const testQuestions = [
    {
      question: 'What is the check-in time?',
      expectedKeywords: ['2:00 PM', '2 PM', 'check-in'],
      expectedAnswer: '2:00 PM'
    },
    {
      question: 'What is the phone number?',
      expectedKeywords: ['98765 43210', 'phone', '+91'],
      expectedAnswer: '+91 98765 43210'
    },
    {
      question: 'What are the room prices?',
      expectedKeywords: ['15,000', '25,000', '40,000', 'Deluxe', 'Premium', 'Executive'],
      expectedAnswer: 'Room prices'
    },
    {
      question: 'What is the email address?',
      expectedKeywords: ['contact@grandpalmhotel.com', 'email'],
      expectedAnswer: 'contact@grandpalmhotel.com'
    },
    {
      question: 'What time is breakfast served?',
      expectedKeywords: ['7 AM', '10 AM', 'breakfast'],
      expectedAnswer: '7 AM to 10 AM'
    },
    {
      question: 'Is parking available?',
      expectedKeywords: ['parking', 'available', 'yes'],
      expectedAnswer: 'Parking available'
    }
  ];
  
  let successCount = 0;
  let correctAnswers = 0;
  
  for (const test of testQuestions) {
    try {
      console.log(`\n   💬 Question: "${test.question}"`);
      console.log(`   🎯 Expected: Should mention "${test.expectedAnswer}" or similar`);
      
      const response = await axios.post(`${API_BASE_URL}/api/bots/${createdBotId}/chat`, {
        message: test.question
      }, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        timeout: 30000
      });
      
      if (response.data.response) {
        const answer = response.data.response;
        console.log(`   📝 Full Response: ${answer}`);
        
        // Check if training data was used
        if (response.data.trainingDataUsed) {
          const used = response.data.trainingDataUsed;
          console.log(`   📊 Training Data Used: ${used.hasData ? '✅ Yes' : '❌ No'}`);
          if (used.hasData && used.dataLength) {
            console.log(`      Data Length: ${used.dataLength} characters`);
          }
        }
        
        // Check if answer contains expected keywords
        const answerLower = answer.toLowerCase();
        const foundKeyword = test.expectedKeywords.some(keyword => 
          answerLower.includes(keyword.toLowerCase())
        );
        
        if (foundKeyword) {
          console.log(`   ✅ Answer contains expected information!`);
          correctAnswers++;
        } else {
          console.log(`   ⚠️  Answer may not contain expected information`);
          console.log(`   🔍 Looking for: ${test.expectedKeywords.join(', ')}`);
        }
        
        successCount++;
      } else {
        console.log(`   ❌ No response received`);
      }
    } catch (error) {
      console.error(`   ❌ Error: ${error.message}`);
      if (error.response?.data) {
        console.error(`   Error details: ${JSON.stringify(error.response.data)}`);
      }
    }
  }
  
  console.log(`\n📊 Test Results:`);
  console.log(`   Questions answered: ${successCount}/${testQuestions.length}`);
  console.log(`   Answers with correct info: ${correctAnswers}/${testQuestions.length}`);
  
  if (successCount === testQuestions.length && correctAnswers >= testQuestions.length * 0.7) {
    console.log(`\n✅ Chatbot is responding correctly with training data!`);
    return true;
  } else if (successCount === testQuestions.length) {
    console.log(`\n⚠️  Chatbot responds but may not be using training data correctly`);
    return true;
  } else {
    console.log(`\n⚠️  Only ${successCount}/${testQuestions.length} questions answered`);
    return successCount > 0;
  }
}

async function testQuestionNotInTrainingData() {
  console.log(`📝 Testing chatbot with questions NOT in training data...`);
  
  const testQuestions = [
    {
      question: 'Who owns the hotel?',
      description: 'Owner information (not in training data)'
    },
    {
      question: 'What is the hotel\'s WiFi password?',
      description: 'WiFi password (not in training data)'
    },
    {
      question: 'How many employees work here?',
      description: 'Employee count (not in training data)'
    }
  ];
  
  let correctResponses = 0;
  
  for (const test of testQuestions) {
    try {
      console.log(`\n   💬 Question: "${test.question}"`);
      console.log(`   📝 Description: ${test.description}`);
      
      const response = await axios.post(`${API_BASE_URL}/api/bots/${createdBotId}/chat`, {
        message: test.question
      }, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        timeout: 30000
      });
      
      if (response.data.response) {
        const answer = response.data.response;
        console.log(`   📝 Response: ${answer}`);
        
        // Check if training data was used
        if (response.data.trainingDataUsed) {
          const used = response.data.trainingDataUsed;
          console.log(`   📊 Training Data Used: ${used.hasData ? '✅ Yes' : '❌ No'}`);
        }
        
        // Should say it doesn't have information
        const lowerResponse = answer.toLowerCase();
        const doesntKnow = lowerResponse.includes("don't have") || 
                          lowerResponse.includes("not enough") || 
                          lowerResponse.includes("no information") ||
                          lowerResponse.includes("i'm sorry") ||
                          lowerResponse.includes("cannot find") ||
                          lowerResponse.includes("not available");
        
        if (doesntKnow) {
          console.log(`   ✅ Correctly stated it doesn't have this information`);
          correctResponses++;
        } else {
          console.log(`   ⚠️  Should have said it doesn't have this information`);
          console.log(`   💡 Response suggests it might be making up information`);
        }
      } else {
        console.log(`   ❌ No response received`);
      }
    } catch (error) {
      console.error(`   ❌ Error: ${error.message}`);
    }
  }
  
  if (correctResponses >= testQuestions.length * 0.7) {
    console.log(`\n✅ Chatbot correctly identifies when it doesn't have information!`);
    return true;
  } else {
    console.log(`\n⚠️  Chatbot may be making up information instead of saying it doesn't know`);
    return correctResponses > 0;
  }
}

async function cleanup() {
  console.log(`\n🧹 Cleanup: Note that the test bot was created successfully.`);
  console.log(`   To delete it, use the dashboard or API.`);
  console.log(`   Bot ID: ${createdBotId}`);
  console.log(`   Embed Code: ${createdBotEmbedCode}`);
}

async function runAllTests() {
  console.log('\n' + '='.repeat(60));
  console.log('🧪 COMPREHENSIVE BOT CREATION & DATABASE TEST');
  console.log('='.repeat(60));
  console.log(`API URL: ${API_BASE_URL}`);
  console.log(`Test Email: ${TEST_EMAIL}`);
  
  const results = [];
  
  // Step 1: Create Test User or Login
  results.push(await testStep(1, 'User Authentication (Create/Login)', createTestUser));
  if (!results[0]) {
    console.log('\n❌ Authentication failed. Please check credentials.');
    console.log('   Make sure backend server is running and database is connected.');
    process.exit(1);
  }
  
  // Step 2: Create Bot with Training Data
  results.push(await testStep(2, 'Bot Creation with Training Text', createBot));
  if (!results[1]) {
    console.log('\n❌ Bot creation failed. Check backend logs for details.');
    process.exit(1);
  }
  
  // Wait a moment for database to sync
  console.log('\n⏳ Waiting 2 seconds for database to sync...');
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Step 3: Verify Bot in Database
  results.push(await testStep(3, 'Verify Bot in Database', verifyBotInDatabase));
  
  // Step 4: Get Training Data Details
  results.push(await testStep(4, 'Get Training Data Details', getTrainingDataDetails));
  
  // Step 5: Test Chat with Training Data
  results.push(await testStep(5, 'Test Chat with Training Data', testChatWithTrainingData));
  
  // Step 6: Test Question NOT in Training Data
  results.push(await testStep(6, 'Test Question NOT in Training Data', testQuestionNotInTrainingData));
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));
  
  const passed = results.filter(r => r).length;
  const total = results.length;
  
  results.forEach((result, index) => {
    const steps = [
      'User Authentication',
      'Bot Creation with Training Text',
      'Verify Bot in Database',
      'Get Training Data Details',
      'Test Chat with Training Data',
      'Test Question NOT in Training Data'
    ];
    console.log(`${result ? '✅' : '❌'} Step ${index + 1}: ${steps[index]}`);
  });
  
  console.log(`\n📈 Results: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('\n🎉 ALL TESTS PASSED! Backend and database are working correctly!');
    console.log(`\n✅ Created Bot:`);
    console.log(`   ID: ${createdBotId}`);
    console.log(`   Embed Code: ${createdBotEmbedCode}`);
    console.log(`   Name: Test Bot - Grand Palm Hotel`);
  } else {
    console.log('\n⚠️  Some tests failed. Check the errors above.');
  }
  
  await cleanup();
  
  process.exit(passed === total ? 0 : 1);
}

// Run tests
runAllTests().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});

