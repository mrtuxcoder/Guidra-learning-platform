# Guidra Learning Platform - API Documentation

## Base URL
```
Production: https://api.guidra.com/api/v1
Development: http://localhost:5000/api/v1
```

## Authentication
Most endpoints require JWT authentication. Include the JWT token in the request:
- **Cookie**: `token` (HttpOnly, Secure, SameSite=None)
- **Header**: `Authorization: Bearer <token>`

---

## Table of Contents
1. [Authentication Endpoints](#authentication-endpoints)
2. [User Endpoints](#user-endpoints)
3. [Learning Endpoints](#learning-endpoints)
4. [Content Endpoints](#content-endpoints)
5. [Progress Endpoints](#progress-endpoints)
6. [Error Codes](#error-codes)

---

## Authentication Endpoints

### 1. Register User
Creates a new user account with email and password.

**Endpoint:** `POST /auth/register`

**Authentication:** Not required

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Success Response (201):**
```json
{
  "message": "Registration successful",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "authProvider": "local",
    "learningStyle": "visual",
    "difficultyPreference": "medium",
    "contentFormat": "detailed",
    "learningMotivation": "career",
    "progress": []
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "authProvider": "local"
}
```

**Error Responses:**
- `400` - Validation error (missing fields, password too short)
- `409` - Email already registered

**Example:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

---

### 2. Login User
Authenticates user and returns JWT token.

**Endpoint:** `POST /auth/login`

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "authProvider": "local",
    "learningStyle": "visual",
    "progress": []
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "authProvider": "local"
}
```

**Error Responses:**
- `400` - Missing email or password
- `401` - Invalid credentials
- `401` - Google OAuth user without password (needs password setup)

**Example:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

---

### 3. Logout User
Logs out user and clears authentication cookies.

**Endpoint:** `POST /auth/logout`

**Authentication:** Not required

**Success Response (200):**
```json
{
  "message": "Logout successful",
  "clearFrontendCookie": true
}
```

**Example:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/logout \
  -H "Cookie: token=<your-token>"
```

---

### 4. Google OAuth Login
Initiates Google OAuth authentication flow.

**Endpoint:** `GET /auth/google`

**Authentication:** Not required

**Response:** Redirects to Google OAuth consent screen

---

### 5. Google OAuth Callback
Handles Google OAuth callback and creates/authenticates user.

**Endpoint:** `GET /auth/google/callback`

**Authentication:** Not required (handled by Google)

**Response:** Redirects to frontend with authentication

---

### 6. Google OAuth Success
Returns authenticated user information after successful Google login.

**Endpoint:** `GET /auth/google/success`

**Authentication:** Required (via session)

**Success Response (200):**
```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "authProvider": "google"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## User Endpoints

### 1. Get User Profile
Retrieves the authenticated user's profile information.

**Endpoint:** `GET /users/me`

**Authentication:** Required

**Success Response (200):**
```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "authProvider": "local",
    "learningStyle": "visual",
    "difficultyPreference": "medium",
    "contentFormat": "detailed",
    "learningMotivation": "career",
    "progress": []
  }
}
```

**Error Responses:**
- `401` - Not authenticated
- `404` - User not found

**Example:**
```bash
curl -X GET http://localhost:5000/api/v1/users/me \
  -H "Authorization: Bearer <token>"
```

---

### 2. Check User Exists
Checks if a user with given email exists (public endpoint).

**Endpoint:** `GET /users/check?email=john@example.com`

**Authentication:** Not required

**Query Parameters:**
- `email` (required): Email address to check

**Success Response (200):**
```json
{
  "exists": true,
  "authProvider": "local"
}
```

**Example:**
```bash
curl -X GET "http://localhost:5000/api/v1/users/check?email=john@example.com"
```

---

### 3. Check Password Status
Checks if the authenticated user has a password set.

**Endpoint:** `GET /users/me/password/status`

**Authentication:** Required

**Success Response (200):**
```json
{
  "hasPassword": true,
  "authProvider": "local",
  "needsPasswordSetup": false
}
```

**Error Responses:**
- `401` - Not authenticated

**Example:**
```bash
curl -X GET http://localhost:5000/api/v1/users/me/password/status \
  -H "Authorization: Bearer <token>"
```

---

### 4. Set Password
Sets password for Google OAuth users who don't have one.

**Endpoint:** `POST /users/me/password/set`

**Authentication:** Required

**Request Body:**
```json
{
  "newPassword": "newSecurePassword123",
  "confirmPassword": "newSecurePassword123"
}
```

**Success Response (200):**
```json
{
  "message": "Password set successfully! You can now login with email and password.",
  "hasPassword": true,
  "authProvider": "google",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400` - Password too short or passwords don't match
- `400` - User already has a password
- `401` - Not authenticated

**Example:**
```bash
curl -X POST http://localhost:5000/api/v1/users/me/password/set \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "newPassword": "newSecurePassword123",
    "confirmPassword": "newSecurePassword123"
  }'
```

---

### 5. Change Password
Changes the current password for users with existing passwords.

**Endpoint:** `PUT /users/me/password/change`

**Authentication:** Required

**Request Body:**
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword123",
  "confirmPassword": "newPassword123"
}
```

**Success Response (200):**
```json
{
  "message": "Password changed successfully"
}
```

**Error Responses:**
- `400` - Missing fields or validation errors
- `401` - Current password incorrect
- `401` - Not authenticated

**Example:**
```bash
curl -X PUT http://localhost:5000/api/v1/users/me/password/change \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "oldPassword123",
    "newPassword": "newPassword123",
    "confirmPassword": "newPassword123"
  }'
```

---

## Learning Endpoints

### 1. Generate Learning Path (Subtopics)
Generates a personalized learning path with subtopics for a new topic.

**Endpoint:** `POST /learning/topics`

**Authentication:** Required

**Request Body:**
```json
{
  "topic": "Machine Learning"
}
```

**Success Response (200):**
```json
{
  "message": "Learning path generated successfully!",
  "data": {
    "topic": "Machine Learning",
    "subTopics": [
      {
        "name": "Introduction to Machine Learning",
        "completed": false,
        "understandingLevel": 1,
        "lastReviewed": "2024-01-15T10:30:00.000Z",
        "generationCount": 0,
        "quizMark": {
          "correct": 0,
          "wrong": 0,
          "total": 0,
          "percentage": 0,
          "submittedAt": "2024-01-15T10:30:00.000Z"
        }
      },
      {
        "name": "Supervised Learning",
        "completed": false,
        "understandingLevel": 1,
        "lastReviewed": "2024-01-15T10:30:00.000Z",
        "generationCount": 0,
        "quizMark": {
          "correct": 0,
          "wrong": 0,
          "total": 0,
          "percentage": 0,
          "submittedAt": "2024-01-15T10:30:00.000Z"
        }
      }
    ]
  }
}
```

**Error Responses:**
- `400` - Topic is required or invalid
- `400` - Incomplete topic exists (must complete first)
- `401` - Not authenticated
- `404` - User not found

**Example:**
```bash
curl -X POST http://localhost:5000/api/v1/learning/topics \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"topic": "Machine Learning"}'
```

---

### 2. Get Subtopics for Topic
Retrieves all subtopics for a specific topic from user progress.

**Endpoint:** `GET /learning/topics/:topic/subtopics`

**Authentication:** Required

**URL Parameters:**
- `topic` (required): The topic name

**Success Response (200):**
```json
{
  "message": "Subtopics for \"Machine Learning\"",
  "topic": "Machine Learning",
  "subTopics": [
    {
      "name": "Introduction to Machine Learning",
      "completed": false,
      "understandingLevel": 3,
      "lastReviewed": "2024-01-15T10:30:00.000Z",
      "generationCount": 2
    }
  ]
}
```

**Error Responses:**
- `404` - Topic not found
- `404` - User not found

**Example:**
```bash
curl -X GET "http://localhost:5000/api/v1/learning/topics/Machine%20Learning/subtopics" \
  -H "Authorization: Bearer <token>"
```

---

### 3. Validate Topic
Validates if a topic is appropriate for learning.

**Endpoint:** `POST /learning/topics/validate`

**Authentication:** Required

**Request Body:**
```json
{
  "topic": "Quantum Computing"
}
```

**Success Response (200):**
```json
{
  "valid": true,
  "topic": "Quantum Computing",
  "message": "Topic is valid for learning"
}
```

**Error Responses:**
- `400` - Invalid or nonsensical topic

**Example:**
```bash
curl -X POST http://localhost:5000/api/v1/learning/topics/validate \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"topic": "Quantum Computing"}'
```

---

### 4. Update Learning Preferences
Updates user's learning preferences and style.

**Endpoint:** `PUT /learning/preferences`

**Authentication:** Required

**Request Body:**
```json
{
  "learningStyle": "visual",
  "difficultyPreference": "intermediate",
  "contentFormat": "detailed",
  "learningMotivation": "career"
}
```

**Available Options:**
- `learningStyle`: "visual", "auditory", "reading", "kinesthetic"
- `difficultyPreference`: "beginner", "intermediate", "advanced"
- `contentFormat`: "concise", "detailed", "comprehensive"
- `learningMotivation`: "career", "hobby", "academic", "personal"

**Success Response (200):**
```json
{
  "message": "Learning preferences updated successfully",
  "preferences": {
    "learningStyle": "visual",
    "difficultyPreference": "intermediate",
    "contentFormat": "detailed",
    "learningMotivation": "career"
  }
}
```

**Error Responses:**
- `400` - Invalid preference values
- `401` - Not authenticated

**Example:**
```bash
curl -X PUT http://localhost:5000/api/v1/learning/preferences \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "learningStyle": "visual",
    "difficultyPreference": "intermediate"
  }'
```

---

## Content Endpoints

### 1. Generate Teaching Content
Generates personalized teaching content for a subtopic (with caching).

**Endpoint:** `POST /content/teach`

**Authentication:** Required

**Request Body:**
```json
{
  "topic": "Machine Learning",
  "subtopic": "Introduction to Machine Learning",
  "regenerate": false
}
```

**Success Response (200):**
```json
{
  "message": "Personalized teaching content generated for \"Introduction to Machine Learning\"",
  "topic": "Machine Learning",
  "subtopic": "Introduction to Machine Learning",
  "learningStyle": "visual",
  "cached": false,
  "version": 1,
  "data": {
    "title": "Introduction to Machine Learning",
    "concept": "Machine Learning is a branch of artificial intelligence...",
    "explanation": "Detailed explanation of the concept...",
    "keyConcepts": [
      "Supervised Learning",
      "Unsupervised Learning",
      "Reinforcement Learning"
    ],
    "coreExample": {
      "title": "Email Spam Detection",
      "description": "A practical example...",
      "code": "import sklearn..."
    },
    "practice": [
      {
        "question": "What is supervised learning?",
        "type": "conceptual"
      }
    ],
    "learningActions": [
      "Read about different ML algorithms",
      "Try implementing a simple classifier"
    ],
    "mindmap": "graph TD\n  A[Machine Learning] --> B[Supervised]\n  A --> C[Unsupervised]",
    "quiz": [
      {
        "question": "What is the main difference between supervised and unsupervised learning?",
        "options": [
          "Supervised uses labeled data",
          "Unsupervised is faster",
          "No difference",
          "Supervised is easier"
        ],
        "correctAnswer": 0,
        "explanation": "Supervised learning requires labeled data..."
      }
    ],
    "examples": [
      {
        "title": "Image Classification",
        "description": "Using neural networks..."
      }
    ]
  }
}
```

**Error Responses:**
- `400` - Topic and subtopic required
- `401` - Not authenticated
- `404` - User not found
- `500` - Failed to generate content

**Example:**
```bash
curl -X POST http://localhost:5000/api/v1/content/teach \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Machine Learning",
    "subtopic": "Introduction to Machine Learning"
  }'
```

---

### 2. Regenerate Teaching Content
Forces regeneration of teaching content for a subtopic.

**Endpoint:** `POST /content/regenerate`

**Authentication:** Required

**Request Body:**
```json
{
  "topic": "Machine Learning",
  "subtopic": "Introduction to Machine Learning"
}
```

**Success Response (200):**
```json
{
  "message": "Content regenerated successfully for \"Introduction to Machine Learning\"",
  "topic": "Machine Learning",
  "subtopic": "Introduction to Machine Learning",
  "learningStyle": "visual",
  "cached": false,
  "version": 2,
  "data": {
    // Full content structure (same as teach endpoint)
  }
}
```

**Error Responses:**
- `400` - Topic and subtopic required
- `401` - Not authenticated
- `500` - Failed to regenerate content

**Example:**
```bash
curl -X POST http://localhost:5000/api/v1/content/regenerate \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Machine Learning",
    "subtopic": "Introduction to Machine Learning"
  }'
```

---

### 3. Generate Specific Component
Generates or retrieves a specific component of teaching content.

**Endpoint:** `POST /content/component`

**Authentication:** Required

**Request Body:**
```json
{
  "topic": "Machine Learning",
  "subtopic": "Introduction to Machine Learning",
  "component": "quiz",
  "regenerate": false
}
```

**Valid Components:**
- `title` - Topic title
- `concept` - Core concept explanation
- `explanation` - Detailed explanation
- `keyConcepts` - List of key concepts
- `coreExample` - Main example with code
- `practice` - Practice questions
- `learningActions` - Suggested actions
- `mindmap` - Visual mindmap (Mermaid syntax)
- `quiz` - Quiz questions with answers
- `examples` - Additional examples

**Success Response (200):**
```json
{
  "message": "Quiz generated for \"Introduction to Machine Learning\"",
  "topic": "Machine Learning",
  "subtopic": "Introduction to Machine Learning",
  "component": "quiz",
  "learningStyle": "visual",
  "cached": false,
  "version": 1,
  "quiz": [
    {
      "question": "What is the main goal of machine learning?",
      "options": [
        "To make computers learn from data",
        "To write better code",
        "To replace humans",
        "To store data"
      ],
      "correctAnswer": 0,
      "explanation": "Machine learning enables computers to learn patterns from data..."
    }
  ],
  "metadata": {
    "user": "John Doe",
    "difficultyPreference": "intermediate",
    "generatedAt": "2024-01-15T10:30:00.000Z",
    "cacheUpdated": true
  }
}
```

**Error Responses:**
- `400` - Missing required fields or invalid component
- `401` - Not authenticated
- `404` - User not found
- `500` - Failed to generate component

**Example:**
```bash
curl -X POST http://localhost:5000/api/v1/content/component \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Machine Learning",
    "subtopic": "Introduction to Machine Learning",
    "component": "quiz"
  }'
```

---

### 4. Regenerate Component
Forces regeneration of a specific component.

**Endpoint:** `POST /content/component/regenerate`

**Authentication:** Required

**Request Body:**
```json
{
  "topic": "Machine Learning",
  "subtopic": "Introduction to Machine Learning",
  "component": "quiz"
}
```

**Success Response (200):**
```json
{
  "message": "Quiz generated for \"Introduction to Machine Learning\"",
  "topic": "Machine Learning",
  "subtopic": "Introduction to Machine Learning",
  "component": "quiz",
  "learningStyle": "visual",
  "cached": false,
  "version": 2,
  "quiz": [
    // New quiz questions
  ]
}
```

**Error Responses:**
- `400` - Missing required fields
- `401` - Not authenticated
- `500` - Failed to regenerate component

**Example:**
```bash
curl -X POST http://localhost:5000/api/v1/content/component/regenerate \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Machine Learning",
    "subtopic": "Introduction to Machine Learning",
    "component": "quiz"
  }'
```

---

### 5. Get Content History
Retrieves user's content generation history.

**Endpoint:** `GET /content/history`

**Authentication:** Required

**Success Response (200):**
```json
{
  "message": "Content history retrieved",
  "history": [
    {
      "topic": "Machine Learning",
      "subtopic": "Introduction to Machine Learning",
      "timestamp": "2024-01-15T10:30:00.000Z",
      "version": 1,
      "cached": true
    }
  ]
}
```

**Error Responses:**
- `401` - Not authenticated
- `500` - Failed to retrieve history

**Example:**
```bash
curl -X GET http://localhost:5000/api/v1/content/history \
  -H "Authorization: Bearer <token>"
```

---

### 6. Clear Content Cache
Clears cached content for the user.

**Endpoint:** `DELETE /content/clear`

**Authentication:** Required

**Request Body (Optional):**
```json
{
  "topic": "Machine Learning",
  "subtopic": "Introduction to Machine Learning"
}
```

**Success Response (200):**
```json
{
  "message": "Content cache cleared successfully",
  "deletedCount": 5
}
```

**Error Responses:**
- `401` - Not authenticated
- `500` - Failed to clear cache

**Example:**
```bash
curl -X DELETE http://localhost:5000/api/v1/content/clear \
  -H "Authorization: Bearer <token>"
```

---

## Progress Endpoints

### 1. Get User Progress
Retrieves complete progress overview for the authenticated user.

**Endpoint:** `GET /progress`

**Authentication:** Required

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "progress": [
      {
        "topic": "Machine Learning",
        "subTopics": [
          {
            "name": "Introduction to Machine Learning",
            "completed": true,
            "understandingLevel": 4,
            "lastReviewed": "2024-01-15T10:30:00.000Z",
            "generationCount": 3,
            "quizMark": {
              "correct": 8,
              "wrong": 2,
              "total": 10,
              "percentage": 80,
              "submittedAt": "2024-01-15T10:30:00.000Z"
            }
          }
        ],
        "overallUnderstanding": 4,
        "completed": false,
        "lastAccessed": "2024-01-15T10:30:00.000Z"
      }
    ],
    "totalTopics": 1,
    "totalSubtopics": 5,
    "completedSubtopics": 1
  }
}
```

**Error Responses:**
- `401` - Not authenticated
- `404` - User not found

**Example:**
```bash
curl -X GET http://localhost:5000/api/v1/progress \
  -H "Authorization: Bearer <token>"
```

---

### 2. Mark Topic Complete
Marks a topic as completed or incomplete.

**Endpoint:** `PUT /progress/topics/:topic/complete`

**Authentication:** Required

**Request Body:**
```json
{
  "topic": "Machine Learning",
  "completed": true
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Topic \"Machine Learning\" marked as completed",
  "data": {
    "topic": "Machine Learning",
    "completed": true,
    "overallUnderstanding": 4,
    "completedSubtopics": 5,
    "totalSubtopics": 5
  }
}
```

**Error Responses:**
- `400` - Topic is required
- `401` - Not authenticated
- `404` - Topic not found

**Example:**
```bash
curl -X PUT http://localhost:5000/api/v1/progress/topics/Machine%20Learning/complete \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"topic": "Machine Learning", "completed": true}'
```

---

### 3. Mark Subtopic Complete
Marks a subtopic as completed.

**Endpoint:** `PUT /progress/subtopics/complete`

**Authentication:** Required

**Request Body:**
```json
{
  "topic": "Machine Learning",
  "subtopic": "Introduction to Machine Learning",
  "completed": true
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Subtopic marked as completed",
  "data": {
    "topic": "Machine Learning",
    "subtopic": "Introduction to Machine Learning",
    "completed": true,
    "understandingLevel": 4
  }
}
```

**Error Responses:**
- `400` - Topic and subtopic required
- `401` - Not authenticated
- `404` - Subtopic not found

**Example:**
```bash
curl -X PUT http://localhost:5000/api/v1/progress/subtopics/complete \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Machine Learning",
    "subtopic": "Introduction to Machine Learning",
    "completed": true
  }'
