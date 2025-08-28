"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Card from "./Card"
import { shuffle } from "../utils/shuffle"
import { startCountdown } from "../utils/timer"

/**
 * CardGrid
 *
 * Responsibilities:
 *  - display cards
 *  - shuffle on mount and after every click
 *  - manage clicked-set (Mutable via useRef for O(1) checks)
 *  - manage per-click timer (for medium and hard)
 *  - optional auto-shuffle when no clicks (hard stage)
 *
 * Props:
 *  - images: array of card objects {id, name, image}
 *  - stage: 1 | 2 | 3
 *  - onScore (delta) -> called when player gets a point (1)
 *  - onLose -> called when player loses (clicked previously or timer expired)
 *  - resetSignal (number) -> when increments, resets internal round
 *  - setTimeLeft -> function to report remaining time (optional)
 *  - autoShuffleEnabled -> boolean for stage 3 auto shuffle
 *  - gameStarted -> boolean to control if cards are clickable
 */
export default function CardGrid({
  images,
  stage,
  onScore,
  onLose,
  resetSignal,
  setTimeLeft,
  autoShuffleEnabled,
  gameStarted,
}) {
  // clickedSetRef holds ids clicked in the current round; useRef for O(1) checks and no re-renders on mutation
  const clickedSetRef = useRef(new Set())
  // local copy of images (shuffled)
  const [cards, setCards] = useState([])
  // For resetting timers / intervals
  const countdownStopRef = useRef(null)
  const autoShuffleRef = useRef(null)

  // derive cardCount from stage
  const cardCount = useMemo(() => {
    if (stage === 1) return 5
    if (stage === 2) return 10
    return 15
  }, [stage])

  // shuffle when images change (fetch) or when component mounts
  useEffect(() => {
    if (!images) return
    setCards(shuffle(images.slice(0, cardCount)))
    // Clear clicked set on mount or when images change
    clickedSetRef.current.clear()
  }, [images, cardCount])

  // When resetSignal changes (parent requested reset), clear clicked-set and reshuffle
  useEffect(() => {
    clickedSetRef.current.clear()
    setCards((prev) => shuffle(prev))
    // cancel timers
    if (countdownStopRef.current) {
      countdownStopRef.current()
      countdownStopRef.current = null
    }
    // reset visual timer
    setTimeLeft && setTimeLeft(null)
  }, [resetSignal, setTimeLeft])

  // helper to start per-click countdown if stage requires it
  const startPerClickTimer = () => {
    // Clear previous
    if (countdownStopRef.current) {
      countdownStopRef.current()
      countdownStopRef.current = null
    }
    // Stage 1: no timer
    if (stage === 1) {
      setTimeLeft && setTimeLeft(null)
      return
    }
    const duration = stage === 2 ? 7 : 5
    setTimeLeft && setTimeLeft(duration)

    countdownStopRef.current = startCountdown(
      duration,
      (remaining) => {
        // Called each second
        setTimeLeft && setTimeLeft(remaining)
      },
      () => {
        // Timer expired: treat as lose
        clickedSetRef.current.clear()
        setCards((prev) => shuffle(prev))
        onLose && onLose()
        setTimeLeft && setTimeLeft(null)
      },
    )
  }

  // auto-shuffle logic for Hard stage
  useEffect(() => {
    // only for stage 3 and if enabled
    if (stage !== 3 || !autoShuffleEnabled || !gameStarted) return
    // clear previous if any
    if (autoShuffleRef.current) {
      clearInterval(autoShuffleRef.current)
      autoShuffleRef.current = null
    }
    // set auto-shuffle every 6 seconds if user hasn't clicked — we detect by shuffling regardless
    autoShuffleRef.current = setInterval(() => {
      setCards((prev) => shuffle(prev))
    }, 1500)
    return () => {
      if (autoShuffleRef.current) {
        clearInterval(autoShuffleRef.current)
        autoShuffleRef.current = null
      }
    }
  }, [stage, autoShuffleEnabled, gameStarted])

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (countdownStopRef.current) countdownStopRef.current()
      if (autoShuffleRef.current) clearInterval(autoShuffleRef.current)
    }
  }, [])

  // Clear timer when game stops
  useEffect(() => {
    if (!gameStarted) {
      // Clear timer when game stops
      if (countdownStopRef.current) {
        countdownStopRef.current()
        countdownStopRef.current = null
      }
      setTimeLeft && setTimeLeft(null)
    }
  }, [gameStarted, setTimeLeft])

  // Handler when a card is clicked
  const handleCardClick = (item) => {
    if (!gameStarted) return

    // If already clicked in this round -> lose
    if (clickedSetRef.current.has(item.id)) {
      // reset and report lose
      clickedSetRef.current.clear()
      setCards((prev) => shuffle(prev))
      // stop timer
      if (countdownStopRef.current) {
        countdownStopRef.current()
        countdownStopRef.current = null
      }
      setTimeLeft && setTimeLeft(null)
      onLose && onLose()
      return
    }

    // unique click: mark and increment
    clickedSetRef.current.add(item.id)
    onScore && onScore(1)

    if (clickedSetRef.current.size === cardCount) {
      // Player won! Stop timer and don't shuffle
      if (countdownStopRef.current) {
        countdownStopRef.current()
        countdownStopRef.current = null
      }
      setTimeLeft && setTimeLeft(null)
      // Don't call onLose - let the game continue or handle win state in parent
      return
    }

    // shuffle
    setCards((prev) => shuffle(prev))
    // Restart per-click timer
    startPerClickTimer()
  }

  // Render loading placeholder when images not ready
  if (!images) {
    return <div className="app-card small-muted">Loading cards...</div>
  }

  return (
    <section aria-label="Card grid">
      <div className={`card-grid ${!gameStarted ? "disabled" : ""}`} data-cards={cardCount}>
        {cards.map((c, index) => (
          <Card key={`${c.id}-${index}`} image={c} onClick={handleCardClick} />
        ))}
      </div>
    </section>
  )
}
