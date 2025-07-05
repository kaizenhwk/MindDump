import React from 'react'

const SampleSentences = ({ sentences }) => {
  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const highlightWord = (text, word) => {
    if (!word || !text) return text
    
    const regex = new RegExp(`\\b(${word})\\b`, 'gi')
    const parts = text.split(regex)
    
    return parts.map((part, index) => {
      if (regex.test(part)) {
        return (
          <mark key={index} className="highlighted-word">
            {part}
          </mark>
        )
      }
      return part
    })
  }

  if (!sentences || sentences.length === 0) {
    return (
      <div className="sample-sentences">
        <h3>Sample Usage</h3>
        <div className="no-sentences-message">
          <p>No sample sentences found for this word.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="sample-sentences">
      <h3>Sample Usage</h3>
      <div className="sentences-list">
        {sentences.map((sentence, index) => (
          <div key={`${sentence.thoughtId}-${index}`} className="sentence-item">
            <div className="sentence-text">
              {highlightWord(sentence.text, sentence.word)}
            </div>
            <div className="sentence-meta">
              <span className="sentence-date">{formatDate(sentence.timestamp)}</span>
              <span className="sentence-variant">
                Contains: <em>{sentence.word}</em>
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {sentences.length >= 5 && (
        <div className="sentences-note">
          <p>Showing up to 5 sample sentences. This word appears in {sentences.length === 5 ? 'at least' : ''} {sentences.length} thoughts.</p>
        </div>
      )}
    </div>
  )
}

export default SampleSentences
