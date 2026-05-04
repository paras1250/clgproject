const https = require('https');
const fs = require('fs');
const path = require('path');

// Load .env
const envPath = path.join(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split(/\r?\n/).forEach(line => {
    line = line.trim();
    if (!line || line.startsWith('#')) return;
    const idx = line.indexOf('=');
    if (idx !== -1) {
        const key = line.substring(0, idx).trim();
        const val = line.substring(idx + 1).trim();
        env[key] = val;
    }
});

const GROQ_KEY = env.GROQ_API_KEY;

if (!GROQ_KEY) {
    console.error('❌ GROQ_API_KEY not found in .env');
    process.exit(1);
}

console.log('⚡ Testing Groq API config...');
console.log('Key:', GROQ_KEY.substring(0, 8) + '...');

const data = JSON.stringify({
    model: "llama-3.3-70b-versatile", // Trying Llama 3.3
    messages: [
        { role: "system", content: "You are a test bot." },
        { role: "user", content: "Say 'Groq 3.3 working'." }
    ]
});

const options = {
    hostname: 'api.groq.com',
    path: '/openai/v1/chat/completions',
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${GROQ_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = https.request(options, (res) => {
    let body = '';
    res.on('data', d => body += d);
    res.on('end', () => {
        if (res.statusCode === 200) {
            console.log('✅ Groq API Connection Successful!');
            try {
                const parsed = JSON.parse(body);
                console.log('🤖 Response:', parsed.choices[0].message.content);
            } catch (e) {
                console.error('❌ Failed to parse response:', e.message);
            }
        } else {
            console.error(`❌ API Failed with status ${res.statusCode}`);
            console.error('Response:', body);
        }
    });
});

req.on('error', (e) => {
    console.error(`❌ Request Error: ${e.message}`);
});

req.write(data);
req.end();
