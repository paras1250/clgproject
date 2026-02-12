const axios = require('axios');

// Config
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';
// Disable SSL verification for development
const https = require('https');
const axiosInstance = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    }),
    validateStatus: function (status) {
        return status < 500; // Resolve only if the status code is less than 500
    }
});

let authToken = '';
const testUser = {
    email: `test${Date.now()}@example.com`,
    password: 'Password123!',
    name: 'Test Pirate'
};

async function testSystemPrompt() {
    console.log('🧪 Testing System Prompts (Persona) via API...');

    try {
        // 1. Register
        console.log('1. Authenticating...');
        let authRes = await axiosInstance.post(`${API_URL}/api/auth/register`, testUser);

        if (authRes.status !== 201 && authRes.status !== 200) {
            console.log(`   Register failed (${authRes.status}), trying login...`);
            authRes = await axiosInstance.post(`${API_URL}/api/auth/login`, {
                email: testUser.email,
                password: testUser.password
            });
        }

        if (authRes.status !== 200 && authRes.status !== 201) {
            throw new Error(`Auth failed: ${authRes.status} ${JSON.stringify(authRes.data)}`);
        }

        authToken = authRes.data.token;
        console.log('   ✅ Authenticated.');

        // 2. Create Bot with Pirate Persona (JSON)
        console.log('2. Creating Pirate Bot...');
        const botPayload = {
            name: `PirateBot_${Date.now()}`,
            description: 'A test bot',
            modelName: 'gemini-1.5-flash',
            systemPrompt: 'You are a helpful pirate. You always speak in pirate slang. You allow user to ask any question.',
            trainingText: 'This is a test bot.'
        };

        const createRes = await axiosInstance.post(`${API_URL}/api/bots/create`, botPayload, {
            headers: {
                Authorization: `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (createRes.status !== 201 && createRes.status !== 200) {
            throw new Error(`Create Bot failed: ${createRes.status} ${JSON.stringify(createRes.data)}`);
        }

        const bot = createRes.data.bot;
        console.log(`   ✅ Bot created: ${bot.id}`);

        // 3. Chat
        console.log('3. Chatting...');
        const chatRes = await axiosInstance.post(`${API_URL}/api/bots/${bot.id}/chat`, {
            message: 'Hello, who are you?'
        });

        if (chatRes.status !== 200) {
            throw new Error(`Chat failed: ${chatRes.status} ${JSON.stringify(chatRes.data)}`);
        }

        const reply = chatRes.data.reply;
        console.log(`   🤖 Reply: "${reply}"`);

        // 4. Verify
        const pirateKeywords = ['ahoy', 'matey', 'captain', 'ship', 'sea', 'arrr', 'treasure', 'yer', 'yarr'];
        const isPirate = pirateKeywords.some(keyword => reply.toLowerCase().includes(keyword));

        if (isPirate) {
            console.log('   ✅ PASS: Bot spoke like a pirate!');
        } else {
            console.warn('   ⚠️ WARNING: Bot did not strictly speak like a pirate. Check system prompt usage. Reply was: ' + reply);
        }

    } catch (error) {
        console.error('❌ Test Failed:', error.message);
        if (error.response) {
            console.error('   Data:', JSON.stringify(error.response.data));
        }
    }
}

testSystemPrompt();
