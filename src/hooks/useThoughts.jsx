import React, { createContext, useContext, useState, useEffect } from 'react'
import storageService from '../services/storage.js'

const ThoughtContext = createContext()

export const useThoughts = () => {
  const context = useContext(ThoughtContext)
  if (!context) {
    throw new Error('useThoughts must be used within a ThoughtProvider')
  }
  return context
}

export const ThoughtProvider = ({ children }) => {
  const [thoughts, setThoughts] = useState([])
  const [wordFrequency, setWordFrequency] = useState({})
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredThoughts, setFilteredThoughts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Load initial data
  useEffect(() => {
    const loadData = () => {
      try {
        const loadedThoughts = storageService.getThoughts()
        const loadedWordFreq = storageService.getWordFrequency()
        
        setThoughts(loadedThoughts)
        setWordFrequency(loadedWordFreq)
        setFilteredThoughts(loadedThoughts)
        setIsLoading(false)
      } catch (error) {
        console.error('Error loading data:', error)
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Update filtered thoughts when search query or thoughts change
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredThoughts(thoughts)
    } else {
      const filtered = storageService.searchThoughts(searchQuery)
      setFilteredThoughts(filtered)
    }
  }, [searchQuery, thoughts])

  const addThought = (content) => {
    try {
      const newThought = storageService.saveThought(content)
      const updatedThoughts = [newThought, ...thoughts]
      const updatedWordFreq = storageService.getWordFrequency()
      
      setThoughts(updatedThoughts)
      setWordFrequency(updatedWordFreq)
      
      return newThought
    } catch (error) {
      console.error('Error adding thought:', error)
      throw error
    }
  }

  const deleteThought = (thoughtId) => {
    try {
      const updatedThoughts = storageService.deleteThought(thoughtId)
      const updatedWordFreq = storageService.getWordFrequency()
      
      setThoughts(updatedThoughts)
      setWordFrequency(updatedWordFreq)
      
      return updatedThoughts
    } catch (error) {
      console.error('Error deleting thought:', error)
      throw error
    }
  }

  const searchThoughts = (query) => {
    setSearchQuery(query)
  }

  const clearSearch = () => {
    setSearchQuery('')
  }

  const getAnalytics = () => {
    return storageService.getAnalytics()
  }

  const exportData = () => {
    return storageService.exportData()
  }

  const importData = (data) => {
    try {
      const success = storageService.importData(data)
      if (success) {
        // Reload data after import
        const loadedThoughts = storageService.getThoughts()
        const loadedWordFreq = storageService.getWordFrequency()
        
        setThoughts(loadedThoughts)
        setWordFrequency(loadedWordFreq)
        setFilteredThoughts(loadedThoughts)
        setSearchQuery('')
      }
      return success
    } catch (error) {
      console.error('Error importing data:', error)
      return false
    }
  }

  const clearAllData = () => {
    try {
      storageService.clearAllData()
      setThoughts([])
      setWordFrequency({})
      setFilteredThoughts([])
      setSearchQuery('')
    } catch (error) {
      console.error('Error clearing data:', error)
      throw error
    }
  }

  const getStorageUsage = () => {
    return storageService.getStorageUsage()
  }

  const value = {
    // State
    thoughts,
    wordFrequency,
    searchQuery,
    filteredThoughts,
    isLoading,
    
    // Actions
    addThought,
    deleteThought,
    searchThoughts,
    clearSearch,
    
    // Analytics & Data Management
    getAnalytics,
    exportData,
    importData,
    clearAllData,
    getStorageUsage,
    
    // Computed values
    thoughtCount: thoughts.length,
    hasThoughts: thoughts.length > 0,
    hasSearchResults: filteredThoughts.length > 0,
    isSearching: searchQuery.trim().length > 0
  }

  return (
    <ThoughtContext.Provider value={value}>
      {children}
    </ThoughtContext.Provider>
  )
}

export default ThoughtContext
