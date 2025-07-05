import React from 'react'

const WordVariants = ({ variants, showAll, onToggleShowAll }) => {
  const displayLimit = 5
  const variantsToShow = showAll ? variants : variants.slice(0, displayLimit)
  const hasMoreVariants = variants.length > displayLimit

  const getVariantPercentage = (frequency) => {
    const totalFrequency = variants.reduce((sum, v) => sum + v.frequency, 0)
    return totalFrequency > 0 ? ((frequency / totalFrequency) * 100).toFixed(1) : 0
  }

  const getFrequencyBarWidth = (frequency) => {
    const maxFrequency = variants.length > 0 ? variants[0].frequency : 1
    return (frequency / maxFrequency) * 100
  }

  return (
    <div className="word-variants">
      <h3>Word Variants</h3>
      
      <div className="variants-list">
        {variantsToShow.map((variant, index) => (
          <div key={variant.word} className="variant-item">
            <div className="variant-header">
              <span className="variant-word">{variant.word}</span>
              <div className="variant-stats">
                <span className="variant-frequency">{variant.frequency}</span>
                <span className="variant-percentage">({getVariantPercentage(variant.frequency)}%)</span>
              </div>
            </div>
            
            <div className="frequency-bar">
              <div 
                className="frequency-fill"
                style={{ width: `${getFrequencyBarWidth(variant.frequency)}%` }}
              />
            </div>
            
            {index === 0 && (
              <div className="most-frequent-badge">Most frequent</div>
            )}
          </div>
        ))}
      </div>

      {hasMoreVariants && (
        <button 
          className="show-all-button"
          onClick={onToggleShowAll}
        >
          {showAll ? 'Show Less' : `Show All ${variants.length} Variants`}
        </button>
      )}

      {variants.length === 1 && (
        <div className="no-variants-message">
          <p>No other variants found for this word.</p>
        </div>
      )}
    </div>
  )
}

export default WordVariants