```

---

### 4. Update Understanding Level
Updates the understanding level for a subtopic.

**Endpoint:** `PUT /progress/understanding`

**Authentication:** Required

**Request Body:**
```json
{
  "topic": "Machine Learning",
  "subtopic": "Introduction to Machine Learning",
  "understandingLevel": 4
}
```

**Understanding Levels:**
- `1` - Very Poor
- `2` - Poor
- `3` - Average
- `4` - Good
- `5` - Excellent

**Success Response (200):**
```json
{
  "success": true,
  "message": "Understanding level updated",
  "data": {
    "topic": "Machine Learning",
    "subtopic": "Introduction to Machine Learning",
    "understandingLevel": 4
  }
}
```

**Error Responses:**
- `400` - Invalid understanding level (must be 1-5)
- `401` - Not authenticated
- `404` - Subtopic not found

**Example:**
```bash
curl -X PUT http://localhost:5000/api/v1/progress/understanding \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Machine Learning",
    "subtopic": "Introduction to Machine Learning",
    "understandingLevel": 4
  }'
```

---

### 5. Get Generation Count
Gets the number of times content has been generated for a subtopic.

**Endpoint:** `GET /progress/generation-count?topic=Machine%20Learning&subtopic=Introduction%20to%20Machine%20Learning`

**Authentication:** Required

**Query Parameters:**
- `topic` (required): The topic name
- `subtopic` (required): The subtopic name

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "topic": "Machine Learning",
    "subtopic": "Introduction to Machine Learning",
    "generationCount": 3
  }
}
```

