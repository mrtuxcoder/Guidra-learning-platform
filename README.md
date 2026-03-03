# 📘 Guidra — Structured AI Learning (V1)

Guidra is an AI-powered learning platform that converts any topic into a clear, structured learning path.  
Instead of unpredictable chatbot replies, Guidra delivers consistent mini-lessons, progress tracking, and cached content you can revisit anytime.

🚀 **Built for students and beginners who want clarity, not chaos.**

---

## 🎯 Core Idea

Most students use AI tools, but the learning experience is scattered:
- Different answer quality each time  
- No structure  
- No continuity  
- No saved progress  

Guidra fixes this by enforcing a strict lesson format and caching every piece of AI-generated content. You learn one topic at a time, step-by-step.

---

## ✨ Key Features (Current)

### 🔹 Modern UI/UX Flow
- Clean and responsive UI across desktop and mobile
- Unified flow: **Explore → Learn → Recall → Profile/Insights**
- Reduced friction in auth, topic selection, and subtopic navigation
- Password UX improvements (show/hide toggles and clearer success/error messages)

### 🔹 Structured Learning Content
Each subtopic is delivered in a predictable format:
- Core Concept  
- Detailed Explanation  
- Real-World Example  
- Mermaid Mind Map  
- Learning Steps  
- Practice  
- Quick Quiz

### 🔹 Recall Mode for Completed Topics
- Completed topics can be reopened in dedicated recall mode
- Recall starts from the beginning of the selected topic for revision
- Normal learning view prioritizes incomplete topics for active progress

### 🔹 Progress + Insights
Guidra tracks and surfaces:
- Topic and subtopic completion
- Understanding level (1–5)
- Quiz performance and analysis insights
- Completed-topic and completed-subtopic review signals

### 🔹 Global Daily Regeneration Control
- Daily regeneration is enforced globally
- Subtopic generation counts are tracked
- Cached content remains available when daily limit is reached

### 🔹 Content Caching + Version Access
- Generated content is cached for consistency and speed
- Multiple content versions can be accessed and reviewed
- Regeneration supports different teaching styles

### 🔹 Explore + Custom Topic Pipeline
- Curated topic library for fast onboarding
- Custom topic validation and generated subtopic roadmap
- Direct handoff into Learn flow with generated paths

### 🔹 Study Timer + Focus Workflow
- Built-in focus timer for study sessions
- Session completion cues integrated in-app
- Timer is available in primary navigation flow

### 🔹 Dark Mode + Theming
- Full light/dark mode support
- Consistent design tokens and theme-aware components

### 🔹 Navigation Architecture
- Clear top-level navigation for Learn, Explore, Custom Topic, Timer, and Profile
- Mobile-friendly navigation with optimized access patterns

---

## 🏗️ Tech Stack

**Frontend:** React, Vite, Material UI  
**Backend:** Node.js, Express  
**Database:** MongoDB  
**Auth:** JWT + Google OAuth  
**AI Models:** Gemini, Groq LLaMA models, HuggingFace inference  
**Deployment:** Vercel (Frontend), Render/Other (Backend)

---

## 📦 Upcoming Features (V2)

- Quiz scoring and analytics  
- Better personalization  
- Academic exam mode  
- Notes inside each lesson  
- Progress accuracy improvements  
- More regeneration controls  
- AI launcher-style study dashboard  

---

## 🧪 Why Guidra Exists

Students rely on AI more than ever, but current tools are:
- Random  
- Overwhelming  
- Hard to revisit  
- Not beginner-friendly  

Guidra solves these gaps by giving students **structured, predictable, and revisitable learning content** powered by multiple AI models.

---

## 👤 Author

Built by **George (Guganraj)**  
MCA student • MERN developer • Focused on solving real problems students face when learning with AI.

----

## 📜 License

MIT License