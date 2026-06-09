// list-admins.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');

const listAdmins = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    await mongoose.connect(mongoUri);

    const admins = await User.find({ role: 'admin' });

    if (admins.length === 0) {
      console.log('No admins found.');
    } else {
      console.log('Admins:');
      admins.forEach(admin => {
        console.log(`- ${admin.name} (${admin.email})`);
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
};

listAdmins();
