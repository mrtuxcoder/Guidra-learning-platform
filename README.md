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

## ✨ Key Features (V1)

### 🔹 Structured Lessons
Each subtopic follows an identical format:
- Core Concept  
- Detailed Explanation  
- Real-World Example  
- Mermaid Mind Map  
- Learning Steps
- Practice
- Quick Quiz  

### 🔹 Progress Tracking
Guidra keeps track of:
- Your topics  
- Finished subtopics  
- Completion percentage  
- Your last visited subtopic  
- Quiz marks

### 🔹 Smart Caching  
Once a lesson is generated, it’s stored permanently.  
No inconsistency, no reruns.

### 🔹 Explore Library  
40 curated foundational topics ready to learn instantly.

### 🔹 Custom Topics (Beta)
Enter any beginner-friendly topic and Guidra:
1. Validates it (using external AI models)  
2. Creates a 10–15 subtopic learning path  
3. Generates structured lessons for each part  

### 🔹 Multi-Model AI Pipeline  
Guidra intelligently uses:
- **Gemini API** for validation and structured generation  
- **Groq (LLaMA family)** for lightweight checks  
- **HuggingFace models** for utility tasks like classification  

This keeps it fast and cost-efficient.

### 🔹 Auto-Fix Mermaid Diagrams  
If a mind map has syntax errors, Guidra auto-regenerates it and shows a manual regenerate option.

---

## 🏗️ Tech Stack

**Frontend:** React, Vite, Tailwind  
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

---

## 📜 License

MIT License