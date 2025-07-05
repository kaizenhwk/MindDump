import React from 'react'

const WordStats = ({ wordData }) => {
  const formatDate = (date) => {
    if (!date) return 'Unknown'
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (date) => {
    if (!date) return ''
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getDaysSinceFirst = () => {
    if (!wordData.firstUsage || !wordData.lastUsage) return 0
    const diffTime = Math.abs(wordData.lastUsage - wordData.firstUsage)
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const getUsageFrequency = () => {
    const days = getDaysSinceFirst()
    if (days === 0) return 'First time used'
    if (days === 1) return 'Used daily'
    
    const avgPerDay = (wordData.totalFrequency / days).toFixed(1)
    return `${avgPerDay} times per day on average`
  }

  return (
    <div className="word-stats">
      <h3>Statistics</h3>
      
      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-label">Root Word</div>
          <div className="stat-value">{wordData.rootWord}</div>
        </div>
        
        <div className="stat-item">
          <div className="stat-label">Total Uses</div>
          <div className="stat-value">{wordData.totalFrequency}</div>
        </div>
        
        <div className="stat-item">
          <div className="stat-label">Percentage of All Words</div>
          <div className="stat-value">{wordData.percentage}%</div>
        </div>
        
        <div className="stat-item">
          <div className="stat-label">Variants Found</div>
          <div className="stat-value">{wordData.variants.length}</div>
        </div>
        
        <div className="stat-item">
          <div className="stat-label">Thoughts Containing Word</div>
          <div className="stat-value">{wordData.thoughtCount}</div>
        </div>
        
        <div className="stat-item">
          <div className="stat-label">First Used</div>
          <div className="stat-value">
            {formatDate(wordData.firstUsage)}
            {wordData.firstUsage && (
              <div className="stat-subvalue">{formatTime(wordData.firstUsage)}</div>
            )}
          </div>
        </div>
        
        <div className="stat-item">
          <div className="stat-label">Last Used</div>
          <div className="stat-value">
            {formatDate(wordData.lastUsage)}
            {wordData.lastUsage && (
              <div className="stat-subvalue">{formatTime(wordData.lastUsage)}</div>
            )}
          </div>
        </div>
        
        <div className="stat-item">
          <div className="stat-label">Usage Pattern</div>
          <div className="stat-value">{getUsageFrequency()}</div>
        </div>
      </div>
    </div>
  )
}

export default WordStats
