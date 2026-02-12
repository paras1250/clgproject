const https = require('https');
const fs = require('fs');
const path = require('path');

// 1. Load .env manually to ensure we get the keys
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

const GEMINI_KEY = env.GEMINI_API_KEY;
const GROQ_KEY = env.GROQ_API_KEY;

console.log('🔑  API Check Script');
console.log('--------------------');
console.log(`Gemini Key Found: ${GEMINI_KEY ? 'Yes (' + GEMINI_KEY.substring(0, 4) + '...)' : '❌ NO'}`);
console.log(`Groq Key Found:   ${GROQ_KEY ? 'Yes (' + GROQ_KEY.substring(0, 4) + '...)' : '❌ NO'}`);
console.log('--------------------');

async function testGemini() {
    if (!GEMINI_KEY) return;
    console.log('\n🤖 Testing Gemini API...');

    const data = JSON.stringify({
        contents: [{ parts: [{ text: "Hello" }] }]
    });

    const options = {
        hostname: 'generativelanguage.googleapis.com',
        path: `/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    return new Promise((resolve) => {
        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', d => body += d);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    console.log('   ✅ Gemini API Success! (200 OK)');
                } else {
                    console.error(`   ❌ Gemini API Failed: ${res.statusCode}`);
                    console.error(`      Response: ${body}`);
                }
                resolve();
            });
        });
        req.on('error', (e) => {
            console.error(`   ❌ Connection Error: ${e.message}`);
            resolve();
        });
        req.write(data);
        req.end();
    });
}

async function testGroq() {
    if (!GROQ_KEY) return;
    console.log('\n⚡ Testing Groq API...');

    const data = JSON.stringify({
        model: "llama3-70b-8192",
        messages: [{ role: "user", content: "Hello" }]
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

    return new Promise((resolve) => {
        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', d => body += d);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    console.log('   ✅ Groq API Success! (200 OK)');
                    try {
                        const parsed = JSON.parse(body);
                        console.log('   Response:', parsed.choices[0]?.message?.content);
                    } catch (e) {
                        // ignore parse error for log
                    }
                } else {
                    console.error(`   ❌ Groq API Failed: ${res.statusCode}`);
                    console.error(`      Response: ${body}`);
                }
                resolve();
            });
        });
        req.on('error', (e) => {
            console.error(`   ❌ Connection Error: ${e.message}`);
            resolve();
        });
        req.write(data);
        req.end();
    });
}

async function run() {
    await testGemini();
    await testGroq();
}

run();
