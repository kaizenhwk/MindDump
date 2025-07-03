# MindDump Architecture Design Document

## Table of Contents
1. [System Overview](#1-system-overview)
2. [System Architecture](#2-system-architecture)
3. [Database Design](#3-database-design)
4. [API Design](#4-api-design)
5. [Technology Stack](#5-technology-stack)
6. [Performance Considerations](#6-performance-considerations)
7. [Security & Privacy](#7-security--privacy)
8. [Deployment Strategy](#8-deployment-strategy)

## 1. System Overview

### 1.1 Purpose
MindDump is a thought capture application that allows users to quickly record thoughts and visualize word patterns through word clouds and heatmaps without requiring user authentication.

### 1.2 Key Features
- **Thought Input**: Simple text area with manual save functionality
- **Word Visualization**: Dynamic word clouds and heatmaps based on word frequency
- **Search & Filter**: Find thoughts by keywords and date ranges
- **Analytics**: Word usage statistics and thought patterns
- **No Authentication**: Anonymous usage with session-based data isolation

### 1.3 Architecture Pattern
- **Frontend**: Single Page Application (SPA)
- **Backend**: RESTful API with optional offline-first approach
- **Database**: Hybrid approach (localStorage for MVP, database for production)
- **Deployment**: Static hosting with optional serverless backend

## 2. System Architecture

### 2.1 High-Level Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   (React/JS)    │◄──►│   (Node.js)     │◄──►│   (SQLite/PG)   │
│                 │    │                 │    │                 │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │ Input       │ │    │ │ Thoughts    │ │    │ │ thoughts    │ │
│ │ Component   │ │    │ │ Controller  │ │    │ │ table       │ │
│ └─────────────┘ │    │ └─────────────┘ │    │ └─────────────┘ │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │ WordCloud   │ │    │ │ Analytics   │ │    │ │ word_freq   │ │
│ │ Component   │ │    │ │ Controller  │ │    │ │ table       │ │
│ └─────────────┘ │    │ └─────────────┘ │    │ └─────────────┘ │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │ Search      │ │    │ │ Search      │ │    │ │ sessions    │ │
│ │ Component   │ │    │ │ Controller  │ │    │ │ table       │ │
│ └─────────────┘ │    │ └─────────────┘ │    │ └─────────────┘ │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 2.2 MVP Component Architecture

#### Frontend Structure
```
src/
├── components/
│   ├── ThoughtInput/
│   │   ├── ThoughtInput.jsx
│   │   ├── ThoughtInput.css
│   │   └── ThoughtInput.test.js
│   ├── ThoughtList/
│   │   ├── ThoughtList.jsx
│   │   ├── ThoughtItem.jsx
│   │   └── ThoughtList.css
│   ├── WordCloud/
│   │   ├── WordCloud.jsx
│   │   ├── WordCloudCanvas.js
│   │   └── WordCloud.css
│   ├── Search/
│   │   ├── SearchBar.jsx
│   │   └── SearchResults.jsx
│   └── Analytics/
│       ├── WordFrequency.jsx
│       └── ThoughtStats.jsx
├── services/
│   ├── api.js
│   ├── storage.js
│   └── wordProcessor.js
├── utils/
│   ├── dateHelpers.js
│   ├── textAnalysis.js
│   └── constants.js
├── hooks/
│   ├── useThoughts.js
│   ├── useWordCloud.js
│   └── useLocalStorage.js
└── styles/
    ├── main.css
    ├── components.css
    └── themes.css
```

### 2.3 Modular MVP Components

#### Component 1: Thought Input Module
- **Purpose**: Capture user thoughts with manual save
- **Features**: Text area, character count, save/clear buttons
- **Demo**: Type → Save → Clear functionality

#### Component 2: Thought Display Module
- **Purpose**: Show saved thoughts chronologically
- **Features**: Timestamp display, basic styling
- **Demo**: View saved thoughts in order

#### Component 3: Word Cloud Visualization
- **Purpose**: Visual representation of word frequency
- **Features**: Dynamic sizing, color coding, interactivity
- **Demo**: Watch cloud update as thoughts are added

#### Component 4: Basic Search
- **Purpose**: Find specific thoughts
- **Features**: Keyword search, text highlighting
- **Demo**: Search and filter functionality

## 3. Database Design

### 3.1 Entity Relationship Diagram
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│    sessions     │    │    thoughts     │    │   word_freq     │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ session_id (PK) │◄──┐│ thought_id (PK) │┌──►│ word_id (PK)    │
│ created_at      │   ││ session_id (FK) ││   │ word            │
│ last_active     │   ││ content         ││   │ frequency       │
│ device_info     │   ││ created_at      ││   │ session_id (FK) │
│ settings        │   ││ word_count      ││   │ last_used       │
└─────────────────┘   ││ char_count      ││   └─────────────────┘
                      ││ sentiment_score ││
                      │└─────────────────┘│
                      │                   │
                      │ ┌─────────────────┐│
                      │ │      tags       ││
                      │ ├─────────────────┤│
                      │ │ tag_id (PK)     ││
                      │ │ thought_id (FK) ││
                      │ │ tag_name        ││
                      │ │ created_at      ││
                      │ └─────────────────┘│
                      └────────────────────┘
```

### 3.2 Database Schema

#### 3.2.1 Sessions Table
```sql
CREATE TABLE sessions (
    session_id VARCHAR(36) PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    device_info JSON,
    settings JSON DEFAULT '{"theme": "light", "wordcloud_style": "default"}',
    INDEX idx_last_active (last_active)
);
```

#### 3.2.2 Thoughts Table
```sql
CREATE TABLE thoughts (
    thought_id VARCHAR(36) PRIMARY KEY,
    session_id VARCHAR(36) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    word_count INTEGER,
    char_count INTEGER,
    sentiment_score DECIMAL(3,2),
    is_deleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (session_id) REFERENCES sessions(session_id),
    INDEX idx_session_created (session_id, created_at),
    INDEX idx_content_search (content(100)),
    FULLTEXT INDEX idx_content_fulltext (content)
);
```

#### 3.2.3 Word Frequency Table
```sql
CREATE TABLE word_freq (
    word_id VARCHAR(36) PRIMARY KEY,
    session_id VARCHAR(36) NOT NULL,
    word VARCHAR(100) NOT NULL,
    frequency INTEGER DEFAULT 1,
    first_used TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_used TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES sessions(session_id),
    UNIQUE KEY unique_session_word (session_id, word),
    INDEX idx_frequency (session_id, frequency DESC),
    INDEX idx_word_lookup (word)
);
```

#### 3.2.4 Tags Table
```sql
CREATE TABLE tags (
    tag_id VARCHAR(36) PRIMARY KEY,
    thought_id VARCHAR(36) NOT NULL,
    tag_name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (thought_id) REFERENCES thoughts(thought_id) ON DELETE CASCADE,
    INDEX idx_tag_name (tag_name),
    INDEX idx_thought_tags (thought_id)
);
```

### 3.3 Data Access Patterns

#### 3.3.1 Read Patterns
```sql
-- Get Recent Thoughts
SELECT * FROM thoughts 
WHERE session_id = ? AND is_deleted = FALSE 
ORDER BY created_at DESC 
LIMIT 50;

-- Word Cloud Data
SELECT word, frequency 
FROM word_freq 
WHERE session_id = ? 
ORDER BY frequency DESC 
LIMIT 100;

-- Search Thoughts
SELECT * FROM thoughts 
WHERE session_id = ? 
  AND is_deleted = FALSE 
  AND MATCH(content) AGAINST(? IN NATURAL LANGUAGE MODE)
ORDER BY created_at DESC;

-- Analytics Data
SELECT 
  COUNT(*) as total_thoughts,
  SUM(word_count) as total_words,
  AVG(word_count) as avg_words_per_thought,
  DATE(created_at) as date,
  COUNT(*) as thoughts_per_day
FROM thoughts 
WHERE session_id = ? AND is_deleted = FALSE
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

#### 3.3.2 Write Patterns
```sql
-- Insert Thought (with word frequency update)
BEGIN TRANSACTION;

INSERT INTO thoughts (thought_id, session_id, content, word_count, char_count)
VALUES (?, ?, ?, ?, ?);

-- Update word frequencies
INSERT INTO word_freq (word_id, session_id, word, frequency, first_used, last_used)
VALUES (?, ?, ?, 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE 
  frequency = frequency + 1,
  last_used = NOW();

COMMIT;
```

### 3.4 LocalStorage Schema (MVP)
```javascript
// localStorage structure for MVP
{
  "mindump_session": "uuid-v4",
  "mindump_thoughts": [
    {
      "id": "uuid-v4",
      "content": "thought text",
      "timestamp": "2025-01-03T18:13:57Z",
      "wordCount": 7,
      "charCount": 42
    }
  ],
  "mindump_wordfreq": {
    "programming": 12,
    "thought": 8,
    "idea": 6
  },
  "mindump_settings": {
    "theme": "light",
    "wordcloudStyle": "default"
  }
}
```

## 4. API Design

### 4.1 REST Endpoints

#### Session Management
```
POST   /api/sessions              # Create new session
GET    /api/sessions/:id          # Get session info
PUT    /api/sessions/:id          # Update session settings
```

#### Thought Management
```
POST   /api/thoughts              # Create new thought
GET    /api/thoughts              # Get thoughts (with pagination)
GET    /api/thoughts/:id          # Get specific thought
PUT    /api/thoughts/:id          # Update thought
DELETE /api/thoughts/:id          # Delete thought
GET    /api/thoughts/search       # Search thoughts
```

#### Analytics
```
GET    /api/analytics/wordcloud   # Get word cloud data
GET    /api/analytics/stats       # Get session statistics
GET    /api/analytics/trends      # Get usage trends
```

### 4.2 Request/Response Examples

#### Create Session
```json
POST /api/sessions
{
  "device_info": {
    "user_agent": "Mozilla/5.0...",
    "screen_resolution": "1920x1080",
    "timezone": "America/Chicago"
  }
}

Response:
{
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "created_at": "2025-01-03T18:13:57Z",
  "settings": {
    "theme": "light",
    "wordcloud_style": "default"
  }
}
```

#### Create Thought
```json
POST /api/thoughts
{
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "content": "This is my thought about programming and creativity"
}

Response:
{
  "thought_id": "660e8400-e29b-41d4-a716-446655440001",
  "content": "This is my thought about programming and creativity",
  "created_at": "2025-01-03T18:13:57Z",
  "word_count": 9,
  "char_count": 52,
  "sentiment_score": 0.75
}
```

#### Get Word Cloud Data
```json
GET /api/analytics/wordcloud?session_id=550e8400-e29b-41d4-a716-446655440000

Response:
{
  "words": [
    {"text": "programming", "size": 45, "frequency": 12, "color": "#1f77b4"},
    {"text": "creativity", "size": 35, "frequency": 9, "color": "#ff7f0e"},
    {"text": "thought", "size": 30, "frequency": 8, "color": "#2ca02c"},
    {"text": "idea", "size": 25, "frequency": 6, "color": "#d62728"}
  ],
  "total_words": 150,
  "unique_words": 89,
  "generated_at": "2025-01-03T18:13:57Z"
}
```

#### Search Thoughts
```json
GET /api/thoughts/search?session_id=550e8400-e29b-41d4-a716-446655440000&q=programming&limit=10

Response:
{
  "thoughts": [
    {
      "thought_id": "660e8400-e29b-41d4-a716-446655440001",
      "content": "This is my thought about programming and creativity",
      "created_at": "2025-01-03T18:13:57Z",
      "word_count": 9,
      "highlight": "This is my thought about <mark>programming</mark> and creativity"
    }
  ],
  "total_results": 1,
  "page": 1,
  "limit": 10
}
```

### 4.3 Error Responses
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Content cannot be empty",
    "details": {
      "field": "content",
      "constraint": "required"
    }
  },
  "timestamp": "2025-01-03T18:13:57Z"
}
```

## 5. Technology Stack

### 5.1 Frontend
- **Framework**: React 18 with Hooks
- **Styling**: CSS Modules + Tailwind CSS
- **State Management**: React Context + useReducer
- **Word Cloud**: Custom Canvas implementation or D3.js
- **Build Tool**: Vite
- **Testing**: Jest + React Testing Library
- **Type Safety**: TypeScript (optional)

### 5.2 Backend (Optional for MVP)
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: SQLite (development) / PostgreSQL (production)
- **ORM**: Prisma or raw SQL with prepared statements
- **Validation**: Joi or Zod
- **Testing**: Jest + Supertest
- **Documentation**: Swagger/OpenAPI

### 5.3 Development Tools
- **Package Manager**: npm or yarn
- **Code Formatting**: Prettier
- **Linting**: ESLint
- **Git Hooks**: Husky + lint-staged
- **CI/CD**: GitHub Actions

### 5.4 Deployment
- **Frontend**: Vercel, Netlify, or GitHub Pages
- **Backend**: Railway, Render, or AWS Lambda
- **Database**: PlanetScale, Supabase, or AWS RDS
- **CDN**: Cloudflare (for static assets)

## 6. Performance Considerations

### 6.1 Frontend Optimizations
- **Debounced Search**: 300ms delay on search input
- **Virtual Scrolling**: For large thought lists (>100 items)
- **Memoized Calculations**: Word cloud data processing
- **Lazy Loading**: Components loaded on demand
- **Code Splitting**: Route-based chunks
- **Image Optimization**: WebP format for any graphics

### 6.2 Backend Optimizations
- **Database Indexing**: On frequently queried columns
- **Query Optimization**: Use EXPLAIN to analyze slow queries
- **Caching Strategy**: Redis for word frequency calculations
- **Pagination**: Limit results to 50 items per page
- **Rate Limiting**: 100 requests per minute per session
- **Compression**: Gzip for API responses

### 6.3 Storage Optimizations
- **LocalStorage Limits**: Monitor 5MB browser limit
- **Data Cleanup**: Remove old sessions after 30 days
- **Compression**: LZ-string for large text content
- **Batch Operations**: Group multiple word frequency updates

## 7. Security & Privacy

### 7.1 Data Privacy
- **No Personal Information**: No names, emails, or identifiers
- **Session Isolation**: Data scoped to session ID only
- **Data Retention**: Optional automatic cleanup after 30 days
- **Local-First**: Sensitive thoughts stay in browser
- **Export Control**: Users can download their data

### 7.2 Security Measures
- **Input Sanitization**: HTML encoding for all user content
- **XSS Protection**: Content Security Policy headers
- **CORS Configuration**: Restrict to known domains
- **Rate Limiting**: Prevent abuse and spam
- **SQL Injection**: Parameterized queries only
- **HTTPS Only**: Force secure connections

### 7.3 Content Security Policy
```
Content-Security-Policy: 
  default-src 'self'; 
  script-src 'self' 'unsafe-inline'; 
  style-src 'self' 'unsafe-inline'; 
  img-src 'self' data:; 
  connect-src 'self' https://api.minddump.app;
```

## 8. Deployment Strategy

### 8.1 MVP Deployment (Static Only)
```
Frontend Only:
├── Build with Vite
├── Deploy to Netlify/Vercel
├── Use localStorage for data
└── No backend required
```

### 8.2 Production Deployment
```
Full Stack:
├── Frontend: Vercel/Netlify
├── Backend: Railway/Render
├── Database: PlanetScale/Supabase
├── CDN: Cloudflare
└── Monitoring: Sentry
```

### 8.3 Environment Configuration
```javascript
// config/environments.js
export const config = {
  development: {
    API_URL: 'http://localhost:3001',
    STORAGE_TYPE: 'localStorage'
  },
  production: {
    API_URL: 'https://api.minddump.app',
    STORAGE_TYPE: 'api'
  }
};
```

## 9. Development Roadmap

### Phase 1: MVP (Week 1-2)
- [ ] Basic thought input component
- [ ] LocalStorage integration
- [ ] Simple thought list display
- [ ] Basic word cloud visualization
- [ ] Search functionality

### Phase 2: Enhanced Features (Week 3-4)
- [ ] Backend API development
- [ ] Database integration
- [ ] Advanced word cloud styling
- [ ] Analytics dashboard
- [ ] Export functionality

### Phase 3: Polish & Deploy (Week 5-6)
- [ ] Performance optimizations
- [ ] Mobile responsiveness
- [ ] Testing suite
- [ ] Documentation
- [ ] Production deployment

## 10. Testing Strategy

### 10.1 Unit Tests
- Component rendering
- Utility functions
- Data processing logic
- API endpoints

### 10.2 Integration Tests
- Component interactions
- API integration
- Database operations
- LocalStorage operations

### 10.3 E2E Tests
- Complete user workflows
- Cross-browser compatibility
- Mobile device testing
- Performance benchmarks

---

**Document Version**: 1.0  
**Last Updated**: January 3, 2025  
**Next Review**: January 17, 2025
