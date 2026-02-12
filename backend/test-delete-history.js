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
    email: `test_del_hist_${Date.now()}@example.com`,
    password: 'password123',
    name: 'Delete History Tester'
};

async function testDeleteHistory() {
    console.log('🧪 Testing Delete History API...');

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
            name: `DelHistBot_${Date.now()}`,
            description: 'History delete test',
            modelName: 'google/flan-t5-large',
            trainingText: 'Delete history test.'
        }, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        const bot = createRes.data.bot;
        console.log(`   ✅ Bot created: ${bot.id}`);

        // 3. Create Session
        const sessionId = `del_session_${Date.now()}`;
        console.log(`3. Creating session: ${sessionId}`);
        await axiosInstance.post(`${API_URL}/api/bots/${bot.id}/chat`, {
            message: 'Hello!',
            sessionId: sessionId
        });

        // 4. Delete Session
        console.log('4. Deleting session...');
        const deleteRes = await axiosInstance.delete(`${API_URL}/api/bots/${bot.id}/conversations/${sessionId}`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });

        if (deleteRes.status === 200) {
            console.log('   ✅ Delete successful.');
        } else {
            console.error(`   ❌ Delete failed: ${deleteRes.status}`);
        }

    } catch (error) {
        console.error('❌ Test Failed:', error.message);
        if (error.response) console.error('   Data:', JSON.stringify(error.response.data));
    }
}

testDeleteHistory();
