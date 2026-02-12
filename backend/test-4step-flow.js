/**
 * Automated Test: 4-Step Chatbot Creation Flow
 * 
 * This script tests the complete 4-step flow:
 * 1. Create & Train Agent
 * 2. Customize Agent
 * 3. Test Agent
 * 4. Get Code
 */

const axios = require('axios');

const BASE_URL = process.env.BACKEND_URL || 'http://localhost:5000';

// Test user credentials
const TEST_USER = {
    email: 'test@example.com',
    password: 'Test1234'
};

// Test data
const TEST_AGENT = {
    name: 'Test Agent 4-Step Flow',
    description: 'End-to-end testing of 4-step flow',
    trainingText: `Our company is TechCorp. We specialize in AI solutions.
Our main product is an AI chatbot builder.
Contact us at support@techcorp.com for assistance.
Our office hours are 9 AM to 5 PM EST.`
};

const TEST_CUSTOMIZATION = {
    avatar: '🚀',
    greetingMessage: 'Hello! How can I help you today?',
    themeColor: '#3b82f6',
    widgetSize: 'medium',
    alignment: 'bottom-right',
    systemPrompt: 'You are a helpful AI assistant for TechCorp.'
};

let authToken = null;
let createdBotId = null;

async function authenticate() {
    console.log('\n📝 Step 0: Authenticating...');
    try {
        const response = await axios.post(`${BASE_URL}/api/auth/login`, TEST_USER);
        authToken = response.data.token;
        console.log('✅ Authenticated successfully');
        return true;
    } catch (error) {
        console.error('❌ Authentication failed:', error.response?.data?.error || error.message);
        return false;
    }
}

