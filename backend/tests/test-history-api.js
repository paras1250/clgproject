const axios = require('axios');

// Config
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';
const https = require('https');
const axiosInstance = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    }),
    validateStatus: function (status) {
        return status < 500;
    }
});

let authToken = '';
const testUser = {
    email: `test${Date.now()}@example.com`,
    password: 'Password123!',
    name: 'Test History User'
};

async function testHistoryAPI() {
    console.log('🧪 Testing History API...');

    try {
        // 1. Authenticate
        console.log('1. Authenticating...');
        let authRes = await axiosInstance.post(`${API_URL}/api/auth/register`, testUser);
        if (authRes.status !== 201 && authRes.status !== 200) {
            authRes = await axiosInstance.post(`${API_URL}/api/auth/login`, {
                email: testUser.email,
                password: testUser.password
            });
        }
        authToken = authRes.data.token;
        console.log('   ✅ Authenticated.');

        // 2. Create Bot
        console.log('2. Creating Bot...');
        const createRes = await axiosInstance.post(`${API_URL}/api/bots/create`, {
            name: `HistoryBot_${Date.now()}`,
            description: 'A test bot for history',
            modelName: 'google/flan-t5-large', // Use simple model
            trainingText: 'History test bot.'
        }, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        const bot = createRes.data.bot;
        console.log(`   ✅ Bot created: ${bot.id}`);

        // 3. Create a Chat Session (Message 1)
        console.log('3. Sending Message 1...');
        const sessionId = `session_${Date.now()}`;
        await axiosInstance.post(`${API_URL}/api/bots/${bot.id}/chat`, {
            message: 'Hello!',
            sessionId: sessionId
        });

        // 4. Send Message 2
        console.log('4. Sending Message 2...');
        await axiosInstance.post(`${API_URL}/api/bots/${bot.id}/chat`, {
            message: 'How are you?',
            sessionId: sessionId
        });

        // 5. Fetch History
        console.log('5. Fetching History...');
        const historyRes = await axiosInstance.get(`${API_URL}/api/bots/${bot.id}/conversations`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });

        const conversations = historyRes.data.conversations;
        console.log(`   Fetched ${conversations.length} conversations.`);

        if (conversations.length > 0) {
            const conv = conversations.find(c => c.sessionId === sessionId);
            if (conv) {
                console.log(`   ✅ PASS: Found session ${sessionId}`);
                console.log(`   Messages count: ${conv.messages.length} (Expected >= 4, 2 user + 2 ai)`);
                if (conv.messages.length >= 4) {
                    console.log('   ✅ PASS: Message count looks correct.');
                } else {
                    console.warn('   ⚠️ WARNING: Message count low.');
                }
            } else {
                console.error('   ❌ FAIL: Session not found in history.');
            }
        } else {
            console.error('   ❌ FAIL: No conversations returned.');
        }

    } catch (error) {
        console.error('❌ Test Failed:', error.message);
        if (error.response) console.error('   Data:', JSON.stringify(error.response.data));
    }
}

testHistoryAPI();
