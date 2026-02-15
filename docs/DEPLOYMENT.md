# 🚀 Guidra Learning Platform - Deployment Guide

<div align="center">

![Deployment Guide](https://img.shields.io/badge/Deployment-Production%20Ready-success?style=for-the-badge)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=flat-square&logo=mongodb)](https://www.mongodb.com/atlas)
[![Vercel](https://img.shields.io/badge/Vercel-Frontend-black?style=flat-square&logo=vercel)](https://vercel.com)
[![Render](https://img.shields.io/badge/Render-Backend-46E3B7?style=flat-square&logo=render)](https://render.com)

**Complete guide to deploying Guidra Learning Platform to production**

</div>

---

## 📋 Table of Contents

1. [Overview](#-overview)
2. [Prerequisites](#-prerequisites)
3. [MongoDB Atlas Setup](#-mongodb-atlas-setup)
4. [Environment Variables](#-environment-variables)
5. [API Keys Setup](#-api-keys-setup)
6. [Google OAuth Configuration](#-google-oauth-configuration)
7. [Backend Deployment](#-backend-deployment)
   - [Render](#option-1-render-recommended)
   - [Railway](#option-2-railway)
   - [Heroku](#option-3-heroku)
8. [Frontend Deployment on Vercel](#-frontend-deployment-on-vercel)
9. [DNS and Domain Configuration](#-dns-and-domain-configuration)
10. [SSL/HTTPS Setup](#-sslhttps-setup)
11. [Post-Deployment Verification](#-post-deployment-verification)
12. [Monitoring and Maintenance](#-monitoring-and-maintenance)
13. [Performance Optimization](#-performance-optimization)
14. [Security Best Practices](#-security-best-practices)
15. [Troubleshooting](#-troubleshooting)

---

## 🎯 Overview

### Deployment Architecture

```
┌─────────────────────────────────────────────────────┐
│                     Internet                        │
└──────────────┬──────────────────────┬───────────────┘
               │                      │
               │                      │
        ┌──────▼──────┐        ┌──────▼──────┐
        │   Vercel    │        │   Render/   │
        │  (Frontend) │        │  Railway    │
        │   React +   │        │  (Backend)  │
        │    Vite     │        │  Express.js │
        └──────┬──────┘        └──────┬──────┘
               │                      │
               │                      │
               └──────────┬───────────┘
                          │
                   ┌──────▼──────┐
                   │   MongoDB   │
                   │    Atlas    │
                   │  (Database) │
                   └─────────────┘
```

### Deployment Strategy

- **Frontend**: Vercel (Zero-config React deployment with CDN)
- **Backend**: Render/Railway/Heroku (Node.js hosting with auto-deploy)
- **Database**: MongoDB Atlas (Managed MongoDB cluster)
- **CDN**: Cloudflare (Optional - DNS and security)
- **SSL**: Auto-provisioned by hosting providers

---

## 🔧 Prerequisites

### Required Accounts

1. **GitHub Account** (for code repository)
2. **MongoDB Atlas Account** (Free tier available)
3. **Vercel Account** (Free tier available)
4. **Render/Railway/Heroku Account** (Free/Hobby tier available)
5. **Google Cloud Console** (for OAuth)
6. **Domain Name** (Optional but recommended)

### Required API Keys

- ✅ Groq API Key
- ✅ Google Gemini API Key
- ✅ HuggingFace Token
- ✅ Google OAuth Client ID & Secret

### Local Requirements

```bash
Node.js >= 18.x
npm >= 9.x
Git >= 2.x
```

### Before You Start

- [ ] Code pushed to GitHub repository
- [ ] All dependencies installed and tested locally
- [ ] Environment variables documented
- [ ] Database backup (if migrating)

---

## 💾 MongoDB Atlas Setup

### Step 1: Create MongoDB Atlas Account

1. Go to [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
2. Sign up with Google or email
3. Complete the welcome survey (optional)

### Step 2: Create a New Cluster

1. Click **"Build a Database"**
2. Select **"M0 Free"** tier (512MB storage, free forever)
3. **Cloud Provider**: AWS, Google Cloud, or Azure (choose closest to your backend)
4. **Region**: Select region closest to your users (e.g., US-East-1, EU-West-1)
5. **Cluster Name**: `guidra-production`
6. Click **"Create"**

*Wait 1-3 minutes for cluster provisioning*

### Step 3: Configure Database Access

#### Create Database User

1. In **Security** → **Database Access**
2. Click **"Add New Database User"**
3. **Authentication Method**: Password
4. **Username**: `guidra-admin`
5. **Password**: Generate secure password (save it securely!)
   ```
   Example: 8xQ7#mP9$kL2@vN4
   ```
6. **Database User Privileges**: Select "Atlas admin" or "Read and write to any database"
7. Click **"Add User"**

#### Configure Network Access

1. Go to **Security** → **Network Access**
2. Click **"Add IP Address"**
3. For production backend:
   - **Option A (Recommended)**: Add specific IPs from your backend host
   - **Option B (Development)**: Click "Allow Access from Anywhere" (0.0.0.0/0)
     > ⚠️ **Security Note**: For production, restrict to specific IPs only
4. Click **"Confirm"**

### Step 4: Get Connection String

1. Click **"Connect"** on your cluster
2. Choose **"Connect your application"**
3. **Driver**: Node.js
4. **Version**: 4.1 or later
5. Copy the connection string:
   ```
   mongodb+srv://guidra-admin:<password>@guidra-production.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

6. **Replace `<password>`** with your actual password
7. **Add database name** after `.net/`:
   ```
   mongodb+srv://guidra-admin:8xQ7#mP9$kL2@vN4@guidra-production.xxxxx.mongodb.net/guidra?retryWrites=true&w=majority
   ```

### Step 5: Create Database and Collections

1. Go to **Browse Collections**
2. Click **"Add My Own Data"**
3. **Database Name**: `guidra`
4. **Collection Name**: `users`
5. Collections will be auto-created by Mongoose:
   - `users`
   - `learningpaths`
   - `lessons`
   - `progress`

### MongoDB Atlas Best Practices

```yaml
✅ Enable backup (Database → Backup)
✅ Set up monitoring alerts (Alerts → Add Alert)
✅ Create read-only user for analytics
✅ Regularly review access logs
✅ Update IP whitelist as needed
```

---

## 🔐 Environment Variables

### Backend Environment Variables (Production)

Create these in your hosting platform (Render/Railway/Heroku):

```bash
# Server Configuration
NODE_ENV=production
PORT=5000  # Usually auto-set by host

# Database
MONGODB_URI=mongodb+srv://guidra-admin:YOUR_PASSWORD@guidra-production.xxxxx.mongodb.net/guidra?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=GENERATE_LONG_RANDOM_STRING_HERE_AT_LEAST_32_CHARS
JWT_EXPIRES_IN=7d

# Google OAuth
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
GOOGLE_CALLBACK_URL=https://your-backend-domain.com/api/v1/auth/google/callback

# AI API Keys
GROQ_API_KEY=gsk_YOUR_GROQ_API_KEY
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
HUGGINGFACE_TOKEN=hf_YOUR_HUGGINGFACE_TOKEN

# Client URL (CORS)
CLIENT_URL=https://your-frontend-domain.vercel.app

# Session Secret
SESSION_SECRET=ANOTHER_LONG_RANDOM_STRING_AT_LEAST_32_CHARS
```

### Frontend Environment Variables (Vercel)

```bash
# API Base URL
VITE_API_URL=https://your-backend-domain.com/api/v1

# Google OAuth Client ID
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com
```

### Generate Secure Secrets

```bash
# On Linux/Mac
openssl rand -base64 32

# On Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Output example:
# 6f8a3d5e9b2c4f7a1e8d6b3c9f2a5e8b7c4f1a3d6e9b2c5f8a1d4e7b3c6f9a2
```

---

## 🔑 API Keys Setup

### 1. Groq API Key

**Groq** provides fast LLM inference for the learning path generation.

#### Steps:

1. Go to [https://console.groq.com/](https://console.groq.com/)
2. Sign up or log in
3. Navigate to **API Keys** section
4. Click **"Create API Key"**
5. **Name**: `Guidra Production`
6. Copy the key (starts with `gsk_`)
   ```
   gsk_abcdefghijklmnopqrstuvwxyz1234567890
   ```
7. Save it securely (you won't see it again!)

#### Models Used:
- `llama-3.1-70b-versatile` (primary)
- `mixtral-8x7b-32768` (fallback)

#### Rate Limits (Free Tier):
- 30 requests/minute
- 14,400 requests/day

---

### 2. Google Gemini API Key

**Gemini** is used for AI-powered content generation and enhancement.

#### Steps:

1. Go to [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
2. Sign in with Google Account
3. Click **"Create API Key"**
4. Select or create a Google Cloud project
5. Click **"Create API key in existing project"**
6. Copy the API key:
   ```
   AIzaSyABCDEFGHIJKLMNOPQRSTUVWXYZ1234567
   ```
7. Store securely

#### Models Used:
- `gemini-1.5-flash` (fast, cost-effective)
- `gemini-1.5-pro` (advanced reasoning)

#### Rate Limits (Free Tier):
- 15 requests/minute
- 1,500 requests/day

---

### 3. HuggingFace Token

**HuggingFace** provides embeddings and NLP models.

#### Steps:

1. Go to [https://huggingface.co/](https://huggingface.co/)
2. Sign up or log in
3. Click your profile → **Settings**
4. Navigate to **Access Tokens**
5. Click **"New token"**
6. **Name**: `Guidra Production`
7. **Role**: Read
8. Click **"Generate a token"**
9. Copy the token (starts with `hf_`)
   ```
   hf_abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGH
   ```

#### Models Used:
- `sentence-transformers/all-MiniLM-L6-v2` (embeddings)
- Various models via Inference API

---

## 🔒 Google OAuth Configuration

### Step 1: Create Google Cloud Project

1. Go to [https://console.cloud.google.com/](https://console.cloud.google.com/)
2. Click **"Select a project"** → **"New Project"**
3. **Project name**: `Guidra Learning Platform`
4. Click **"Create"**

### Step 2: Enable Google+ API

1. In your project, go to **APIs & Services** → **Library**
2. Search for **"Google+ API"**
3. Click **"Enable"**

### Step 3: Configure OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**
2. **User Type**: Select **"External"**
3. Click **"Create"**

#### App Information:
- **App name**: `Guidra Learning Platform`
- **User support email**: `your-email@example.com`
- **App logo**: Upload your logo (optional)

#### App Domain:
- **Application home page**: `https://your-domain.com`
- **Application privacy policy**: `https://your-domain.com/privacy`
- **Application terms of service**: `https://your-domain.com/terms`

#### Developer Contact:
- **Email**: `your-email@example.com`

4. Click **"Save and Continue"**

#### Scopes:
1. Click **"Add or Remove Scopes"**
2. Select:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
   - `openid`
3. Click **"Update"** → **"Save and Continue"**

#### Test Users (Development):
1. Add test user emails
2. Click **"Save and Continue"**

### Step 4: Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **"Create Credentials"** → **"OAuth client ID"**
3. **Application type**: **Web application**
4. **Name**: `Guidra Web Client`

#### Authorized JavaScript origins:
```
http://localhost:5173
https://your-frontend-domain.vercel.app
https://your-custom-domain.com
```

#### Authorized redirect URIs:
```
http://localhost:5000/api/v1/auth/google/callback
https://your-backend-domain.com/api/v1/auth/google/callback
https://api.your-custom-domain.com/api/v1/auth/google/callback
```

5. Click **"Create"**

### Step 5: Copy Credentials

You'll see a popup with:
```
Client ID: 1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
Client Secret: GOCSPX-abcdefghijklmnopqrstuvwx
```

**Save both securely!**

### Step 6: Publish OAuth App (Optional)

For production without "This app isn't verified" warning:

1. Go to **OAuth consent screen**
2. Click **"Publish App"**
3. Submit for verification (takes 1-2 weeks)

---

## 🚀 Backend Deployment

### Option 1: Render (Recommended)

**Pros**: Free tier, auto-deploy from GitHub, easy setup, includes HTTPS
**Cons**: Spins down after inactivity (free tier)

#### Step 1: Create Account
1. Go to [https://render.com/](https://render.com/)
2. Sign up with GitHub

#### Step 2: Create New Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect GitHub repository
3. Select **`Guidra-learning-platform`** repository

#### Step 3: Configure Service

```yaml
Name: guidra-backend
Region: Oregon (US West) # Choose closest to your users
Branch: main
Root Directory: server
Runtime: Node
Build Command: npm install
Start Command: npm start
```

#### Step 4: Select Plan
- **Free** (0$ spins down after 15 min inactivity)
- **Starter** ($7/mo, always on)

#### Step 5: Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add all variables from [Backend Environment Variables](#backend-environment-variables-production)

```bash
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-here
# ... (add all variables)
```

#### Step 6: Deploy
1. Click **"Create Web Service"**
2. Wait for build (2-5 minutes)
3. Your backend URL: `https://guidra-backend.onrender.com`

#### Step 7: Configure Auto-Deploy
1. Go to **Settings** → **Build & Deploy**
2. Enable **"Auto-Deploy"** (deploys on git push)

---

### Option 2: Railway

**Pros**: Generous free tier, PostgreSQL support, simple CLI
**Cons**: Newer platform, fewer regions

#### Step 1: Create Account
1. Go to [https://railway.app/](https://railway.app/)
2. Sign in with GitHub

#### Step 2: Create New Project
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose `Guidra-learning-platform`

#### Step 3: Configure Service
1. **Root Directory**: `server`
2. Railway auto-detects Node.js

#### Step 4: Add Environment Variables
1. Click **"Variables"** tab
2. Add all from [Backend Environment Variables](#backend-environment-variables-production)

#### Step 5: Configure Build
Create `nixpacks.toml` in `server/` directory:

```toml
[phases.setup]
nixPkgs = ['nodejs-18_x']

[phases.build]
cmds = ['npm install']

[start]
cmd = 'npm start'
```

#### Step 6: Deploy
1. Click **"Deploy"**
2. Your URL: `https://guidra-backend-production.up.railway.app`

#### Step 7: Custom Domain (Optional)
1. Go to **Settings** → **Networking**
2. Click **"Generate Domain"**
3. Or add custom domain

---

### Option 3: Heroku

**Pros**: Mature platform, extensive documentation, add-ons ecosystem
**Cons**: No free tier (minimum $5/mo)

#### Step 1: Install Heroku CLI

```bash
# macOS
brew tap heroku/brew && brew install heroku

# Ubuntu/Debian
curl https://cli-assets.heroku.com/install-ubuntu.sh | sh

# Windows
# Download from https://devcenter.heroku.com/articles/heroku-cli
```

#### Step 2: Login and Create App

```bash
# Login
heroku login

# Create app
heroku create guidra-backend

# Output: https://guidra-backend.herokuapp.com/
```

#### Step 3: Add Buildpack

```bash
cd server
heroku buildpacks:add heroku/nodejs
```

#### Step 4: Set Environment Variables

```bash
# Set all environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI="mongodb+srv://..."
heroku config:set JWT_SECRET="your-secret"
heroku config:set GOOGLE_CLIENT_ID="your-client-id"
heroku config:set GOOGLE_CLIENT_SECRET="your-secret"
heroku config:set GROQ_API_KEY="your-key"
heroku config:set GEMINI_API_KEY="your-key"
heroku config:set HUGGINGFACE_TOKEN="your-token"
heroku config:set CLIENT_URL="https://your-frontend.vercel.app"
heroku config:set SESSION_SECRET="your-session-secret"

# Verify
heroku config
```

#### Step 5: Create Procfile

Create `Procfile` in `server/` directory:

```
web: npm start
```

#### Step 6: Deploy

```bash
# From project root
cd server
git init # if not already a git repo
git add .
git commit -m "Deploy to Heroku"

# Add Heroku remote
heroku git:remote -a guidra-backend

# Deploy
git push heroku main

# Or deploy from main repo
git subtree push --prefix server heroku main
```

#### Step 7: Scale Dyno

```bash
heroku ps:scale web=1
```

#### Step 8: View Logs

```bash
heroku logs --tail
```

#### Step 9: Open App

```bash
heroku open
```

---

## 🎨 Frontend Deployment on Vercel

**Vercel is optimized for React/Vite applications with zero configuration.**

### Step 1: Create Vercel Account

1. Go to [https://vercel.com/signup](https://vercel.com/signup)
2. Sign up with GitHub

### Step 2: Import Project

1. Click **"Add New..."** → **"Project"**
2. Import `Guidra-learning-platform` from GitHub
3. Vercel auto-detects the repository

### Step 3: Configure Project

```yaml
Framework Preset: Vite
Root Directory: client
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

#### Override if needed:
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Step 4: Add Environment Variables

Click **"Environment Variables"**:

```bash
VITE_API_URL=https://guidra-backend.onrender.com/api/v1
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com
```

**Important**: All frontend env variables must start with `VITE_`

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait 1-3 minutes for build
3. Your site: `https://guidra-learning-platform.vercel.app`

### Step 6: Configure Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Click **"Add"**
3. Enter your domain: `guidra.com` or `www.guidra.com`
4. Follow DNS configuration instructions

### Step 7: Configure Build Settings

**Vercel automatically handles**:
- HTTPS/SSL certificates
- CDN distribution
- Automatic compression
- Cache optimization

### Step 8: Set Up Auto-Deploy

1. Go to **Settings** → **Git**
2. **Production Branch**: `main`
3. Enable **"Auto Deploy"**

Now every push to `main` auto-deploys!

### Step 9: Verify vercel.json

Ensure `client/vercel.json` exists:

```json
{
  "rewrites": [
    {
      "source": "/assets/(.*)",
      "destination": "/assets/$1"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This ensures React Router works correctly.

### Vercel CLI (Alternative Deployment)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy from client directory
cd client
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name: guidra-frontend
# - Directory: ./
# - Override settings? No

# Deploy to production
vercel --prod
```

---

## 🌐 DNS and Domain Configuration

### Using Vercel for Frontend + Custom Backend Domain

#### Scenario: 
- Frontend: `www.guidra.com` → Vercel
- Backend API: `api.guidra.com` → Render/Railway

### Step 1: Purchase Domain

Recommended registrars:
- **Namecheap** (affordable, good support)
- **Google Domains** (simple interface)
- **Cloudflare Registrar** (at-cost pricing)

### Step 2: Configure DNS Records

#### Option A: Using Cloudflare (Recommended)

1. **Add Site to Cloudflare**
   - Go to [https://dash.cloudflare.com/](https://dash.cloudflare.com/)
   - Click **"Add a Site"**
   - Enter your domain: `guidra.com`
   - Select **Free** plan
   - Click **"Add Site"**

2. **Update Nameservers at Registrar**
   - Cloudflare provides nameservers:
     ```
     dana.ns.cloudflare.com
     jim.ns.cloudflare.com
     ```
   - Update at your domain registrar
   - Wait 24-48 hours for propagation

3. **Add DNS Records in Cloudflare**

   | Type  | Name    | Target                              | Proxy Status  |
   |-------|---------|-------------------------------------|---------------|
   | CNAME | www     | cname.vercel-dns.com                | DNS only      |
   | CNAME | @       | cname.vercel-dns.com                | DNS only      |
   | CNAME | api     | guidra-backend.onrender.com         | Proxied (🧡)  |

4. **Configure in Vercel**
   - Go to Vercel project **Settings** → **Domains**
   - Add `guidra.com` and `www.guidra.com`
   - Vercel auto-verifies DNS

5. **Configure in Render**
   - Go to Render service **Settings** → **Custom Domains**
   - Add `api.guidra.com`
   - Render provides verification instructions

#### Option B: Direct DNS Configuration (No Cloudflare)

**For Namecheap/GoDaddy/Google Domains:**

| Type  | Host    | Value                               | TTL  |
|-------|---------|-------------------------------------|------|
| CNAME | www     | cname.vercel-dns.com                | Auto |
| CNAME | @       | cname.vercel-dns.com (or use A)     | Auto |
| CNAME | api     | guidra-backend.onrender.com         | Auto |

**Note**: Some registrars don't allow CNAME on root (@). Use A record instead:

| Type  | Host | Value           | TTL  |
|-------|------|-----------------|------|
| A     | @    | 76.76.21.21     | Auto |

(Get Vercel's IP from their docs or use `www` for primary domain)

### Step 3: Verify Configuration

```bash
# Check DNS propagation
nslookup www.guidra.com
nslookup api.guidra.com

# Check DNS from different locations
# Use https://www.whatsmydns.net/

# Expected results:
# www.guidra.com → Vercel IPs
# api.guidra.com → Render IPs
```

### Step 4: Update Environment Variables

**Backend (Render/Railway)**:
```bash
CLIENT_URL=https://www.guidra.com
GOOGLE_CALLBACK_URL=https://api.guidra.com/api/v1/auth/google/callback
```

**Frontend (Vercel)**:
```bash
VITE_API_URL=https://api.guidra.com/api/v1
```

**Google OAuth Console**:
- Update **Authorized JavaScript origins**: `https://www.guidra.com`
- Update **Redirect URIs**: `https://api.guidra.com/api/v1/auth/google/callback`

### Step 5: Redeploy

After updating environment variables:
1. Redeploy backend (Render auto-deploys)
2. Redeploy frontend (Vercel auto-deploys)

---

## 🔒 SSL/HTTPS Setup

### Automatic SSL (Handled by Platforms)

**Good news**: Vercel, Render, Railway, and Heroku automatically provision SSL certificates!

#### Vercel
- ✅ Auto-SSL via Let's Encrypt
- ✅ Automatically renews every 90 days
- ✅ Works for custom domains
- ✅ No configuration needed

#### Render
- ✅ Auto-SSL for `.onrender.com` domains
- ✅ Auto-SSL for custom domains
- ✅ Let's Encrypt certificates
- ✅ HTTP → HTTPS redirect enabled

#### Railway
- ✅ Auto-SSL for `.railway.app` domains
- ✅ Auto-SSL for custom domains
- ✅ Automatic renewal

#### Heroku
- ✅ Auto-SSL Automated Certificate Management (ACM)
- ✅ Free for all paid dynos
- ✅ Custom domains supported

### Forcing HTTPS

All platforms automatically redirect HTTP to HTTPS in production.

#### Additional Backend Configuration (Optional)

Add to `server/server.js`:

```javascript
// Force HTTPS in production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}
```

### SSL Verification

```bash
# Test SSL certificate
curl -I https://www.guidra.com
curl -I https://api.guidra.com

# Check SSL details
openssl s_client -connect www.guidra.com:443 -servername www.guidra.com

# Use SSL Checker tool
# https://www.ssllabs.com/ssltest/
```

### SSL Best Practices

```yaml
✅ Use HTTPS everywhere
✅ Enable HSTS (HTTP Strict Transport Security)
✅ Set secure cookie flags
✅ Monitor certificate expiration
✅ Use TLS 1.2+ only
```

---

## ✅ Post-Deployment Verification

### 1. Backend Health Check

```bash
# Test backend is running
curl https://api.guidra.com/health

# Expected response:
# {"status":"ok","timestamp":"2024-01-15T10:30:00.000Z"}

# Test API endpoint
curl https://api.guidra.com/api/v1/
```

### 2. Frontend Verification

1. Visit `https://www.guidra.com`
2. Check browser console for errors (F12)
3. Verify assets load (images, CSS, JS)
4. Test navigation between pages

### 3. Database Connection

```bash
# Check backend logs for MongoDB connection
# Render: Dashboard → Logs
# Railway: Click service → Logs tab
# Heroku: heroku logs --tail

# Look for:
# ✅ "MongoDB Connected successfully"
# ❌ "MongoDB connection error"
```

### 4. Google OAuth Flow

1. Go to login page
2. Click "Sign in with Google"
3. Verify redirect to Google
4. Sign in with test account
5. Verify redirect back to app
6. Check user profile loads

**Common Issues**:
- ❌ "Redirect URI mismatch" → Update Google Console URIs
- ❌ CORS error → Check `CLIENT_URL` env variable
- ❌ Cookie not set → Check `sameSite` cookie settings

### 5. API Keys Verification

Test each AI service:

```bash
# Test Groq API
curl -X POST https://api.guidra.com/api/v1/ai/test-groq \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Test Gemini API
curl -X POST https://api.guidra.com/api/v1/ai/test-gemini \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 6. Complete User Flow Test

1. **Sign Up/Login** → Google OAuth
2. **Create Learning Path** → Test AI generation
3. **View Lessons** → Check content loading
4. **Track Progress** → Mark lessons complete
5. **Profile Management** → Update settings

### 7. Performance Check

```bash
# Test response times
curl -w "@curl-format.txt" -o /dev/null -s https://www.guidra.com

# Create curl-format.txt:
time_namelookup:  %{time_namelookup}s\n
time_connect:     %{time_connect}s\n
time_pretransfer: %{time_pretransfer}s\n
time_starttransfer: %{time_starttransfer}s\n
time_total:       %{time_total}s\n
```

**Expected**:
- Frontend: < 2s initial load
- API endpoints: < 500ms response time
- AI generation: 3-10s (depends on model)

---

## 📊 Monitoring and Maintenance

### Built-in Monitoring

#### Vercel Analytics

1. Go to Vercel project → **Analytics**
2. Enable **Web Analytics** (free)
3. View:
   - Page views
   - Unique visitors
   - Top pages
   - Load times
   - Device/browser stats

#### Render Monitoring

1. Dashboard → **Metrics**
2. View:
   - CPU usage
   - Memory usage
   - Request count
   - Response time
   - Error rate

3. **Configure Alerts**:
   - Settings → **Alerts**
   - Add email/Slack notifications
   - Set thresholds:
     - High CPU (> 80%)
     - High memory (> 90%)
     - Error rate (> 5%)

#### Railway Monitoring

1. Service → **Metrics**
2. View:
   - CPU usage
   - Memory usage
   - Network I/O

#### MongoDB Atlas Monitoring

1. Cluster → **Metrics**
2. View:
   - Connections
   - Operations/second
   - Query performance
   - Disk usage

3. **Configure Alerts**:
   - Alerts → **Add New Alert**
   - Conditions:
     - Connections > 80%
     - Disk usage > 70%
     - Query time > 1000ms

### Advanced Monitoring (Optional)

#### 1. Sentry (Error Tracking)

```bash
# Install in frontend
cd client
npm install @sentry/react

# Install in backend
cd server
npm install @sentry/node
```

**Frontend Setup** (`client/src/main.jsx`):

```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://your-sentry-dsn@sentry.io/project-id",
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay()
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

**Backend Setup** (`server/server.js`):

```javascript
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "https://your-sentry-dsn@sentry.io/project-id",
  tracesSampleRate: 1.0,
});
```

#### 2. Uptime Monitoring

Free services:
- **UptimeRobot** (https://uptimerobot.com/)
- **Pingdom** (https://www.pingdom.com/)
- **StatusCake** (https://www.statuscake.com/)

**Configure**:
1. Add monitors for:
   - `https://www.guidra.com` (5-minute checks)
   - `https://api.guidra.com/health` (5-minute checks)
2. Set up email/SMS alerts
3. Create status page (optional)

#### 3. Log Management

**Render**: Built-in logs (7-day retention on free tier)

**External Log Services**:
- **Logtail** (https://logtail.com/) - Free tier available
- **Papertrail** (https://papertrailapp.com/) - Free tier available

**Setup**:
```bash
# Add to backend
npm install winston winston-logtail

# Configure logger (server/utils/logger.js)
const winston = require('winston');
const { Logtail } = require('@logtail/node');
const { LogtailTransport } = require('@logtail/winston');

const logtail = new Logtail(process.env.LOGTAIL_TOKEN);

const logger = winston.createLogger({
  transports: [
    new LogtailTransport(logtail),
    new winston.transports.Console()
  ]
});

module.exports = logger;
```

### Maintenance Checklist

#### Daily
- [ ] Check error rates (Sentry dashboard)
- [ ] Monitor uptime status
- [ ] Review critical alerts

#### Weekly
- [ ] Review performance metrics
- [ ] Check API rate limits usage
- [ ] Analyze user feedback
- [ ] Review server logs for anomalies

#### Monthly
- [ ] Database backup verification
- [ ] Security patches and updates
- [ ] Review and rotate API keys
- [ ] Cost analysis
- [ ] User analytics review

#### Quarterly
- [ ] Dependency updates (`npm outdated`)
- [ ] Security audit (`npm audit`)
- [ ] Database cleanup (old sessions, logs)
- [ ] Performance optimization review
- [ ] Disaster recovery test

---

## ⚡ Performance Optimization

### Frontend Optimization

#### 1. Code Splitting

```javascript
// Use React lazy loading
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const LearningPath = lazy(() => import('./pages/LearningPath'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/path/:id" element={<LearningPath />} />
      </Routes>
    </Suspense>
  );
}
```

#### 2. Image Optimization

```javascript
// Use modern formats (WebP, AVIF)
<img 
  src="/images/hero.webp" 
  alt="Hero"
  loading="lazy"
  width="800"
  height="600"
/>

// Or use Vercel Image Optimization
import { Image } from '@vercel/next/image';
```

#### 3. Vite Build Optimization

Update `client/vite.config.js`:

```javascript
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          mui: ['@mui/material', '@mui/icons-material'],
          utils: ['axios', 'cytoscape', 'mermaid']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
      }
    }
  }
});
```

#### 4. Enable Compression

Vercel automatically handles:
- ✅ Gzip compression
- ✅ Brotli compression
- ✅ HTTP/2
- ✅ Edge caching

#### 5. Cache Optimization

Add cache headers in `client/vercel.json`:

```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*).js",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### Backend Optimization

#### 1. Database Indexing

```javascript
// models/User.js
userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });

// models/LearningPath.js
learningPathSchema.index({ userId: 1, createdAt: -1 });
learningPathSchema.index({ topic: 'text', description: 'text' });
```

#### 2. Response Caching

```javascript
// Install
npm install node-cache

// utils/cache.js
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 }); // 10 minutes

module.exports = cache;

// Use in routes
const cache = require('../utils/cache');

router.get('/lessons/:id', async (req, res) => {
  const cacheKey = `lesson_${req.params.id}`;
  
  // Check cache
  const cached = cache.get(cacheKey);
  if (cached) return res.json(cached);
  
  // Fetch from DB
  const lesson = await Lesson.findById(req.params.id);
  
  // Store in cache
  cache.set(cacheKey, lesson);
  res.json(lesson);
});
```

#### 3. Request Rate Limiting

```javascript
// Install
npm install express-rate-limit

// middleware/rateLimit.js
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.'
});

const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 AI generation requests per minute
  message: 'AI generation rate limit exceeded.'
});

module.exports = { apiLimiter, aiLimiter };

// Apply in routes
app.use('/api/v1', apiLimiter);
app.use('/api/v1/ai/generate', aiLimiter);
```

#### 4. Connection Pooling

MongoDB connection config:

```javascript
// configs/database.js
mongoose.connect(process.env.MONGODB_URI, {
  maxPoolSize: 10,
  minPoolSize: 2,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 5000,
  family: 4 // Use IPv4
});
```

#### 5. Compression Middleware

```javascript
// Install
npm install compression

// server.js
const compression = require('compression');

app.use(compression({
  level: 6,
  threshold: 10 * 1000, // Only compress > 10KB
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  }
}));
```

### CDN Configuration

If using Cloudflare:

1. **Enable Auto Minify**
   - Speed → Optimization
   - Auto Minify: Check JavaScript, CSS, HTML

2. **Enable Brotli Compression**
   - Speed → Optimization
   - Brotli: On

3. **Configure Caching**
   - Caching → Configuration
   - Browser Cache TTL: 4 hours
   - Caching Level: Standard

4. **Page Rules** (optional):
   - `www.guidra.com/assets/*`: Cache Level: Cache Everything

### Performance Monitoring

```javascript
// Add performance monitoring to frontend
// src/utils/performance.js

export const measurePageLoad = () => {
  window.addEventListener('load', () => {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    
    console.log(`Page load time: ${pageLoadTime}ms`);
    
    // Send to analytics
    if (window.gtag) {
      gtag('event', 'timing_complete', {
        name: 'load',
        value: pageLoadTime,
        event_category: 'Page Performance'
      });
    }
  });
};
```

---

## 🔐 Security Best Practices

### 1. Environment Variables Security

```yaml
❌ Never commit .env files
✅ Use .env.example as template
✅ Rotate secrets regularly (every 90 days)
✅ Use strong, unique values
✅ Limit access to production secrets
```

### 2. JWT Security

**Backend** (`configs/jwt.js`):

```javascript
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      issuer: 'guidra-platform',
      audience: 'guidra-users'
    }
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET, {
      issuer: 'guidra-platform',
      audience: 'guidra-users'
    });
  } catch (error) {
    throw new Error('Invalid token');
  }
};
```

### 3. CORS Configuration

**Backend** (`server.js`):

```javascript
const cors = require('cors');

const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
```

### 4. Cookie Security

```javascript
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  domain: process.env.NODE_ENV === 'production' ? '.guidra.com' : undefined
};

res.cookie('token', token, cookieOptions);
```

### 5. Helmet.js (Security Headers)

```bash
npm install helmet
```

```javascript
const helmet = require('helmet');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", process.env.CLIENT_URL]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

### 6. Input Validation

```bash
npm install express-validator
```

```javascript
const { body, validationResult } = require('express-validator');

router.post('/register',
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).trim(),
  body('name').trim().escape(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Process registration
  }
);
```

### 7. MongoDB Security

```javascript
// Prevent NoSQL injection
const sanitize = require('mongo-sanitize');

router.post('/login', async (req, res) => {
  const email = sanitize(req.body.email);
  const password = sanitize(req.body.password);
  
  // Continue with authentication
});
```

### 8. API Key Protection

```javascript
// Don't expose API keys in frontend
// ❌ Bad: VITE_GROQ_API_KEY in client
// ✅ Good: Keep API keys in backend only

// Create proxy endpoint
router.post('/ai/generate', authMiddleware, async (req, res) => {
  try {
    const response = await axios.post('https://api.groq.com/v1/chat', {
      // data
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'AI generation failed' });
  }
});
```

### 9. DDoS Protection

Using Cloudflare (if applicable):

1. **Enable Under Attack Mode** (emergency)
   - Security → Settings
   - Security Level: I'm Under Attack

2. **Rate Limiting Rules**
   - Security → WAF
   - Create Rate Limiting Rule
   - Threshold: 100 requests / 10 seconds

3. **Bot Fight Mode**
   - Security → Bots
   - Enable Bot Fight Mode

### 10. Security Monitoring

```javascript
// Log suspicious activity
const logger = require('./utils/logger');

app.use((req, res, next) => {
  // Log failed login attempts
  if (req.path === '/api/v1/auth/login' && res.statusCode === 401) {
    logger.warn('Failed login attempt', {
      ip: req.ip,
      userAgent: req.get('user-agent'),
      timestamp: new Date()
    });
  }
  next();
});
```

### Security Checklist

```yaml
✅ All secrets in environment variables
✅ HTTPS enabled everywhere
✅ CORS properly configured
✅ Rate limiting on API endpoints
✅ Input validation and sanitization
✅ SQL/NoSQL injection protection
✅ XSS protection (Helmet.js)
✅ CSRF protection for state-changing operations
✅ Security headers configured
✅ Dependencies regularly updated (npm audit)
✅ Error messages don't leak sensitive info
✅ Logging and monitoring enabled
✅ Regular security audits
```

---

## 🔧 Troubleshooting

### Common Deployment Issues

#### 1. Build Failures

**Frontend Build Error**: `VITE_API_URL is not defined`

**Solution**:
```bash
# Ensure environment variable is set in Vercel
# Go to Vercel → Settings → Environment Variables
# Add: VITE_API_URL = https://your-backend.com/api/v1
# Redeploy
```

**Backend Build Error**: `Cannot find module 'xyz'`

**Solution**:
```bash
# Ensure package is in dependencies, not devDependencies
# Move from devDependencies to dependencies in package.json
npm install xyz --save
git add package.json package-lock.json
git commit -m "Fix dependencies"
git push
```

---

#### 2. Database Connection Issues

**Error**: `MongoServerError: Authentication failed`

**Solution**:
```bash
# Check MongoDB Atlas:
# 1. Username and password are correct
# 2. User has proper permissions
# 3. Connection string format:
#    mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/DATABASE

# Ensure password is URL-encoded if it contains special characters
# Example: p@ssw0rd → p%40ssw0rd
```

**Error**: `MongoServerError: IP not whitelisted`

**Solution**:
```bash
# In MongoDB Atlas:
# Security → Network Access
# Add IP address: 0.0.0.0/0 (allow all)
# Or add specific IP of your backend server
```

---

#### 3. CORS Errors

**Error**: `Access-Control-Allow-Origin header is missing`

**Solution**:
```bash
# Backend: Ensure CORS is configured
# server.js
const cors = require('cors');
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

# Update CLIENT_URL environment variable to match frontend domain
CLIENT_URL=https://your-frontend.vercel.app
```

---

#### 4. OAuth Redirect Issues

**Error**: `redirect_uri_mismatch`

**Solution**:
```bash
# Google Cloud Console → Credentials
# Authorized redirect URIs must exactly match:
https://api.guidra.com/api/v1/auth/google/callback

# Backend environment variable:
GOOGLE_CALLBACK_URL=https://api.guidra.com/api/v1/auth/google/callback

# No trailing slashes, exact match required
```

---

#### 5. Cookie Not Set

**Error**: Cookie not being saved after login

**Solution**:
```javascript
// Backend: Check cookie settings
const cookieOptions = {
  httpOnly: true,
  secure: true, // Must be true in production
  sameSite: 'none', // Required for cross-origin
  domain: '.guidra.com' // Include subdomain cookie
};

res.cookie('token', token, cookieOptions);
```

---

#### 6. API Rate Limiting

**Error**: `429 Too Many Requests` from Groq/Gemini

**Solution**:
```bash
# Implement exponential backoff
# utils/retryHandler.js

const retryWithBackoff = async (fn, retries = 3) => {
  try {
    return await fn();
  } catch (error) {
    if (error.response?.status === 429 && retries > 0) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return retryWithBackoff(fn, retries - 1);
    }
    throw error;
  }
};

# Monitor API usage in respective dashboards
# Consider upgrading to paid tier
```

---

#### 7. Slow Performance

**Issue**: Page takes > 5 seconds to load

**Solution**:
```bash
# Frontend:
# 1. Check Vercel Analytics for bottlenecks
# 2. Use React DevTools Profiler
# 3. Implement code splitting (see Performance section)
# 4. Optimize images (WebP format, lazy loading)

# Backend:
# 1. Add database indexes
# 2. Implement caching (Redis or in-memory)
# 3. Check MongoDB Atlas performance metrics
# 4. Upgrade server resources if needed
```

---

#### 8. Environment Variables Not Loading

**Error**: `undefined` when accessing `process.env.VARIABLE`

**Solution**:
```bash
# Backend (Render/Railway):
# - Ensure variables are set in platform dashboard
# - Restart service after adding variables
# - Check variable names (no typos)
# - Verify NODE_ENV is set to 'production'

# Frontend (Vercel):
# - All frontend variables must start with VITE_
# - Set in Vercel dashboard: Settings → Environment Variables
# - Redeploy after adding variables
# - Variables are embedded at build time, not runtime
```

---

#### 9. MongoDB Memory Issues

**Error**: `MongoServerError: Memory limit exceeded`

**Solution**:
```bash
# Optimize queries:
# 1. Add indexes to frequently queried fields
# 2. Use projection to limit returned fields:
   User.findById(id).select('name email');

# 3. Implement pagination:
   const limit = 20;
   const page = req.query.page || 1;
   const skip = (page - 1) * limit;
   await LearningPath.find().skip(skip).limit(limit);

# 4. Upgrade MongoDB Atlas tier if needed
```

---

#### 10. Deployment Rollback

**Need to revert to previous version**

**Vercel**:
```bash
# Dashboard → Deployments
# Find previous successful deployment
# Click "..." → "Promote to Production"
```

**Render**:
```bash
# Dashboard → Service → Deploys
# Find previous deploy
# Click "..." → "Redeploy"
```

**Heroku**:
```bash
heroku releases
heroku rollback v12  # Roll back to version 12
```

---

### Debugging Commands

```bash
# Check backend logs
# Render
https://dashboard.render.com → Service → Logs

# Railway
railway logs

# Heroku
heroku logs --tail

# Test API endpoint
curl -v https://api.guidra.com/api/v1/health

# Check DNS propagation
nslookup api.guidra.com
dig api.guidra.com

# Test SSL certificate
openssl s_client -connect api.guidra.com:443

# Check CORS
curl -H "Origin: https://www.guidra.com" \
  -H "Access-Control-Request-Method: GET" \
  -X OPTIONS https://api.guidra.com/api/v1/

# Verify MongoDB connection from command line
mongosh "mongodb+srv://username:password@cluster.mongodb.net/guidra"
```

---

### Getting Help

#### Community Resources

- **GitHub Issues**: [Repository Issues](https://github.com/your-repo/issues)
- **Stack Overflow**: Tag `guidra` or `mern-deployment`
- **Discord/Slack**: Join community channels

#### Platform Support

- **Vercel**: [Vercel Support](https://vercel.com/support)
- **Render**: [Render Support](https://render.com/support)
- **Railway**: [Railway Discord](https://discord.gg/railway)
- **MongoDB Atlas**: [MongoDB Support](https://support.mongodb.com/)

#### Documentation

- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **Railway Docs**: https://docs.railway.app/
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com/

---

## 📦 Deployment Checklist

### Pre-Deployment

- [ ] All code tested locally
- [ ] Environment variables documented
- [ ] Database schema finalized
- [ ] API keys obtained
- [ ] OAuth configured
- [ ] Git repository up to date
- [ ] Dependencies updated (`npm audit fix`)
- [ ] Build tested locally (`npm run build`)

### MongoDB Atlas

- [ ] Cluster created
- [ ] Database user created
- [ ] Network access configured
- [ ] Connection string obtained
- [ ] Test connection successful

### Backend Deployment

- [ ] Hosting platform selected
- [ ] Repository connected
- [ ] Build configuration set
- [ ] Environment variables added
- [ ] Initial deployment successful
- [ ] Health check endpoint working
- [ ] Database connection verified
- [ ] Logs monitored

### Frontend Deployment

- [ ] Vercel project created
- [ ] Repository connected
- [ ] Build configuration set
- [ ] Environment variables added
- [ ] Initial deployment successful
- [ ] Assets loading correctly
- [ ] API connection working
- [ ] Routing functioning

### Domain & SSL

- [ ] Domain purchased (if custom)
- [ ] DNS records configured
- [ ] SSL certificates provisioned
- [ ] HTTPS redirect enabled
- [ ] Custom domain verified

### OAuth & APIs

- [ ] Google OAuth URIs updated
- [ ] Groq API key working
- [ ] Gemini API key working
- [ ] HuggingFace token working
- [ ] All API endpoints tested

### Post-Deployment

- [ ] Complete user flow tested
- [ ] Performance verified
- [ ] Security headers checked
- [ ] Monitoring configured
- [ ] Error tracking enabled
- [ ] Backup strategy implemented
- [ ] Documentation updated
- [ ] Team notified

---

## 🎉 Congratulations!

Your Guidra Learning Platform is now live in production! 🚀

### Next Steps

1. **Monitor**: Keep an eye on logs and metrics for the first 24 hours
2. **Test**: Have beta users test all functionality
3. **Iterate**: Gather feedback and make improvements
4. **Scale**: Upgrade resources as user base grows
5. **Maintain**: Regular updates and security patches

### Production URLs

- **Frontend**: https://www.guidra.com
- **Backend API**: https://api.guidra.com
- **API Documentation**: https://api.guidra.com/api-docs (if added)
- **Status Page**: Consider adding a status page

### Support

For deployment issues, refer to:
- This documentation
- Platform-specific documentation
- Community forums
- GitHub issues

---

<div align="center">

**Built with ❤️ by the Guidra Team**

[⭐ Star on GitHub](https://github.com/your-repo) • [📚 Documentation](./README.md) • [🐛 Report Bug](../../issues)

</div>
