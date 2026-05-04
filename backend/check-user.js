// check-user.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');

const checkUser = async () => {
  const email = 'admin@conversio.ai';
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('❌ MONGODB_URI not found in .env');
      process.exit(1);
    }
    
    await mongoose.connect(mongoUri);

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.log(`❌ User ${email} DOES NOT exist.`);
    } else {
      console.log(`✅ User found! Name: ${user.name}, Role: ${user.role}`);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
};

checkUser();
