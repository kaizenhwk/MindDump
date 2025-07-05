import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import WordAnalysisModal from './WordAnalysisModal'
import { useThoughts } from '../../hooks'

// Mock the hooks
jest.mock('../../hooks', () => ({
  useThoughts: jest.fn()
}))

// Mock the word stemming service
jest.mock('../../services/wordStemming', () => ({
  default: {
    getWordVariants: jest.fn(),
    getRootWord: jest.fn()
  }
}))

const mockThoughts = [
  {
    id: '1',
    content: 'I am running to the store. Running is good exercise.',
    timestamp: Date.now() - 86400000 // 1 day ago
  },
  {
    id: '2', 
    content: 'I run every morning. Today I ran 5 miles.',
    timestamp: Date.now() - 43200000 // 12 hours ago
  },
  {
    id: '3',
    content: 'She runs faster than me. We both love running.',
    timestamp: Date.now() // now
  }
]

const mockWordFrequency = {
  'running': 3,
  'run': 2,
  'runs': 1,
  'ran': 1
}

const mockVariants = [
  { word: 'running', frequency: 3 },
  { word: 'run', frequency: 2 },
  { word: 'runs', frequency: 1 },
  { word: 'ran', frequency: 1 }
]

describe('WordAnalysisModal', () => {
  beforeEach(() => {
    useThoughts.mockReturnValue({
      thoughts: mockThoughts,
      wordFrequency: mockWordFrequency
    })

    // Mock word stemming service
    const wordStemmingService = require('../../services/wordStemming').default
    wordStemmingService.getWordVariants.mockReturnValue(mockVariants)
    wordStemmingService.getRootWord.mockReturnValue('run')
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('renders modal when selectedWord is provided', () => {
    const onClose = jest.fn()
    
    render(
      <WordAnalysisModal 
        selectedWord="running" 
        onClose={onClose}
      />
    )

    expect(screen.getByText('"running"')).toBeInTheDocument()
    expect(screen.getByText('7 uses')).toBeInTheDocument()
    expect(screen.getByText('Statistics')).toBeInTheDocument()
    expect(screen.getByText('Word Variants')).toBeInTheDocument()
    expect(screen.getByText('Sample Usage')).toBeInTheDocument()
  })

  test('does not render when selectedWord is null', () => {
    const onClose = jest.fn()
    
    const { container } = render(
      <WordAnalysisModal 
        selectedWord={null} 
        onClose={onClose}
      />
    )

    expect(container.firstChild).toBeNull()
  })

  test('calls onClose when close button is clicked', () => {
    const onClose = jest.fn()
    
    render(
      <WordAnalysisModal 
        selectedWord="running" 
        onClose={onClose}
      />
    )

    const closeButton = screen.getByLabelText('Close modal')
    fireEvent.click(closeButton)

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  test('calls onClose when backdrop is clicked', () => {
    const onClose = jest.fn()
    
    render(
      <WordAnalysisModal 
        selectedWord="running" 
        onClose={onClose}
      />
    )

    const backdrop = document.querySelector('.word-analysis-modal-backdrop')
    fireEvent.click(backdrop)

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  test('calls onClose when Escape key is pressed', () => {
    const onClose = jest.fn()
    
    render(
      <WordAnalysisModal 
        selectedWord="running" 
        onClose={onClose}
      />
    )

    fireEvent.keyDown(document, { key: 'Escape' })

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  test('does not close when modal content is clicked', () => {
    const onClose = jest.fn()
    
    render(
      <WordAnalysisModal 
        selectedWord="running" 
        onClose={onClose}
      />
    )

    const modalContent = document.querySelector('.word-analysis-modal')
    fireEvent.click(modalContent)

    expect(onClose).not.toHaveBeenCalled()
  })

  test('calculates word statistics correctly', async () => {
    const onClose = jest.fn()
    
    render(
      <WordAnalysisModal 
        selectedWord="running" 
        onClose={onClose}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('7 uses')).toBeInTheDocument()
      expect(screen.getByText('run')).toBeInTheDocument() // root word
      expect(screen.getByText('4')).toBeInTheDocument() // variants found
      expect(screen.getByText('3')).toBeInTheDocument() // thoughts containing word
    })
  })

  test('finds and displays sample sentences', async () => {
    const onClose = jest.fn()
    
    render(
      <WordAnalysisModal 
        selectedWord="running" 
        onClose={onClose}
      />
    )

    await waitFor(() => {
      expect(screen.getByText(/I am running to the store/)).toBeInTheDocument()
      expect(screen.getByText(/Running is good exercise/)).toBeInTheDocument()
    })
  })

  test('handles show all variants functionality', async () => {
    const onClose = jest.fn()
    
    render(
      <WordAnalysisModal 
        selectedWord="running" 
        onClose={onClose}
      />
    )

    // Initially should show limited variants
    await waitFor(() => {
      expect(screen.getByText('running')).toBeInTheDocument()
      expect(screen.getByText('run')).toBeInTheDocument()
    })

    // Should have show all button if more than 5 variants
    const showAllButton = screen.queryByText(/Show All/)
    if (showAllButton) {
      fireEvent.click(showAllButton)
      expect(screen.getByText('Show Less')).toBeInTheDocument()
    }
  })

  test('displays percentage calculation correctly', async () => {
    const onClose = jest.fn()
    
    render(
      <WordAnalysisModal 
        selectedWord="running" 
        onClose={onClose}
      />
    )

    await waitFor(() => {
      // Total frequency is 7, total words in mockWordFrequency is 7
      // So percentage should be 100%
      expect(screen.getByText('(100.0% of all words)')).toBeInTheDocument()
    })
  })

  test('handles empty thoughts gracefully', () => {
    useThoughts.mockReturnValue({
      thoughts: [],
      wordFrequency: {}
    })

    const wordStemmingService = require('../../services/wordStemming').default
    wordStemmingService.getWordVariants.mockReturnValue([])

    const onClose = jest.fn()
    
    render(
      <WordAnalysisModal 
        selectedWord="test" 
        onClose={onClose}
      />
    )

    expect(screen.getByText('"test"')).toBeInTheDocument()
    expect(screen.getByText('0 uses')).toBeInTheDocument()
  })

  test('truncates long sentences appropriately', async () => {
    const longThought = {
      id: '4',
      content: 'This is a very long sentence that contains the word running and should be truncated when displayed in the modal because it exceeds the maximum length limit that we have set for sample sentences in the word analysis feature.',
      timestamp: Date.now()
    }

    useThoughts.mockReturnValue({
      thoughts: [longThought],
      wordFrequency: { 'running': 1 }
    })

    const onClose = jest.fn()
    
    render(
      <WordAnalysisModal 
        selectedWord="running" 
        onClose={onClose}
      />
    )

    await waitFor(() => {
      const truncatedText = screen.getByText(/\.\.\./)
      expect(truncatedText).toBeInTheDocument()
    })
  })
})
