# 📘 Guidra — Structured AI Learning Platform

<div align="center">

![Guidra Banner](https://img.shields.io/badge/Guidra-AI%20Learning%20Platform-blue?style=for-the-badge)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19.1.1-61dafb?style=flat-square&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=flat-square&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?style=flat-square&logo=mongodb)](https://www.mongodb.com/)

**An AI-powered learning platform that converts any topic into a clear, structured learning path.**

[Live Demo](#) • [Documentation](./docs) • [Report Bug](../../issues) • [Request Feature](../../issues)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#️-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Running the Application](#running-the-application)
- [Documentation](#-documentation)
- [Project Structure](#-project-structure)
- [API Overview](#-api-overview)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

---

## 🎯 Overview

Guidra is an innovative learning platform that addresses the scattered nature of AI-assisted learning. Instead of unpredictable chatbot replies, Guidra delivers:

✅ **Consistent mini-lessons** in a standardized format  
✅ **Progress tracking** to monitor your learning journey  
✅ **Smart caching** for revisitable content  
✅ **Personalized learning** based on your preferences and style  

🚀 **Built for students and beginners who want clarity, not chaos.**

### The Problem

Most students use AI tools, but face these challenges:
- 📉 Different answer quality each time
- 🔀 No structured learning path
- ⚠️ No continuity between sessions
- 💾 No way to save progress

### The Solution

Guidra fixes these issues by:
- 📝 Enforcing a strict, standardized lesson format
- 💾 Caching every AI-generated piece of content
- 📊 Tracking progress across topics and subtopics
- 🎯 Providing step-by-step learning paths

---

## ✨ Key Features

### 🔹 Structured Lessons
Each subtopic follows a consistent format:
- **Core Concept** — Quick understanding of the fundamentals
- **Detailed Explanation** — In-depth coverage
- **Real-World Example** — Practical applications
- **Mermaid Mind Map** — Visual representation
- **Learning Steps** — Actionable next steps
- **Practice Exercises** — Hands-on learning
- **Quick Quiz** — Test your understanding

### 🔹 Progress Tracking
Comprehensive tracking system:
- ✅ Topic and subtopic completion status
- 📊 Understanding level (1-5 scale)
- �� Quiz scores and analytics
- 📈 Completion percentages
- ⏱️ Last reviewed timestamps

### 🔹 Smart Caching
Efficient content management:
- 💾 Permanently stored lessons
- 🔄 No need to regenerate content
- ⚡ Instant access to previously learned material
- 🎨 Personalized based on learning style

### 🔹 Explore Library
- 📚 40+ curated foundational topics
- 🏷️ Organized by category (Math, Science, Programming, etc.)
- 🔍 Search functionality
- ⚡ Ready-to-learn content

### 🔹 Custom Topics (Beta)
Create your own learning paths:
1. Enter any beginner-friendly topic
2. AI validates the topic
3. Generates 10-15 subtopics
4. Creates structured lessons for each

### 🔹 Multi-Model AI Pipeline
Intelligent AI model selection:
- **Groq (LLaMA 3.3-70B)** — Primary model for high-quality content
- **Google Gemini 2.0** — Secondary fallback
- **HuggingFace Models** — Tertiary backup
- Automatic failover for reliability

### 🔹 Auto-Fix Features
- 🔧 Mermaid diagram syntax validation
- 🔄 Auto-regeneration for broken diagrams
- 🎨 Manual regeneration options (up to 3 times per subtopic)

---

## 🏗️ Tech Stack

### Frontend
- **Framework:** React 19.1.1
- **Build Tool:** Vite 7.1.7
- **UI Components:** Material-UI (MUI) 7.3.4
- **Routing:** React Router DOM 7.9.5
- **Styling:** Emotion CSS-in-JS
- **Diagrams:** Mermaid 10.6.1, Cytoscape 3.26.0
- **HTTP Client:** Axios 1.13.1
- **OAuth:** @react-oauth/google 0.12.2

### Backend
- **Runtime:** Node.js
- **Framework:** Express 5.1.0
- **Database:** MongoDB with Mongoose 8.19.1
- **Authentication:** 
  - JWT (jsonwebtoken 9.0.2)
  - Passport.js with Google OAuth 2.0
  - bcryptjs 3.0.2 for password hashing
- **HTTP Client:** Axios 1.13.1
- **Utilities:** 
  - cookie-parser 1.4.7
  - CORS 2.8.5
  - dotenv 17.2.3
  - leo-profanity 1.8.0 (content filtering)

### AI Services
- **Groq API** — LLaMA 3.3-70B (primary)
- **Google Gemini** — gemini-2.0-flash
- **HuggingFace** — Various models for fallback

### DevOps & Deployment
- **Frontend:** Vercel
- **Backend:** Render/Railway/Similar
- **Database:** MongoDB Atlas
- **Version Control:** Git & GitHub

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18.x or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git**

You'll also need API keys for:
- Google OAuth (Client ID & Secret)
- Groq API
- Google Gemini API
- HuggingFace Token

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mrtuxcoder/Guidra-learning-platform.git
   cd Guidra-learning-platform
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

### Configuration

1. **Server Environment Variables**

   Create a `.env` file in the `server` directory:
   ```bash
   cd server
   cp .env.example .env
   ```

   Edit `.env` and fill in your values:
   ```env
   # Server
   PORT=5000
   NODE_ENV=development
   
   # Database
   MONGODB_URI=mongodb://localhost:27017/guidra
   
   # JWT
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=7d
   
   # Google OAuth
   GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-client-secret
   GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback
   
   # AI API Keys
   GROQ_API_KEY=your-groq-api-key
   GEMINI_API_KEY=your-gemini-api-key
   HUGGINGFACE_TOKEN=your-huggingface-token
   
   # CORS
   CLIENT_URL=http://localhost:5173
   
   # Session
   SESSION_SECRET=your-session-secret
   ```

2. **Client Environment Variables**

   Create a `.env` file in the `client` directory:
   ```bash
   cd ../client
   cp .env.example .env
   ```

   Edit `.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api/v1
   VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   ```

### Running the Application

#### Development Mode

1. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

2. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```
   Server will run on `http://localhost:5000`

3. **Start the frontend** (in a new terminal)
   ```bash
   cd client
   npm run dev
   ```
   Client will run on `http://localhost:5173`

4. **Access the application**
   Open your browser and navigate to `http://localhost:5173`

#### Production Mode

1. **Build the client**
   ```bash
   cd client
   npm run build
   ```

2. **Start the server**
   ```bash
   cd server
   npm start
   ```

---

## 📚 Documentation

Comprehensive documentation is available in the `/docs` directory:

- **[Architecture Guide](./docs/ARCHITECTURE.md)** — System design and architecture overview
- **[API Documentation](./docs/API.md)** — Complete API reference
- **[Development Guide](./docs/DEVELOPMENT.md)** — Setup and development workflow
- **[Deployment Guide](./docs/DEPLOYMENT.md)** — Deployment instructions
- **[AI Integration](./docs/AI_INTEGRATION.md)** — AI models and prompt engineering
- **[Database Schema](./docs/DATABASE.md)** — MongoDB models and schemas
- **[User Guide](./docs/USER_GUIDE.md)** — End-user documentation
- **[Troubleshooting](./docs/TROUBLESHOOTING.md)** — Common issues and solutions

---

## 📁 Project Structure

```
Guidra-learning-platform/
├── client/                    # React frontend
│   ├── src/
│   │   ├── api/              # API integration layer
│   │   ├── assets/           # Static assets
│   │   ├── components/       # Reusable React components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── pages/            # Page components
│   │   ├── App.jsx           # Main app component
│   │   └── main.jsx          # Entry point
│   ├── .env.example          # Example environment variables
│   ├── package.json          # Frontend dependencies
│   └── vite.config.js        # Vite configuration
│
├── server/                    # Node.js backend
│   ├── configs/              # Configuration files
│   │   ├── db.js            # MongoDB connection
│   │   └── passport.js       # Passport.js setup
│   ├── controllers/          # Request handlers
│   │   ├── auth-controllers/
│   │   ├── content-controllers/
│   │   ├── curriculum-controllers/
│   │   └── progress-controllers/
│   ├── middlewares/          # Express middlewares
│   │   └── auth-middleware.js
│   ├── models/               # MongoDB schemas
│   │   ├── User.js
│   │   └── Content-cache.js
│   ├── prompts/              # AI prompts
│   │   └── content/          # Content generation prompts
│   ├── routes/               # API routes
│   │   └── v1/              # Version 1 routes
│   ├── utils/                # Utility functions
│   │   ├── call-AI.js       # AI integration
│   │   ├── cache-utils.js   # Caching logic
│   │   └── mermaid-utils.js # Diagram validation
│   ├── .env.example          # Example environment variables
│   ├── package.json          # Backend dependencies
│   └── server.js             # Server entry point
│
├── docs/                      # Documentation
├── .gitignore
├── .env.example              # Root environment example
└── README.md                 # This file
```

---

## 🔌 API Overview

Base URL: `http://localhost:5000/api/v1`

### Authentication
- `POST /auth/register` — Register new user
- `POST /auth/login` — Login with credentials
- `GET /auth/google` — Google OAuth initiation
- `GET /auth/google/callback` — Google OAuth callback
- `POST /auth/logout` — Logout user

### Learning
- `POST /learning/topics` — Generate subtopics for a topic
- `POST /learning/topics/validate` — Validate custom topic
- `GET /learning/topics/:topic/subtopics` — Get subtopic list
- `PUT /learning/preferences` — Update learning preferences

### Content
- `POST /content/teach` — Generate lesson (with caching)
- `POST /content/regenerate` — Regenerate lesson content
- `POST /content/component` — Generate specific component
- `GET /content/history` — Get content generation history
- `DELETE /content/clear` — Clear cached content

### Progress
- `GET /progress/` — Get user progress
- `PUT /progress/understanding` — Update understanding level
- `PUT /progress/quizzes` — Submit quiz marks
- `PUT /progress/completion` — Mark subtopic as complete

For complete API documentation, see [docs/API.md](./docs/API.md)

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](./CONTRIBUTING.md) for details.

### Quick Start
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code of Conduct
Please read our [Code of Conduct](./CODE_OF_CONDUCT.md) before contributing.

---

## 🔒 Security

For security concerns, please see our [Security Policy](./SECURITY.md).

---

## 📦 Upcoming Features (V2)

- [ ] Enhanced quiz scoring and analytics
- [ ] Better personalization algorithms
- [ ] Academic exam preparation mode
- [ ] In-lesson note-taking
- [ ] Progress accuracy improvements
- [ ] Advanced regeneration controls
- [ ] AI launcher-style study dashboard
- [ ] Mobile app (React Native)
- [ ] Collaborative learning features
- [ ] Export learning paths as PDF

---

## 🧪 Why Guidra Exists

Students rely on AI more than ever, but current tools are:
- 🎲 Random and inconsistent
- 😵 Overwhelming with information
- ❌ Hard to revisit and review
- 🚫 Not optimized for beginners

Guidra solves these gaps by providing **structured, predictable, and revisitable learning content** powered by multiple AI models with intelligent failover.

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**George (Guganraj)**  
MCA Student • MERN Stack Developer • AI Learning Enthusiast

- **Focus:** Solving real problems students face when learning with AI
- **GitHub:** [@mrtuxcoder](https://github.com/mrtuxcoder)
- **Email:** [Contact through GitHub](https://github.com/mrtuxcoder)

---

## 🙏 Acknowledgments

- Thanks to all contributors who have helped shape Guidra
- Powered by Groq, Google Gemini, and HuggingFace AI models
- Inspired by the need for better structured learning tools

---

<div align="center">

**[⬆ back to top](#-guidra--structured-ai-learning-platform)**

Made with ❤️ by [George (Guganraj)](https://github.com/mrtuxcoder)

</div>
