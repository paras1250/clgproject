require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

console.log('Testing Supabase Connection...');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseKey ? 'Found ✅' : 'Missing ❌');

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Credentials missing.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    try {
        // Try to select from 'users' table
        const { data, error } = await supabase.from('users').select('*').limit(1);

        if (error) {
            console.error('❌ Database Query Failed:');
            console.error('   Code:', error.code);
            console.error('   Message:', error.message);
            console.error('   Details:', error.details);
            console.error('   Hint:', error.hint);
        } else {
            console.log('✅ Connection Successful!');
            console.log('   Users found:', data.length);
        }
    } catch (err) {
        console.error('❌ Unexpected Error:', err);
    }
}

testConnection();