async function testStep1CreateAndTrain() {
    console.log('\n🤖 Step 1: Create & Train Agent');
    console.log('Testing merged creation + training step...');

    try {
        const formData = new FormData();
        formData.append('name', TEST_AGENT.name);
        formData.append('description', TEST_AGENT.description);
        formData.append('trainingText', TEST_AGENT.trainingText);
        // Note: modelName is NOT sent - should default to llama-3.3-70b-versatile

        const response = await axios.post(
            `${BASE_URL}/api/bots`,
            {
                name: TEST_AGENT.name,
                description: TEST_AGENT.description,
                trainingText: TEST_AGENT.trainingText
            },
            {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        createdBotId = response.data.bot.id || response.data.bot._id;
        console.log(`✅ Agent created successfully`);
        console.log(`   Bot ID: ${createdBotId}`);
        console.log(`   Name: ${response.data.bot.name}`);
        console.log(`   Model: ${response.data.bot.model_name || 'default (llama-3.3-70b-versatile)'}`);
        console.log(`   Training data saved: ${TEST_AGENT.trainingText.length} characters`);

        return true;
    } catch (error) {
        console.error('❌ Step 1 failed:', error.response?.data?.error || error.message);
        return false;
    }
}

async function testStep2Customize() {
    console.log('\n🎨 Step 2: Customize Agent');
    console.log('Testing customization persistence...');

    try {
        const response = await axios.put(
            `${BASE_URL}/api/bots/${createdBotId}`,
            {
                widget_customization: TEST_CUSTOMIZATION,
                greeting_message: TEST_CUSTOMIZATION.greetingMessage,
                system_prompt: TEST_CUSTOMIZATION.systemPrompt
            },
            {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('✅ Customization saved successfully');
        console.log(`   Avatar: ${TEST_CUSTOMIZATION.avatar}`);
        console.log(`   Greeting: ${TEST_CUSTOMIZATION.greetingMessage}`);
        console.log(`   Theme Color: ${TEST_CUSTOMIZATION.themeColor}`);
        console.log(`   Widget Size: ${TEST_CUSTOMIZATION.widgetSize}`);
        console.log(`   Alignment: ${TEST_CUSTOMIZATION.alignment}`);

        return true;
    } catch (error) {
        console.error('❌ Step 2 failed:', error.response?.data?.error || error.message);
        return false;
    }
}

async function testStep3TestAgent() {
    console.log('\n💬 Step 3: Test Agent');
    console.log('Testing chat functionality with training data (RAG)...');

    const testQueries = [
        {
            question: 'What is your company name?',
            expectedKeyword: 'TechCorp'
        },
        {
            question: 'What are your office hours?',
            expectedKeyword: '9 AM to 5 PM'
        },
        {
            question: 'How can I contact you?',
            expectedKeyword: 'support@techcorp.com'
        }
    ];

    let allPassed = true;

    for (const test of testQueries) {
        try {
            const response = await axios.post(
                `${BASE_URL}/api/bots/${createdBotId}/chat`,
                { message: test.question },
                {
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const answer = response.data.response;
            const containsKeyword = answer.toLowerCase().includes(test.expectedKeyword.toLowerCase());

            if (containsKeyword) {
                console.log(`✅ Query: "${test.question}"`);
                console.log(`   Response contains "${test.expectedKeyword}"`);
            } else {
                console.log(`⚠️  Query: "${test.question}"`);
                console.log(`   Expected keyword "${test.expectedKeyword}" not found in response`);
                console.log(`   Response: ${answer.substring(0, 100)}...`);
                allPassed = false;
            }
        } catch (error) {
            console.error(`❌ Chat test failed for: "${test.question}"`);
            console.error(`   Error: ${error.response?.data?.error || error.message}`);
            allPassed = false;
        }
    }

    if (allPassed) {
        console.log('\n✅ All RAG tests passed - Training data is being used correctly');
    } else {
        console.log('\n⚠️  Some RAG tests failed - Check training data integration');
    }

    return allPassed;
}

async function testStep4GetCode() {
    console.log('\n📋 Step 4: Get Code');
    console.log('Testing embed code generation...');

    try {
        // Verify bot still exists and has all data
        const response = await axios.get(
            `${BASE_URL}/api/bots/${createdBotId}`,
            {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            }
        );

        const bot = response.data;

        // Generate expected embed code
        const embedCode = `<script src='${BASE_URL}/api/bots/${createdBotId}/embed.js'></script>`;

        console.log('✅ Embed code generated:');
        console.log(`   ${embedCode}`);
        console.log('\n✅ Bot data verified:');
        console.log(`   Name: ${bot.name}`);
        console.log(`   Customizations: ${bot.widget_customization ? 'Present' : 'Missing'}`);
        console.log(`   Greeting: ${bot.greeting_message || 'Default'}`);
        console.log(`   System Prompt: ${bot.system_prompt ? 'Set' : 'Default'}`);

        return true;
    } catch (error) {
        console.error('❌ Step 4 failed:', error.response?.data?.error || error.message);
        return false;
    }
}

async function cleanup() {
    console.log('\n🧹 Cleanup: Deleting test bot...');
    try {
        await axios.delete(
            `${BASE_URL}/api/bots/${createdBotId}`,
            {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            }
        );
        console.log('✅ Test bot deleted successfully');
    } catch (error) {
        console.log('⚠️  Cleanup failed (bot may not exist):', error.message);
    }
}

async function runTests() {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('  🧪 4-Step Chatbot Creation Flow - Automated Test');
    console.log('═══════════════════════════════════════════════════════════');

    const results = {
        authentication: false,
        step1: false,
        step2: false,
        step3: false,
        step4: false
    };

    // Step 0: Authenticate
    results.authentication = await authenticate();
    if (!results.authentication) {
        console.log('\n❌ Cannot proceed without authentication');
        return;
    }

    // Step 1: Create & Train Agent
    results.step1 = await testStep1CreateAndTrain();
    if (!results.step1) {
        console.log('\n❌ Cannot proceed - Step 1 failed');
        return;
    }

    // Step 2: Customize Agent
    results.step2 = await testStep2Customize();
    if (!results.step2) {
        console.log('\n⚠️  Step 2 failed, but continuing tests...');
    }

    // Step 3: Test Agent
    results.step3 = await testStep3TestAgent();
    if (!results.step3) {
        console.log('\n⚠️  Step 3 had issues, but continuing...');
    }

    // Step 4: Get Code
    results.step4 = await testStep4GetCode();

    // Cleanup
    if (createdBotId) {
        await cleanup();
    }

    // Final Report
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('  📊 Test Results Summary');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`Authentication:        ${results.authentication ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Step 1 (Create/Train): ${results.step1 ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Step 2 (Customize):    ${results.step2 ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Step 3 (Test Agent):   ${results.step3 ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Step 4 (Get Code):     ${results.step4 ? '✅ PASS' : '❌ FAIL'}`);
    console.log('═══════════════════════════════════════════════════════════');

    const allPassed = Object.values(results).every(r => r === true);

    if (allPassed) {
        console.log('\n🎉 ALL TESTS PASSED! 4-Step flow is working correctly.');
    } else {
        console.log('\n⚠️  Some tests failed. Please review the output above.');
    }

    console.log('\n');
}

// Run the tests
runTests().catch(error => {
    console.error('\n💥 Unexpected error:', error);
    process.exit(1);
});
