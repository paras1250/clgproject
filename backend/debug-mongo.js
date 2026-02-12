require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;
console.log('Testing connection to:', uri.replace(/:([^:@]+)@/, ':****@')); // Hide password in logs

mongoose.connect(uri)
    .then(() => {
        console.log('✅ MongoDB Connection Successful!');
        console.log('Database name:', mongoose.connection.name);
        console.log('Host:', mongoose.connection.host);
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ MongoDB Connection Failed:');
        console.error(err.message);
        process.exit(1);
    });
