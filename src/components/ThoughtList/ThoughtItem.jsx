import React, { useState } from 'react'
import { useThoughts } from '../../hooks'

const ThoughtItem = ({ thought, searchQuery }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const { deleteThought } = useThoughts()

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now - date) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60))
      return diffInMinutes <= 1 ? 'Just now' : `${diffInMinutes} minutes ago`
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours)
      return `${hours} hour${hours > 1 ? 's' : ''} ago`
    } else if (diffInHours < 168) { // 7 days
      const days = Math.floor(diffInHours / 24)
      return `${days} day${days > 1 ? 's' : ''} ago`
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  const highlightSearchTerm = (text, searchTerm) => {
    if (!searchTerm) return text

    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    const parts = text.split(regex)

    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="search-highlight">{part}</mark>
      ) : part
    )
  }

  const handleDelete = () => {
    deleteThought(thought.id)
    setShowDeleteConfirm(false)
  }

  const handleDeleteClick = (e) => {
    e.stopPropagation()
    setShowDeleteConfirm(true)
  }

  const handleCancelDelete = (e) => {
    e.stopPropagation()
    setShowDeleteConfirm(false)
  }

  return (
    <div className="thought-item">
      <div className="thought-content">
        <p>{highlightSearchTerm(thought.content, searchQuery)}</p>
      </div>
      
      <div className="thought-meta">
        <div className="thought-stats">
          <span className="word-count">{thought.wordCount} words</span>
          <span className="char-count">{thought.charCount} characters</span>
          <span className="timestamp">{formatTimestamp(thought.timestamp)}</span>
        </div>
        
        <div className="thought-actions">
          {!showDeleteConfirm ? (
            <button 
              className="delete-btn"
              onClick={handleDeleteClick}
              title="Delete thought"
            >
              🗑️
            </button>
          ) : (
            <div className="delete-confirm">
              <span className="delete-confirm-text">Delete?</span>
              <button 
                className="confirm-btn"
                onClick={handleDelete}
                title="Confirm delete"
              >
                ✓
              </button>
              <button 
                className="cancel-btn"
                onClick={handleCancelDelete}
                title="Cancel delete"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ThoughtItem
