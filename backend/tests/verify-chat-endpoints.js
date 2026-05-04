
const axios = require('axios');
const API_URL = 'http://localhost:5000';

async function verify() {
    try {
        // 1. Login
        const login = await axios.post(`${API_URL}/api/auth/login`, {
            email: 'test@example.com',
            password: 'password123'
        });
        const token = login.data.token;
        console.log('Login success');

        // 2. Create Bot
        const FormData = require('form-data');
        const form = new FormData();
        form.append('name', 'Manual Verify Bot');
        form.append('modelName', 'google/flan-t5-large'); // Use valid model

        const create = await axios.post(`${API_URL}/api/bots/create`, form, {
            headers: { ...form.getHeaders(), Authorization: `Bearer ${token}` }
        });
        const botId = create.data.bot.id;
        console.log('Bot created:', botId);

        // 3. Chat (simulation of frontend)
        // Frontend sends: { message: "...", sessionId: undefined }
        // We strictly simulate this.
        try {
            const chat = await axios.post(`${API_URL}/api/bots/${botId}/chat`, {
                message: 'Hello',
                sessionId: undefined
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Chat response:', chat.data);
        } catch (err) {
            console.error('Chat failed:', err.response ? err.response.data : err.message);
        }

    } catch (e) {
        console.error(e);
    }
}

verify();