**Error Responses:**
- `400` - Missing query parameters
- `401` - Not authenticated
- `404` - Subtopic not found

**Example:**
```bash
curl -X GET "http://localhost:5000/api/v1/progress/generation-count?topic=Machine%20Learning&subtopic=Introduction%20to%20Machine%20Learning" \
  -H "Authorization: Bearer <token>"
```

---

### 6. Increment Generation Count
Increments the generation count for a subtopic.

**Endpoint:** `PUT /progress/generation-count/increment`

**Authentication:** Required

**Request Body:**
```json
{
  "topic": "Machine Learning",
  "subtopic": "Introduction to Machine Learning"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Generation count incremented",
  "data": {
    "topic": "Machine Learning",
    "subtopic": "Introduction to Machine Learning",
    "generationCount": 4
  }
}
```

**Error Responses:**
- `400` - Missing required fields
- `401` - Not authenticated
- `404` - Subtopic not found

**Example:**
```bash
curl -X PUT http://localhost:5000/api/v1/progress/generation-count/increment \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Machine Learning",
    "subtopic": "Introduction to Machine Learning"
  }'
```

---

### 7. Update Quiz Marks
Updates quiz results and auto-calculates understanding level.

**Endpoint:** `PUT /progress/quizzes`

**Authentication:** Required

