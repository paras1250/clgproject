// make-admin.js
// Run this script to elevate an existing user account to an Admin.
// Usage: node make-admin.js <email>

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');

const makeAdmin = async () => {
  const email = process.argv[2];

  if (!email) {
    console.error('❌ Please provide an email address.');
    console.log('Usage: node make-admin.js <email>');
    process.exit(1);
  }

  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('❌ MONGODB_URI not found in .env');
      process.exit(1);
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.error(`❌ User with email ${email} not found.`);
      console.log('Make sure you have registered this account on the website first.');
      process.exit(1);
    }

    user.role = 'admin';
    await user.save();

    console.log(`✅ Success! ${user.name} (${user.email}) is now an Admin.`);
    console.log('They can now access the Admin Panel from the dashboard dropdown.');
    
  } catch (error) {
    console.error('❌ Error updating user:', error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
};

makeAdmin();
