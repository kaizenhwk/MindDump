import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import App from '../../App'

// Mock localStorage for testing
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
  removeItem: jest.fn()
}
global.localStorage = mockLocalStorage

describe('WordCloud Integration Tests', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    mockLocalStorage.getItem.mockClear()
    mockLocalStorage.setItem.mockClear()
    mockLocalStorage.clear.mockClear()
    mockLocalStorage.removeItem.mockClear()
    
    // Mock initial empty state
    mockLocalStorage.getItem.mockReturnValue(null)
  })

  describe('Word Processing Pipeline Integration', () => {
    test('complete thought-to-wordcloud pipeline works correctly', async () => {
      const user = userEvent.setup()
      
      render(<App />)
      
      // Step 1: Verify initial empty state
      expect(screen.getByText(/no words yet/i)).toBeInTheDocument()
      
      // Step 2: Add a thought with specific words
      const thoughtInput = screen.getByPlaceholderText(/what's on your mind/i)
      const testThought = 'I love programming and coding. Programming is amazing!'
      
      await user.type(thoughtInput, testThought)
      
      // Step 3: Save the thought
      const saveButton = screen.getByText(/save thought/i)
      await user.click(saveButton)
      
      // Step 4: Verify word cloud updates
      await waitFor(() => {
        // Should no longer show empty state
        expect(screen.queryByText(/no words yet/i)).not.toBeInTheDocument()
        
        // Should show words from the thought (excluding stop words)
        expect(screen.getByText('programming')).toBeInTheDocument()
        expect(screen.getByText('coding')).toBeInTheDocument()
        expect(screen.getByText('amazing')).toBeInTheDocument()
      }, { timeout: 3000 })
      
      // Step 5: Verify localStorage was called to save data
      expect(mockLocalStorage.setItem).toHaveBeenCalled()
    })

    test('word frequency updates correctly with multiple thoughts', async () => {
      const user = userEvent.setup()
      
      render(<App />)
      
      const thoughtInput = screen.getByPlaceholderText(/what's on your mind/i)
      
      // Add first thought
      await user.type(thoughtInput, 'I love programming')
      await user.click(screen.getByText(/save thought/i))
      
      // Clear input and add second thought with repeated word
      await user.clear(thoughtInput)
      await user.type(thoughtInput, 'Programming is my passion')
      await user.click(screen.getByText(/save thought/i))
      
      // Verify word cloud shows updated frequencies
      await waitFor(() => {
        const programmingWords = screen.getAllByText('programming')
        expect(programmingWords.length).toBeGreaterThan(0)
        
        // The word should appear in the cloud (frequency affects size, not count)
        expect(screen.getByText('programming')).toBeInTheDocument()
        expect(screen.getByText('passion')).toBeInTheDocument()
      })
    })

    test('word cloud updates when thoughts are deleted', async () => {
      const user = userEvent.setup()
      
      // Mock existing thoughts in localStorage
      const existingThoughts = [
        {
          id: '1',
          content: 'I love programming',
          timestamp: Date.now() - 1000
        }
      ]
      
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key.includes('thoughts')) return JSON.stringify(existingThoughts)
        if (key.includes('wordFrequency')) return JSON.stringify({ programming: 1, love: 1 })
        return null
      })
      
      render(<App />)
      
      // Verify initial word cloud state
      await waitFor(() => {
        expect(screen.getByText('programming')).toBeInTheDocument()
      })
      
      // Delete the thought
      const deleteButton = screen.getByLabelText(/delete thought/i)
      await user.click(deleteButton)
      
      // Verify word cloud updates (should show empty state)
      await waitFor(() => {
        expect(screen.getByText(/no words yet/i)).toBeInTheDocument()
        expect(screen.queryByText('programming')).not.toBeInTheDocument()
      })
    })
  })

  describe('Interactive Word Analysis Integration', () => {
    test('word click opens modal with correct data', async () => {
      const user = userEvent.setup()
      
      // Mock existing thoughts with word variants
      const existingThoughts = [
        {
          id: '1',
          content: 'I am running to the store',
          timestamp: Date.now() - 2000
        },
        {
          id: '2',
          content: 'I run every morning',
          timestamp: Date.now() - 1000
        }
      ]
      
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key.includes('thoughts')) return JSON.stringify(existingThoughts)
        if (key.includes('wordFrequency')) return JSON.stringify({ 
          running: 1, 
          run: 1, 
          store: 1, 
          morning: 1 
        })
        return null
      })
      
      render(<App />)
      
      // Wait for word cloud to render
      await waitFor(() => {
        expect(screen.getByText('running')).toBeInTheDocument()
      })
      
      // Click on a word in the cloud
      const wordElement = screen.getByText('running')
      await user.click(wordElement)
      
      // Verify modal opens with correct content
      await waitFor(() => {
        expect(screen.getByText('"running"')).toBeInTheDocument()
        expect(screen.getByText('Statistics')).toBeInTheDocument()
        expect(screen.getByText('Word Variants')).toBeInTheDocument()
        expect(screen.getByText('Sample Usage')).toBeInTheDocument()
      })
      
      // Verify sample sentences are shown
      expect(screen.getByText(/I am running to the store/)).toBeInTheDocument()
    })

    test('modal closes correctly and restores word cloud state', async () => {
      const user = userEvent.setup()
      
      // Mock existing thoughts
      const existingThoughts = [
        {
          id: '1',
          content: 'I love programming',
          timestamp: Date.now()
        }
      ]
      
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key.includes('thoughts')) return JSON.stringify(existingThoughts)
        if (key.includes('wordFrequency')) return JSON.stringify({ programming: 1, love: 1 })
        return null
      })
      
      render(<App />)
      
      // Wait for word cloud and click word
      await waitFor(() => {
        expect(screen.getByText('programming')).toBeInTheDocument()
      })
      
      await user.click(screen.getByText('programming'))
      
      // Verify modal is open
      await waitFor(() => {
        expect(screen.getByText('"programming"')).toBeInTheDocument()
      })
      
      // Close modal using close button
      const closeButton = screen.getByLabelText('Close modal')
      await user.click(closeButton)
      
      // Verify modal is closed and word cloud is restored
      await waitFor(() => {
        expect(screen.queryByText('"programming"')).not.toBeInTheDocument()
        expect(screen.getByText('programming')).toBeInTheDocument() // Word cloud word
      })
    })

    test('modal closes when clicking backdrop', async () => {
      const user = userEvent.setup()
      
      // Mock existing thoughts
      const existingThoughts = [
        {
          id: '1',
          content: 'Testing modal functionality',
          timestamp: Date.now()
        }
      ]
      
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key.includes('thoughts')) return JSON.stringify(existingThoughts)
        if (key.includes('wordFrequency')) return JSON.stringify({ testing: 1, modal: 1, functionality: 1 })
        return null
      })
      
      render(<App />)
      
      // Open modal
      await waitFor(() => {
        expect(screen.getByText('testing')).toBeInTheDocument()
      })
      
      await user.click(screen.getByText('testing'))
      
      // Verify modal is open
      await waitFor(() => {
        expect(screen.getByText('"testing"')).toBeInTheDocument()
      })
      
      // Click backdrop to close
      const backdrop = document.querySelector('.word-analysis-modal-backdrop')
      await user.click(backdrop)
      
      // Verify modal is closed
      await waitFor(() => {
        expect(screen.queryByText('"testing"')).not.toBeInTheDocument()
      })
    })
  })

  describe('Data Synchronization Integration', () => {
    test('useThoughts hook synchronizes data across components', async () => {
      const user = userEvent.setup()
      
      render(<App />)
      
      // Add a thought
      const thoughtInput = screen.getByPlaceholderText(/what's on your mind/i)
      await user.type(thoughtInput, 'React hooks are powerful')
      await user.click(screen.getByText(/save thought/i))
      
      // Verify thought appears in thought list
      await waitFor(() => {
        expect(screen.getByText('React hooks are powerful')).toBeInTheDocument()
      })
      
      // Verify words appear in word cloud
      await waitFor(() => {
        expect(screen.getByText('react')).toBeInTheDocument()
        expect(screen.getByText('hooks')).toBeInTheDocument()
        expect(screen.getByText('powerful')).toBeInTheDocument()
      })
      
      // Verify localStorage synchronization
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        expect.stringContaining('thoughts'),
        expect.any(String)
      )
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        expect.stringContaining('wordFrequency'),
        expect.any(String)
      )
    })

    test('word stemming integration works across components', async () => {
      const user = userEvent.setup()
      
      render(<App />)
      
      // Add thought with word variants
      const thoughtInput = screen.getByPlaceholderText(/what's on your mind/i)
      await user.type(thoughtInput, 'I am running. I run daily. She runs fast.')
      await user.click(screen.getByText(/save thought/i))
      
      // Wait for word cloud to process
      await waitFor(() => {
        // Should show the most frequent variant or root form
        const runningWords = screen.queryAllByText(/run/i)
        expect(runningWords.length).toBeGreaterThan(0)
      })
      
      // Click on word to see variants in modal
      const wordElement = screen.getByText(/run/i)
      await user.click(wordElement)
      
      // Verify modal shows word variants
      await waitFor(() => {
        expect(screen.getByText('Word Variants')).toBeInTheDocument()
        // Should show different forms of the word
        expect(screen.getByText(/running|run|runs/)).toBeInTheDocument()
      })
    })
  })

  describe('Error Handling Integration', () => {
    test('handles localStorage errors gracefully', async () => {
      const user = userEvent.setup()
      
      // Mock localStorage to throw error
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('Storage quota exceeded')
      })
      
      render(<App />)
      
      // Try to add a thought
      const thoughtInput = screen.getByPlaceholderText(/what's on your mind/i)
      await user.type(thoughtInput, 'This should handle storage errors')
      await user.click(screen.getByText(/save thought/i))
      
      // App should still function (error handled gracefully)
      // The thought might not be saved, but app shouldn't crash
      expect(screen.getByPlaceholderText(/what's on your mind/i)).toBeInTheDocument()
    })

    test('handles empty word cloud state correctly', async () => {
      render(<App />)
      
      // Verify empty state is shown
      expect(screen.getByText(/no words yet/i)).toBeInTheDocument()
      expect(screen.getByText(/your word cloud will appear here/i)).toBeInTheDocument()
      
      // Verify no word elements are clickable
      const wordElements = screen.queryAllByText(/\w+/, { selector: '.word-cloud-word' })
      expect(wordElements).toHaveLength(0)
    })
  })

  describe('Performance Integration', () => {
    test('handles large number of thoughts efficiently', async () => {
      const user = userEvent.setup()
      
      // Mock many existing thoughts
      const manyThoughts = Array.from({ length: 50 }, (_, i) => ({
        id: `thought-${i}`,
        content: `This is thought number ${i} with various words like amazing, wonderful, fantastic`,
        timestamp: Date.now() - (i * 1000)
      }))
      
      const wordFreq = {
        amazing: 50,
        wonderful: 50,
        fantastic: 50,
        thought: 50,
        number: 50,
        various: 50,
        words: 50
      }
      
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key.includes('thoughts')) return JSON.stringify(manyThoughts)
        if (key.includes('wordFrequency')) return JSON.stringify(wordFreq)
        return null
      })
      
      const startTime = performance.now()
      render(<App />)
      
      // Wait for word cloud to render
      await waitFor(() => {
        expect(screen.getByText('amazing')).toBeInTheDocument()
      }, { timeout: 5000 })
      
      const endTime = performance.now()
      const renderTime = endTime - startTime
      
      // Should render within reasonable time (less than 2 seconds)
      expect(renderTime).toBeLessThan(2000)
      
      // Verify word cloud shows top words
      expect(screen.getByText('amazing')).toBeInTheDocument()
      expect(screen.getByText('wonderful')).toBeInTheDocument()
    })
  })
})