**Request Body:**
```json
{
  "topic": "Machine Learning",
  "subtopic": "Introduction to Machine Learning",
  "correct": 8,
  "wrong": 2,
  "total": 10
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Quiz marks updated for \"Introduction to Machine Learning\"",
  "data": {
    "topic": "Machine Learning",
    "subtopic": "Introduction to Machine Learning",
    "quizMark": {
      "correct": 8,
      "wrong": 2,
      "total": 10,
      "percentage": 80,
      "submittedAt": "2024-01-15T10:30:00.000Z"
    },
    "understandingLevel": 5,
    "completed": true
  }
}
```

**Understanding Level Auto-Calculation:**
- ≥80% → Level 5 (Excellent)
- ≥60% → Level 4 (Good)
- ≥40% → Level 3 (Average)
- ≥20% → Level 2 (Poor)
- <20% → Level 1 (Very Poor)

**Auto-Completion:** Subtopic is automatically marked complete if score ≥70%

**Error Responses:**
- `400` - Missing required fields or invalid values
- `401` - Not authenticated
- `404` - Subtopic not found

**Example:**
```bash
curl -X PUT http://localhost:5000/api/v1/progress/quizzes \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Machine Learning",
    "subtopic": "Introduction to Machine Learning",
    "correct": 8,
    "wrong": 2,
    "total": 10
  }'
```

