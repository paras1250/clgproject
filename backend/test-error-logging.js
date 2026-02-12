// Test error logging mechanism
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const API_BASE_URL = 'http://localhost:5000';
const LOG_FILE = path.join(__dirname, 'debug-errors.log');

async function triggerError() {
    console.log('🧪 Triggering intentional error to test logging...');

    try {
        // Generate unique email
        const email = `test-${Date.now()}@test.com`;
        const password = 'TestPassword123';

        // Register new user
        console.log(`📝 Registering new user: ${email}`);
        try {
            await axios.post(`${API_BASE_URL}/api/auth/register`, {
                email,
                password,
                name: 'Test User'
            });
        } catch (e) {
            if (e.response?.status !== 409) throw e;
        }

        // Login
        const loginRes = await axios.post(`${API_BASE_URL}/api/auth/login`, {
            email,
            password
        });
        const token = loginRes.data.token;

        // Create a bot with an INVALID model name to force an error
        const FormData = require('form-data');
        const formData = new FormData();
        formData.append('name', 'Error Test Bot', { filename: 'blob', contentType: 'application/json' });
        formData.append('trainingText', 'This is a test');
        formData.append('modelName', 'invalid-model-name-to-force-error'); // <--- THIS CAUSES ERROR

        const createRes = await axios.post(`${API_BASE_URL}/api/bots/create`, formData, {
            headers: { ...formData.getHeaders(), 'Authorization': `Bearer ${token}` }
        });

        const embedCode = createRes.data.bot.embedCode;
        console.log(`✅ Created bot: ${embedCode}`);

        // Now chat with it - this should fail when calling the AI API
        console.log('🤖 Sending chat request (expecting failure)...');
        try {
            await axios.post(`${API_BASE_URL}/api/bots/embed/${embedCode}/chat`, {
                message: 'Hello',
                sessionId: 'test-error'
            });
        } catch (chatErr) {
            console.log('✅ Caught expected chat error:', chatErr.response?.data?.error || chatErr.message);
        }

        // Check if log file exists
        if (fs.existsSync(LOG_FILE)) {
            console.log('\n✅ Log file created successfully!');
            const content = fs.readFileSync(LOG_FILE, 'utf8');
            console.log('\n📄 Log File Content:');
            console.log(content);
            return true;
        } else {
            console.error('\n❌ Log file was NOT created!');
            return false;
        }

    } catch (err) {
        console.error('❌ Test failed behavior:', err.message);
        if (err.response) console.error(err.response.data);
        return false;
    }
}

triggerError();
