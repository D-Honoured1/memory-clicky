"use client"

import { useState, useEffect } from "react"

/**
 * Scoreboard shows current score, best score and optionally timer.
 * Features animated score updates and best score celebrations.
 */
export default function Scoreboard({ currentScore, bestScore, timeLeft }) {
  const [displayScore, setDisplayScore] = useState(currentScore)
  const [displayBest, setDisplayBest] = useState(bestScore)
  const [isNewBest, setIsNewBest] = useState(false)
  const [scoreIncreased, setScoreIncreased] = useState(false)

  useEffect(() => {
    if (currentScore !== displayScore) {
      setScoreIncreased(true)
      const increment = currentScore > displayScore ? 1 : -1
      const timer = setInterval(() => {
        setDisplayScore((prev) => {
          const next = prev + increment
          if ((increment > 0 && next >= currentScore) || (increment < 0 && next <= currentScore)) {
            clearInterval(timer)
            setScoreIncreased(false)
            return currentScore
          }
          return next
        })
      }, 50)
      return () => clearInterval(timer)
    }
  }, [currentScore, displayScore])

  useEffect(() => {
    if (bestScore !== displayBest) {
      if (bestScore > displayBest) {
        setIsNewBest(true)
        setTimeout(() => setIsNewBest(false), 2000)
      }
      setDisplayBest(bestScore)
    }
  }, [bestScore, displayBest])

  return (
    <div className="scoreboard app-card" role="region" aria-label="Scoreboard">
      <div className="scoreboard-content">
        <div className="score-section">
          <div className="small-muted">Current Score</div>
          <div className={`score-value ${scoreIncreased ? "score-animate" : ""}`}>{displayScore}</div>
        </div>

        <div className="score-section">
          <div className="small-muted">Best Score</div>
          <div className={`best-score-value ${isNewBest ? "new-best-animate" : ""}`}>
            {displayBest}
            {isNewBest && <span className="celebration">🎉</span>}
          </div>
        </div>

        {typeof timeLeft === "number" && (
          <div className="timer-section">
            <div className="timer" aria-live="polite" title="Time left for this click">
              ⏱ {timeLeft}s
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