---

### 8. Get Quiz Marks
Retrieves quiz results for a specific subtopic.

**Endpoint:** `GET /progress/quizzes?topic=Machine%20Learning&subtopic=Introduction%20to%20Machine%20Learning`

**Authentication:** Required

**Query Parameters:**
- `topic` (required): The topic name
- `subtopic` (required): The subtopic name

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "topic": "Machine Learning",
    "subtopic": "Introduction to Machine Learning",
    "quizMark": {
      "correct": 8,
      "wrong": 2,
      "total": 10,
      "percentage": 80,
      "submittedAt": "2024-01-15T10:30:00.000Z"
    },
    "hasQuizMarks": true
  }
}
```

**Error Responses:**
- `400` - Missing query parameters
- `401` - Not authenticated
- `404` - Subtopic not found

**Example:**
```bash
curl -X GET "http://localhost:5000/api/v1/progress/quizzes?topic=Machine%20Learning&subtopic=Introduction%20to%20Machine%20Learning" \
  -H "Authorization: Bearer <token>"
```

---

### 9. Clear Quiz Marks
Clears quiz results for a subtopic (useful for retaking quizzes).

**Endpoint:** `DELETE /progress/quizzes`

**Authentication:** Required

**Request Body:**
```json
{
  "topic": "Machine Learning",
  "subtopic": "Introduction to Machine Learning"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Quiz marks cleared for \"Introduction to Machine Learning\"",
  "data": {
    "topic": "Machine Learning",
    "subtopic": "Introduction to Machine Learning"
  }
}
```

**Error Responses:**
- `400` - Missing required fields
- `401` - Not authenticated
- `404` - Subtopic not found

**Example:**
```bash
curl -X DELETE http://localhost:5000/api/v1/progress/quizzes \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Machine Learning",
    "subtopic": "Introduction to Machine Learning"
  }'
