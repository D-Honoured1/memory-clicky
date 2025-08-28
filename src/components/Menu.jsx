"use client"

import { AVAILABLE_GENRES } from "../hooks/useFetchImages"

/**
 * Enhanced Menu component: provides comprehensive navigation options for the game
 * - Restart game
 * - Select stage with automatic game reset
 * - Select theme
 * - Select genre with automatic game reset
 * - Close menu
 * All changes that affect gameplay automatically reset the game state
 */
export default function Menu({ isOpen, onClose, onRestart, theme, setTheme, stage, setStage, genre, setGenre }) {
  if (!isOpen) return null

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark")

  const handleStageSelect = (newStage) => {
    if (newStage !== stage) {
      setStage(newStage)
      // Trigger game reset when stage changes
      setTimeout(() => onRestart(), 100)
    }
    onClose()
  }

  const handleRestart = () => {
    onRestart()
    onClose()
  }

  const handleGenreSelect = (newGenre) => {
    if (newGenre !== genre) {
      setGenre(newGenre)
      // Trigger game reset when genre changes
      setTimeout(() => onRestart(), 100)
    }
    onClose()
  }

  const handleRandomSelect = () => {
    if (genre !== null) {
      setGenre(null)
      // Trigger game reset when switching to random
      setTimeout(() => onRestart(), 100)
    }
    onClose()
  }

  const getCurrentGenreDisplay = () => {
    if (genre === null) return "Random"
    return genre.charAt(0).toUpperCase() + genre.slice(1)
  }

  const getStageInfo = (stageNum) => {
    const cardCounts = { 1: 10, 2: 20, 3: 30 }
    const timeInfo = { 1: "No timer", 2: "7s timer", 3: "5s timer + shuffle" }
    return `${cardCounts[stageNum]} cards - ${timeInfo[stageNum]}`
  }

  return (
    <div className="menu-overlay" onClick={onClose}>
      <div className="menu-content app-card" onClick={(e) => e.stopPropagation()}>
        <div className="menu-header">
          <h2>Game Menu</h2>
          <button className="btn secondary" onClick={onClose} aria-label="Close menu">
            ✕
          </button>
        </div>

        <div className="menu-section">
          <h3>Current Game</h3>
          <div className="current-status">
            <div className="status-item">
              <span className="status-label">Difficulty:</span>
              <span className="status-value">
                {stage === 1 ? "Easy" : stage === 2 ? "Medium" : "Hard"} (
                {stage === 1 ? "10" : stage === 2 ? "20" : "30"} cards)
              </span>
            </div>
            <div className="status-item">
              <span className="status-label">Category:</span>
              <span className="status-value">{getCurrentGenreDisplay()}</span>
            </div>
          </div>
        </div>

        <div className="menu-section">
          <h3>Game Actions</h3>
          <button className="btn primary menu-btn" onClick={handleRestart} aria-label="Restart current game">
            🔄 Restart Game
          </button>
        </div>

        <div className="menu-section">
          <h3>Select Difficulty</h3>
          <div className="stage-buttons">
            <button
              className={`btn ${stage === 1 ? "primary" : "secondary"} stage-btn`}
              onClick={() => handleStageSelect(1)}
              aria-label="Easy: 10 cards, no time limit"
              title={getStageInfo(1)}
            >
              Easy (10)
            </button>
            <button
              className={`btn ${stage === 2 ? "primary" : "secondary"} stage-btn`}
              onClick={() => handleStageSelect(2)}
              aria-label="Medium: 20 cards, 7 second time limit"
              title={getStageInfo(2)}
            >
              Medium (20)
            </button>
            <button
              className={`btn ${stage === 3 ? "primary" : "secondary"} stage-btn`}
              onClick={() => handleStageSelect(3)}
              aria-label="Hard: 30 cards, 5 second time limit with auto-shuffle"
              title={getStageInfo(3)}
            >
              Hard (30)
            </button>
          </div>
        </div>

        <div className="menu-section">
          <h3>Image Category</h3>
          <div className="genre-grid">
            <button
              className={`btn ${genre === null ? "primary" : "secondary"} genre-btn`}
              onClick={handleRandomSelect}
              aria-label="Select random images"
              title="Random images from all categories"
            >
              🎲 Random
            </button>
            {AVAILABLE_GENRES.map((genreOption) => (
              <button
                key={genreOption}
                className={`btn ${genre === genreOption ? "primary" : "secondary"} genre-btn`}
                onClick={() => handleGenreSelect(genreOption)}
                aria-label={`Select ${genreOption} category`}
                title={`Images from ${genreOption} category`}
              >
                {genreOption.charAt(0).toUpperCase() + genreOption.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="menu-section">
          <h3>Appearance</h3>
          <button
            className="btn secondary menu-btn"
            onClick={toggleTheme}
            aria-label="Toggle light dark theme"
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? "☀️" : "🌙"} Switch to {theme === "dark" ? "Light" : "Dark"} Mode
          </button>
        </div>
      </div>
    </div>
  )
}
