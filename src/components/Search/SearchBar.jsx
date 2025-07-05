import React, { useState, useRef, useEffect } from 'react'
import { useThoughts } from '../../hooks'
import './SearchBar.css'

const SearchBar = () => {
  const [localQuery, setLocalQuery] = useState('')
  const searchInputRef = useRef(null)
  const { searchThoughts, clearSearch, searchQuery, isSearching, hasThoughts } = useThoughts()

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchThoughts(localQuery)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [localQuery, searchThoughts])

  // Sync local state with context when search is cleared externally
  useEffect(() => {
    if (!searchQuery && localQuery) {
      setLocalQuery('')
    }
  }, [searchQuery, localQuery])

  const handleInputChange = (e) => {
    setLocalQuery(e.target.value)
  }

  const handleClear = () => {
    setLocalQuery('')
    clearSearch()
    searchInputRef.current?.focus()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleClear()
    }
  }

  if (!hasThoughts) {
    return null // Don't show search when there are no thoughts
  }

  return (
    <div className="search-bar">
      <div className="search-input-container">
        <div className="search-icon">🔍</div>
        <input
          ref={searchInputRef}
          type="text"
          className="search-input"
          placeholder="Search your thoughts..."
          value={localQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        {(localQuery || isSearching) && (
          <button
            className="search-clear-btn"
            onClick={handleClear}
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>
      
      {isSearching && (
        <div className="search-status">
          <span className="search-status-text">
            Searching for "{searchQuery}"
          </span>
        </div>
      )}
    </div>
  )
}

export default SearchBar
