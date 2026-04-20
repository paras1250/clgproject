require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;
console.log('Connecting to:', uri ? uri.replace(/:([^@]+)@/, ':***@') : 'UNDEFINED');

mongoose.connect(uri).then(async (conn) => {
  console.log('✅ Connected to:', conn.connection.host);
  console.log('📦 Database:', conn.connection.name);

  const collections = await conn.connection.db.listCollections().toArray();
  console.log('\n📋 Collections found:', collections.length);

  for (const col of collections) {
    const count = await conn.connection.db.collection(col.name).countDocuments();
    console.log('  - ' + col.name + ': ' + count + ' documents');
  }

  // Sample data from each collection
  const User = require('./models/user');
  const Bot = require('./models/bot');
  const ChatLog = require('./models/chatlog');

  const users = await User.find({}).select('email name provider created_at').lean();
  console.log('\n👥 Users (' + users.length + '):');
  users.forEach(u => console.log('  - ' + u.email + ' | ' + u.name + ' | provider: ' + (u.provider || 'email')));

  const bots = await Bot.find({}).select('name description is_active embed_code model_name created_at').lean();
  console.log('\n🤖 Bots (' + bots.length + '):');
  bots.forEach(b => console.log('  - ' + b.name + ' | active: ' + b.is_active + ' | model: ' + b.model_name));

  const chatlogCount = await ChatLog.countDocuments();
  console.log('\n💬 Chat Logs: ' + chatlogCount + ' total sessions');

  process.exit(0);
}).catch(err => {
  console.error('❌ Connection Error:', err.message);
  process.exit(1);
});
