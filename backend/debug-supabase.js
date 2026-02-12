const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

console.log('Testing Supabase Connection...');
console.log('URL:', process.env.SUPABASE_URL);
console.log('Key length:', process.env.SUPABASE_SERVICE_KEY ? process.env.SUPABASE_SERVICE_KEY.length : 'MISSING');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY, {
    auth: {
        persistSession: false
    }
});

async function testConnection() {
    try {
        console.log('Attempting native fetch to URL...');
        const res = await fetch(process.env.SUPABASE_URL);
        console.log('Native fetch status:', res.status);
    } catch (err) {
        console.error('Native fetch failed:', err);
        if (err.cause) console.error('Cause:', err.cause);
    }

    try {
        console.log('Attempting Supabase client request...');
        const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true });

        if (error) {
            console.error('Supabase client error:', error);
        } else {
            console.log('Supabase client success. Data:', data);
        }
    } catch (e) {
        console.error('Supabase client threw:', e);
    }
}

testConnection();
