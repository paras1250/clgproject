#!/bin/bash
# Test Script to Verify Training Data Fix

echo "🧪 Testing Training Data Fix"
echo "============================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "Step 1: Create a bot with custom training data"
echo "----------------------------------------"
echo "Training text: 'My company is TechCorp. We provide cloud services. Our CEO is John Smith.'"
echo ""

# You would POST to /api/bots/create with this data:
# {
#   "name": "TestBot",
#   "description": "Test bot for training data",
#   "modelName": "gemini-1.5-flash",
#   "trainingText": "My company is TechCorp. We provide cloud services. Our CEO is John Smith."
# }

echo "Step 2: After bot is created, check the database"
echo "----------------------------------------"
echo "SELECT document_contents FROM bots WHERE name = 'TestBot';"
echo ""
echo "✅ EXPECTED: document_contents should have:"
echo "  - type: 'text'"
echo "  - content: (full training text)"
echo "  - chunks: ARRAY of objects/strings (not empty, not Promise)"
echo ""
echo "❌ BUG (before fix): chunks would be: [{}] or Promise object"
echo ""

echo "Step 3: Test chatbot response"
echo "----------------------------------------"
echo "Question: 'What is the company name?'"
echo ""
echo "✅ EXPECTED: Bot should respond with 'TechCorp'"
echo "❌ BUG (before fix): Bot gives generic response, ignores training data"
echo ""

echo "=================================="
echo "Manual Testing Instructions:"
echo "=================================="
echo "1. Start backend: cd backend && npm start"
echo "2. Start frontend: cd frontend && npm run dev"
echo "3. Create a new bot with training text"
echo "4. Chat with the bot - ask about the training data content"
echo "5. Bot should answer using the custom training data"
echo ""
