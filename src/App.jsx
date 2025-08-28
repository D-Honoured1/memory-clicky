"use client"

import { useState, useEffect } from "react"
import Header from "./components/Header"
import Scoreboard from "./components/Scoreboard"
import StageSelector from "./components/StageSelector"
import Controls from "./components/Controls"
import CardGrid from "./components/CardGrid"
import GameOver from "./components/GameOver"
import useFetchImages from "./hooks/useFetchImages"
import "./index.css"

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light")
  const [stage, setStage] = useState(1)
  const [currentScore, setCurrentScore] = useState(0)
  const [bestScore, setBestScore] = useState(() => Number.parseInt(localStorage.getItem("bestScore") || "0", 10))
  const [autoShuffle, setAutoShuffle] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [resetSignal, setResetSignal] = useState(0)
  const [timeLeft, setTimeLeft] = useState(null)
  const [genre, setGenre] = useState(() => localStorage.getItem("selectedGenre") || null)
  const [gameStarted, setGameStarted] = useState(false)

  const cardCounts = { 1: 5, 2: 10, 3: 15 }
  const { images, loading, error, refetch } = useFetchImages(cardCounts[stage], genre, gameStarted)

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem("theme", theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem("bestScore", bestScore.toString())
  }, [bestScore])

  useEffect(() => {
    if (genre) {
      localStorage.setItem("selectedGenre", genre)
    } else {
      localStorage.removeItem("selectedGenre")
    }
  }, [genre])

  useEffect(() => {
    setCurrentScore(0)
    setGameOver(false)
    refetch()
  }, [stage]) // Only depend on stage changes

  useEffect(() => {
    setCurrentScore(0)
    setGameOver(false)
    refetch()
  }, [genre]) // Only depend on genre changes

  const handleScoreUpdate = (scoreDelta) => {
    const newScore = currentScore + scoreDelta
    setCurrentScore(newScore)
    if (newScore > bestScore) {
      setBestScore(newScore)
    }

    const targetScore = cardCounts[stage]
    if (newScore >= targetScore) {
      // Player won! End the game successfully
      setGameOver(true)
      setTimeLeft(null)
      setGameStarted(false)
    }
  }

  const handleReset = () => {
    setCurrentScore(0)
    setGameOver(false)
    setTimeLeft(null)
    setGameStarted(false)
    setResetSignal((prev) => prev + 1)
    refetch()
  }

  const handleGameOver = () => {
    setGameOver(true)
    setTimeLeft(null)
    setGameStarted(false)
  }

  const handleStartStop = () => {
    if (gameStarted) {
      handleGameOver()
    } else {
      setGameStarted(true)
      setGameOver(false)
      setCurrentScore(0)
      setTimeLeft(null)
      setResetSignal((prev) => prev + 1)
    }
  }

  if (error && images.length === 0) {
    return (
      <div className="app">
        <div className="app-card center">
          <h2>Unable to load images</h2>
          <p>{error}</p>
          <button className="btn" onClick={refetch}>
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <Header
        theme={theme}
        setTheme={setTheme}
        onRestart={handleReset}
        stage={stage}
        setStage={setStage}
        genre={genre}
        setGenre={setGenre}
      />
      <Scoreboard currentScore={currentScore} bestScore={bestScore} timeLeft={timeLeft} />
      <StageSelector stage={stage} setStage={setStage} />
      <div className="start-stop-container">
        <button
          className={`btn start-stop-btn ${gameStarted ? "stop" : "start"}`}
          onClick={handleStartStop}
          disabled={loading}
        >
          {gameStarted ? "Stop Game" : "Start Game"}
        </button>
      </div>
      {gameOver ? (
        <GameOver currentScore={currentScore} bestScore={bestScore} onRetry={handleReset} />
      ) : loading ? (
        <div className="app-card center">Loading images...</div>
      ) : (
        <CardGrid
          images={images}
          stage={stage}
          onScore={handleScoreUpdate}
          onLose={handleGameOver}
          resetSignal={resetSignal}
          setTimeLeft={setTimeLeft}
          autoShuffleEnabled={autoShuffle}
          gameStarted={gameStarted}
        />
      )}
      <Controls onReset={handleReset} autoShuffle={autoShuffle} setAutoShuffle={setAutoShuffle} />
    </div>
  )
}
