"use client"

import { useState, useEffect } from "react"
import Header from "./components/Header"
import Scoreboard from "./components/Scoreboard"
import StageSelector from "./components/StageSelector"
import Controls from "./components/Controls"
import CardGrid from "./components/CardGrid"
import useFetchImages from "./hooks/useFetchImages"
import "./index.css"

export default function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light"
  })

  const [stage, setStage] = useState(1)
  const [currentScore, setCurrentScore] = useState(0)
  const [bestScore, setBestScore] = useState(() => {
    return Number.parseInt(localStorage.getItem("bestScore") || "0", 10)
  })
  const [autoShuffle, setAutoShuffle] = useState(false)
  const [timeLeft, setTimeLeft] = useState(15)
  const [gameOver, setGameOver] = useState(false)

  const cardCounts = { 1: 6, 2: 12, 3: 18 }
  const stageTimes = { 1: 15, 2: 10, 3: 5 }

  const { images, loading, error, refetch } = useFetchImages(cardCounts[stage])

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem("theme", theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem("bestScore", bestScore.toString())
  }, [bestScore])

  // Reset timer and clear game over when stage changes
  useEffect(() => {
    setTimeLeft(stageTimes[stage])
    setGameOver(false)
  }, [stage])

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      setGameOver(true)
      return
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  const handleScoreUpdate = (newScore) => {
    if (!gameOver) {
      setCurrentScore(newScore)
      if (newScore > bestScore) {
        setBestScore(newScore)
      }
    }
  }

  const handleReset = () => {
    setCurrentScore(0)
    setTimeLeft(stageTimes[stage])
    setGameOver(false)
    refetch()
  }

  if (error && images.length === 0) {
    return (
      <div className="app">
        <div className="app-card" style={{ textAlign: "center", padding: "40px" }}>
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
      <Header theme={theme} setTheme={setTheme} />

      <Scoreboard currentScore={currentScore} bestScore={bestScore} />

      <div className="timer">⏳ Time Left: {timeLeft}s</div>

      {gameOver ? (
        <div className="app-card center" style={{ padding: "40px" }}>
          <h2>Game Over</h2>
          <p>Your Score: {currentScore}</p>
          <button className="btn" onClick={handleReset}>Restart</button>
        </div>
      ) : (
        <>
          <StageSelector stage={stage} setStage={setStage} />

          <Controls
            onReset={handleReset}
            autoShuffle={autoShuffle}
            setAutoShuffle={setAutoShuffle}
          />

          {loading ? (
            <div className="app-card center" style={{ padding: "40px" }}>
              Loading images...
            </div>
          ) : (
            <CardGrid
              images={images}
              stage={stage}
              autoShuffle={autoShuffle}
              onScoreUpdate={handleScoreUpdate}
              onReset={handleReset}
            />
          )}
        </>
      )}
    </div>
  )
}
