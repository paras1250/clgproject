
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
        env[line.substring(0, idx).trim()] = line.substring(idx + 1).trim();
    }
});

const HF_KEY = env.HF_API_KEY;
console.log(`HF Key: ${HF_KEY ? 'Present' : 'Missing'}`);

async function probe(path, method = 'GET', body = null) {
    console.log(`\n🔎 Probing: ${method} https://router.huggingface.co${path}`);

    const options = {
        hostname: 'router.huggingface.co',
        path: path,
        method: method,
        headers: {
            'Authorization': `Bearer ${HF_KEY}`,
            'User-Agent': 'TestScript/1.0'
        }
    };

    if (body) {
        options.headers['Content-Type'] = 'application/json';
        options.headers['Content-Length'] = body.length;
    }

    return new Promise((resolve) => {
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', d => data += d);
            res.on('end', () => {
                console.log(`   Status: ${res.statusCode}`);
                console.log(`   Body: ${data.substring(0, 200)}`);
                resolve();
            });
        });
        req.on('error', e => {
            console.log(`   ❌ Error: ${e.message}`);
            resolve();
        });
        if (body) req.write(body);
        req.end();
    });
}

async function run() {
    // 1. Root
    await probe('/');

    // 2. Old API style
    await probe('/models/gpt2', 'POST', JSON.stringify({ inputs: "Hello" }));

    // 3. Old API style with google model
    await probe('/models/google/flan-t5-large', 'POST', JSON.stringify({ inputs: "Hello" }));

    // 4. OpenAI compatible (Phi-3)
    await probe('/v1/chat/completions', 'POST', JSON.stringify({
        model: "microsoft/Phi-3-mini-4k-instruct",
        messages: [{ role: "user", content: "Hello" }],
        max_tokens: 50
    }));
}

run();
