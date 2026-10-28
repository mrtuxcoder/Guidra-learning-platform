# Guidra — Structured AI Learning

Guidra is an AI-powered learning platform that converts any topic into a clear, structured learning path.  
Instead of unpredictable chatbot replies, Guidra delivers consistent mini-lessons, progress tracking, and cached content you can revisit anytime.

Built for students and beginners who want clarity, not chaos.

## 🚀 Docker Compose

The stack is split into three files:

- `docker-compose.yml` contains the shared application services (backend, frontend) and network.
- `docker-compose.override.yml` is loaded automatically for local development, spins up the local MongoDB container with healthchecks, and builds from source.
- `docker-compose.prod.yml` runs published production images without a local MongoDB container, connecting directly to MongoDB Atlas.

Containers are named `guidra-dev-*` in development and `guidra-prod-*` in production.

Environment files are intentionally git-ignored. Copy an example file before first use and keep secrets only in the copied file.

### Development

Copy the development template, fill in the required values, then start the full stack. Docker Compose reads server runtime configuration from this file; the client build reads `client/.env`.

```bash
cp .env.development.example .env.development
docker compose --env-file .env.development up --build
```

The frontend is available at `http://localhost` and the API at `http://localhost:5000`. To stop the local stack, run:

```bash
docker compose --env-file .env.development down
```

`CLIENT_URL` is the only browser origin allowed by the API's CORS policy and is also the Google OAuth redirect target. Use `http://localhost` for the Docker frontend. If the client is run directly with Vite, use `http://localhost:5173` instead.

### Production / GHCR image test

Copy the production template and set `BACKEND_IMAGE` and `FRONTEND_IMAGE` to the published GHCR image references. Also set production secrets and `CLIENT_URL` (for example, `https://guidra.tech`). The production command explicitly combines only the base and production files, so it does not use the local-development override.

If the GHCR packages are private, authenticate on the deployment host first:

```bash
docker login ghcr.io
```

Pull and start the production image stack:

```bash
cp .env.production.example .env.production
docker compose --env-file .env.production -f docker-compose.yml -f docker-compose.prod.yml pull
docker compose --env-file .env.production -f docker-compose.yml -f docker-compose.prod.yml up -d
```

Use a release or commit tag for `BACKEND_IMAGE` and `FRONTEND_IMAGE` rather than `latest` when deploying. To stop the stack while keeping MongoDB data, run:

```bash
docker compose --env-file .env.production -f docker-compose.yml -f docker-compose.prod.yml down
```

### Separate Development Servers

```bash
cd server && npm install && npm run dev
cd client && npm install && npm run dev
```

The server reads the root `.env.development` file. The client uses `client/.env` for `VITE_API_BASE_URL` when running Vite directly. Docker frontend builds use same-origin `/api/` requests, which Nginx proxies to the backend service.

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
- Generated content is cached in MongoDB per user, topic, and subtopic
- Cache hits avoid unnecessary AI provider calls
- Multiple content versions can be accessed and reviewed
- Regeneration supports different teaching styles
- Browser offline caching is limited to content-cache responses; authentication, progress, preferences, and profile data are not cached

### 🔹 Authentication and Account Security
- JWT authentication with local and Google OAuth sign-in
- Google-authenticated users can add or update an email-login password from **Settings**
- Password setup is presented inside Settings instead of a blocking popup
- Protected API routes require authentication

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

### 🔹 Production Runtime
- Route-level frontend code splitting keeps heavy learning and diagram code out of the initial page load
- API startup waits for MongoDB before accepting traffic
- `/health` reports database readiness for deployment health checks
- AI provider requests use timeouts and return a service-unavailable response when all providers fail
- Learning and content endpoints have rate limiting to protect expensive AI operations

---

## 🏗️ Tech Stack

**Frontend:** React, Vite, Material UI  
**Backend:** Node.js, Express  
**Database:** MongoDB  
**Auth:** JWT + Google OAuth  
**AI Models:** Gemini, Groq LLaMA models, HuggingFace inference  
**Deployment:** Docker Compose, Vercel (Frontend), Render/Other (Backend)

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
