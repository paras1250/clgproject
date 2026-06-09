# Deep Technical Documentation: AI Chatbot Builder 🤖

This document provides a comprehensive, step-by-step deep dive into the implementation of the AI Chatbot Builder. It explains exactly how the code functions, which APIs are called at each stage, and how the data flows through the system.

---

## 1. High-Level Architecture

The system is built on a **Modular Micro-Monolith** architecture using the MERN stack:

- **Frontend (Next.js)**: Handles the Dashboard, Chat Builder UI, and Analytics.
- **Backend (Node.js/Express)**: Manages API endpoints, authentication, and the RAG engine.
- **AI Core**: Specialized logic for document processing and LLM orchestration.
- **Database (MongoDB)**: Stores relational data (Users, Bots) and unstructured data (Chat Logs, Document Chunks).

---

## 2. Authentication System: Step-by-Step

The authentication system uses **JWT (JSON Web Tokens)** for secure, stateless sessions.

### A. The Registration/Login Process (`backend/routes/auth.js`)
1. **Sanitization**: All inputs pass through `sanitizeRequestBody` and `sanitizeEmail` to prevent injection attacks.
2. **Password Hashing**: When a user registers, the `User` model (`backend/models/user.js`) uses a **pre-save hook** to hash the password using **Bcrypt**.
3. **JWT Generation**: Upon successful login, the server calls `generateToken(userId)`, which signs a JWT with a 7-day expiration using the `JWT_SECRET`.
4. **Token Storage**: The frontend receive the token and stores it in a secure cookie (`js-cookie`).

### B. Middleware Validation (`backend/middleware/auth.js`)
1. For protected routes (like `/api/bots/create`), the `authMiddleware` intercepts the request.
2. It extracts the token from the `Authorization` header (`Bearer <token>`).
3. It calls `jwt.verify()`. If valid, it fetches the user from MongoDB (excluding the password field) and attaches it to `req.user`.

---

## 3. Chatbot Training (RAG) System: The "Brain"

This is the most critical part of the project. It uses **Retrieval-Augmented Generation (RAG)** to "teach" the AI about your data.

### Step 1: Document Upload & Extraction (`backend/routes/chatbot.js`)
1. **Multer Middleware**: Handles the file upload to the `uploads/` directory.
2. **Text Extraction**: The `extractTextFromFile` function in `backend/utils/documentProcessor.js` detects the file type:
   - **PDF**: Uses `pdf-parse` to extract raw text.
   - **DOCX**: Uses `mammoth` to convert binary data into plain text.
   - **TXT**: Read directly via Node.js `fs` module.

### Step 2: Vectorization & Embedding (`backend/utils/embeddings.js`)
1. **Chunking**: The extracted text is split into small segments (chunks) using `chunkDocumentContentWithEmbeddings`. This ensures the AI doesn't get overwhelmed by too much text at once.
2. **Generating Vectors**: Each chunk is sent to the **Google Gemini Embedding API** (`models/text-embedding-004`).
3. **The Result**: The API returns a **768-dimension vector** (a list of numbers) that represents the *semantic meaning* of that specific chunk.
4. **Database Storage**: These chunks and their vectors are saved in the `document_contents` array inside the `Bot` document in MongoDB.

---

## 4. Chat Retrieval Flow: How it Works

When a user sends a message to the bot, the following logic executes in `backend/routes/chatbot.js`:

### Step 1: Context Retrieval (`getRelevantContext`)
1. **Query Vectorization**: The user's question is sent to the Gemini Embedding API to get its own vector.
2. **Cosine Similarity Search**: The system compares the question's vector against all stored chunk vectors using the `cosineSimilarity` mathematical formula.
3. **Retrieving Top Matches**: The top 3 chunks with the highest similarity score are selected as the "Context."

### Step 2: Augmenting the Prompt
The system creates a highly structured prompt for the LLM (Llama 3.3):
- **System Instruction**: "You are an AI assistant for [Bot Name]. Answer only using the context provided below."
- **Retrieved Context**: The 3 relevant chunks from Step 1.
- **User Question**: The actual message sent by the user.

### Step 3: LLM Completion (`callAIModelAPI`)
1. The augmented prompt is sent to the **Groq API** (using `llama-3.3-70b-versatile`).
2. Groq generates a response that is strictly grounded in your training data.
3. The response is saved to the `ChatLog` model in MongoDB for history and analytics.

---

## 5. The Widget & Integration Logic

The project allows any website to host your chatbot via an Iframe system.

### A. The Loader Script (`backend/routes/chatbot.js -> /:id/embed.js`)
- This is a dynamic JavaScript file generated per-bot.
- It creates a floating chat button on the host website.
- When clicked, it injects an `<iframe>` that loads the actual chat interface from your server.

### B. Iframe Communication
- The Iframe communicates with the parent window using `postMessage` to handle opening/closing events.
- This "Iframe Isolation" ensures that the chatbot's styles (CSS) never interfere with the design of the client's website.

---

## 6. Database Models Deep Dive

### User Model (`backend/models/user.js`)
- Stores name, email, hashed password, and role (user/admin).
- Handles OAuth providers (Google/GitHub).

### Bot Model (`backend/models/bot.js`)
- Stores bot configuration (theme, name, greeting).
- **CRITICAL FIELD**: `document_contents`. This is an array of objects containing the extracted text and its corresponding vector embeddings.

### ChatLog Model (`backend/models/chatlog.js`)
- Stores the entire conversation history between a user and a bot.
- Used for the "Analytics" dashboard to show engagement and common queries.

---

## 7. Security Implementations
- **CORS Configuration**: Restricts which websites can call your API.
- **Rate Limiting**: Uses `express-rate-limit` to prevent brute-force attacks on login and spamming the AI chat.
- **Helmet**: Adds security headers to prevent clickjacking and XSS.
- **Validation**: Uses strict schema validation via Mongoose to ensure data integrity.
