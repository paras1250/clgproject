const axios = require('axios');

async function testAuth() {
    try {
        const response = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'test@example.com',
            password: 'Test1234'
        });
        console.log('✅ Authentication successful!');
        console.log('Token:', response.data.token.substring(0, 20) + '...');
        return response.data.token;
    } catch (error) {
        console.error('❌ Authentication failed:');
        console.error('Status:', error.response?.status);
        console.error('Error:', error.response?.data?.error || error.message);
        return null;
    }
}

testAuth();
