
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const connectDB = require('./db/connect');
const ChatLog = require('./models/chatlog');
const Bot = require('./models/bot');
const User = require('./models/user');

async function testChatLogHook() {
    try {
        console.log('🔌 Connecting to DB...');
        await connectDB(process.env.MONGODB_URI);
        console.log('✅ Connected.');

        // Find a valid bot
        const bot = await Bot.findOne({});
        if (!bot) throw new Error('No bot found');
        console.log(`🤖 Using bot: ${bot.id}`);

        // Create a NEW chat log to trigger pre('save')
        console.log('creating chatlog...');
        const chatLog = new ChatLog({
            bot: bot.id,
            bot_id: bot.id,
            session_id: `test_hook_${Date.now()}`,
            messages: [{ role: 'user', content: 'test hook' }]
        });

        try {
            await chatLog.save();
            console.log('✅ ChatLog saved successfully! Hook passed.');
        } catch (err) {
            console.error('❌ ChatLog save failed:', err.message);
            console.error('   Stack:', err.stack);
            if (err.message.includes('next is not a function')) {
                console.error('🚨 CONFIRMED: "next is not a function" error reproduced!');
            }
        }

    } catch (err) {
        console.error('Test script error:', err);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
}

testChatLogHook();
