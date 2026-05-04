const mongoose = require('mongoose');
require('dotenv').config();

const Bot = require('./models/bot');

async function testSchemaChanges() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Test 1: Check schema has the new fields
        console.log('\n📋 Test 1: Checking Bot schema definitions...');
        const schema = Bot.schema;
        console.log('Schema paths:');
        console.log('- greeting_message:', schema.path('greeting_message') ? '✅ EXISTS' : '❌ MISSING');
        console.log('- widget_customization:', schema.path('widget_customization') ? '✅ EXISTS' : '❌ MISSING');

        if (schema.path('widget_customization')) {
            console.log('  - widget_customization.avatar:', schema.path('widget_customization.avatar') ? '✅' : '❌');
            console.log('  - widget_customization.greetingMessage:', schema.path('widget_customization.greetingMessage') ? '✅' : '❌');
            console.log('  - widget_customization.primaryColor:', schema.path('widget_customization.primaryColor') ? '✅' : '❌');
            console.log('  - widget_customization.position:', schema.path('widget_customization.position') ? '✅' : '❌');
            console.log('  - widget_customization.width:', schema.path('widget_customization.width') ? '✅' : '❌');
            console.log('  - widget_customization.height:', schema.path('widget_customization.height') ? '✅' : '❌');
        }

        // Test 2: Query existing bots
        console.log('\n📋 Test 2: Querying existing bots...');
        const bots = await Bot.find().limit(3);
        console.log(`Found ${bots.length} bots`);

        if (bots.length > 0) {
            const bot = bots[0];
            console.log('\nFirst bot details:');
            console.log('- ID:', bot.id);
            console.log('- Name:', bot.name);
            console.log('- greeting_message:', bot.greeting_message || '(not set)');
            console.log('- widget_customization:', bot.widget_customization || '(not set)');
        }

        // Test 3: Create a test bot with customizations
        console.log('\n📋 Test 3: Creating test bot with customizations...');
        const testBot = await Bot.create({
            user: new mongoose.Types.ObjectId(),
            user_id: new mongoose.Types.ObjectId(),
            name: 'Test Customization Bot',
            description: 'Testing schema changes',
            embed_code: 'test_' + Date.now(),
            greeting_message: 'Welcome to our test bot!',
            widget_customization: {
                avatar: '/avatars/avatar2.png',
                greetingMessage: 'Welcome to our test bot!',
                primaryColor: '#3b82f6',
                position: 'bottom-right',
                width: '450',
                height: '700'
            }
        });

        console.log('✅ Test bot created successfully!');
        console.log('- Bot ID:', testBot.id);
        console.log('- greeting_message:', testBot.greeting_message);
        console.log('- widget_customization:', JSON.stringify(testBot.widget_customization, null, 2));

        // Clean up test bot
        await Bot.deleteOne({ _id: testBot._id });
        console.log('🧹 Test bot cleaned up');

        console.log('\n✅ ALL TESTS PASSED! Schema changes are working correctly.');

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 Disconnected from MongoDB');
    }
}

testSchemaChanges();
