import React from 'react'
import ThoughtInput from './components/ThoughtInput'
import ThoughtList from './components/ThoughtList'
import WordCloud from './components/WordCloud'
import SearchBar from './components/Search'
import { ThoughtProvider } from './hooks'
import './styles/main.css'
import './styles/components.css'
import './App.css'

function App() {
  return (
    <ThoughtProvider>
      <div className="app">
        <header className="app-header">
          <h1>MindDump</h1>
          <p>Capture your thoughts and visualize your thinking patterns</p>
        </header>
        
        <main className="app-main">
          <div className="visualization-section">
            <WordCloud />
          </div>
          
          <div className="input-section">
            <ThoughtInput />
          </div>
          
          <div className="thoughts-section">
            <SearchBar />
            <ThoughtList />
          </div>
        </main>
      </div>
    </ThoughtProvider>
  )
}

export default App
