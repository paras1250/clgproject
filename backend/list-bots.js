/**
 * List all bots with their embed codes
 * Useful for finding bots to test with
 */

require('dotenv').config();
const supabase = require('./lib/supabase');

async function listBots() {
  console.log('🔍 Fetching bots from database...\n');
  
  try {
    const { data: bots, error } = await supabase
      .from('bots')
      .select('id, name, embed_code, is_active, model_name, created_at')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('❌ Error fetching bots:', error.message);
      process.exit(1);
    }
    
    if (!bots || bots.length === 0) {
      console.log('⚠️  No bots found in database.');
      console.log('💡 Create a bot first via the UI or API.');
      process.exit(0);
    }
    
    console.log(`✅ Found ${bots.length} bot(s):\n`);
    console.log('='.repeat(80));
    
    bots.forEach((bot, index) => {
      console.log(`\n${index + 1}. Bot: ${bot.name || 'Unnamed'}`);
      console.log(`   ID: ${bot.id}`);
      console.log(`   Embed Code: ${bot.embed_code}`);
      console.log(`   Model: ${bot.model_name || 'google/flan-t5-large'}`);
      console.log(`   Status: ${bot.is_active ? '✅ Active' : '❌ Inactive'}`);
      console.log(`   Created: ${new Date(bot.created_at).toLocaleString()}`);
    });
    
    console.log('\n' + '='.repeat(80));
    console.log('\n💡 To test a bot, use:');
    console.log(`   node test-chatbot-interactive.js <embed_code>`);
    console.log(`\nExample:`);
    if (bots.length > 0 && bots[0].is_active) {
      console.log(`   node test-chatbot-interactive.js ${bots[0].embed_code}`);
    }
    console.log('');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

listBots();
