// Quick verification script - checks if bot data can be saved and retrieved correctly
const mongoose = require('mongoose');
require('dotenv').config();

const Bot = require('./models/bot');

async function quickTest() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Create a test bot with all customizations
        console.log('📝 Creating test bot with customizations...');
        const testBot = await Bot.create({
            user: new mongoose.Types.ObjectId(),
            user_id: new mongoose.Types.ObjectId(),
            name: 'Customization Test Bot',
            description: 'Testing customization fields',
            embed_code: 'test_custom_' + Date.now(),
            greeting_message: 'Hello! Welcome to our support!',
            widget_customization: {
                avatar: '/avatars/avatar3.png',
                greetingMessage: 'Hello! Welcome to our support!',
                primaryColor: '#10b981',
                position: 'bottom-left',
                width: '450',
                height: '700',
                widgetSize: 'large'
            }
        });

        console.log('✅ Test bot created! ID:', testBot.id);
        console.log('\n📊 Saved Data:');
        console.log('  greeting_message:', testBot.greeting_message);
        console.log('  widget_customization:', JSON.stringify(testBot.widget_customization, null, 4));

        // Retrieve it back to verify
        console.log('\n🔍 Retrieving bot from database...');
        const retrieved = await Bot.findById(testBot._id);
        console.log('✅ Retrieved successfully!');
        console.log('\n📊 Retrieved Data:');
        console.log('  greeting_message:', retrieved.greeting_message);
        console.log('  widget_customization.avatar:', retrieved.widget_customization?.avatar);
        console.log('  widget_customization.primaryColor:', retrieved.widget_customization?.primaryColor);
        console.log('  widget_customization.greetingMessage:', retrieved.widget_customization?.greetingMessage);

        // Verify data matches
        const dataMatches =
            retrieved.greeting_message === testBot.greeting_message &&
            retrieved.widget_customization?.avatar === testBot.widget_customization.avatar &&
            retrieved.widget_customization?.primaryColor === testBot.widget_customization.primaryColor;

        if (dataMatches) {
            console.log('\n✅ SUCCESS! All customization fields saved and retrieved correctly!');
        } else {
            console.log('\n❌ FAIL! Data mismatch');
        }

        // Clean up
        await Bot.deleteOne({ _id: testBot._id });
        console.log('\n🧹 Test bot cleaned up');

    } catch (error) {
        console.error('\n❌ Error:', error.message);
    } finally {
        await mongoose.connection.close();
    }
}

quickTest();
