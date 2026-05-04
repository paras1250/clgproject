require('dotenv').config();
const { getEmbeddings, cosineSimilarity } = require('./utils/embeddings');
const { chunkDocumentContent, findRelevantChunks } = require('./utils/documentProcessor');

async function testVectorSearch() {
    console.log('🧪 Testing Vector RAG Implementation (Gemini)...\n');

    if (!process.env.GEMINI_API_KEY) {
        console.error('❌ GEMINI_API_KEY is missing in .env');
        console.log('   Please add your Gemini API key to backend/.env to continue.');
        return;
    }

    // 1. Simulating Training Data
    const trainingText = "RocketAI offers a basic plan for $10/month and a pro plan for $50/month.";
    console.log('📝 Training Text:', trainingText);

    // 2. Generate Embeddings for Chunks
    console.log('🔄 Generating embeddings for chunks (text-embedding-004)...');
    const chunks = await chunkDocumentContent(trainingText); // Should return objects with embeddings
    console.log(`✅ Generated ${chunks.length} chunks.`);

    if (chunks.length > 0 && chunks[0].embedding) {
        console.log('   (Embedding vector present, length:', chunks[0].embedding.length, ')');
        if (chunks[0].embedding.length === 768) {
            console.log('   (Correct dimensions for text-embedding-004)');
        }
    } else {
        console.error('❌ Embedding generation failed! (Check API Key or Usage)');
        return;
    }

    // 3. Test Semantic Query (No keyword overlap)
    const query = "What is the price of the professional subscription?";
    console.log('\n🔎 Query:', query);

    // Note: "price" and "subscription" are NOT in the training text ("offers", "plan", "$50/month")
    // A keyword search would likely fail or score low. Vector search should succeed.

    const results = await findRelevantChunks(query, chunks, 1);

    console.log('\n🎯 Result:', results[0]);

    if (results.length > 0 && results[0].includes('$50/month')) {
        console.log('\n✅ SUCCESS: Vector search found the correct answer using semantic meaning!');
    } else {
        console.log('\n❌ FAILURE: Could not find relevant info.');
    }
}

testVectorSearch();
