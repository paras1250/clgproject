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
    name: 'Test Delete User'
};

async function testDeleteBot() {
    console.log('🧪 Testing Delete Bot API...');

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
        console.log('2. Creating Bot to delete...');
        const createRes = await axiosInstance.post(`${API_URL}/api/bots/create`, {
            name: `DeleteMe_${Date.now()}`,
            description: 'A test bot to be deleted',
            modelName: 'google/flan-t5-large',
            trainingText: 'Delete test.'
        }, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        const bot = createRes.data.bot;
        console.log(`   ✅ Bot created: ${bot.id}`);

        // 3. Delete Bot
        console.log('3. Deleting Bot...');
        const deleteRes = await axiosInstance.delete(`${API_URL}/api/bots/${bot.id}`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });

        if (deleteRes.status === 200) {
            console.log('   ✅ Delete request successful.');
        } else {
            throw new Error(`Delete failed with status: ${deleteRes.status}`);
        }

        // 4. Verify Deletion (Get should fail)
        console.log('4. Verifying execution...');
        const getRes = await axiosInstance.get(`${API_URL}/api/bots/${bot.id}`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });

        if (getRes.status === 404) {
            console.log('   ✅ PASS: Bot not found (404) as expected.');
        } else {
            console.error(`   ❌ FAIL: Bot still exists (Status: ${getRes.status})`);
        }

    } catch (error) {
        console.error('❌ Test Failed:', error);
        if (error.code) console.error('   Code:', error.code);
        if (error.address) console.error('   Address:', error.address);
        if (error.port) console.error('   Port:', error.port);
        if (error.response) {
            console.error('   Status:', error.response.status);
            console.error('   Data:', JSON.stringify(error.response.data));
        }
    }
}

testDeleteBot();
