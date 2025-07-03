# MindDump - Thought Capture App

A simple, anonymous thought capture application that helps you record your thoughts and visualize word patterns through dynamic word clouds and analytics.

## 🧠 Features

- **Quick Thought Capture**: Simple text area with manual save functionality
- **Word Cloud Visualization**: Dynamic word clouds based on your thought patterns
- **Search & Filter**: Find specific thoughts by keywords
- **Analytics**: Track word usage and thought patterns over time
- **No Login Required**: Anonymous usage with session-based data
- **Offline-First**: Works without internet connection using localStorage

## 🚀 Quick Start

### MVP Version (Static)
1. Clone the repository
2. Open `index.html` in your browser
3. Start capturing thoughts!

### Development Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/minddump.git
cd minddump

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

## 📁 Project Structure

```
MindDump/
├── ARCHITECTURE.md          # Detailed technical documentation
├── README.md               # This file
├── docs/                   # Additional documentation
│   ├── database-schema.sql
│   ├── api-specification.yaml
│   └── component-guide.md
├── src/                    # Source code
│   ├── components/         # React components
│   ├── services/          # API and storage services
│   ├── utils/             # Utility functions
│   ├── hooks/             # Custom React hooks
│   └── styles/            # CSS files
├── public/                # Static assets
└── tests/                 # Test files
```

## 🎯 MVP Components Demo

### Component 1: Thought Input
- **Demo**: Type a thought → Click "Save Thought" → See confirmation
- **Features**: Character count, save/clear buttons, validation

### Component 2: Thought Display
- **Demo**: View saved thoughts in chronological order
- **Features**: Timestamps, clean formatting, scroll through history

### Component 3: Word Cloud
- **Demo**: Watch word cloud update as you add thoughts
- **Features**: Word frequency visualization, interactive elements

### Component 4: Search
- **Demo**: Search for specific words in your thoughts
- **Features**: Keyword highlighting, real-time filtering

## 🛠 Technology Stack

### Frontend
- **React 18** - Component framework
- **Vite** - Build tool and dev server
- **CSS Modules** - Scoped styling
- **Canvas API** - Word cloud rendering

### Backend (Optional)
- **Node.js + Express** - API server
- **SQLite/PostgreSQL** - Database
- **Prisma** - Database ORM

### Storage
- **localStorage** - MVP data persistence
- **Database** - Production data storage

## 📊 Data Structure

### LocalStorage (MVP)
```javascript
{
  "mindump_session": "uuid-v4",
  "mindump_thoughts": [
    {
      "id": "uuid-v4",
      "content": "Your thought here",
      "timestamp": "2025-01-03T18:13:57Z",
      "wordCount": 7,
      "charCount": 42
    }
  ],
  "mindump_wordfreq": {
    "word1": 5,
    "word2": 3,
    "word3": 8
  }
}
```

## 🔧 Development Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Testing
npm run test         # Run unit tests
npm run test:e2e     # Run end-to-end tests
npm run test:watch   # Run tests in watch mode

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run type-check   # TypeScript type checking
```

## 🚀 Deployment

### Static Deployment (MVP)
```bash
npm run build
# Deploy dist/ folder to Netlify, Vercel, or GitHub Pages
```

### Full Stack Deployment
1. **Frontend**: Deploy to Vercel/Netlify
2. **Backend**: Deploy to Railway/Render
3. **Database**: Use PlanetScale/Supabase

## 📈 Roadmap

### Phase 1: MVP ✅
- [x] Architecture design
- [ ] Basic thought input
- [ ] LocalStorage integration
- [ ] Simple word cloud
- [ ] Search functionality

### Phase 2: Enhanced Features
- [ ] Backend API
- [ ] Database integration
- [ ] Advanced analytics
- [ ] Export functionality
- [ ] Mobile optimization

### Phase 3: Production
- [ ] Performance optimization
- [ ] Testing suite
- [ ] Documentation
- [ ] Deployment automation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔒 Privacy

- **No personal data collected**
- **No user accounts required**
- **Data stays in your browser** (MVP version)
- **Session-based isolation**
- **Optional data export**

## 📚 Documentation

- [Architecture Design Document](ARCHITECTURE.md) - Detailed technical specifications
- [Component Guide](docs/component-guide.md) - Component documentation
- [API Specification](docs/api-specification.yaml) - API endpoints and schemas
- [Database Schema](docs/database-schema.sql) - Database structure

## 🐛 Issues & Support

- Report bugs via [GitHub Issues](https://github.com/yourusername/minddump/issues)
- Feature requests welcome
- Check existing issues before creating new ones

---

**Built with ❤️ for capturing thoughts and visualizing ideas**
