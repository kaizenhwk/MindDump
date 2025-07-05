import React from 'react'
import { useThoughts } from '../../hooks'
import ThoughtItem from './ThoughtItem.jsx'
import './ThoughtList.css'

const ThoughtList = () => {
  const { filteredThoughts, isLoading, hasThoughts, isSearching, searchQuery } = useThoughts()

  if (isLoading) {
    return (
      <div className="thought-list">
        <div className="thought-list-header">
          <h3>Your Thoughts</h3>
        </div>
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading your thoughts...</p>
        </div>
      </div>
    )
  }

  if (!hasThoughts) {
    return (
      <div className="thought-list">
        <div className="thought-list-header">
          <h3>Your Thoughts</h3>
        </div>
        <div className="empty-state">
          <div className="empty-icon">💭</div>
          <h4>No thoughts yet</h4>
          <p>Start by writing your first thought above!</p>
        </div>
      </div>
    )
  }

  if (isSearching && filteredThoughts.length === 0) {
    return (
      <div className="thought-list">
        <div className="thought-list-header">
          <h3>Search Results</h3>
        </div>
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h4>No results found</h4>
          <p>No thoughts match "{searchQuery}"</p>
        </div>
      </div>
    )
  }

  return (
    <div className="thought-list">
      <div className="thought-list-header">
        <h3>
          {isSearching ? `Search Results (${filteredThoughts.length})` : `Your Thoughts (${filteredThoughts.length})`}
        </h3>
      </div>
      
      <div className="thought-list-content">
        {filteredThoughts.map(thought => (
          <ThoughtItem 
            key={thought.id} 
            thought={thought}
            searchQuery={isSearching ? searchQuery : ''}
          />
        ))}
      </div>
    </div>
  )
}

export default ThoughtList
