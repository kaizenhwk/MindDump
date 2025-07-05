import React, { useState, useEffect } from 'react'
import { useThoughts } from '../../hooks'
import wordStemmingService from '../../services/wordStemming'
import WordStats from './WordStats'
import WordVariants from './WordVariants'
import SampleSentences from './SampleSentences'
import './WordAnalysisModal.css'

const WordAnalysisModal = ({ selectedWord, onClose }) => {
  const { thoughts, wordFrequency } = useThoughts()
  const [wordData, setWordData] = useState(null)
  const [showAllVariants, setShowAllVariants] = useState(false)

  useEffect(() => {
    if (selectedWord) {
      const variants = wordStemmingService.getWordVariants(selectedWord, wordFrequency)
      const rootWord = wordStemmingService.getRootWord(selectedWord)
      const totalFrequency = variants.reduce((sum, v) => sum + v.frequency, 0)
      
      // Find sample sentences containing any variant of the word
      const sampleSentences = findSampleSentences(variants.map(v => v.word))
      
      // Calculate statistics
      const totalWords = Object.values(wordFrequency).reduce((sum, freq) => sum + freq, 0)
      const percentage = totalWords > 0 ? ((totalFrequency / totalWords) * 100).toFixed(1) : 0
      
      // Find first and last usage
      const thoughtsWithWord = thoughts.filter(thought => 
        variants.some(variant => 
          thought.content.toLowerCase().includes(variant.word.toLowerCase())
        )
      )
      
      const firstUsage = thoughtsWithWord.length > 0 ? 
        new Date(thoughtsWithWord[thoughtsWithWord.length - 1].timestamp) : null
      const lastUsage = thoughtsWithWord.length > 0 ? 
        new Date(thoughtsWithWord[0].timestamp) : null

      setWordData({
        selectedWord,
        rootWord,
        variants,
        totalFrequency,
        percentage,
        sampleSentences,
        firstUsage,
        lastUsage,
        thoughtCount: thoughtsWithWord.length
      })
    }
  }, [selectedWord, wordFrequency, thoughts])

  const findSampleSentences = (wordVariants) => {
    const sentences = []
    const maxSentences = 5
    
    for (const thought of thoughts) {
      if (sentences.length >= maxSentences) break
      
      const content = thought.content
      const lowerContent = content.toLowerCase()
      
      // Check if any variant appears in this thought
      const foundVariant = wordVariants.find(word => 
        lowerContent.includes(word.toLowerCase())
      )
      
      if (foundVariant) {
        // Split into sentences and find the one containing the word
        const thoughtSentences = content.split(/[.!?]+/).filter(s => s.trim())
        
        for (const sentence of thoughtSentences) {
          if (sentence.toLowerCase().includes(foundVariant.toLowerCase())) {
            sentences.push({
              text: sentence.trim(),
              word: foundVariant,
              timestamp: thought.timestamp,
              thoughtId: thought.id
            })
            break
          }
        }
        
        // If no sentence found, use the whole thought (truncated if too long)
        if (sentences.length === 0 || sentences[sentences.length - 1].thoughtId !== thought.id) {
          let text = content
          if (text.length > 150) {
            // Find a good truncation point near the word
            const wordIndex = lowerContent.indexOf(foundVariant.toLowerCase())
            const start = Math.max(0, wordIndex - 75)
            const end = Math.min(content.length, wordIndex + 75)
            text = (start > 0 ? '...' : '') + content.slice(start, end) + (end < content.length ? '...' : '')
          }
          
          sentences.push({
            text,
            word: foundVariant,
            timestamp: thought.timestamp,
            thoughtId: thought.id
          })
        }
      }
    }
    
    return sentences
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (!selectedWord || !wordData) {
    return null
  }

  return (
    <div className="word-analysis-modal-backdrop" onClick={handleBackdropClick}>
      <div className="word-analysis-modal">
        <div className="modal-header">
          <div className="modal-title">
            <h2>"{wordData.selectedWord}"</h2>
            <div className="word-stats-summary">
              <span className="frequency">{wordData.totalFrequency} uses</span>
              <span className="percentage">({wordData.percentage}% of all words)</span>
            </div>
          </div>
          <button className="close-button" onClick={onClose} aria-label="Close modal">
            ×
          </button>
        </div>

        <div className="modal-content">
          <WordStats wordData={wordData} />
          
          <WordVariants 
            variants={wordData.variants}
            showAll={showAllVariants}
            onToggleShowAll={() => setShowAllVariants(!showAllVariants)}
          />
          
          <SampleSentences sentences={wordData.sampleSentences} />
        </div>
      </div>
    </div>
  )
}

export default WordAnalysisModal
