/**
 * Diagnostic script to check document_contents in database
 * Run with: node check-document-contents.js [botId]
 */

require('dotenv').config();
const supabase = require('./lib/supabase');

async function checkDocumentContents(botId = null) {
  try {
    console.log('🔍 Checking document_contents in database...\n');
    
    let query = supabase
      .from('bots')
      .select('id, name, document_contents');
    
    if (botId) {
      query = query.eq('id', botId);
    }
    
    const { data: bots, error } = await query;
    
    if (error) {
      console.error('❌ Error fetching bots:', error);
      return;
    }
    
    if (!bots || bots.length === 0) {
      console.log('⚠️  No bots found in database');
      return;
    }
    
    console.log(`📊 Found ${bots.length} bot(s)\n`);
    
    bots.forEach(bot => {
      console.log(`\n🤖 Bot: ${bot.name} (ID: ${bot.id})`);
      console.log('─'.repeat(50));
      
      if (!bot.document_contents) {
        console.log('  ⚠️  document_contents: NULL or missing');
      } else if (Array.isArray(bot.document_contents)) {
        console.log(`  ✅ document_contents: Array with ${bot.document_contents.length} items`);
        
        bot.document_contents.forEach((doc, index) => {
          console.log(`\n  📄 Document ${index + 1}:`);
          console.log(`     Type: ${doc.type || 'document'}`);
          console.log(`     Filename: ${doc.filename || 'N/A'}`);
          console.log(`     Original Name: ${doc.originalName || 'N/A'}`);
          
          const contentLength = doc.content ? doc.content.length : 0;
          const chunksCount = doc.chunks ? (Array.isArray(doc.chunks) ? doc.chunks.length : 0) : 0;
          
          console.log(`     Content Length: ${contentLength} characters`);
          console.log(`     Chunks: ${chunksCount}`);
          
          if (contentLength === 0 && chunksCount === 0) {
            console.log(`     ⚠️  WARNING: No content or chunks!`);
          }
          
          if (doc.content) {
            const preview = doc.content.substring(0, 100);
            console.log(`     Content Preview: "${preview}${contentLength > 100 ? '...' : ''}"`);
          }
        });
      } else {
        console.log(`  ⚠️  document_contents: Not an array (type: ${typeof bot.document_contents})`);
        console.log(`     Value: ${JSON.stringify(bot.document_contents).substring(0, 200)}`);
      }
    });
    
    console.log('\n✅ Check complete!\n');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Get botId from command line argument
const botId = process.argv[2] || null;

checkDocumentContents(botId)
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

