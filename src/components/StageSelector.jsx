"use client"

/**
 * StageSelector: choose difficulty stage (1,2,3)
 * Controlled component - reports selection via onChange.
 */
export default function StageSelector({ stage, setStage }) {
  return (
    <div className="controls">
      <div className="small-muted">Difficulty</div>
      <div style={{ display: "flex", gap: 8 }}>
        <button
          aria-label="Select Easy difficulty - 10 cards"
          onClick={() => setStage(1)}
          className={`btn ${stage === 1 ? "primary" : "secondary"}`}
        >
          Easy
        </button>
        <button
          aria-label="Select Medium difficulty - 20 cards with timer"
          onClick={() => setStage(2)}
          className={`btn ${stage === 2 ? "primary" : "secondary"}`}
        >
          Medium
        </button>
        <button
          aria-label="Select Hard difficulty - 30 cards with timer and auto-shuffle"
          onClick={() => setStage(3)}
          className={`btn ${stage === 3 ? "primary" : "secondary"}`}
        >
          Hard
        </button>
      </div>
      <div style={{ marginLeft: 12 }} className="small-muted">
        <div>Easy: 10 cards - Take your time</div>
        <div>Medium: 20 cards - 7s time limit per click</div>
        <div>Hard: 30 cards - 5s time limit + auto-shuffle</div>
      </div>
    </div>
  )
}
