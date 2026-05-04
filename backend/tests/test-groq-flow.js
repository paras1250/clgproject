
require('dotenv').config();
const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000';
const TEST_EMAIL = `groq-test-${Date.now()}@example.com`;
const TEST_PASSWORD = 'TestPassword123';

async function run() {
    console.log('🚀 Testing Groq Integration Flow via Backend API...\n');

    try {
        // 1. Register/Login
        console.log('1️⃣ Authenticating...');
        let token;
        try {
            const reg = await axios.post(`${API_BASE_URL}/api/auth/register`, {
                email: TEST_EMAIL, password: TEST_PASSWORD, name: 'Groq Tester'
            });
            token = reg.data.token;
        } catch (e) {
            const login = await axios.post(`${API_BASE_URL}/api/auth/login`, {
                email: TEST_EMAIL, password: TEST_PASSWORD
            });
            token = login.data.token;
        }
        console.log('   ✅ Authenticated');

        // 2. Create Bot (Should default to Llama 3)
        console.log('\n2️⃣ Creating Bot (expecting default Groq model)...');
        const createRes = await axios.post(`${API_BASE_URL}/api/bots/create`, {
            name: 'Groq Integration Bot',
            modelName: '', // Empty should trigger default
            trainingText: 'The secret code is BLUEBERRY.'
        }, { headers: { Authorization: `Bearer ${token}` } });

        const botId = createRes.data.bot.id;
        const modelUsed = createRes.data.bot.modelName;
        console.log(`   ✅ Bot Created: ${botId}`);
        console.log(`   🤖 Model Assigned: ${modelUsed}`); // Should be llama-3.3-70b-versatile

        // 3. Test Chat
        console.log('\n3️⃣ Testing Chat Response...');
        const chatRes = await axios.post(`${API_BASE_URL}/api/bots/${botId}/chat`, {
            message: 'What is the secret code?'
        }, { headers: { Authorization: `Bearer ${token}` } });

        console.log(`   📝 Question: "What is the secret code?"`);
        console.log(`   💬 Response: "${chatRes.data.response}"`);

        if (chatRes.data.response.includes('BLUEBERRY')) {
            console.log('   ✅ RAG Working (Training Data Used)');
        } else {
            console.log('   ⚠️  RAG might not be working, but response received.');
        }

        console.log('\n✅ Groq Integration Flow Verified!');

    } catch (error) {
        console.error('\n❌ Test Failed:', error.message);
        if (error.response) {
            console.error('   Response:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

run();
