# 🚀 AI Interview Preparation Platform

An intelligent AI-powered mock interview platform that simulates real technical interviews, evaluates candidate responses using AI, and provides detailed structured feedback to improve interview performance.

---

## 📌 Overview

Technical interview preparation is difficult because candidates often lack:

- Real interview simulation  
- Instant personalized feedback  
- Company-specific preparation  
- Performance tracking over time  

This platform solves these problems by creating a production-grade AI interview environment where users can practice technical interviews, receive structured evaluation, and continuously improve.

---

## ✨ Key Features

### 🔐 Authentication System
- User Signup/Login
- JWT-based Authentication
- Protected Routes
- Secure Password Hashing using Bcrypt

### 🎯 Smart Interview Generation
Users can configure interviews based on:
- Company (Google, Amazon, Microsoft, etc.)
- Role (SDE, Backend, Frontend)
- Difficulty Level
- Number of Questions

AI generates tailored technical interview questions.

### 🤖 AI Evaluation Engine
Each submitted answer is evaluated on:

- Technical Accuracy  
- Communication Skills  
- Depth of Explanation  
- Problem-Solving Approach  

### 📊 Performance Analytics
- Interview History  
- Score Tracking  
- Progress Monitoring  
- Improvement Suggestions  

### 🧠 AI Feedback System
Detailed feedback includes:
- Strengths
- Weaknesses
- Missing Concepts
- Improvement Recommendations

---

# 🏛 High-Level Architecture

The platform follows a modular service-oriented architecture designed for scalability, maintainability, and reliable AI response handling.

```text
Client (React)
    │
    ▼
API Gateway (Express Middleware)
(Auth • Validation • Rate Limiting)
    │
    ▼
Core Services
├── Auth Service
├── Interview Service
├── Evaluation Service
└── Analytics Service
    │
    ▼
Data Layer + AI Layer
├── MongoDB Atlas
├── OpenAI / Gemini
└── Future: Vector DB + Embeddings (RAG)
```

---

# ⚙️ Question Generation Pipeline

The interview generation pipeline ensures structured, role-specific, and company-specific technical questions.

```text
Step 1 → User Input
(company, role, difficulty, questionCount)

Step 2 → Prompt Builder
- System Prompt
- Rules
- Output Schema

Step 3 → AI Service Call
Gemini / OpenAI
temperature: 0.8
response format: JSON

Step 4 → Raw AI Response
(question payload)

Step 5 → Response Parser
- Strip markdown
- Extract JSON
- Validate schema
- Sanitize output

Step 6 → Session Creation
Store structured interview session in MongoDB
```

---

# 🧠 Answer Evaluation Pipeline

Every candidate answer goes through a structured AI evaluation pipeline.

```text
Input → POST /interviews/:id/submit

1. Build Evaluation Prompt
   - Question context
   - Rubric
   - Scoring schema

2. AI Evaluation Call
   Model: Gemini / OpenAI
   Temperature: 0.3

3. Multi-Dimensional Scoring
   - Technical Accuracy
   - Communication
   - Depth of Explanation
   - Problem Solving

4. Response Parsing
   - Validate scores
   - Clamp scores (0–10)
   - Sanitize output

5. Store Evaluation
   Push result to session.evaluations[]
```

---

# 🏗 Backend Architecture

The backend follows a layered architecture with clear separation of concerns.

```text
Client
  │
  ▼
Routes Layer
  │
  ▼
Middleware Layer
(auth + validation + aiLimiter)
  │
  ▼
Controller Layer
(interviewController)
  │
  ▼
Service Layer
(aiService)
  │
  ├── promptBuilder
  ├── responseParser
  └── AI Provider (Gemini/OpenAI)
```

---

## 🛠 Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios
- React Router

### Backend
- Node.js
- Express.js
- JWT Authentication
- Bcrypt

### Database
- MongoDB
- Mongoose

### AI Integration
- OpenAI API / Gemini API

### Deployment
- Vercel
- Render
- MongoDB Atlas

---

# 📂 Core Backend Modules

```bash
backend/
├── controllers/
│   └── interviewController.js
│
├── services/
│   └── aiService.js
│
├── utils/
│   ├── promptBuilder.js
│   └── responseParser.js
│
├── models/
│   └── Session.js
│
├── routes/
│   └── interviewRoutes.js
```

---

# 🗄 Session Data Model

```javascript
{
  userId,
  company,
  jobRole,
  difficulty,
  status,

  questions: [
    {
      text,
      type,
      category,
      orderIndex
    }
  ],

  answers: [
    {
      questionIndex,
      answerText,
      submittedAt
    }
  ],

  evaluations: [
    {
      questionIndex,
      scores: {
        technical,
        communication,
        depth,
        overall
      },
      feedback,
      strengths,
      improvements
    }
  ]
}
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/your-username/ai-interview-platform.git
cd ai-interview-platform
```

---

### Backend Setup

```bash
cd backend
npm install
```

Create `.env`

```env
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
OPENAI_API_KEY=your_api_key
```

Run backend:

```bash
npm run dev
```

---

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

## 🔄 Workflow

### Step 1
User logs in

### Step 2
User selects:
- Company
- Role
- Difficulty

### Step 3
AI generates interview questions

### Step 4
User submits answer

### Step 5
AI evaluates answer

### Step 6
Results stored in database

---

## 📡 API Endpoints

### Auth Routes

```bash
POST /api/auth/signup
POST /api/auth/login
```

### Interview Routes

```bash
POST /api/interview/create
POST /api/interview/generate-question
POST /api/interview/submit-answer
GET  /api/interview/history
```

---

# 🔥 Engineering Highlights

- Modular service-oriented backend architecture  
- AI orchestration pipeline with prompt engineering  
- Structured JSON schema enforcement for AI outputs  
- Robust response parsing and sanitization  
- Multi-dimensional evaluation engine  
- Analytics-ready session data modeling  
- Production-grade validation and error handling  
- Rate limiting for AI API protection  

---

## 💡 Challenges Solved

- Designing scalable backend architecture  
- Building AI orchestration pipeline  
- Creating structured prompts for reliable outputs  
- Handling AI response parsing and sanitization  
- Designing analytics-ready data model  

---

# 🚀 Scalability Enhancements (Future Scope)

- Redis caching for repeated prompt responses  
- Queue-based AI evaluation using BullMQ  
- WebSocket-based live interview sessions  
- Voice-based interview mode  
- Speech-to-text integration  
- RAG-based company-specific preparation  
- Distributed analytics processing  

---

## 📈 Resume Impact

This project demonstrates strong understanding of:

- Full Stack Development  
- REST APIs  
- Authentication  
- Database Design  
- AI Integration  
- Backend Architecture  
- Scalable System Design  

---

## 👨‍💻 Author

**Manish Kumar Yadav**  
Electrical Engineering | NIT Jamshedpur  
Aspiring Software Engineer
