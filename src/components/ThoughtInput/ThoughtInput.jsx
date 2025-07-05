import React, { useState, useRef, useEffect } from 'react'
import { useThoughts } from '../../hooks'
import './ThoughtInput.css'

const ThoughtInput = () => {
  const [content, setContent] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const textareaRef = useRef(null)
  const { addThought } = useThoughts()

  const characterCount = content.length
  const hasContent = content.trim().length > 0

  const handleSave = () => {
    if (!hasContent) return

    addThought(content.trim())
    setContent('')
    setShowSuccess(true)
    
    // Hide success message after 3 seconds
    setTimeout(() => setShowSuccess(false), 3000)
    
    // Focus back to textarea
    textareaRef.current?.focus()
  }

  const handleClear = () => {
    setContent('')
    textareaRef.current?.focus()
  }

  const handleKeyDown = (e) => {
    // Ctrl/Cmd + Enter to save
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      handleSave()
    }
  }

  useEffect(() => {
    // Focus textarea on component mount
    textareaRef.current?.focus()
  }, [])

  return (
    <div className="thought-input">
      <div className="thought-input-header">
        <h2>Capture Your Thoughts</h2>
        <div className="character-count">
          {characterCount} characters
        </div>
      </div>
      
      <textarea
        ref={textareaRef}
        className="thought-textarea"
        placeholder="What's on your mind? Type your thoughts here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={6}
        maxLength={5000}
      />
      
      <div className="thought-input-actions">
        <button
          className="btn btn-secondary"
          onClick={handleClear}
          disabled={!content}
        >
          Clear
        </button>
        
        <button
          className="btn btn-primary"
          onClick={handleSave}
          disabled={!hasContent}
        >
          Save Thought
        </button>
      </div>
      
      <div className="thought-input-help">
        <small>Tip: Press Ctrl/Cmd + Enter to save quickly</small>
      </div>
      
      {showSuccess && (
        <div className="success-message">
          ✅ Thought saved successfully!
        </div>
      )}
    </div>
  )
}

export default ThoughtInput
