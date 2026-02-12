const mongoose = require('mongoose');

const connectDB = async (url) => {
    try {
        // FAIL if no URL is provided (don't default to localhost anymore)
        if (!url) throw new Error('MONGODB_URI environment variable is not defined');

        const conn = await mongoose.connect(url);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('❌ MongoDB Connection Failed!');
        console.error(`Error Name: ${error.name}`);
        console.error(`Error Message: ${error.message}`);
        if (error.reason) console.error(`Reason: ${JSON.stringify(error.reason)}`);
        process.exit(1);
    }
};

module.exports = connectDB;
