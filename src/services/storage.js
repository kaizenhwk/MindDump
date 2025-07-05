import { v4 as uuidv4 } from 'uuid'

const STORAGE_KEYS = {
  SESSION: 'mindump_session',
  THOUGHTS: 'mindump_thoughts',
  WORD_FREQ: 'mindump_wordfreq',
  SETTINGS: 'mindump_settings'
}

class StorageService {
  constructor() {
    this.initializeSession()
  }

  // Session Management
  initializeSession() {
    let sessionId = localStorage.getItem(STORAGE_KEYS.SESSION)
    if (!sessionId) {
      sessionId = uuidv4()
      localStorage.setItem(STORAGE_KEYS.SESSION, sessionId)
    }
    return sessionId
  }

  getSessionId() {
    return localStorage.getItem(STORAGE_KEYS.SESSION)
  }

  // Thoughts Management
  saveThought(content) {
    const thought = {
      id: uuidv4(),
      content: content.trim(),
      timestamp: new Date().toISOString(),
      wordCount: this.countWords(content),
      charCount: content.length
    }

    const thoughts = this.getThoughts()
    thoughts.unshift(thought) // Add to beginning for newest first
    
    localStorage.setItem(STORAGE_KEYS.THOUGHTS, JSON.stringify(thoughts))
    
    // Update word frequency
    this.updateWordFrequency(content)
    
    return thought
  }

  getThoughts() {
    try {
      const thoughts = localStorage.getItem(STORAGE_KEYS.THOUGHTS)
      return thoughts ? JSON.parse(thoughts) : []
    } catch (error) {
      console.error('Error loading thoughts:', error)
      return []
    }
  }

  deleteThought(thoughtId) {
    const thoughts = this.getThoughts()
    const updatedThoughts = thoughts.filter(thought => thought.id !== thoughtId)
    localStorage.setItem(STORAGE_KEYS.THOUGHTS, JSON.stringify(updatedThoughts))
    
    // Recalculate word frequency
    this.recalculateWordFrequency()
    
    return updatedThoughts
  }

  searchThoughts(query) {
    if (!query.trim()) return this.getThoughts()
    
    const thoughts = this.getThoughts()
    const searchTerm = query.toLowerCase()
    
    return thoughts.filter(thought => 
      thought.content.toLowerCase().includes(searchTerm)
    )
  }

  // Word Frequency Management
  updateWordFrequency(content) {
    const words = this.extractWords(content)
    const wordFreq = this.getWordFrequency()
    
    words.forEach(word => {
      wordFreq[word] = (wordFreq[word] || 0) + 1
    })
    
    localStorage.setItem(STORAGE_KEYS.WORD_FREQ, JSON.stringify(wordFreq))
  }

  recalculateWordFrequency() {
    const thoughts = this.getThoughts()
    const wordFreq = {}
    
    thoughts.forEach(thought => {
      const words = this.extractWords(thought.content)
      words.forEach(word => {
        wordFreq[word] = (wordFreq[word] || 0) + 1
      })
    })
    
    localStorage.setItem(STORAGE_KEYS.WORD_FREQ, JSON.stringify(wordFreq))
    return wordFreq
  }

  getWordFrequency() {
    try {
      const wordFreq = localStorage.getItem(STORAGE_KEYS.WORD_FREQ)
      return wordFreq ? JSON.parse(wordFreq) : {}
    } catch (error) {
      console.error('Error loading word frequency:', error)
      return {}
    }
  }

  // Settings Management
  getSettings() {
    try {
      const settings = localStorage.getItem(STORAGE_KEYS.SETTINGS)
      return settings ? JSON.parse(settings) : {
        theme: 'light',
        wordcloudStyle: 'default'
      }
    } catch (error) {
      console.error('Error loading settings:', error)
      return { theme: 'light', wordcloudStyle: 'default' }
    }
  }

  saveSettings(settings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings))
  }

  // Utility Methods
  extractWords(text) {
    // Remove punctuation and split into words
    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2) // Filter out short words
      .filter(word => !this.isStopWord(word))
    
    return words
  }

  isStopWord(word) {
    const stopWords = new Set([
      'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
      'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before',
      'after', 'above', 'below', 'between', 'among', 'this', 'that', 'these',
      'those', 'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves',
      'you', 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his',
      'himself', 'she', 'her', 'hers', 'herself', 'it', 'its', 'itself',
      'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which',
      'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are',
      'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having',
      'do', 'does', 'did', 'doing', 'a', 'an', 'as', 'if', 'each', 'how',
      'when', 'where', 'why', 'all', 'any', 'both', 'each', 'few', 'more',
      'most', 'other', 'some', 'such', 'only', 'own', 'same', 'so', 'than',
      'too', 'very', 'can', 'will', 'just', 'should', 'now'
    ])
    
    return stopWords.has(word)
  }

  countWords(text) {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length
  }

  // Analytics
  getAnalytics() {
    const thoughts = this.getThoughts()
    const wordFreq = this.getWordFrequency()
    
    const totalThoughts = thoughts.length
    const totalWords = thoughts.reduce((sum, thought) => sum + thought.wordCount, 0)
    const avgWordsPerThought = totalThoughts > 0 ? Math.round(totalWords / totalThoughts) : 0
    
    // Find most active day
    const dayCount = {}
    thoughts.forEach(thought => {
      const date = new Date(thought.timestamp).toDateString()
      dayCount[date] = (dayCount[date] || 0) + 1
    })
    
    const mostActiveDay = Object.keys(dayCount).reduce((a, b) => 
      dayCount[a] > dayCount[b] ? a : b, null
    )
    
    return {
      totalThoughts,
      totalWords,
      avgWordsPerThought,
      mostActiveDay,
      uniqueWords: Object.keys(wordFreq).length,
      topWords: Object.entries(wordFreq)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([word, freq]) => ({ word, frequency: freq }))
    }
  }

  // Data Export/Import
  exportData() {
    return {
      session: this.getSessionId(),
      thoughts: this.getThoughts(),
      wordFrequency: this.getWordFrequency(),
      settings: this.getSettings(),
      exportDate: new Date().toISOString()
    }
  }

  importData(data) {
    try {
      if (data.thoughts) {
        localStorage.setItem(STORAGE_KEYS.THOUGHTS, JSON.stringify(data.thoughts))
      }
      if (data.wordFrequency) {
        localStorage.setItem(STORAGE_KEYS.WORD_FREQ, JSON.stringify(data.wordFrequency))
      }
      if (data.settings) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings))
      }
      return true
    } catch (error) {
      console.error('Error importing data:', error)
      return false
    }
  }

  // Clear all data
  clearAllData() {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key)
    })
    this.initializeSession()
  }

  // Check storage usage
  getStorageUsage() {
    let totalSize = 0
    Object.values(STORAGE_KEYS).forEach(key => {
      const item = localStorage.getItem(key)
      if (item) {
        totalSize += item.length
      }
    })
    
    // Convert to KB
    return Math.round(totalSize / 1024 * 100) / 100
  }
}

// Create singleton instance
const storageService = new StorageService()

export default storageService
