const axios = require('axios');

// Use Google Gemini for embeddings
const EMBEDDING_MODEL = 'models/text-embedding-004';

/**
 * Generate embeddings for a given text using Google Gemini API
 * @param {string} text - The text to embed
 * @returns {Promise<number[]>} - The embedding vector (768 dimensions)
 */
async function getEmbeddings(text) {
    try {
        if (!text || text.trim().length === 0) return null;

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.warn('⚠️ GEMINI_API_KEY is missing');
            return null;
        }

        // Truncate text if slightly too long (Gemini has high limits but good to be safe)
        const processedText = text.substring(0, 2000);

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/${EMBEDDING_MODEL}:embedContent?key=${apiKey}`,
            {
                content: {
                    parts: [{ text: processedText }]
                }
            },
            {
                headers: { 'Content-Type': 'application/json' }
            }
        );

        if (response.data && response.data.embedding && response.data.embedding.values) {
            return response.data.embedding.values;
        }

        return null;
    } catch (error) {
        console.warn(`⚠️ Error generating embeddings (${EMBEDDING_MODEL}):`, error.message);
        if (error.response) {
            console.warn('   Status:', error.response.status);
            console.warn('   Data:', JSON.stringify(error.response.data));
        }
        return null; // Fallback
    }
}

/**
 * Calculate Cosine Similarity between two vectors
 * @param {number[]} vecA 
 * @param {number[]} vecB 
 * @returns {number} - Similarity score (-1 to 1)
 */
function cosineSimilarity(vecA, vecB) {
    if (!vecA || !vecB || vecA.length !== vecB.length) return 0;

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }

    if (normA === 0 || normB === 0) return 0;

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

module.exports = {
    getEmbeddings,
    cosineSimilarity
};
