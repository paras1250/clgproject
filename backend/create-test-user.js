/**
 * Create Default Test User Script
 * Run this script to create a test user for development/testing
 * 
 * Usage: node create-test-user.js
 */

require('dotenv').config();
const User = require('./models/user');
const connectDB = require('./db/connect');

async function createTestUser() {
  try {
    console.log('🔐 Creating default test user...\n');

    // Connect to database
    await connectDB(process.env.MONGODB_URI);

    const testUser = {
      email: 'test@example.com',
      password: 'Test1234', // Meets requirements: 8+ chars, uppercase, lowercase, number
      name: 'Test User'
    };

    // Check if user already exists
    const existingUser = await User.findByEmail(testUser.email);

    if (existingUser) {
      console.log('⚠️  Test user already exists!');
      console.log(`   Email: ${testUser.email}`);
      console.log(`   Name: ${existingUser.name}`);
      console.log(`   ID: ${existingUser.id}\n`);
      console.log('✅ You can use these credentials to login:');
      console.log(`   Email: ${testUser.email}`);
      console.log(`   Password: ${testUser.password}\n`);
      return;
    }

    // Create the user
    const user = await User.create(testUser);

    console.log('✅ Test user created successfully!\n');
    console.log('📋 Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   Email:    ${testUser.email}`);
    console.log(`   Password: ${testUser.password}`);
    console.log(`   Name:     ${user.name}`);
    console.log(`   ID:       ${user.id}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('💡 You can now login at: http://localhost:3000/login\n');
    console.log('🔒 Password meets requirements:');
    console.log('   ✓ At least 8 characters');
    console.log('   ✓ Contains uppercase letter');
    console.log('   ✓ Contains lowercase letter');
    console.log('   ✓ Contains number\n');

  } catch (error) {
    console.error('❌ Error creating test user:', error.message);

    if (error.message === 'User already exists') {
      console.log('\n💡 User already exists. Use the credentials above to login.');
    } else if (error.message.includes('Missing Supabase')) {
      console.log('\n⚠️  Make sure your Supabase environment variables are set in .env');
      console.log('   Required: SUPABASE_URL, SUPABASE_SERVICE_KEY');
    } else {
      console.log('\n⚠️  Check your database connection and try again.');
    }

    process.exit(1);
  }
}

// Run the script
createTestUser()
  .then(() => {
    console.log('✨ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });

