import React, { useState } from 'react'
import { useThoughts } from '../../hooks'
import wordStemmingService from '../../services/wordStemming'
import WordAnalysisModal from '../WordAnalysisModal'
import './WordCloud.css'

const WordCloud = () => {
  const { wordFrequency, hasThoughts } = useThoughts()
  const [selectedWord, setSelectedWord] = useState(null)

  const getTopWords = (limit = 20) => {
    // Group words by their root forms using stemming
    const wordGroups = wordStemmingService.groupWordsByRoot(wordFrequency)
    
    // Convert to array and sort by total frequency
    const groupEntries = Object.entries(wordGroups)
      .sort(([,a], [,b]) => b.totalFrequency - a.totalFrequency)
      .slice(0, limit)
    
    const maxFreq = groupEntries.length > 0 ? groupEntries[0][1].totalFrequency : 1
    
    return groupEntries.map(([rootWord, groupData], index) => ({
      word: groupData.mostFrequent, // Display the most frequent variant
      rootWord: rootWord,
      frequency: groupData.totalFrequency,
      variants: groupData.variants,
      // Enhanced size calculation: 10px to 48px range based on frequency
      size: Math.max(10, Math.min(48, 10 + (groupData.totalFrequency / maxFreq) * 38)),
      // Random animation delay for organic movement
      animationDelay: Math.random() * 3,
      // Random animation duration between 3-6 seconds
      animationDuration: 3 + Math.random() * 3
    }))
  }

  const handleWordClick = (word) => {
    setSelectedWord(word)
  }

  const handleCloseModal = () => {
    setSelectedWord(null)
  }

  const getWordColor = (frequency, maxFreq) => {
    const intensity = frequency / maxFreq
    const colors = [
      '#3498db', '#e74c3c', '#2ecc71', '#f39c12', 
      '#9b59b6', '#1abc9c', '#e67e22', '#34495e'
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  if (!hasThoughts) {
    return (
      <div className="word-cloud">
        <div className="word-cloud-header">
          <h3>Word Cloud</h3>
        </div>
        <div className="word-cloud-empty">
          <div className="empty-icon">☁️</div>
          <h4>No words yet</h4>
          <p>Your word cloud will appear here as you add thoughts!</p>
        </div>
      </div>
    )
  }

  const topWords = getTopWords()
  const maxFreq = topWords.length > 0 ? topWords[0].frequency : 1

  if (topWords.length === 0) {
    return (
      <div className="word-cloud">
        <div className="word-cloud-header">
          <h3>Word Cloud</h3>
        </div>
        <div className="word-cloud-empty">
          <div className="empty-icon">☁️</div>
          <h4>Building your cloud...</h4>
          <p>Add more thoughts to see your word patterns!</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="word-cloud">
        <div className="word-cloud-header">
          <h3>Word Cloud</h3>
          <div className="word-count">
            {Object.keys(wordFrequency).length} unique words
          </div>
        </div>
        
        <div className="word-cloud-container">
          <div className={`word-cloud-canvas ${selectedWord ? 'has-selection' : ''}`}>
            {topWords.map(({ word, frequency, size, animationDelay, animationDuration }, index) => (
              <span
                key={word}
                className={`word-cloud-word floating clickable ${selectedWord === word ? 'selected' : selectedWord ? 'dimmed' : ''}`}
                style={{
                  fontSize: `${size}px`,
                  color: getWordColor(frequency, maxFreq),
                  animationDelay: `${animationDelay}s`,
                  animationDuration: `${animationDuration}s`
                }}
                title={`"${word}" appears ${frequency} time${frequency > 1 ? 's' : ''} - Click for details`}
                onClick={() => handleWordClick(word)}
              >
                {word}
              </span>
            ))}
          </div>
          
          <div className="word-cloud-legend">
            <div className="legend-item">
              <span className="legend-label">Most frequent:</span>
              <span className="legend-word">{topWords[0]?.word}</span>
              <span className="legend-count">({topWords[0]?.frequency})</span>
            </div>
          </div>
        </div>
      </div>

      {selectedWord && (
        <WordAnalysisModal
          selectedWord={selectedWord}
          onClose={handleCloseModal}
        />
      )}
    </>
  )
}

export default WordCloud