```

---

## Error Codes

### HTTP Status Codes
| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request succeeded |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request parameters or body |
| 401 | Unauthorized | Authentication required or invalid credentials |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists (e.g., duplicate email) |
| 500 | Internal Server Error | Server error occurred |

### Common Error Response Format
```json
{
  "error": "Error message description",
  "details": "Additional error details (in development mode)",
  "success": false,
  "message": "Human-readable error message"
}
```

### Authentication Errors
```json
{
  "error": "Not authenticated",
  "message": "Please login to access this resource"
}
```

### Validation Errors
```json
{
  "error": "Validation error",
  "details": [
    "Email is required",
    "Password must be at least 6 characters"
  ]
}
```

### Resource Not Found Errors
```json
{
  "success": false,
  "message": "Topic \"Python\" not found in user progress"
}
```

---

## Rate Limiting
- **Authentication endpoints:** 10 requests per minute per IP
- **Content generation endpoints:** 20 requests per minute per user
- **Other endpoints:** 100 requests per minute per user

When rate limit is exceeded:
```json
{
  "error": "Rate limit exceeded",
  "retryAfter": 60
}
```

---

## Best Practices

### 1. Authentication
- Always include JWT token in requests
- Refresh token before expiration
- Clear tokens on logout

### 2. Content Generation
- Use cached content when available (check `cached: true`)
- Only regenerate when necessary (user requests it)
- Monitor generation count to avoid excessive API calls

### 3. Progress Tracking
- Update understanding level after content review
- Submit quiz marks to auto-calculate understanding
- Mark subtopics complete after mastery

### 4. Error Handling
- Always check response status codes
- Handle 401 errors by redirecting to login
- Display user-friendly error messages from API responses

### 5. Performance
- Batch requests when possible
- Cache responses on client-side
- Use query parameters for filtering

---

## Versioning
Current API version: **v1**

Version is specified in the base URL: `/api/v1/`

Future versions will be released as `/api/v2/`, etc., maintaining backward compatibility.

---

## Support
For API support and questions:
- Email: support@guidra.com
- Documentation: https://docs.guidra.com
- GitHub Issues: https://github.com/guidra/guidra-platform/issues

---

**Last Updated:** January 2024  
**API Version:** 1.0.0
