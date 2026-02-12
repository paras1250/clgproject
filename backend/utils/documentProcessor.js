const fs = require('fs');
const path = require('path');
const { getEmbeddings, cosineSimilarity } = require('./embeddings');

/**
 * Extract text content from uploaded documents
 * Supports: PDF, DOC, DOCX, TXT files
 */
async function extractTextFromFile(filePath, fileType) {
  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error(`❌ File does not exist: ${filePath}`);
      return '';
    }

    const ext = path.extname(filePath).toLowerCase();
    console.log(`📄 Extracting text from: ${path.basename(filePath)} (${ext})`);

    if (ext === '.txt') {
      // Read plain text file
      const content = fs.readFileSync(filePath, 'utf-8');
      console.log(`✅ Extracted ${content.length} characters from TXT file`);
      return content;
    } else if (ext === '.pdf') {
      // For PDF extraction
      try {
        const pdfParse = require('pdf-parse');
        const fileStats = fs.statSync(filePath);
        const fileSizeMB = fileStats.size / (1024 * 1024);

        console.log(`  📊 PDF file size: ${fileSizeMB.toFixed(2)} MB`);

        // Skip very large PDFs to prevent memory issues
        if (fileSizeMB > 20) {
          console.error(`❌ PDF file is too large (${fileSizeMB.toFixed(2)} MB). Maximum size is 20 MB.`);
          return '';
        }

        // Read file
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdfParse(dataBuffer);
        const text = data.text || '';

        console.log(`✅ Extracted ${text.length} characters from PDF file`);
        return text;
      } catch (error) {
        console.error(`❌ Error extracting PDF content:`, error.message);
        return '';
      }
    } else if (ext === '.doc' || ext === '.docx') {
      // For DOC/DOCX extraction
      try {
        if (ext === '.docx') {
          const mammoth = require('mammoth');
          const result = await mammoth.extractRawText({ path: filePath });
          const text = result.value || '';
          console.log(`✅ Extracted ${text.length} characters from DOCX file`);
          return text;
        } else {
          console.warn(`⚠️  .DOC files are not supported. Please convert to .DOCX: ${path.basename(filePath)}`);
          return '';
        }
      } catch (error) {
        console.error(`❌ Error extracting DOCX content:`, error.message);
        return '';
      }
    } else {
      console.warn(`⚠️  Unsupported file type: ${ext}`);
      return '';
    }
  } catch (error) {
    console.error(`❌ Error extracting text from ${filePath}:`, error);
    return '';
  }
}

/**
 * Process and chunk document content for RAG
 * Note: Now returns objects with 'text' and 'embedding' (if possible)
 */
async function chunkDocumentContentWithEmbeddings(content, chunkSize = 1000, overlap = 200) {
  if (!content || content.trim().length === 0) {
    return [];
  }

  // Clean and normalize content
  const cleaned = content.replace(/\s+/g, ' ').trim();

  const chunks = [];
  let start = 0;
  const maxChunks = 50; // Limit chunks to prevent API rate limits/timeouts

  while (start < cleaned.length && chunks.length < maxChunks) {
    const end = Math.min(start + chunkSize, cleaned.length);
    const chunkText = cleaned.substring(start, end).trim();

    if (chunkText.length > 0) {
      // Generate embedding for this chunk
      // We process sequentially to avoid hitting API rate limits
      let embedding = null;
      try {
        embedding = await getEmbeddings(chunkText);
      } catch (e) {
        console.warn('Failed to generate embedding for chunk, using keyword matching fallback');
      }

      chunks.push({
        text: chunkText,
        embedding: embedding
      });
    }

    start = end - overlap;
    if (start >= cleaned.length) break;
  }

  return chunks;
}

/**
 * Legacy chunker for backward compatibility (returns just strings)
 */
function chunkDocumentContent(content, chunkSize = 1000, overlap = 200) {
  if (!content) return [];
  const cleaned = content.replace(/\s+/g, ' ').trim();
  const chunks = [];
  let start = 0;
  while (start < cleaned.length) {
    const end = Math.min(start + chunkSize, cleaned.length);
    chunks.push(cleaned.substring(start, end).trim());
    start = end - overlap;
  }
  return chunks;
}

/**
 * Find relevant chunks using Vector Similarity (or keyword callback)
 */
async function findRelevantChunks(query, allChunks, topK = 3) {
  if (!allChunks || allChunks.length === 0) return [];

  // 1. Generate embedding for query
  const queryEmbedding = await getEmbeddings(query);

  // 2. Score chunks
  const scoredChunks = allChunks.map(item => {
    // If we have vector embeddings, use Cosine Similarity
    if (queryEmbedding && item.embedding) {
      return {
        chunk: item.text || item, // Handle both object and string format
        score: cosineSimilarity(queryEmbedding, item.embedding)
      };
    }

    // Fallback: Keyword matching
    const chunkText = (item.text || item).toLowerCase();
    const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    let score = 0;
    queryWords.forEach(word => {
      if (chunkText.includes(word)) score += 1;
    });
    // Normalize score slightly to not overpower vectors if mixed
    return { chunk: item.text || item, score: score * 0.1 };
  });

  // 3. Sort and retrieve
  scoredChunks.sort((a, b) => b.score - a.score);
  return scoredChunks.slice(0, topK).map(item => item.chunk);
}

/**
 * Process documents for a bot
 */
/**
 * Process documents for a bot
 */
async function processDocumentsForBot(botId, files) {
  const Bot = require('../models/bot');
  const documentContents = [];

  for (const file of files) {
    try {
      console.log(`\n📦 Processing document: ${file.originalname || file.filename}`);
      const filePath = path.join(__dirname, '../uploads', file.filename);
      const textContent = await extractTextFromFile(filePath, file.mimetype);

      if (textContent && textContent.trim().length > 0) {
        console.log(`  generating embeddings... (this may take a moment)`);
        const chunksWithEmbeddings = await chunkDocumentContentWithEmbeddings(textContent);
        console.log(`  ✂️  Created ${chunksWithEmbeddings.length} vectorized chunks`);

        const docContent = {
          filename: file.filename,
          originalName: file.originalname,
          content: textContent,
          chunks: chunksWithEmbeddings, // Now contains { text, embedding } objects
          processedAt: new Date().toISOString()
        };

        documentContents.push(docContent);
      }
    } catch (error) {
      console.error(`  ❌ Error processing document ${file.filename}:`, error.message);
    }
  }

  // Save to DB
  if (documentContents.length > 0) {
    // Determine strictness: should we append or replace?
    // Current logic: Merge (append new, replace if same filename)

    // We need to fetch the bot first to get existing docs
    const bot = await Bot.findById(botId);
    if (bot) {
      const existing = bot.document_contents || [];
      const newDocsMap = new Map(documentContents.map(d => [d.filename, d]));

      // Remove old versions of these files if they exist, then add new ones
      const merged = existing.filter(d => !newDocsMap.has(d.filename)).concat(documentContents);

      bot.document_contents = merged;
      await bot.save();
      console.log(`✅ Saved ${documentContents.length} documents with embeddings to MongoDB`);
    } else {
      console.error(`❌ Bot ${botId} not found when saving documents`);
    }
  }

  return documentContents;
}

/**
 * Retrieve relevant context from bot's documents
 */
async function getRelevantContext(botId, query, topK = 3) {
  try {
    const Bot = require('../models/bot');
    const bot = await Bot.findById(botId).select('document_contents');

    if (!bot || !bot.document_contents) return null;

    // Flatten all chunks from all documents
    const allChunks = [];
    bot.document_contents.forEach(doc => {
      if (Array.isArray(doc.chunks)) {
        doc.chunks.forEach(chunk => {
          // Support both legacy (string) and new (object) chunks
          if (typeof chunk === 'string') {
            allChunks.push({ text: chunk, embedding: null });
          } else {
            allChunks.push(chunk);
          }
        });
      }
    });

    if (allChunks.length === 0) return null;

    const relevantTexts = await findRelevantChunks(query, allChunks, topK);
    return relevantTexts.join('\n\n').substring(0, 3000);

  } catch (error) {
    console.error('Error retrieving relevant context:', error);
    return null;
  }
}

module.exports = {
  extractTextFromFile,
  chunkDocumentContent: chunkDocumentContentWithEmbeddings, // Export the smart one as default
  findRelevantChunks,
  processDocumentsForBot,
  getRelevantContext
};

